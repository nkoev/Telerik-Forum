import { Comment } from "../../database/entities/comment.entity"

export class ShowCommentDTO {

    public id: number;
    public content: string;
    public user: string;

    constructor(comment: Comment) {
        this.id = comment.id;
        this.content = comment.content;
        this.user = comment.user.username;
    }
}
