import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, BeforeInsert, ManyToMany, ManyToOne } from "typeorm";
import { Post } from "./post.entity";
import { Comment } from "./comment.entity";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('nvarchar', { length: 20, unique: true })
    username: string;

    @Column('nvarchar', { length: 20 })
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

}
