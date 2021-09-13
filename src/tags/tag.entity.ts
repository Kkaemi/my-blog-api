import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from '../posts/post.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  tagId: number;

  @Column({ unique: true, nullable: false })
  name: string;

  @ManyToMany(() => Post, (post) => post.tags, { cascade: true })
  @JoinTable({
    name: 'post_tag_map',
    joinColumn: { name: 'tag_id' },
    inverseJoinColumn: { name: 'post_id' },
  })
  posts: Post[];
}
