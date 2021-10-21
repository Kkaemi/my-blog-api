import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private readonly tagsRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<void> {
    const tags = await this.findInName(createTagDto.names);

    const notExistNames = createTagDto.names
      .filter((name) => !tags.map((tag) => tag.name).includes(name))
      .map((name) => ({ name: name }));

    await this.tagsRepository
      .createQueryBuilder()
      .insert()
      .values(notExistNames)
      .useTransaction(true)
      .execute();
  }

  async findInName(names: string[]): Promise<Tag[]> {
    return await this.tagsRepository.find({
      name: In(names),
    });
  }

  async findByPostId(postId: number): Promise<Tag[]> {
    return await this.tagsRepository
      .createQueryBuilder('tag')
      .innerJoin('tag.posts', 'posts')
      .where('posts.postId = :postId', { postId })
      .getMany();
  }

  async findAll(): Promise<Tag[]> {
    return await this.tagsRepository.find();
  }

  async findOne(id: number): Promise<Tag> {
    return await this.tagsRepository.findOne(id).then((entity) => {
      if (!entity) {
        throw new NotFoundException();
      }

      return entity;
    });
  }

  async update(id: number, updateTagDto: UpdateTagDto): Promise<void> {
    await this.findOne(id);

    await this.tagsRepository
      .createQueryBuilder()
      .update()
      .set({ name: updateTagDto.name })
      .where('tag_id = :id', { id: id })
      .useTransaction(true)
      .execute();
  }

  async remove(id: number): Promise<void> {
    const tag = await this.findOne(id);
    await this.tagsRepository.delete(tag);
  }
}
