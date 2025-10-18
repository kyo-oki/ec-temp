import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class FAQ {
  @Field(() => ID)
  id: string;

  @Field()
  question: string;

  @Field()
  answer: string;

  @Field(() => Int)
  displayOrder: number;

  @Field()
  storeId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
