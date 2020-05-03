import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserDTO } from 'src/app/models/user.dto';
import { Observable } from 'rxjs';
import { BanStatusDTO } from 'src/app/models/ban-status.dto';
import { ActivityDTO } from 'src/app/models/activity.dto';
import { FriendStatusDTO } from 'src/app/models/friend-status.dto';

@Injectable()
export class UsersDataService {
  private usersUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.usersUrl);
  }

  getUserActivity(userId: string): Observable<ActivityDTO[]> {
    return this.http.get<ActivityDTO[]>(`${this.usersUrl}/${userId}/activity`);
  }

  getUserFriends(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.usersUrl}/friends`);
  }

  getFriendStatus(userId: string): Observable<FriendStatusDTO> {
    return this.http.get<FriendStatusDTO>(
      `${this.usersUrl}/friends/status/${userId}`
    );
  }

  getFriendRequests(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(
      `${this.usersUrl}/friends/requests/received`
    );
  }

  register(username: string, password: string): Observable<UserDTO> {
    return this.http.post<UserDTO>(this.usersUrl, {
      username,
      password,
    });
  }

  sendFriendRequest(userId: string): Observable<UserDTO> {
    return this.http.post<UserDTO>(
      `${this.usersUrl}/friends/requests/${userId}`,
      {
        body: {},
      }
    );
  }

  acceptFriendRequest(userId: string): Observable<UserDTO> {
    return this.http.put<UserDTO>(
      `${this.usersUrl}/friends/requests/${userId}`,
      {
        body: {},
      }
    );
  }

  banUser(userId: string, body: BanStatusDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.usersUrl}/${userId}/banstatus`, body);
  }

  rejectFriendRequest(userId: string): Observable<{ msg: string }> {
    return this.http.delete<{ msg: string }>(
      `${this.usersUrl}/friends/requests/${userId}`
    );
  }

  removeFriend(userId: string): Observable<UserDTO> {
    return this.http.delete<UserDTO>(`${this.usersUrl}/friends/${userId}`);
  }

  deleteUser(userId: string): Observable<UserDTO> {
    return this.http.delete<UserDTO>(`${this.usersUrl}/${userId}`);
  }
}
