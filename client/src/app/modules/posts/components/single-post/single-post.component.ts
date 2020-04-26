import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostDataService } from '../../post-data.service';
import { PostShow } from '../../models/post-show.model';
import { CommentDataService } from 'src/app/modules/comments/comment-data.service';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DialogComponent, DialogData } from 'src/app/shared/components/dialog/dialog.component';
import { UpdatePostComponent, UpdatePostDialogData } from '../update-post/update-post.component';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.css']
})
export class SinglePostComponent implements OnInit {

  post: PostShow; //undefined
  postLiked: boolean;
  postFlagged: boolean;
  isAuthor: boolean;
  isAdmin: boolean;
  roles: any[] = ['Basic', 'Admin'];

  comments: any[];
  commentsOpened: boolean = false;
  message: string = '';

  fakeLoggedUser = {
    id: "f3c3af7a-2688-404c-b17d-793f86b51e14",
    username: "user4"
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly postDataService: PostDataService,
    private readonly commentDataService: CommentDataService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    console.log('COMPONENT INIT!');

    this.route.params.subscribe(params => {
      this.postDataService.getSinglePost(params.postId)
        .subscribe({
          next: data => {
            this.post = data;
            console.log(`This is the post:`, this.post);
            console.log(`LOCKED: ${this.post.isLocked}`);
            this.postLiked = this.post.votes.some(vote => vote.id === this.fakeLoggedUser.id),
              console.log(`LIKED: ${this.postLiked}`);
            this.postFlagged = this.post.flags.some(flag => flag.id === this.fakeLoggedUser.id),
              console.log(`FLAGGED: ${this.postFlagged}`);
            this.isAuthor = this.post.user.id === this.fakeLoggedUser.id ? true : false;
            console.log(`AUTHOR: ${this.isAuthor}`);
            this.isAdmin = this.roles.includes('Admin');
            console.log(`ADMIN: ${this.isAdmin}`);
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

  loadComments(postId: number): void {
    if (!this.commentsOpened) {
      this.commentDataService.getAllComments(postId)
        .subscribe({
          next: data => {
            this.comments = data;
            this.post.commentsCount = this.comments.length;
            // Additional property
            this.comments = this.comments.map(comment => ({
              ...comment,
              isLiked: comment.votes.some(vote => vote.id === this.fakeLoggedUser.id),
              inEditMode: false,
              isAuthor: this.fakeLoggedUser.id === comment.user.id ? true : false,
              isAdmin: false,
            }));

            if (this.comments && this.comments.length > 0) {
              this.commentsOpened = !this.commentsOpened;
            }
          },
          error: err => console.log(err)
        });

    } else {
      this.commentsOpened = !this.commentsOpened;
    }
  }

  updateComments(comment: any) {
    this.commentsOpened = false;
    this.loadComments(this.post.id);
    // this.comments[this.comments.indexOf(comment)] = comment;
  }

  openDialog(dialogData: DialogData): Observable<any> {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '40em',
      data: { action: dialogData.action, question: dialogData.question }
    });

    return dialogRef.afterClosed();
  }

  openUpdatePostDialog(dialogData: UpdatePostDialogData): Observable<any> {
    const dialogRef = this.dialog.open(UpdatePostComponent, {
      width: '40em',
      data: {
        title: dialogData.title,
        titleMessage: dialogData.titleMessage,
        postTitle: dialogData.postTitle,
        contentMessage: dialogData.contentMessage,
        postContent: dialogData.postContent,
      }
    });

    return dialogRef.afterClosed();
  }

  updatePost(post: PostShow) {

    const dialogData: UpdatePostDialogData = {
      title: 'Update Post',
      titleMessage: 'Your new post title',
      postTitle: post.title,
      contentMessage: 'Your new post content',
      postContent: post.content,
    };

    this.openUpdatePostDialog(dialogData).subscribe(result => {
      if (result) {
        console.log(result);
        this.postDataService.updatePost(this.post.id, result)
          .subscribe({
            next: data => {
              console.log(data);
              this.post = data;
              console.log('POST UPDATED');
            },
            error: err => console.log(err)
          });
      }
    });
  }

  likePost(post: PostShow) {

    if (this.isAuthor) {
      return;
    }

    console.log(`${this.postLiked} => ${!this.postLiked}`);

    this.postDataService.likePost(post.id, !this.postLiked)
      .subscribe({
        next: data => {
          this.post = data;
          console.log(data.votes.length);
          this.postLiked = !this.postLiked;
        },
        error: err => console.log(err)
      });
  }

  flagPost(post: PostShow) {

    const dialogData = {
      action: 'Flag Post',
      question: 'Are you sure you want to (un)flag this post?'
    };

    this.openDialog(dialogData).subscribe(result => {
      if (result) {
        this.postDataService.flagPost(post.id, !this.postFlagged)
          .subscribe({
            next: data => {
              this.post = data;
              console.log(data.flags);
              this.postFlagged = !this.postFlagged;
            },
            error: err => {
              console.log(err);
              return;
            }
          });
      }
    });
  }

  lockPost(post: PostShow) {

    const dialogData = {
      action: 'Lock Post',
      question: 'Are you sure you want to (un)lock this post?'
    };

    this.openDialog(dialogData).subscribe(result => {
      if (result) {
        this.postDataService.lockPost(post.id, !post.isLocked)
          .subscribe({
            next: data => {
              this.post = data;
              console.log('POST WAS (UN)LOCKED');
            },
            error: err => {
              console.log(err);
              return;
            }
          });
      }
    });
  }

  deletePost(post: PostShow) {

    const dialogData = {
      action: 'Delete Post',
      question: 'Are you sure you want to delete this post?'
    };

    this.openDialog(dialogData).subscribe(result => {
      if (result) {
        this.postDataService.deletePost(post.id)
          .subscribe({
            next: data => {
              console.log('POST DELETED');
              this.router.navigate(['/', 'home']);
            },
            error: err => console.log(err)
          });
      }
    });
  }
}
