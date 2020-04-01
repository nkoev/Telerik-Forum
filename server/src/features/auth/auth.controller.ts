import { Controller, Post, Body, HttpCode, HttpStatus, ValidationPipe, Delete } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserLoginDTO } from "../../models/users/user-login.dto";
import { Token } from "../../decorators/token.decorator";

@Controller('session')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post()
    @HttpCode(HttpStatus.ACCEPTED)
    async login(
        @Body(new ValidationPipe({
            whitelist: true,
            transform: true
        })) user: UserLoginDTO
    ): Promise<{ token: string }> {
        return await this.authService.login(user);
    }

    @Delete()
    @HttpCode(HttpStatus.OK)
    async logout(@Token() token: string): Promise<{ msg: string }> {

        return await this.authService.logout(token);
    }

}