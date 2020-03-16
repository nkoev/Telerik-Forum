import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Post } from '../../entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {

  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>
  ) { }

  public async getAllPosts(): Promise<Post[]> {

    return await this.postRepository.find({});
  }

  public async createPost(post: Partial<Post>): Promise<Post> {

    return await this.postRepository.save(post)
  }
}
