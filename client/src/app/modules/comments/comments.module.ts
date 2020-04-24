import { NgModule } from '@angular/core';
import { CommentsComponent } from './components/comments/comments.component';
import { CommentDataService } from './comment-data.service';
import { SharedModule } from 'src/app/shared/modules/shared.module';


@NgModule({
    declarations: [
        CommentsComponent
    ],
    imports: [
        SharedModule
    ],
    providers: [
        CommentDataService
    ],
    exports: [
        CommentsComponent
    ]
})
export class CommentsModule { }
