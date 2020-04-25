import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/user';

@Injectable()
export class UsersDataService {
  constructor(private http: HttpClient) {}

  private usersUrl = 'http://localhost:3000/users';

  register(username: string, password: string) {
    return this.http.post(this.usersUrl, {
      username,
      password,
    });
  }

  checkUsernameTaken(username: string) {
    return this.http
      .get(this.usersUrl)
      .pipe(
        map((users: any) =>
          users.includes((user) => user.username === username)
        )
      );
  }

  getUserActivity(userId: string) {
    return this.http.get(`${this.usersUrl}/${userId}/activity`);
  }

  getUserFriends(userId: string) {
    return this.http.get<User[]>(`${this.usersUrl}/friends`);
  }
}
