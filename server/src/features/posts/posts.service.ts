import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { CreatePostDTO } from '../../models/posts/create-post.dto';
import { PostDTO } from '../../models/posts/post.dto';
import { User } from '../../database/entities/user.entity';
import { Post } from '../../database/entities/post.entity';

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

  public async getSinglePost(postId: string): Promise<PostDTO> {

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

}
