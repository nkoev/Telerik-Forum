import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import * as moment from 'moment';
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { UserLoginDTO } from 'src/app/models/user-login-dto';
import { StorageService } from './storage.service';

@Injectable()
export class AuthService {
  loggedUserId: '';
  private authUrl = 'http://localhost:3000/session';

  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: StorageService
  ) {}

  login(user: UserLoginDTO) {
    return this.http.post(this.authUrl, user).pipe(
      tap((res: any) => localStorage.setItem('jwt', res.token)),
      tap((res) => {
        const payload: any = jwt_decode(res.token);
        localStorage.setItem('loggedUserId', payload.id);
        localStorage.setItem('username', payload.username);
      })
    );
  }

  logout() {
    return this.http
      .delete(this.authUrl, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
      })
      .pipe(
        tap(() => localStorage.clear()),
        tap(() => this.router.navigate(['login']))
      );
  }

  isLoggedIn() {
    return Boolean(localStorage.getItem('jwt'));
  }
}
