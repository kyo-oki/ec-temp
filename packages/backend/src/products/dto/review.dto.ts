import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class Review {
  @Field(() => ID)
  id: string;

  @Field()
  productId: string;

  @Field()
  customerName: string;

  @Field(() => Int)
  rating: number;

  @Field()
  comment: string;

  @Field()
  isApproved: boolean;

  @Field()
  createdAt: Date;
}
