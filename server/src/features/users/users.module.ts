import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';
import { Role } from '../../database/entities/role.entity';
import { BanStatus } from '../../database/entities/ban-status.entity';
import { ScheduledTasks } from './scheduled-tasks';
import { FriendRequest } from '../../database/entities/friend-request.entity';


@Module({
  imports: [TypeOrmModule.forFeature([User, Role, BanStatus, FriendRequest])],
  controllers: [UsersController],
  providers: [UsersService, ScheduledTasks]
})
export class UsersModule { }
