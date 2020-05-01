import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthGuard } from './modules/core/services/auth.guard';
import { LoginComponent } from './modules/users/pages/login-page/login.component';
import { RegisterComponent } from './modules/users/pages/register/register.component';
import { UserProfileComponent } from './modules/users/pages/user-profile/profile.component';
import { AvatarResolverService } from './shared/services/avatar-resolver.service';

const appRoutes: Routes = [
  { path: '', redirectTo: 'posts', pathMatch: 'full' },
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
  {
    path: 'profile/:userId',
    component: UserProfileComponent,
    resolve: { avatar: AvatarResolverService },
    canActivate: [AuthGuard],
  },
  {
    path: 'profile/:userId',
    component: UserProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'posts',
    loadChildren: () =>
      import('./modules/posts/posts.module').then((m) => m.PostsModule),
    canActivate: [AuthGuard],
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
