import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
