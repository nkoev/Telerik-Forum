import {
  Controller,
  HttpCode,
  HttpStatus,
  Body,
  Post,
  Delete,
  ValidationPipe,
  Param,
  ParseUUIDPipe,
  Get,
  UseGuards,
  Put,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
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
import { ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET ALL USERS
  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(): Promise<UserShowDTO[]> {
    return await this.usersService.getUsers();
  }

  //  GET ALL NOTIFICATIONS
  @Get('/notifications')
  @ApiBearerAuth()
  @UseGuards(AuthGuardWithBlacklisting, RolesGuard)
  @HttpCode(HttpStatus.OK)
  async getNotifications(
    @LoggedUser() loggedUser: User,
  ): Promise<ShowNotificationDTO[]> {
    return await this.usersService.getNotifications(loggedUser);
  }

  // GET USER ACTIVITY
  @Get('/:userId/activity')
  @ApiBearerAuth()
  @UseGuards(AuthGuardWithBlacklisting, RolesGuard)
  @HttpCode(HttpStatus.OK)
  async getUserActivity(
    @LoggedUser() loggedUser: User,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<ActivityShowDTO[]> {
    return await this.usersService.getUserActivity(loggedUser, userId);
  }

  //  REGISTER
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async registerUser(
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    user: UserRegisterDTO,
  ): Promise<UserShowDTO> {
    return await this.usersService.registerUser(user);
  }

  // UPLOAD AVATAR
  @Post('avatar/upload')
  @UseGuards(AuthGuardWithBlacklisting)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile()
    file: { data: string },
    @LoggedUser()
    loggedUser: User,
  ): Promise<string> {
    return this.usersService.uploadAvatar(file, loggedUser);
  }

  // GET AVATAR

  @Get('avatar/:userId')
  @UseGuards(AuthGuardWithBlacklisting)
  async getAvatar(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<string> {
    return this.usersService.getAvatar(userId);
  }

  // BAN USERS
  @Put('/:userId/banstatus')
  @ApiBearerAuth()
  @UseGuards(AuthGuardWithBlacklisting, BanGuard, RolesGuard)
  @AccessLevel('Admin')
  async updateBanStatus(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    )
    banStatusUpdate: BanStatusDTO,
  ): Promise<UserShowDTO> {
    return await this.usersService.updateBanStatus(userId, banStatusUpdate);
  }

  // DELETE USER
  @Delete('/:userId')
  @ApiBearerAuth()
  @UseGuards(AuthGuardWithBlacklisting, RolesGuard)
  @AccessLevel('Admin')
  async deleteUser(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<UserShowDTO> {
    return await this.usersService.deleteUser(userId);
  }
}
