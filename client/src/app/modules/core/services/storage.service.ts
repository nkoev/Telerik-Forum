import { Injectable } from '@angular/core';
import { CoreModule } from '../core.module';

@Injectable()
export class StorageService {
  constructor() {}

  public save(key: string, value: any) {
    localStorage.setItem(key, String(value));
  }

  public read(key: string) {
    const value = localStorage.getItem(key);

    return value && value !== 'undefined' ? value : null;
  }

  public check(key: string): boolean {
    return localStorage.getItem(key) ? true : false;
  }

  public delete(key: string) {
    localStorage.removeItem(key);
  }

  public clear() {
    localStorage.clear();
  }
}
