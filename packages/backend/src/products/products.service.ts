import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { ProductFilterInput } from './dto/product-filter.input';
import { CreateReviewInput } from './dto/create-review.input';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async createProduct(storeId: string, input: CreateProductInput) {
    const product = await this.prisma.product.create({
      data: {
        ...input,
        storeId,
      },
    });

    return product;
  }

  async updateProduct(
    productId: string,
    storeId: string,
    input: UpdateProductInput,
  ) {
    // Verify product exists and belongs to store
    const existingProduct = await this.prisma.product.findFirst({
      where: {
        id: productId,
        storeId,
      },
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id: productId },
      data: input,
    });

    return updatedProduct;
  }

  async deleteProduct(productId: string, storeId: string) {
    // Verify product exists and belongs to store
    const existingProduct = await this.prisma.product.findFirst({
      where: {
        id: productId,
        storeId,
      },
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    // Delete associated reviews first
    await this.prisma.review.deleteMany({
      where: { productId },
    });

    // Delete the product
    await this.prisma.product.delete({
      where: { id: productId },
    });

    return existingProduct;
  }

  async getProducts(storeId: string, filter: ProductFilterInput = {}) {
    const where: Prisma.ProductWhereInput = {
      storeId,
    };

    // Apply filters
    if (filter.search) {
      where.OR = [
        { name: { contains: filter.search, mode: 'insensitive' } },
        { description: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    if (filter.category) {
      where.category = filter.category;
    }

    if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
      where.price = {};
      if (filter.minPrice !== undefined) {
        where.price.gte = filter.minPrice;
      }
      if (filter.maxPrice !== undefined) {
        where.price.lte = filter.maxPrice;
      }
    }

    // Note: Rating filtering would require calculating average ratings from reviews
    // For now, we'll skip this filter

    if (filter.availableSizes && filter.availableSizes.length > 0) {
      where.availableSizes = { hasSome: filter.availableSizes };
    }

    if (filter.availableColors && filter.availableColors.length > 0) {
      where.availableColors = { hasSome: filter.availableColors };
    }

    if (filter.isActive !== undefined) {
      where.isActive = filter.isActive;
    }

    // Build orderBy
    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    if (filter.sortBy) {
      switch (filter.sortBy) {
        case 'price':
          orderBy.price = filter.sortOrder === 'desc' ? 'desc' : 'asc';
          break;
        case 'name':
          orderBy.name = filter.sortOrder === 'desc' ? 'desc' : 'asc';
          break;
        // Note: Rating sorting would require calculating average ratings from reviews
        // For now, we'll skip this sort option
        case 'createdAt':
          orderBy.createdAt = filter.sortOrder === 'desc' ? 'desc' : 'asc';
          break;
        default:
          orderBy.createdAt = 'desc';
      }
    } else {
      orderBy.createdAt = 'desc';
    }

    const products = await this.prisma.product.findMany({
      where,
      orderBy,
      take: filter.limit || 20,
      skip: filter.offset || 0,
      include: {
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return products;
  }

  async getProductById(productId: string, storeId?: string) {
    const where: Prisma.ProductWhereUniqueInput = { id: productId };

    if (storeId) {
      where.storeId = storeId;
    }

    const product = await this.prisma.product.findUnique({
      where,
      include: {
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async createReview(input: CreateReviewInput) {
    // Verify product exists
    const product = await this.prisma.product.findUnique({
      where: { id: input.productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const review = await this.prisma.review.create({
      data: {
        ...input,
        isApproved: false,
      },
    });

    // Update product rating
    this.updateProductRating(input.productId);

    return review;
  }

  async approveReview(reviewId: string, storeId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: { product: true },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.product.storeId !== storeId) {
      throw new ForbiddenException(
        'You can only approve reviews for your own products',
      );
    }

    const updatedReview = await this.prisma.review.update({
      where: { id: reviewId },
      data: { isApproved: true },
    });

    // Update product rating
    this.updateProductRating(review.productId);

    return updatedReview;
  }

  async deleteReview(reviewId: string, storeId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: { product: true },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.product.storeId !== storeId) {
      throw new ForbiddenException(
        'You can only delete reviews for your own products',
      );
    }

    await this.prisma.review.delete({
      where: { id: reviewId },
    });

    // Update product rating
    this.updateProductRating(review.productId);

    return review;
  }

  async getProductReviews(productId: string, storeId?: string) {
    const where: Prisma.ReviewWhereInput = { productId };

    if (storeId) {
      // If storeId provided, only show approved reviews
      where.isApproved = true;
    }

    const reviews = await this.prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return reviews;
  }

  private updateProductRating(productId: string) {
    // Note: Since the Product model doesn't have averageRating and reviewCount fields,
    // we'll skip updating these values for now
    // In a real implementation, you might want to add these fields to the schema
    console.log(`Updating rating for product ${productId}`);
  }
}
