import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../tenant/guards/tenant.guard';
import { CurrentTenant } from '../tenant/decorators/current-tenant.decorator';
import { CreateBlogPostInput } from './dto/create-blog-post.input';
import { UpdateBlogPostInput } from './dto/update-blog-post.input';
import { BlogFilterInput } from './dto/blog-filter.input';
import { BlogPost } from './dto/blog-post.dto';
import type { TenantContext } from '../tenant/tenant.service';

@Resolver(() => BlogPost)
export class BlogResolver {
  constructor(private blogService: BlogService) {}

  @Mutation(() => BlogPost)
  @UseGuards(TenantGuard)
  async createBlogPost(
    @Args('input') input: CreateBlogPostInput,
    @CurrentTenant() tenant: TenantContext,
  ) {
    return this.blogService.createBlogPost(tenant.storeId, input);
  }

  @Mutation(() => BlogPost)
  @UseGuards(TenantGuard)
  async updateBlogPost(
    @Args('id') id: string,
    @Args('input') input: UpdateBlogPostInput,
    @CurrentTenant() tenant: TenantContext,
  ) {
    return this.blogService.updateBlogPost(id, tenant.storeId, input);
  }

  @Mutation(() => BlogPost)
  @UseGuards(TenantGuard)
  async deleteBlogPost(
    @Args('id') id: string,
    @CurrentTenant() tenant: TenantContext,
  ) {
    return this.blogService.deleteBlogPost(id, tenant.storeId);
  }

  @Query(() => [BlogPost])
  @UseGuards(TenantGuard)
  async blogPosts(
    @Args('filter', { nullable: true }) filter: BlogFilterInput,
    @CurrentTenant() tenant: TenantContext,
  ) {
    return this.blogService.getBlogPosts(tenant.storeId, filter);
  }

  @Query(() => [BlogPost])
  @UseGuards(TenantGuard)
  async publishedBlogPosts(
    @Args('filter', { nullable: true }) filter: BlogFilterInput,
    @CurrentTenant() tenant: TenantContext,
  ) {
    return this.blogService.getPublishedBlogPosts(tenant.storeId, filter);
  }

  @Query(() => BlogPost)
  async blogPost(
    @Args('id') id: string,
    @CurrentTenant() tenant: TenantContext | null,
  ) {
    return this.blogService.getBlogPostById(id, tenant?.storeId);
  }

  @Query(() => [String])
  @UseGuards(TenantGuard)
  async blogCategories(@CurrentTenant() tenant: TenantContext) {
    return this.blogService.getBlogCategories(tenant.storeId);
  }
}
