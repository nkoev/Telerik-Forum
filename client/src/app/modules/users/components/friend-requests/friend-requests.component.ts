import { Component, OnInit } from '@angular/core';
import { UsersDataService } from '../../services/users-data.service';
import { UserDTO } from 'src/app/models/user.dto';

@Component({
  selector: 'app-friend-requests',
  templateUrl: './friend-requests.component.html',
  styleUrls: ['./friend-requests.component.css'],
})
export class FriendRequestsComponent implements OnInit {
  public requests: UserDTO[];

  constructor(private usersDataService: UsersDataService) {}

  ngOnInit(): void {
    this.usersDataService
      .getReceivedFriendRequests()
      .subscribe((requests) => (this.requests = requests));
  }

  acceptRequest(userId: string) {}
  rejectRequest(userId: string) {}
}
