import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const contextData = gqlContext.getContext();
    const request = contextData.req;

    // Debug logging
    console.log('JWT Guard - Request object:', {
      hasRequest: !!request,
      hasHeaders: !!(request && request.headers),
      headers: request?.headers,
      contextType: context.getType(),
    });

    if (!request) {
      console.log('JWT Guard - No request object found');
      throw new UnauthorizedException('No request object');
    }

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'your-secret-key',
      });

      // Fetch user from database
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Attach user to request
      (request as { user: unknown }).user = {
        userId: user.id,
        email: user.email,
        name: user.name,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: {
    headers?: { authorization?: string };
  }): string | undefined {
    if (!request || !request.headers || !request.headers.authorization) {
      return undefined;
    }
    const [type, token] = request.headers.authorization.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
