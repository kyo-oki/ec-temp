import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AboutService } from './about.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../tenant/guards/tenant.guard';
import { CurrentTenant } from '../tenant/decorators/current-tenant.decorator';
import { UpdateAboutInput } from './dto/update-about.input';
import { About } from './dto/about.dto';
import type { TenantContext } from '../tenant/tenant.service';

@Resolver(() => About)
export class AboutResolver {
  constructor(private aboutService: AboutService) {}

  @Mutation(() => About)
  @UseGuards(TenantGuard)
  async updateAbout(
    @Args('input') input: UpdateAboutInput,
    @CurrentTenant() tenant: TenantContext,
  ): Promise<About> {
    return this.aboutService.updateAbout(tenant.storeId, input);
  }

  @Query(() => About)
  @UseGuards(TenantGuard)
  async about(@CurrentTenant() tenant: TenantContext): Promise<About> {
    return this.aboutService.getAbout(tenant.storeId);
  }

  @Query(() => About)
  async aboutById(
    @Args('id') id: string,
    @CurrentTenant() tenant: TenantContext | null,
  ): Promise<About> {
    return this.aboutService.getAboutById(id, tenant?.storeId);
  }
}
