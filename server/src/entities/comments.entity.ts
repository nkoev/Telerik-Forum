import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./users.entity";
import { Post } from "./posts.entity";

@Entity('comments')
export class Comment {

    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column('nvarchar', {length: 200})
    content: string;

    @CreateDateColumn({name: 'created_on'})
    createdOn: Date;

    @ManyToOne(type => Post)
    @JoinColumn({name: 'post_id'})
    postId: string;

    @ManyToOne(type => User)
    @JoinColumn({name: 'user_id'})
    userId: string;

    @Column('bool', {name: 'is_deleted', default: false})
    isDeleted: boolean;

}
