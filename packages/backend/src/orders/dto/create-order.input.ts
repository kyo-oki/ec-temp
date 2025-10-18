import { InputType, Field } from '@nestjs/graphql';
import { OrderItemInput } from './order-item.input';

@InputType()
export class CreateOrderInput {
  @Field()
  customerName: string;

  @Field()
  customerEmail: string;

  @Field()
  customerPhone: string;

  @Field()
  deliveryAddress: string;

  @Field()
  city: string;

  @Field()
  stateRegion: string;

  @Field()
  postcode: string;

  @Field(() => [OrderItemInput])
  items: OrderItemInput[];
}
