import { Component, OnInit, Input } from '@angular/core';
import { CommentDataService } from '../../comment-data.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {

  @Input()
  postId: number;
  comments: any[];
  fakeLoggedUser: any;

  constructor(
    private readonly commentDataService: CommentDataService,
  ) { }

  ngOnInit(): void {
    this.loadComments(this.postId);
  }

  loadComments(postId: number): void {
    this.commentDataService.getCommentsByPostId(postId)
      .subscribe({
        next: data => {
          this.comments = data;
          // REPLACE
          this.fakeLoggedUser = data[0].user;
          //
          // Additional property
          this.comments = this.comments.map(comment => ({ ...comment, isLiked: comment.votes.includes(this.fakeLoggedUser) ? true : false }));
          console.log(this.comments);
        },
        error: err => console.log(err)
      })
  }

  likeComment(comment: any) {
    comment.isLiked
      ? comment.votes.splice(comment.votes.indexOf(this.fakeLoggedUser), 1)
      : comment.votes.push(this.fakeLoggedUser)
    comment.isLiked = !comment.isLiked;
    console.log('COMMENT WAS (UN)LIKED');
  }

  checkIfLastComment(comment: any): boolean {
    return this.comments[this.comments.length - 1] === comment ? true : false;
  }

  updateComment(event: Event) {
    console.log('COMMENT UPDATED');
    this.commentDataService.updateComment(this.postId, this.comments[0])
      .subscribe({
        next: data => {
          console.log(data);
        },
        error: err => console.log(err)
      });
  }

  deleteComment(event: Event) {
    console.log('COMMENT DELETED');
  }
}
