import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { UserShowDTO } from '../../../models/users/user-show.dto';

/* 
ERROR: Class constructor MixinStrategy cannot be invoked without 'new'
https://stackoverflow.com/questions/50654877/typeerror-class-constructor-mixinstrategy-cannot-be-invoked-without-new
*/

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: UserShowDTO) {
    // the returned user is injected into the Request -> request.user
    // everytime when we call the validate() method
    return await this.authService.findUserByUsername(payload.username);
  }
}
