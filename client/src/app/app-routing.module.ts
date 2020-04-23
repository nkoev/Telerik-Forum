import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { Error404PageComponent } from './pages/error404-page/error404-page.component';
import { AuthGuardService } from './modules/core/services/auth-guard.service';
import { LoginComponent } from './modules/users/pages/login-page/login.component';
import { RegisterComponent } from './modules/users/pages/register/register.component';
import { UserAccountComponent } from './modules/users/pages/user-account/account.component';

const appRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    children: [
      {
        path: 'register',
        component: RegisterComponent,
        outlet: 'popup',
      },
    ],
  },
  { path: 'account', component: UserAccountComponent },
  {
    path: 'home',
    component: HomePageComponent,
    canActivate: [AuthGuardService],
  },
  { path: '404', component: Error404PageComponent },
  { path: '**', redirectTo: '/404', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
