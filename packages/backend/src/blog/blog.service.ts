import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogPostInput } from './dto/create-blog-post.input';
import { UpdateBlogPostInput } from './dto/update-blog-post.input';
import { BlogFilterInput } from './dto/blog-filter.input';
import { Prisma } from '@prisma/client';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async createBlogPost(storeId: string, input: CreateBlogPostInput) {
    const blogPost = await this.prisma.blogPost.create({
      data: {
        ...input,
        storeId,
      },
    });

    return blogPost;
  }

  async updateBlogPost(
    blogPostId: string,
    storeId: string,
    input: UpdateBlogPostInput,
  ) {
    // Verify blog post exists and belongs to store
    const existingBlogPost = await this.prisma.blogPost.findFirst({
      where: {
        id: blogPostId,
        storeId,
      },
    });

    if (!existingBlogPost) {
      throw new NotFoundException('Blog post not found');
    }

    const updatedBlogPost = await this.prisma.blogPost.update({
      where: { id: blogPostId },
      data: input,
    });

    return updatedBlogPost;
  }

  async deleteBlogPost(blogPostId: string, storeId: string) {
    // Verify blog post exists and belongs to store
    const existingBlogPost = await this.prisma.blogPost.findFirst({
      where: {
        id: blogPostId,
        storeId,
      },
    });

    if (!existingBlogPost) {
      throw new NotFoundException('Blog post not found');
    }

    await this.prisma.blogPost.delete({
      where: { id: blogPostId },
    });

    return existingBlogPost;
  }

  async getBlogPosts(storeId: string, filter: BlogFilterInput = {}) {
    const where: Prisma.BlogPostWhereInput = {
      storeId,
    };

    // Apply filters
    if (filter.search) {
      where.OR = [
        { title: { contains: filter.search, mode: 'insensitive' } },
        { description: { contains: filter.search, mode: 'insensitive' } },
        { content: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    if (filter.category) {
      where.category = filter.category;
    }

    if (filter.isPublished !== undefined) {
      where.isPublished = filter.isPublished;
    }

    // Build orderBy
    const orderBy: Prisma.BlogPostOrderByWithRelationInput = {};
    if (filter.sortBy) {
      switch (filter.sortBy) {
        case 'title':
          orderBy.title = filter.sortOrder === 'desc' ? 'desc' : 'asc';
          break;
        case 'category':
          orderBy.category = filter.sortOrder === 'desc' ? 'desc' : 'asc';
          break;
        case 'isPublished':
          orderBy.isPublished = filter.sortOrder === 'desc' ? 'desc' : 'asc';
          break;
        case 'updatedAt':
          orderBy.updatedAt = filter.sortOrder === 'desc' ? 'desc' : 'asc';
          break;
        default:
          orderBy.createdAt = 'desc';
      }
    } else {
      orderBy.createdAt = 'desc';
    }

    const blogPosts = await this.prisma.blogPost.findMany({
      where,
      orderBy,
      take: filter.limit || 20,
      skip: filter.offset || 0,
    });

    return blogPosts;
  }

  async getBlogPostById(blogPostId: string, storeId?: string) {
    const where: Prisma.BlogPostWhereUniqueInput = { id: blogPostId };

    if (storeId) {
      where.storeId = storeId;
    }

    const blogPost = await this.prisma.blogPost.findUnique({
      where,
    });

    if (!blogPost) {
      throw new NotFoundException('Blog post not found');
    }

    return blogPost;
  }

  async getPublishedBlogPosts(storeId: string, filter: BlogFilterInput = {}) {
    const where: Prisma.BlogPostWhereInput = {
      storeId,
      isPublished: true,
    };

    // Apply filters
    if (filter.search) {
      where.OR = [
        { title: { contains: filter.search, mode: 'insensitive' } },
        { description: { contains: filter.search, mode: 'insensitive' } },
        { content: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    if (filter.category) {
      where.category = filter.category;
    }

    // Build orderBy
    const orderBy: Prisma.BlogPostOrderByWithRelationInput = {};
    if (filter.sortBy) {
      switch (filter.sortBy) {
        case 'title':
          orderBy.title = filter.sortOrder === 'desc' ? 'desc' : 'asc';
          break;
        case 'category':
          orderBy.category = filter.sortOrder === 'desc' ? 'desc' : 'asc';
          break;
        case 'updatedAt':
          orderBy.updatedAt = filter.sortOrder === 'desc' ? 'desc' : 'asc';
          break;
        default:
          orderBy.createdAt = 'desc';
      }
    } else {
      orderBy.createdAt = 'desc';
    }

    const blogPosts = await this.prisma.blogPost.findMany({
      where,
      orderBy,
      take: filter.limit || 20,
      skip: filter.offset || 0,
    });

    return blogPosts;
  }

  async getBlogCategories(storeId: string) {
    const categories = await this.prisma.blogPost.findMany({
      where: { storeId },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });

    return categories.map((c) => c.category);
  }
}
