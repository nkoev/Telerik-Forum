import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './models/post.model';

@Injectable()
export class PostDataService {

  constructor(private readonly http: HttpClient) { }

  public getPostById(id: string) {
    return this.http.get<Post>(`http://localhost:3000/posts/${id}`, {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjQxODkwOGMzLWZjOTYtNDVhZS1hZWEzLWRmYmUzMzFlZGUwNyIsInVzZXJuYW1lIjoidXNlcjMiLCJpYXQiOjE1ODc3MjczOTIsImV4cCI6MTU4NzczNDU5Mn0.Rkk6Gg4VE_3Ofu3Mtetkg4DtL1KvH85F_WJIH8JUPAI'
      }
    });
  }
}
