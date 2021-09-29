import { PickType } from '@nestjs/mapped-types';
import { Post } from '../post.entity';

export class PostDto extends PickType(Post, [
  'postId',
  'title',
  'content',
  'viewCount',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const) {}
