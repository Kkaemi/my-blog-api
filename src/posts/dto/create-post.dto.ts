import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
  MaxLength,
} from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(65535)
  content: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  tags: string[];
}
