import { NgModule } from '@angular/core';
import { AllPostsComponent } from './components/all-posts/all-posts.component';
import { PostsRoutingModule } from './posts-routing.module';
import { SinglePostComponent } from './components/single-post/single-post.component';
import { PostDataService } from './post-data.service';
import { CommentDataService } from '../comments/comment-data.service';
import { CommentsModule } from '../comments/comments.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';



@NgModule({
  declarations: [
    AllPostsComponent,
    SinglePostComponent,
  ],
  imports: [
    SharedModule,
    PostsRoutingModule,
    CommentsModule
  ],
  providers: [
    PostDataService,
    CommentDataService
  ]
})
export class PostsModule { }
