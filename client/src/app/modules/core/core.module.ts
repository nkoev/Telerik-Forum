import { NgModule, Optional, SkipSelf } from '@angular/core';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StorageService } from './services/storage.service';
import { TokenInterceptorService } from './interceptors/token-interceptor.service';
import { AvatarService } from './services/avatar.service';
import { NotificatorService } from './services/notificator.service';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [],
  providers: [
    AuthService,
    AuthGuard,
    AvatarService,
    StorageService,
    NotificatorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
  ],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      countDuplicates: true,
    }),
  ],
  exports: [BrowserAnimationsModule, HttpClientModule],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parent: CoreModule) {
    if (parent) {
      throw new Error('Core module has already been initiated');
    }
  }
}
