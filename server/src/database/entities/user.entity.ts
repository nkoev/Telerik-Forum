import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, BeforeInsert } from "typeorm";
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

    @CreateDateColumn({ name: 'created_on' })
    registeredOn: Date;

    @Column({ nullable: false, default: false })
    isDeleted: boolean;

    @BeforeInsert()
    beforeInsertActions() {
        this.isDeleted = false;
    }

}