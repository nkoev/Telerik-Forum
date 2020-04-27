import { Component, OnInit, Input } from '@angular/core';
import { UsersDataService } from '../../services/users-data.service';
import { FriendStatusDTO } from 'src/app/models/friend-status.dto';

@Component({
  selector: 'app-friend-request-buttons',
  templateUrl: './friend-request-buttons.component.html',
  styleUrls: ['./friend-request-buttons.component.css'],
})
export class FriendRequestButtonsComponent implements OnInit {
  @Input() friendStatus: FriendStatusDTO;
  @Input() profileOwnerId: string;

  constructor(private usersDataService: UsersDataService) {}

  ngOnInit(): void {}

  sendFriendRequest(userId: string) {
    this.usersDataService
      .sendFriendRequest(userId)
      .subscribe(() => (this.friendStatus.requestSent = true));
  }

  acceptFriendRequest(userId: string) {
    this.usersDataService
      .acceptFriendRequest(userId)
      .subscribe(() => (this.friendStatus.requestReceived = false));
  }

  rejectFriendRequest(userId: string) {
    this.usersDataService
      .rejectFriendRequest(userId)
      .subscribe(() => (this.friendStatus.requestReceived = false));
  }

  removeFriend(userId: string) {
    this.usersDataService
      .removeFriend(userId)
      .subscribe(() => (this.friendStatus.isFriend = false));
  }
}
