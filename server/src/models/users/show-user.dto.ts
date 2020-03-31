import { Expose } from "class-transformer";

export class ShowUserDTO {
    @Expose()
    public id: string;
    @Expose()
    public username: string;

}
