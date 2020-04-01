import { IsNotEmpty, IsString, MaxLength, MinLength, Length } from "class-validator";

export class UpdatePostDTO {
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  content: string
}