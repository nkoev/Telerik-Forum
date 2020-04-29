import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('avatars')
export class Avatar {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column('longblob')
  data: string;

  @Column('nvarchar')
  encoding: string;

  @Column()
  mimeType: string;

  @OneToOne(
    type => User,
    user => user.avatar,
  )
  @JoinColumn()
  public user: Promise<User>;
}
