import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, BeforeInsert, ManyToMany, JoinTable } from "typeorm";
import { User } from "./user.entity";
import { Post } from "./post.entity";

@Entity('comments')
export class Comment {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('nvarchar', { nullable: false, length: 200 })
    content: string;

    @CreateDateColumn({ name: 'created_on' })
    createdOn: Date;

    @ManyToOne(
        type => User,
        user => user.comments,
        { eager: true },
    )
    public user: User;

    @ManyToOne(
        type => Post,
        post => post.comments,
        { eager: true },
    )
    public post: Post;

    @ManyToMany(
        type => User,
        user => user.likedComments
    )
    @JoinTable()
    public votes: Promise<User[]>

    @Column({ nullable: false, type: 'boolean', default: false })
    isDeleted: boolean;

}
