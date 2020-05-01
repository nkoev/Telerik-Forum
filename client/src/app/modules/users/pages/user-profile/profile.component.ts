import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserDTO } from 'src/app/models/user.dto';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { UsersDataService } from '../../services/users-data.service';
import { FriendStatusDTO } from 'src/app/models/friend-status.dto';
import { Subscription } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-user-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  profileOwnerId: string;
  loggedUser: UserDTO;
  isAdmin: boolean;
  friendStatus: FriendStatusDTO;
  subscriptions: Subscription[] = [];
  avatar: string | SafeUrl = 'assets/posts/single-post-avatar.jpg';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private usersDataService: UsersDataService
  ) {}

  ngOnInit(): void {
    const sub1 = this.route.paramMap.subscribe(
      (params) => (this.profileOwnerId = params.get('userId'))
    );
    const sub2 = this.authService.loggedUser$.subscribe((res) => {
      this.loggedUser = res;
      this.isAdmin = res.roles.includes('Admin');
    });
    this.usersDataService.getFriendStatus(this.profileOwnerId).subscribe(
      (res: FriendStatusDTO) => (this.friendStatus = res),
      (err) => console.log(err)
    );
    this.usersDataService
      .getAvatar(this.profileOwnerId)
      .subscribe((avatarUrl) => {
        if (avatarUrl) {
          this.avatar = avatarUrl;
        }
      });
    this.subscriptions.push(sub1, sub2);
  }

  avatarUploaded(event: any) {
    this.avatar = event;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
