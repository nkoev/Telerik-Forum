import { Controller, Post, Body, Get, Param, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDTO } from '../../models/posts/create-post.dto';
import { PostDTO } from '../../models/posts/post.dto';

@Controller('users')
export class PostsController {

  constructor(private readonly postsService: PostsService) { }

  @Get('/:userId/posts')
  @HttpCode(HttpStatus.OK)
  async getUserPosts(@Param('userId') userId: string): Promise<PostDTO[]> {

    return await this.postsService.getUserPosts(userId);
  }

  @Get('/posts')
  @HttpCode(HttpStatus.OK)
  async getPosts(@Query('id') id: string): Promise<PostDTO[]> {

    return await this.postsService.getPosts(id);
  }

  @Post('/:userId/posts')
  @HttpCode(HttpStatus.CREATED)
  async createPost(
    @Param('userId') userId: string,
    @Body() post: CreatePostDTO
  ): Promise<PostDTO> {

    return await this.postsService.createPost(post, userId);
  }
}
