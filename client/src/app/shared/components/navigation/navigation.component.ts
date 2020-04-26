import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { User } from 'src/app/models/user';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { UserActivityComponent } from 'src/app/modules/users/components/user-activity/user-activity.component';
import { UserFriendsComponent } from 'src/app/modules/users/components/user-friends/users-friends.component';
import { transition } from '@angular/animations';
import { UsersDataService } from 'src/app/modules/users/services/users-data.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private matDialog: MatDialog,
    private usersDataService: UsersDataService
  ) {}
  isLoggedIn: boolean;
  loggedUser: User;

  ngOnInit(): void {
    this.authService.loggedUser$.subscribe((res) => (this.loggedUser = res));
    this.authService.isLoggedIn$.subscribe((res) => (this.isLoggedIn = res));
  }

  logout() {
    this.authService.logout().subscribe();
  }

  openActivity() {
    this.usersDataService
      .getUserActivity(this.loggedUser.id)
      .pipe(
        map((data) => {
          const dialogConfig = new MatDialogConfig();
          dialogConfig.id = 'modal-component';
          dialogConfig.height = 'auto';
          dialogConfig.width = 'auto';
          dialogConfig.panelClass = 'dialog';
          dialogConfig.data = data;
          return this.matDialog.open(UserActivityComponent, dialogConfig);
        })
      )
      .subscribe();
  }

  openFriends() {
    this.usersDataService
      .getUserFriends()
      .pipe(
        map((data) => {
          const dialogConfig = new MatDialogConfig();
          dialogConfig.id = 'modal-component';
          dialogConfig.height = 'auto';
          dialogConfig.width = 'auto';
          dialogConfig.panelClass = 'dialog';
          dialogConfig.data = data;
          return this.matDialog.open(UserFriendsComponent, dialogConfig);
        })
      )
      .subscribe();
  }
}
