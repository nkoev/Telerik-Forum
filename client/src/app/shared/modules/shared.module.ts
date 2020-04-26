import { NgModule } from '@angular/core';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { AppMaterialModule } from './material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogComponent } from '../components/dialog/dialog.component';

@NgModule({
  declarations: [NavigationComponent, DialogComponent],
  imports: [CommonModule, AppMaterialModule, RouterModule, FormsModule],
  exports: [NavigationComponent, DialogComponent, CommonModule, AppMaterialModule, RouterModule, FormsModule],
})
export class SharedModule { }
