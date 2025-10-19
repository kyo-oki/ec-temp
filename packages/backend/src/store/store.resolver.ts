import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { StoreService } from './store.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CurrentTenant } from '../tenant/decorators/current-tenant.decorator';
import { TenantGuard } from '../tenant/guards/tenant.guard';
import { CreateStoreInput } from './dto/create-store.input';
import { UpdateStoreInput } from './dto/update-store.input';
import { Store } from './dto/store.dto';
import { SlugAvailability } from './dto/slug-availability.dto';
import { SubdomainAvailability } from './dto/subdomain-availability.dto';
import { DomainVerification } from './dto/domain-verification.dto';
import type { TenantContext } from '../tenant/tenant.service';

@Resolver(() => Store)
export class StoreResolver {
  constructor(private storeService: StoreService) {}

  @Mutation(() => Store)
  // @UseGuards(JwtAuthGuard)
  async createStore(
    @Args('input') input: CreateStoreInput,
    // @CurrentUser() user: { userId: string; email: string; name: string },
  ) {
    // Get the first user from the database as a test
    const user = await this.storeService.getFirstUser();
    return this.storeService.createStore(user.id, input);
  }

  @Mutation(() => Store)
  // @UseGuards(JwtAuthGuard)
  async updateStore(
    @Args('input') input: UpdateStoreInput,
    // @CurrentUser() user: { userId: string; email: string; name: string },
  ) {
    // Temporarily get the first user from the database
    const user = await this.storeService.getFirstUser();
    return this.storeService.updateStore(input.id, user.id, input);
  }

  @Mutation(() => String)
  // @UseGuards(JwtAuthGuard)
  async deleteStore(
    @Args('storeId') storeId: string,
    @CurrentUser() user: { userId: string; email: string; name: string },
  ) {
    await this.storeService.deleteStore(storeId, user.userId);
    return 'Store deleted successfully';
  }

  @Query(() => [Store])
  // @UseGuards(JwtAuthGuard)
  async myStores() {
    // @CurrentUser() user: { userId: string; email: string; name: string },
    // Temporarily get stores for the first user in the database
    const user = await this.storeService.getFirstUser();
    return this.storeService.getMyStores(user.id);
  }

  @Query(() => Store)
  async store(@Args('slug') slug: string) {
    return this.storeService.getStoreBySlug(slug);
  }

  @Query(() => Store)
  async storeById(@Args('id') id: string) {
    return this.storeService.getStoreById(id);
  }

  @Query(() => Store)
  @UseGuards(TenantGuard)
  async currentStore(@CurrentTenant() tenant: TenantContext) {
    return this.storeService.getStoreById(tenant.storeId);
  }

  @Query(() => SlugAvailability)
  async verifySlugAvailability(@Args('slug') slug: string) {
    return this.storeService.verifySlugAvailability(slug);
  }

  @Query(() => SubdomainAvailability)
  async verifySubdomainAvailability(@Args('subdomain') subdomain: string) {
    return this.storeService.verifySubdomainAvailability(subdomain);
  }

  @Mutation(() => Store)
  // @UseGuards(JwtAuthGuard)
  async addCustomDomain(
    @Args('storeId') storeId: string,
    @Args('customDomain') customDomain: string,
    @CurrentUser() user: { userId: string; email: string; name: string },
  ) {
    return this.storeService.addCustomDomain(
      storeId,
      user.userId,
      customDomain,
    );
  }

  @Mutation(() => DomainVerification)
  // @UseGuards(JwtAuthGuard)
  async verifyCustomDomain(
    @Args('storeId') storeId: string,
    @CurrentUser() user: { userId: string; email: string; name: string },
  ) {
    return this.storeService.verifyCustomDomain(storeId, user.userId);
  }

  @Mutation(() => Store)
  // @UseGuards(JwtAuthGuard)
  async removeCustomDomain(
    @Args('storeId') storeId: string,
    @CurrentUser() user: { userId: string; email: string; name: string },
  ) {
    return this.storeService.removeCustomDomain(storeId, user.userId);
  }
}
