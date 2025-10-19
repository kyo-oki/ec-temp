import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { Prisma, OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async getFirstStore() {
    const store = await this.prisma.store.findFirst();
    if (!store) {
      throw new Error('No store found in database');
    }
    return store;
  }

  async createOrder(storeId: string, input: CreateOrderInput) {
    // Validate that all products exist and belong to the store
    const productIds = input.items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
        storeId,
        isActive: true,
      },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException(
        'One or more products not found or inactive',
      );
    }

    // Create a map for quick product lookup
    const productMap = new Map(products.map((p) => [p.id, p]));

    // Validate quantities and calculate total
    let totalAmount = 0;
    for (const item of input.items) {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new BadRequestException(`Product ${item.productId} not found`);
      }

      if (item.quantity <= 0) {
        throw new BadRequestException('Quantity must be greater than 0');
      }

      if (product.stockQuantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}`,
        );
      }

      // Use the product's current price
      const itemTotal = Number(product.price) * item.quantity;
      totalAmount += itemTotal;
    }

    // Generate unique order number
    const orderNumber = await this.generateOrderNumber(storeId);

    // Create order with items in a transaction
    const order = await this.prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          storeId,
          orderNumber,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          deliveryAddress: input.deliveryAddress,
          city: input.city,
          stateRegion: input.stateRegion,
          postcode: input.postcode,
          totalAmount,
        },
      });

      // Create order items
      const orderItems = await Promise.all(
        input.items.map((item) => {
          const product = productMap.get(item.productId)!;
          return tx.orderItem.create({
            data: {
              orderId: newOrder.id,
              productId: item.productId,
              productName: item.productName,
              quantity: item.quantity,
              price: Number(product.price),
              size: item.size,
              color: item.color,
            },
          });
        }),
      );

      // Update product stock quantities
      await Promise.all(
        input.items.map((item) => {
          const product = productMap.get(item.productId)!;
          return tx.product.update({
            where: { id: item.productId },
            data: {
              stockQuantity: product.stockQuantity - item.quantity,
            },
          });
        }),
      );

      return { ...newOrder, items: orderItems };
    });

    return order;
  }

  async updateOrder(orderId: string, storeId: string, input: UpdateOrderInput) {
    // Verify order exists and belongs to store
    const existingOrder = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        storeId,
      },
    });

    if (!existingOrder) {
      throw new NotFoundException('Order not found');
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: input,
      include: {
        items: true,
      },
    });

    return updatedOrder;
  }

  async deleteOrder(orderId: string, storeId: string) {
    // Verify order exists and belongs to store
    const existingOrder = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        storeId,
      },
      include: {
        items: true,
      },
    });

    if (!existingOrder) {
      throw new NotFoundException('Order not found');
    }

    // If order is not cancelled, restore stock quantities
    if (existingOrder.status !== 'CANCELLED') {
      await this.prisma.$transaction(async (tx) => {
        // Restore stock for each item
        await Promise.all(
          existingOrder.items.map((item) =>
            tx.product.update({
              where: { id: item.productId },
              data: {
                stockQuantity: {
                  increment: item.quantity,
                },
              },
            }),
          ),
        );

        // Update order status to cancelled
        await tx.order.update({
          where: { id: orderId },
          data: { status: 'CANCELLED' },
        });
      });
    } else {
      // If already cancelled, just delete
      await this.prisma.order.delete({
        where: { id: orderId },
      });
    }

    return existingOrder;
  }

  async getOrders(
    storeId: string,
    filter: {
      status?: string;
      limit?: number;
      offset?: number;
    } = {},
  ) {
    const where: Prisma.OrderWhereInput = {
      storeId,
    };

    if (filter.status) {
      const validStatuses = [
        'PENDING',
        'PROCESSING',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED',
      ];
      if (validStatuses.includes(filter.status)) {
        where.status = filter.status as OrderStatus;
      }
    }

    const orders = await this.prisma.order.findMany({
      where,
      include: {
        items: true,
      },
      orderBy: { createdAt: 'desc' },
      take: filter.limit || 20,
      skip: filter.offset || 0,
    });

    return orders;
  }

  async getOrderById(orderId: string, storeId?: string) {
    const where: Prisma.OrderWhereUniqueInput = { id: orderId };

    if (storeId) {
      where.storeId = storeId;
    }

    const order = await this.prisma.order.findUnique({
      where,
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async getOrderByNumber(orderNumber: string, storeId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        orderNumber,
        storeId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async deleteOrderItem(itemId: string, storeId: string) {
    // Verify order item exists and belongs to store
    const orderItem = await this.prisma.orderItem.findUnique({
      where: { id: itemId },
      include: {
        order: true,
      },
    });

    if (!orderItem) {
      throw new NotFoundException('Order item not found');
    }

    if (orderItem.order.storeId !== storeId) {
      throw new ForbiddenException(
        'You can only delete items from your own orders',
      );
    }

    // If order is not cancelled, restore stock
    if (orderItem.order.status !== 'CANCELLED') {
      await this.prisma.$transaction(async (tx) => {
        // Restore stock
        await tx.product.update({
          where: { id: orderItem.productId },
          data: {
            stockQuantity: {
              increment: orderItem.quantity,
            },
          },
        });

        // Delete the order item
        await tx.orderItem.delete({
          where: { id: itemId },
        });

        // Recalculate order total
        const remainingItems = await tx.orderItem.findMany({
          where: { orderId: orderItem.orderId },
        });

        const newTotal = remainingItems.reduce(
          (sum, item) => sum + Number(item.price) * item.quantity,
          0,
        );

        await tx.order.update({
          where: { id: orderItem.orderId },
          data: { totalAmount: newTotal },
        });
      });
    } else {
      // If order is cancelled, just delete the item
      await this.prisma.orderItem.delete({
        where: { id: itemId },
      });
    }

    return orderItem;
  }

  private async generateOrderNumber(storeId: string): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

    // Get the count of orders for this store today
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
    );

    const count = await this.prisma.order.count({
      where: {
        storeId,
        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    // Format: YYYYMMDD-XXXX (4 digit sequence)
    const sequence = String(count + 1).padStart(4, '0');
    return `${dateStr}-${sequence}`;
  }
}
