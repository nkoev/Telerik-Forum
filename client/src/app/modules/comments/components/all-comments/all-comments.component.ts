import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommentDataService } from '../../comment-data.service';
import { CommentShow } from 'src/app/modules/comments/models/comment-show.model';
import { SafeUrl } from '@angular/platform-browser';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { CommentBase } from '../../models/comment-base.model';
import { PostShow } from 'src/app/modules/posts/models/post-show.model';

@Component({
  selector: 'app-all-comments',
  templateUrl: './all-comments.component.html',
  styleUrls: ['./all-comments.component.css'],
})
export class AllCommentsComponent implements OnInit {
  @Input()
  post: PostShow;
  @Input()
  comments: CommentShow[];
  @Output('updateComments')
  updateCommentsEmitter: EventEmitter<any> = new EventEmitter();
  avatar: SafeUrl;
  newContent: string;

  constructor(
    private readonly commentDataService: CommentDataService,
    private dialogService: DialogService,
  ) { }

  ngOnInit(): void {
  }

  checkIfLastComment(comment: CommentShow): boolean {
    return this.comments[this.comments.length - 1] === comment ? true : false;
  }

  createComment(): void {
    this.dialogService.createComment(this.post.id,
      {
        next: data => {
          this.updateCommentsEmitter.emit({ comment: data, state: true });
          console.log('COMMENT ADDED');
        },
        error: err => {
          console.log(err);
        }
      });
  }

  updateComment(comment: CommentShow): void {
    this.newContent = comment.content;
    comment.inEditMode = true;
    console.log('inEditMode ON');
  }

  undoUpdate(comment: CommentShow): void {
    comment.inEditMode = false;
    console.log('inEditMode OFF');
  }

  saveUpdate(comment: CommentShow, newContent: string): void {
    if (comment.content !== newContent.trim()) {
      comment.content = newContent.trim();
      this.commentDataService.updateComment(this.post.id, comment).subscribe({
        next: (data) => {
          console.log('COMMENT EDITED');
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
    comment.inEditMode = false;
  }

  likeComment(comment: CommentShow): void {
    this.commentDataService
      .likeComment(this.post.id, comment.id, !comment.isLiked)
      .subscribe({
        next: (data) => {
          // comment = data;
          this.comments[this.comments.indexOf(comment)].votes = data.votes;
          comment.isLiked = !comment.isLiked;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  deleteComment(comment: CommentShow): void {
    this.dialogService.deleteComment(this.post.id, comment,
      {
        next: data => {
          this.updateCommentsEmitter.emit({ comment: data, state: false });
          console.log('COMMENT DELETED');
        },
        error: err => {
          console.log(err);
        }
      });
  }

  showCommentVotes(comment: CommentBase): void {
    if (comment.votes.length < 1) {
      return;
    }
    this.dialogService.showVotes(comment.votes);
  }

}
