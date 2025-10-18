import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SlugAvailability {
  @Field()
  available: boolean;

  @Field()
  slug: string;
}
