import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { CreatePostDTO } from '../../models/posts/create-post.dto';
import { PostDTO } from '../../models/posts/post.dto';
import { User } from '../../database/entities/user.entity';
import { Post } from '../../database/entities/post.entity';
import { UpdatePostDTO } from '../../models/posts/update-post.dto';

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

  public async likePost(userId: string, postId: number): Promise<User[]> {

    const post: Post = await this.postsRepo.findOne({
      where: {
        id: postId,
        isDeleted: false
      }
    });
    const user: User = await this.usersRepo.findOne({ id: userId })

    if (post === undefined) {
      throw new BadRequestException('Post does not exist');
    }
    if (post.user.id === userId) {
      throw new BadRequestException('Not allowed to like user\'s own posts')
    }

    const votes: User[] = await post.votes
    const liked: number = votes.findIndex((user) => user.id === userId)

    liked === -1 ?
      votes.push(user) :
      votes.splice(liked, 1)

    post.votes = Promise.resolve(votes)
    await this.postsRepo.save(post)

    return post.votes // TO BE CONVERTED TO DTO
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
