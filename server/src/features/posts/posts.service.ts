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

    const posts = await this.postsRepo.find({
      where: { isDeleted: false }
    });

    return posts.map(post => new PostDTO(post));
  }

  public async getSinglePost(postId: number): Promise<PostDTO> {

    const post = await this.postsRepo.findOne({
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

    if (userEntity === undefined) {
      throw new BadRequestException('User does not exist');
    }

    postEntity.user = userEntity
    postEntity.comments = Promise.resolve([]);
    const savedPost = await this.postsRepo.save(postEntity)

    return new PostDTO(savedPost)
  }

  public async updatePost(update: UpdatePostDTO, postId: number) {

    const post = await this.postsRepo.findOne({
      where: {
        id: postId,
        isDeleted: false
      }
    });

    if (post === undefined) {
      throw new BadRequestException('Post does not exist');
    }

    const updatedPost = { ...post, ...update }
    const savedPost = await this.postsRepo.save(updatedPost)

    return new PostDTO(savedPost)
  }

  public async deletePost(userId: string, postId: number): Promise<void> {
    const post = await this.postsRepo.findOne({
      where: {
        id: postId,
        isDeleted: false
      }
    });

    if (post === undefined) {
      throw new BadRequestException('Post does not exist');
    }
    if (post.user.id !== userId) {
      throw new BadRequestException('This post doesn\'t belong to the user')
    }

    post.isDeleted = true
    this.postsRepo.save(post);
  }

}
