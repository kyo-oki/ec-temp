import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SubdomainAvailability {
  @Field()
  available: boolean;

  @Field()
  subdomain: string;
}
