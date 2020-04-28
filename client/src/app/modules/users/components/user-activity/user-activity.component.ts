import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-activity',
  templateUrl: './user-activity.component.html',
  styleUrls: ['./user-activity.component.css'],
})
export class UserActivityComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public userActivity: string,
    private dialogRef: MatDialogRef<UserActivityComponent>,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => this.dialogRef.close());
  }
}
