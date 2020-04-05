import { Controller, Post, Body, Get, Param, HttpCode, HttpStatus, Put, Delete, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostCreateDTO } from '../../models/posts/post-create.dto';
import { PostShowDTO } from '../../models/posts/post-show.dto';
import { PostUpdateDTO } from '../../models/posts/post-update.dto';
import { ReqUser as LoggedUser } from '../../common/decorators/user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AuthGuardWithBlacklisting } from '../../common/guards/auth-guard-with-blacklisting.guard';
import { BanGuard } from '../../common/guards/ban.guard';
import { User } from '../../database/entities/user.entity';

@Controller('/posts')
@UseGuards(AuthGuardWithBlacklisting, RolesGuard)
export class PostsController {

  constructor(private readonly postsService: PostsService) { }

  @Get()
  async getPosts(): Promise<PostShowDTO[]> {

    return await this.postsService.getPosts();
  }

  @Get('/:postId')
  async getSinglePost(
    @Param('postId', ParseIntPipe)
    postId: number
  ): Promise<PostShowDTO> {

    return await this.postsService.getSinglePost(postId);
  }

  @Post()
  @UseGuards(BanGuard)
  @HttpCode(HttpStatus.CREATED)
  async createPost(
    @LoggedUser() loggedUser: User,
    @Body(new ValidationPipe({
      whitelist: true,
      transform: true
    }))
    post: PostCreateDTO
  ): Promise<PostShowDTO> {

    return await this.postsService.createPost(post, loggedUser);
  }

  @Put('/:postId')
  @UseGuards(BanGuard)
  async updatePost(
    @LoggedUser() loggedUser: User,
    @Param('postId', ParseIntPipe)
    postId: number,
    @Body(new ValidationPipe({
      whitelist: true,
      skipMissingProperties: true,
      transform: true
    }))
    update: PostUpdateDTO
  ): Promise<PostShowDTO> {

    return await this.postsService.updatePost(update, loggedUser, postId);
  }

  @Put('/:postId/votes')
  @UseGuards(BanGuard)
  async likePost(
    @LoggedUser() loggedUser: User,
    @Param('postId', ParseIntPipe)
    postId: number,
  ): Promise<PostShowDTO> {

    return await this.postsService.likePost(loggedUser, postId)
  }

  @Put('/:postId/flag')
  @HttpCode(HttpStatus.OK)
  async flagPost(
    @LoggedUser() loggedUser: User,
    @Param('postId', ParseIntPipe) postId: number
  ): Promise<PostShowDTO> {

    return await this.postsService.flagPost(loggedUser, postId);
  }

  @Delete('/:postId')
  @UseGuards(BanGuard)
  async deletePost(
    @LoggedUser() loggedUser: User,
    @Param('postId', ParseIntPipe)
    postId: number,
  ): Promise<PostShowDTO> {

    return await this.postsService.deletePost(loggedUser, postId);
  }
}
