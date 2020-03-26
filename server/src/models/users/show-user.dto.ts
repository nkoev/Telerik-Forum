import { User } from "../../database/entities/user.entity";

export class ShowUserDTO {

    public id: string;
    public username: string;

    constructor(user: User) {
        this.id = user.id;
        this.username = user.username;
    }
}
