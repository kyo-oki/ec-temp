import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TenantContext } from '../tenant.service';

export interface RequestWithTenant extends Request {
  tenant?: TenantContext | null;
}

export const CurrentTenant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): TenantContext | null => {
    const request = ctx.switchToHttp().getRequest<RequestWithTenant>();
    return request.tenant || null;
  },
);
