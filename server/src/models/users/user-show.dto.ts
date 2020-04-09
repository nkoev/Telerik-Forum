import { Expose, Transform } from "class-transformer";
import { Role } from "../../database/entities/role.entity";

export class UserShowDTO {
    @Expose()
    public id: string;
    @Expose()
    public username: string;
    @Expose()
    @Transform(roles => roles.map((role: any) => role.name))
    public roles: Role[];

}
