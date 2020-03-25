import { Controller, Post, Body, Param, Get, HttpCode, HttpStatus, Query, Put, Delete, ParseIntPipe, ParseUUIDPipe, ValidationPipe } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDTO } from '../../models/comments/create-comment.dto';
import { ShowCommentDTO } from '../../models/comments/show-comment.dto';
import { UpdateCommentDTO } from '../../models/comments/update-comment.dto';

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
