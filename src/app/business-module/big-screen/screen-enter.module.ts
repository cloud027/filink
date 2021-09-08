import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ScreenEnterComponent} from './screen-enter.component';
import {ROUTER_CONFIG} from './screen-enter.routes';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../shared-module/shared-module.module';
import {ShowScreenComponent} from './show-screen/show-screen.component';
import {NgxEchartsModule} from 'ngx-echarts';

@NgModule({
  declarations: [ScreenEnterComponent, ShowScreenComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgxEchartsModule,
    RouterModule.forChild(ROUTER_CONFIG)
  ]
})
export class ScreenEnterModule {
}
