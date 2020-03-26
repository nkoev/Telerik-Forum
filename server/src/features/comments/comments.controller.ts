import { Controller, Post, Body, Param, Get, HttpCode, HttpStatus, Query, Put, Delete, ParseIntPipe, ParseUUIDPipe, ValidationPipe } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDTO } from '../../models/comments/create-comment.dto';
import { ShowCommentDTO } from '../../models/comments/show-comment.dto';
import { UpdateCommentDTO } from '../../models/comments/update-comment.dto';
import { User } from '../../database/entities/user.entity';

@Controller('posts')
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
    @HttpCode(HttpStatus.OK)
    async likeComment(
        @Param('postId', ParseIntPipe) postId: number,
        @Param('commentId', ParseIntPipe) commentId: number,
    ): Promise<User[]> {

        //userId hardcoded until authentication
        const userId = 'dffe2e7a-ba77-43a4-90a9-1b1e15af796c'
        return await this.commentsService.likePostComment(userId, postId, commentId);
    }

    @Delete('/:postId/comments/:commentId')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePostComment(
        @Query('userId', ParseUUIDPipe) userId: string,
        @Param('postId', ParseIntPipe) postId: number,
        @Param('commentId', ParseIntPipe) commentId: number
    ): Promise<ShowCommentDTO> {

        return await this.commentsService.deletePostComment(userId, postId, commentId);
    }
}
