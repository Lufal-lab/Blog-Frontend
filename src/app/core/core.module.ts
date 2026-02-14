import { NgModule, Optional, SkipSelf } from '@angular/core';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthGuard } from './guards/auth.guard';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    SharedModule
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  exports: []
})
export class CoreModule {
  constructor(
    @Optional() @SkipSelf() parentModule: CoreModule
  ) {
    if (parentModule) {
      'CoreModule ya fue cargado. Importarlo solo en AppModule.'
    };
  }
}
