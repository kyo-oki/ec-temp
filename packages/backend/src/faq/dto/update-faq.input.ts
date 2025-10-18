import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class UpdateFAQInput {
  @Field({ nullable: true })
  question?: string;

  @Field({ nullable: true })
  answer?: string;

  @Field(() => Int, { nullable: true })
  displayOrder?: number;
}
