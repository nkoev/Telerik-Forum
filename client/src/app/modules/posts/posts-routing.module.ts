import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllPostsComponent } from './components/all-posts/all-posts.component';
import { SinglePostComponent } from './components/single-post/single-post.component';

const routes: Routes = [
    { path: '', redirectTo: 'posts/all', pathMatch: 'full' },
    { path: 'posts/all', component: AllPostsComponent },
    { path: 'posts/:postId', component: SinglePostComponent },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PostsRoutingModule { }
