import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { UserDTO } from 'src/app/models/user.dto';
import { DialogService } from '../../services/dialog.service';
import { Subscription } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';
import { UsersDataService } from 'src/app/modules/users/services/users-data.service';
import { AvatarService } from 'src/app/modules/core/services/avatar.service';

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

  constructor(
    private authService: AuthService,
    private dialogService: DialogService,
    private fileUploadService: AvatarService,
    private usersDataService: UsersDataService
  ) {}

  ngOnInit(): void {
    const sub1 = this.authService.loggedUser$.subscribe((res) => {
      this.loggedUser = res;
      this.isAdmin = res.roles.includes('Admin');
    });
    const sub2 = this.fileUploadService.avatarUpload$.subscribe((avatarUrl) => {
      if (avatarUrl) {
        this.avatar = avatarUrl;
      }
    });
    this.usersDataService
      .getAvatar(this.loggedUser.id)
      .subscribe((avatarUrl) => {
        if (avatarUrl) {
          this.avatar = avatarUrl;
        }
      });
    this.subscriptions.push(sub1, sub2);
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
}
