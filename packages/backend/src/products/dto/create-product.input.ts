import { InputType, Field, Float, Int } from '@nestjs/graphql';
import {
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  Min,
} from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  description: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  price: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  category: string;

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  images: string[];

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  availableSizes: string[];

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  availableColors: string[];

  @Field(() => Int)
  @IsNumber()
  @Min(0)
  stockQuantity: number;

  @Field({ defaultValue: true })
  @IsBoolean()
  isActive: boolean;
}
