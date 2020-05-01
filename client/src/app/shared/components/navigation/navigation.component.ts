import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { UserDTO } from 'src/app/models/user.dto';
import { DialogService } from '../../services/dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private dialogService: DialogService,
    public dialog: MatDialog,
    private readonly router: Router,
  ) { }
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

  createPost() {
    this.dialogService.createPost(
      {
        next: data => {
          data = { ...data, isAuthor: true };
          console.log('COMMENT ADDED');
          this.router.navigate(['/', 'posts', data.id]);
        },
        error: err => {
          console.log(err);
        }
      }
    );
  }

}
