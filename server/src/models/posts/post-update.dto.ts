import { IsNotEmpty, IsString, Length } from "class-validator";

export class PostUpdateDTO {
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  content: string
}