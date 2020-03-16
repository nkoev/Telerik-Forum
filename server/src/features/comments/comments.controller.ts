import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('users')
export class CommentsController {

    constructor(private readonly commentsService: CommentsService) { }

    @Get('/:userId/posts/:postId/comments')
    async readAllComments(
        @Param('userId') userId: string,
        @Param('postId') postId: string
    ) {

        return await this.commentsService.readAllComments(userId, postId);
    }

    @Post('/:userId/posts/:postId/comments')
    async createComment(
        @Param('userId') userId: string,
        @Param('postId') postId: string,
        @Body('content') content: string
    ) {

        return await this.commentsService.createComment(userId, postId, { "content": content, "isDeleted": false });
    }
}
