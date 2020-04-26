import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/user';

@Injectable()
export class UsersDataService {
  private usersUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  register(username: string, password: string) {
    return this.http.post(this.usersUrl, {
      username,
      password,
    });
  }

  getAllUsers() {
    return this.http.get(this.usersUrl);
  }

  getUserActivity(userId: string) {
    return this.http.get(`${this.usersUrl}/${userId}/activity`);
  }

  getUserFriends() {
    return this.http.get<User[]>(`${this.usersUrl}/friends`);
  }

  getFriendRequests() {
    return this.http.get<User[]>(`${this.usersUrl}/friends/requests`);
  }

  sendFriendRequest(userId: string) {
    return this.http.get(`${this.usersUrl}/friends/${userId}`);
  }
}
