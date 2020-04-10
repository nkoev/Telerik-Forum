import { Entity, PrimaryGeneratedColumn, ManyToMany, Column } from "typeorm";
import { User } from "./user.entity";
import { Expose } from "class-transformer";

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('increment')
  id: number
  @Expose()
  @Column('nvarchar')
  name: string

  @ManyToMany(
    type => User,
    user => user.roles,
  )
  users: Promise<User[]>

}