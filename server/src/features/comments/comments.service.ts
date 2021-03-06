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

    await this.getPostEntity(postId);

    let comments = await this.commentsRepo.find({
      where: {
        post: { id: postId },
        isDeleted: false
      }
    });

    comments = comments.sort(function (a, b) {
      return b.votes.length - a.votes.length;
    });

    return comments.map(this.toCommentShowDTO);
  }

  public async getSingleComment(postId: number, commentId: number): Promise<CommentShowDTO> {

    const comment: Comment = await this.getCommentEntity(postId, commentId);

    return this.toCommentShowDTO(comment);
  }

  public async createComment(loggedUser: User, postId: number, commentDTO: CommentCreateDTO): Promise<CommentShowDTO> {

    const post: Post = await this.getPostEntity(postId);
    if (post.isLocked) {
      throw new ForumSystemException('Post is locked', 403);
    }

    const newComment: Comment = this.commentsRepo.create({
      ...commentDTO,
      user: loggedUser,
      post,
      votes: []
    });
    await this.commentsRepo.save(newComment);

    await this.updateCommentsCount(postId);
    await this.activityService.logCommentEvent(loggedUser, ActivityType.Create, postId, newComment.id)

    return this.toCommentShowDTO(newComment);
  }

  public async updateComment(loggedUser: User, postId: number, commentId: number, update: CommentUpdateDTO, isAdmin: boolean): Promise<CommentShowDTO> {

    const comment: Comment = await this.getCommentEntity(postId, commentId);
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

  public async likeComment(loggedUser: User, postId: number, commentId: number, state: boolean): Promise<CommentShowDTO> {

    const comment: Comment = await this.getCommentEntity(postId, commentId);
    if (comment.user.id === loggedUser.id) {
      throw new ForumSystemException('Not allowed to like user\'s own comments', 403);
    }

    const currentState: boolean = comment.votes.some(user => user.id === loggedUser.id)
    if (state === currentState) {
      throw new ForumSystemException('User has already (un)liked this comment', 400)
    }

    if (state) {
      comment.votes.push(loggedUser);
      await this.activityService.logCommentEvent(loggedUser, ActivityType.Like, postId, commentId);
    } else {
      comment.votes.splice(comment.votes.indexOf(loggedUser), 1);
    }

    const likedComment = await this.commentsRepo.save(comment);

    return this.toCommentShowDTO(likedComment);
  }

  public async deleteComment(loggedUser: User, postId: number, commentId: number, isAdmin: boolean): Promise<CommentShowDTO> {

    const comment: Comment = await this.getCommentEntity(postId, commentId);
    if (comment.user.id !== loggedUser.id && !isAdmin) {
      throw new ForumSystemException('Not allowed to delete other users comments', 403);
    }

    const deletedComment: Comment = await this.commentsRepo.save({
      ...comment,
      isDeleted: true
    });

    await this.updateCommentsCount(postId);
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

  private validatePost(post: Post): void {
    if (!post) {
      throw new ForumSystemException('Post does not exist', 404);
    }
  }

  private async getPostEntity(postId: number): Promise<Post> {
    const foundPost = await this.postsRepo.findOne({
      where: {
        isDeleted: false,
        id: postId
      }
    });

    this.validatePost(foundPost);

    return foundPost;
  }

  private validateComment(comment: Comment): void {
    if (!comment) {
      throw new ForumSystemException('Comment does not exist', 404);
    }
  }

  private async getCommentEntity(postId: number, commentId: number): Promise<Comment> {
    const foundComment = await this.commentsRepo.findOne({
      where: {
        id: commentId,
        post: { id: postId, isDeleted: false },
        isDeleted: false
      }
    });

    this.validateComment(foundComment);

    return foundComment;
  }

  private async updateCommentsCount(postId: number): Promise<void> {
    const updatedPost = await this.postsRepo
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.comments", "comments")
      .loadRelationCountAndMap("post.commentsCount", "post.comments", "co", qb => qb.andWhere("co.isDeleted = :isDeleted", { isDeleted: false }))
      .where("post.id = :id", { id: postId })
      .addOrderBy("post.id, comments.id")
      .getOne();

    this.postsRepo.save(updatedPost);
  }
}
