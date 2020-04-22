import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Entity,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('activityrecords')
export class ActivityRecord {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @CreateDateColumn()
  timeStamp: Date;

  @Column('nvarchar')
  username: string;

  @Column('nvarchar')
  action: string;

  @Column('nvarchar')
  targetURL: string;

  @ManyToOne(
    type => User,
    user => user.activity,
    {
      eager: true,
    },
  )
  @JoinColumn()
  public user: User;
}
