import { Resolver, Mutation, Query, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../tenant/guards/tenant.guard';
import { CurrentTenant } from '../tenant/decorators/current-tenant.decorator';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { ProductFilterInput } from './dto/product-filter.input';
import { CreateReviewInput } from './dto/create-review.input';
import { Product } from './dto/product.dto';
import { Review } from './dto/review.dto';
import type { TenantContext } from '../tenant/tenant.service';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private productsService: ProductsService) {}

  @Mutation(() => Product)
  // @UseGuards(TenantGuard)
  async createProduct(
    @Args('input') input: CreateProductInput,
    // @CurrentTenant() tenant: TenantContext,
  ) {
    // For development, get the first store from the database
    const store = await this.productsService.getFirstStore();
    return this.productsService.createProduct(store.id, input);
  }

  @Mutation(() => Product)
  @UseGuards(TenantGuard)
  async updateProduct(
    @Args('id') id: string,
    @Args('input') input: UpdateProductInput,
    @CurrentTenant() tenant: TenantContext,
  ) {
    return this.productsService.updateProduct(id, tenant.storeId, input);
  }

  @Mutation(() => Product)
  @UseGuards(TenantGuard)
  async deleteProduct(
    @Args('id') id: string,
    @CurrentTenant() tenant: TenantContext,
  ) {
    return this.productsService.deleteProduct(id, tenant.storeId);
  }

  @Query(() => [Product])
  // @UseGuards(TenantGuard)
  async products(
    @Args('filter', { nullable: true }) filter: ProductFilterInput,
    // @CurrentTenant() tenant: TenantContext,
  ) {
    // For development, get the first store from the database
    const store = await this.productsService.getFirstStore();
    return this.productsService.getProducts(store.id, filter);
  }

  @Query(() => Product)
  async product(
    @Args('id') id: string,
    @CurrentTenant() tenant: TenantContext | null,
  ) {
    return this.productsService.getProductById(id, tenant?.storeId);
  }

  @Mutation(() => Review)
  async createReview(@Args('input') input: CreateReviewInput) {
    return this.productsService.createReview(input);
  }

  @Mutation(() => Review)
  @UseGuards(TenantGuard)
  async approveReview(
    @Args('id') id: string,
    @CurrentTenant() tenant: TenantContext,
  ) {
    return this.productsService.approveReview(id, tenant.storeId);
  }

  @Mutation(() => Review)
  @UseGuards(TenantGuard)
  async deleteReview(
    @Args('id') id: string,
    @CurrentTenant() tenant: TenantContext,
  ) {
    return this.productsService.deleteReview(id, tenant.storeId);
  }

  @Query(() => [Review])
  async productReviews(
    @Args('productId') productId: string,
    @CurrentTenant() tenant: TenantContext | null,
  ) {
    return this.productsService.getProductReviews(productId, tenant?.storeId);
  }

  @Query(() => [Review])
  async featuredReviews(
    @Args('limit', { type: () => Int, defaultValue: 3 }) limit: number,
    @CurrentTenant() tenant: TenantContext | null,
  ) {
    return this.productsService.getFeaturedReviews(limit, tenant?.storeId);
  }
}
