import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../../database/entities/comment.entity';
import { Post } from '../../database/entities/post.entity';
import { User } from '../../database/entities/user.entity';
import { ActivityService } from '../../common/activity.service';
import { ActivityRecord } from '../../database/entities/activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Post, ActivityRecord])],
  controllers: [CommentsController],
  providers: [CommentsService, ActivityService]
})
export class CommentsModule { }
