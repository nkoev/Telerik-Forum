import { Expose, Transform } from 'class-transformer';
import { BanStatus } from '../../database/entities/ban-status.entity';

export class UserShowDTO {
  @Expose()
  public id: string;
  @Expose()
  public username: string;
  @Expose()
  @Transform(roles => roles.map((role: any) => role.name))
  public roles: string[];
  @Expose()
  @Transform((banStatus: BanStatus) => banStatus.isBanned)
  public banStatus: boolean;
}
