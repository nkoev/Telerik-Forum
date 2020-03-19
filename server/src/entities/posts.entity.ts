import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany, BeforeInsert } from "typeorm";
import { User } from "./users.entity";
import { Comment } from "./comments.entity";

@Entity('posts')
export class Post {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('nvarchar', { nullable: false, length: 20 })
    title: string;

    @Column('nvarchar', { nullable: false, length: 20 })
    content: string;

    @CreateDateColumn({ name: 'created_on' })
    createdOn: Date;

    @Column({ type: 'boolean', default: false })
    isDeleted: boolean;

    @OneToMany(
        type => Comment,
        comment => comment.post,
        { lazy: true },
    )
    public comments: Promise<Comment[]>;

    @ManyToOne(type => User, {
        eager: true
    })
    user: User;

}
