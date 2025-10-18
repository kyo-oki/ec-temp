import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { FAQService } from './faq.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../tenant/guards/tenant.guard';
import { CurrentTenant } from '../tenant/decorators/current-tenant.decorator';
import { CreateFAQInput } from './dto/create-faq.input';
import { UpdateFAQInput } from './dto/update-faq.input';
import { FAQ } from './dto/faq.dto';
import type { TenantContext } from '../tenant/tenant.service';

@Resolver(() => FAQ)
export class FAQResolver {
  constructor(private faqService: FAQService) {}

  @Mutation(() => FAQ)
  @UseGuards(JwtAuthGuard, TenantGuard)
  async createFAQ(
    @Args('input') input: CreateFAQInput,
    @CurrentTenant() tenant: TenantContext,
  ) {
    return this.faqService.createFAQ(tenant.storeId, input);
  }

  @Mutation(() => FAQ)
  @UseGuards(JwtAuthGuard, TenantGuard)
  async updateFAQ(
    @Args('id') id: string,
    @Args('input') input: UpdateFAQInput,
    @CurrentTenant() tenant: TenantContext,
  ) {
    return this.faqService.updateFAQ(id, tenant.storeId, input);
  }

  @Mutation(() => FAQ)
  @UseGuards(JwtAuthGuard, TenantGuard)
  async deleteFAQ(
    @Args('id') id: string,
    @CurrentTenant() tenant: TenantContext,
  ) {
    return this.faqService.deleteFAQ(id, tenant.storeId);
  }

  @Query(() => [FAQ])
  @UseGuards(TenantGuard)
  async faqs(@CurrentTenant() tenant: TenantContext) {
    return this.faqService.getFAQs(tenant.storeId);
  }

  @Query(() => FAQ)
  async faq(
    @Args('id') id: string,
    @CurrentTenant() tenant: TenantContext | null,
  ) {
    return this.faqService.getFAQById(id, tenant?.storeId);
  }

  @Mutation(() => [FAQ])
  @UseGuards(JwtAuthGuard, TenantGuard)
  async reorderFAQs(
    @Args('faqIds', { type: () => [String] }) faqIds: string[],
    @CurrentTenant() tenant: TenantContext,
  ) {
    return this.faqService.reorderFAQs(tenant.storeId, faqIds);
  }
}
