import { Component, OnInit, Inject } from '@angular/core';
import { UserDTO } from 'src/app/models/user.dto';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UsersDataService } from '../../services/users-data.service';

@Component({
  selector: 'app-user-friends',
  templateUrl: './user-friends.component.html',
  styleUrls: ['./user-friends.component.css'],
})
export class UserFriendsComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public userFriends: any,
    private dialogRef: MatDialogRef<UserFriendsComponent>,
    private router: Router,
    private usersDataService: UsersDataService
  ) { }

  ngOnInit(): void {
    this.router.events.subscribe(() => this.dialogRef.close());
  }

  removeFriend(userId: string) {
    this.usersDataService
      .removeFriend(userId)
      .subscribe(() =>
        this.usersDataService
          .getUserFriends()
          .subscribe((res) => (this.userFriends = res))
      );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
