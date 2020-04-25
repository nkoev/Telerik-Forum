import { Component, OnInit } from '@angular/core';
import { UsersDataService } from '../../services/users-data.service';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/modules/core/services/auth.service';

@Component({
  selector: 'app-user-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class UserAccountComponent implements OnInit {
  loggedUser: User;
  userFriends: User[];
  userActivity;

  constructor(
    private usersDataService: UsersDataService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.authService.loggedUser$.subscribe((res) => (this.loggedUser = res));
    this.usersDataService
      .getUserFriends(this.loggedUser.id)
      .subscribe((res) => (this.userFriends = res));
    this.usersDataService
      .getUserActivity(this.loggedUser.id)
      .subscribe((res) => (this.userActivity = res));
  }
}
