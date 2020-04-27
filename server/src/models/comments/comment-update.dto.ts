import { IsNotEmpty, IsString, Length } from "class-validator"

export class CommentUpdateDTO {

    @IsNotEmpty()
    @IsString()
    @Length(1, 200)
    public content: string;
}
