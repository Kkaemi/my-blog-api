import { Post } from '../post.entity';

export class PostDetailDto {
  constructor(post: Post) {
    const sortDesc = (a: any, b: any) => {
      if (a.commentId > b.commentId) {
        return -1;
      }
      if (a.commentId < b.commentId) {
        return 1;
      }

      return 0;
    };

    const { postId, title, content, viewCount, createdAt, updatedAt } = post;
    this.postId = postId;
    this.title = title;
    this.content = content;
    this.viewCount = viewCount;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    this.tags = post.tags.map((tag) => '#' + tag.name);

    this.comments = post.comments
      .map((comment) => ({
        ...comment,
        author: comment.user.email.split('@')[0],
        replies: comment.replies
          .map((reply) => ({
            commentId: reply.commentId,
            content: reply.content,
            createdAt: reply.createdAt,
            updatedAt: reply.updatedAt,
            author: reply.user.email.split('@')[0],
          }))
          .sort(sortDesc),
      }))
      .sort(sortDesc);
  }

  postId: number;
  title: string;
  content: string;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;

  tags: string[];

  comments: {
    commentId: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    author: string;
    replies: {
      commentId: number;
      content: string;
      createdAt: Date;
      updatedAt: Date;
      author: string;
    }[];
  }[];
}
