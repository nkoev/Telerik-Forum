import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommentDataService } from '../../comment-data.service';
import { DialogComponent, DialogData } from 'src/app/shared/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CommentDialogData, CommentDialogComponent } from '../comment-dialog/comment-dialog.component';
import { CommentShow } from 'src/app/modules/comments/models/comment-show.model';

@Component({
  selector: 'app-all-comments',
  templateUrl: './all-comments.component.html',
  styleUrls: ['./all-comments.component.css']
})
export class AllCommentsComponent implements OnInit {

  @Input()
  postId: number;
  @Input()
  comments: CommentShow[];
  @Output('updateComments')
  updateCommentsEmitter: EventEmitter<any> = new EventEmitter();

  newContent: string;

  constructor(
    private readonly commentDataService: CommentDataService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {

    // <---- BUTTON START---->
    //
    //Get the button:
    const mybutton = document.getElementById("create-btn");

    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function () { scrollFunction() };

    function scrollFunction() {
      if (document.body.scrollTop > 250 || document.documentElement.scrollTop > 250) {
        mybutton.style.display = "block";
      } else {
        mybutton.style.display = "none";
      }
    }
    // <---- BUTTON END---->

  }

  checkIfLastComment(comment: CommentShow): boolean {
    return this.comments[this.comments.length - 1] === comment ? true : false;
  }

  openDialog(dialogData: DialogData): Observable<any> {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '40em',
      data: {
        title: dialogData.title,
        question: dialogData.question
      }
    });

    return dialogRef.afterClosed();
  }

  openCommentDialog(dialogData: CommentDialogData): Observable<any> {
    const dialogRef = this.dialog.open(CommentDialogComponent, {
      width: '60em',
      data: {
        title: dialogData.title,
        commentContentMessage: dialogData.commentContentMessage,
        commentContent: dialogData.commentContent,
      }
    });

    return dialogRef.afterClosed();
  }

  createComment(): void {

    const dialogData: CommentDialogData = {
      title: 'Create New Comment',
      commentContentMessage: 'Your comment content',
      commentContent: '',
    };

    this.openCommentDialog(dialogData).subscribe(result => {
      if (result) {
        this.commentDataService.createComment(this.postId, result)
          .subscribe({
            next: data => {
              this.updateCommentsEmitter.emit({ comment: data, state: true });
              console.log('COMMENT ADDED');
            },
            error: err => {
              console.log(err);
            }
          });
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
      this.commentDataService.updateComment(this.postId, comment)
        .subscribe({
          next: data => {
            console.log('COMMENT EDITED');
          },
          error: err => {
            console.log(err);
          }
        });
    }
    comment.inEditMode = false;
  }

  likeComment(comment: CommentShow): void {
    this.commentDataService.likeComment(this.postId, comment.id, !comment.isLiked)
      .subscribe({
        next: data => {
          // comment = data;
          this.comments[this.comments.indexOf(comment)].votes = data.votes;
          comment.isLiked = !comment.isLiked;
        },
        error: err => {
          console.log(err);
        }
      });
  }

  deleteComment(comment: CommentShow): void {

    const dialogData = {
      title: 'Delete Comment',
      question: 'Are you sure you want to delete this comment?'
    };

    this.openDialog(dialogData).subscribe(result => {
      if (result) {
        this.commentDataService.deleteComment(this.postId, comment.id)
          .subscribe({
            next: data => {
              this.updateCommentsEmitter.emit({ comment: data, state: false });
              console.log('COMMENT DELETED');
            },
            error: err => {
              console.log(err);
            }
          });
      }
    });
  }
}
