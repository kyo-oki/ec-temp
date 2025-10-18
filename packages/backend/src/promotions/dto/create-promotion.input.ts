import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreatePromotionInput {
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

  @Field({ defaultValue: true })
  isActive: boolean;
}
