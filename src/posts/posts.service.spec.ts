import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, TypeORMError } from 'typeorm';
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
    post.filePath = 'test/2021/9/1/';
    post.fileName = 'test.md';

    const resolvedValue = {
      postId: 1,
      filePath: 'test/2021/9/1',
      fileName: 'test.md',
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: null,
    };

    const typeORMError = new TypeORMError('fileName이 중복됩니다.');
    let catchError: TypeORMError;

    postsRepository.save
      .mockResolvedValueOnce(resolvedValue)
      .mockRejectedValueOnce(typeORMError);

    // when
    const savedPost = await postsRepository.save(post);
    try {
      await postsRepository.save(post);
    } catch (error: any) {
      catchError = error;
    }

    // then
    expect(savedPost).toEqual(resolvedValue);
    expect(catchError).toEqual(typeORMError);
  });
});
