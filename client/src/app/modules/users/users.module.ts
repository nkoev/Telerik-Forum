import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersRoutingModule } from './users-routing.module';
import { LoginComponent } from './pages/login-page/login.component';
import { CarouselComponent } from './components/carousel/carousel/carousel.component';
import { RegisterComponent } from './pages/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { AppMaterialModule } from 'src/app/shared/modules/material.module';
import { UsersDataService } from './services/users-data.service';
import { UserAccountComponent } from './pages/user-account/account.component';
import { UserActivityComponent } from './components/user-activity/user-activity.component';

@NgModule({
  declarations: [
    LoginComponent,
    CarouselComponent,
    RegisterComponent,
    UserAccountComponent,
    UserActivityComponent,
  ],
  imports: [
    CommonModule,
    AppMaterialModule,
    HttpClientXsrfModule.disable(),
    UsersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [UsersDataService],
})
export class UsersModule {}
