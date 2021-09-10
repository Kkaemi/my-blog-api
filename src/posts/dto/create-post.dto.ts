import { Post } from '../post.entity';

export class CreatePostDto {
  title: string;
  content: string;

  toEntity(): Post {
    const post = new Post();
    post.title = this.title;
    post.content = this.content;
    return post;
  }
}
