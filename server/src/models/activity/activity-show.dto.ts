import { Expose } from "class-transformer";
import { ActivityType } from "./activity-type.enum";

export class ActivityShowDTO {
  @Expose()
  public action: ActivityType;
  @Expose()
  public target: string;
  @Expose()
  public timeStamp: Date;
}