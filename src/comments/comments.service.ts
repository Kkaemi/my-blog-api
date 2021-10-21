import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsService } from 'src/posts/posts.service';
import { UsersService } from 'src/users/users.service';
import { Repository, Transaction, TransactionRepository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateCommentDto): Promise<void> {
    const { content, postId, userId } = dto;

    const comment = new Comment();
    comment.content = content;
    comment.post = await this.postsService.findOne(postId);
    comment.user = await this.usersService.findOne(userId);

    await this.commentsRepository.save(comment);
  }

  @Transaction()
  async createReply(
    commentId: number,
    dto: CreateCommentDto,
    @TransactionRepository(Comment) commentsRepository?: Repository<Comment>,
  ): Promise<void> {
    const { postId, userId, content } = dto;

    const comment = await commentsRepository.findOneOrFail(commentId, {
      relations: ['replies', 'parentComment'],
    });

    const reply = new Comment();
    reply.content = content;
    reply.parentComment = comment;
    reply.post = await this.postsService.findOne(postId);
    reply.user = await this.usersService.findOne(userId);
    await commentsRepository.save(reply);

    comment.replies = [...comment.replies, reply];

    if (comment.parentComment) {
      throw new BadRequestException("comment's reply depth is must be 1");
    }

    await commentsRepository.save(comment);
  }

  async findByPostId(postId: number): Promise<any[]> {
    const comments = await this.commentsRepository.find({
      join: {
        alias: 'comment',
        innerJoin: {
          post: 'comment.post',
        },
        leftJoinAndSelect: {
          parentComment: 'comment.parentComment',
        },
      },
      where: { post: { postId } },
    });

    return comments.map((comment) => {
      const { parentComment, ...rest } = comment;

      return {
        ...rest,
        groupId: parentComment?.commentId,
      };
    });
  }

  async update(id: number, updateCommentDto: UpdateCommentDto): Promise<void> {
    const comment = await this.commentsRepository.findOneOrFail(id);
    comment.content = updateCommentDto.content;
    await this.commentsRepository.save(comment);
  }

  async remove(id: number): Promise<void> {
    const comment = await this.commentsRepository.findOneOrFail(id);
    await this.commentsRepository.softRemove(comment);
  }
}
