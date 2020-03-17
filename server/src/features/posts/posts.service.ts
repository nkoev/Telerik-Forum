import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Post } from '../../entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDTO } from '../../models/posts/create-post.dto';
import { PostDTO } from '../../models/posts/post.dto';

@Injectable()
export class PostsService {

  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>
  ) { }

  public async getPosts(id: string): Promise<PostDTO[]> {
    let posts = await this.postRepository.find({
      where: { isDeleted: false }
    });

    if (id) {
      posts = posts.filter((post) => post.id === +id)
    }

    return posts.map((post) => this.PostEntityToDto(post));
  }

  public async createPost(post: CreatePostDTO): Promise<void> {

    const postEntity: Post = this.postRepository.create(post);

    await this.postRepository.save(postEntity)
  }

  private PostEntityToDto(entity: Post): PostDTO {
    const dto = new PostDTO
    dto.id = entity.id
    dto.title = entity.title
    dto.content = entity.content
    dto.userId = entity.userId
    return dto
  }
}
