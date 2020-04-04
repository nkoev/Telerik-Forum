import { Activity } from "../database/entities/activity.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { ActivityType } from "../models/users/activity-type.enum";
import { ActivityTarget } from "../models/users/activity-target.enum";
import { User } from "../database/entities/user.entity";

@Injectable()
export class ActivityLogger {

  constructor(
    @InjectRepository(Activity) private readonly activitiesRepo: Repository<Activity>,
    @InjectRepository(User) private readonly usersRepo: Repository<User>
  ) { }

  async log(user: User, action: ActivityType, target: ActivityTarget): Promise<void> {

    const newLog = this.activitiesRepo.create({
      action,
      target
    })
    newLog.user = Promise.resolve(user)
    this.activitiesRepo.save(newLog)

  }
}