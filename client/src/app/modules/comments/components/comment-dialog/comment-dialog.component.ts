import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

export interface CommentDialogData {
  title: string;
  commentContentMessage: string;
  commentContent: string;
}

@Component({
  selector: 'app-comment-dialog',
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.css']
})
export class CommentDialogComponent implements OnInit {

  static openCommentDialog(dialog: MatDialog, dialogData: CommentDialogData): Observable<any> {
    const dialogRef = dialog.open(CommentDialogComponent, {
      width: '60em',
      data: {
        title: dialogData.title,
        commentContentMessage: dialogData.commentContentMessage,
        commentContent: dialogData.commentContent,
      },
      backdropClass: 'backdropClass',
      panelClass: 'dialog',
    });

    return dialogRef.afterClosed();
  }

  commentForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CommentDialogData,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.commentForm = this.formBuilder.group(
      {
        commentContent: [this.data.commentContent, [Validators.required, Validators.minLength(1), Validators.maxLength(200)]],
      }
    );
  }

  get commentContent() {
    return this.commentForm.get('commentContent');
  }

  onSubmit(commentForm: FormGroup) {
    if (commentForm.valid) {
      this.dialogRef.close({ content: this.commentContent.value.trim() });
    }
  }

  onClose() {
    this.dialogRef.close();
  }

}
