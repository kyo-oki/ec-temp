import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class Promotion {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field(() => Float)
  discountPercentage: number;

  @Field()
  startDate: Date;

  @Field()
  endDate: Date;

  @Field()
  isActive: boolean;

  @Field()
  storeId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
