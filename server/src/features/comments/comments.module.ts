import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../../database/entities/comment.entity';
import { Post } from '../../database/entities/post.entity';
import { User } from '../../database/entities/user.entity';
import { ActivityLogger } from '../../common/activity-logger';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User, Post])],
  controllers: [CommentsController],
  providers: [CommentsService, ActivityLogger]
})
export class CommentsModule { }
