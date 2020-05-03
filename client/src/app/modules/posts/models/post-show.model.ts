import { CommentShow } from '../../comments/models/comment-show.model';

export interface PostShow {
    id: number;

    title: string;

    content: string;

    user: any;

    votes: any[];

    commentsCount: number;

    comments?: CommentShow[];

    flags: any[];

    createdOn: Date;

    isLocked: boolean;

    isAuthor?: boolean;

    isAdmin?: boolean;

    isFlagged?: boolean;

    isLiked?: boolean;
}
