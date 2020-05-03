import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AvatarService {
  private readonly usersUrl = 'http://localhost:3000/users';
  private defaultAvatar = 'assets/posts/single-post-avatar.jpg';

  constructor(private sanitizer: DomSanitizer, private http: HttpClient) {}

  getAvatar(userId: string) {
    return this.http.get(`${this.usersUrl}/avatar/${userId}`).pipe(
      map((res: any) => {
        return res.data.length ? this.bufferToSafeUrl(res) : this.defaultAvatar;
      })
    );
  }

  uploadAvatar(file: FormData) {
    return this.http.post(`${this.usersUrl}/avatar/upload`, file);
  }

  private bufferToSafeUrl(buffer: any) {
    const toArray = new Uint8Array(buffer.data);
    const toString = btoa(
      toArray.reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    const toSafeUrl = this.sanitizer.bypassSecurityTrustUrl(
      `data:image/png;base64,${toString}`
    );
    return toSafeUrl ? toSafeUrl : null;
  }
}
