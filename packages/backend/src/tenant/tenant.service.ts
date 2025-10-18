import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface TenantContext {
  storeId: string;
  storeSlug: string;
  subdomain: string;
  customDomain?: string;
}

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}

  async resolveTenantFromHost(host: string): Promise<TenantContext | null> {
    // Remove port if present
    const cleanHost = host.split(':')[0];

    // Check if it's a subdomain (e.g., mystore.localhost)
    if (cleanHost.includes('.')) {
      const subdomain = cleanHost.split('.')[0];

      // Skip if it's a reserved subdomain
      if (this.isReservedSubdomain(subdomain)) {
        return null;
      }

      // Find store by subdomain
      const store = await this.prisma.store.findUnique({
        where: { subdomain },
        select: {
          id: true,
          slug: true,
          subdomain: true,
          customDomain: true,
        },
      });

      if (store) {
        return {
          storeId: store.id,
          storeSlug: store.slug,
          subdomain: store.subdomain,
          customDomain: store.customDomain || undefined,
        };
      }
    }

    // Check if it's a custom domain
    const store = await this.prisma.store.findFirst({
      where: {
        customDomain: cleanHost,
        customDomainVerified: true,
      },
      select: {
        id: true,
        slug: true,
        subdomain: true,
        customDomain: true,
      },
    });

    if (store) {
      return {
        storeId: store.id,
        storeSlug: store.slug,
        subdomain: store.subdomain,
        customDomain: store.customDomain || undefined,
      };
    }

    return null;
  }

  private isReservedSubdomain(subdomain: string): boolean {
    const reserved = [
      'www',
      'api',
      'admin',
      'app',
      'mail',
      'ftp',
      'blog',
      'shop',
      'store',
      'support',
      'help',
      'docs',
      'status',
      'dev',
      'staging',
      'test',
      'demo',
    ];
    return reserved.includes(subdomain.toLowerCase());
  }
}
