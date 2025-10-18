import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class OrderItem {
  @Field(() => ID)
  id: string;

  @Field()
  orderId: string;

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
