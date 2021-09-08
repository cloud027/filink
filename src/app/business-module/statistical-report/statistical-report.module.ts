import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StatisticalReportComponent} from './statistical-report.component';
import {ROUTER_CONFIG} from './statistical-report.routes';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../shared-module/shared-module.module';
import {OdnDeviceResourcesComponent} from './odn-device-resources/odn-device-resources.component';
import {NgxEchartsModule} from 'ngx-echarts';
import {EchartColumnComponent} from './echart-column/echart-column.component';
import {DeviceStatisticalComponent} from './device-statistical/device-statistical.component';
import {AlarmStatisticalComponent} from './alarm-statistical/alarm-statistical.component';
import {AlarmTypeComponent} from './alarm-statistical/alarm-type/alarm-type.component';
import {AlarmDisposeComponent} from './alarm-statistical/alarm-dispose/alarm-dispose.component';
import {AlarmNameComponent} from './alarm-statistical/alarm-name/alarm-name.component';
import {AreaAlarmComponent} from './alarm-statistical/area-alarm/area-alarm.component';
import {AlarmIncrementComponent} from './alarm-statistical/alarm-increment/alarm-increment.component';
import {ScreeningConditionComponent} from './alarm-statistical/screening-condition/screening-condition.component';
import {FacilityTypeComponent} from './work-order-statistical/inspection/facility-type/facility-type.component';
import {StatusComponent} from './work-order-statistical/inspection/status/status.component';
import {PercentComponent} from './work-order-statistical/inspection/percent/percent.component';
import {IncrementComponent} from './work-order-statistical/inspection/increment/increment.component';
import {UnitComponent} from './work-order-statistical/inspection/unit/unit.component';
import {DeviceTypeComponent} from './work-order-statistical/clear-barrier/device-type/device-type.component';
import {ClearBarrierStatusComponent} from './work-order-statistical/clear-barrier/clear-barrier-status/clear-barrier-status.component';
import {ProcessingComponent} from './work-order-statistical/clear-barrier/processing/processing.component';
import {FailureComponent} from './work-order-statistical/clear-barrier/failure/failure.component';
import {ClearBarrierRatioComponent} from './work-order-statistical/clear-barrier/clear-barrier-ratio/clear-barrier-ratio.component';
import {IncrementsComponent} from './work-order-statistical/clear-barrier/increments/increments.component';
import {ClearBarrierUnitComponent} from './work-order-statistical/clear-barrier/clear-barrier-unit/clear-barrier-unit.component';
import {TopNComponent} from './top-n/top-n.component';
import {TemplateComponent} from './alarm-statistical/screening-condition/template/template.component';
import {OdnDeviceJumperComponent} from './odn-device-jumper/odn-device-jumper.component';
import {OpticalCableComponent} from './optical-cable/optical-cable.component';
import {OdnDeviceSelectComponent} from './odn-device-select/odn-device-select.component';
import {LogStatisticalComponent} from './log-statistical/log-statistical/log-statistical.component';
import {TemplateDetailsComponent} from './log-statistical/template-details/template-details.component';
import {AlarmStatisticalService} from './share/service/alarm-statistical.service';
import {DeviceStatisticalService} from './share/service/device-statistical.service';
import {LogStatisticalService} from './share/service/log-statistical.service';
import {WorkOrderService} from './share/service/work-order.service';
import {TopNService} from './share/service/top-n.service';
import { AlarmNameSelectComponent } from './alarm-statistical/screening-condition/alarm-name-select/alarm-name-select.component';
import {DismantleStatusComponent} from './work-order-statistical/dismantle/status/status.component';
import {DismantleFacilityTypeComponent} from './work-order-statistical/dismantle/facility-type/facility-type.component';
import {DismantlePercentComponent} from './work-order-statistical/dismantle/percent/percent.component';
import {DismantleIncrementComponent} from './work-order-statistical/dismantle/increment/increment.component';
import {DismantleUnitComponent} from './work-order-statistical/dismantle/unit/unit.component';





@NgModule({
  declarations: [StatisticalReportComponent,
    OdnDeviceResourcesComponent,
    EchartColumnComponent,
    DeviceStatisticalComponent,
    DeviceStatisticalComponent,
    AlarmStatisticalComponent,
    AlarmTypeComponent,
    AlarmDisposeComponent,
    AlarmNameComponent,
    AreaAlarmComponent,
    AlarmIncrementComponent,
    ScreeningConditionComponent,
    FacilityTypeComponent,
    StatusComponent,
    PercentComponent,
    IncrementComponent,
    UnitComponent,
    DeviceTypeComponent,
    ClearBarrierStatusComponent,
    ProcessingComponent,
    FailureComponent,
    ClearBarrierRatioComponent,
    IncrementsComponent,
    ClearBarrierUnitComponent,
    TopNComponent,
    TemplateComponent,
    OdnDeviceJumperComponent,
    OpticalCableComponent,
    OdnDeviceSelectComponent,
    LogStatisticalComponent,
    TemplateDetailsComponent,
    AlarmNameSelectComponent,
    DismantleStatusComponent,
    DismantleFacilityTypeComponent,
    DismantlePercentComponent,
    DismantleIncrementComponent,
    DismantleUnitComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxEchartsModule,
    RouterModule.forChild(ROUTER_CONFIG)
  ],
  providers: [AlarmStatisticalService, DeviceStatisticalService, LogStatisticalService, TopNService, WorkOrderService]
})
export class StatisticalReportModule {
}


