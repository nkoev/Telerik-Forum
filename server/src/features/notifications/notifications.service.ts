import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { Notification } from '../../database/entities/notification.entity';
import { User } from '../../database/entities/user.entity';
import { Post } from '../../database/entities/post.entity';
import { NotificationType } from '../../models/notifications/notifications.enum';
import { ActionType } from '../../models/notifications/actions.enum';

@Injectable()
export class NotificationsService {

    constructor(
        @InjectRepository(Notification) private readonly notificationsRepo: Repository<Notification>,
        @InjectRepository(User) private readonly usersRepo: Repository<User>,
        @InjectRepository(Post) private readonly postsRepo: Repository<Post>,
    ) { }

    async notify(notificationType: NotificationType, actionType: ActionType, eventID: number, forUser?: string) {

        const notifiedUser = await this.usersRepo.findOne({
            where: {
                username: 'admin',
                isDeleted: false
            }
        })


        const event = await this.postsRepo.findOne({
            where: {
                id: eventID,
                isDeleted: false
            }
        })

        const newNotification = this.notificationsRepo.create();
        newNotification.type = notificationType;
        newNotification.action = actionType;
        (await newNotification.forUsers).push(notifiedUser);
        newNotification.entity = Promise.resolve(event);

        return await this.notificationsRepo.save(newNotification);
    }
}
