import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { User } from 'src/app/models/user';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { UserActivityComponent } from 'src/app/modules/users/components/user-activity/user-activity.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  constructor(private authService: AuthService, private matDialog: MatDialog) {}
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
    const dialogConfig = new MatDialogConfig();
    dialogConfig.id = 'modal-component';
    dialogConfig.height = 'auto';
    dialogConfig.width = 'auto';
    this.matDialog.open(UserActivityComponent, dialogConfig);
  }
}
