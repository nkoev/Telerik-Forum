import { Test } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { User } from '../../database/entities/user.entity';
import { PostCreateDTO } from '../../models/posts/post-create.dto';
import { PostUpdateDTO } from '../../models/posts/post-update.dto';

describe('PostsController', () => {
  let postsController: PostsController;
  const postsService: Partial<PostsService> = {
    getPosts() {
      return 'test read' as any;
    },
    getSinglePost() {
      return 'test read one' as any;
    },
    createPost() {
      return 'test create' as any;
    },
    updatePost() {
      return 'test update' as any;
    },
    likePost() {
      return 'test like' as any;
    },
    flagPost() {
      return 'test flag' as any;
    },
    lockPost() {
      return 'test lock' as any;
    },
    deletePost() {
      return 'test delete' as any;
    },
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: postsService,
        },
      ],
    }).compile();

    postsController = moduleRef.get<PostsController>(PostsController);
  });

  it('should be defined', () => {
    expect(postsController).toBeDefined();
  });

  describe('getPosts method', () => {
    it('should call the PostsService, getPosts method', async () => {
      jest.spyOn(postsService, 'getPosts');
      await postsController.getPosts(2, 2);
      expect(postsService.getPosts).toHaveBeenCalledTimes(1);
    });
    it('should retun the result from postsService, getPosts method', async () => {
      jest.spyOn(postsService, 'getPosts');
      const result = await postsController.getPosts(2, 2);
      expect(result).toBe('test read');
    });
  });

  describe('getSinglePost method', () => {
    it('should call the PostsService getSinglePost method with correct argument', async () => {
      jest.spyOn(postsService, 'getSinglePost');
      await postsController.getSinglePost(2);
      expect(postsService.getSinglePost).toHaveBeenCalledTimes(1);
      expect(postsService.getSinglePost).toHaveBeenCalledWith(2);
    });
    it('should return the result from postsService, getSinglePost method', async () => {
      jest.spyOn(postsService, 'getSinglePost');
      const result = await postsController.getSinglePost(1);
      expect(result).toBe('test read one');
    });
  });

  describe('createPost method', () => {
    it('should call the PostsService createPost method with correct arguments', async () => {
      jest.spyOn(postsService, 'createPost');
      const user = new User();
      const createDTO = new PostCreateDTO();
      await postsController.createPost(user, createDTO);
      expect(postsService.createPost).toHaveBeenCalledTimes(1);
      expect(postsService.createPost).toHaveBeenCalledWith(user, createDTO);
    });
    it('should return the result from postsService, createPost method', async () => {
      jest.spyOn(postsService, 'createPost');
      const user = new User();
      const createDTO = new PostCreateDTO();
      const result = await postsController.createPost(user, createDTO);
      expect(result).toBe('test create');
    });
  });

  describe('updatePost method', () => {
    it('should call the PostsService updatePost method with correct arguments', async () => {
      jest.spyOn(postsService, 'updatePost');
      const user = new User();
      const updateDTO = new PostUpdateDTO();
      await postsController.updatePost(updateDTO, 4, user, true);
      expect(postsService.updatePost).toHaveBeenCalledTimes(1);
      expect(postsService.updatePost).toHaveBeenCalledWith(
        updateDTO,
        4,
        user,
        true,
      );
    });
    it('should return the result from postsService, updatePost method', async () => {
      jest.spyOn(postsService, 'updatePost');
      const user = new User();
      const updateDTO = new PostUpdateDTO();
      const result = await postsController.updatePost(updateDTO, 4, user, true);
      expect(result).toBe('test update');
    });
  });

  describe('likePost method', () => {
    it('should call the PostsService likePost method with correct arguments', async () => {
      jest.spyOn(postsService, 'likePost');
      const user = new User();
      await postsController.likePost(user, 4, true);
      expect(postsService.likePost).toHaveBeenCalledTimes(1);
      expect(postsService.likePost).toHaveBeenCalledWith(user, 4, true);
    });
    it('should return the result from postsService, likePost method', async () => {
      jest.spyOn(postsService, 'likePost');
      const user = new User();
      const result = await postsController.likePost(user, 4, true);
      expect(result).toBe('test like');
    });
  });

  describe('flagPost method', () => {
    it('should call the PostsService, flagPost method with correct arguments', async () => {
      jest.spyOn(postsService, 'flagPost');
      const user = new User();
      await postsController.flagPost(user, 4, true);
      expect(postsService.flagPost).toHaveBeenCalledTimes(1);
      expect(postsService.flagPost).toHaveBeenCalledWith(user, 4, true);
    });
    it('should return the result from postsService, flagPost method', async () => {
      jest.spyOn(postsService, 'flagPost');
      const user = new User();
      const result = await postsController.flagPost(user, 4, true);
      expect(result).toBe('test flag');
    });
  });

  describe('lockPost method', () => {
    it('should call the PostsService, lockPost method with correct arguments', async () => {
      jest.spyOn(postsService, 'lockPost');
      await postsController.lockPost(4, true);
      expect(postsService.lockPost).toHaveBeenCalledTimes(1);
      expect(postsService.lockPost).toHaveBeenCalledWith(4, true);
    });
    it('should return the result from postsService, lockPost method', async () => {
      jest.spyOn(postsService, 'lockPost');
      const result = await postsController.lockPost(4, true);
      expect(result).toBe('test lock');
    });
  });

  describe('deletePost method', () => {
    it('should call the PostsService, deletePost method with correct arguments', async () => {
      jest.spyOn(postsService, 'deletePost');
      const user = new User();
      await postsController.deletePost(user, 4, true);
      expect(postsService.deletePost).toHaveBeenCalledTimes(1);
      expect(postsService.deletePost).toHaveBeenCalledWith(user, 4, true);
    });
    it('should return the result from postsService, deletePost method', async () => {
      jest.spyOn(postsService, 'deletePost');
      const user = new User();
      const result = await postsController.deletePost(user, 4, true);
      expect(result).toBe('test delete');
    });
  });
});
