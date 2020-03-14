import { Controller, HttpCode, HttpStatus, Body, Post } from '@nestjs/common';
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    // REGISTER
    @Post('')
    @HttpCode(HttpStatus.CREATED)
    async registerUser(
        @Body('username') username: string,
        @Body('password') password: string
    ) {
        return await this.usersService.registerUser({"username": username, "password": password});
    }

    // // LOGIN
    @Post('/session')
    @HttpCode(HttpStatus.ACCEPTED)
    async loginUser(
        @Body('username') username: string,
        @Body('password') password: string
    ) {
        return await this.usersService.loginUser({"username": username, "password": password});
    }
}
