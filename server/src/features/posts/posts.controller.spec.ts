import { Test } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

describe('PostsController', () => {
  let postsController: PostsController;
  const postsService = {}

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: postsService
        }
      ],
    }).compile();

    postsController = moduleRef.get<PostsController>(PostsController);
  });

  it('should be defined', () => {

    expect(postsController).toBeDefined();
  });
});