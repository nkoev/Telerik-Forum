import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {

    const role = this.reflector.get<string[]>('role', context.getHandler());
    const request = context.switchToHttp().getRequest();

    if (!role) {
      return true;
    }

    const user = request.user;
    return user.roles.includes(role);
  }
}