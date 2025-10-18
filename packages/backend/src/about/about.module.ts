import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TenantModule } from '../tenant/tenant.module';
import { AboutService } from './about.service';
import { AboutResolver } from './about.resolver';

@Module({
  imports: [PrismaModule, TenantModule],
  providers: [AboutService, AboutResolver],
  exports: [AboutService],
})
export class AboutModule {}
