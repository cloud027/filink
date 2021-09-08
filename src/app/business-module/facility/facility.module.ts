import {NgModule} from '@angular/core';
import {FacilityComponent} from './facility.component';
import {ROUTER_CONFIG} from './facility.routes';
import {RouterModule} from '@angular/router';
import {AreaListComponent} from './area-manage/area-list/area-list.component';
import {AreaDetailComponent} from './area-manage/area-detail/area-detail.component';
import {SharedModule} from '../../shared-module/shared-module.module';
import {
  BasicOperationComponent,
  ConfigurationStrategyComponent,
  ControlListComponent,
  CoreEndComponent,
  CoreFusionComponent,
  FacilityAlarmComponent,
  FacilityBusinessInformationComponent,
  FacilityDetailComponent,
  FacilityImgViewComponent,
  FacilityListComponent,
  FacilityLogComponent,
  FacilityPortInfoComponent,
  FacilityViewDetailComponent,
  FacilityViewDetailLogComponent,
  InfrastructureDetailsComponent,
  IntelligentLabelDetailComponent,
  ViewCableComponent,
  ViewCableDetailComponent,
  ViewFacilityPictureComponent
} from './facility-manage';
import {PartsListComponent} from './parts-manage/parts-list/parts-list.component';
import {PartsDetailsComponent} from './parts-manage/parts-detail/parts-detail.component';
import {NgxEchartsModule} from 'ngx-echarts';
import {SetAreaDeviceComponent} from './area-manage/set-area-device/set-area-device.component';
import {PhotoViewerComponent} from './facility-manage/photo-viewer/photo-viewer.component';
import {PhotoViewFilterComponent} from './facility-manage/photo-viewer/photo-view-filter/photo-view-filter.component';
import {ImageListComponent} from './facility-manage/photo-viewer/image-list/image-list.component';
import {AdjustMapComponent} from './facility-manage/facility-view-detail/view-cable/adjust/adjustMap.component';
import {FacilityMissionService} from '../../core-module/mission/facility.mission.service';
import {CoreEndViewComponent} from './facility-manage/facility-view-detail/core-end-view/core-end-view.component';
import {SmartLabelComponent} from './facility-manage/facility-view-detail/view-cable/table/smart-label.component';
import {MountEquipmentComponent} from './facility-manage/facility-view-detail/mount-equipment/mount-equipment.component';
import {EquipmentViewDetailComponent} from './equipment-manage/equipment-view-detail/equipment-view-detail.component';
import {EquipmentListComponent} from './equipment-manage/equipment-list/equipment-list.component';
import {EquipmentDetailComponent} from './equipment-manage/equipment-detail/equipment-detail.component';
import {EquipmentApiService} from './share/service/equipment/equipment-api.service';
import {GroupListComponent} from './group-manage/group-list/group-list.component';
import {FacilityListSelectorComponent} from '../../shared-module/component/business-component/facility-list-selector/facility-list-selector.component';
import {GroupDetailComponent} from './group-manage/group-detail/group-detail.component';
import {GatewayConfigurationComponent} from './equipment-manage/equipment-config/gateway-configuration/gateway-configuration.component';
import {GroupApiService} from './share/service/group/group-api.service';
import {AreaStylePipe} from './share/pipe/area-style.pipe';
import {DeviceTypeDirective} from './share/directive/device-type.directive';
import {DeviceStatusDirective} from './share/directive/device-status.directive';
import {CoreModule} from '../../core-module/core-module.module';
import {WorkOrderCommonComponent} from './common-component/work-order-common/work-order-common.component';
import {LoopApiService} from './share/service/loop/loop-api.service';
import {FacilityWorkOrderComponent} from './facility-manage/facility-view-detail/facility-work-order/facility-work-order.component';
import {AreaApiService} from './share/service/area/area-api.service';
import {CoreApiService} from './share/service/core/core-api-service';
import {PartsMgtApiService} from './share/service/parts/parts-api.service';
import {FacilityApiService} from './share/service/facility/facility-api.service';
import {PictureApiService} from './share/service/picture/picture-api.service';
import {LoopListComponent} from './loop-manage/loop-list/loop-list.component';
import {LoopViewDetailComponent} from './loop-manage/loop-view-detail/loop-view-detail.component';
import {LoopDetailComponent} from './loop-manage/loop-detail/loop-detail.component';
import {LoopBasicDetailsComponent} from './loop-manage/loop-view-detail/loop-basic-details/loop-basic-details.component';
import {LoopLinkDeviceComponent} from './loop-manage/loop-view-detail/loop-link-device/loop-link-device.component';
import {LoopBasicOperationComponent} from './loop-manage/loop-view-detail/loop-basic-operation/loop-basic-operation.component';
import { FacilityMigrationComponent } from './facility-manage/facility-migration/facility-migration.component';
import { WisdomPictureComponent } from './facility-manage/wisdom-picture/wisdom-picture.component';
import { EquipmentWarehouseListComponent } from './facility-manage/wisdom-picture/equipment-warehouse-list/equipment-warehouse-list.component';
import { AssetAnalysisComponent } from './asset-analysis/asset-analysis.component';
import { AssetTypeFilterComponent } from './asset-analysis/asset-type-filter/asset-type-filter.component';
import { AssetGrowthRateFilterComponent } from './asset-analysis/asset-growth-rate-filter/asset-growth-rate-filter.component';
import { AssetFailureDistributionFilterComponent } from './asset-analysis/asset-failure-distribution-filter/asset-failure-distribution-filter.component';
import {AssetAnalysisApiService} from './share/service/asset-analysis/asset-analysis-api.service';
import {CodingStandardApiService} from './share/service/coding-standard/coding-standard-api.service';
import { CodingStandardComponent } from './coding-standard/coding-standard.component';
import { CodingDetailComponent } from './coding-standard/coding-detail/coding-detail.component';
import { NewCodingStepSecondComponent } from './coding-standard/new-coding-step-second/new-coding-step-second.component';
import { BatchCodingComponent } from './facility-manage/facility-view-detail/batch-coding/batch-coding.component';
import { AlreadyDismantleComponent } from './facility-manage/facility-view-detail/already-dismantle/already-dismantle.component';
import { DismantleEquipmentComponent } from './facility-manage/facility-view-detail/dismantle-equipment/dismantle-equipment.component';


@NgModule({
  declarations: [FacilityComponent, FacilityListComponent,
    AreaListComponent, AreaDetailComponent, FacilityDetailComponent, FacilityViewDetailComponent, InfrastructureDetailsComponent,
    BasicOperationComponent, FacilityAlarmComponent, FacilityViewDetailLogComponent,
    FacilityImgViewComponent,
    ConfigurationStrategyComponent, FacilityLogComponent, SetAreaDeviceComponent, PartsListComponent, PartsDetailsComponent,
    PhotoViewerComponent, PhotoViewFilterComponent, ImageListComponent,
    CoreEndComponent,
    ViewCableComponent,
    ViewCableDetailComponent,
    CoreFusionComponent,
    ViewFacilityPictureComponent,
    FacilityPortInfoComponent,
    AdjustMapComponent,
    IntelligentLabelDetailComponent,
    CoreEndViewComponent,
    SmartLabelComponent,
    FacilityBusinessInformationComponent,
    ControlListComponent,
    MountEquipmentComponent,
    LoopListComponent,
    LoopDetailComponent,
    LoopViewDetailComponent,
    LoopBasicOperationComponent,
    LoopBasicDetailsComponent,
    LoopLinkDeviceComponent,
    EquipmentViewDetailComponent,
    EquipmentListComponent,
    EquipmentDetailComponent,
    GroupListComponent,
    GroupDetailComponent,
    GatewayConfigurationComponent,
    AreaStylePipe,
    DeviceTypeDirective,
    DeviceStatusDirective,
    WorkOrderCommonComponent,
    FacilityWorkOrderComponent,
    FacilityMigrationComponent,
    WisdomPictureComponent,
    EquipmentWarehouseListComponent,
    AssetAnalysisComponent,
    AssetTypeFilterComponent,
    AssetGrowthRateFilterComponent,
    AssetFailureDistributionFilterComponent,
    CodingStandardComponent,
    CodingDetailComponent,
    NewCodingStepSecondComponent,
    BatchCodingComponent,
    AlreadyDismantleComponent,
    DismantleEquipmentComponent
  ],
  imports: [
    SharedModule,
    NgxEchartsModule,
    RouterModule.forChild(ROUTER_CONFIG),
    CoreModule
  ],
  exports: [
    FacilityListSelectorComponent
  ],
  providers: [GroupApiService, LoopApiService, AreaApiService, CoreApiService, FacilityApiService, PictureApiService,
    EquipmentApiService, PartsMgtApiService, FacilityMissionService, AssetAnalysisApiService, CodingStandardApiService]
})
export class FacilityModule {
}
