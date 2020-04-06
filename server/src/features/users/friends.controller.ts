import { Controller, HttpCode, HttpStatus, Body, Post, Delete, ValidationPipe, Param, ParseUUIDPipe, Get, Query, UseGuards, Put } from '@nestjs/common';
import { FriendsService } from './friends.service'
import { UserShowDTO } from '../../models/users/user-show.dto';
import { AddFriendDTO } from '../../models/users/add-friend.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AuthGuardWithBlacklisting } from '../../common/guards/auth-guard-with-blacklisting.guard';
import { LoggedUser } from '../../common/decorators/user.decorator';
import { User } from '../../database/entities/user.entity';

@Controller('users/friends')
// @UseGuards(RolesGuard)
export class FriendsController {

    constructor(private readonly friendsService: FriendsService) { }

    //  SEND FRIEND REQUEST
    @Post()
    @UseGuards(AuthGuardWithBlacklisting)
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
    @UseGuards(AuthGuardWithBlacklisting)
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
    @Delete()
    @UseGuards(AuthGuardWithBlacklisting)
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
    @UseGuards(AuthGuardWithBlacklisting)
    @HttpCode(HttpStatus.CREATED)
    async removeFriend(
        @LoggedUser() loggedUser: User,
        @Param('friendId', ParseUUIDPipe) friendId: string
    ): Promise<UserShowDTO> {

        return await this.friendsService.removeFriend(loggedUser, friendId);
    }

    //  GET ALL FRIEND REQUESTS
    @Get('/requests')
    @UseGuards(AuthGuardWithBlacklisting)
    @HttpCode(HttpStatus.OK)
    async getFriendRequests(
        @LoggedUser() loggedUser: User
    ): Promise<UserShowDTO[]> {

        return await this.friendsService.getFriendRequests(loggedUser);
    }

    //  GET ALL FRIENDS
    @Get()
    @UseGuards(AuthGuardWithBlacklisting)
    @HttpCode(HttpStatus.OK)
    async getFriends(
        @LoggedUser() loggedUser: User
    ): Promise<UserShowDTO[]> {
        return await this.friendsService.getFriends(loggedUser);
    }
}
