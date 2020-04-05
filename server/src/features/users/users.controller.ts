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
import { User } from '../../common/decorators/user.decorator';

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
        @User() user: UserShowDTO,
        @Body(new ValidationPipe({
            transform: true
        })) friendToAdd: AddFriendDTO
    ): Promise<UserShowDTO> {

        return await this.usersService.sendFriendRequest(user.id, friendToAdd);
    }

    //  ACCEPT FRIEND REQUEST
    @Put('/friends')
    @UseGuards(AuthGuardWithBlacklisting)
    @HttpCode(HttpStatus.OK)
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
    @UseGuards(AuthGuardWithBlacklisting)
    @HttpCode(HttpStatus.OK)
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
    @UseGuards(BanGuard, AuthGuardWithBlacklisting)
    @HttpCode(HttpStatus.CREATED)
    async removeFriend(
        @User() user: UserShowDTO,
        @Param('friendId', ParseUUIDPipe) friendId: string
    ): Promise<UserShowDTO> {

        return await this.usersService.removeFriend(user.id, friendId);
    }

    //  GET ALL FRIEND REQUESTS
    @Get('/friends/requests')
    @UseGuards(AuthGuardWithBlacklisting)
    @HttpCode(HttpStatus.OK)
    async getFriendRequests(
        @User() user: UserShowDTO
    ): Promise<UserShowDTO[]> {

        return await this.usersService.getFriendRequests(user.id);
    }

    //  GET ALL FRIENDS
    @Get('/friends')
    @UseGuards(AuthGuardWithBlacklisting)
    @HttpCode(HttpStatus.OK)
    async getFriends(
        @User() user: UserShowDTO
    ): Promise<UserShowDTO[]> {

        return await this.usersService.getFriends(user.id);
    }

    //  GET ALL NOTIFICATIONS
    @Get('/notifications')
    @UseGuards(AuthGuardWithBlacklisting)
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuardWithBlacklisting)
    async getNotifications(
        @User() user: UserShowDTO
    ): Promise<ShowNotificationDTO[]> {

        return await this.usersService.getNotifications(user.id);
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
