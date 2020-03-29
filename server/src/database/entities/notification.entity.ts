import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, ManyToOne, JoinTable } from "typeorm";
import { NotificationType } from "../../models/notifications/notifications.enum";
import { ActionType } from "../../models/notifications/actions.enum";
import { User } from "./user.entity";
import { Post } from "./post.entity";

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

    @ManyToOne(
        type => Post,
        post => post.notifications,
    )
    @JoinTable()
    entity: Promise<Post>;

    @ManyToMany(
        type => User,
        user => user.notifications
    )
    forUsers: Promise<User[]>

    @Column('boolean', { default: false })
    read: boolean
}