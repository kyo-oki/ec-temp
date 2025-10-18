import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UploadResult {
  @Field()
  url: string;

  @Field()
  filename: string;

  @Field()
  originalName: string;

  @Field()
  mimetype: string;

  @Field()
  size: number;
}
