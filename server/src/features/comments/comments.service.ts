import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../../entities/comment.entity';
import { CreateCommentDTO } from '../../models/comments/create-comment.dto';
import { ShowCommentDTO } from '../../models/comments/show-comment.dto';
import { User } from '../../entities/user.entity';
import { Post } from '../../entities/post.entity';


@Injectable()
export class CommentsService {

    constructor(
        @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Post) private readonly postRepository: Repository<Post>,
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

    public async createComment(userId: string, postId: string, comment: CreateCommentDTO): Promise<ShowCommentDTO> {

        const newComment: Comment = this.commentRepository.create(comment);

        const foundUser: User = await this.userRepository.findOne({
            id: userId
        });

        if (foundUser === undefined) {
            throw new BadRequestException('User does not exist');
        }

        const foundPost: Post = await this.postRepository.findOne({
            where: {
                id: postId,
                user: { id: userId }
            }
        });

        if (foundPost === undefined) {
            throw new BadRequestException('Post does not exist');
        }

        newComment.user = Promise.resolve(foundUser);
        newComment.post = Promise.resolve(foundPost);

        await this.commentRepository.save(newComment);

        return new ShowCommentDTO(newComment.content);
    }

    public async readAllComments(userId: string, postId: string): Promise<ShowCommentDTO[]> {

        const foundUser: User = await this.userRepository.findOne({
            id: userId
        });

        if (foundUser === undefined) {
            throw new BadRequestException('User does not exist');
        }

        const foundPost: Post = await this.postRepository.findOne({
            where: {
                id: postId,
                user: { id: userId }
            }
        });

        if (foundPost === undefined) {
            throw new BadRequestException('Post does not exist');
        }

        const comments = await this.commentRepository.find({ where: { user: { id: userId }, post: { id: postId }, isDeleted: false } });

        return comments.map(comment => new ShowCommentDTO(comment.content));
    }
}
