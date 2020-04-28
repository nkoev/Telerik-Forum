import { Component, OnInit } from '@angular/core';
import { UsersDataService } from '../../services/users-data.service';
import { UserDTO } from 'src/app/models/user.dto';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css'],
})
export class AllUsersComponent implements OnInit {
  allUsers: UserDTO[];
  constructor(private usersDataService: UsersDataService) {}

  ngOnInit(): void {
    this.usersDataService
      .getAllUsers()
      .subscribe((res: UserDTO[]) => (this.allUsers = res));
  }
}
