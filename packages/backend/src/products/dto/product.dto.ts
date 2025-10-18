import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';
import { Review } from './review.dto';

@ObjectType()
export class Product {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Float)
  price: number;

  @Field()
  category: string;

  @Field(() => [String])
  images: string[];

  @Field(() => [String])
  availableSizes: string[];

  @Field(() => [String])
  availableColors: string[];

  @Field(() => Int)
  stockQuantity: number;

  @Field()
  isActive: boolean;

  @Field()
  storeId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [Review], { nullable: true })
  reviews?: Review[];
}
