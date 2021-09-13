import { IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';

export class CreateTagDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  names: string[];
}
