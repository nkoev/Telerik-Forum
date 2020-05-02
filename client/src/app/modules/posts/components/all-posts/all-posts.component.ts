import { Component, OnInit, HostListener, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { PostDataService } from '../../post-data.service';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { UserDTO } from 'src/app/models/user.dto';
import { PageEvent } from '@angular/material/paginator';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { PostShow } from '../../models/post-show.model';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.css']
})
export class AllPostsComponent implements OnInit {

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

  loggedUser: UserDTO;
  posts: PostShow[];

  length: number = 100;
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 15];
  pageIndex: number;
  pageEvent: PageEvent;
  offset: number = 0;

  constructor(
    private readonly postDataService: PostDataService,
    private authService: AuthService,
    private renderer: Renderer2,
    private dialogService: DialogService,
  ) { }

  ngOnInit(): void {
    console.log('COMPONENT INIT!');
    this.authService.loggedUser$.subscribe((res) => (this.loggedUser = res));
    this.updatePostsCount();
    this.loadPosts(this.pageSize, this.offset);
  }

  updatePostsCount(): void {
    this.postDataService.getPostsCount().subscribe({
      next: (data) => {
        this.length = data;
      },
      error: (err) => console.log(err),
    });
  }

  loadPosts(pageSize: number, offset: number): void {
    this.postDataService.getAllPosts(pageSize, offset).subscribe({
      next: (data) => {
        this.posts = data.map((post) => ({
          ...post,
          // Additional properties
          isLiked: post.votes.some(
            (vote) => vote.id === this.loggedUser.id
          ),
          isFlagged: post.flags.some(
            (flag) => flag.id === this.loggedUser.id
          ),
          isAuthor: post.user.id === this.loggedUser.id ? true : false,
          isAdmin: this.loggedUser.roles.includes('Admin'),
        }));
      },
      error: (err) => console.log(err),
    });
  }

  createPost(): void {
    this.dialogService.createPost(
      {
        next: data => {
          data = { ...data, isAuthor: true };
          this.posts.unshift(data);
          this.updatePostsCount();
          console.log('POST ADDED');
        },
        error: err => {
          console.log(err);
        }
      });
  }

  updatePost(post: PostShow): void {
    this.dialogService.updatePost(post,
      {
        next: (data) => {
          this.posts[this.posts.indexOf(post)] = {
            ...post,
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
    this.postDataService.likePost(post.id, !post.isLiked)
      .subscribe({
        next: data => {
          this.posts[this.posts.indexOf(post)].votes = data.votes;
          post.isLiked = !post.isLiked;
          console.log('POST LIKED');
        },
        error: err => {
          console.log(err);
        }
      });
  }

  flagPost(post: PostShow): void {
    this.dialogService.flagPost(post,
      {
        next: (data) => {
          this.posts[this.posts.indexOf(post)].flags = data.flags;
          post.isFlagged = !post.isFlagged;
          console.log('POST (UN)FLAGGED');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  lockPost(post: PostShow): void {
    this.dialogService.lockPost(post, {
      next: (data) => {
        this.posts[this.posts.indexOf(post)] = { ...post, isLocked: data.isLocked };
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
          const index = this.posts.reduce((acc, post, idx) => {
            if (post.id === data.id) {
              acc = idx;
            }
            return acc;
          }, 0);
          this.posts.splice(index, 1);
          console.log('POST WAS DELETED');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  getFirstNWords(count: number, word: string): string {
    // const regex = new RegExp(`^(?:\S+\s*\n?){1,${count}}`);
    const regEx = /^(?:\S+\s*\n?){1,20}/g;
    return regEx.exec(word) + '...';
  }

  handlePage(event: PageEvent): PageEvent {
    this.updatePostsCount();
    this.loadPosts(event.pageSize, event.pageIndex * event.pageSize);
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    return event;
  }

  showPostVotes(post: PostShow): void {
    if (post.votes.length < 1) {
      return;
    }
    this.dialogService.showVotes(post.votes);
  }

}
