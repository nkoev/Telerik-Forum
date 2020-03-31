import { Expose, Transform } from "class-transformer";
import { User } from "../../database/entities/user.entity";

export class ShowCommentDTO {

    @Expose()
    public id: number;
    @Expose()
    public content: string;
    @Expose()
    public user: User;
    @Expose()
    @Transform(votes => votes.length)
    public votes: number;

}
