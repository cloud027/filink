import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IndexComponent} from './index.component';
import {SharedModule} from '../../shared-module/shared-module.module';
import {RouterModule} from '@angular/router';
import {ROUTER_CONFIG} from './index.routes';
import {FacilityDetailPanelComponent} from './index-component/facility-detail-panel/facility-detail-panel.component';
import {FacilityAlarmPanelComponent} from './index-component/facility-alarm-panel/facility-alarm-panel.component';
import {LogOrderPanelComponent} from './index-component/log-order-panel/log-order-panel.component';
import {MapIndexComponent} from './map/map.component';
import {NgxEchartsModule} from 'ngx-echarts';
import {FacilityLogTableComponent} from './index-component/log-order-panel/facility-log-table/facility-log-table.component';
import {AlarmTableComponent} from './index-component/facility-alarm-panel/alarm-table/alarm-table.component';
import {OperationRecordComponent} from './index-component/log-order-panel/operation-record/operation-record.component';
import {IndexFacilityOrderListComponent} from './index-component/index-facility-order-list/index-facility-order-list.component';
import {MyCollectionListComponent} from '../../shared-module/component/my-collection-list/my-collection-list.component';
import {IndexStatisticalChartComponent} from './index-statistical-chart/index-statistical-chart.component';
import {IndexMapOperationComponent} from './index-map-operationt/index-map-operation.component';
import {IndexOperationalDataComponent} from './index-operational-data/index-operational-data.component';
import {FacilitiesWorkOrderListComponent} from './index-operational-data/facilities-work-order-list/facilities-work-order-list.component';
import {MyAttentionComponent} from './index-operational-data/my-attention/my-attention.component';
import {FacilitiesListComponent} from './index-operational-data/facilities-list/facilities-list.component';
import {PlanningListComponent} from './index-operational-data/planning-list/planning-list.component';
import {FacilityEquipmentListComponent} from './index-component/facility-equipment-list/facility-equipment-list.component';
import {FacilityParticularsCardComponent} from './index-particulars-card/facility-particulars-card/facility-particulars-card.component';
import {IndexParticularsCardComponent} from './index-particulars-card/index-particulars-card.component';
import {IndexWorkOrderService} from '../../core-module/api-service/index/index-work-order';
import {SelectGroupingComponent} from './index-map-operationt/select-grouping/select-grouping.component';
import {IndexApiService} from './service/index/index-api.service';
import {IndexFacilityService} from '../../core-module/api-service/index/facility';
import {IndexOrderTableComponent} from './index-component/index-order-table/index-order-table.component';
import {MapCoverageService} from '../../shared-module/service/index/map-coverage.service';
import {OperationService} from '../../shared-module/service/index/operation.service';
import {EquipmentOperatingComponent} from './index-component/equipment-operating/equipment-operating.component';
import {FilterConditionService} from './service/filter-condition.service';
import {PositionService} from './service/position.service';
import {PositionFacilityShowService} from './service/position-facility-show.service';
import {LockDetailPanelComponent} from './index-component/lock-detail-panel/lock-detail-panel.component';
import { LogicalAreaComponent } from './index-component/logical-area/logical-area.component';
import { IndexLeftTabComponent } from './index-component/index-left-tab/index-left-tab.component';
import { TabDeviceComponent } from './index-component/tab-device/tab-device.component';
import { AdjustCoordinatesComponent } from './index-map-operationt/adjust-coordinates/adjust-coordinates.component';
import { FacilityGroupComponent } from './index-component/facility-group/facility-group.component';
import { PlanningTreeComponent } from './index-component/planning-tree/planning-tree.component';
import { PlanningLiatLeftCardComponent } from './index-component/planning-liat-left-card/planning-liat-left-card.component';
import { ProjectListComponent } from './index-operational-data/project-list/project-list.component';
import { SmartPoleModelTreeComponent } from './index-component/smart-pole-model-tree/smart-pole-model-tree.component';
import { AppSelectPolymerizationComponent } from './index-map-operationt/app-select-polymerization/app-select-polymerization.component';
@NgModule({
  declarations: [
    IndexComponent,
    FacilityDetailPanelComponent,
    FacilityAlarmPanelComponent,
    LockDetailPanelComponent,
    MapIndexComponent,
    FacilityLogTableComponent,
    AlarmTableComponent,
    OperationRecordComponent,
    IndexFacilityOrderListComponent,
    MyCollectionListComponent,
    IndexStatisticalChartComponent,
    IndexMapOperationComponent,
    IndexOperationalDataComponent,
    FacilitiesWorkOrderListComponent,
    MyAttentionComponent,
    FacilitiesListComponent,
    PlanningListComponent,
    FacilityEquipmentListComponent,
    FacilityParticularsCardComponent,
    IndexParticularsCardComponent,
    SelectGroupingComponent,
    IndexOrderTableComponent,
    EquipmentOperatingComponent,
    LogOrderPanelComponent,
    LogicalAreaComponent,
    IndexLeftTabComponent,
    TabDeviceComponent,
    FacilityGroupComponent,
    AdjustCoordinatesComponent,
    PlanningListComponent,
    PlanningTreeComponent,
    PlanningLiatLeftCardComponent,
    ProjectListComponent,
    SmartPoleModelTreeComponent,
    AppSelectPolymerizationComponent
  ],
  providers: [
    MapCoverageService,
    IndexWorkOrderService,
    IndexApiService,
    IndexFacilityService,
    OperationService,
    FilterConditionService,
    PositionService,
    PositionFacilityShowService
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxEchartsModule,
    RouterModule.forChild(ROUTER_CONFIG)
  ],
  exports: [
    FacilityLogTableComponent,
  ]
})
export class IndexModule {
}
