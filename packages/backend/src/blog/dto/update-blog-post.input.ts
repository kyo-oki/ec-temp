import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateBlogPostInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  content?: string;

  @Field({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  thumbnailUrl?: string;

  @Field({ nullable: true })
  isPublished?: boolean;
}
