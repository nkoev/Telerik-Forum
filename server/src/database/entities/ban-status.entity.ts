import { Entity, PrimaryGeneratedColumn, Column, OneToOne, AfterLoad } from "typeorm"
import { User } from "./user.entity"

@Entity('banstatuses')
export class BanStatus {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('bool', { default: false })
  isBanned: boolean

  @Column('nvarchar', { nullable: true })
  description: string

  @Column({ nullable: true })
  expires: Date

  @OneToOne(
    type => User,
    user => user.banStatus,
  )
  user: Promise<User>

}