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
  async createPost(@Body() body: CreatePostDTO): Promise<PostDTO> {

    //USER ID HARDCODED UNTIL AUTHENTICATION
    const addedUser: PostDTO = await this.postsService.createPost(body, 'c8874f07-7a19-4587-8e49-d3faac272110');

    return addedUser
  }
}
