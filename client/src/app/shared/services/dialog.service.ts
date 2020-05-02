import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { UserActivityComponent } from 'src/app/modules/users/components/user-activity/user-activity.component';
import { ActivityDTO } from 'src/app/models/activity.dto';
import { UsersDataService } from 'src/app/modules/users/services/users-data.service';
import { map } from 'rxjs/operators';
import { UserFriendsComponent } from 'src/app/modules/users/components/user-friends/users-friends.component';
import { PostDialogData, PostDialogComponent } from 'src/app/modules/posts/components/post-dialog/post-dialog.component';
import { PostDataService } from 'src/app/modules/posts/post-data.service';
import { DialogComponent } from '../components/dialog/dialog.component';
import { CommentDialogData, CommentDialogComponent } from 'src/app/modules/comments/components/comment-dialog/comment-dialog.component';
import { CommentDataService } from 'src/app/modules/comments/comment-data.service';
import { UserDTO } from 'src/app/models/user.dto';
import { VotesComponent } from '../components/votes/votes.component';

@Injectable()
export class DialogService {
  constructor(
    private matDialog: MatDialog,
    private usersDataService: UsersDataService,
    private readonly postDataService: PostDataService,
    private readonly commentDataService: CommentDataService,
  ) { }

  showUserActivity(userId: string): void {
    this.usersDataService
      .getUserActivity(userId)
      .pipe(
        map((data: ActivityDTO[]) => {
          const dialogConfig = new MatDialogConfig();
          dialogConfig.id = 'modal-component';
          dialogConfig.height = 'auto';
          dialogConfig.width = 'auto';
          dialogConfig.panelClass = 'dialog';
          dialogConfig.backdropClass = 'backdropClass';
          dialogConfig.data = data;
          return this.matDialog.open(UserActivityComponent, dialogConfig);
        })
      )
      .subscribe();
  }

  showUserFriends(): void {
    this.usersDataService
      .getUserFriends()
      .pipe(
        map((data) => {
          const dialogConfig = new MatDialogConfig();
          dialogConfig.id = 'modal-component';
          dialogConfig.height = 'auto';
          dialogConfig.width = 'auto';
          dialogConfig.panelClass = 'dialog';
          dialogConfig.backdropClass = 'backdropClass';
          dialogConfig.data = data;
          return this.matDialog.open(UserFriendsComponent, dialogConfig);
        })
      )
      .subscribe();
  }

  showVotes(votes: UserDTO[]): MatDialogRef<VotesComponent, any> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.id = 'modal-component';
    dialogConfig.height = 'auto';
    dialogConfig.width = 'auto';
    dialogConfig.panelClass = 'dialog';
    dialogConfig.backdropClass = 'backdropClass';
    dialogConfig.data = votes;
    return this.matDialog.open(VotesComponent, dialogConfig);
  }

  createPost(observer): void {
    const dialogData: PostDialogData = {
      title: 'Create New Post',
      postTitleMessage: 'Your post title',
      postTitle: '',
      postContentMessage: 'Your post content',
      postContent: '',
    };

    PostDialogComponent.openPostDialog(this.matDialog, dialogData).subscribe(result => {
      if (result) {
        this.postDataService.createPost(result)
          .subscribe(observer);
      }
    });
  }

  updatePost(post, observer): void {
    const dialogData: PostDialogData = {
      title: 'Update Post',
      postTitleMessage: 'Your new post title',
      postTitle: post.title,
      postContentMessage: 'Your new post content',
      postContent: post.content,
    };

    PostDialogComponent.openPostDialog(this.matDialog, dialogData).subscribe((result) => {
      if (result) {
        if (post.title === result.title && post.content === result.content) {
          return;
        }
        this.postDataService.updatePost(post.id, result).subscribe(observer);
      }
    });
  }

  flagPost(post, observer): void {
    const dialogData = {
      title: 'Flag Post',
      question: post.isFlagged
        ? 'Are you sure you want to unflag this post?'
        : 'Are you sure you want to flag this post?',
    };

    DialogComponent.openDialog(this.matDialog, dialogData).subscribe((result) => {
      if (result) {
        this.postDataService.flagPost(post.id, !post.isFlagged).subscribe(observer);
      }
    });
  }

  lockPost(post, observer): void {
    const dialogData = {
      title: 'Lock Post',
      question: post.isLocked
        ? 'Are you sure you want to unlock this post?'
        : 'Are you sure you want to lock this post?',
    };

    DialogComponent.openDialog(this.matDialog, dialogData).subscribe((result) => {
      if (result) {
        this.postDataService.lockPost(post.id, !post.isLocked).subscribe(observer);
      }
    });
  }

  deletePost(post, observer): void {
    const dialogData = {
      title: 'Delete Post',
      question: 'Are you sure you want to delete this post?',
    };

    DialogComponent.openDialog(this.matDialog, dialogData).subscribe((result) => {
      if (result) {
        this.postDataService.deletePost(post.id).subscribe(observer);
      }
    });
  }

  createComment(postId, observer): void {
    const dialogData: CommentDialogData = {
      title: 'Create New Comment',
      commentContentMessage: 'Your comment content',
      commentContent: '',
    };

    CommentDialogComponent.openCommentDialog(this.matDialog, dialogData).subscribe(result => {
      if (result) {
        this.commentDataService.createComment(postId, result).subscribe(observer);
      }
    });
  }

  deleteComment(postId, comment, observer): void {
    const dialogData = {
      title: 'Delete Comment',
      question: 'Are you sure you want to delete this comment?'
    };

    DialogComponent.openDialog(this.matDialog, dialogData).subscribe(result => {
      if (result) {
        this.commentDataService.deleteComment(postId, comment.id).subscribe(observer);
      }
    });
  }

}
