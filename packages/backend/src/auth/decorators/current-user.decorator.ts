import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface UserPayload {
  userId: string;
  email: string;
  name: string;
}

interface RequestWithUser {
  user: UserPayload;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserPayload => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
