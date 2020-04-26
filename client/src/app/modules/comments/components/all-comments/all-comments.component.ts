import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommentDataService } from '../../comment-data.service';
import { DialogComponent, DialogData } from 'src/app/shared/components/dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CreateCommentComponent, CreateCommentDialogData } from '../create-comment/create-comment.component';

@Component({
  selector: 'app-all-comments',
  templateUrl: './all-comments.component.html',
  styleUrls: ['./all-comments.component.css']
})
export class AllCommentsComponent implements OnInit {

  @Input()
  postId: number;
  @Input()
  comments: any[];
  @Output('updateComments')
  updateCommentsEmitter: EventEmitter<any> = new EventEmitter();

  fakeLoggedUser: any;
  newContent: string;

  constructor(
    private readonly commentDataService: CommentDataService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    //Get the button:
    const mybutton = document.getElementById("create-btn");

    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function () { scrollFunction() };

    function scrollFunction() {
      if (document.body.scrollTop > 450 || document.documentElement.scrollTop > 450) {
        mybutton.style.display = "block";
      } else {
        mybutton.style.display = "none";
      }
    }
  }

  checkIfLastComment(comment: any): boolean {
    return this.comments[this.comments.length - 1] === comment ? true : false;
  }

  openCreateCommentDialog(dialogData: CreateCommentDialogData): Observable<any> {
    const dialogRef = this.dialog.open(CreateCommentComponent, {
      width: '40em',
      data: {
        title: dialogData.title,
        message: dialogData.message,
        label: dialogData.label,
        input: dialogData.input,
      }
    });

    return dialogRef.afterClosed();
  }

  createComment() {

    const dialogData: CreateCommentDialogData = {
      title: 'Create New Comment',
      message: 'What\'s on your mind?',
      label: 'Your Text...',
      input: ''
    };

    this.openCreateCommentDialog(dialogData).subscribe(result => {
      if (result) {
        this.commentDataService.createComment(this.postId, { content: result })
          .subscribe({
            next: data => {
              console.log(data);
              this.updateCommentsEmitter.emit(data);
              console.log('COMMENT ADDED');
            },
            error: err => console.log(err)
          });
      }
    });
  }

  editComment(comment: any) {
    this.newContent = comment.content;
    comment.inEditMode = true;
    console.log('inEditMode ON');
  }

  undoEdit(comment: any) {
    comment.inEditMode = false;
    console.log('inEditMode OFF');
  }

  saveEdit(comment: any, newContent: string) {
    comment.inEditMode = false;
    if (comment.content !== newContent.trim()) {
      comment.content = newContent.trim();
      this.commentDataService.updateComment(this.postId, comment)
        .subscribe({
          next: data => {
            console.log(data);
          },
          error: err => console.log(err)
        });
      console.log('inEditMode SAVED');
    }
  }

  likeComment(comment: any) {
    this.commentDataService.likeComment(this.postId, comment.id, !comment.isLiked)
      .subscribe({
        next: data => {
          // comment = data;
          this.comments[this.comments.indexOf(comment)].votes = data.votes;
          console.log(comment.votes.length);
          console.log(comment.votes);
        },
        error: err => console.log(err)
      });

    comment.isLiked = !comment.isLiked;
  }

  openDialog(dialogData: DialogData): Observable<any> {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '40em',
      data: {
        action: dialogData.action,
        question: dialogData.question
      }
    });

    return dialogRef.afterClosed();
  }

  deleteComment(comment: any) {

    const dialogData = {
      action: 'Delete Comment',
      question: 'Are you sure you want to delete this comment?'
    };

    this.openDialog(dialogData).subscribe(result => {
      if (result) {
        this.commentDataService.deleteComment(this.postId, comment.id)
          .subscribe({
            next: data => {
              this.updateCommentsEmitter.emit(comment);
              console.log('COMMENT DELETED');
            },
            error: err => console.log(err)
          });
      }
    });
  }
}
