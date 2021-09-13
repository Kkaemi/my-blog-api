import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { PostsService } from './posts.service';

const mockPostsRepository = () => ({
  save: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('PostsService', () => {
  let service: PostsService;
  let postsRepository: MockRepository<Post>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: getRepositoryToken(Post), useValue: mockPostsRepository() },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postsRepository = module.get(getRepositoryToken(Post));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('게시글 저장', async () => {
    // given
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
