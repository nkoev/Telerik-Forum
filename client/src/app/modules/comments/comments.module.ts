import { NgModule } from '@angular/core';
import { AllCommentsComponent } from './components/all-comments/all-comments.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { CreateCommentComponent } from './components/create-comment/create-comment.component';


@NgModule({
    declarations: [
        AllCommentsComponent,
        CreateCommentComponent,
    ],
    imports: [
        SharedModule
    ],
    providers: [

    ],
    exports: [
        AllCommentsComponent
    ]
})
export class CommentsModule { }
