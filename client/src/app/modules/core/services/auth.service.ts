import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http
      .post('http://localhost:3000/session', {
        username,
        password,
      })
      .pipe(tap((res: any) => localStorage.setItem('jwt', res.token)));
  }

  logout() {
    localStorage.removeItem('jwt');
  }

  isLoggedIn() {
    return Boolean(localStorage.getItem('jwt'));
  }
}
