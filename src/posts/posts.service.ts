import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './post.entity';
import { UpdatePostDto } from './dto/update-post.dto';
import { TagsService } from 'src/tags/tags.service';
import { SearchPostDto } from './dto/search-post.dto';
import { SimplePostDto } from './dto/simple-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
    private readonly tagsService: TagsService,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<number> {
    const { title, content } = createPostDto;

    const tags = await this.tagsService.findInName(createPostDto.tags);

    const post = new Post();
    post.title = title;
    post.content = content;
    post.tags = tags;

    return (await this.postsRepository.save(post)).postId;
  }

  async findAll(): Promise<Post[]> {
    return await this.postsRepository.find();
  }

  async findOne(id: number): Promise<Post> {
    return await this.postsRepository.findOneOrFail(id);
  }

  async searchByQueryParams(dto: SearchPostDto): Promise<SimplePostDto[]> {
    const { searchType, searchKeyword, postId, pageSize } = dto;

    const qb = this.postsRepository.createQueryBuilder('post');

    qb.innerJoinAndSelect('post.tags', 'tag')
      .leftJoinAndSelect('post.comments', 'comment')
      .orderBy('post.postId', 'DESC')
      .limit(pageSize);

    if (postId) {
      qb.where('post.postId < :postId', { postId });
    }

    if (searchKeyword) {
      qb.andWhere(`post.${searchType} LIKE :searchKeyword`, {
        searchKeyword: `%${searchKeyword}%`,
      });
    }

    const rows = await qb.getMany();

    return rows.map((post) => new SimplePostDto(post));
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<void> {
    const { title, content } = updatePostDto;

    const post = await this.findOne(id);
    post.title = title;
    post.content = content;
    post.updatedAt = new Date();

    if (updatePostDto.tags) {
      const tags = await this.tagsService.findInName(updatePostDto.tags);

      post.tags = tags;
    }

    await this.postsRepository.save(post);
  }

  async hitViewCount(id: number): Promise<void> {
    await this.findOne(id);

    await this.postsRepository
      .createQueryBuilder()
      .update()
      .set({
        viewCount: () => 'view_count + 1',
      })
      .where('postId = :id', { id })
      .useTransaction(true)
      .execute();
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);

    await this.postsRepository
      .createQueryBuilder()
      .softDelete()
      .where('post_id = :id', { id: id })
      .execute();
  }
}
