import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  async createStore(
    ownerId: string,
    input: {
      name: string;
      slug: string;
      subdomain: string;
      settings?: string;
    },
  ) {
    // Check if slug is already taken
    const existingSlug = await this.prisma.store.findUnique({
      where: { slug: input.slug },
    });

    if (existingSlug) {
      throw new ConflictException('Store slug already exists');
    }

    // Check if subdomain is already taken
    const existingSubdomain = await this.prisma.store.findUnique({
      where: { subdomain: input.subdomain },
    });

    if (existingSubdomain) {
      throw new ConflictException('Subdomain already exists');
    }

    // Create store
    const store = await this.prisma.store.create({
      data: {
        name: input.name,
        slug: input.slug,
        subdomain: input.subdomain,
        ownerId,
        settings: input.settings
          ? (JSON.parse(input.settings) as Prisma.InputJsonValue)
          : {},
      },
    });

    return store;
  }

  async updateStore(
    storeId: string,
    ownerId: string,
    input: {
      name?: string;
      settings?: string;
      customDomain?: string;
      customDomainVerified?: boolean;
    },
  ) {
    // Check if store exists and user owns it
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    if (store.ownerId !== ownerId) {
      throw new ForbiddenException('You do not own this store');
    }

    // Update store
    const updatedStore = await this.prisma.store.update({
      where: { id: storeId },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.settings && {
          settings: JSON.parse(input.settings) as Prisma.InputJsonValue,
        }),
        ...(input.customDomain !== undefined && {
          customDomain: input.customDomain,
        }),
        ...(input.customDomainVerified !== undefined && {
          customDomainVerified: input.customDomainVerified,
        }),
      },
    });

    return updatedStore;
  }

  async deleteStore(storeId: string, ownerId: string) {
    // Check if store exists and user owns it
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    if (store.ownerId !== ownerId) {
      throw new ForbiddenException('You do not own this store');
    }

    // Delete store (cascade delete will handle related records)
    await this.prisma.store.delete({
      where: { id: storeId },
    });

    return { success: true };
  }

  async getMyStores(ownerId: string) {
    const stores = await this.prisma.store.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
    });

    return stores;
  }

  async getStoreBySlug(slug: string) {
    const store = await this.prisma.store.findUnique({
      where: { slug },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    return store;
  }

  async getStoreById(storeId: string) {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    return store;
  }

  async verifySlugAvailability(slug: string) {
    const existingStore = await this.prisma.store.findUnique({
      where: { slug },
    });

    return {
      available: !existingStore,
      slug,
    };
  }

  async verifySubdomainAvailability(subdomain: string) {
    const existingStore = await this.prisma.store.findUnique({
      where: { subdomain },
    });

    return {
      available: !existingStore,
      subdomain,
    };
  }

  async addCustomDomain(
    storeId: string,
    ownerId: string,
    customDomain: string,
  ) {
    // Check if store exists and user owns it
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    if (store.ownerId !== ownerId) {
      throw new ForbiddenException('You do not own this store');
    }

    // Check if custom domain is already taken
    const existingDomain = await this.prisma.store.findUnique({
      where: { customDomain },
    });

    if (existingDomain) {
      throw new ConflictException('Custom domain already in use');
    }

    // Update store with custom domain
    const updatedStore = await this.prisma.store.update({
      where: { id: storeId },
      data: {
        customDomain,
        customDomainVerified: false, // Will need DNS verification
      },
    });

    return updatedStore;
  }

  async verifyCustomDomain(storeId: string, ownerId: string) {
    // Check if store exists and user owns it
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    if (store.ownerId !== ownerId) {
      throw new ForbiddenException('You do not own this store');
    }

    if (!store.customDomain) {
      throw new NotFoundException('No custom domain set for this store');
    }

    // TODO: Implement actual DNS verification logic
    // For now, we'll simulate verification
    const isVerified = Math.random() > 0.5; // Random for demo

    const updatedStore = await this.prisma.store.update({
      where: { id: storeId },
      data: {
        customDomainVerified: isVerified,
      },
    });

    return {
      domain: store.customDomain,
      verified: isVerified,
      store: updatedStore,
    };
  }

  async removeCustomDomain(storeId: string, ownerId: string) {
    // Check if store exists and user owns it
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    if (store.ownerId !== ownerId) {
      throw new ForbiddenException('You do not own this store');
    }

    // Remove custom domain
    const updatedStore = await this.prisma.store.update({
      where: { id: storeId },
      data: {
        customDomain: null,
        customDomainVerified: false,
      },
    });

    return updatedStore;
  }
}
