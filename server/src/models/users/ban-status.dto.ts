import { IsNotEmpty, IsString, IsDate, IsBoolean } from "class-validator";
import { Transform } from "class-transformer";

export class BanStatusDTO {

  @Transform(val => JSON.parse(val))
  @IsBoolean()
  isBanned: boolean

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsString()
  expires: string
}