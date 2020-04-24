import { NgModule } from '@angular/core';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { AppMaterialModule } from './material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [NavigationComponent],
  imports: [CommonModule, AppMaterialModule, RouterModule],
  exports: [NavigationComponent, CommonModule, AppMaterialModule, RouterModule],
})
export class SharedModule {}
