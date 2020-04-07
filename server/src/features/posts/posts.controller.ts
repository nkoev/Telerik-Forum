import { Controller, Post, Body, Get, Param, HttpCode, HttpStatus, Put, Delete, ValidationPipe, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostCreateDTO } from '../../models/posts/post-create.dto';
import { PostShowDTO } from '../../models/posts/post-show.dto';
import { PostUpdateDTO } from '../../models/posts/post-update.dto';
import { LoggedUser } from '../../common/decorators/user.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AuthGuardWithBlacklisting } from '../../common/guards/auth-guard-with-blacklisting.guard';
import { BanGuard } from '../../common/guards/ban.guard';
import { User } from '../../database/entities/user.entity';
import { AccessLevel } from '../../common/decorators/roles.decorator';
import { IsAdmin } from '../../common/decorators/is-admin.decorator';
import { ParseBoolPipe } from '../../common/pipes/parse-bool.pipe';

@Controller('/posts')
@UseGuards(AuthGuardWithBlacklisting, RolesGuard)
export class PostsController {

  constructor(private readonly postsService: PostsService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getPosts(): Promise<PostShowDTO[]> {

    return await this.postsService.getPosts();
  }

  @Get('/:postId')
  @HttpCode(HttpStatus.OK)
  async getSinglePost(
    @Param('postId', ParseIntPipe) postId: number
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
    })) post: PostCreateDTO
  ): Promise<PostShowDTO> {

    return await this.postsService.createPost(post, loggedUser);
  }

  @Put('/:postId')
  @UseGuards(BanGuard)
  @HttpCode(HttpStatus.OK)
  async updatePost(
    @IsAdmin() isAdmin: boolean,
    @LoggedUser() loggedUser: User,
    @Param('postId', ParseIntPipe) postId: number,
    @Body(new ValidationPipe({
      whitelist: true,
      transform: true,
      skipMissingProperties: true
    })) update: PostUpdateDTO
  ): Promise<PostShowDTO> {

    return await this.postsService.updatePost(update, loggedUser, postId, isAdmin);
  }

  @Put('/:postId/votes')
  @UseGuards(BanGuard)
  @HttpCode(HttpStatus.OK)
  async likePost(
    @LoggedUser() loggedUser: User,
    @Param('postId', ParseIntPipe) postId: number,
    @Query('state', ParseBoolPipe) state: boolean
  ): Promise<PostShowDTO> {

    return await this.postsService.likePost(loggedUser, postId, state)
  }

  @Put('/:postId/flag')
  @UseGuards(BanGuard)
  @HttpCode(HttpStatus.OK)
  async flagPost(
    @LoggedUser() loggedUser: User,
    @Param('postId', ParseIntPipe) postId: number,
    @Query('state', ParseBoolPipe) state: boolean
  ): Promise<PostShowDTO> {

    return await this.postsService.flagPost(loggedUser, postId, state);
  }

  @Put('/:postId/lock')
  @AccessLevel('Admin')
  @HttpCode(HttpStatus.OK)
  async lockPost(
    @Param('postId', ParseIntPipe) postId: number,
    @Query('state', ParseBoolPipe) state: boolean
  ): Promise<PostShowDTO> {

    return await this.postsService.lockPost(postId, state);
  }

  @Delete('/:postId')
  @UseGuards(BanGuard)
  @HttpCode(HttpStatus.OK)
  async deletePost(
    @IsAdmin() isAdmin: boolean,
    @LoggedUser() loggedUser: User,
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<PostShowDTO> {

    return await this.postsService.deletePost(loggedUser, postId, isAdmin);
  }
}
