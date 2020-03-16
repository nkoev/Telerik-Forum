import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { Post } from '../../entities/posts.entity';

@Injectable()
export class PostsService {

  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>
  ) { }

  public async getAllPosts(id: string): Promise<Post[]> {

    return await this.postRepository.find({where: {userId: id}});
  }

  public async createPost(userId: string, post: Partial<Post>): Promise<Post> {

    post.userId = userId;
    
    return await this.postRepository.save(post)
  }
}
