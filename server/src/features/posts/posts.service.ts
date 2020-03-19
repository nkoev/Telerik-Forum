import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { CreatePostDTO } from '../../models/posts/create-post.dto';
import { PostDTO } from '../../models/posts/post.dto';
import { User } from '../../entities/users.entity';
import { Post } from '../../entities/posts.entity';

@Injectable()
export class PostsService {

  constructor(
    @InjectRepository(Post) private readonly postsRepo: Repository<Post>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>
  ) { }

  public async getUserPosts(userId: string): Promise<PostDTO[]> {

    const posts = await this.postsRepo.find({ where: { user: { id: userId }, isDeleted: false } });

    return posts.map(post => new PostDTO(post));
  }



  public async getPosts(id: string): Promise<PostDTO[]> {
    let posts = await this.postsRepo.find({
      where: { isDeleted: false }
    });

    if (id) {
      posts = posts.filter((post) => post.id === +id)
    }

    return posts.map(post => new PostDTO(post));
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
