import { Controller, HttpCode, HttpStatus, Body, Post, Delete, ValidationPipe, Param, ParseUUIDPipe, Get, Query, Put, UseGuards } from '@nestjs/common';
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
import { ReqUser } from '../../common/decorators/user.decorator';
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

    //  ADD FRIEND
    @Post('/:userId/friends')
    @UseGuards(BanGuard, AuthGuardWithBlacklisting)
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
    @UseGuards(BanGuard, AuthGuardWithBlacklisting)
    @HttpCode(HttpStatus.CREATED)
    async removeFriend(
        @Param('userId', ParseUUIDPipe) userId: string,
        @Param('friendId', ParseUUIDPipe) friendId: string
    ): Promise<UserShowDTO> {

        return await this.usersService.removeFriend(userId, friendId);
    }

    //  GET ALL FRIENDS
    @Get('/:userId/friends')
    @UseGuards(BanGuard, AuthGuardWithBlacklisting)
    @HttpCode(HttpStatus.OK)
    async getFriends(
        @Param('userId', ParseUUIDPipe) userId: string
    ): Promise<UserShowDTO[]> {

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

    // GET USER ACTIVITY
    @Get('/:userId/activity')
    @UseGuards(AuthGuardWithBlacklisting)
    @HttpCode(HttpStatus.OK)
    async getUserActivity(
        @Param('userId', ParseUUIDPipe) userId: string,
        @ReqUser() loggedUser: User
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
