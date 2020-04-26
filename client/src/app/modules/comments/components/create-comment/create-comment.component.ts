import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface CreateCommentDialogData {
  title: string;
  message: string;
  label: string;
  input: string;
}

@Component({
  selector: 'app-create-comment',
  templateUrl: './create-comment.component.html',
  styleUrls: ['./create-comment.component.css']
})
export class CreateCommentComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CreateCommentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateCommentDialogData) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
