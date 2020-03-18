import { Controller, Post, Body, Param, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDTO } from '../../models/comments/create-comment.dto';
import { ShowCommentDTO } from '../../models/comments/show-comment.dto';

@Controller('users')
export class CommentsController {

    constructor(private readonly commentsService: CommentsService) { }

    @Get('/:userId/posts/:postId/comments')
    @HttpCode(HttpStatus.OK)
    async readAllComments(
        @Param('userId') userId: string,
        @Param('postId') postId: string
    ): Promise<ShowCommentDTO[]> {

        return await this.commentsService.readAllComments(userId, postId);
    }

    @Post('/:userId/posts/:postId/comments')
    @HttpCode(HttpStatus.CREATED)
    async createComment(
        @Param('userId') userId: string,
        @Param('postId') postId: string,
        @Body() comment: CreateCommentDTO
    ): Promise<ShowCommentDTO> {

        return await this.commentsService.createComment(userId, postId, comment);
    }
}
