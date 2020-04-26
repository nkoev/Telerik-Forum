import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthGuard } from './modules/core/services/auth.guard';
import { LoginComponent } from './modules/users/pages/login-page/login.component';
import { RegisterComponent } from './modules/users/pages/register/register.component';
import { UserProfileComponent } from './modules/users/pages/user-profile/profile.component';

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
  { path: 'profile/:userId', component: UserProfileComponent },
  {
    path: 'home',
    component: HomePageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'posts',
    loadChildren: () =>
      import('./modules/posts/posts.module').then((m) => m.PostsModule),
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
