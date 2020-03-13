import { Controller, HttpCode, HttpStatus, Body, Post, Delete } from '@nestjs/common';
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    // REGISTER
    @Post('')
    @HttpCode(HttpStatus.CREATED)
    public registerUser(@Body() user: any) {
        const { username, password } = user;

        this.usersService.registerUser(username, password);

        return { msg: 'User registered...'};
    }

    // LOGIN
    @Post('/session')
    @HttpCode(HttpStatus.ACCEPTED)
    public loginUser(@Body() user: any) {
        const { username, password } = user;

        this.usersService.loginUser(username, password);

        return { msg: 'Success! Send JWT...'};
    }

    @Delete('/session')
    @HttpCode(HttpStatus.OK)
    public logoutUser() {

        this.usersService.logoutUser();

        return { msg: 'Success! User logged out...'};
    }
}
