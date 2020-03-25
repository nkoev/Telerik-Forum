import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreatePostDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(20)
  @MaxLength(1000)
  content: string;
}
