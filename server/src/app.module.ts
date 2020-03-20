import { Module } from '@nestjs/common';
import { UsersModule } from './features/users/users.module';
import { PostsModule } from './features/posts/posts.module';
import { CommentsModule } from './features/comments/comments.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import * as Joi from '@hapi/joi';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    UsersModule,
    PostsModule,
    CommentsModule,
    DatabaseModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        DB_TYPE: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE_NAME: Joi.string().required(),
      }),
    })],
  controllers: [AppController],
  providers: [AppService]
})

export class AppModule { }
