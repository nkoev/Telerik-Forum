import { IsNotEmpty, IsString, MinLength, MaxLength } from "class-validator";

export class UserLoginDTO {

    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @MaxLength(20)
    public username: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(1)
    @MaxLength(20)
    public password: string;
}
