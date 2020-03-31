import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, ManyToOne, JoinTable } from "typeorm";
import { NotificationType } from "../../models/notifications/notifications.enum";
import { ActionType } from "../../models/notifications/actions.enum";
import { User } from "./user.entity";

@Entity('notifications')
export class Notification {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({
        type: 'enum',
        enum: NotificationType,
        default: NotificationType.Post
    })
    type: NotificationType

    @Column({
        type: 'enum',
        enum: ActionType,
        default: ActionType.Flag
    })
    action: ActionType

    @Column('nvarchar')
    target: string;

    @ManyToMany(
        type => User,
        user => user.notifications
    )
    forUsers: Promise<User[]>

    @Column('boolean', { default: false })
    read: boolean
}