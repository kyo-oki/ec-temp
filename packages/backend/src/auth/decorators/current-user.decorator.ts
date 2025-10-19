import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

interface UserPayload {
  userId: string;
  email: string;
  name: string;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserPayload => {
    const gqlContext = GqlExecutionContext.create(ctx);
    const context = gqlContext.getContext();
    return context.req.user;
  },
);
