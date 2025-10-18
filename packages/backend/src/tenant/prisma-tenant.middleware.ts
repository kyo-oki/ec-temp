import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TenantContext } from './tenant.service';

@Injectable()
export class PrismaTenantMiddleware {
  constructor(private prisma: PrismaService) {}

  // This will be used to wrap Prisma calls with tenant filtering
  withTenantFilter<T>(
    tenant: TenantContext | null,
    operation: () => Promise<T>,
  ): Promise<T> {
    if (!tenant) {
      return operation();
    }

    // For now, we'll rely on services to manually add tenant filtering
    // This is a placeholder for future automatic tenant filtering
    return operation();
  }

  // Helper method to add storeId to where clauses
  addTenantFilter(tenant: TenantContext | null, where: any = {}): any {
    if (!tenant) {
      return where;
    }

    return {
      ...where,
      storeId: tenant.storeId,
    };
  }
}
