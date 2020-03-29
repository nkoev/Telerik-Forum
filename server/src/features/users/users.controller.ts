import { Controller, HttpCode, HttpStatus, Body, Post, Delete, ValidationPipe, Param, ParseUUIDPipe, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service'
import { RegisterUserDTO } from '../../models/users/register-user.dto';
import { LoginUserDTO } from '../../models/users/login-user.dto';
import { ShowUserDTO } from '../../models/users/show-user.dto';
import { AddFriendDTO } from '../../models/users/add-friend.dto';
import { ShowNotificationDTO } from '../../models/notifications/show-notification.dto';

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

    //  ADD FRIEND
    @Post('/:userId/friends')
    @HttpCode(HttpStatus.CREATED)
    async addFriend(
        @Param('userId', ParseUUIDPipe) userId: string,
        @Body(new ValidationPipe({
            transform: true
        })) user: AddFriendDTO
    ): Promise<ShowUserDTO> {

        return await this.usersService.addFriend(userId, user);
    }

    //  REMOVE FRIEND
    @Delete('/:userId/friends/:friendId')
    @HttpCode(HttpStatus.CREATED)
    async removeFriend(
        @Param('userId', ParseUUIDPipe) userId: string,
        @Param('friendId', ParseUUIDPipe) friendId: string
    ): Promise<ShowUserDTO> {

        return await this.usersService.removeFriend(userId, friendId);
    }

    //  GET ALL FRIENDS
    @Get('/:userId/friends')
    @HttpCode(HttpStatus.OK)
    async getFriends(
        @Param('userId', ParseUUIDPipe) userId: string
    ): Promise<ShowUserDTO[]> {

        return await this.usersService.getFriends(userId);
    }

    //  GET ALL NOTIFICATIONS
    @Get('/notifications')
    @HttpCode(HttpStatus.OK)
    async getNotifications(
        @Query('userId', ParseUUIDPipe) userId: string
    ): Promise<ShowNotificationDTO[]> {

        return await this.usersService.getNotifications(userId);
    }
}
