import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login-page/login.component';
import { RegisterComponent } from './pages/register/register.component';

const usersRoutes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  { path: 'register', component: RegisterComponent, outlet: 'popup' },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(usersRoutes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
