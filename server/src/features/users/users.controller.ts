import { Controller, HttpCode, HttpStatus, Body, Post, Delete, ValidationPipe, Param, ParseUUIDPipe, Get, Query, UseGuards, Put } from '@nestjs/common';
import { UsersService } from './users.service'
import { UserRegisterDTO } from '../../models/users/user-register.dto';
import { UserLoginDTO } from '../../models/users/user-login.dto';
import { UserShowDTO } from '../../models/users/user-show.dto';
import { AddFriendDTO } from '../../models/users/add-friend.dto';
import { ShowNotificationDTO } from '../../models/notifications/show-notification.dto';
import { User } from '../../common/decorators/user.decorator';
import { AuthGuardWithBlacklisting } from '../../common/guards/auth-guard-with-blacklisting.guard';

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

    //  SEND FRIEND REQUEST
    @Post('/friends')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuardWithBlacklisting)
    async sendFriendRequest(
        @User() user: UserShowDTO,
        @Body(new ValidationPipe({
            transform: true
        })) friendToAdd: AddFriendDTO
    ): Promise<UserShowDTO> {

        return await this.usersService.sendFriendRequest(user.id, friendToAdd);
    }

    //  ACCEPT FRIEND REQUEST
    @Put('/friends')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuardWithBlacklisting)
    async acceptFriendRequest(
        @User() user: UserShowDTO,
        @Body(new ValidationPipe({
            transform: true
        })) friendToAccept: AddFriendDTO
    ): Promise<UserShowDTO> {

        return await this.usersService.acceptFriendRequest(user.id, friendToAccept);
    }

    //  DELETE FRIEND REQUEST
    @Delete('/friends')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuardWithBlacklisting)
    async deleteFriendRequest(
        @User() user: UserShowDTO,
        @Body(new ValidationPipe({
            transform: true
        })) friendToDelete: AddFriendDTO
    ): Promise<{ msg: string }> {

        return await this.usersService.deleteFriendRequest(user.id, friendToDelete);
    }

    //  REMOVE FRIEND
    @Delete('/friends/:friendId')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuardWithBlacklisting)
    async removeFriend(
        @User() user: UserShowDTO,
        @Param('friendId', ParseUUIDPipe) friendId: string
    ): Promise<UserShowDTO> {

        return await this.usersService.removeFriend(user.id, friendId);
    }

    //  GET ALL FRIEND REQUESTS
    @Get('/friends/requests')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuardWithBlacklisting)
    async getFriendRequests(
        @User() user: UserShowDTO
    ): Promise<UserShowDTO[]> {

        return await this.usersService.getFriendRequests(user.id);
    }

    //  GET ALL FRIENDS
    @Get('/friends')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuardWithBlacklisting)
    async getFriends(
        @User() user: UserShowDTO
    ): Promise<UserShowDTO[]> {

        return await this.usersService.getFriends(user.id);
    }

    //  GET ALL NOTIFICATIONS
    @Get('/notifications')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuardWithBlacklisting)
    async getNotifications(
        @User() user: UserShowDTO
    ): Promise<ShowNotificationDTO[]> {

        return await this.usersService.getNotifications(user.id);
    }
}
