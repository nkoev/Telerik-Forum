import { NgModule } from '@angular/core';
import { LoginComponent } from './pages/login-page/login.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { RegisterComponent } from './pages/register/register.component';
import { UsersDataService } from './services/users-data.service';
import { UserProfileComponent } from './pages/user-profile/profile.component';
import { UserActivityComponent } from './components/user-activity/user-activity.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { UserFriendsComponent } from './components/user-friends/users-friends.component';
import { AllUsersComponent } from './components/all-users/all-users.component';
import { FriendRequestButtonsComponent } from './components/friend-request-buttons/friend-request-buttons.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { AdminControlsComponent } from './components/admin-controls/admin-controls.component';
import { BanDialogComponent } from './components/ban-dialog/ban-dialog.component';

@NgModule({
  declarations: [
    LoginComponent,
    CarouselComponent,
    RegisterComponent,
    UserProfileComponent,
    UserActivityComponent,
    UserFriendsComponent,
    AllUsersComponent,
    FriendRequestButtonsComponent,
    FileUploadComponent,
    AdminControlsComponent,
    BanDialogComponent,
  ],
  imports: [ReactiveFormsModule, SharedModule],
  exports: [AllUsersComponent],
  providers: [UsersDataService],
})
export class UsersModule {}
