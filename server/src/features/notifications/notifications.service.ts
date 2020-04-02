import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { Notification } from '../../database/entities/notification.entity';
import { User } from '../../database/entities/user.entity';
import { NotificationType } from '../../models/notifications/notifications.enum';
import { ActionType } from '../../models/notifications/actions.enum';

@Injectable()
export class NotificationsService {

    constructor(
        @InjectRepository(Notification) private readonly notificationsRepo: Repository<Notification>,
        @InjectRepository(User) private readonly usersRepo: Repository<User>
    ) { }

    async notifyAdmins(notificationType: NotificationType, actionType: ActionType, targetPath: string, forUser?: string) {


        const notifiedUsers = await this.usersRepo.find({
            where: {
                username: 'admin',
                isDeleted: false
            }
        });

        // console.log(notifiedUsers);

        const newNotification = this.notificationsRepo.create();
        newNotification.type = notificationType;
        newNotification.action = actionType;
        (await newNotification.forUsers).push(...notifiedUsers);
        newNotification.target = targetPath;

        return await this.notificationsRepo.save(newNotification);
    }

    async notifyUsers(userId: string, notificationType: NotificationType, actionType: ActionType, targetPath: string, forUser?: string) {

        const foundUser: User = await this.usersRepo.findOne({
            id: userId,
            isDeleted: false
        });

        const notifiedUsers = await foundUser.friends;
        // console.log(notifiedUsers);

        const newNotification = this.notificationsRepo.create();
        newNotification.type = notificationType;
        newNotification.action = actionType;
        (await newNotification.forUsers).push(...notifiedUsers);
        newNotification.target = targetPath;

        return await this.notificationsRepo.save(newNotification);
    }
}
