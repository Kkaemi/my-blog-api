import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { Auth } from 'src/decorator/auth.decorator';
import { ValidationPipe } from 'src/pipe/validation.pipe';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Auth('user', 'admin')
  @Post()
  async create(@Body() createCommentDto: CreateCommentDto) {
    return await this.commentsService.create(createCommentDto);
  }

  @Auth('user', 'admin')
  @Post(':commentId/replies')
  async createReply(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body(ValidationPipe) createReplyDto: CreateCommentDto,
  ) {
    return await this.commentsService.createReply(commentId, createReplyDto);
  }

  @Get('posts/:postId')
  async findByPostId(@Param('postId', ParseIntPipe) postId: number) {
    return await this.commentsService.findByPostId(postId);
  }

  @Auth('user', 'admin')
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return await this.commentsService.update(id, updateCommentDto);
  }

  @Auth('user', 'admin')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.commentsService.remove(id);
  }
}
