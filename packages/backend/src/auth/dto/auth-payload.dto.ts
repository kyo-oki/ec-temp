import { ObjectType, Field } from '@nestjs/graphql';
import { User } from './user.dto';

@ObjectType()
export class AuthPayload {
  @Field()
  access_token: string;

  @Field(() => User)
  user: User;
}
