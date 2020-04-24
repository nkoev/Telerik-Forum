import { Expose, Transform } from "class-transformer";
import { User } from "../../database/entities/user.entity";
import { UserShowDTO } from "../users/user-show.dto";

export class CommentShowDTO {

    @Expose()
    public id: number;
    @Expose()
    public content: string;
    @Expose()
    public user: User;
    @Expose()
    // @Transform(votes => votes.length)
    @Expose()
    public votes: UserShowDTO[];
    @Expose()
    public createdOn: Date;

}
