import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CommentDataService {

  constructor(private readonly http: HttpClient) { }

  public getCommentsByPostId(postId: number): Observable<any[]> {
    return this.http.get<any>(`http://localhost:3000/posts/${postId}/comments`, {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQxODkwOGMzLWZjOTYtNDVhZS1hZWEzLWRmYmUzMzFlZGUwNyIsInVzZXJuYW1lIjoidXNlcjMiLCJpYXQiOjE1ODc3MjczOTIsImV4cCI6MTU4NzczNDU5Mn0.Rkk6Gg4VE_3Ofu3Mtetkg4DtL1KvH85F_WJIH8JUPAI'
      }
    });
  }

  public updateComment(postId, comment: any): Observable<any> {
    return this.http.put<any>(`http://localhost:3000/posts/${postId}/comments/${comment.id}`, comment, {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQxODkwOGMzLWZjOTYtNDVhZS1hZWEzLWRmYmUzMzFlZGUwNyIsInVzZXJuYW1lIjoidXNlcjMiLCJpYXQiOjE1ODc3MjczOTIsImV4cCI6MTU4NzczNDU5Mn0.Rkk6Gg4VE_3Ofu3Mtetkg4DtL1KvH85F_WJIH8JUPAI'
      }
    });
  }
}
