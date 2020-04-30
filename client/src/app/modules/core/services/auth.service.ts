import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import * as moment from 'moment';
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { UserLoginDTO } from 'src/app/models/user-login-dto';
import { StorageService } from './storage.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserDTO } from 'src/app/models/user.dto';

@Injectable()
export class AuthService {
  private authUrl = 'http://localhost:3000/session';

  private readonly isLoggedInSubject$ = new BehaviorSubject<boolean>(
    this.isUserLoggedIn()
  );
  private readonly loggedUserSubject$ = new BehaviorSubject<UserDTO>(
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

  public get loggedUser$(): Observable<UserDTO> {
    return this.loggedUserSubject$.asObservable();
  }

  login(user: UserLoginDTO) {
    return this.http.post(this.authUrl, user).pipe(
      tap((res: any) => {
        try {
          this.storage.save('token', res.token);
          const payload: any = jwt_decode(res.token);
          this.isLoggedInSubject$.next(true);
          this.loggedUserSubject$.next(payload);
          setTimeout(() => {
            this.storage.delete('token');
            this.router.navigate(['login']);
          }, Date.now() - payload.exp);
        } catch (err) {
          console.log(err);
        }
      })
    );
  }

  logout() {
    return this.http.delete(this.authUrl).pipe(
      tap(() => {
        this.storage.delete('token');
        this.router.navigate(['login']);
      })
    );
  }

  private isUserLoggedIn(): boolean {
    return this.storage.check('token');
  }

  private loggedUser(): UserDTO {
    try {
      return jwt_decode(this.storage.read('token'));
    } catch (error) {
      this.isLoggedInSubject$.next(false);

      return null;
    }
  }
}
