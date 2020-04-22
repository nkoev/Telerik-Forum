import { Component, OnInit } from '@angular/core';
import { UsersDataService } from '../../services/users-data.service';

@Component({
  selector: 'app-user-activity',
  templateUrl: './user-activity.component.html',
  styleUrls: ['./user-activity.component.css'],
})
export class UserActivityComponent implements OnInit {
  public userActivity;

  constructor(private usersDataService: UsersDataService) {}

  ngOnInit(): void {
    this.usersDataService
      .getUserActivity(localStorage.getItem('loggedUserId'))
      .subscribe((res) => (this.userActivity = res));
  }
}
