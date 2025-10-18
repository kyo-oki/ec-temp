import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TenantService, TenantContext } from './tenant.service';

export interface RequestWithTenant extends Request {
  tenant?: TenantContext | null;
}

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(private tenantService: TenantService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<RequestWithTenant>();
    const host = (request.headers['host'] ||
      request.headers['x-forwarded-host']) as string;

    if (!host) {
      throw new BadRequestException('Host header is required');
    }

    try {
      const tenant = await this.tenantService.resolveTenantFromHost(host);
      request.tenant = tenant;
    } catch {
      // If tenant resolution fails, continue without tenant context
      // This allows public endpoints to work
      request.tenant = null;
    }

    return next.handle();
  }
}
