/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateAboutInput } from './dto/update-about.input';
import { About } from './dto/about.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AboutService {
  constructor(private prisma: PrismaService) {}

  async updateAbout(storeId: string, input: UpdateAboutInput): Promise<About> {
    // Check if about page exists for this store
    const existingAbout = await this.prisma.about.findUnique({
      where: { storeId },
    });

    let about;

    if (existingAbout) {
      // Update existing about page
      const updateData: Prisma.AboutUpdateInput = {};

      if (input.philosophy !== undefined) {
        updateData.philosophy = input.philosophy;
      }

      if (input.vision !== undefined) {
        updateData.vision = input.vision;
      }

      if (input.offerings !== undefined) {
        updateData.offerings = JSON.parse(
          input.offerings,
        ) as Prisma.InputJsonValue;
      }

      about = await this.prisma.about.update({
        where: { storeId },
        data: updateData,
      });
    } else {
      // Create new about page
      about = await this.prisma.about.create({
        data: {
          storeId,
          philosophy: input.philosophy || '',
          vision: input.vision || '',
          offerings: input.offerings
            ? (JSON.parse(input.offerings) as Prisma.InputJsonValue)
            : {},
        },
      });
    }

    // Convert offerings back to JSON string for GraphQL
    const aboutResult = about; // Type assertion for Prisma result
    const result: About = {
      id: aboutResult.id,
      philosophy: aboutResult.philosophy,
      vision: aboutResult.vision,
      offerings: JSON.stringify(aboutResult.offerings as Prisma.InputJsonValue),
      storeId: aboutResult.storeId,
      updatedAt: aboutResult.updatedAt,
    };
    return result;
  }

  async getAbout(storeId: string): Promise<About> {
    const about = await this.prisma.about.findUnique({
      where: { storeId },
    });

    if (!about) {
      throw new NotFoundException('About page not found');
    }

    // Convert offerings back to JSON string for GraphQL

    const aboutResult = about as any; // Type assertion for Prisma result
    const result: About = {
      id: aboutResult.id,
      philosophy: aboutResult.philosophy,
      vision: aboutResult.vision,
      offerings: JSON.stringify(aboutResult.offerings as Prisma.InputJsonValue),
      storeId: aboutResult.storeId,
      updatedAt: aboutResult.updatedAt,
    };
    return result;
  }

  async getAboutById(aboutId: string, storeId?: string): Promise<About> {
    const where: Prisma.AboutWhereUniqueInput = { id: aboutId };

    if (storeId) {
      where.storeId = storeId;
    }

    const about = await this.prisma.about.findUnique({
      where,
    });

    if (!about) {
      throw new NotFoundException('About page not found');
    }

    // Convert offerings back to JSON string for GraphQL

    const aboutResult = about as any; // Type assertion for Prisma result
    const result: About = {
      id: aboutResult.id,
      philosophy: aboutResult.philosophy,
      vision: aboutResult.vision,
      offerings: JSON.stringify(aboutResult.offerings as Prisma.InputJsonValue),
      storeId: aboutResult.storeId,
      updatedAt: aboutResult.updatedAt,
    };
    return result;
  }
}
