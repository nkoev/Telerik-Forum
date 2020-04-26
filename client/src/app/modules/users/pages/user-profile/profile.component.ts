import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { UsersDataService } from '../../services/users-data.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  profileOwnerId: string;
  loggedUser: User;
  areFriends: boolean;
  friendRequestSent: boolean;
  friendRequestWaiting: boolean;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private usersDataService: UsersDataService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.profileOwnerId = params.get('userId');
    });
    this.authService.loggedUser$.subscribe((res) => (this.loggedUser = res));
    this.usersDataService
      .getUserFriends()
      .subscribe(
        (res: User[]) =>
          (this.areFriends = res.some(
            (user) => user.id === this.profileOwnerId
          ))
      );
    this.usersDataService.getSentFriendRequests().subscribe((res: User[]) => {
      this.friendRequestSent = res.some(
        (user) => user.id === this.profileOwnerId
      );
    });
    this.usersDataService
      .getReceivedFriendRequests()
      .subscribe((res: User[]) => {
        this.friendRequestWaiting = res.some(
          (user) => user.id === this.profileOwnerId
        );
      });
  }

  sendFriendRequest(userId: string) {
    this.usersDataService
      .sendFriendRequest(userId)
      .subscribe(() => (this.friendRequestSent = true));
  }
  acceptFriendRequest(userId: string) {}

  deleteFriendRequest(userId: string) {}
}
