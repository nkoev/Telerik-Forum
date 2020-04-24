import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { Expose } from 'class-transformer';

@Entity('banstatuses')
export class BanStatus {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Expose()
  @Column('bool', { default: false })
  isBanned: boolean;

  @Column('nvarchar', { nullable: true })
  description: string;

  @Column({ nullable: true })
  expires: Date;

  @OneToOne(
    type => User,
    user => user.banStatus,
  )
  user: Promise<User>;
}
