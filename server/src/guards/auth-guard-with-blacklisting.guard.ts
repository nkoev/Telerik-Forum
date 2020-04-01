import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "../features/auth/auth.service";

@Injectable()
export class AuthGuardWithBlacklisting extends AuthGuard('jwt') implements CanActivate {
    public constructor(private readonly authService: AuthService) {
        super();
    }

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        if (!(await super.canActivate(context))) {
            return false;
        }

        const request: any = context.switchToHttp().getRequest();

        // Check if the token in the request is blacklisted
        // console.log(await this.authService.isTokenBlacklisted(request.headers.authorization.split(' ')[1]));

        return true;
    }
}