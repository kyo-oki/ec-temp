import { InputType, Field, Float, Int } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
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

  @Field({ defaultValue: true })
  isActive: boolean;
}
