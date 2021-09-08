import {FacilityComponent} from './facility.component';
import {Routes} from '@angular/router';
import {AreaListComponent} from './area-manage/area-list/area-list.component';
import {AreaDetailComponent} from './area-manage/area-detail/area-detail.component';
import {
  ConfigurationStrategyComponent,
  ControlListComponent,
  FacilityBusinessInformationComponent,
  FacilityDetailComponent,
  FacilityListComponent,
  FacilityLogComponent,
  FacilityViewDetailComponent,
  ViewCableComponent,
  ViewCableDetailComponent,
  ViewFacilityPictureComponent,
} from './facility-manage';
import {PartsListComponent} from './parts-manage/parts-list/parts-list.component';
import {PartsDetailsComponent} from './parts-manage/parts-detail/parts-detail.component';
import {SetAreaDeviceComponent} from './area-manage/set-area-device/set-area-device.component';
import {PhotoViewerComponent} from './facility-manage/photo-viewer/photo-viewer.component';
import {LoopListComponent} from './loop-manage/loop-list/loop-list.component';
import {LoopDetailComponent} from './loop-manage/loop-detail/loop-detail.component';
import {LoopViewDetailComponent} from './loop-manage/loop-view-detail/loop-view-detail.component';
import {EquipmentDetailComponent} from './equipment-manage/equipment-detail/equipment-detail.component';
import {EquipmentListComponent} from './equipment-manage/equipment-list/equipment-list.component';
import {EquipmentViewDetailComponent} from './equipment-manage/equipment-view-detail/equipment-view-detail.component';
import {GroupListComponent} from './group-manage/group-list/group-list.component';
import {GatewayConfigurationComponent} from './equipment-manage/equipment-config/gateway-configuration/gateway-configuration.component';
import {GroupDetailComponent} from './group-manage/group-detail/group-detail.component';
import {FacilityMigrationComponent} from './facility-manage/facility-migration/facility-migration.component';
import {WisdomPictureComponent} from './facility-manage/wisdom-picture/wisdom-picture.component';
import {AssetAnalysisComponent} from './asset-analysis/asset-analysis.component';
import {CodingStandardComponent} from './coding-standard/coding-standard.component';
import {CodingDetailComponent} from './coding-standard/coding-detail/coding-detail.component';
import {BatchCodingComponent} from './facility-manage/facility-view-detail/batch-coding/batch-coding.component';
import {AlreadyDismantleComponent} from './facility-manage/facility-view-detail/already-dismantle/already-dismantle.component';
import {DismantleEquipmentComponent} from './facility-manage/facility-view-detail/dismantle-equipment/dismantle-equipment.component';

/**
 * Created by xiaoconghu on 2019/1/3.
 */
export const ROUTER_CONFIG: Routes = [
  {
    path: '',
    component: FacilityComponent,
    children: [
      {
        path: 'area-list',
        component: AreaListComponent,
        data: {
          breadcrumb: [{label: 'assetManagement'}, {label: 'areaManage'}, {label: 'areaList'}]
        }
      },
      {
        path: 'area-detail/:type',
        component: AreaDetailComponent,
        data: {
          breadcrumb: [{label: 'facilityManage'}, {label: 'areaList', url: 'area-list'}, {label: 'area'}]
        }
      },
      { // build3 查看光缆
        path: 'view-cable',
        component: ViewCableComponent,
        data: {
          breadcrumb: [{label: 'facilityManage'}, {label: 'viewCable'}]
        }
      },
      { //  查看光缆新增
        path: 'view-cable-detail/:type',
        component: ViewCableDetailComponent,
        data: {
          breadcrumb: [
            {label: 'facilityManage'},
            {label: 'viewCable', url: 'view-cable'},
            {label: 'cable'}]
        }
      },
      {
        path: 'facility-list',
        component: FacilityListComponent,
        data: {
          breadcrumb: [{label: 'assetManagement'}, {label: 'facilityManage'}, {label: 'facilityList'}]
        }
      },
      {
        path: 'facility-detail/:type',
        component: FacilityDetailComponent,
        data: {
          breadcrumb: [{label: 'facilityManage'}, {label: 'facilityList', url: 'facility-list'}, {label: 'facility'}]
        }
      },
      {
        path: 'facility-detail-view',
        component: FacilityViewDetailComponent,
        data: {
          breadcrumb: [
            {label: 'facilityManage'},
            {label: 'facilityList', url: 'facility-list'},
            {label: 'facilityView'}
          ]
        }
      },
      {
        path: 'facility-log',
        component: FacilityLogComponent,
        data: {
          breadcrumb: [{label: 'assetManagement'}, {label: 'facilityLog'}]
        }
      },
      {
        path: 'set-area-device',
        component: SetAreaDeviceComponent
      },
      {
        path: 'facility-config',
        component: ConfigurationStrategyComponent,
        data: {
          breadcrumb: [{label: 'facilityManage'}, {label: 'facilityList', url: 'facility-list'}, {label: 'facilityConfig'}]
        }
      },
      {
        path: 'facility-batch-coding',
        component: BatchCodingComponent,
        data: {
          breadcrumb: [{label: 'assetManagement'}, {label: 'facilityList', url: 'facility-list'}, {label: 'batchCoding'}]
        }
      },
      // 设施已拆除
      {
        path: 'remove-facility-list',
        component: AlreadyDismantleComponent,
        data: {
          breadcrumb: [{label: 'assetManagement'}, {label: 'facilityList', url: 'facility-list'}, {label: 'alreadyDismantle'}]
        }
      },
      {
        path: 'remove-facility-view',
        component: FacilityViewDetailComponent,
        data: {
          breadcrumb: [
            {label: 'facilityManage'},
            {label: 'facilityList', url: 'facility-list'},
            {label: 'alreadyDismantle', url: 'remove-facility-list'},
            {label: 'facilityView'}
          ]
        }
      },
      {
        path: 'facility-parts',
        component: PartsListComponent,
        data: {
          breadcrumb: [{label: 'partsManage'}, {label: 'partsList'}]
        }
      },
      {
        path: 'parts-detail/:type',
        component: PartsDetailsComponent,
        data: {
          breadcrumb: [{label: 'partsManage'}, {
            label: 'partsList',
            url: '/business/facility/facility-parts'
          }, {label: 'parts'}]
        }
      },
      {
        path: 'photo-viewer',
        component: PhotoViewerComponent,
        data: {
          breadcrumb: [{label: 'facilityManage', url: 'facility-list'}, {label: 'photoViewer'}]
        }
      },
      {
        path: 'view-facility-picture',
        component: ViewFacilityPictureComponent,
        data: {
          breadcrumb: [
            {label: 'facilityManage'},
            {label: 'facilityList', url: 'facility-list'},
            {label: 'facilityView', url: 'facility-detail-view', queryParamsHandling: 'preserve'},
            {label: 'facilityPicture'}
          ]
        }
      },
      {
        path: 'business-information',
        component: FacilityBusinessInformationComponent,
        data: {
          breadcrumb: [
            {label: 'facilityManage'},
            {label: 'facilityList', url: 'facility-list'},
            {label: 'setBusinessInfo'}
          ]
        }
      },
      {
        path: 'control-list',
        component: ControlListComponent,
        data: {
          breadcrumb: [
            {label: 'assetManagement'},
            {label: 'simManage'}
          ]
        }
      },
      { // 回路列表
        path: 'loop-list',
        component: LoopListComponent,
        data: {
          breadcrumb: [{label: 'assetManagement'}, {label: 'loopManagement'}, {label: 'loopList'}]
        }
      },
      {
        path: 'loop-detail/:type',
        component: LoopDetailComponent,
        data: {
          breadcrumb: [
            {label: 'assetManagement'},
            {label: 'loopManagement', url: 'loop-list'},
            {label: 'loop'}]
        }
      },
      {
        path: 'loop-view-detail',
        component: LoopViewDetailComponent,
        data: {
          breadcrumb: [
            {label: 'assetManagement'},
            {label: 'loopManagement', url: 'loop-list'},
            {label: 'loopDetail'}]
        }
      },
      { // 设备列表
        path: 'equipment-list',
        component: EquipmentListComponent,
        data: {
          breadcrumb: [{label: 'assetManagement'}, {label: 'equipmentManagement'}, {label: 'equipmentList'}]
        }
      },
      { // 新增或编辑设备信息
        path: 'equipment-detail/:type',
        component: EquipmentDetailComponent,
        data: {
          breadcrumb: [{label: 'assetManagement'}, {label: 'equipmentManage', url: 'equipment-list'}, {label: 'equipment'}]
        }
      },
      { // 查询设备详情
        path: 'equipment-view-detail',
        component: EquipmentViewDetailComponent,
        data: {
          breadcrumb: [{label: 'assetManagement'}, {label: 'equipmentManage', url: 'equipment-list'}, {label: 'equipmentDetail'}]
        }
      },
      {
        path: 'equipment-batch-coding',
        component: BatchCodingComponent,
        data: {
          breadcrumb: [{label: 'assetManagement'}, {label: 'equipmentList', url: 'equipment-list'}, {label: 'batchCoding'}]
        }
      },
    //   设备已拆除
      {
        path: 'remove-equipment-list',
        component: DismantleEquipmentComponent,
        data: {
          breadcrumb: [{label: 'assetManagement'}, {label: 'equipmentList', url: 'equipment-list'}, {label: 'removeEquipment'}]
        }
      },
      { // 查询设备已拆除详情
        path: 'dismantle-equipment-view-detail',
        component: EquipmentViewDetailComponent,
        data: {
          breadcrumb: [{label: 'assetManagement'}, {label: 'equipmentManage', url: 'equipment-list'}, {label: 'removeEquipment', url: 'remove-equipment-list'}, {label: 'equipmentDetail'}]
        }
      },
      { // 网关配置
        path: 'gateway-config',
        component: GatewayConfigurationComponent,
        data: {
          breadcrumb: [{label: 'assetManagement'}, {label: 'equipmentManagement', url: 'equipment-list'}, {label: 'gatewayConfig'}]
        }
      },
      { // 分组列表
        path: 'group-list',
        component: GroupListComponent,
        data: {
          breadcrumb: [{label: 'assetManagement'}, {label: 'groupManage'}, {label: 'groupList'}]
        }
      },
      { // 新增或者编辑分组信息
        path: 'group-detail/:type',
        component: GroupDetailComponent,
        data: {
          breadcrumb: [{label: 'assetManagement'}, {label: 'groupManage', url: 'group-list'}, {label: 'group'}]
        }
      },
      {
        path: 'facility-migration',
        component: FacilityMigrationComponent,
        data: {
          breadcrumb: [{label: 'facilityManage'}, {label: 'facilityList', url: 'facility-list'}, {label: 'facilityMigration'}]
        }
      },
      {
        path: 'equipment-migration',
        component: FacilityMigrationComponent,
        data: {
          breadcrumb: [{label: 'equipmentManagement'}, {label: 'equipmentList', url: 'equipment-list'}, {label: 'equipmentMigration'}]
        }
      },
      {
        path: 'wisdom-picture',
        component: WisdomPictureComponent,
        data: {
          breadcrumb: [{label: 'facilityManage'}, {label: 'facilityList', url: 'facility-list'}, {label: 'wisdomPicture'}]
        }
      },
      {
        path: 'asset-analysis',
        component: AssetAnalysisComponent,
        data: {
          breadcrumb: [{label: 'assetManagement'}, {label: 'assetAnalysis'}]
        }
      },
      {
        path: 'coding-standard',
        component: CodingStandardComponent,
        data: {
          breadcrumb: [{label: 'assetManagement'}, {label: 'codingStandard'}]
        }
      },
      {
        path: 'coding-detail/:type',
        component: CodingDetailComponent,
        data: {
          breadcrumb: [{label: 'assetManagement'}, {label: 'codingStandard', url: 'coding-standard'}, {label: 'codingStandard'}]
        }
      },
    ]
  }
];
