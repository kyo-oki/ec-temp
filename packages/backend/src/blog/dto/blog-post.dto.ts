import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class BlogPost {
  @Field(() => ID)
  id: string;

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

  @Field()
  isPublished: boolean;

  @Field()
  storeId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
