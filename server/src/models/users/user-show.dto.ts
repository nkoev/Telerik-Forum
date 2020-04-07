import { Expose, Transform } from "class-transformer";

export class UserShowDTO {
    @Expose()
    public id: string;
    @Expose()
    public username: string;
    @Expose()
    @Transform((_, obj) => obj.roles?.map((x: any) => x.name))
    public roles?: string[];

}
