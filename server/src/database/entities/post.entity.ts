import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { User } from "./user.entity";
import { Comment } from "./comment.entity";
import { Expose } from "class-transformer";

@Entity('posts')
export class Post {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('nvarchar', { nullable: false, length: 20 })
    title: string;

    @Column('nvarchar', { nullable: false, length: 1000 })
    content: string;

    @CreateDateColumn({ name: 'created_on' })
    createdOn: Date;

    @Column({ type: 'boolean', default: false })
    isDeleted: boolean;

    @Column({ type: 'boolean', default: false })
    isLocked: boolean;

    @OneToMany(
        type => Comment,
        comment => comment.post,
    )
    comments: Promise<Comment[]>;

    @ManyToMany(
        type => User,
        user => user.likedPosts, {
        eager: true,
    })
    @JoinTable()
    votes: User[];

    @ManyToMany(
        type => User,
        user => user.flaggedPosts, {
        eager: true,
    })
    @JoinTable()
    flags: User[];

    @ManyToOne(
        type => User, {
        eager: true
    })
    user: User;

}
