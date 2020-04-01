import { Expose } from "class-transformer";

export class UserShowDTO {
    @Expose()
    public id: string;
    @Expose()
    public username: string;

}
