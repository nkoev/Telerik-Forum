import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./users.entity";
import { Post } from "./posts.entity";

@Entity('comments')
export class Comment {

    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column('nvarchar', { length: 200 })
    content: string;

    @CreateDateColumn({ name: 'created_on' })
    createdOn: Date;

    @ManyToOne(
        type => User,
        user => user.comments,
        { lazy: true },
    )
    public user: Promise<User>;

    @ManyToOne(
        type => Post,
        post => post.comments,
        { lazy: true },
    )
    public post: Promise<Post>;

    @Column({ nullable: false, default: false })
    isDeleted: boolean;

}
