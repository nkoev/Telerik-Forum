import { Controller, Post, Body, Get, Param, HttpCode, HttpStatus, Put, Delete, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDTO } from '../../models/posts/create-post.dto';
import { PostDTO } from '../../models/posts/post.dto';
import { UpdatePostDTO } from '../../models/posts/update-post.dto';
import { User } from '../../common/decorators/user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserShowDTO } from '../../models/users/user-show.dto';
import { AuthGuardWithBlacklisting } from '../../common/guards/auth-guard-with-blacklisting.guard';

@Controller('/posts')
// @UseGuards(RolesGuard)
export class PostsController {

  constructor(private readonly postsService: PostsService) { }

  @Get()
  // @UseGuards(AuthGuardWithBlacklisting)
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
    @User() user: UserShowDTO,
    @Body(new ValidationPipe({
      whitelist: true,
      transform: true
    }))
    post: CreatePostDTO
  ): Promise<PostDTO> {

    return await this.postsService.createPost(post, user.id);
  }

  @Put('/:postId')
  async updatePost(
    @User() user: UserShowDTO,
    @Param('postId', ParseIntPipe)
    postId: number,
    @Body(new ValidationPipe({
      whitelist: true,
      skipMissingProperties: true,
      transform: true
    }))
    update: UpdatePostDTO
  ): Promise<PostDTO> {

    return await this.postsService.updatePost(update, user.id, postId);
  }

  @Put('/:postId/votes')
  async likePost(
    @User() user: UserShowDTO,
    @Param('postId', ParseIntPipe)
    postId: number,
  ): Promise<PostDTO> {

    return await this.postsService.likePost(user.id, postId)
  }

  @Delete('/:postId')
  async deletePost(
    @User() user: UserShowDTO,
    @Param('postId', ParseIntPipe)
    postId: number,
  ): Promise<PostDTO> {

    return await this.postsService.deletePost(user.id, postId);
  }

}
