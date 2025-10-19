import { Query, Resolver, ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ApiStatus {
  @Field()
  status: string;

  @Field()
  message: string;

  @Field()
  timestamp: string;

  @Field()
  version: string;

  @Field()
  environment: string;
}

@Resolver()
export class AppResolver {
  @Query(() => String)
  hello(): string {
    return 'Hello from ProGear Hub GraphQL API!';
  }

  @Query(() => String)
  health(): string {
    return 'OK';
  }

  @Query(() => ApiStatus)
  apiStatus(): ApiStatus {
    return {
      status: 'healthy',
      message: 'ProGear Hub API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
