import { Controller, HttpCode, HttpStatus, Body, Post, Delete, ValidationPipe, Param, ParseUUIDPipe, Get, UseGuards, Put } from '@nestjs/common';
import { FriendsService } from './friends.service'
import { User } from '../../database/entities/user.entity';
import { UserShowDTO } from '../../models/users/user-show.dto';
import { AddFriendDTO } from '../../models/users/add-friend.dto';
import { AuthGuardWithBlacklisting } from '../../common/guards/auth-guard-with-blacklisting.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { BanGuard } from '../../common/guards/ban.guard';
import { LoggedUser } from '../../common/decorators/user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users/friends')
@ApiBearerAuth()
@UseGuards(AuthGuardWithBlacklisting, RolesGuard, BanGuard)
export class FriendsController {

    constructor(private readonly friendsService: FriendsService) { }

    //  SEND FRIEND REQUEST
    @Post()
    @HttpCode(HttpStatus.OK)
    async sendFriendRequest(
        @LoggedUser() loggedUser: User,
        @Body(new ValidationPipe({
            whitelist: true,
            transform: true
        })) friendToAdd: AddFriendDTO
    ): Promise<UserShowDTO> {

        return await this.friendsService.sendFriendRequest(loggedUser, friendToAdd);
    }

    //  ACCEPT FRIEND REQUEST
    @Put()
    @HttpCode(HttpStatus.OK)
    async acceptFriendRequest(
        @LoggedUser() loggedUser: User,
        @Body(new ValidationPipe({
            whitelist: true,
            transform: true
        })) friendToAccept: AddFriendDTO
    ): Promise<UserShowDTO> {

        return await this.friendsService.acceptFriendRequest(loggedUser, friendToAccept);
    }

    //  DELETE FRIEND REQUEST
    @Delete('/requests')
    @HttpCode(HttpStatus.OK)
    async deleteFriendRequest(
        @LoggedUser() loggedUser: User,
        @Body(new ValidationPipe({
            whitelist: true,
            transform: true
        })) friendToDelete: AddFriendDTO
    ): Promise<{ msg: string }> {

        return await this.friendsService.deleteFriendRequest(loggedUser, friendToDelete);
    }

    //  REMOVE FRIEND
    @Delete('/:friendId')
    @HttpCode(HttpStatus.CREATED)
    async removeFriend(
        @LoggedUser() loggedUser: User,
        @Param('friendId', ParseUUIDPipe) friendId: string
    ): Promise<UserShowDTO> {

        return await this.friendsService.removeFriend(loggedUser, friendId);
    }

    //  GET ALL FRIEND REQUESTS
    @Get('/requests')
    @HttpCode(HttpStatus.OK)
    async getFriendRequests(
        @LoggedUser() loggedUser: User
    ): Promise<UserShowDTO[]> {

        return await this.friendsService.getFriendRequests(loggedUser);
    }

    //  GET ALL FRIENDS
    @Get()
    @HttpCode(HttpStatus.OK)
    async getFriends(
        @LoggedUser() loggedUser: User
    ): Promise<UserShowDTO[]> {
        return await this.friendsService.getFriends(loggedUser);
    }
}
