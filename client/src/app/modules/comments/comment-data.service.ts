import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { CommentShow } from './models/comment-show.model';
import { CommentCreate } from './models/comment-create.model';

@Injectable({
  providedIn: 'root',
})
export class CommentDataService {

  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4MTc0NGE1LTZlMDktNGZiMy05MTgzLTFjNzlmOTZlNmUyMiIsInVzZXJuYW1lIjoidXNlcjQiLCJpYXQiOjE1ODgwMTk0MzMsImV4cCI6MTU4ODAyNjYzM30.PSygiw_1oiTOURQborFJFR7_qJw0iYMI92T-LvGnMpA';

  constructor(private readonly http: HttpClient) { }

  public getAllComments(postId: number): Observable<CommentShow[]> {
    return this.http.get<CommentShow[]>(`http://localhost:3000/posts/${postId}/comments`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
  }

  public createComment(postId: number, comment: CommentCreate): Observable<CommentShow> {
    return this.http.post<CommentShow>(`http://localhost:3000/posts/${postId}/comments`, comment, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
  }

  public updateComment(postId: number, comment: CommentShow): Observable<CommentShow> {
    return this.http.put<CommentShow>(`http://localhost:3000/posts/${postId}/comments/${comment.id}`, comment, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
  }

  public likeComment(postId: number, commentId: number, state: boolean): Observable<CommentShow> {
    const params = new HttpParams().set('state', `${state}`);

    return this.http.put<CommentShow>(`http://localhost:3000/posts/${postId}/comments/${commentId}/votes`, {}, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      params: params,
    });
  }

  public deleteComment(postId: number, commentId: number): Observable<CommentShow> {
    return this.http.delete<CommentShow>(`http://localhost:3000/posts/${postId}/comments/${commentId}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
  }
}