import { Controller, HttpCode, HttpStatus, Body, Post, Delete, ValidationPipe, Param, ParseUUIDPipe, Get, Query, UseGuards, Put } from '@nestjs/common';
import { UsersService } from './users.service'
import { UserRegisterDTO } from '../../models/users/user-register.dto';
import { UserShowDTO } from '../../models/users/user-show.dto';
import { AddFriendDTO } from '../../models/users/add-friend.dto';
import { ShowNotificationDTO } from '../../models/notifications/show-notification.dto';
import { BanStatusDTO } from '../../models/users/ban-status.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AccessLevel } from '../../common/decorators/roles.decorator';
import { AuthGuardWithBlacklisting } from '../../common/guards/auth-guard-with-blacklisting.guard';
import { BanGuard } from '../../common/guards/ban.guard';
import { LoggedUser } from '../../common/decorators/user.decorator';
import { User } from '../../database/entities/user.entity';
import { ActivityShowDTO } from '../../models/activity/activity-show.dto';

@Controller('users')
@UseGuards(RolesGuard)
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
    @UseGuards(AuthGuardWithBlacklisting)
    @HttpCode(HttpStatus.OK)
    async sendFriendRequest(
        @LoggedUser() loggedUser: User,
        @Body(new ValidationPipe({
            whitelist: true,
            transform: true
        })) friendToAdd: AddFriendDTO
    ): Promise<UserShowDTO> {

        return await this.usersService.sendFriendRequest(loggedUser, friendToAdd);
    }

    //  ACCEPT FRIEND REQUEST
    @Put('/friends')
    @UseGuards(AuthGuardWithBlacklisting)
    @HttpCode(HttpStatus.OK)
    async acceptFriendRequest(
        @LoggedUser() loggedUser: User,
        @Body(new ValidationPipe({
            whitelist: true,
            transform: true
        })) friendToAccept: AddFriendDTO
    ): Promise<UserShowDTO> {

        return await this.usersService.acceptFriendRequest(loggedUser, friendToAccept);
    }

    //  DELETE FRIEND REQUEST
    @Delete('/friends')
    @UseGuards(AuthGuardWithBlacklisting)
    @HttpCode(HttpStatus.OK)
    async deleteFriendRequest(
        @LoggedUser() loggedUser: User,
        @Body(new ValidationPipe({
            whitelist: true,
            transform: true
        })) friendToDelete: AddFriendDTO
    ): Promise<{ msg: string }> {

        return await this.usersService.deleteFriendRequest(loggedUser, friendToDelete);
    }

    //  REMOVE FRIEND
    @Delete('/friends/:friendId')
    @UseGuards(AuthGuardWithBlacklisting)
    @HttpCode(HttpStatus.CREATED)
    async removeFriend(
        @LoggedUser() loggedUser: User,
        @Param('friendId', ParseUUIDPipe) friendId: string
    ): Promise<UserShowDTO> {

        return await this.usersService.removeFriend(loggedUser, friendId);
    }

    //  GET ALL FRIEND REQUESTS
    @Get('/friends/requests')
    @UseGuards(AuthGuardWithBlacklisting)
    @HttpCode(HttpStatus.OK)
    async getFriendRequests(
        @LoggedUser() loggedUser: User
    ): Promise<UserShowDTO[]> {

        return await this.usersService.getFriendRequests(loggedUser);
    }

    //  GET ALL FRIENDS
    @Get('/friends')
    @UseGuards(AuthGuardWithBlacklisting)
    @HttpCode(HttpStatus.OK)
    async getFriends(
        @LoggedUser() loggedUser: User
    ): Promise<UserShowDTO[]> {
        return await this.usersService.getFriends(loggedUser);
    }

    //  GET ALL NOTIFICATIONS
    @Get('/notifications')
    @UseGuards(AuthGuardWithBlacklisting)
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuardWithBlacklisting)
    async getNotifications(
        @LoggedUser() loggedUser: User
    ): Promise<ShowNotificationDTO[]> {

        return await this.usersService.getNotifications(loggedUser);
    }

    // GET USER ACTIVITY
    @Get('/:userId/activity')
    @UseGuards(AuthGuardWithBlacklisting)
    @HttpCode(HttpStatus.OK)
    async getUserActivity(
        @LoggedUser() loggedUser: User,
        @Param('userId', ParseUUIDPipe) userId: string
    ): Promise<ActivityShowDTO[]> {

        return await this.usersService.getUserActivity(loggedUser, userId);
    }

    // BAN USERS
    @Put('/:userId/banstatus')
    @AccessLevel('Admin')
    @UseGuards(BanGuard, AuthGuardWithBlacklisting)
    async updateBanStatus(
        @Param('userId', ParseUUIDPipe) userId: string,
        @Body(new ValidationPipe({
            whitelist: true,
            transform: true
        })) banStatusUpdate: BanStatusDTO
    ): Promise<UserShowDTO> {

        return await this.usersService.updateBanStatus(userId, banStatusUpdate);
    }
}
