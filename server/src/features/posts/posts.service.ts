import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { CreatePostDTO } from '../../models/posts/create-post.dto';
import { PostDTO } from '../../models/posts/post.dto';
import { User } from '../../database/entities/user.entity';
import { Post } from '../../database/entities/post.entity';
import { UpdatePostDTO } from '../../models/posts/update-post.dto';
import { Repository } from 'typeorm';
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

    return posts.map(post => new PostDTO(post));
  }

  public async getSinglePost(postId: number): Promise<PostDTO> {

    const post: Post = await this.postsRepo.findOne({
      where: {
        isDeleted: false,
        id: postId
      }
    });

    if (post === undefined) {
      throw new BadRequestException('Post does not exist');
    }

    return new PostDTO(post);
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

    return new PostDTO(savedPost)
  }

  public async updatePost(update: UpdatePostDTO, userId: string, postId: number) {

    const post: Post = await this.postsRepo.findOne({
      where: {
        id: postId,
        isDeleted: false
      }
    });

    if (post === undefined) {
      throw new BadRequestException('Post does not exist');
    }
    if (post.user.id !== userId) {
      throw new BadRequestException('Not allowed to modify other users posts')
    }

    const savedPost = await this.postsRepo.save({ ...post, ...update })

    return new PostDTO(savedPost)
  }

  public async likePost(userId: string, postId: number): Promise<PostDTO> {

    const post: Post = await this.postsRepo.findOne({
      where: {
        id: postId,
        isDeleted: false
      }
    });

    if (post === undefined) {
      throw new BadRequestException('Post does not exist');
    }
    if (post.user.id === userId) {
      throw new BadRequestException('Not allowed to like user\'s own posts')
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

    return new PostDTO(post)
  }

  public async flagPost(userId: string, postId: number): Promise<PostDTO> {

    const foundPost: Post = await this.postsRepo.findOne({
      where: {
        id: postId,
        isDeleted: false
      }
    })

    if (foundPost === undefined) {
      throw new BadRequestException('Post does not exist');
    }
    if (foundPost.user.id === userId) {
      throw new BadRequestException('Not allowed to flag user\'s own posts')
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

    // Send notification to admin
    await this.notificationsService.notify(NotificationType.Post, ActionType.Flag, foundPost.id);

    return new PostDTO(foundPost)
  }

  public async deletePost(userId: string, postId: number): Promise<PostDTO> {
    const post: Post = await this.postsRepo.findOne({
      where: {
        id: postId,
        isDeleted: false
      }
    });

    if (post === undefined) {
      throw new BadRequestException('Post does not exist');
    }
    if (post.user.id !== userId) {
      throw new BadRequestException('Not allowed to delete other users posts')
    }

    post.isDeleted = true
    const savedPost = await this.postsRepo.save(post);

    return new PostDTO(savedPost)
  }

}
