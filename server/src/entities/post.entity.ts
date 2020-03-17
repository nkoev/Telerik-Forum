import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('posts')
export class Post {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column('nvarchar')
    title: string;

    @Column('nvarchar')
    content: string;

    @Column({ type: 'boolean', default: false })
    isDeleted: boolean;

    @Column({ type: 'int', default: 5 })
    userId: number;
}
