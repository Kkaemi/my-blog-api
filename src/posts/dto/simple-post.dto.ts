import { Post } from '../post.entity';
import removeMarkdown from 'markdown-to-text';

export class SimplePostDto {
  constructor(post: Post) {
    this.postId = post.postId;
    this.title = post.title;
    this.content = removeMarkdown(post.content).slice(0, 50) + '...';
    this.createdAt = post.createdAt;
    this.updatedAt = post.updatedAt;
    this.tags = post.tags.map((tag) => '#' + tag.name);

    if (post.comments.length) {
      this.comments = post.comments.length;
    }
  }

  postId: number;

  title: string;

  content: string;

  createdAt: Date;
  updatedAt: Date;

  tags: string[];

  comments?: number;
}
