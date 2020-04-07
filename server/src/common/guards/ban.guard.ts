import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class BanGuard implements CanActivate {

  canActivate(context: ExecutionContext): boolean {

    const request = context.switchToHttp().getRequest();

    return !request.user.banStatus.isBanned

  }
}