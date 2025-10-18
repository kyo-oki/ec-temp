import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class About {
  @Field(() => ID)
  id: string;

  @Field()
  philosophy: string;

  @Field()
  vision: string;

  @Field(() => String)
  offerings: string; // JSON string representation

  @Field()
  storeId: string;

  @Field()
  updatedAt: Date;
}
