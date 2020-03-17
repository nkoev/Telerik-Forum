import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDTO } from '../../models/posts/create-post.dto';
import { ResponseMessage } from '../../models/response-message.dto';
import { PostDTO } from '../../models/posts/post.dto';

@Controller('posts')
export class PostsController {

  constructor(private readonly postsService: PostsService) { }

  @Get()
  async getPosts(@Query('id') id: string): Promise<PostDTO[]> {

    return await this.postsService.getPosts(id);
  }

  @Post()
  async createPost(@Body() body: CreatePostDTO): Promise<ResponseMessage> {

    await this.postsService.createPost(body);

    return { msg: 'Post added' }
  }
}
