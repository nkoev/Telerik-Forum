import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FileUploadService {
  observer = new Subject();
  public avatarUpload$ = this.observer.asObservable();

  emitData(data) {
    this.observer.next(data);
  }
}
