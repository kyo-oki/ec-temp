import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TenantModule } from '../tenant/tenant.module';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';

@Module({
  imports: [PrismaModule, TenantModule],
  providers: [ProductsService, ProductsResolver],
  exports: [ProductsService],
})
export class ProductsModule {}
