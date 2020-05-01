import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class AvatarService {
  avatar: SafeUrl;

  observer = new Subject();
  public avatarUpload$ = this.observer.asObservable();

  emitData(data) {
    this.observer.next(data);
  }
}
