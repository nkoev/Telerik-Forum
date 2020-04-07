import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { User } from '../../database/entities/user.entity';
import { Post } from '../../database/entities/post.entity';
import { Comment } from '../../database/entities/comment.entity';
import { CommentCreateDTO } from '../../models/comments/comment-create.dto';
import { CommentShowDTO } from '../../models/comments/comment-show.dto';
import { CommentUpdateDTO } from '../../models/comments/comment-update.dto';
import { ActivityService } from '../core/activity.service';
import { ActivityType } from '../../models/activity/activity-type.enum';
import { ForumSystemException } from '../../common/exceptions/system-exception';

@Injectable()
export class CommentsService {

  constructor(
    @InjectRepository(Comment) private readonly commentsRepo: Repository<Comment>,
    @InjectRepository(Post) private readonly postsRepo: Repository<Post>,
    private readonly activityService: ActivityService
  ) { }

  public async getComments(postId: number): Promise<CommentShowDTO[]> {

    const post: Post = await this.getPostEntity(postId)
    this.validatePost(post)

    const comments = await this.commentsRepo.find({
      where: {
        post: { id: postId },
        isDeleted: false
      }
    });

    return comments.map(this.toCommentShowDTO);
  }

  public async getSingleComment(postId: number, commentId: number): Promise<CommentShowDTO> {

    const comment: Comment = await this.getCommentEntity(postId, commentId)
    this.validateComment(comment)

    return this.toCommentShowDTO(comment);
  }

  public async createPostComment(commentDTO: CommentCreateDTO, postId: number, loggedUser: User): Promise<CommentShowDTO> {

    const post: Post = await this.getPostEntity(postId)
    this.validatePost(post)
    if (post.isLocked) {
      throw new ForumSystemException('Post is locked', 403)
    }

    const newComment: Comment = this.commentsRepo.create({
      ...commentDTO,
      user: loggedUser,
      post,
      votes: []
    });
    await this.commentsRepo.save(newComment);

    await this.activityService.logCommentEvent(loggedUser, ActivityType.Create, postId, newComment.id)

    return this.toCommentShowDTO(newComment);
  }

  public async updatePostComment(update: CommentUpdateDTO, postId: number, commentId: number, loggedUser: User, isAdmin: boolean): Promise<CommentShowDTO> {

    const comment: Comment = await this.getCommentEntity(postId, commentId)
    this.validateComment(comment)
    if (comment.user.id !== loggedUser.id && !isAdmin) {
      throw new ForumSystemException('Not allowed to update other users comments', 403);
    }

    const updatedComment: Comment = {
      ...comment,
      ...update
    };
    await this.commentsRepo.save(updatedComment);

    await this.activityService.logCommentEvent(loggedUser, ActivityType.Update, postId, commentId);

    return this.toCommentShowDTO(updatedComment);
  }

  public async likePostComment(loggedUser: User, postId: number, commentId: number, state: boolean): Promise<CommentShowDTO> {

    const comment: Comment = await this.getCommentEntity(postId, commentId);
    this.validateComment(comment);
    if (comment.user.id === loggedUser.id) {
      throw new ForumSystemException('Not allowed to like user\'s own comments', 403);
    }

    const currentState: boolean = comment.votes.some(user => user.id === loggedUser.id)
    if (state === currentState) {
      throw new ForumSystemException('User has already (un)liked this comment', 400)
    }

    const likes = this.commentsRepo
      .createQueryBuilder()
      .relation('votes')
      .of(comment)

    state
      ? (
        await likes.add(loggedUser),
        await this.activityService.logCommentEvent(loggedUser, ActivityType.Like, postId, commentId)
      )
      : await likes.remove(loggedUser)

    return this.toCommentShowDTO(comment);
  }

  public async deletePostComment(loggedUser: User, postId: number, commentId: number, isAdmin: boolean): Promise<CommentShowDTO> {

    const comment: Comment = await this.getCommentEntity(postId, commentId);
    this.validateComment(comment);
    if (comment.user.id !== loggedUser.id && !isAdmin) {
      throw new ForumSystemException('Not allowed to delete other users comments', 403);
    }

    const deletedComment: Comment = {
      ...comment,
      isDeleted: true
    };
    await this.commentsRepo.save(deletedComment);

    await this.activityService.logCommentEvent(loggedUser, ActivityType.Remove, postId, commentId);

    return this.toCommentShowDTO(deletedComment);
  }

  private toCommentShowDTO(comment: Comment): CommentShowDTO {
    return plainToClass(
      CommentShowDTO,
      comment, {
      excludeExtraneousValues: true
    });
  }

  private async getPostEntity(postId: number): Promise<Post> {
    return await this.postsRepo.findOne({
      where: {
        isDeleted: false,
        id: postId
      }
    });
  }

  private async getCommentEntity(postId: number, commentId: number): Promise<Comment> {
    return await this.commentsRepo.findOne({
      where: {
        id: commentId,
        post: { id: postId, isDeleted: false },
        isDeleted: false
      }
    });
  }

  private validatePost(post: Post): void {
    if (!post) {
      throw new ForumSystemException('Post does not exist', 404);
    }
  }

  private validateComment(comment: Comment): void {
    if (!comment) {
      throw new ForumSystemException('Comment does not exist', 404);
    }
  }
}
