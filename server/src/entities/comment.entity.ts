import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, BeforeInsert } from "typeorm";
import { User } from "./user.entity";
import { Post } from "./post.entity";

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

    @BeforeInsert()
    beforeInsertActions() {
        this.isDeleted = false;
    }

}
