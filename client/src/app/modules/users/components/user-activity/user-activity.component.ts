import { Component, OnInit } from '@angular/core';
import { UsersDataService } from '../../services/users-data.service';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/modules/core/services/auth.service';

@Component({
  selector: 'app-user-activity',
  templateUrl: './user-activity.component.html',
  styleUrls: ['./user-activity.component.css'],
})
export class UserActivityComponent implements OnInit {
  public userActivity;
  private loggedUser: User;

  constructor(
    private usersDataService: UsersDataService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.loggedUser$.subscribe((res) => (this.loggedUser = res));
    this.usersDataService
      .getUserActivity(this.loggedUser.id)
      .subscribe((res) => (this.userActivity = res));
  }
}
