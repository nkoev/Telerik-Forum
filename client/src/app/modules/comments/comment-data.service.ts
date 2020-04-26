import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentDataService {

  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYzYzNhZjdhLTI2ODgtNDA0Yy1iMTdkLTc5M2Y4NmI1MWUxNCIsInVzZXJuYW1lIjoidXNlcjQiLCJpYXQiOjE1ODc5MDk4ODAsImV4cCI6MTU4NzkxNzA4MH0.C-LSL0wZ7fcfgiYRO47xlArQ9J-gOiy3sdgoetfiNxo';

  constructor(private readonly http: HttpClient) { }

  public getAllComments(postId: number): Observable<any[]> {
    return this.http.get<any>(`http://localhost:3000/posts/${postId}/comments`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
  }

  public likeComment(postId: number, commentId: any, state: boolean): Observable<any> {
    const params = new HttpParams().set('state', `${state}`);

    return this.http.put<any>(`http://localhost:3000/posts/${postId}/comments/${commentId}/votes`, {}, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      params: params,
    });
  }

  public createComment(postId: number, comment: any): Observable<any> {
    return this.http.post<any>(`http://localhost:3000/posts/${postId}/comments`, comment, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
  }

  public updateComment(postId: number, comment: any): Observable<any> {
    return this.http.put<any>(`http://localhost:3000/posts/${postId}/comments/${comment.id}`, comment, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
  }

  public deleteComment(postId: number, commentId: any): Observable<any> {
    return this.http.delete<any>(`http://localhost:3000/posts/${postId}/comments/${commentId}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
  }
}
