import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateBlogPostInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  content: string;

  @Field()
  category: string;

  @Field({ nullable: true })
  thumbnailUrl?: string;

  @Field({ defaultValue: false })
  isPublished: boolean;
}
