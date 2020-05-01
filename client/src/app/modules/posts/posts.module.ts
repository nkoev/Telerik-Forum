import { NgModule } from '@angular/core';
import { AllPostsComponent } from './components/all-posts/all-posts.component';
import { PostsRoutingModule } from './posts-routing.module';
import { SinglePostComponent } from './components/single-post/single-post.component';
import { CommentsModule } from '../comments/comments.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { PostDialogComponent } from './components/post-dialog/post-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AllPostsComponent,
    SinglePostComponent,
    PostDialogComponent,
  ],
  imports: [
    SharedModule,
    PostsRoutingModule,
    CommentsModule,
    ReactiveFormsModule,
  ],
  exports: [
    PostDialogComponent
  ]
})
export class PostsModule { }
