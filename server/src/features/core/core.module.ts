import { Global, Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import Joi = require("@hapi/joi");
import { TypeOrmModule } from "@nestjs/typeorm";
import { BanStatus } from "../../database/entities/ban-status.entity";
import { ActivityService } from "./activity.service";
import { ActivityRecord } from "../../database/entities/activity.entity";
import { ScheduledTasks } from "./scheduled-tasks.service";

@Global()
@Module({
    imports: [AuthModule,
        TypeOrmModule.forFeature([BanStatus, ActivityRecord]),
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                PORT: Joi.number().default(3000),
                DB_TYPE: Joi.string().required(),
                DB_HOST: Joi.string().required(),
                DB_PORT: Joi.number().required(),
                DB_USERNAME: Joi.string().required(),
                DB_PASSWORD: Joi.string().required(),
                DB_DATABASE_NAME: Joi.string().required(),
                JWT_SECRET: Joi.string().required(),
                JWT_EXPIRE_TIME: Joi.string().required(),
            }),
        })],
    exports: [AuthModule, ConfigModule, ActivityService],
    providers: [ActivityService, ScheduledTasks]
})
export class CoreModule { }