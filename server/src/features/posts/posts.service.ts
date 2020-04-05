import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { PostCreateDTO } from '../../models/posts/post-create.dto';
import { User } from '../../database/entities/user.entity';
import { Post } from '../../database/entities/post.entity';
import { PostUpdateDTO } from '../../models/posts/post-update.dto';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { ForumSystemException } from '../../common/exceptions/system-exception';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../../models/notifications/notifications.enum';
import { ActionType } from '../../models/notifications/actions.enum';
import { ActivityLogger } from '../../common/activity-logger';
import { ActivityType } from '../../models/activity/activity-type.enum';
import { ActivityTarget } from '../../models/activity/activity-target.enum';
import { PostShowDTO } from '../../models/posts/post-show.dto';

@Injectable()
export class PostsService {

  constructor(
    @InjectRepository(Post) private readonly postsRepo: Repository<Post>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    private readonly notificationsService: NotificationsService,
    private readonly activityLogger: ActivityLogger
  ) { }

  public async getPosts(): Promise<PostShowDTO[]> {

    const posts: Post[] = await this.postsRepo.find({
      where: { isDeleted: false }
    });

    return posts.map(this.toPostShowDTO);
  }

  public async getSinglePost(postId: number): Promise<PostShowDTO> {

    const post: Post = await this.postsRepo.findOne({
      where: {
        isDeleted: false,
        id: postId
      }
    });

    if (post === undefined) {
      throw new ForumSystemException('Post does not exist', 404);
    }

    return this.toPostShowDTO(post);
  }

  public async createPost(createPostShowDTO: PostCreateDTO, loggedUser: User): Promise<PostShowDTO> {

    const post: Post = this.postsRepo.create(createPostShowDTO);

    post.user = loggedUser
    post.comments = Promise.resolve([]);
    post.votes = []
    const savedPost = await this.postsRepo.save(post)
    await this.activityLogger.log(loggedUser, ActivityType.Create, ActivityTarget.Post)

    return this.toPostShowDTO(savedPost)
  }

  public async updatePost(update: PostUpdateDTO, loggedUser: User, postId: number) {

    const post: Post = await this.postsRepo.findOne({
      where: {
        id: postId,
        isDeleted: false
      }
    });

    if (post === undefined) {
      throw new ForumSystemException('Post does not exist', 404);
    }
    if (post.user.id !== loggedUser.id) {
      throw new ForumSystemException('Not allowed to modify other users posts', 403)
    }

    const savedPost = await this.postsRepo.save({ ...post, ...update })
    await this.activityLogger.log(loggedUser, ActivityType.Update, ActivityTarget.Post)

    return this.toPostShowDTO(savedPost)
  }

  public async likePost(loggedUser: User, postId: number): Promise<PostShowDTO> {

    const post: Post = await this.postsRepo.findOne({
      where: {
        id: postId,
        isDeleted: false
      }
    });

    if (post === undefined) {
      throw new ForumSystemException('Post does not exist', 404);
    }
    if (post.user.id === loggedUser.id) {
      throw new ForumSystemException('Not allowed to like user\'s own posts', 403)
    }

    const liked: boolean = post.votes.some((user) => user.id === loggedUser.id)

    const postVotes =
      this.postsRepo
        .createQueryBuilder()
        .relation('votes')
        .of(post)

    liked ?
      await postVotes
        .remove(loggedUser) :
      await postVotes
        .add(loggedUser)

    // if (!liked) {
    //   await this.notificationsService.notifyUsers(userId, NotificationType.Post, ActionType.Like, `posts/${postId}`);
    // }

    // await this.notificationsService.notifyUsers(userId, NotificationType.Post, ActionType.Like, `posts/${postId}`);
    await this.activityLogger.log(loggedUser, ActivityType.Like, ActivityTarget.Post)

    return this.toPostShowDTO(post)
  }

  public async flagPost(loggedUser: User, postId: number): Promise<PostShowDTO> {

    const foundPost: Post = await this.postsRepo.findOne({
      where: {
        id: postId,
        isDeleted: false
      }
    })

    if (foundPost === undefined) {
      throw new ForumSystemException('Post does not exist', 404);
    }
    if (foundPost.user.id === loggedUser.id) {
      throw new ForumSystemException('Not allowed to flag user\'s own posts', 403)
    }

    const flags: boolean = foundPost.flags.some((user) => user.id === loggedUser.id)

    const postFlags =
      this.postsRepo
        .createQueryBuilder()
        .relation('flags')
        .of(foundPost)

    flags ?
      await postFlags
        .remove(loggedUser) :
      await postFlags
        .add(loggedUser)

    // Send notification to admins
    if (!flags) {
      await this.notificationsService.notifyAdmins(NotificationType.Post, ActionType.Flag, `posts/${postId}`);
    }
    // await resourceService(Post).notify(NotificationType.Post, ActionType.Flag, foundPost.id);
    await this.activityLogger.log(loggedUser, ActivityType.Flag, ActivityTarget.Post)

    return this.toPostShowDTO(foundPost)
  }

  public async deletePost(loggedUser: User, postId: number): Promise<PostShowDTO> {
    const post: Post = await this.postsRepo.findOne({
      where: {
        id: postId,
        isDeleted: false
      }
    });

    if (post === undefined) {
      throw new ForumSystemException('Post does not exist', 404);
    }
    if (post.user.id !== loggedUser.id) {
      throw new ForumSystemException('Not allowed to delete other users posts', 403)
    }

    post.isDeleted = true
    const savedPost = await this.postsRepo.save(post);
    await this.activityLogger.log(loggedUser, ActivityType.Remove, ActivityTarget.Post)


    return this.toPostShowDTO(savedPost)
  }

  private toPostShowDTO(post: Post): PostShowDTO {
    return plainToClass(
      PostShowDTO,
      post, {
      excludeExtraneousValues: true
    });
  }

}
