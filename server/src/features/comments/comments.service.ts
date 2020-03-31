import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../../database/entities/comment.entity';
import { CreateCommentDTO } from '../../models/comments/create-comment.dto';
import { ShowCommentDTO } from '../../models/comments/show-comment.dto';
import { User } from '../../database/entities/user.entity';
import { Post } from '../../database/entities/post.entity';
import { UpdateCommentDTO } from '../../models/comments/update-comment.dto';
import { plainToClass } from 'class-transformer';


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

    public async readPostComments(postId: number): Promise<ShowCommentDTO[]> {

        const foundPost: Post = await this.postRepository.findOne({
            where: {
                id: postId,
                isDeleted: false
            }
        });

        if (foundPost === undefined) {
            throw new BadRequestException('Post does not exist');
        }

        const comments = await this.commentRepository.find({ where: { post: { id: postId }, isDeleted: false } });

        return comments.map(this.toCommnentDTO);
    }


    public async createPostComment(userId: string, postId: number, comment: CreateCommentDTO): Promise<ShowCommentDTO> {

        const foundUser: User = await this.userRepository.findOne({
            id: userId,
            isDeleted: false
        });

        if (foundUser === undefined) {
            throw new BadRequestException('User does not exist');
        }

        const foundPost: Post = await this.postRepository.findOne({
            where: {
                id: postId,
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

        return this.toCommnentDTO(newComment);
    }


    public async updatePostComment(userId: string, postId: number, commentId: number, comment: UpdateCommentDTO): Promise<ShowCommentDTO> {

        const foundComment: Comment = await this.commentRepository.findOne({
            where: {
                id: commentId,
                post: { id: postId, isDeleted: false },
                user: { id: userId, isDeleted: false },
                isDeleted: false
            }
        });

        if (foundComment === undefined) {
            throw new BadRequestException('Comment does not exist');
        }

        const updatedComment: Comment = { ...foundComment, ...comment };

        await this.commentRepository.save(updatedComment);

        return this.toCommnentDTO(updatedComment);
    }

    public async likePostComment(userId: string, postId: number, commentId: number): Promise<ShowCommentDTO> {
        const comment: Comment = await this.commentRepository.findOne({
            where: {
                id: commentId,
                isDeleted: false
            }
        });

        if (comment === undefined) {
            throw new BadRequestException('Comment does not exist');
        }
        if (comment.user.id === userId) {
            throw new BadRequestException('Not allowed to like user\'s own comments')
        }

        const liked: boolean = comment.votes.some((user) => user.id === userId)
        const queryBuilder =
            this.commentRepository
                .createQueryBuilder()
                .relation('votes')
                .of(comment)

        liked ?
            await queryBuilder
                .remove(userId) :
            await queryBuilder
                .add(userId)

        return this.toCommnentDTO(comment)
    }


    public async deletePostComment(userId: string, postId: number, commentId: number): Promise<ShowCommentDTO> {

        const foundComment: Comment = await this.commentRepository.findOne({
            where: {
                id: commentId,
                post: { id: postId, isDeleted: false },
                user: { id: userId, isDeleted: false },
                isDeleted: false
            }
        });

        if (foundComment === undefined) {
            throw new BadRequestException('Comment does not exist');
        }

        const deletedComment: Comment = { ...foundComment, isDeleted: true };

        await this.commentRepository.save(deletedComment);

        return this.toCommnentDTO(deletedComment);
    }
    private toCommnentDTO(comment: Comment): ShowCommentDTO {
        return plainToClass(
            ShowCommentDTO,
            comment, {
            excludeExtraneousValues: true
        });
    }
}
