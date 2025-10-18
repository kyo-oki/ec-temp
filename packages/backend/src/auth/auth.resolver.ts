import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { SignUpInput } from './dto/sign-up.input';
import { SignInInput } from './dto/sign-in.input';
import { AuthPayload } from './dto/auth-payload.dto';
import { User } from './dto/user.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async signUp(@Args('input') input: SignUpInput) {
    const user = await this.authService.register(
      input.email,
      input.password,
      input.name,
    );

    return this.authService.login(user);
  }

  @Mutation(() => AuthPayload)
  async signIn(@Args('input') input: SignInInput) {
    const user = await this.authService.validateUser(
      input.email,
      input.password,
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    return this.authService.login(user);
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async me(
    @CurrentUser() user: { userId: string; email: string; name: string },
  ) {
    return this.authService.getCurrentUser(user.userId);
  }
}
