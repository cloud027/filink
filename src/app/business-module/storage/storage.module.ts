import { NgModule } from '@angular/core';
import {SharedModule} from '../../shared-module/shared-module.module';
import { RouterModule } from '@angular/router';
import { StorageSynopsisComponent } from './storage-manage/storage-synopsis/storage-synopsis.component';
import {StorageComponent} from './storage.component';
import {CoreModule} from '../../core-module/core-module.module';
import {ROUTER_CONFIG} from './storage.routes';
import {StorageApiService} from './share/service/storage-api.service';
import { StorageSynopsisChartComponent } from './share/component/storage-synopsis-chart/storage-synopsis-chart.component';
import { MaterialModelComponent } from './share/component/material-model/material-model.component';
import { WarehousingComponent } from './storage-manage/warehousing/warehousing.component';
import { AddWarehousingComponent } from './storage-manage/warehousing/add-warehousing/add-warehousing.component';
import { DeliveryComponent } from './storage-manage/delivery/delivery.component';
import { AddDeliveryComponent } from './storage-manage/delivery/add-delivery/add-delivery.component';
import { DeliveryOperateComponent } from './storage-manage/delivery/delivery-operate/delivery-operate.component';
import { ModifyDeliveryComponent } from './storage-manage/delivery/modify-delivery/modify-delivery.component';
import {NgxEchartsModule} from 'ngx-echarts';

@NgModule({
  declarations: [StorageComponent, StorageSynopsisComponent, StorageSynopsisChartComponent, MaterialModelComponent,
    WarehousingComponent, AddWarehousingComponent, DeliveryComponent, AddDeliveryComponent, DeliveryOperateComponent, ModifyDeliveryComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(ROUTER_CONFIG),
    CoreModule,
    NgxEchartsModule
  ],
  providers: [StorageApiService]
})
export class StorageModule { }
