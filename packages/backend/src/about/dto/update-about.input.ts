import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateAboutInput {
  @Field({ nullable: true })
  philosophy?: string;

  @Field({ nullable: true })
  vision?: string;

  @Field({ nullable: true })
  offerings?: string; // JSON string representation
}
