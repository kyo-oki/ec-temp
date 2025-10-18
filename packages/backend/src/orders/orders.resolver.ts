import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../tenant/guards/tenant.guard';
import { CurrentTenant } from '../tenant/decorators/current-tenant.decorator';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { Order } from './dto/order.dto';
import { OrderItem } from './dto/order-item.dto';
import type { TenantContext } from '../tenant/tenant.service';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private ordersService: OrdersService) {}

  @Mutation(() => Order)
  @UseGuards(TenantGuard)
  async createOrder(
    @Args('input') input: CreateOrderInput,
    @CurrentTenant() tenant: TenantContext,
  ) {
    return this.ordersService.createOrder(tenant.storeId, input);
  }

  @Mutation(() => Order)
  @UseGuards(JwtAuthGuard, TenantGuard)
  async updateOrder(
    @Args('id') id: string,
    @Args('input') input: UpdateOrderInput,
    @CurrentTenant() tenant: TenantContext,
  ) {
    return this.ordersService.updateOrder(id, tenant.storeId, input);
  }

  @Mutation(() => Order)
  @UseGuards(JwtAuthGuard, TenantGuard)
  async deleteOrder(
    @Args('id') id: string,
    @CurrentTenant() tenant: TenantContext,
  ) {
    return this.ordersService.deleteOrder(id, tenant.storeId);
  }

  @Query(() => [Order])
  @UseGuards(JwtAuthGuard, TenantGuard)
  async orders(
    @Args('status', { nullable: true }) status: string,
    @Args('limit', { nullable: true }) limit: number,
    @Args('offset', { nullable: true }) offset: number,
    @CurrentTenant() tenant: TenantContext,
  ) {
    return this.ordersService.getOrders(tenant.storeId, {
      status,
      limit,
      offset,
    });
  }

  @Query(() => Order)
  async order(
    @Args('id') id: string,
    @CurrentTenant() tenant: TenantContext | null,
  ) {
    return this.ordersService.getOrderById(id, tenant?.storeId);
  }

  @Query(() => Order)
  @UseGuards(TenantGuard)
  async orderByNumber(
    @Args('orderNumber') orderNumber: string,
    @CurrentTenant() tenant: TenantContext,
  ) {
    return this.ordersService.getOrderByNumber(orderNumber, tenant.storeId);
  }

  @Mutation(() => OrderItem)
  @UseGuards(JwtAuthGuard, TenantGuard)
  async deleteOrderItem(
    @Args('id') id: string,
    @CurrentTenant() tenant: TenantContext,
  ) {
    return this.ordersService.deleteOrderItem(id, tenant.storeId);
  }
}
