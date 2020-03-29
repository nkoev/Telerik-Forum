import { Controller, Post, HttpCode, Query, Param, ParseUUIDPipe, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationType } from '../../models/notifications/notifications.enum';
import { Notification } from '../../database/entities/notification.entity';

@Controller('/notifications')
export class NotificationsController {

    constructor(private readonly notificationsService: NotificationsService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async notify(
        @Query('postId', ParseIntPipe) postId: number
        // @Query('userId', ParseUUIDPipe) userId?: string
    ): Promise<Notification> {

        return await this.notificationsService.notify(NotificationType.Flag, postId);
    }
}
