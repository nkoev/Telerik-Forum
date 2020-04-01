import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../constants/secret';
import { JWTPayload } from '../../../models/payload/jwt-payload';
import { AuthService } from '../auth.service';

/* 
ERROR: Class constructor MixinStrategy cannot be invoked without 'new'
https://stackoverflow.com/questions/50654877/typeerror-class-constructor-mixinstrategy-cannot-be-invoked-without-new
*/

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    async validate(payload: JWTPayload) {

        // the returned user is injected into the Request -> request.user
        // everytime when we call the validate() method
        return await this.authService.findUserByUsername(payload.username);
    }
}