import { Notification } from "../../database/entities/notification.entity";
import { NotificationType } from "./notifications.enum";
import { ActionType } from "./actions.enum";

export class ShowNotificationDTO {

    public id: number;
    public type: NotificationType;
    public action: ActionType;

    constructor(notification: Notification) {
        this.id = notification.id;
        this.type = notification.type;
        this.action = notification.action;
    }
}
