import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { OrderItem } from './order-item.dto';
import { OrderStatus } from '@prisma/client';

@ObjectType()
export class Order {
  @Field(() => ID)
  id: string;

  @Field()
  orderNumber: string;

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

  @Field(() => Float)
  totalAmount: number;

  @Field(() => String)
  status: OrderStatus;

  @Field()
  storeId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [OrderItem], { nullable: true })
  items?: OrderItem[];
}
