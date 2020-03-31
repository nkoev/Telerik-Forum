import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../database/entities/user.entity";
import { Post } from "../../database/entities/post.entity";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { Comment } from "../../database/entities/comment.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Comment])],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule { }