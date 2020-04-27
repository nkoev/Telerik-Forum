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

@NgModule({
  declarations: [
    LoginComponent,
    CarouselComponent,
    RegisterComponent,
    UserProfileComponent,
    UserActivityComponent,
    UserFriendsComponent,
    AllUsersComponent,
  ],
  imports: [ReactiveFormsModule, SharedModule],
  exports: [AllUsersComponent],
  providers: [UsersDataService],
})
export class UsersModule {}
