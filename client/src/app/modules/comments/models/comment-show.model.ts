export interface CommentShow {
    id: number;

    content: string;

    user: any;

    votes: any[];

    createdOn: Date;

    inEditMode: boolean;

    isLiked: boolean;

    isAuthor: boolean;

    isAdmin: boolean;

}