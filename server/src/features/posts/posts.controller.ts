import { Controller, Post, Body, Get, Param, HttpCode, HttpStatus, Put, Delete, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDTO } from '../../models/posts/create-post.dto';
import { PostDTO } from '../../models/posts/post.dto';
import { UpdatePostDTO } from '../../models/posts/update-post.dto';

@Controller('/posts')
export class PostsController {

  constructor(private readonly postsService: PostsService) { }

  @Get()
  async getPosts(): Promise<PostDTO[]> {

    return await this.postsService.getPosts();
  }

  @Get('/:postId')
  async getSinglePost(
    @Param('postId', ParseIntPipe)
    postId: number
  ): Promise<PostDTO> {

    return await this.postsService.getSinglePost(postId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost(
    @Body(new ValidationPipe({
      whitelist: true
    }))
    post: CreatePostDTO
  ): Promise<PostDTO> {

    //userId hardcoded until authentication
    const userId = 'cbb8c825-67ef-435f-abde-b3677fa75fe0'
    return await this.postsService.createPost(post, userId);
  }

  @Put('/:postId')
  async updatePost(
    @Param('postId', ParseIntPipe)
    postId: number,
    @Body(new ValidationPipe({
      whitelist: true, skipMissingProperties: true
    }))
    update: UpdatePostDTO
  ): Promise<PostDTO> {

    //userId hardcoded until authentication
    const userId = 'cbb8c825-67ef-435f-abde-b3677fa75fe0'
    return await this.postsService.updatePost(update, userId, postId);
  }

  @Delete('/:postId')
  async deletePost(
    @Param('postId', ParseIntPipe)
    postId: number,
  ): Promise<PostDTO> {

    //userId hardcoded until authentication
    const userId = 'cbb8c825-67ef-435f-abde-b3677fa75fe0'
    return await this.postsService.deletePost(userId, postId);
  }

}
