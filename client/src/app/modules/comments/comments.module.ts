import { NgModule } from '@angular/core';
import { AllCommentsComponent } from './components/all-comments/all-comments.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { CommentDialogComponent } from './components/comment-dialog/comment-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        AllCommentsComponent,
        CommentDialogComponent,
    ],
    imports: [
        SharedModule,
        ReactiveFormsModule,
    ],
    exports: [
        AllCommentsComponent
    ]
})
export class CommentsModule { }
