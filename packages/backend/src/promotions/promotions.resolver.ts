import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../tenant/guards/tenant.guard';
import { CurrentTenant } from '../tenant/decorators/current-tenant.decorator';
import { CreatePromotionInput } from './dto/create-promotion.input';
import { UpdatePromotionInput } from './dto/update-promotion.input';
import { PromotionFilterInput } from './dto/promotion-filter.input';
import { Promotion } from './dto/promotion.dto';
import type { TenantContext } from '../tenant/tenant.service';

@Resolver(() => Promotion)
export class PromotionsResolver {
  constructor(private promotionsService: PromotionsService) {}

  @Mutation(() => Promotion)
  @UseGuards(TenantGuard)
  async createPromotion(
    @Args('input') input: CreatePromotionInput,
    @CurrentTenant() tenant: TenantContext,
  ): Promise<Promotion> {
    return this.promotionsService.createPromotion(tenant.storeId, input);
  }

  @Mutation(() => Promotion)
  @UseGuards(TenantGuard)
  async updatePromotion(
    @Args('id') id: string,
    @Args('input') input: UpdatePromotionInput,
    @CurrentTenant() tenant: TenantContext,
  ): Promise<Promotion> {
    return this.promotionsService.updatePromotion(id, tenant.storeId, input);
  }

  @Mutation(() => Promotion)
  @UseGuards(TenantGuard)
  async deletePromotion(
    @Args('id') id: string,
    @CurrentTenant() tenant: TenantContext,
  ): Promise<Promotion> {
    return this.promotionsService.deletePromotion(id, tenant.storeId);
  }

  @Query(() => [Promotion])
  @UseGuards(TenantGuard)
  async promotions(
    @Args('filter', { nullable: true }) filter: PromotionFilterInput,
    @CurrentTenant() tenant: TenantContext,
  ): Promise<Promotion[]> {
    return this.promotionsService.getPromotions(tenant.storeId, filter);
  }

  @Query(() => [Promotion])
  @UseGuards(TenantGuard)
  async activePromotions(
    @CurrentTenant() tenant: TenantContext,
  ): Promise<Promotion[]> {
    return this.promotionsService.getActivePromotions(tenant.storeId);
  }

  @Query(() => [Promotion])
  @UseGuards(TenantGuard)
  async upcomingPromotions(
    @CurrentTenant() tenant: TenantContext,
  ): Promise<Promotion[]> {
    return this.promotionsService.getUpcomingPromotions(tenant.storeId);
  }

  @Query(() => [Promotion])
  @UseGuards(TenantGuard)
  async expiredPromotions(
    @CurrentTenant() tenant: TenantContext,
  ): Promise<Promotion[]> {
    return this.promotionsService.getExpiredPromotions(tenant.storeId);
  }

  @Query(() => Promotion)
  async promotion(
    @Args('id') id: string,
    @CurrentTenant() tenant: TenantContext | null,
  ): Promise<Promotion> {
    return this.promotionsService.getPromotionById(id, tenant?.storeId);
  }
}
