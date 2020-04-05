import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {

    const role: string = this.reflector.get<string>('role', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const userRoles: string[] = request.user.roles.map(role => role.name);

    if (!role) {
      return true;
    }

    return userRoles.includes(role);
  }
}