import { Module } from '@nestjs/common';
import { UsersModule } from './features/users/users.module';
import { PostsModule } from './features/posts/posts.module';
import { CommentsModule } from './features/comments/comments.module';
import { NotificationsModule } from './features/notifications/notifications.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './features/auth/auth.module';
import { CoreModule } from './features/core/core.module';
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [
    CoreModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    NotificationsModule,
    DatabaseModule,
    AuthModule,
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService]
})

export class AppModule { }
