import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, ManyToOne, JoinTable } from "typeorm";
import { NotificationType } from "../../models/notifications/notifications.enum";
import { User } from "./user.entity";
import { Post } from "./post.entity";

@Entity('notifications')
export class Notification {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({
        type: 'enum',
        enum: NotificationType,
        default: NotificationType.Flag
    })
    type: NotificationType

    @ManyToMany(
        type => User,
        user => user.notifications
    )
    forUsers: Promise<User[]>

    @ManyToOne(
        type => Post,
        post => post.notifications,
    )
    @JoinTable()
    entity: Promise<Post>;

    @Column('boolean', { default: false })
    read: boolean
}