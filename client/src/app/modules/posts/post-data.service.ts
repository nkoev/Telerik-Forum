import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PostShow } from './models/post-show.model';
import { Observable } from 'rxjs';
import { PostCreate } from './models/post-create.model';

@Injectable({
  providedIn: 'root',
})
export class PostDataService {

  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYzYzNhZjdhLTI2ODgtNDA0Yy1iMTdkLTc5M2Y4NmI1MWUxNCIsInVzZXJuYW1lIjoidXNlcjQiLCJpYXQiOjE1ODc5MDk4ODAsImV4cCI6MTU4NzkxNzA4MH0.C-LSL0wZ7fcfgiYRO47xlArQ9J-gOiy3sdgoetfiNxo';
  constructor(private readonly http: HttpClient) { }

  public getSinglePost(postId: string): Observable<any> {
    return this.http.get<PostShow>(`http://localhost:3000/posts/${postId}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
  }

  public getAllPosts(): Observable<any> {
    return this.http.get<PostShow[]>(`http://localhost:3000/posts`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
  }

  public createPost(post: PostCreate): Observable<any> {
    return this.http.post<PostShow>(`http://localhost:3000/posts`, post, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
  }

  public updatePost(postId: number, post: PostCreate): Observable<any> {
    return this.http.put<PostShow>(`http://localhost:3000/posts/${postId}`, post, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
  }

  public likePost(postId: number, state: boolean): Observable<any> {
    const params = new HttpParams().set('state', `${state}`);

    return this.http.put<PostShow>(`http://localhost:3000/posts/${postId}/votes`, {}, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      params: params,
    });
  }

  public flagPost(postId: number, state: boolean): Observable<any> {
    const params = new HttpParams().set('state', `${state}`);

    return this.http.put<PostShow>(`http://localhost:3000/posts/${postId}/flag`, {}, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      params: params,
    });
  }

  public lockPost(postId: number, state: boolean): Observable<any> {
    const params = new HttpParams().set('state', `${state}`);

    return this.http.put<PostShow>(`http://localhost:3000/posts/${postId}/lock`, {}, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      params: params,
    });
  }

  public deletePost(postId: number): Observable<any> {
    return this.http.delete<PostShow>(`http://localhost:3000/posts/${postId}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
  }
}
