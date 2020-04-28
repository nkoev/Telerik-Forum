import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { UserDTO } from 'src/app/models/user.dto';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private dialogService: DialogService
  ) {}
  isLoggedIn: boolean;
  loggedUser: UserDTO;

  ngOnInit(): void {
    this.authService.loggedUser$.subscribe((res) => (this.loggedUser = res));
    this.authService.isLoggedIn$.subscribe((res) => (this.isLoggedIn = res));
  }

  logout() {
    this.authService.logout().subscribe();
  }

  openActivity() {
    this.dialogService.showUserActivity(this.loggedUser.id);
  }

  openFriends() {
    this.dialogService.showUserFriends();
  }
}
