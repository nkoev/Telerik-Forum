import { IsString, IsNotEmpty, Length } from 'class-validator';

export class PostCreateDTO {
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 1000)
  content: string;
}
