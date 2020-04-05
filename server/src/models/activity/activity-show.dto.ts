import { Expose } from "class-transformer";
import { ActivityType } from "./activity-type.enum";
import { ActivityTarget } from "./activity-target.enum";

export class ActivityShowDTO {
  @Expose()
  public action: ActivityType;
  @Expose()
  public target: ActivityTarget;
  @Expose()
  public timeStamp: Date;
}