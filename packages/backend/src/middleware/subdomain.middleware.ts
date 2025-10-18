import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SubdomainMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const host = req.get('host') || '';
    const subdomain = this.extractSubdomain(host);

    // Add subdomain to request object
    (req as any).subdomain = subdomain; // eslint-disable-line @typescript-eslint/no-unsafe-member-access

    next();
  }

  private extractSubdomain(host: string): string | null {
    // Remove port if present
    const hostname = host.split(':')[0];

    // Split by dots
    const parts = hostname.split('.');

    // If we have at least 3 parts (subdomain.domain.tld), extract subdomain
    if (parts.length >= 3) {
      return parts[0];
    }

    // For localhost development
    if (hostname.includes('localhost')) {
      const subdomainMatch = hostname.match(/^([^.]+)\.localhost/);
      if (subdomainMatch) {
        return subdomainMatch[1];
      }
    }

    return null;
  }
}
