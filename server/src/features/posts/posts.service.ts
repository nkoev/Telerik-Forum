import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { CreatePostDTO } from '../../models/posts/create-post.dto';
import { PostDTO } from '../../models/posts/post.dto';
import { User } from '../../database/entities/user.entity';
import { Post } from '../../database/entities/post.entity';
import { UpdatePostDTO } from '../../models/posts/update-post.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class PostsService {

  constructor(
    @InjectRepository(Post) private readonly postsRepo: Repository<Post>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>
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
      throw new BadRequestException('Post does not exist');
    }

    return this.toPostDTO(post);
  }

  public async createPost(post: CreatePostDTO, userId: string): Promise<PostDTO> {

    const postEntity: Post = this.postsRepo.create(post);
    const userEntity: User = await this.usersRepo.findOne({
      where: {
        id: userId,
        isDeleted: false
      }
    })

    postEntity.user = userEntity
    postEntity.comments = Promise.resolve([]);
    const savedPost = await this.postsRepo.save(postEntity)

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
      throw new BadRequestException('Post does not exist');
    }
    if (post.user.id !== userId) {
      throw new BadRequestException('Not allowed to modify other users posts')
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
      throw new BadRequestException('Post does not exist');
    }
    if (post.user.id === userId) {
      throw new BadRequestException('Not allowed to like user\'s own posts')
    }

    const liked: boolean = post.votes.some((user) => user.id === userId)

    const queryBuilder =
      this.postsRepo
        .createQueryBuilder()
        .relation('votes')
        .of(post)

    liked ?
      await queryBuilder
        .remove(userId) :
      await queryBuilder
        .add(userId)

    return this.toPostDTO(post)
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
