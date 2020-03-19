import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany, BeforeInsert } from "typeorm";
import { User } from "./users.entity";
import { Comment } from "./comments.entity";

@Entity('posts')
export class Post {

    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column('nvarchar', { length: 20 })
    title: string;

    @Column('nvarchar', { length: 200 })
    content: string;

    @CreateDateColumn({ name: 'created_on' })
    createdOn: Date;

    @ManyToOne(
        type => User,
        user => user.posts,
        { lazy: true },
    )
    public user: Promise<User>;

    @OneToMany(
        type => Comment,
        comment => comment.post,
        { lazy: true },
    )
    public comments: Promise<Comment[]>;

    @Column({ nullable: false, default: false })
    isDeleted: boolean;

    @BeforeInsert()
    beforeInsertActions() {
        this.isDeleted = false;
    }

}
