import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommentShow } from './models/comment-show.model';
import { CommentCreate } from './models/comment-create.model';

@Injectable({
  providedIn: 'root',
})
export class CommentDataService {
  private postsURL = 'http://localhost:3000/posts';

  constructor(private readonly http: HttpClient) { }

  public getAllComments(postId: number): Observable<CommentShow[]> {
    return this.http.get<CommentShow[]>(`${this.postsURL}/${postId}/comments`);
  }

  public createComment(postId: number, comment: CommentCreate): Observable<CommentShow> {
    return this.http.post<CommentShow>(`${this.postsURL}/${postId}/comments`, comment);
  }

  public updateComment(postId: number, comment: CommentShow): Observable<CommentShow> {
    return this.http.put<CommentShow>(`${this.postsURL}/${postId}/comments/${comment.id}`, comment);
  }

  public likeComment(postId: number, commentId: number, state: boolean): Observable<CommentShow> {
    const params = new HttpParams().set('state', `${state}`);

    return this.http.put<CommentShow>(`${this.postsURL}/${postId}/comments/${commentId}/votes`, {}, {
      params
    });
  }

  public deleteComment(postId: number, commentId: number): Observable<CommentShow> {
    return this.http.delete<CommentShow>(`${this.postsURL}/${postId}/comments/${commentId}`);
  }
}
