import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaModule } from '../prisma/prisma.module';
import { TenantService } from './tenant.service';
import { TenantInterceptor } from './tenant.interceptor';
import { PrismaTenantMiddleware } from './prisma-tenant.middleware';

@Module({
  imports: [PrismaModule],
  providers: [
    TenantService,
    PrismaTenantMiddleware,
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantInterceptor,
    },
  ],
  exports: [TenantService, PrismaTenantMiddleware],
})
export class TenantModule {}
