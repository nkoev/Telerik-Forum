import { NgModule } from '@angular/core';
import { LoginComponent } from './pages/login-page/login.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { RegisterComponent } from './pages/register/register.component';
import { UsersDataService } from './services/users-data.service';
import { UserAccountComponent } from './pages/user-account/account.component';
import { UserActivityComponent } from './components/user-activity/user-activity.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LoginComponent,
    CarouselComponent,
    RegisterComponent,
    UserAccountComponent,
    UserActivityComponent,
  ],
  imports: [ReactiveFormsModule, SharedModule],
  providers: [UsersDataService],
})
export class UsersModule {}
