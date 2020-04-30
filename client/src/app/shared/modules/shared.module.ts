import { NgModule } from '@angular/core';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { AppMaterialModule } from './material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogComponent } from '../components/dialog/dialog.component';
import { DialogService } from '../services/dialog.service';
import { FilesService } from 'src/app/shared/services/files.service';

@NgModule({
  declarations: [NavigationComponent, DialogComponent],
  imports: [CommonModule, AppMaterialModule, RouterModule, FormsModule],
  exports: [
    NavigationComponent,
    DialogComponent,
    CommonModule,
    AppMaterialModule,
    RouterModule,
    FormsModule,
  ],
  providers: [DialogService, FilesService],
})
export class SharedModule {}
