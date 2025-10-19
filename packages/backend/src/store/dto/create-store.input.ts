import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  IsNotEmpty,
  Matches,
  Length,
  IsOptional,
} from 'class-validator';

@InputType()
export class CreateStoreInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  @Length(3, 50)
  slug: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, {
    message:
      'Subdomain must contain only lowercase letters, numbers, and hyphens',
  })
  @Length(3, 50)
  subdomain: string;

  @Field({ nullable: true })
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  settings?: string; // JSON string
}
