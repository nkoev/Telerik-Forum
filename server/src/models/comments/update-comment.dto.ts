import { IsNotEmpty, IsString, MinLength, MaxLength } from "class-validator"

export class UpdateCommentDTO {

    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    public content: string;
}
