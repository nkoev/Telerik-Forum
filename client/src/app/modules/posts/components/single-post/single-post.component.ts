import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostDataService } from '../../post-data.service';
import { PostShow } from '../../models/post-show.model';
import { CommentDataService } from 'src/app/modules/comments/comment-data.service';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DialogComponent, DialogData } from 'src/app/shared/components/dialog/dialog.component';
import { PostDialogData, PostDialogComponent } from '../post-dialog/post-dialog.component';
import { CommentShow } from 'src/app/modules/comments/models/comment-show.model';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.css']
})
export class SinglePostComponent implements OnInit {

  post: PostShow;
  postLiked: boolean;
  postFlagged: boolean;
  isAuthor: boolean;
  isAdmin: boolean;

  commentsOpened: boolean = false;
  errorMessage: string = '';

  // REPLACE WITH ACTUAL DATA
  fakeLoggedUser = {
    id: "581744a5-6e09-4fb3-9183-1c79f96e6e22",
    username: "user4",
    roles: ['Basic', 'Admin'],
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
            // console.log(`LOCKED: ${this.post.isLocked}`);
            this.postLiked = this.post.votes.some(vote => vote.id === this.fakeLoggedUser.id),
              // console.log(`LIKED: ${this.postLiked}`);
              this.postFlagged = this.post.flags.some(flag => flag.id === this.fakeLoggedUser.id),
              // console.log(`FLAGGED: ${this.postFlagged}`);
              this.isAuthor = this.post.user.id === this.fakeLoggedUser.id ? true : false;
            // console.log(`AUTHOR: ${this.isAuthor}`);
            this.isAdmin = this.fakeLoggedUser.roles.includes('Admin');
            // console.log(`ADMIN: ${this.isAdmin}`);
          },
          error: err => {
            console.log(err);
            // if (err.error.statusCode === 404) {
            //   this.errorMessage = `No such post with id ${params.postId}`;
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
            this.post.comments = data.map(comment => ({
              ...comment,
              // Additional properties
              isLiked: comment.votes.some(vote => vote.id === this.fakeLoggedUser.id),
              isAuthor: comment.user.id === this.fakeLoggedUser.id ? true : false,
              isAdmin: this.fakeLoggedUser.roles.includes('Admin'),
              inEditMode: false,
            }));

            if (this.post.comments && this.post.comments.length > 0) {
              this.commentsOpened = !this.commentsOpened;
            }
          },
          error: err => console.log(err)
        });

    } else {
      this.commentsOpened = !this.commentsOpened;
    }
  }

  updateComments(data: { comment: CommentShow, state: boolean }): void {
    // this.commentsOpened = false;
    // this.loadComments(this.post.id);
    if (data.state) {
      data.comment.isAuthor = true;
      this.post.comments.push(data.comment);
    } else {
      const index = this.post.comments.reduce((acc, comment, idx) => {
        if (comment.id === data.comment.id) {
          acc = idx;
        }
        return acc;
      }, 0);
      this.post.comments.splice(index, 1);
    }
    this.post.commentsCount = this.post.comments.length;
  }

  openDialog(dialogData: DialogData): Observable<any> {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '40em',
      data: { action: dialogData.title, question: dialogData.question }
    });

    return dialogRef.afterClosed();
  }

  openPostDialog(dialogData: PostDialogData): Observable<any> {
    const dialogRef = this.dialog.open(PostDialogComponent, {
      width: '60em',
      data: {
        title: dialogData.title,
        postTitleMessage: dialogData.postTitleMessage,
        postTitle: dialogData.postTitle,
        postContentMessage: dialogData.postContentMessage,
        postContent: dialogData.postContent,
      }
    });

    return dialogRef.afterClosed();
  }

  updatePost(post: PostShow) {

    const dialogData: PostDialogData = {
      title: 'Update Post',
      postTitleMessage: 'Your new post title',
      postTitle: post.title,
      postContentMessage: 'Your new post content',
      postContent: post.content,
    };

    this.openPostDialog(dialogData).subscribe(result => {
      if (result) {
        if (post.title === result.title && post.content === result.content) {
          return;
        }
        this.postDataService.updatePost(this.post.id, result)
          .subscribe({
            next: data => {
              this.post = data;
              console.log('POST UPDATED');
            },
            error: err => {
              console.log(err);
            }
          });
      }
    });
  }

  likePost(post: PostShow) {

    if (this.isAuthor) {
      return;
    }

    this.postDataService.likePost(post.id, !this.postLiked)
      .subscribe({
        next: data => {
          this.post.votes = data.votes;
          this.postLiked = !this.postLiked;
          console.log('POST (UN)LIKED');
        },
        error: err => {
          console.log(err);
        }
      });
  }

  flagPost(post: PostShow) {

    const dialogData = {
      title: 'Flag Post',
      question: 'Are you sure you want to (un)flag this post?'
    };

    this.openDialog(dialogData).subscribe(result => {
      if (result) {
        this.postDataService.flagPost(post.id, !this.postFlagged)
          .subscribe({
            next: data => {
              this.post = data;
              this.postFlagged = !this.postFlagged;
              console.log('POST WAS (UN)FLAGGED');
            },
            error: err => {
              console.log(err);
            }
          });
      }
    });
  }

  lockPost(post: PostShow) {

    const dialogData = {
      title: 'Lock Post',
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
            }
          });
      }
    });
  }

  deletePost(post: PostShow) {

    const dialogData = {
      title: 'Delete Post',
      question: 'Are you sure you want to delete this post?'
    };

    this.openDialog(dialogData).subscribe(result => {
      if (result) {
        this.postDataService.deletePost(post.id)
          .subscribe({
            next: data => {
              console.log('POST WAS  DELETED');
              this.router.navigate(['/', 'home']);
            },
            error: err => {
              console.log(err);
            }
          });
      }
    });
  }
}
