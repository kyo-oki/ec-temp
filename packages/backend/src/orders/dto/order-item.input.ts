import { InputType, Field, Float, Int } from '@nestjs/graphql';

@InputType()
export class OrderItemInput {
  @Field()
  productId: string;

  @Field()
  productName: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number;

  @Field({ nullable: true })
  size?: string;

  @Field({ nullable: true })
  color?: string;
}
