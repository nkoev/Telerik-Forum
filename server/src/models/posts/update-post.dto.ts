import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class UpdatePostDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  content: string
}