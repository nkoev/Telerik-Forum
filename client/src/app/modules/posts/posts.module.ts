import { NgModule } from '@angular/core';
import { AllPostsComponent } from './components/all-posts/all-posts.component';
import { PostsRoutingModule } from './posts-routing.module';
import { SinglePostComponent } from './components/single-post/single-post.component';
import { CommentsModule } from '../comments/comments.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { UpdatePostComponent } from './components/update-post/update-post.component';

@NgModule({
  declarations: [
    AllPostsComponent,
    SinglePostComponent,
    UpdatePostComponent,
  ],
  imports: [
    SharedModule,
    PostsRoutingModule,
    CommentsModule
  ],
  providers: [

  ],
})
export class PostsModule { }
