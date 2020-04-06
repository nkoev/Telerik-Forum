import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { User } from '../../database/entities/user.entity';
import { Post } from '../../database/entities/post.entity';
import { Comment } from '../../database/entities/comment.entity';
import { CreateCommentDTO } from '../../models/comments/create-comment.dto';
import { ShowCommentDTO } from '../../models/comments/show-comment.dto';
import { UpdateCommentDTO } from '../../models/comments/update-comment.dto';
import { ActivityService } from '../core/activity.service';
import { ActivityType } from '../../models/activity/activity-type.enum';
import { ForumSystemException } from '../../common/exceptions/system-exception';

@Injectable()
export class CommentsService {

    constructor(
        @InjectRepository(Comment) private readonly commentsRepository: Repository<Comment>,
        @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
        private readonly activityLogger: ActivityService
    ) { }

    public async readPostComments(postId: number): Promise<ShowCommentDTO[]> {

        const foundPost: Post = await this.postsRepository.findOne({
            where: {
                id: postId,
                isDeleted: false
            }
        });

        if (foundPost === undefined) {
            throw new ForumSystemException('Post does not exist', 404);
        }

        const comments = await this.commentsRepository.find({
            where: {
                post: { id: postId },
                isDeleted: false
            }
        });

        return comments.map(this.toCommentDTO);
    }


    public async createPostComment(loggedUser: User, postId: number, comment: CreateCommentDTO): Promise<ShowCommentDTO> {

        const foundPost: Post = await this.postsRepository.findOne({
            where: {
                id: postId,
                isDeleted: false
            }
        });

        if (foundPost === undefined) {
            throw new ForumSystemException('Post does not exist', 404);
        }
        if (foundPost.isLocked) {
            throw new ForumSystemException('Post is locked', 403)
        }

        const newComment: Comment = this.commentsRepository.create(comment);
        newComment.user = loggedUser;
        newComment.post = foundPost;
        await this.commentsRepository.save(newComment);

        await this.activityLogger.logCommentEvent(loggedUser, ActivityType.Create, postId, newComment.id)

        return this.toCommentDTO(newComment);
    }


    public async updatePostComment(loggedUser: User, postId: number, commentId: number, comment: UpdateCommentDTO, isAdmin: boolean): Promise<ShowCommentDTO> {

        const foundComment: Comment = await this.commentsRepository.findOne({
            where: {
                id: commentId,
                post: { id: postId, isDeleted: false },
                isDeleted: false
            }
        });

        if (foundComment === undefined) {
            throw new ForumSystemException('Comment does not exist', 404);
        }
        if (foundComment.user.id !== loggedUser.id && !isAdmin) {
            throw new ForumSystemException('Not allowed to update other users comments', 403);
        }

        const updatedComment: Comment = { ...foundComment, ...comment };
        await this.commentsRepository.save(updatedComment);

        await this.activityLogger.logCommentEvent(loggedUser, ActivityType.Update, postId, commentId);

        return this.toCommentDTO(updatedComment);
    }

    public async likePostComment(loggedUser: User, postId: number, commentId: number): Promise<ShowCommentDTO> {

        const foundComment: Comment = await this.commentsRepository.findOne({
            where: {
                id: commentId,
                isDeleted: false
            }
        });

        if (foundComment === undefined) {
            throw new ForumSystemException('Comment does not exist', 404);
        }
        if (foundComment.user.id === loggedUser.id) {
            throw new ForumSystemException('Not allowed to like user\'s own comments', 403);
        }

        const liked: boolean = foundComment.votes.some((user) => user === loggedUser);

        const queryBuilder =
            this.commentsRepository
                .createQueryBuilder()
                .relation('votes')
                .of(foundComment)

        liked
            ? await queryBuilder
                .remove(loggedUser)
            : await queryBuilder
                .add(loggedUser)

        await this.activityLogger.logCommentEvent(loggedUser, ActivityType.Like, postId, commentId);

        return this.toCommentDTO(foundComment);
    }


    public async deletePostComment(loggedUser: User, postId: number, commentId: number, isAdmin: boolean): Promise<ShowCommentDTO> {

        const foundComment: Comment = await this.commentsRepository.findOne({
            where: {
                id: commentId,
                post: { id: postId, isDeleted: false },
                isDeleted: false
            }
        });

        if (foundComment === undefined) {
            throw new ForumSystemException('Comment does not exist', 404);
        }
        if (foundComment.user.id !== loggedUser.id && !isAdmin) {
            throw new ForumSystemException('Not allowed to delete other users comments', 403);
        }

        const deletedComment: Comment = { ...foundComment, isDeleted: true };
        await this.commentsRepository.save(deletedComment);

        await this.activityLogger.logCommentEvent(loggedUser, ActivityType.Remove, postId, commentId);

        return this.toCommentDTO(deletedComment);
    }

    private toCommentDTO(comment: Comment): ShowCommentDTO {
        return plainToClass(
            ShowCommentDTO,
            comment, {
            excludeExtraneousValues: true
        });
    }
}
