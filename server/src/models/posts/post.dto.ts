import { Expose, Transform } from "class-transformer";
import { User } from "../../database/entities/user.entity";

export class PostDTO {
  @Expose()
  public id: number;
  @Expose()
  public title: string;
  @Expose()
  public content: string;
  @Expose()
  public user: User;
  @Expose()
  @Transform(votes => votes.length)
  public votes: number;

}

