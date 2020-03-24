import { Controller, Post, Body, Param, Get, HttpCode, HttpStatus, Query, Put, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDTO } from '../../models/comments/create-comment.dto';
import { ShowCommentDTO } from '../../models/comments/show-comment.dto';

@Controller('posts')
export class CommentsController {

    constructor(private readonly commentsService: CommentsService) { }

    @Get('/:postId/comments')
    @HttpCode(HttpStatus.OK)
    async readPostComments(
        @Param('postId') postId: string
    ): Promise<ShowCommentDTO[]> {

        return await this.commentsService.readPostComments(postId);
    }

    @Post('/:postId/comments')
    @HttpCode(HttpStatus.CREATED)
    async createPostComment(
        @Query('userId') userId: string,
        @Param('postId') postId: string,
        @Body() comment: CreateCommentDTO
    ): Promise<ShowCommentDTO> {

        return await this.commentsService.createPostComment(userId, postId, comment);
    }

    @Put('/:postId/comments/:commentId')
    @HttpCode(HttpStatus.OK)
    async updatePostComment(
        @Query('userId') userId: string,
        @Param('postId') postId: string,
        @Param('commentId') commentId: string,
        @Body() comment: CreateCommentDTO
    ): Promise<ShowCommentDTO> {

        return await this.commentsService.updatePostComment(userId, postId, commentId, comment);
    }

    @Delete('/:postId/comments/:commentId')
    @HttpCode(HttpStatus.OK)
    async deletePostComment(
        @Query('userId') userId: string,
        @Param('postId') postId: string,
        @Param('commentId') commentId: string
    ): Promise<ShowCommentDTO> {

        return await this.commentsService.deletePostComment(userId, postId, commentId);
    }
}
