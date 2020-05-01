import { IsString, IsBoolean, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class BanStatusDTO {
  @Transform(val => JSON.parse(val))
  @IsBoolean()
  isBanned: boolean;

  @IsString()
  @MaxLength(200)
  description: string;

  @IsString()
  @MaxLength(200)
  expires: string;
}
