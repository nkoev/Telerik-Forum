import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsersModule } from './modules/users/users.module';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CoreModule } from './modules/core/core.module';
import { SharedModule } from './shared/modules/shared.module';
import { DialogComponent } from './shared/components/dialog/dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NotFoundComponent,
    DialogComponent,
  ],
  imports: [AppRoutingModule, UsersModule, CoreModule, SharedModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
