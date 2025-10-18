import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class PromotionFilterInput {
  @Field({ nullable: true })
  isActive?: boolean;

  @Field({ nullable: true })
  isCurrentlyActive?: boolean; // Active based on current date

  @Field({ nullable: true })
  search?: string;
}
