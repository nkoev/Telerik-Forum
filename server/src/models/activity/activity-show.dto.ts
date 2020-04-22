import { Expose } from 'class-transformer';

export class ActivityShowDTO {
  @Expose()
  public username: string;
  @Expose()
  public action: string;
  @Expose()
  public targetURL: string;
  @Expose()
  public timeStamp: Date;
}
