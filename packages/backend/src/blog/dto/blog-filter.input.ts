import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class BlogFilterInput {
  @Field({ nullable: true })
  search?: string;

  @Field({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  isPublished?: boolean;

  @Field(() => Int, { nullable: true })
  limit?: number;

  @Field(() => Int, { nullable: true })
  offset?: number;

  @Field({ nullable: true })
  sortBy?: string;

  @Field({ nullable: true })
  sortOrder?: string;
}
