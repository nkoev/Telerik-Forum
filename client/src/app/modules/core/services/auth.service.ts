import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, shareReplay } from 'rxjs/operators';
import * as moment from 'moment';
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { UserLoginDTO } from 'src/app/models/user-login-dto';
import { StorageService } from './storage.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user';
import { CoreModule } from '../core.module';

@Injectable()
export class AuthService {
  private authUrl = 'http://localhost:3000/session';

  private readonly isLoggedInSubject$ = new BehaviorSubject<boolean>(
    this.isUserLoggedIn()
  );
  private readonly loggedUserSubject$ = new BehaviorSubject<User>(
    this.loggedUser()
  );

  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: StorageService
  ) {}

  public get isLoggedIn$(): Observable<boolean> {
    return this.isLoggedInSubject$.asObservable();
  }

  public get loggedUser$(): Observable<User> {
    return this.loggedUserSubject$.asObservable();
  }

  login(user: UserLoginDTO) {
    return this.http.post(this.authUrl, user).pipe(
      tap((res: any) => {
        try {
          this.storage.save('token', res.token);
          const loggedUser: User = jwt_decode(res.token);
          this.isLoggedInSubject$.next(true);
          this.loggedUserSubject$.next(loggedUser);
        } catch (err) {
          console.log(err);
        }
      })
    );
  }

  logout() {
    return this.http
      .delete(this.authUrl, {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
      })
      .pipe(
        tap(() => {
          this.router.navigate(['login']);
          this.storage.delete('token');
          this.isLoggedInSubject$.next(false);
          this.loggedUserSubject$.next(null);
        })
      );
  }

  private isUserLoggedIn(): boolean {
    return this.storage.check('token');
  }

  private loggedUser(): User {
    try {
      return jwt_decode(this.storage.read('token'));
    } catch (error) {
      this.isLoggedInSubject$.next(false);

      return null;
    }
  }
}
