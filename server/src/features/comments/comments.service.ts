import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../../database/entities/comment.entity';
import { CreateCommentDTO } from '../../models/comments/create-comment.dto';
import { ShowCommentDTO } from '../../models/comments/show-comment.dto';
import { User } from '../../database/entities/user.entity';
import { Post } from '../../database/entities/post.entity';


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

    public async readPostComments(postId: string): Promise<ShowCommentDTO[]> {

        const foundPost: Post = await this.postRepository.findOne({
            where: {
                id: +postId,
                isDeleted: false
            }
        });

        if (foundPost === undefined) {
            throw new BadRequestException('Post does not exist');
        }

        const comments = await this.commentRepository.find({ where: { post: { id: postId }, isDeleted: false } });

        return comments.map(comment => new ShowCommentDTO(comment));
    }


    public async createPostComment(userId: string, postId: string, comment: CreateCommentDTO): Promise<ShowCommentDTO> {

        const foundUser: User = await this.userRepository.findOne({
            id: userId,
            isDeleted: false
        });

        if (foundUser === undefined) {
            throw new BadRequestException('User does not exist');
        }

        const foundPost: Post = await this.postRepository.findOne({
            where: {
                id: +postId,
                user: { id: userId },
                isDeleted: false
            }
        });

        if (foundPost === undefined) {
            throw new BadRequestException('Post does not exist');
        }


        const newComment: Comment = this.commentRepository.create(comment);

        newComment.user = foundUser;
        newComment.post = foundPost;

        await this.commentRepository.save(newComment);

        return new ShowCommentDTO(newComment);
    }


    public async updatePostComment(userId: string, postId: string, commentId: string, comment: CreateCommentDTO): Promise<ShowCommentDTO> {

        const foundComment: Comment = await this.commentRepository.findOne({
            where: {
                id: +commentId,
                post: { id: +postId, isDeleted: false },
                user: { id: userId, isDeleted: false },
                isDeleted: false
            }
        });

        if (foundComment === undefined) {
            throw new BadRequestException('Comment does not exist');
        }

        const updatedComment: Comment = { ...foundComment, ...comment };

        await this.commentRepository.save(updatedComment);

        return new ShowCommentDTO(updatedComment);
    }


    public async deletePostComment(userId: string, postId: string, commentId: string) {

        const foundComment: Comment = await this.commentRepository.findOne({
            where: {
                id: +commentId,
                post: { id: +postId, isDeleted: false },
                user: { id: userId, isDeleted: false },
                isDeleted: false
            }
        });

        if (foundComment === undefined) {
            throw new BadRequestException('Comment does not exist');
        }

        const deletedComment: Comment = { ...foundComment, isDeleted: true };

        await this.commentRepository.save(deletedComment);

        return new ShowCommentDTO(deletedComment);
    }
}
