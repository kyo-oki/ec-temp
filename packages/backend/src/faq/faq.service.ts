import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFAQInput } from './dto/create-faq.input';
import { UpdateFAQInput } from './dto/update-faq.input';
import { Prisma } from '@prisma/client';

@Injectable()
export class FAQService {
  constructor(private prisma: PrismaService) {}

  async createFAQ(storeId: string, input: CreateFAQInput) {
    const faq = await this.prisma.fAQ.create({
      data: {
        ...input,
        storeId,
      },
    });

    return faq;
  }

  async updateFAQ(faqId: string, storeId: string, input: UpdateFAQInput) {
    // Verify FAQ exists and belongs to store
    const existingFAQ = await this.prisma.fAQ.findFirst({
      where: {
        id: faqId,
        storeId,
      },
    });

    if (!existingFAQ) {
      throw new NotFoundException('FAQ not found');
    }

    const updatedFAQ = await this.prisma.fAQ.update({
      where: { id: faqId },
      data: input,
    });

    return updatedFAQ;
  }

  async deleteFAQ(faqId: string, storeId: string) {
    // Verify FAQ exists and belongs to store
    const existingFAQ = await this.prisma.fAQ.findFirst({
      where: {
        id: faqId,
        storeId,
      },
    });

    if (!existingFAQ) {
      throw new NotFoundException('FAQ not found');
    }

    await this.prisma.fAQ.delete({
      where: { id: faqId },
    });

    return existingFAQ;
  }

  async getFAQs(storeId: string) {
    const faqs = await this.prisma.fAQ.findMany({
      where: { storeId },
      orderBy: { displayOrder: 'asc' },
    });

    return faqs;
  }

  async getFAQById(faqId: string, storeId?: string) {
    const where: Prisma.FAQWhereUniqueInput = { id: faqId };

    if (storeId) {
      where.storeId = storeId;
    }

    const faq = await this.prisma.fAQ.findUnique({
      where,
    });

    if (!faq) {
      throw new NotFoundException('FAQ not found');
    }

    return faq;
  }

  async reorderFAQs(storeId: string, faqIds: string[]) {
    // Update display order for each FAQ
    const updatePromises = faqIds.map((faqId, index) =>
      this.prisma.fAQ.updateMany({
        where: {
          id: faqId,
          storeId,
        },
        data: {
          displayOrder: index,
        },
      }),
    );

    await Promise.all(updatePromises);

    // Return updated FAQs in new order
    return this.getFAQs(storeId);
  }
}
