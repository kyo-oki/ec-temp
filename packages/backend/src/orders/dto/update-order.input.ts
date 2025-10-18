import { InputType, Field } from '@nestjs/graphql';
import { OrderStatus } from '@prisma/client';

@InputType()
export class UpdateOrderInput {
  @Field({ nullable: true })
  customerName?: string;

  @Field({ nullable: true })
  customerEmail?: string;

  @Field({ nullable: true })
  customerPhone?: string;

  @Field({ nullable: true })
  deliveryAddress?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  stateRegion?: string;

  @Field({ nullable: true })
  postcode?: string;

  @Field(() => String, { nullable: true })
  status?: OrderStatus;
}
