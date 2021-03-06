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
import { LoggedUser } from '../../common/decorators/user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FriendStatusDTO } from '../../models/users/friend.status.dto';

@Controller('users/friends')
@ApiBearerAuth()
@UseGuards(AuthGuardWithBlacklisting, RolesGuard)
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  //  GET ALL FRIENDS
  @Get()
  @HttpCode(HttpStatus.OK)
  async getFriends(@LoggedUser() loggedUser: User): Promise<UserShowDTO[]> {
    return await this.friendsService.getFriends(loggedUser);
  }

  // GET Griend STATUS
  @Get('/status/:userId')
  @HttpCode(HttpStatus.OK)
  async getStatus(
    @LoggedUser() loggedUser: User,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<FriendStatusDTO> {
    return await this.friendsService.getStatus(loggedUser, userId);
  }

  //  SEND FRIEND REQUEST
  @Post('requests/:userId')
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
  @Put('requests/:userId')
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

  //  GET ALL RECEIVED FRIEND REQUESTS
  @Get('/requests/received')
  @HttpCode(HttpStatus.OK)
  async getRaceivedFriendRequests(
    @LoggedUser() loggedUser: User,
  ): Promise<UserShowDTO[]> {
    return await this.friendsService.getReceivedFriendRequests(loggedUser);
  }

  //  GET ALL  SENT FRIEND REQUESTS
  @Get('/requests/sent')
  @HttpCode(HttpStatus.OK)
  async getSentFriendRequests(
    @LoggedUser() loggedUser: User,
  ): Promise<UserShowDTO[]> {
    return await this.friendsService.getSentFriendRequests(loggedUser);
  }
}
