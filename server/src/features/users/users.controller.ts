import { Controller, HttpCode, HttpStatus, Body, Post, Delete, ValidationPipe, Param, ParseUUIDPipe, Get, UseGuards, Put } from '@nestjs/common';
import { UsersService } from './users.service'
import { UserRegisterDTO } from '../../models/users/user-register.dto';
import { UserShowDTO } from '../../models/users/user-show.dto';
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

    //  GET ALL NOTIFICATIONS
    @Get('/notifications')
    @UseGuards(AuthGuardWithBlacklisting, RolesGuard)
    @HttpCode(HttpStatus.OK)
    async getNotifications(
        @LoggedUser() loggedUser: User
    ): Promise<ShowNotificationDTO[]> {

        return await this.usersService.getNotifications(loggedUser);
    }

    // GET USER ACTIVITY
    @Get('/:userId/activity')
    @UseGuards(AuthGuardWithBlacklisting, RolesGuard)
    @HttpCode(HttpStatus.OK)
    async getUserActivity(
        @LoggedUser() loggedUser: User,
        @Param('userId', ParseUUIDPipe) userId: string
    ): Promise<ActivityShowDTO[]> {

        return await this.usersService.getUserActivity(loggedUser, userId);
    }

    // BAN USERS
    @Put('/:userId/banstatus')
    @UseGuards(AuthGuardWithBlacklisting, BanGuard, RolesGuard)
    @AccessLevel('Admin')
    async updateBanStatus(
        @Param('userId', ParseUUIDPipe) userId: string,
        @Body(new ValidationPipe({
            whitelist: true,
            transform: true
        })) banStatusUpdate: BanStatusDTO
    ): Promise<UserShowDTO> {

        return await this.usersService.updateBanStatus(userId, banStatusUpdate);
    }

    // DELETE USER
    @Delete('/:userId')
    @UseGuards(AuthGuardWithBlacklisting, RolesGuard)
    @AccessLevel('Admin')
    async deleteUser(
        @Param('userId', ParseUUIDPipe) userId: string
    ): Promise<UserShowDTO> {

        return await this.usersService.deleteUser(userId);
    }
}
