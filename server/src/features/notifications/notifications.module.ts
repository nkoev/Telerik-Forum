import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../../database/entities/notification.entity';
import { User } from '../../database/entities/user.entity';
import { Post } from '../../database/entities/post.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Notification, User, Post])],
    controllers: [NotificationsController],
    providers: [NotificationsService]
})
export class NotificationsModule { }
