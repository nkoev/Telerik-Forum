import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../../entities/comments.entity';


@Injectable()
export class CommentsService {

    constructor(
        @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>
    ) { }

    async all(): Promise<Comment[]> {
        return await this.commentRepository.find({});
    }

    async find(options: Partial<Comment>): Promise<Comment[]> {
        return await this.commentRepository.find({
            where: options
        });
    }

    async findOne(options: Partial<Comment>): Promise<Comment> {
        return await this.commentRepository.findOne({
            where: options
        });
    }

    public async createComment(userId: string, postId: string, comment: Partial<Comment>): Promise<Comment> {

        comment.userId = userId;
        comment.postId = postId;

        return await this.commentRepository.save(comment)
    }

    public async readAllComments(userId: string, postId: string): Promise<Comment[]> {

        return await this.commentRepository.find({where: {userId: userId, postId: postId}});
    }
}
