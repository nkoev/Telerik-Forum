import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostDataService } from '../../post-data.service';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.css']
})
export class SinglePostComponent implements OnInit {

  public post: Post; //undefined
  public message: string = '';

  commentsOpened: boolean = false;
  postLiked: boolean = false;
  postFlagged: boolean = false;

  fakeLoggedUser: any;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly postDataService: PostDataService,
  ) { }

  ngOnInit(): void {
    console.log('COMPONENT INIT!');

    this.route.params.subscribe(params => {
      this.postDataService.getPostById(params.postId)
        .subscribe({
          next: data => {
            this.post = data;

            // REPLACE WITH ACTUAL DATA
            this.post.commentsCount = 3;
            this.fakeLoggedUser = data.user;
            //

            this.postLiked = this.post.votes.includes(this.fakeLoggedUser) ? true : false;
            this.postFlagged = this.post.flags.includes(this.fakeLoggedUser) ? true : false;
            console.log(this.post);
          },
          error: err => {
            console.log(err);
            // if (err.error.statusCode === 404) {
            //   this.message = `No such post with id ${params.postId}`;
            // }
          }
        });
    });
  }

  likePost(event: Event) {
    this.postLiked
      ? this.post.votes.splice(this.post.votes.indexOf(this.fakeLoggedUser), 1)
      : this.post.votes.push(this.fakeLoggedUser)
    this.postLiked = !this.postLiked;
    console.log(this.post.votes);
    console.log('POST WAS (UN)LIKED');
  }

  flagPost(event: Event) {
    this.postFlagged
      ? this.post.flags.splice(this.post.flags.indexOf(this.fakeLoggedUser), 1)
      : this.post.flags.push(this.fakeLoggedUser)
    this.postFlagged = !this.postFlagged;
    console.log(this.post.flags);
    console.log('POST WAS (UN)FLAGGED');
  }

  updatePost(event: Event) {
    console.log('POST WAS UPDATED');
  }

  deletePost(event: Event) {
    console.log('POST WAS DELETED');
  }

  lockPost(event: Event) {
    this.post.isLocked = !this.post.isLocked;
    console.log('POST WAS (UN)LOCKED');
  }
}
