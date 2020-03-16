import { Module } from '@nestjs/common';
import { UsersModule } from './features/users/users.module';
import { PostsModule } from './features/posts/posts.module';
import { CommentsModule } from './features/comments/comments.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    UsersModule,
    PostsModule,
    CommentsModule,
    TypeOrmModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService]
})

export class AppModule { }
