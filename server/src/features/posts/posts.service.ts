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
import { ActivityService } from '../core/activity.service';
import { ActivityType } from '../../models/activity/activity-type.enum';
import { PostShowDTO } from '../../models/posts/post-show.dto';

@Injectable()
export class PostsService {

  constructor(
    @InjectRepository(Post) private readonly postsRepo: Repository<Post>,
    private readonly notificationsService: NotificationsService,
    private readonly activityService: ActivityService
  ) { }

  public async getPosts(): Promise<PostShowDTO[]> {

    const posts: Post[] = await this.postsRepo.find({
      where: { isDeleted: false }
    });

    return posts.map(this.toPostShowDTO);
  }

  public async getSinglePost(postId: number): Promise<PostShowDTO> {

    const post: Post = await this.getPostEntity(postId);

    this.validatePost(post);

    return this.toPostShowDTO(post);
  }

  public async createPost(postCreateDTO: PostCreateDTO, loggedUser: User): Promise<PostShowDTO> {

    const newPost: Post = this.postsRepo.create({
      ...postCreateDTO,
      user: loggedUser,
      comments: Promise.resolve([]),
      votes: []
    });
    const savedPost = await this.postsRepo.save(newPost);

    await this.activityService.logPostEvent(loggedUser, ActivityType.Create, savedPost.id)

    return this.toPostShowDTO(savedPost)
  }

  public async updatePost(update: PostUpdateDTO, loggedUser: User, postId: number, isAdmin: boolean) {

    const post: Post = await this.getPostEntity(postId);

    this.validatePost(post);
    this.validatePostIsLocked(post);

    if (post.user !== loggedUser && !isAdmin) {
      throw new ForumSystemException('Not allowed to modify other users posts', 403)
    }

    const savedPost = await this.postsRepo.save({ ...post, ...update });
    await this.activityService.logPostEvent(loggedUser, ActivityType.Update, savedPost.id);

    return this.toPostShowDTO(savedPost);
  }

  public async likePost(loggedUser: User, postId: number, state: boolean): Promise<PostShowDTO> {

    const post: Post = await this.getPostEntity(postId);
    this.validatePost(post);
    this.validatePostIsLocked(post);

    if (post.user.id === loggedUser.id) {
      throw new ForumSystemException('Not allowed to like user\'s own posts', 403)
    }

    const likes = this.postsRepo
      .createQueryBuilder()
      .relation('votes')
      .of(post)

    try {
      state
        ? await likes.add(loggedUser)
        : await likes.remove(loggedUser)
    } catch (e) {
      throw new ForumSystemException('User has already (un)liked this post', 400)
    }
    await this.activityService.logPostEvent(loggedUser, ActivityType.Like, postId);

    return this.toPostShowDTO(post)
  }

  public async flagPost(loggedUser: User, postId: number): Promise<PostShowDTO> {

    const post: Post = await this.getPostEntity(postId);

    this.validatePost(post);
    this.validatePostIsLocked(post);

    if (post.user.id === loggedUser.id) {
      throw new ForumSystemException('Not allowed to flag user\'s own posts', 403)
    }

    const flagged: boolean = post.flags.some((user) => user === loggedUser)

    const postFlags =
      this.postsRepo
        .createQueryBuilder()
        .relation('flags')
        .of(post)

    flagged ?
      await postFlags
        .remove(loggedUser) :
      await postFlags
        .add(loggedUser)

    if (!flagged) {
      await this.notificationsService.notifyAdmins(NotificationType.Post, ActionType.Flag, `posts/${postId}`);
      await this.activityService.logPostEvent(loggedUser, ActivityType.Flag, postId)
    }

    return this.toPostShowDTO(post)
  }

  public async lockPost(postId: number): Promise<PostShowDTO> {
    const post: Post = await this.getPostEntity(postId);

    this.validatePost(post);

    post.isLocked
      ? post.isLocked = false
      : post.isLocked = true;

    const updatedPost = await this.postsRepo.save(post);

    return this.toPostShowDTO(updatedPost)
  }

  public async deletePost(loggedUser: User, postId: number, isAdmin: boolean): Promise<PostShowDTO> {
    const post: Post = await this.getPostEntity(postId);

    this.validatePost(post);

    if (post.user.id !== loggedUser.id && !isAdmin) {
      throw new ForumSystemException('Not allowed to delete other users posts', 403)
    }

    const savedPost = await this.postsRepo.save({
      ...post,
      isDeleted: true
    });
    await this.activityService.logPostEvent(loggedUser, ActivityType.Remove, postId)

    return this.toPostShowDTO(savedPost)
  }

  private toPostShowDTO(post: Post): PostShowDTO {
    return plainToClass(
      PostShowDTO,
      post, {
      excludeExtraneousValues: true
    });
  }

  private async getPostEntity(postId: number): Promise<Post> {
    return await this.postsRepo.findOne({
      where: {
        isDeleted: false,
        id: postId
      }
    });
  }

  private validatePost(post: Post): void {
    if (!post) {
      throw new ForumSystemException('Post does not exist', 404);
    }
  }

  private validatePostIsLocked(post: Post): void {
    if (post.isLocked) {
      throw new ForumSystemException('Post is locked', 403)
    }
  }

}
