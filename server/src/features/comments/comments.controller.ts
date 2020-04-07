import { Controller, Post, Body, Param, Get, HttpCode, HttpStatus, Put, Delete, ParseIntPipe, ValidationPipe, UseGuards, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentCreateDTO } from '../../models/comments/comment-create.dto';
import { CommentShowDTO } from '../../models/comments/comment-show.dto';
import { CommentUpdateDTO } from '../../models/comments/comment-update.dto';
import { AuthGuardWithBlacklisting } from '../../common/guards/auth-guard-with-blacklisting.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { BanGuard } from '../../common/guards/ban.guard';
import { LoggedUser } from '../../common/decorators/user.decorator';
import { User } from '../../database/entities/user.entity';
import { IsAdmin } from '../../common/decorators/is-admin.decorator';
import { ParseBoolPipe } from '../../common/pipes/parse-bool.pipe';

@Controller('posts/:postId/comments')
@UseGuards(AuthGuardWithBlacklisting, RolesGuard)
export class CommentsController {

    constructor(private readonly commentsService: CommentsService) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    async getComments(
        @Param('postId', ParseIntPipe) postId: number
    ): Promise<CommentShowDTO[]> {

        return await this.commentsService.getComments(postId);
    }

    @Get('/:commentId')
    @HttpCode(HttpStatus.OK)
    async getSingleComment(
        @Param('postId', ParseIntPipe) postId: number,
        @Param('commentId', ParseIntPipe) commentId: number
    ): Promise<CommentShowDTO> {

        return await this.commentsService.getSingleComment(postId, commentId);
    }

    @Post()
    @UseGuards(BanGuard)
    @HttpCode(HttpStatus.CREATED)
    async createPostComment(
        @LoggedUser() loggedUser: User,
        @Param('postId', ParseIntPipe) postId: number,
        @Body(new ValidationPipe({
            whitelist: true,
            transform: true
        })) comment: CommentCreateDTO
    ): Promise<CommentShowDTO> {

        return await this.commentsService.createPostComment(comment, postId, loggedUser);
    }

    @Put('/:commentId')
    @UseGuards(BanGuard)
    @HttpCode(HttpStatus.OK)
    async updatePostComment(
        @LoggedUser() loggedUser: User,
        @IsAdmin() isAdmin: boolean,
        @Param('postId', ParseIntPipe) postId: number,
        @Param('commentId', ParseIntPipe) commentId: number,
        @Body(new ValidationPipe({
            whitelist: true,
            transform: true
        })) update: CommentUpdateDTO
    ): Promise<CommentShowDTO> {

        return await this.commentsService.updatePostComment(update, postId, commentId, loggedUser, isAdmin);
    }

    @Put('/:commentId/votes')
    @UseGuards(BanGuard)
    @HttpCode(HttpStatus.OK)
    async likeComment(
        @LoggedUser() loggedUser: User,
        @Param('postId', ParseIntPipe) postId: number,
        @Param('commentId', ParseIntPipe) commentId: number,
        @Query('state', ParseBoolPipe) state: boolean
    ): Promise<CommentShowDTO> {

        return await this.commentsService.likePostComment(loggedUser, postId, commentId, state);
    }

    @Delete('/:commentId')
    @UseGuards(BanGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePostComment(
        @LoggedUser() loggedUser: User,
        @IsAdmin() isAdmin: boolean,
        @Param('postId', ParseIntPipe) postId: number,
        @Param('commentId', ParseIntPipe) commentId: number
    ): Promise<CommentShowDTO> {

        return await this.commentsService.deletePostComment(loggedUser, postId, commentId, isAdmin);
    }
}
