import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
} from 'typeorm';

@Entity()
export class Post {
  @Column({ type: 'bigint', primary: true, unsigned: true })
  @Generated('increment')
  postId: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({
    type: 'bigint',
    default: 0,
    nullable: false,
    unsigned: true,
  })
  viewCount: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    width: 6,
    insert: false,
    nullable: true,
  })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Date;
}
