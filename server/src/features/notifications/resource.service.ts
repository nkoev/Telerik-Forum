import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NotificationType } from "../../models/notifications/notifications.enum";
import { ActionType } from "../../models/notifications/actions.enum";
import { User } from "../../database/entities/user.entity";
import { Notification } from "../../database/entities/notification.entity";
import { Injectable } from "@nestjs/common";

export const resourceService = function ResourceService(entity: any): any {

    @Injectable()
    class ServiceHost {
        @InjectRepository(Notification) public readonly notificationsRepo: Repository<Notification>
        @InjectRepository(User) public readonly usersRepo: Repository<User>
        @InjectRepository(entity) public readonly targetRepo: Repository<any>

        async notify(notificationType: NotificationType, actionType: ActionType, eventID: number, forUser?: string) {

            console.log(this.notificationsRepo !== undefined);
            console.log(this.usersRepo !== undefined);
            console.log(this.targetRepo !== undefined);

            const notifiedUser = await this.usersRepo.findOne({
                where: {
                    username: 'admin',
                    isDeleted: false
                }
            })


            const event = await this.targetRepo.findOne({
                where: {
                    id: eventID,
                    isDeleted: false
                }
            })

            const newNotification = this.notificationsRepo.create();
            newNotification.type = notificationType;
            newNotification.action = actionType;
            (await newNotification.forUsers).push(notifiedUser);
            // newNotification.entity = eventID;

            return await this.notificationsRepo.save(newNotification);
        }
    }

    // const probe = new ServiceHost();
    // console.log(probe.usersRepo);

    return new ServiceHost();
}