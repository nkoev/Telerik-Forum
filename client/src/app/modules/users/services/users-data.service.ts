import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserDTO } from 'src/app/models/user.dto';
import { tap, map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class UsersDataService {
  private usersUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

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

  getSentFriendRequests() {
    return this.http.get<UserDTO[]>(`${this.usersUrl}/friends/requests/sent`);
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

  getAvatar(userId: string) {
    return this.http.get(`${this.usersUrl}/avatar/${userId}`).pipe(
      map((res: any) => new Uint8Array(res.data)),
      map((res: any) =>
        btoa(res.reduce((data, byte) => data + String.fromCharCode(byte), ''))
      ),
      map((res) =>
        res
          ? this.sanitizer.bypassSecurityTrustUrl(
              `data:image/png;base64,${res}`
            )
          : null
      )
    );
  }

  uploadAvatar(file: FormData) {
    return this.http.post(`${this.usersUrl}/avatar/upload`, file);
  }
}
