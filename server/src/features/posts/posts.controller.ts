import { Controller, Post, Body, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDTO } from '../../models/posts/create-post.dto';
import { PostDTO } from '../../models/posts/post.dto';

@Controller('users/:userId/posts')
export class PostsController {

  constructor(private readonly postsService: PostsService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getPosts(): Promise<PostDTO[]> {

    return await this.postsService.getPosts();
  }

  @Get('/:postId')
  @HttpCode(HttpStatus.OK)
  async getSinglePosts(@Param('postId') postId: string): Promise<PostDTO> {

    return await this.postsService.getSinglePost(postId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost(
    @Param('userId') userId: string,
    @Body() post: CreatePostDTO
  ): Promise<PostDTO> {

    return await this.postsService.createPost(post, userId);
  }

}
