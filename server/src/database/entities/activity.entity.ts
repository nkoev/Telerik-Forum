import { PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Entity, JoinColumn } from "typeorm";
import { User } from "./user.entity";
import { ActivityType } from "../../models/users/activity-type.enum";
import { ActivityTarget } from "../../models/users/activity-target.enum";

@Entity('activities')

export class Activity {

  @PrimaryGeneratedColumn('increment')
  id: string;

  @CreateDateColumn()
  timeStamp: Date;

  @Column({
    type: 'enum',
    enum: ActivityType
  })
  action: ActivityType;

  @Column({
    type: 'enum',
    enum: ActivityTarget
  })
  target: ActivityTarget;

  @ManyToOne(
    type => User,
    user => user.activity,
  )
  @JoinColumn()
  public user: Promise<User>;
}
