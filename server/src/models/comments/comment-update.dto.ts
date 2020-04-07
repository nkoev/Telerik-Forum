import { IsNotEmpty, IsString, MinLength, MaxLength } from "class-validator"

export class CommentUpdateDTO {

    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    public content: string;
}
