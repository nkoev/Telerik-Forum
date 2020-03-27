import { Entity, PrimaryGeneratedColumn, ManyToMany, Column, ManyToOne, JoinTable } from "typeorm";
import { UserRoles } from "../../models/users/roles.enum";
import { User } from "./user.entity";

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('nvarchar')
  name: string

  @ManyToMany(
    type => User,
    user => user.roles,
  )
  users: Promise<User[]>

}