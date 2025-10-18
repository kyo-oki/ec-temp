import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePromotionInput } from './dto/create-promotion.input';
import { UpdatePromotionInput } from './dto/update-promotion.input';
import { PromotionFilterInput } from './dto/promotion-filter.input';
import { Prisma } from '@prisma/client';

@Injectable()
export class PromotionsService {
  constructor(private prisma: PrismaService) {}

  async createPromotion(storeId: string, input: CreatePromotionInput) {
    // Validate date range
    if (input.startDate >= input.endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    const promotion = await this.prisma.promotion.create({
      data: {
        ...input,
        storeId,
      },
    });

    return {
      ...promotion,
      discountPercentage: promotion.discountPercentage.toNumber(),
    };
  }

  async updatePromotion(
    promotionId: string,
    storeId: string,
    input: UpdatePromotionInput,
  ) {
    const existingPromotion = await this.prisma.promotion.findFirst({
      where: {
        id: promotionId,
        storeId,
      },
    });

    if (!existingPromotion) {
      throw new NotFoundException('Promotion not found');
    }

    // Validate date range if both dates are provided
    if (input.startDate && input.endDate && input.startDate >= input.endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    // If only one date is provided, validate against existing date
    if (
      input.startDate &&
      !input.endDate &&
      input.startDate >= existingPromotion.endDate
    ) {
      throw new BadRequestException('Start date must be before end date');
    }

    if (
      input.endDate &&
      !input.startDate &&
      existingPromotion.startDate >= input.endDate
    ) {
      throw new BadRequestException('Start date must be before end date');
    }

    const updatedPromotion = await this.prisma.promotion.update({
      where: { id: promotionId },
      data: input,
    });

    return {
      ...updatedPromotion,
      discountPercentage: updatedPromotion.discountPercentage.toNumber(),
    };
  }

  async deletePromotion(promotionId: string, storeId: string) {
    const existingPromotion = await this.prisma.promotion.findFirst({
      where: {
        id: promotionId,
        storeId,
      },
    });

    if (!existingPromotion) {
      throw new NotFoundException('Promotion not found');
    }

    await this.prisma.promotion.delete({
      where: { id: promotionId },
    });

    return {
      ...existingPromotion,
      discountPercentage: existingPromotion.discountPercentage.toNumber(),
    };
  }

  async getPromotions(storeId: string, filter: PromotionFilterInput = {}) {
    const where: Prisma.PromotionWhereInput = {
      storeId,
    };

    if (filter.isActive !== undefined) {
      where.isActive = filter.isActive;
    }

    if (filter.isCurrentlyActive) {
      const now = new Date();
      where.startDate = { lte: now };
      where.endDate = { gte: now };
      where.isActive = true;
    }

    if (filter.search) {
      where.OR = [
        { title: { contains: filter.search, mode: 'insensitive' } },
        { description: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    const promotions = await this.prisma.promotion.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return promotions.map((promotion) => ({
      ...promotion,
      discountPercentage: promotion.discountPercentage.toNumber(),
    }));
  }

  async getPromotionById(promotionId: string, storeId?: string) {
    const where: Prisma.PromotionWhereUniqueInput = { id: promotionId };

    if (storeId) {
      where.storeId = storeId;
    }

    const promotion = await this.prisma.promotion.findUnique({
      where,
    });

    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }

    return {
      ...promotion,
      discountPercentage: promotion.discountPercentage.toNumber(),
    };
  }

  async getActivePromotions(storeId: string) {
    const now = new Date();

    const promotions = await this.prisma.promotion.findMany({
      where: {
        storeId,
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: { createdAt: 'desc' },
    });

    return promotions.map((promotion) => ({
      ...promotion,
      discountPercentage: promotion.discountPercentage.toNumber(),
    }));
  }

  async getUpcomingPromotions(storeId: string) {
    const now = new Date();

    const promotions = await this.prisma.promotion.findMany({
      where: {
        storeId,
        isActive: true,
        startDate: { gt: now },
      },
      orderBy: { startDate: 'asc' },
    });

    return promotions.map((promotion) => ({
      ...promotion,
      discountPercentage: promotion.discountPercentage.toNumber(),
    }));
  }

  async getExpiredPromotions(storeId: string) {
    const now = new Date();

    const promotions = await this.prisma.promotion.findMany({
      where: {
        storeId,
        endDate: { lt: now },
      },
      orderBy: { endDate: 'desc' },
    });

    return promotions.map((promotion) => ({
      ...promotion,
      discountPercentage: promotion.discountPercentage.toNumber(),
    }));
  }
}
