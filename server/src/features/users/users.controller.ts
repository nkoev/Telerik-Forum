import { Controller, HttpCode, HttpStatus, Body, Post, Delete, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service'
import { RegisterUserDTO } from '../../models/users/register-user.dto';
import { LoginUserDTO } from '../../models/users/login-user.dto';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    //  REGISTER
    @Post('')
    @HttpCode(HttpStatus.CREATED)
    async registerUser(@Body(new ValidationPipe({
        transform: true
    })) user: RegisterUserDTO) {
        return await this.usersService.registerUser(user);
    }

    //  LOGIN
    @Post('/session')
    @HttpCode(HttpStatus.ACCEPTED)
    async loginUser(@Body(new ValidationPipe({
        transform: true
    })) user: LoginUserDTO) {
        return await this.usersService.loginUser(user);
    }

    //  LOGOUT
    @Delete('/session')
    @HttpCode(HttpStatus.OK)
    async logoutUser() {

        await this.usersService.logoutUser();

        return { msg: 'Success! User logged out...' };
    }
}
