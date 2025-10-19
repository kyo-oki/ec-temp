import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
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

    console.log('TenantInterceptor - Request:', {
      hasRequest: !!request,
      hasHeaders: !!(request && request.headers),
      headers: request?.headers,
    });

    // Check if request and headers exist
    if (!request || !request.headers) {
      console.log(
        'TenantInterceptor - No request or headers, setting tenant to null',
      );
      // If no headers, continue without tenant context
      if (request) {
        request.tenant = null;
      }
      return next.handle();
    }

    const host = (request.headers['host'] ||
      request.headers['x-forwarded-host']) as string;

    console.log('TenantInterceptor - Host:', host);

    if (!host) {
      console.log('TenantInterceptor - No host header, setting tenant to null');
      // If no host header, continue without tenant context
      request.tenant = null;
      return next.handle();
    }

    try {
      const tenant = await this.tenantService.resolveTenantFromHost(host);
      console.log('TenantInterceptor - Resolved tenant from host:', tenant);
      request.tenant = tenant;
    } catch (error) {
      console.log(
        'TenantInterceptor - Error resolving tenant from host:',
        error,
      );
      // If tenant resolution fails, try to get a default store for development
      if (
        process.env.NODE_ENV === 'development' ||
        host.includes('localhost')
      ) {
        try {
          const defaultStore = await this.tenantService.getDefaultStore();
          console.log('TenantInterceptor - Using default store:', defaultStore);
          request.tenant = defaultStore;
        } catch (error) {
          console.log(
            'TenantInterceptor - Error getting default store:',
            error,
          );
          request.tenant = null;
        }
      } else {
        request.tenant = null;
      }
    }

    console.log('TenantInterceptor - Final tenant:', request.tenant);
    return next.handle();
  }
}
