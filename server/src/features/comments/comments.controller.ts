import { Controller, Post, Body, Param, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDTO } from '../../models/comments/create-comment.dto';
import { ShowCommentDTO } from '../../models/comments/show-comment.dto';

@Controller()
export class CommentsController {

    constructor(private readonly commentsService: CommentsService) { }

    @Get('/posts/:postId/comments')
    @HttpCode(HttpStatus.OK)
    async readPostComments(
        @Param('postId') postId: string
    ): Promise<ShowCommentDTO[]> {

        return await this.commentsService.readPostComments(postId);
    }

    @Post('/posts/:postId/comments')
    @HttpCode(HttpStatus.CREATED)
    async createPostComment(
        @Query('userId') userId: string,
        @Param('postId') postId: string,
        @Body() comment: CreateCommentDTO
    ): Promise<ShowCommentDTO> {

        return await this.commentsService.createPostComment(userId, postId, comment);
    }
}
