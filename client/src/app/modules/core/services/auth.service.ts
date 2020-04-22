import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import * as moment from 'moment';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedUserId: '';
  private authUrl = 'http://localhost:3000/session';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http
      .post(this.authUrl, {
        username,
        password,
      })
      .pipe(
        tap((res: any) => localStorage.setItem('jwt', res.token)),
        tap((res) => {
          const payload: any = jwt_decode(res.token);
          localStorage.setItem('loggedUserId', payload.id);
        })
      );
  }

  logout() {
    return this.http.delete(this.authUrl).pipe(
      tap(() => localStorage.removeItem('jwt')),
      tap(() => localStorage.removeItem('loggedUserId'))
    );
  }

  isLoggedIn() {
    return Boolean(localStorage.getItem('jwt'));
  }
}
