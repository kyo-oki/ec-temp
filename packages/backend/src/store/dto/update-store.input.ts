import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateStoreInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  settings?: string; // JSON string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  customDomain?: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  customDomainVerified?: boolean;
}
