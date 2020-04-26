export interface PostShow {
    id: number;

    title: string;

    content: string;

    user: any;

    votes: any[];

    commentsCount: number;

    comments?: any[];

    flags: any[];

    createdOn: Date;

    isLocked: boolean;
}