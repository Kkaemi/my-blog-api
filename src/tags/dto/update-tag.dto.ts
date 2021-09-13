import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateTagDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
