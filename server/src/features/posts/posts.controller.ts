import { Controller, Post, Body, Get, Param, HttpCode, HttpStatus, Put } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDTO } from '../../models/posts/create-post.dto';
import { PostDTO } from '../../models/posts/post.dto';
import { UpdatePostDTO } from '../../models/posts/update-post.dto';

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
  async getSinglePost(@Param('postId') postId: string): Promise<PostDTO> {

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

  @Put('/:postId')
  @HttpCode(HttpStatus.ACCEPTED)
  async updatePost(
    @Param('postId') postId: string,
    @Body() update: UpdatePostDTO
  ): Promise<PostDTO> {

    return await this.postsService.updatePost(update, postId);
  }

}
