import { PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Entity, JoinColumn } from "typeorm";
import { User } from "./user.entity";
import { ActivityType } from "../../models/activity/activity-type.enum";

@Entity('activityrecords')

export class ActivityRecord {

  @PrimaryGeneratedColumn('increment')
  id: string;

  @CreateDateColumn()
  timeStamp: Date;

  @Column('nvarchar')
  action: string;

  @Column('nvarchar')
  targetURL: string;

  @ManyToOne(
    type => User,
    user => user.activity,
  )
  @JoinColumn()
  public user: Promise<User>;
}
