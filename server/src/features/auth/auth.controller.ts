import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDTO } from '../../models/users/user-login.dto';
import { Token } from '../../common/decorators/token.decorator';
import { AuthGuardWithBlacklisting } from '../../common/guards/auth-guard-with-blacklisting.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('session')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async login(
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    user: UserLoginDTO,
  ): Promise<{ token: string; avatar: string }> {
    return await this.authService.login(user);
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(AuthGuardWithBlacklisting)
  @HttpCode(HttpStatus.OK)
  async logout(@Token() token: string): Promise<{ msg: string }> {
    return await this.authService.logout(token);
  }
}
