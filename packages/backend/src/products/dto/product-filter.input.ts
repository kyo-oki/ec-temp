import { InputType, Field, Float, Int } from '@nestjs/graphql';

@InputType()
export class ProductFilterInput {
  @Field({ nullable: true })
  search?: string;

  @Field({ nullable: true })
  category?: string;

  @Field(() => Float, { nullable: true })
  minPrice?: number;

  @Field(() => Float, { nullable: true })
  maxPrice?: number;

  @Field(() => Int, { nullable: true })
  minRating?: number;

  @Field(() => [String], { nullable: true })
  availableSizes?: string[];

  @Field(() => [String], { nullable: true })
  availableColors?: string[];

  @Field({ nullable: true })
  isActive?: boolean;

  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => Int, { nullable: true })
  offset?: number;

  @Field({ nullable: true })
  sortBy?: string;

  @Field({ nullable: true })
  sortOrder?: string;
}
