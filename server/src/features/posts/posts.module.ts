import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../../database/entities/post.entity';
import { User } from '../../database/entities/user.entity';
import { Notification } from '../../database/entities/notification.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { ActivityLogger } from '../../common/activity-logger';
import { ActivityRecord } from '../../database/entities/activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Notification, ActivityRecord])],
  controllers: [PostsController],
  providers: [PostsService, NotificationsService, ActivityLogger]
})
export class PostsModule { }
