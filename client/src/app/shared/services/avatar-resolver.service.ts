import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { AvatarService } from 'src/app/modules/core/services/avatar.service';

@Injectable({
  providedIn: 'root',
})
export class AvatarResolverService implements Resolve<SafeUrl> {
  constructor(private avatarService: AvatarService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    const userId = route.params.userId;
    return this.avatarService.getAvatar(userId);
  }
}
