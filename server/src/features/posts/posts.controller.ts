import { Controller, Post, Body, Get, Param, HttpCode, HttpStatus, Put, Delete, ValidationPipe, ParseIntPipe, ParseUUIDPipe } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDTO } from '../../models/posts/create-post.dto';
import { PostDTO } from '../../models/posts/post.dto';
import { UpdatePostDTO } from '../../models/posts/update-post.dto';

@Controller('users/:userId/posts')
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
    @Param('userId', ParseUUIDPipe)
    userId: string,
    @Body(new ValidationPipe({
      whitelist: true
    }))
    post: CreatePostDTO
  ): Promise<PostDTO> {

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

    return await this.postsService.updatePost(update, postId);
  }

  @Delete('/:postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(
    @Param('userId', ParseUUIDPipe)
    userId: string,
    @Param('postId', ParseIntPipe)
    postId: number,
  ): Promise<void> {

    await this.postsService.deletePost(userId, postId);
  }

}
