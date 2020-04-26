import { Component, OnInit } from '@angular/core';
import { UsersDataService } from '../../services/users-data.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css'],
})
export class AllUsersComponent implements OnInit {
  allUsers: User[];
  constructor(private usersDataService: UsersDataService) {}

  ngOnInit(): void {
    this.usersDataService
      .getAllUsers()
      .subscribe((res: User[]) => (this.allUsers = res));
  }
}
