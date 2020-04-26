import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface UpdatePostDialogData {
  title: string;
  titleMessage: string;
  postTitle: string;
  contentMessage: string;
  postContent: string,

}

@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.css']
})
export class UpdatePostComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<UpdatePostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UpdatePostDialogData) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
