import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../../entities/comments.entity';
import { CreateCommentDTO } from '../../models/comments/create-comment.dto';
import { ShowCommentDTO } from '../../models/comments/show-comment.dto';
import { User } from '../../entities/users.entity';
import { Post } from '../../entities/posts.entity';


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

        return await this.commentRepository.save(newComment)
    }

    public async readAllComments(userId: string, postId: string): Promise<Comment[]> {

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

        return await this.commentRepository.find({ where: { user: { id: userId }, post: { id: postId }, isDeleted: false } });
    }
}
