import { ArgsType, Field } from '@nestjs/graphql';
import { CreateProductInput } from './create-product.input';

@ArgsType()
export class CreateProductArgs {
  @Field(() => CreateProductInput, { nullable: false })
  input: CreateProductInput;
}
