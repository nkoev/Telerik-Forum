import { Controller, Post, Body, Get } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {

  constructor(private readonly postsService: PostsService) { }

  @Get()
  async getPost() {

    return await this.postsService.getAllPosts()
  }

  @Post()
  async createPost(
    @Body('title') title: string,
    @Body('content') content: string
  ) {

    return await this.postsService.createPost({ "title": title, "content": content, "isDeleted": false });
  }
}
