import { Component, OnInit, Renderer2, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostDataService } from '../../post-data.service';
import { PostShow } from '../../models/post-show.model';
import { CommentDataService } from 'src/app/modules/comments/comment-data.service';
import { CommentShow } from 'src/app/modules/comments/models/comment-show.model';
import { UserDTO } from 'src/app/models/user.dto';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { DialogService } from 'src/app/shared/services/dialog.service';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.css'],
})
export class SinglePostComponent implements OnInit {

  @ViewChild('create', { read: ElementRef }) myBtn: ElementRef;
  @HostListener('window:scroll', ['$event']) // for window scroll events
  onScroll(event) {
    if (!this.myBtn) {
      return;
    }
    if (event.path[1].scrollY > 100) {
      this.renderer.setStyle(
        this.myBtn?.nativeElement,
        'display',
        'block'
      );
    } else {
      this.renderer.setStyle(
        this.myBtn?.nativeElement,
        'display',
        'none'
      );
    }
  }

  post: PostShow;
  postLiked: boolean;
  postFlagged: boolean;
  isAuthor: boolean;
  isAdmin: boolean;

  commentsOpened: boolean = false;
  errorMessage: string = '';
  loggedUser: UserDTO;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly postDataService: PostDataService,
    private readonly commentDataService: CommentDataService,
    private authService: AuthService,
    private dialogService: DialogService,
    private renderer: Renderer2,
  ) { }

  ngOnInit(): void {
    console.log('COMPONENT INIT!');

    this.authService.loggedUser$.subscribe((res) => (this.loggedUser = res));

    this.route.params.subscribe((params) => {
      this.postDataService.getSinglePost(params.postId).subscribe({
        next: (data) => {
          this.post = data;
          (this.postLiked = this.post.votes.some(
            (vote) => vote.id === this.loggedUser.id
          )),
            (this.postFlagged = this.post.flags.some(
              (flag) => flag.id === this.loggedUser.id
            )),
            (this.isAuthor =
              this.post.user.id === this.loggedUser.id ? true : false);
          this.isAdmin = this.loggedUser.roles.includes('Admin');
        },
        error: (err) => {
          console.log(err);
          this.router.navigate(['/', '404']);
        },
      });
    });
  }

  ngAfterViewInit() {
    let commentId: number;

    this.route.queryParams.subscribe(params => {
      commentId = params['comment'];
      if (commentId) {
        setTimeout(() => { this.loadComments(this.post?.id); }, 1000);
      }
    });

    if (commentId) {
      setTimeout(() => { document.querySelector(`#c${commentId}`).scrollIntoView(); }, 2000);
    }
  }

  loadComments(postId: number): void {
    if (!this.commentsOpened) {
      this.commentDataService.getAllComments(postId).subscribe({
        next: (data) => {
          this.post.comments = data.map((comment) => ({
            ...comment,
            // Additional properties
            isLiked: comment.votes.some(
              (vote) => vote.id === this.loggedUser.id
            ),
            isAuthor: comment.user.id === this.loggedUser.id ? true : false,
            isAdmin: this.loggedUser.roles.includes('Admin'),
            inEditMode: false,
          }));

          if (this.post.comments && this.post.comments.length > 0) {
            this.commentsOpened = !this.commentsOpened;
          }

          this.post.commentsCount = this.post.comments.length;
        },
        error: (err) => console.log(err),
      });

    } else {
      this.commentsOpened = !this.commentsOpened;
    }
  }

  updateComments(data: { comment: CommentShow; state: boolean }): void {
    // this.commentsOpened = false;
    // this.loadComments(this.post.id);
    if (data.state) {
      if (!this.commentsOpened) {
        this.loadComments(this.post.id);
        return;
      } else {
        data.comment.isAuthor = true;
        this.post.comments.push(data.comment);
      }
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

  updatePost(post: PostShow): void {
    this.dialogService.updatePost(post,
      {
        next: (data) => {
          this.post = {
            ...this.post,
            title: data.title,
            content: data.content,
          };
          console.log('POST UPDATED');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  likePost(post: PostShow): void {
    if (this.isAuthor) {
      return;
    }

    this.postDataService.likePost(post.id, !this.postLiked).subscribe({
      next: (data) => {
        this.post = { ...this.post, votes: data.votes };
        this.postLiked = !this.postLiked;
        console.log('POST (UN)LIKED');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  flagPost(post: PostShow): void {
    this.dialogService.flagPost(post,
      {
        next: (data) => {
          this.post = { ...this.post, flags: data.flags };
          this.postFlagged = !this.postFlagged;
          console.log('POST WAS (UN)FLAGGED');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  lockPost(post: PostShow): void {
    this.dialogService.lockPost(post,
      {
        next: (data) => {
          this.post = { ...this.post, isLocked: data.isLocked };
          console.log('POST WAS (UN)LOCKED');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  deletePost(post: PostShow): void {
    this.dialogService.deletePost(post,
      {
        next: (data) => {
          console.log('POST WAS  DELETED');
          this.router.navigate(['/', 'posts']);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

}
