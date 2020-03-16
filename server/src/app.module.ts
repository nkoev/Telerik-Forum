import { Module } from '@nestjs/common';
import { UsersModule } from './features/users/users.module';
import { PostsModule } from './features/posts/posts.module';
import { CommentsModule } from './features/comments/comments.module';
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    UsersModule,
    PostsModule,
    CommentsModule,
    TypeOrmModule.forRoot()
  ]
})

export class AppModule { }
