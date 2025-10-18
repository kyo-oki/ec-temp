import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TenantModule } from '../tenant/tenant.module';
import { FAQService } from './faq.service';
import { FAQResolver } from './faq.resolver';

@Module({
  imports: [PrismaModule, TenantModule],
  providers: [FAQService, FAQResolver],
  exports: [FAQService],
})
export class FAQModule {}
