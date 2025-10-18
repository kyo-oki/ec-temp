import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class UpdatePromotionInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Float, { nullable: true })
  discountPercentage?: number;

  @Field({ nullable: true })
  startDate?: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field({ nullable: true })
  isActive?: boolean;
}
