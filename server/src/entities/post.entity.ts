import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user.entity";

@Entity('posts')
export class Post {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('nvarchar', { nullable: false, length: 20 })
    title: string;

    @Column('nvarchar', { nullable: false, length: 20 })
    content: string;

    @Column({ type: 'boolean', default: false })
    isDeleted: boolean;

    @ManyToOne(type => User, {
        eager: true
    })
    user: User;
}
