import { ActivityRecord } from "../database/entities/activity.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { ActivityType } from "../models/activity/activity-type.enum";
import { ActivityTarget } from "../models/activity/activity-target.enum";
import { User } from "../database/entities/user.entity";

@Injectable()
export class ActivityLogger {

  constructor(
    @InjectRepository(ActivityRecord) private readonly activitiesRepo: Repository<ActivityRecord>,
  ) { }

  async log(user: User, action: ActivityType, target: ActivityTarget): Promise<void> {

    const newRecord = this.activitiesRepo.create({
      action,
      target
    })
    newRecord.user = Promise.resolve(user)
    this.activitiesRepo.save(newRecord)

  }
}