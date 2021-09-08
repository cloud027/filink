import {BrowserModule, Title} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgZorroAntdModule, NZ_I18N, NZ_MODAL_CONFIG, NZ_WAVE_GLOBAL_CONFIG} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HashLocationStrategy, LocationStrategy, registerLocaleData} from '@angular/common';
import {CoreModule} from './core-module/core-module.module';
import {SharedModule} from './shared-module/shared-module.module';
import {CommonUtil} from './shared-module/util/common-util';
import {NgxEchartsModule} from 'ngx-echarts';
import {NotfoundComponent} from './business-module/notfound/notfound.component';
import {MapStoreService} from './core-module/store/map.store.service';
import zh from '@angular/common/locales/zh';
import {TableQueryTermStoreService} from './core-module/store/table-query-term.store.service';
registerLocaleData(zh);
@NgModule({
  declarations: [
    AppComponent,
    NotfoundComponent
  ],
  imports: [
    BrowserModule,
    NgZorroAntdModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    NgxEchartsModule,
    AppRoutingModule
  ],
  providers: [
    Title,
    {provide: NZ_I18N, useValue: CommonUtil.toggleNZi18n().language},
    // {provide: NZ_DATE_LOCALE, useValue: CommonUtil.toggleNZi18n().dateLanguage},
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: NZ_MODAL_CONFIG, useValue: {nzMask: true, nzMaskClosable: false}},
    {provide: MapStoreService, useClass: MapStoreService},
    {provide: TableQueryTermStoreService, useClass: TableQueryTermStoreService},
    {
      provide: NZ_WAVE_GLOBAL_CONFIG, useValue: {
        disabled: true
      }
    }

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
