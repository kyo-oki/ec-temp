import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateFAQInput {
  @Field()
  question: string;

  @Field()
  answer: string;

  @Field(() => Int, { defaultValue: 0 })
  displayOrder: number;
}
