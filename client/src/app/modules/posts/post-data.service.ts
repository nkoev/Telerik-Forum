import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PostShow } from './models/post-show.model';
import { Observable } from 'rxjs';
import { PostCreate } from './models/post-create.model';

@Injectable({
  providedIn: 'root',
})
export class PostDataService {
  private postsURL = 'http://localhost:3000/posts';

  constructor(private readonly http: HttpClient) { }

  public getSinglePost(postId: number): Observable<PostShow> {
    return this.http.get<PostShow>(`${this.postsURL}/${postId}`);
  }

  public getAllPosts(limit: number, offset: number): Observable<PostShow[]> {
    const params = new HttpParams().set('limit', `${limit}`).set('offset', `${offset}`);

    return this.http.get<PostShow[]>(`${this.postsURL}`, { params });
  }

  public getPostsCount(): Observable<number> {
    return this.http.get<number>(`${this.postsURL}/count`);
  }

  public createPost(post: PostCreate): Observable<PostShow> {
    return this.http.post<PostShow>(`${this.postsURL}`, post);
  }

  public updatePost(postId: number, post: PostCreate): Observable<PostShow> {
    return this.http.put<PostShow>(`${this.postsURL}/${postId}`, post);
  }

  public likePost(postId: number, state: boolean): Observable<PostShow> {
    const params = new HttpParams().set('state', `${state}`);

    return this.http.put<PostShow>(`${this.postsURL}/${postId}/votes`, {}, { params });
  }

  public flagPost(postId: number, state: boolean): Observable<PostShow> {
    const params = new HttpParams().set('state', `${state}`);

    return this.http.put<PostShow>(`${this.postsURL}/${postId}/flag`, {}, { params });
  }

  public lockPost(postId: number, state: boolean): Observable<PostShow> {
    const params = new HttpParams().set('state', `${state}`);

    return this.http.put<PostShow>(`${this.postsURL}/${postId}/lock`, {}, { params });
  }

  public deletePost(postId: number): Observable<PostShow> {
    return this.http.delete<PostShow>(`${this.postsURL}/${postId}`);
  }
}
