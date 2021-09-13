import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './post.entity';
import { Tag } from '../tags/tag.entity';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
    @InjectRepository(Tag) private readonly tagsRepository: Repository<Tag>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<number> {
    const { title, content } = createPostDto;

    const tags = await this.tagsRepository.find({
      name: In(createPostDto.tags),
    });

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
    return await this.postsRepository.findOne(id).then((entity) => {
      if (!entity) {
        throw new NotFoundException();
      }

      return entity;
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<void> {
    const { title, content } = updatePostDto;

    const post = await this.findOne(id);
    post.title = title;
    post.content = content;
    post.updatedAt = new Date();

    if (updatePostDto.tags) {
      const tags = await this.tagsRepository.find({
        name: In(updatePostDto.tags),
      });

      post.tags = tags;
    }

    await this.postsRepository.save(post);
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
