import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('nvarchar', {length: 20})
    username: string;

    @Column('nvarchar', {length: 10})
    password: string;

    @Column({default: false})
    isDeleted: boolean;

}
