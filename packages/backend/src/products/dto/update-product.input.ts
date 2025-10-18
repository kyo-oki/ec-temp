import { InputType, Field, Float, Int } from '@nestjs/graphql';

@InputType()
export class UpdateProductInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Float, { nullable: true })
  price?: number;

  @Field({ nullable: true })
  category?: string;

  @Field(() => [String], { nullable: true })
  images?: string[];

  @Field(() => [String], { nullable: true })
  availableSizes?: string[];

  @Field(() => [String], { nullable: true })
  availableColors?: string[];

  @Field(() => Int, { nullable: true })
  stockQuantity?: number;

  @Field({ nullable: true })
  isActive?: boolean;
}
