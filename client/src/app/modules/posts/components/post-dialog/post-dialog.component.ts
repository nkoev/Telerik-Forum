import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

export interface PostDialogData {
  title: string;
  postTitleMessage: string;
  postTitle: string;
  postContentMessage: string;
  postContent: string;
}

@Component({
  selector: 'app-post-dialog',
  templateUrl: './post-dialog.component.html',
  styleUrls: ['./post-dialog.component.css']
})
export class PostDialogComponent implements OnInit {

  postForm: FormGroup;

  static openPostDialog(dialog: MatDialog, dialogData: PostDialogData): Observable<any> {
    const dialogRef = dialog.open(PostDialogComponent, {
      width: '60em',
      data: {
        title: dialogData.title,
        postTitleMessage: dialogData.postTitleMessage,
        postTitle: dialogData.postTitle,
        postContentMessage: dialogData.postContentMessage,
        postContent: dialogData.postContent,
      },
      backdropClass: 'backdropClass',
      panelClass: 'dialog',
    });

    return dialogRef.afterClosed();
  }

  constructor(
    public dialogRef: MatDialogRef<PostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PostDialogData,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.postForm = this.formBuilder.group(
      {
        postTitle: [this.data.postTitle, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
        postContent: [this.data.postContent, [Validators.required, Validators.minLength(2), Validators.maxLength(1000)]],
      }
    );
  }

  get postTitle() {
    return this.postForm.get('postTitle');
  }

  get postContent() {
    return this.postForm.get('postContent');
  }

  onSubmit(commentForm: FormGroup) {
    if (commentForm.valid) {
      this.dialogRef.close({
        title: this.postTitle.value.trim(),
        content: this.postContent.value.trim()
      });
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
