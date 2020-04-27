import { NgModule } from '@angular/core';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { AppMaterialModule } from './material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DialogService } from '../services/dialog.service';

@NgModule({
  declarations: [NavigationComponent],
  imports: [CommonModule, AppMaterialModule, RouterModule],
  exports: [NavigationComponent, CommonModule, AppMaterialModule, RouterModule],
  providers: [DialogService],
})
export class SharedModule {}
