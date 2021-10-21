import { SearchType } from '../search.type';
import {
  IsString,
  IsOptional,
  IsNumberString,
  IsNotEmpty,
} from 'class-validator';
import { NotSpecialChar } from 'src/decorator/not-special-char.decorator';

export class SearchPostDto {
  @IsNotEmpty()
  searchType: SearchType;

  @IsString()
  @NotSpecialChar()
  searchKeyword: string;

  @IsOptional()
  postId?: number;

  @IsNumberString()
  @IsNotEmpty()
  pageSize: number;
}
