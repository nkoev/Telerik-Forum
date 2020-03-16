import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('users')
export class PostsController {

  constructor(private readonly postsService: PostsService) { }

  @Get('/:userId/posts')
  async getPosts(@Param('userId') userId: string) {

    return await this.postsService.getAllPosts(userId);
  }

  @Post('/:userId/posts')
  async createPost(
    @Param('userId') userId: string,
    @Body('title') title: string,
    @Body('content') content: string
  ) {

    return await this.postsService.createPost(userId, { "title": title, "content": content, "isDeleted": false });
  }
}
