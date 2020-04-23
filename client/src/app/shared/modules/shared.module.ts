import { NgModule } from '@angular/core';
import { NavigationComponent } from '../components/navigation/navigation.component';
import { AppMaterialModule } from './material.module';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [NavigationComponent],
  imports: [CommonModule, HttpClientModule, AppMaterialModule, RouterModule],
  exports: [
    NavigationComponent,
    CommonModule,
    HttpClientModule,
    AppMaterialModule,
    RouterModule,
  ],
})
export class SharedModule {}
