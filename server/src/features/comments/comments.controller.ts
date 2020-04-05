import { Controller, Post, Body, Param, Get, HttpCode, HttpStatus, Query, Put, Delete, ParseIntPipe, ParseUUIDPipe, ValidationPipe, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDTO } from '../../models/comments/create-comment.dto';
import { ShowCommentDTO } from '../../models/comments/show-comment.dto';
import { UpdateCommentDTO } from '../../models/comments/update-comment.dto';
import { AuthGuardWithBlacklisting } from '../../common/guards/auth-guard-with-blacklisting.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { BanGuard } from '../../common/guards/ban.guard';
import { LoggedUser } from '../../common/decorators/user.decorator';
import { User } from '../../database/entities/user.entity';

@Controller('posts')
@UseGuards(AuthGuardWithBlacklisting, RolesGuard)
export class CommentsController {

    constructor(private readonly commentsService: CommentsService) { }

    @Get('/:postId/comments')
    @HttpCode(HttpStatus.OK)
    async readPostComments(
        @Param('postId', ParseIntPipe) postId: number
    ): Promise<ShowCommentDTO[]> {

        return await this.commentsService.readPostComments(postId);
    }

    @Post('/:postId/comments')
    @UseGuards(BanGuard)
    @HttpCode(HttpStatus.CREATED)
    async createPostComment(
        @Query('userId', ParseUUIDPipe) userId: string,
        @Param('postId', ParseIntPipe) postId: number,
        @Body(new ValidationPipe({
            transform: true
        })) comment: CreateCommentDTO
    ): Promise<ShowCommentDTO> {

        return await this.commentsService.createPostComment(userId, postId, comment);
    }

    @Put('/:postId/comments/:commentId')
    @UseGuards(BanGuard)
    @HttpCode(HttpStatus.OK)
    async updatePostComment(
        @Query('userId', ParseUUIDPipe) userId: string,
        @Param('postId', ParseIntPipe) postId: number,
        @Param('commentId', ParseIntPipe) commentId: number,
        @Body(new ValidationPipe({
            transform: true
        })) comment: UpdateCommentDTO
    ): Promise<ShowCommentDTO> {

        return await this.commentsService.updatePostComment(userId, postId, commentId, comment);
    }

    @Put('/:postId/comments/:commentId/votes')
    @UseGuards(BanGuard)
    @HttpCode(HttpStatus.OK)
    async likeComment(
        @LoggedUser() loggedUser: User,
        @Param('postId', ParseIntPipe) postId: number,
        @Param('commentId', ParseIntPipe) commentId: number,
    ): Promise<ShowCommentDTO> {

        return await this.commentsService.likePostComment(loggedUser, postId, commentId);
    }

    @Delete('/:postId/comments/:commentId')
    @UseGuards(BanGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePostComment(
        @Query('userId', ParseUUIDPipe) userId: string,
        @Param('postId', ParseIntPipe) postId: number,
        @Param('commentId', ParseIntPipe) commentId: number
    ): Promise<ShowCommentDTO> {

        return await this.commentsService.deletePostComment(userId, postId, commentId);
    }
}
