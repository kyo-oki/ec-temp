import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../tenant/guards/tenant.guard';
import { CurrentTenant } from '../tenant/decorators/current-tenant.decorator';
import { CreateContactInput } from './dto/create-contact.input';
import { Contact } from './dto/contact.dto';
import type { TenantContext } from '../tenant/tenant.service';

@Resolver(() => Contact)
export class ContactResolver {
  constructor(private contactService: ContactService) {}

  @Mutation(() => Contact)
  @UseGuards(TenantGuard)
  async createContact(
    @Args('input') input: CreateContactInput,
    @CurrentTenant() tenant: TenantContext,
  ): Promise<Contact> {
    return this.contactService.createContact(tenant.storeId, input);
  }

  @Query(() => [Contact])
  @UseGuards(TenantGuard)
  async contacts(
    @Args('isRead', { nullable: true }) isRead: boolean,
    @CurrentTenant() tenant: TenantContext,
  ): Promise<Contact[]> {
    return this.contactService.getContacts(tenant.storeId, { isRead });
  }

  @Query(() => Contact)
  @UseGuards(TenantGuard)
  async contact(
    @Args('id') id: string,
    @CurrentTenant() tenant: TenantContext,
  ): Promise<Contact> {
    return this.contactService.getContactById(id, tenant.storeId);
  }

  @Mutation(() => Contact)
  @UseGuards(TenantGuard)
  async markContactAsRead(
    @Args('id') id: string,
    @CurrentTenant() tenant: TenantContext,
  ): Promise<Contact> {
    return this.contactService.markContactAsRead(id, tenant.storeId);
  }

  @Mutation(() => Contact)
  @UseGuards(TenantGuard)
  async markContactAsUnread(
    @Args('id') id: string,
    @CurrentTenant() tenant: TenantContext,
  ): Promise<Contact> {
    return this.contactService.markContactAsUnread(id, tenant.storeId);
  }

  @Mutation(() => Contact)
  @UseGuards(TenantGuard)
  async deleteContact(
    @Args('id') id: string,
    @CurrentTenant() tenant: TenantContext,
  ): Promise<Contact> {
    return this.contactService.deleteContact(id, tenant.storeId);
  }

  @Query(() => String)
  @UseGuards(TenantGuard)
  async contactStats(@CurrentTenant() tenant: TenantContext) {
    const stats = await this.contactService.getContactStats(tenant.storeId);
    return JSON.stringify(stats);
  }
}
