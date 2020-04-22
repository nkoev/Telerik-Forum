import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class UserRegisterDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  public username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  public password: string;
}
