import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RegisterService {
  constructor(private http: HttpClient) {}

  private usersUrl = 'http://localhost:3000/users';

  register(username: string, password: string) {
    return this.http.post(this.usersUrl, {
      username,
      password,
    });
  }

  // checkUsernameNotTaken(username: string) {
  //   return this.http.get(this.usersUrl).pipe(
  //     map((res: any) => res.json()),
  //     map((users) => users.filter((user) => user.username === username)),
  //     map((users) => !users.length)
  //   );
  // }
}
