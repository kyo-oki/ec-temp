import { ObjectType, Field } from '@nestjs/graphql';
import { Store } from './store.dto';

@ObjectType()
export class DomainVerification {
  @Field()
  domain: string;

  @Field()
  verified: boolean;

  @Field(() => Store)
  store: Store;
}
