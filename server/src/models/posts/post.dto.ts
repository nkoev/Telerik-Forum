import { Post } from "../../database/entities/post.entity"

export class PostDTO {

  public id: number;
  public title: string;
  public content: string;
  public author: string;
  public votes: number;

  constructor(
    post: Post,
  ) {
    this.id = post.id;
    this.title = post.title;
    this.content = post.content;
    this.author = post.user.username;
    this.votes = post.votes.length
  }

}