import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { UsersDataService } from '../../modules/users/services/users-data.service';

@Injectable({
  providedIn: 'root',
})
export class AvatarResolverService implements Resolve<SafeUrl> {
  constructor(private usersDataService: UsersDataService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const userId = route.params.userId;
    return this.usersDataService.getAvatar(userId);
  }
}
