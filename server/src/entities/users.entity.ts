import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('nvarchar', {length: 20, unique: true})
    username: string;

    @Column('nvarchar', {length: 20})
    password: string;

    @CreateDateColumn({name: 'created_on'})
    registeredOn: Date;

    @Column('bool', {name: 'is_deleted', default: false})
    isDeleted: boolean;

}
