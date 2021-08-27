import { BaseTimeEntity } from 'src/common/entities/base-time.entity';
import { Column, Entity, Generated } from 'typeorm';

@Entity()
export class Post extends BaseTimeEntity {
  @Column({ type: 'bigint', primary: true, unsigned: true })
  @Generated('increment')
  postId: number;

  @Column({ nullable: false })
  filePath: string;

  @Column({ nullable: false, unique: true })
  fileName: string;

  @Column({
    type: 'bigint',
    default: 0,
    nullable: false,
    unsigned: true,
  })
  viewCount: number;
}
