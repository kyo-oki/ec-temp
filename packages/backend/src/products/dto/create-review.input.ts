import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateReviewInput {
  @Field()
  productId: string;

  @Field()
  customerName: string;

  @Field(() => Int)
  rating: number;

  @Field()
  comment: string;
}
