import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserDTO } from 'src/app/models/user.dto';
import { Observable } from 'rxjs';
import { BanStatusDTO } from 'src/app/models/ban-status.dto';

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
    return this.http.get<UserDTO[]>(`${this.usersUrl}/friends`);
  }

  getFriendStatus(userId: string) {
    return this.http.get(`${this.usersUrl}/friends/status/${userId}`);
  }

  getReceivedFriendRequests() {
    return this.http.get<UserDTO[]>(
      `${this.usersUrl}/friends/requests/received`
    );
  }

  sendFriendRequest(userId: string) {
    return this.http.post(`${this.usersUrl}/friends/requests/${userId}`, {
      body: {},
    });
  }

  acceptFriendRequest(userId: string) {
    return this.http.put(`${this.usersUrl}/friends/requests/${userId}`, {
      body: {},
    });
  }

  rejectFriendRequest(userId: string) {
    return this.http.delete(`${this.usersUrl}/friends/requests/${userId}`);
  }

  removeFriend(userId: string) {
    return this.http.delete(`${this.usersUrl}/friends/${userId}`);
  }

  deleteUser(userId: string): Observable<UserDTO> {
    return this.http.delete<UserDTO>(`${this.usersUrl}/${userId}`);
  }

  banUser(userId: string, body: BanStatusDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.usersUrl}/${userId}/banstatus`, body);
  }
}
