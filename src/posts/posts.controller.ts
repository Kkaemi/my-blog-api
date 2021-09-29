import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Auth } from 'src/decorator/auth.decorator';
import { ValidationPipe } from 'src/pipe/validation.pipe';
import { CreatePostDto } from './dto/create-post.dto';
import { PostDto } from './dto/post-dto';
import { SearchPostDto } from './dto/search-post.dto';
import { SimplePostDto } from './dto/simple-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Auth('admin')
  @Post()
  async create(@Body(ValidationPipe) createPostDto: CreatePostDto) {
    return await this.postsService.create(createPostDto);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PostDto> {
    return await this.postsService.findOne(id);
  }

  @Get()
  async searchByQueryParams(
    @Query(ValidationPipe) dto: SearchPostDto,
  ): Promise<SimplePostDto[]> {
    return await this.postsService.searchByQueryParams(dto);
  }

  @Auth('admin')
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updatePostDto: UpdatePostDto,
  ) {
    return await this.postsService.update(id, updatePostDto);
  }

  @Patch(':id/hit')
  async hitViewCount(@Param('id', ParseIntPipe) id: number) {
    return await this.postsService.hitViewCount(id);
  }

  @Auth('admin')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.postsService.remove(id);
  }
}
