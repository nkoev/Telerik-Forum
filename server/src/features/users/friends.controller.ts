import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Delete,
  Param,
  ParseUUIDPipe,
  Get,
  UseGuards,
  Put,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { User } from '../../database/entities/user.entity';
import { UserShowDTO } from '../../models/users/user-show.dto';
import { AuthGuardWithBlacklisting } from '../../common/guards/auth-guard-with-blacklisting.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { BanGuard } from '../../common/guards/ban.guard';
import { LoggedUser } from '../../common/decorators/user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users/friends')
@ApiBearerAuth()
@UseGuards(AuthGuardWithBlacklisting, RolesGuard, BanGuard)
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  //  SEND FRIEND REQUEST
  @Post('/:userId')
  @HttpCode(HttpStatus.OK)
  async sendFriendRequest(
    @LoggedUser() loggedUser: User,
    @Param('userId', ParseUUIDPipe) friendToAddId: string,
  ): Promise<UserShowDTO> {
    return await this.friendsService.sendFriendRequest(
      loggedUser,
      friendToAddId,
    );
  }

  //  ACCEPT FRIEND REQUEST
  @Put('/:userId')
  @HttpCode(HttpStatus.OK)
  async acceptFriendRequest(
    @LoggedUser() loggedUser: User,
    @Param('userId', ParseUUIDPipe) friendToAcceptId: string,
  ): Promise<UserShowDTO> {
    return await this.friendsService.acceptFriendRequest(
      loggedUser,
      friendToAcceptId,
    );
  }

  //  DELETE FRIEND REQUEST
  @Delete('/requests/:userId')
  @HttpCode(HttpStatus.OK)
  async deleteFriendRequest(
    @LoggedUser() loggedUser: User,
    @Param('userId', ParseUUIDPipe) friendToDeleteId: string,
  ): Promise<{ msg: string }> {
    return await this.friendsService.deleteFriendRequest(
      loggedUser,
      friendToDeleteId,
    );
  }

  //  REMOVE FRIEND
  @Delete('/:friendId')
  @HttpCode(HttpStatus.CREATED)
  async removeFriend(
    @LoggedUser() loggedUser: User,
    @Param('friendId', ParseUUIDPipe) friendId: string,
  ): Promise<UserShowDTO> {
    return await this.friendsService.removeFriend(loggedUser, friendId);
  }

  //  GET ALL FRIEND REQUESTS
  @Get('/requests')
  @HttpCode(HttpStatus.OK)
  async getFriendRequests(
    @LoggedUser() loggedUser: User,
  ): Promise<UserShowDTO[]> {
    return await this.friendsService.getFriendRequests(loggedUser);
  }

  //  GET ALL FRIENDS
  @Get()
  @HttpCode(HttpStatus.OK)
  async getFriends(@LoggedUser() loggedUser: User): Promise<UserShowDTO[]> {
    return await this.friendsService.getFriends(loggedUser);
  }
}
