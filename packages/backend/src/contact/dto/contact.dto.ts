import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Contact {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  subject: string;

  @Field()
  message: string;

  @Field()
  isRead: boolean;

  @Field()
  storeId: string;

  @Field()
  createdAt: Date;
}
