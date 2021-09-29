import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Auth } from 'src/decorator/auth.decorator';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Auth('admin')
  @Post()
  async create(@Body(ValidationPipe) createTagDto: CreateTagDto) {
    return await this.tagsService.create(createTagDto);
  }

  @Get('posts/:postId')
  async findByPostId(@Param('postId', ParseIntPipe) postId: number) {
    return await this.tagsService.findByPostId(postId);
  }

  @Get()
  async findAll() {
    return await this.tagsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.tagsService.findOne(id);
  }

  @Auth('admin')
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return await this.tagsService.update(id, updateTagDto);
  }

  @Auth('admin')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.tagsService.remove(id);
  }
}
