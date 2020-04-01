import { IsString, IsNotEmpty, MaxLength, MinLength, Length } from 'class-validator';

export class CreatePostDTO {
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(20, 1000)
  content: string;
}
