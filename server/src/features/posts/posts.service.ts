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
    await this.activityService.logPostEvent(loggedUser, ActivityType.Create, savedPost.id)

    return this.toPostShowDTO(savedPost)
  }

  public async updatePost(update: PostUpdateDTO, loggedUser: User, postId: number) {

    const post: Post = await this.postsRepo.findOne({
      where: {
        id: postId,
        isDeleted: false
      }
    });

    if (!post) {
      throw new ForumSystemException('Post does not exist', 404);
    }
    if (post.isLocked) {
      throw new ForumSystemException('Post is locked', 403)
    }
    if (post.user !== loggedUser) {
      throw new ForumSystemException('Not allowed to modify other users posts', 403)
    }

    const savedPost = await this.postsRepo.save({ ...post, ...update })
    await this.activityService.logPostEvent(loggedUser, ActivityType.Update, savedPost.id)

    return this.toPostShowDTO(savedPost)
  }

  public async likePost(loggedUser: User, postId: number): Promise<PostShowDTO> {

    const post: Post = await this.postsRepo.findOne({
      where: {
        id: postId,
        isDeleted: false
      }
    });

    if (!post) {
      throw new ForumSystemException('Post does not exist', 404);
    }
    if (post.isLocked) {
      throw new ForumSystemException('Post is locked', 403)
    }
    if (post.user === loggedUser) {
      throw new ForumSystemException('Not allowed to like user\'s own posts', 403)
    }

    const liked: boolean = post.votes.some((user) => user === loggedUser)

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

    if (liked) {
      await this.activityService.logPostEvent(loggedUser, ActivityType.Unlike, postId);
    } else {
      await this.activityService.logPostEvent(loggedUser, ActivityType.Like, postId);
    }

    return this.toPostShowDTO(post)
  }

  public async flagPost(loggedUser: User, postId: number): Promise<PostShowDTO> {

    const post: Post = await this.postsRepo.findOne({
      where: {
        id: postId,
        isDeleted: false
      }
    })

    if (!post) {
      throw new ForumSystemException('Post does not exist', 404);
    }
    if (post.isLocked) {
      throw new ForumSystemException('Post is locked', 403)
    }
    if (post.user === loggedUser) {
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

  public async deletePost(loggedUser: User, postId: number): Promise<PostShowDTO> {
    const post: Post = await this.postsRepo.findOne({
      where: {
        id: postId,
        isDeleted: false
      }
    });

    if (!post) {
      throw new ForumSystemException('Post does not exist', 404);
    }
    if (post.user !== loggedUser) {
      throw new ForumSystemException('Not allowed to delete other users posts', 403)
    }

    post.isDeleted = true
    const savedPost = await this.postsRepo.save(post);
    await this.activityService.logPostEvent(loggedUser, ActivityType.Remove, postId)

    return this.toPostShowDTO(savedPost)
  }

  async lockPost(postId: number): Promise<PostShowDTO> {
    const post: Post = await this.postsRepo.findOne({
      where: {
        id: postId,
        isDeleted: false
      }
    });

    if (!post) {
      throw new ForumSystemException('Post does not exist', 404);
    }

    post.isLocked
      ? post.isLocked = false
      : post.isLocked = true;

    const updatedPost = await this.postsRepo.save(post);

    return this.toPostShowDTO(updatedPost)
  }

  private toPostShowDTO(post: Post): PostShowDTO {
    return plainToClass(
      PostShowDTO,
      post, {
      excludeExtraneousValues: true
    });
  }

}
