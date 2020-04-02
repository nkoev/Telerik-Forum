import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { CreatePostDTO } from '../../models/posts/create-post.dto';
import { PostDTO } from '../../models/posts/post.dto';
import { User } from '../../database/entities/user.entity';
import { Post } from '../../database/entities/post.entity';
import { UpdatePostDTO } from '../../models/posts/update-post.dto';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { ForumSystemException } from '../../common/exceptions/system-exception';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../../models/notifications/notifications.enum';
import { ActionType } from '../../models/notifications/actions.enum';

@Injectable()
export class PostsService {

  constructor(
    @InjectRepository(Post) private readonly postsRepo: Repository<Post>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    private readonly notificationsService: NotificationsService
  ) { }

  public async getPosts(): Promise<PostDTO[]> {

    const posts: Post[] = await this.postsRepo.find({
      where: { isDeleted: false }
    });

    return posts.map(this.toPostDTO);
  }

  public async getSinglePost(postId: number): Promise<PostDTO> {

    const post: Post = await this.postsRepo.findOne({
      where: {
        isDeleted: false,
        id: postId
      }
    });

    if (post === undefined) {
      throw new ForumSystemException('Post does not exist', 404);
    }

    return this.toPostDTO(post);
  }

  public async createPost(createPostDTO: CreatePostDTO, userId: string): Promise<PostDTO> {

    const post: Post = this.postsRepo.create(createPostDTO);
    const user: User = await this.usersRepo.findOne({
      where: {
        id: userId,
        isDeleted: false
      }
    })

    post.user = user
    post.comments = Promise.resolve([]);
    post.votes = []
    const savedPost = await this.postsRepo.save(post)

    return this.toPostDTO(savedPost)
  }

  public async updatePost(update: UpdatePostDTO, userId: string, postId: number) {

    const post: Post = await this.postsRepo.findOne({
      where: {
        id: postId,
        isDeleted: false
      }
    });

    if (post === undefined) {
      throw new ForumSystemException('Post does not exist', 404);
    }
    if (post.user.id !== userId) {
      throw new ForumSystemException('Not allowed to modify other users posts', 403)
    }

    const savedPost = await this.postsRepo.save({ ...post, ...update })

    return this.toPostDTO(savedPost)
  }

  public async likePost(userId: string, postId: number): Promise<PostDTO> {

    const post: Post = await this.postsRepo.findOne({
      where: {
        id: postId,
        isDeleted: false
      }
    });

    if (post === undefined) {
      throw new ForumSystemException('Post does not exist', 404);
    }
    if (post.user.id === userId) {
      throw new ForumSystemException('Not allowed to like user\'s own posts', 403)
    }

    const liked: boolean = post.votes.some((user) => user.id === userId)

    const postVotes =
      this.postsRepo
        .createQueryBuilder()
        .relation('votes')
        .of(post)

    liked ?
      await postVotes
        .remove(userId) :
      await postVotes
        .add(userId)

    // if (!liked) {
    //   await this.notificationsService.notifyUsers(userId, NotificationType.Post, ActionType.Like, `posts/${postId}`);
    // }

    // await this.notificationsService.notifyUsers(userId, NotificationType.Post, ActionType.Like, `posts/${postId}`);

    return this.toPostDTO(post)
  }

  public async flagPost(userId: string, postId: number): Promise<PostDTO> {

    const foundPost: Post = await this.postsRepo.findOne({
      where: {
        id: postId,
        isDeleted: false
      }
    })

    if (foundPost === undefined) {
      throw new ForumSystemException('Post does not exist', 404);
    }
    if (foundPost.user.id === userId) {
      throw new ForumSystemException('Not allowed to flag user\'s own posts', 403)
    }

    const flags: boolean = foundPost.flags.some((user) => user.id === userId)

    const postFlags =
      this.postsRepo
        .createQueryBuilder()
        .relation('flags')
        .of(foundPost)

    flags ?
      await postFlags
        .remove(userId) :
      await postFlags
        .add(userId)

    // Send notification to admins
    if (!flags) {
      await this.notificationsService.notifyAdmins(NotificationType.Post, ActionType.Flag, `posts/${postId}`);
    }
    // await resourceService(Post).notify(NotificationType.Post, ActionType.Flag, foundPost.id);

    return this.toPostDTO(foundPost)
  }

  public async deletePost(userId: string, postId: number): Promise<PostDTO> {
    const post: Post = await this.postsRepo.findOne({
      where: {
        id: postId,
        isDeleted: false
      }
    });

    if (post === undefined) {
      throw new ForumSystemException('Post does not exist', 404);
    }
    if (post.user.id !== userId) {
      throw new ForumSystemException('Not allowed to delete other users posts', 403)
    }

    post.isDeleted = true
    const savedPost = await this.postsRepo.save(post);

    return this.toPostDTO(savedPost)
  }

  private toPostDTO(post: Post): PostDTO {
    return plainToClass(
      PostDTO,
      post, {
      excludeExtraneousValues: true
    });
  }

}
