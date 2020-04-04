import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToMany, ManyToOne, JoinColumn, JoinTable, OneToOne } from "typeorm";
import { Post } from "./post.entity";
import { Comment } from "./comment.entity";
import { Role } from "./role.entity";
import { Expose } from "class-transformer";
import { Notification } from "./notification.entity";
import { BanStatus } from "./ban-status.entity";
import { Activity } from "./activity.entity";

@Entity('users')

export class User {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Expose()
    @Column('nvarchar', { length: 20, unique: true })
    username: string;

    @Column('nvarchar', { length: 60 })
    password: string;

    @OneToMany(
        type => Post,
        post => post.user,
        { lazy: true },
    )
    public posts: Promise<Post[]>;

    @OneToMany(
        type => Comment,
        comment => comment.user,
        { lazy: true },
    )
    public comments: Promise<Comment[]>;

    @OneToMany(
        type => User,
        user => user.friend,
        { lazy: true }
    )
    public friends: Promise<User[]>;

    @ManyToOne(
        type => User,
        user => user.friends,
        { lazy: true }
    )
    public friend: Promise<User>;

    @CreateDateColumn({ name: 'created_on' })
    registeredOn: Date;

    @Column({ nullable: false, default: false })
    isDeleted: boolean;

    @ManyToMany(
        type => Post,
        post => post.votes
    )
    likedPosts: Promise<Post[]>

    @ManyToMany(
        type => Comment,
        comment => comment.votes
    )
    likedComments: Promise<Comment[]>

    @ManyToMany(
        type => Role,
        role => role.users, {
        eager: true
    })
    @JoinTable()
    roles: Role[];

    @ManyToMany(
        type => Post,
        post => post.flags
    )
    flaggedPosts: Promise<Post[]>

    @ManyToMany(
        type => Notification,
        notification => notification.forUsers,
        { eager: true }
    )
    @JoinTable()
    notifications: Notification[]

    @OneToOne(
        type => BanStatus,
        banStatus => banStatus.user,
        { eager: true }
    )
    @JoinColumn()
    banStatus: BanStatus

    @OneToMany(
        type => Activity,
        activity => activity.user,
    )
    public activity: Promise<Activity>;

}
