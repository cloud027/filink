import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ROUTER_CONFIG} from './application.routes';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../shared-module/shared-module.module';
import {LightingComponent} from './lighting/lighting.component';
import {ReleaseComponent} from './release/release.component';
import {SecurityComponent} from './security/security.component';
import {ApplicationComponent} from './application.component';
import {WorkbenchComponent} from './lighting/workbench/workbench.component';
import {EquipmentListComponent} from './lighting/equipment-list/equipment-list.component';
import {PolicyControlComponent} from './lighting/policy-control/policy-control.component';
import {EquipmentComponent} from './lighting/equipment-list/equipment/equipment.component';
import {GroupComponent} from './lighting/equipment-list/group/group.component';
import {LoopComponent} from './lighting/equipment-list/loop/loop.component';
import {ReleaseEquipmentListComponent} from './release/equipment-list/release-equipment-list.component';
import {ReleaseWorkbenchComponent} from './release/workbench/release-workbench.component';
import {ReleasePolicyControlComponent} from './release/policy-control/release-policy-control.component';
import {SecurityEquipmentListComponent} from './security/equipment-list/security-equipment-list.component';
import {SecurityWorkbenchComponent} from './security/workbench/security-workbench.component';
import {SecurityPolicyControlComponent} from './security/policy-control/security-policy-control.component';
import {ContentListComponent} from './release/content-list/content-list.component';
import {ContentExamineComponent} from './release/content-examine/content-examine.component';
import {ContentExamineDetailsComponent} from './release/content-examine/details/content-examine-details.component';
import {ReplayTheaterComponent} from './security/replay-theater/replay-theater.component';
import {LightingAddComponent} from './lighting/policy-control/add/lighting-add.component';
import {LightingDetailsComponent} from './lighting/policy-control/policy-details/lighting-details.component';
import {ReleaseAddComponent} from './release/policy-control/add/release-add.component';
import {ReleaseDetailsComponent} from './release/policy-control/details/release-details.component';
import {SecurityAddComponent} from './security/policy-control/add/security-add.component';
import {SecurityDetailsComponent} from './security/policy-control/details/security-details.component';
import {ReplayDetailsComponent} from './security/replay-theater/details/replay-details.component';
import {BasicsModelComponent} from './security/workbench/basics/basics-model.component';
import {BasicInformationComponent} from './components/basic-information/basic-information.component';
import {StrategyDetailsComponent} from './lighting/policy-control/strategy-details/strategy-details.component';
import {ReleaseStrategyComponent} from './release/policy-control/release-strategy/release-strategy.component';
import {SecurityStrategyComponent} from './security/policy-control/security-strategy/security-strategy.component';
import {NgxEchartsModule} from 'ngx-echarts';
import {ContentListAddComponent} from './release/content-list/add/content-list-add.component';
import {ApplicationService} from './share/service/application.service';
import {StrategyManagementComponent} from './strategy-management/strategy-list/strategy-management.component';
import {StrategyManagementAddComponent} from './strategy-management/strategy-list/add/strategy-management-add.component';
import {StrategyManagementDetailsComponent} from './strategy-management/strategy-list/details/strategy-management-details.component';
import {StrategyComponent} from './strategy-management/strategy.component';
import {StrategyManageDetailsComponent} from './strategy-management/strategy-list/strategy-details/strategy-manage-details.component';
import {FinishDetailsComponent} from './strategy-management/strategy-list/finish-details/finish-details.component';
import {PassagewayInformationComponent} from './security/workbench/passageway-information/passageway-information.component';
import {EquipmentDetailsComponent} from './lighting/equipment-list/equipment/details/equipment-details.component';
import {CheckSelectService} from './share/service/check.select.service';
import {LoopDetailsComponent} from './lighting/equipment-list/loop/details/loop-details.component';
import {GroupListDetailsComponent} from './lighting/equipment-list/group/details/group-list-details.component';
import {PassagewayAddComponent} from './security/workbench/passageway-add/passageway-add.component';
import {PolicyDetailsComponent} from './components/policy-details/policy-details.component';
import {PolicyBasicOperationComponent} from './components/basic-operation/policy-basic-operation.component';
import {AppliedRangeComponent} from './components/applied-range/applied-range.component';
import {ReleaseEquipmentDetailsComponent} from './release/equipment-list/release-equipment-details/release-equipment-details.component';
import {ReleaseGroupDetailsComponent} from './release/equipment-list/release-group-details/release-group-details.component';
import {SecurityEquipmentListDetailsComponent} from './security/equipment-list/details/security-equipment-list-details.component';
import {SliderModelComponent} from './components/slider-model/slider-model.component';
import {DetailsMapComponent} from './components/details-map/details-map.component';
import {SelectEquipmentComponent} from './components/select-equipment/select-equipment.component';
import {ViewEquipmentComponent} from './components/view-equipment/view-equipment.component';
import {SelectProgramComponent} from './components/select-program/select-program.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PolicyPipe} from './share/pipe/policy.pipe';
import {BroadcastComponent} from './broadcast/broadcast.component';
import {BroadcastAddComponent} from './broadcast/policy-control/add/broadcast-add.component';
import {BroadcastWorkbenchComponent} from './broadcast/workbench/broadcast-workbench.component';
import {BroadcastDetailsComponent} from './broadcast/policy-control/details/broadcast-details.component';
import {BroadcastEquipmentDetailsComponent} from './broadcast/equipment-list/broadcast-equipment-details/broadcast-equipment-details.component';
import {BroadcastEquipmentListComponent} from './broadcast/equipment-list/broadcast-equipment-list.component';
import {BroadcastGroupDetailsComponent} from './broadcast/equipment-list/broadcast-group-details/broadcast-group-details.component';
import {BroadcastPolicyControlComponent} from './broadcast/policy-control/broadcast-policy-control.component';
import {BroadcastContentListComponent} from './broadcast/content-list/broadcast-content-list.component';
import {BroadcastContentListAddComponent} from './broadcast/content-list/add/broadcast-content-list-add.component';
import {BroadcastContentExamineComponent} from './broadcast/content-examine/broadcast-content-examine.component';
import {BroadcastContentExamineDetailsComponent} from './broadcast/content-examine/details/broadcast-content-examine-details.component';
import {HistoryAudioListComponent} from './broadcast/history-audio-list/history-audio-list.component';
import {BroadcastStrategyComponent} from './broadcast/policy-control/broadcast-strategy/broadcast-strategy.component';
import {VolumeSliderModelComponent} from './components/volume-slider-model/volume-slider-model.component';
// import {OnlineBroadcastModelComponent} from '../../shared-module/component/business-component/online-broadcast/online-broadcast-model.component';
// import {InsertBroadcastModelComponent} from '../../shared-module/component/business-component/insert-broadcast/insert-broadcast-model.component';
import {SelectBroadcastProgramComponent} from './components/select-broadcast-program/select-broadcast-program.component';
// import {AudioPreviewComponent} from '../../shared-module/component/business-component/audio-preview/audio-preview.component';
import { CallComponent } from './call/call.component';
import { CallWorkbenchComponent } from './call/workbench/call-workbench.component';
import { CallEquipmentListComponent } from './call/equipment-list/call-equipment-list.component';
import { CallEquipmentDetailsComponent } from './call/equipment-list/call-equipment-details/call-equipment-details.component';
import { CallGroupDetailsComponent } from './call/equipment-list/call-group-details/call-group-details.component';
// import { CallTimeMeterComponent } from '../../shared-module/component/business-component/application/call-time-meter/call-time-meter.component';
import { FacilityAuthorizationComponent } from './facility-authorization/facility-authorization.component';
import { UnifiedAuthorizationComponent } from './facility-authorization/unified-authorization/unified-authorization.component';
import { UnifiedDetailsComponent } from './facility-authorization/unified-details/unified-details.component';
import { TemporaryAuthorizationComponent } from './facility-authorization/temporary-authorization/temporary-authorization.component';
import { EquipmentListMapComponent } from './components/map/map.component';
import {PositionService} from './share/service/position.service';
import {SelectFacilityChangeService} from './share/service/select-facility-change.service';
import {IndexFacilityService} from '../../core-module/api-service/index/facility';
import { ReportAnalysisComponent } from './lighting/report-analysis/report-analysis.component';
import { FilterConditionComponent } from './lighting/report-analysis/filter-condition/filter-condition.component';
import { GatewayStrategyComponent } from './strategy-management/gateway-strategy/gateway-strategy.component';
import { GroupListSelectorComponent } from './components/group-list-selector/group-list-selector.component';
import {ApplicationMapComponent} from './components/map/application-map.compnent';
import {SelectTableEquipmentChangeService} from './share/service/select-table-equipment-change.service';

// start 环境监测
import { MonitorComponent } from './monitor/monitor.component';
import { MonitorWorkbenchComponent } from './monitor/workbench/monitor-workbench.component';
import { MonitorEquipmentListComponent } from './monitor/equipment-list/monitor-equipment-list.component';
import { MonitorEquipmentDetailsComponent } from './monitor/equipment-list/monitor-equipment-details/monitor-equipment-details.component';
import { MonitorPointComponent } from './monitor/workbench/monitor-point/monitor-point.component';
import { MonitorFollowComponent } from './monitor/equipment-list/monitor-follow/monitor-follow.component';
import { MeteorologicalInfoComponent } from './monitor/components/meteorological-info/meteorological-info.component';
import { EquipmentRadioMinimizeComponent } from './lighting/equipment-list/equipment/equipment-radio-minimize/equipment-radio-minimize.component';

// end 环境监测
@NgModule({
  declarations: [
    ApplicationComponent,
    EquipmentDetailsComponent,
    ReleaseEquipmentDetailsComponent,
    SliderModelComponent,
    ReleaseGroupDetailsComponent,
    AppliedRangeComponent,
    PolicyBasicOperationComponent,
    PolicyDetailsComponent,
    LoopDetailsComponent,
    GroupListDetailsComponent,
    StrategyComponent,
    DetailsMapComponent,
    FinishDetailsComponent,
    StrategyManageDetailsComponent,
    StrategyManagementAddComponent,
    StrategyManagementDetailsComponent,
    SecurityEquipmentListDetailsComponent,
    StrategyManagementComponent,
    SecurityStrategyComponent,
    PolicyPipe,
    ReleaseStrategyComponent,
    BasicInformationComponent,
    StrategyDetailsComponent,
    LightingComponent,
    ReleaseComponent,
    SecurityComponent,
    WorkbenchComponent,
    EquipmentListComponent,
    PolicyControlComponent,
    EquipmentComponent,
    GroupComponent,
    LoopComponent,
    ReleaseEquipmentListComponent,
    ReleaseWorkbenchComponent,
    ReleasePolicyControlComponent,
    SecurityWorkbenchComponent,
    SecurityEquipmentListComponent,
    SecurityPolicyControlComponent,
    ContentListComponent,
    ContentExamineComponent,
    ContentExamineDetailsComponent,
    ReplayTheaterComponent,
    LightingAddComponent,
    LightingDetailsComponent,
    ReleaseAddComponent,
    ReleaseDetailsComponent,
    SecurityAddComponent,
    SecurityDetailsComponent,
    ReplayDetailsComponent,
    BasicsModelComponent,
    BasicInformationComponent,
    ContentListAddComponent,
    PassagewayInformationComponent,
    PassagewayAddComponent,
    SelectEquipmentComponent,
    ViewEquipmentComponent,
    SelectProgramComponent,
    BroadcastComponent,
    BroadcastWorkbenchComponent,
    BroadcastAddComponent,
    BroadcastDetailsComponent,
    BroadcastEquipmentDetailsComponent,
    BroadcastEquipmentListComponent,
    BroadcastGroupDetailsComponent,
    BroadcastPolicyControlComponent,
    BroadcastContentListComponent,
    BroadcastContentListAddComponent,
    BroadcastContentExamineComponent,
    BroadcastContentExamineDetailsComponent,
    BroadcastStrategyComponent,
    HistoryAudioListComponent,
    FacilityAuthorizationComponent,
    UnifiedAuthorizationComponent,
    UnifiedDetailsComponent,
    TemporaryAuthorizationComponent,
    CallComponent,
    CallWorkbenchComponent,
    CallEquipmentListComponent,
    CallEquipmentDetailsComponent,
    CallGroupDetailsComponent,
    // CallTimeMeterComponent,
    VolumeSliderModelComponent,
    // OnlineBroadcastModelComponent,
    // InsertBroadcastModelComponent,
    SelectBroadcastProgramComponent,
    // AudioPreviewComponent,
    EquipmentListMapComponent,
    ReportAnalysisComponent,
    FilterConditionComponent,
    GatewayStrategyComponent,
    GroupListSelectorComponent,
    ApplicationMapComponent,
    MonitorComponent,
    MonitorWorkbenchComponent,
    MonitorEquipmentListComponent,
    MonitorEquipmentDetailsComponent,
    MonitorPointComponent,
    MonitorFollowComponent,
    MeteorologicalInfoComponent,
    EquipmentRadioMinimizeComponent
  ],
    exports: [PolicyPipe, EquipmentRadioMinimizeComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgxEchartsModule,
    RouterModule.forChild(ROUTER_CONFIG),
    DragDropModule
  ],
  providers: [
    ApplicationService,
    CheckSelectService,
    PositionService,
    SelectFacilityChangeService,
    IndexFacilityService,
    SelectTableEquipmentChangeService
  ]
})
export class ApplicationModule {
}
