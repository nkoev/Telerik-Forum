import { Controller, HttpCode, HttpStatus, Body, Post } from '@nestjs/common';
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('/login')
    @HttpCode(HttpStatus.ACCEPTED)
    public loginUser(@Body() user: any) {
        const { username, password } = user;

        this.usersService.loginUser(username, password);

        return { msg: 'Success! Send JWT...'};
    }
}
