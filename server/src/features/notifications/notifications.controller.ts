import { Controller, Post, HttpCode, Query, Param, ParseUUIDPipe, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationType } from '../../models/notifications/notifications.enum';
import { Notification } from '../../database/entities/notification.entity';
import { ActionType } from '../../models/notifications/actions.enum';

@Controller('/notifications')
export class NotificationsController {

    // constructor(private readonly notificationsService: NotificationsService) { }

    // @Post()
    // @HttpCode(HttpStatus.CREATED)
    // async notify(
    //     @Query('entityId', ParseIntPipe) entityId: number
    //     // @Query('userId', ParseUUIDPipe) userId?: string
    // ): Promise<Notification> {

    //     return await this.notificationsService.notify(NotificationType.Post, ActionType.Flag, entityId);
    // }
}
