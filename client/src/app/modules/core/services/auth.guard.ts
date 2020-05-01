import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(public authService: AuthService, public router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isLoggedIn$.pipe(
      tap((loggedIn) => {
        if (!loggedIn) {
          this.router.navigate(['login']);
          // this.notificator.error(`You not authorized to access this page!`);
        }
      })
    );
  }
}
