import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class Store {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field()
  subdomain: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  isActive: boolean;

  @Field({ nullable: true })
  customDomain?: string;

  @Field()
  customDomainVerified: boolean;

  @Field()
  ownerId: string;

  @Field()
  settings: string; // JSON string

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
