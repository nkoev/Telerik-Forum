import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/modules/core/services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  profileOwnerId: string;
  loggedUser: User;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.profileOwnerId = params.get('userId');
    });
    this.authService.loggedUser$.subscribe((res) => (this.loggedUser = res));
  }

  sendFriendRequest() {}
}
