import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UserActivityComponent } from 'src/app/modules/users/components/user-activity/user-activity.component';
import { Activity } from 'src/app/models/activity';
import { UsersDataService } from 'src/app/modules/users/services/users-data.service';
import { map } from 'rxjs/operators';
import { UserFriendsComponent } from 'src/app/modules/users/components/user-friends/users-friends.component';

@Injectable()
export class DialogService {
  constructor(
    private matDialog: MatDialog,
    private usersDataService: UsersDataService
  ) {}

  showUserActivity(userId: string) {
    this.usersDataService
      .getUserActivity(userId)
      .pipe(
        map((data: Activity[]) => {
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

  showUserFriends() {
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
