import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsersModule } from './modules/users/users.module';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { Error404PageComponent } from './pages/error404-page/error404-page.component';
import { CoreModule } from './modules/core/core.module';
import { AuthService } from './modules/core/services/auth.service';

@NgModule({
  declarations: [AppComponent, HomePageComponent, Error404PageComponent],
  imports: [BrowserAnimationsModule, AppRoutingModule, UsersModule, CoreModule],
  providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
