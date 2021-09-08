import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ROUTER_CONFIG} from './topology.routes';
import {TopologyComponent} from './topology.component';
import {SharedModule} from '../../shared-module/shared-module.module';

@NgModule({
  declarations: [TopologyComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(ROUTER_CONFIG)
  ]
})

export class TopologyModule {

}
