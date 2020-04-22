import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = 'http://localhost:3000/session';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http
      .post(this.authUrl, {
        username,
        password,
      })
      .pipe(tap((res: any) => localStorage.setItem('jwt', res.token)));
  }

  logout() {
    return this.http
      .delete(this.authUrl)
      .pipe(tap(() => localStorage.removeItem('jwt')));
  }

  isLoggedIn() {
    return Boolean(localStorage.getItem('jwt'));
  }
}
