import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { UserDTO } from 'src/app/models/user.dto';
import { DialogService } from '../../services/dialog.service';
import { Subscription } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';
import { AvatarService } from 'src/app/modules/core/services/avatar.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
})
export class NavigationComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  loggedUser: UserDTO;
  isAdmin: boolean;
  avatar: string | SafeUrl = 'assets/posts/single-post-avatar.jpg';
  isLoggedIn: boolean;

  constructor(
    private authService: AuthService,
    private dialogService: DialogService,
    private avatarService: AvatarService,
    public dialog: MatDialog,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const sub1 = this.authService.loggedUser$.subscribe((res) => {
      this.loggedUser = res;
      this.isAdmin = res.roles.includes('Admin');
    });
    this.avatarService.getAvatar(this.loggedUser.id).subscribe((res) => {
      this.avatar = res;
    });
    this.subscriptions.push(sub1);
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

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  createPost() {
    this.dialogService.createPost({
      next: (data) => {
        data = { ...data, isAuthor: true };
        console.log('COMMENT ADDED');
        this.router.navigate(['/', 'posts', data.id]);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
