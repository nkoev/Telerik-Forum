import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserDTO } from 'src/app/models/user.dto';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { UsersDataService } from '../../services/users-data.service';
import { FriendStatusDTO } from 'src/app/models/friend-status.dto';

@Component({
  selector: 'app-user-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  profileOwnerId: string;
  loggedUser: UserDTO;
  friendStatus: FriendStatusDTO;

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
      .getFriendStatus(this.profileOwnerId)
      .subscribe((res: FriendStatusDTO) => (this.friendStatus = res));
  }
}
