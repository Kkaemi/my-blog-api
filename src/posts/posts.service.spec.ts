import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tag } from 'src/tags/tag.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './post.entity';
import { PostsService } from './posts.service';

const mockPostsRepository = () => ({
  save: jest.fn(),
});

const mockTagsRepository = () => ({
  find: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('PostsService', () => {
  let service: PostsService;
  let postsRepository: MockRepository<Post>;
  let tagsRepository: MockRepository<Tag>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: getRepositoryToken(Post), useValue: mockPostsRepository() },
        { provide: getRepositoryToken(Tag), useValue: mockTagsRepository() },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postsRepository = module.get(getRepositoryToken(Post));
    tagsRepository = module.get(getRepositoryToken(Tag));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('게시글 저장', async () => {
    // given
    const dto: CreatePostDto = {
      title: 'test',
      content: 'test content',
      tags: ['coding', 'life'],
    };

    const post = new Post();
    post.title = 'test';
    post.content = 'test test test';

    const resolvedValue = {
      postId: 1,
      title: 'test',
      content: 'test test test',
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    };

    postsRepository.save.mockResolvedValue(resolvedValue);

    // when
    const savedPost = await postsRepository.save(post);

    // then
    expect(savedPost).toEqual(resolvedValue);
  });
});
