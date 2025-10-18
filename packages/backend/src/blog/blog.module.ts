import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TenantModule } from '../tenant/tenant.module';
import { BlogService } from './blog.service';
import { BlogResolver } from './blog.resolver';

@Module({
  imports: [PrismaModule, TenantModule],
  providers: [BlogService, BlogResolver],
  exports: [BlogService],
})
export class BlogModule {}
