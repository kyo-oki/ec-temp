import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { TenantContext } from '../tenant.service';

export interface RequestWithTenant extends Request {
  tenant?: TenantContext | null;
}

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithTenant>();

    if (!request.tenant) {
      throw new BadRequestException(
        'Tenant context is required for this operation',
      );
    }

    return true;
  }
}
