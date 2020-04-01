import { Expose, Transform } from "class-transformer";

export class ShowUserDTO {
    @Expose()
    public id: string;
    @Expose()
    public username: string;
    @Expose()
    @Transform((_, obj) => obj.roles.map((x: any) => x.name))
    public roles: string[];

}
