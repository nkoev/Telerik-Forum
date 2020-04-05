import { Controller, Post, Body, Get, Param, HttpCode, HttpStatus, Put, Delete, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDTO } from '../../models/posts/create-post.dto';
import { PostDTO } from '../../models/posts/post.dto';
import { UpdatePostDTO } from '../../models/posts/update-post.dto';
import { ReqUser } from '../../common/decorators/user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AuthGuardWithBlacklisting } from '../../common/guards/auth-guard-with-blacklisting.guard';
import { BanGuard } from '../../common/guards/ban.guard';
import { User } from '../../database/entities/user.entity';

@Controller('/posts')
@UseGuards(AuthGuardWithBlacklisting, RolesGuard)
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
  @UseGuards(BanGuard)
  @HttpCode(HttpStatus.CREATED)
  async createPost(
    @ReqUser() user: User,
    @Body(new ValidationPipe({
      whitelist: true,
      transform: true
    }))
    post: CreatePostDTO
  ): Promise<PostDTO> {

    return await this.postsService.createPost(post, user.id);
  }

  @Put('/:postId')
  @UseGuards(BanGuard)
  async updatePost(
    @ReqUser() user: User,
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
  @UseGuards(BanGuard)
  async likePost(
    @ReqUser() user: User,
    @Param('postId', ParseIntPipe)
    postId: number,
  ): Promise<PostDTO> {

    return await this.postsService.likePost(user.id, postId)
  }

  @Put('/:postId/flag')
  @HttpCode(HttpStatus.OK)
  async flagPost(
    @ReqUser() user: User,
    @Param('postId', ParseIntPipe) postId: number
  ): Promise<PostDTO> {

    return await this.postsService.flagPost(user.id, postId);
  }

  @Delete('/:postId')
  @UseGuards(BanGuard)
  async deletePost(
    @ReqUser() user: User,
    @Param('postId', ParseIntPipe)
    postId: number,
  ): Promise<PostDTO> {

    return await this.postsService.deletePost(user.id, postId);
  }
}
