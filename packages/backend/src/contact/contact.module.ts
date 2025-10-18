import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TenantModule } from '../tenant/tenant.module';
import { ContactService } from './contact.service';
import { ContactResolver } from './contact.resolver';

@Module({
  imports: [PrismaModule, TenantModule],
  providers: [ContactService, ContactResolver],
  exports: [ContactService],
})
export class ContactModule {}
