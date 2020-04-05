import { PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Entity, JoinColumn } from "typeorm";
import { User } from "./user.entity";
import { ActivityType } from "../../models/activity/activity-type.enum";
import { ActivityTarget } from "../../models/activity/activity-target.enum";

@Entity('activityrecords')

export class ActivityRecord {

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
