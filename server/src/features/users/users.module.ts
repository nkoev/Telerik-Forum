import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';
import { Role } from '../../database/entities/role.entity';
import { BanStatus } from '../../database/entities/ban-status.entity';
import { FriendRequest } from '../../database/entities/friend-request.entity';
import { ScheduledTasks } from '../../common/scheduled-tasks/scheduled-tasks';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, BanStatus, FriendRequest])],
  controllers: [UsersController, FriendsController],
  providers: [UsersService, FriendsService, ScheduledTasks]
})
export class UsersModule { }
