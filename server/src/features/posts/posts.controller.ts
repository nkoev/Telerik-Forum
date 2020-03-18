import { Controller, Post, Body, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDTO } from '../../models/posts/create-post.dto';
import { ShowPostDTO } from '../../models/posts/show-post.dto';

@Controller('users')
export class PostsController {

  constructor(private readonly postsService: PostsService) { }

  @Get('/:userId/posts')
  @HttpCode(HttpStatus.OK)
  async getPosts(@Param('userId') userId: string): Promise<ShowPostDTO[]> {

    return await this.postsService.getAllPosts(userId);
  }

  @Post('/:userId/posts')
  @HttpCode(HttpStatus.CREATED)
  async createPost(
    @Param('userId') userId: string,
    @Body() post: CreatePostDTO
  ): Promise<ShowPostDTO> {

    return await this.postsService.createPost(userId, post);
  }
}
