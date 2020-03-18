import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { Post } from '../../entities/posts.entity';
import { User } from '../../entities/users.entity';
import { CreatePostDTO } from '../../models/posts/create-post.dto';
import { ShowPostDTO } from '../../models/posts/show-post.dto';

@Injectable()
export class PostsService {

  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) { }

  public async getAllPosts(userId: string): Promise<ShowPostDTO[]> {

    const foundUser: User = await this.userRepository.findOne({
      id: userId
    });

    if (foundUser === undefined) {
      throw new BadRequestException('User does not exist');
    }

    const posts = await this.postRepository.find({ where: { user: { id: userId }, isDeleted: false } });

    return posts;
  }

  public async createPost(userId: string, post: CreatePostDTO): Promise<ShowPostDTO> {

    const newPost: Post = this.postRepository.create(post);
    const foundUser: User = await this.userRepository.findOne({
      id: userId
    });

    if (foundUser === undefined) {
      throw new BadRequestException('User does not exist');
    }

    newPost.user = Promise.resolve(foundUser);
    newPost.comments = Promise.resolve([]);
    newPost.isDeleted = false;

    await this.postRepository.save(newPost);

    return {
      title: newPost.title,
      content: newPost.content
    };
  }
}
