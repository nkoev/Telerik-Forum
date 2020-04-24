import { Expose, Transform, plainToClass } from "class-transformer";
import { UserShowDTO } from "../users/user-show.dto";

export class PostShowDTO {
  @Expose()
  public id: number;
  @Expose()
  public title: string;
  @Expose()
  public content: string;
  @Expose()
  public user: UserShowDTO;
  @Expose()
  public votes: UserShowDTO[];
  @Expose()
  public flags: UserShowDTO[];
  @Expose()
  public createdOn: Date;
  @Expose()
  public isLocked: boolean;

}

