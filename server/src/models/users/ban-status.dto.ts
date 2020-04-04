import { IsNotEmpty, IsString, IsDate, IsBoolean } from "class-validator";
import { Transform } from "class-transformer";

export class BanStatusDTO {

  @Transform(val => JSON.parse(val))
  @IsBoolean()
  isBanned: boolean

  @IsNotEmpty()
  @IsString()
  description: string;

  @Transform(val => new Date(val))
  @IsDate()
  expires: Date
}