import { Test, TestingModule } from '@nestjs/testing';
import { TypeORMError } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

const mockPostsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [{ provide: PostsService, useValue: mockPostsService }],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create post', async () => {
    const dto1: CreatePostDto = {
      title: 'test',
      content: 'test content',
      tags: ['coding', 'life'],
    };

    const dto2: CreatePostDto = {
      title: 'test22',
      content: 'test content22',
      tags: ['coding', 'life'],
    };

    const db: string[] = [];

    jest
      .spyOn(service, 'create')
      .mockImplementation((dto: CreatePostDto): Promise<number> => {
        if (db.includes(dto.title)) {
          throw new TypeORMError('key is duplicate');
        }

        db.push(dto.title);

        return Promise.resolve(db.length);
      });

    expect(await service.create(dto1)).toEqual(1);
    expect(await service.create(dto2)).toEqual(2);

    try {
      await service.create(dto2);
    } catch (error) {
      expect(error).toEqual(new TypeORMError('key is duplicate'));
    }
  });
});
