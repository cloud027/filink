import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DownloadComponent} from './download.component';

import {ROUTER_CONFIG} from './download.routes';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../shared-module/shared-module.module';
import {DownloadService} from './share/service/download.service';

@NgModule({
  declarations: [DownloadComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(ROUTER_CONFIG)
  ],
  providers: [DownloadService]
})
export class DownloadModule {
}
