import { Component, OnInit, Inject } from '@angular/core';
import { User } from 'src/app/models/user';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-user-friends',
  templateUrl: './user-friends.component.html',
  styleUrls: ['./user-friends.component.css'],
})
export class UserFriendsComponent implements OnInit {
  public friendRequests: User[];

  constructor(@Inject(MAT_DIALOG_DATA) public userFriends: string) {}

  ngOnInit(): void {}
}
