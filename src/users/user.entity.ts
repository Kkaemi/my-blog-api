import { Role } from 'src/auth/role.enum';
import { Comment } from 'src/comments/comment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  userId: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'set', enum: Role, default: [Role.User] })
  roles: Role[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    width: 6,
    nullable: true,
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
