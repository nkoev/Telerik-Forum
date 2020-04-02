import { Controller, HttpCode, HttpStatus, Body, Post, Delete, ValidationPipe, Param, ParseUUIDPipe, Get } from '@nestjs/common';
import { UsersService } from './users.service'
import { UserRegisterDTO } from '../../models/users/user-register.dto';
import { UserLoginDTO } from '../../models/users/user-login.dto';
import { UserShowDTO } from '../../models/users/user-show.dto';
import { AddFriendDTO } from '../../models/users/add-friend.dto';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) { }

    //  REGISTER
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async registerUser(@Body(new ValidationPipe({
        whitelist: true,
        transform: true
    })) user: UserRegisterDTO) {
        return await this.usersService.registerUser(user);
    }

    //  ADD FRIEND
    @Post('/:userId/friends')
    @HttpCode(HttpStatus.CREATED)
    async addFriend(
        @Param('userId', ParseUUIDPipe) userId: string,
        @Body(new ValidationPipe({
            transform: true
        })) user: AddFriendDTO
    ): Promise<UserShowDTO> {

        return await this.usersService.addFriend(userId, user);
    }

    //  REMOVE FRIEND
    @Delete('/:userId/friends/:friendId')
    @HttpCode(HttpStatus.CREATED)
    async removeFriend(
        @Param('userId', ParseUUIDPipe) userId: string,
        @Param('friendId', ParseUUIDPipe) friendId: string
    ): Promise<UserShowDTO> {

        return await this.usersService.removeFriend(userId, friendId);
    }

    //  GET ALL FRIENDS
    @Get('/:userId/friends')
    @HttpCode(HttpStatus.OK)
    async getFriends(
        @Param('userId', ParseUUIDPipe) userId: string
    ): Promise<UserShowDTO[]> {

        return await this.usersService.getFriends(userId);
    }
}
