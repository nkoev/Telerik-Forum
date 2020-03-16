import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('posts')
export class Post {

    @PrimaryGeneratedColumn('increment')
    id: string;

    @Column('nvarchar')
    title: string;

    @Column()
    content: string;

    @Column()
    isDeleted: boolean;

}
