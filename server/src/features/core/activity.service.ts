import { ActivityRecord } from "../../database/entities/activity.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { ActivityType } from "../../models/activity/activity-type.enum";
import { User } from "../../database/entities/user.entity";

@Injectable()
export class ActivityService {

  constructor(
    @InjectRepository(ActivityRecord) private readonly activitiesRepo: Repository<ActivityRecord>,
  ) { }

  async logPostEvent(user: User, action: ActivityType, postId: number): Promise<void> {

    const newRecord = this.activitiesRepo.create({
      action: `${action} a post`,
      targetURL: `http://loclahost:3000/posts/${postId}`,
      user: Promise.resolve(user)
    })

    this.activitiesRepo.save(newRecord)
  }

  async logCommentEvent(user: User, action: ActivityType, postId: number, commentId: number): Promise<void> {

    const newRecord = this.activitiesRepo.create({
      action: `${action} a comment`,
      targetURL: `http://loclahost:3000/posts/${postId}/comments/${commentId}`,
      user: Promise.resolve(user)
    })

    this.activitiesRepo.save(newRecord)
  }
}