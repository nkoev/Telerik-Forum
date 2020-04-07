import { IsString, Length } from "class-validator"

export class CommentCreateDTO {

    @IsString()
    @Length(1, 200)
    public content: string;
}
