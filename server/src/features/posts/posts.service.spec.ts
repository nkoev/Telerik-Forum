import { Test } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { Post } from '../../database/entities/post.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { ActivityService } from '../core/activity.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PostShowDTO } from '../../models/posts/post-show.dto';
import { User } from '../../database/entities/user.entity';
import { PostCreateDTO } from '../../models/posts/post-create.dto';
import { ActivityType } from '../../models/activity/activity-type.enum';
import { PostUpdateDTO } from '../../models/posts/post-update.dto';

describe('PostsService', () => {
  let postsService: PostsService;
  let post: Post;
  const postsRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      relation: jest.fn().mockReturnThis(),
      of: jest.fn().mockReturnThis(),
      add: jest.fn().mockReturnThis(),
      remove: jest.fn().mockReturnThis(),
    })),
  };
  const notification: Partial<NotificationsService> = {
    notifyAdmins: jest.fn(),
  };
  const activity: Partial<ActivityService> = {
    logPostEvent: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Post),
          useValue: postsRepo,
        },
        {
          provide: NotificationsService,
          useValue: notification,
        },
        {
          provide: ActivityService,
          useValue: activity,
        },
      ],
    }).compile();

    post = {
      id: 1,
      title: '',
      content: '',
      createdOn: new Date(),
      isDeleted: false,
      isLocked: false,
      comments: Promise.resolve([]),
      commentsCount: 0,
      votes: [],
      flags: [],
      user: new User(),
    };

    postsService = moduleRef.get<PostsService>(PostsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(postsService).toBeDefined();
  });

  describe('getPosts method', () => {
    it('should call the Posts repository, find method', async () => {
      jest.spyOn(postsRepo, 'find').mockReturnValue(Promise.resolve([]));
      await postsService.getPosts(2, 2);
      expect(postsRepo.find).toHaveBeenCalledTimes(1);
    });
    it('should return an array of PostShowDTOs of found posts', async () => {
      jest.spyOn(postsRepo, 'find').mockReturnValue(Promise.resolve([post]));
      const result = await postsService.getPosts(2, 2);
      expect(result).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: 1 })]),
      );
      expect(result[0]).toBeInstanceOf(PostShowDTO);
      expect(result.length).toBe(1);
    });
  });

  describe('getSinglePost method', () => {
    it('should call the Posts repository finOne method with correct argument', async () => {
      jest.spyOn(postsRepo, 'findOne').mockReturnValue(Promise.resolve(post));
      await postsService.getSinglePost(post.id);
      expect(postsRepo.findOne).toBeCalledTimes(1);
      expect(postsRepo.findOne).toBeCalledWith({
        where: {
          id: post.id,
          isDeleted: false,
        },
      });
    });
    it('should throw Error if post was not found', async () => {
      jest
        .spyOn(postsRepo, 'findOne')
        .mockReturnValue(Promise.resolve(undefined));
      expect.assertions(1);
      await expect(postsService.getSinglePost(2)).rejects.toThrowError();
    });
    it('should return a PostShowDTO of found post', async () => {
      jest.spyOn(postsRepo, 'findOne').mockReturnValue(Promise.resolve(post));
      const result = await postsService.getSinglePost(2);
      expect(result).toEqual(expect.objectContaining({ id: 1 }));
      expect(result).toBeInstanceOf(PostShowDTO);
    });
  });

  describe('createPost method', () => {
    it('should call Posts repository create method', async () => {
      const user = new User();
      const createDTO: PostCreateDTO = {
        title: 'test title',
        content: 'test content',
      };
      jest.spyOn(postsRepo, 'save').mockReturnValue(Promise.resolve(post));
      await postsService.createPost(createDTO, user);
      expect(postsRepo.create).toHaveBeenCalledTimes(1);
      // expect(postsRepo.create).toHaveBeenCalledWith({
      //   user,
      //   title: 'test title',
      //   content: 'test content',
      //   comments: Promise.resolve([]),
      //   commentsCount: 0,
      //   votes: [],
      // });
    });
    it('should call Posts repository save method', async () => {
      const user = new User();
      const createDTO: PostCreateDTO = {
        title: 'test title',
        content: 'test content',
      };
      jest.spyOn(postsRepo, 'create').mockReturnValue(post);
      jest.spyOn(postsRepo, 'save').mockReturnValue(Promise.resolve(post));
      await postsService.createPost(createDTO, user);
      expect(postsRepo.save).toHaveBeenCalledTimes(1);
      expect(postsRepo.save).toHaveBeenCalledWith(post);
    });
    it('should call ActivityService logPostEvent method with created post id', async () => {
      const user = new User();
      const createDTO: PostCreateDTO = {
        title: 'test title',
        content: 'test content',
      };
      jest.spyOn(postsRepo, 'save').mockReturnValue(Promise.resolve(post));
      await postsService.createPost(createDTO, user);
      expect(activity.logPostEvent).toHaveBeenCalledTimes(1);
      expect(activity.logPostEvent).toHaveBeenCalledWith(
        user,
        ActivityType.Create,
        1,
      );
    });
    it('should return a PostShowDTO of created post', async () => {
      const user = new User();
      const createDTO: PostCreateDTO = {
        title: 'test title',
        content: 'test content',
      };
      jest.spyOn(postsRepo, 'save').mockReturnValue(Promise.resolve(post));
      const result = await postsService.createPost(createDTO, user);
      expect(result).toBeInstanceOf(PostShowDTO);
      expect(result).toEqual(expect.objectContaining({ id: 1 }));
    });
  });

  describe('updatePost method', () => {
    it('should call the Posts repository findOne method', async () => {
      const updateDTO: PostUpdateDTO = {
        title: 'test title',
        content: 'test content',
      };
      const user = new User();
      jest.spyOn(postsRepo, 'findOne').mockReturnValue(Promise.resolve(post));
      await postsService.updatePost(updateDTO, 2, user, true);
      expect(postsRepo.findOne).toBeCalledTimes(1);
      expect(postsRepo.findOne).toBeCalledWith({
        where: {
          id: 2,
          isDeleted: false,
        },
      });
    });
    it('should throw Error if post not found', async () => {
      const updateDTO: PostUpdateDTO = {
        title: 'test title',
        content: 'test content',
      };
      const user = new User();
      jest
        .spyOn(postsRepo, 'findOne')
        .mockReturnValue(Promise.resolve(undefined));
      await expect(
        postsService.updatePost(updateDTO, 2, user, true),
      ).rejects.toThrowError();
    });
    it('should throw Error if post is locked', async () => {
      const updateDTO: PostUpdateDTO = {
        title: 'test title',
        content: 'test content',
      };
      const user = new User();
      post.isLocked = true;
      jest.spyOn(postsRepo, 'findOne').mockReturnValue(Promise.resolve(post));
      await expect(
        postsService.updatePost(updateDTO, 2, user, true),
      ).rejects.toThrowError();
    });
    // it('should throw Error if loggedUser is not owner of the post or Admin', async () => {
    //   const updateDTO: PostUpdateDTO = {
    //     title: 'test title',
    //     content: 'test content',
    //   };
    //   const user = new User();
    //   jest.spyOn(postsRepo, 'findOne').mockReturnValue(Promise.resolve(post));
    //   await expect(
    //     postsService.updatePost(updateDTO, 2, user, false),
    //   ).rejects.toThrowError();
    // });
    it('should call the Posts repository save method', async () => {
      const updateDTO: PostUpdateDTO = {
        title: 'test title',
        content: 'test content',
      };
      const user = new User();
      jest.spyOn(postsRepo, 'findOne').mockReturnValue(Promise.resolve(post));
      await postsService.updatePost(updateDTO, 2, user, true);
      expect(postsRepo.save).toBeCalledTimes(1);
      expect(postsRepo.save).toBeCalledWith({
        ...post,
        ...updateDTO,
      });
    });
    it('should call ActivityService logPostEvent method with updated post id', async () => {
      const updateDTO: PostUpdateDTO = {
        title: 'test title',
        content: 'test content',
      };
      const user = new User();
      jest.spyOn(postsRepo, 'findOne').mockReturnValue(Promise.resolve(post));
      await postsService.updatePost(updateDTO, 2, user, true);
      expect(activity.logPostEvent).toHaveBeenCalledTimes(1);
      expect(activity.logPostEvent).toHaveBeenCalledWith(
        user,
        ActivityType.Update,
        post.id,
      );
    });
    it('should return a PostShowDTO of updated post', async () => {
      const updateDTO: PostUpdateDTO = {
        title: 'test title',
        content: 'test content',
      };
      const user = new User();
      jest.spyOn(postsRepo, 'findOne').mockReturnValue(Promise.resolve(post));
      const result = await postsService.updatePost(updateDTO, 2, user, true);
      expect(result).toBeInstanceOf(PostShowDTO);
      expect(result).toEqual(expect.objectContaining({ id: 1 }));
    });
  });

  describe('likePost method', () => {
    it('should call the Posts repository findOne with liked post id', async () => {
      const user = new User();
      user.id = 'fake id';
      jest.spyOn(postsRepo, 'findOne').mockReturnValue(post);
      await postsService.likePost(user, post.id, true);
      expect(postsRepo.findOne).toHaveBeenCalledTimes(1);
      expect(postsRepo.findOne).toHaveBeenCalledWith({
        where: {
          id: post.id,
          isDeleted: false,
        },
      });
    });
    it('should throw Error if liked post not found', async () => {
      const user = new User();
      user.id = 'fake id';
      jest
        .spyOn(postsRepo, 'findOne')
        .mockReturnValue(Promise.resolve(undefined));
      expect.assertions(1);
      await expect(
        postsService.likePost(user, post.id, true),
      ).rejects.toThrowError();
    });
    it('should throw Error if liked post is locked', async () => {
      const user = new User();
      user.id = 'fake id';
      post.isLocked = true;
      jest.spyOn(postsRepo, 'findOne').mockReturnValue(Promise.resolve(post));
      expect.assertions(1);
      await expect(
        postsService.likePost(user, post.id, true),
      ).rejects.toThrowError();
    });
    it('should throw Error if loggedUser same as post owner', async () => {
      const user = new User();
      user.id = 'fake id';
      post.user = user;
      jest.spyOn(postsRepo, 'findOne').mockReturnValue(Promise.resolve(post));
      expect.assertions(1);
      await expect(
        postsService.likePost(user, post.id, true),
      ).rejects.toThrowError();
    });
    it('should throw Error if post has been already (un)liked', async () => {
      const user = new User();
      user.id = 'fake id';
      jest.spyOn(postsRepo, 'findOne').mockReturnValue(Promise.resolve(post));
      expect.assertions(1);
      await expect(
        postsService.likePost(user, post.id, false),
      ).rejects.toThrowError();
    });
    // it('should call the Posts repository createQueryBuilder', async () => {
    //   const user = new User();
    //   user.id = 'fake id';
    //   jest.spyOn(postsRepo, 'findOne').mockReturnValue(post);
    //   await postsService.likePost(user, post.id, true);
    //   expect(postsRepo.createQueryBuilder).toHaveBeenCalledTimes(1);
    // });
    it('should return a PostShowDTO of liked post', async () => {
      const user = new User();
      user.id = 'fake id';
      jest.spyOn(postsRepo, 'findOne').mockReturnValue(post);
      const result = await postsService.likePost(user, post.id, true);
      expect(result).toBeInstanceOf(PostShowDTO);
      expect(result).toEqual(expect.objectContaining({ id: 1 }));
    });
    it('should call ActivityService logPostEvent method with liked post id', async () => {
      const user = new User();
      user.id = 'fake id';
      jest.spyOn(postsRepo, 'findOne').mockReturnValue(post);
      await postsService.likePost(user, post.id, true);
      expect(activity.logPostEvent).toHaveBeenCalledTimes(1);
      expect(activity.logPostEvent).toHaveBeenCalledWith(
        user,
        ActivityType.Like,
        post.id,
      );
    });
  });

  describe('flagPost method', () => {
    it('should call the Posts repository findOne with flagged post id', async () => {
      const user = new User();
      user.id = 'fake id';
      jest.spyOn(postsRepo, 'findOne').mockReturnValue(post);
      await postsService.flagPost(user, post.id, true);
      expect(postsRepo.findOne).toHaveBeenCalledTimes(1);
      expect(postsRepo.findOne).toHaveBeenCalledWith({
        where: {
          id: post.id,
          isDeleted: false,
        },
      });
    });
    it('should throw Error if flagged post not found', async () => {
      const user = new User();
      user.id = 'fake id';
      jest
        .spyOn(postsRepo, 'findOne')
        .mockReturnValue(Promise.resolve(undefined));
      expect.assertions(1);
      await expect(
        postsService.flagPost(user, post.id, true),
      ).rejects.toThrowError();
    });
    it('should throw Error if flagged post is locked', async () => {
      const user = new User();
      user.id = 'fake id';
      post.isLocked = true;
      jest.spyOn(postsRepo, 'findOne').mockReturnValue(Promise.resolve(post));
      expect.assertions(1);
      await expect(
        postsService.flagPost(user, post.id, true),
      ).rejects.toThrowError();
    });
    it('should throw Error if loggedUser same as flagged post owner', async () => {
      const user = new User();
      user.id = 'fake id';
      post.user = user;
      jest.spyOn(postsRepo, 'findOne').mockReturnValue(Promise.resolve(post));
      expect.assertions(1);
      await expect(
        postsService.flagPost(user, post.id, true),
      ).rejects.toThrowError();
    });
    it('should throw Error if post has been already (un)flagged', async () => {
      const user = new User();
      user.id = 'fake id';
      jest.spyOn(postsRepo, 'findOne').mockReturnValue(Promise.resolve(post));
      expect.assertions(1);
      await expect(
        postsService.flagPost(user, post.id, false),
      ).rejects.toThrowError();
    });
    // it('should call the Posts repository createQueryBuilder.', async () => {
    //   const user = new User();
    //   user.id = 'fake id';
    //   jest.spyOn(postsRepo, 'findOne').mockReturnValue(post);
    //   await postsService.flagPost(user, post.id, true);
    //   expect(postsRepo.createQueryBuilder).toHaveBeenCalledTimes(1);
    // });
    // it('should call ActivityService logPostEvent method with flagged post id', async () => {
    //   const user = new User();
    //   user.id = 'fake id';
    //   jest.spyOn(postsRepo, 'findOne').mockReturnValue(post);
    //   await postsService.flagPost(user, post.id, true);
    //   expect(activity.logPostEvent).toHaveBeenCalledTimes(1);
    //   expect(activity.logPostEvent).toHaveBeenCalledWith(
    //     user,
    //     ActivityType.Flag,
    //     post.id,
    //   );
    // });
    // it('should call NotificationService notifyAdmins method with flagged post id', async () => {
    //   const user = new User();
    //   user.id = 'fake id';
    //   jest.spyOn(postsRepo, 'findOne').mockReturnValue(post);
    //   await postsService.flagPost(user, post.id, true);
    //   expect(notification.notifyAdmins).toHaveBeenCalledTimes(1);
    //   expect(notification.notifyAdmins).toHaveBeenCalledWith(
    //     NotificationType.Post,
    //     ActionType.Flag,
    //     `posts/${post.id}`,
    //   );
    // });
    it('should return a PostShowDTO of flagged post', async () => {
      const user = new User();
      user.id = 'fake id';
      jest.spyOn(postsRepo, 'findOne').mockReturnValue(post);
      const result = await postsService.flagPost(user, post.id, true);
      expect(result).toBeInstanceOf(PostShowDTO);
      expect(result).toEqual(expect.objectContaining({ id: 1 }));
    });
  });

  describe('lockPost method', () => {
    it('should call the posts Repository findOne method with locked post id', async () => {
      jest.spyOn(postsRepo, 'findOne').mockReturnValue(Promise.resolve(post));
      await postsService.lockPost(post.id, true);
      expect(postsRepo.findOne).toHaveBeenCalledTimes(1);
      expect(postsRepo.findOne).toHaveBeenCalledWith({
        where: {
          id: post.id,
          isDeleted: false,
        },
      });
    });
    it('should throw Error if locked post not found', async () => {
      jest
        .spyOn(postsRepo, 'findOne')
        .mockReturnValue(Promise.resolve(undefined));
      expect.assertions(1);
      await expect(postsService.lockPost(post.id, true)).rejects.toThrowError();
    });
    it('should throw Error if post has been already (un)locked', async () => {
      jest.spyOn(postsRepo, 'findOne').mockReturnValue(Promise.resolve(post));
      await expect(
        postsService.lockPost(post.id, false),
      ).rejects.toThrowError();
    });
    it('should call the posts Repository save method with locked post id', async () => {
      jest.spyOn(postsRepo, 'findOne').mockReturnValue(Promise.resolve(post));
      await postsService.lockPost(post.id, true);
      expect(postsRepo.save).toHaveBeenCalledTimes(1);
      expect(postsRepo.save).toHaveBeenCalledWith({
        ...post,
        isLocked: true,
      });
    });
    it('should return a PostShowDTO of locked post', async () => {
      jest.spyOn(postsRepo, 'findOne').mockReturnValue(post);
      const result = await postsService.lockPost(post.id, true);
      expect(result).toBeInstanceOf(PostShowDTO);
      expect(result).toEqual(expect.objectContaining({ id: 1 }));
    });
  });

  describe('delete method', () => {
    it('should call the posts Repository findOne method with deleted post id', async () => {
      jest.spyOn(postsRepo, 'findOne').mockReturnValue(Promise.resolve(post));
      const user: User = new User();
      await postsService.deletePost(user, post.id, true);
      expect(postsRepo.findOne).toHaveBeenCalledTimes(1);
      expect(postsRepo.findOne).toHaveBeenCalledWith({
        where: {
          id: post.id,
          isDeleted: false,
        },
      });
    });
    it('should throw Error if deleted post not found', async () => {
      jest
        .spyOn(postsRepo, 'findOne')
        .mockReturnValue(Promise.resolve(undefined));
      const user: User = new User();
      expect.assertions(1);
      await expect(
        postsService.deletePost(user, post.id, true),
      ).rejects.toThrowError();
    });
    it('should throw Error if loggedUser is not owner of the deleted post or Admin', async () => {
      jest.spyOn(postsRepo, 'findOne').mockReturnValue(Promise.resolve(post));
      const user: User = new User();
      user.id = 'fake id';
      await expect(
        postsService.deletePost(user, post.id, false),
      ).rejects.toThrowError();
    });
    it('should call the posts Repository save method with deleted post id', async () => {
      jest.spyOn(postsRepo, 'findOne').mockReturnValue(Promise.resolve(post));
      const user: User = new User();
      await postsService.deletePost(user, post.id, true);
      expect(postsRepo.save).toHaveBeenCalledTimes(1);
      expect(postsRepo.save).toHaveBeenCalledWith({
        ...post,
        isDeleted: true,
      });
    });
    it('should return a PostShowDTO of deleted post', async () => {
      jest.spyOn(postsRepo, 'findOne').mockReturnValue(post);
      const user: User = new User();
      const result = await postsService.deletePost(user, post.id, true);
      expect(result).toBeInstanceOf(PostShowDTO);
      expect(result).toEqual(expect.objectContaining({ id: 1 }));
    });
  });
});
