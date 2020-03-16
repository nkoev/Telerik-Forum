import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./users.entity";

@Entity('posts')
export class Post {

    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column('nvarchar', {length: 20})
    title: string;

    @Column('nvarchar', {length: 200})
    content: string;

    @CreateDateColumn({name: 'created_on'})
    createdOn: Date;

    @ManyToOne(type => User)
    @JoinColumn({name: 'user_id'})
    userId: string;

    @Column('bool', {name: 'is_deleted', default: false})
    isDeleted: boolean;

}
