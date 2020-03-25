import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "./user.entity";
import { Comment } from "./comment.entity";

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

    @OneToMany(
        type => Comment,
        comment => comment.post,
    )
    comments: Promise<Comment[]>;

    @ManyToOne(
        type => User, {
        eager: true
    })
    user: User;

}
