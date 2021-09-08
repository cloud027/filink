import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {PaginationComponent} from './component/pagination/pagination.component';
import {ProgressComponent} from './component/progress/progress.component';
import {AssetPaginationComponent} from './component/asset-pagination/asset-pagination.component';
import {FormComponent} from './component/form/form.component';
import {VideoComponent} from './component/video/video.component';
import {TableComponent} from './component/table/table.component';
import {TableSearchComponent} from './component/table/table-search/table-search.component';
import {TreeSelectorComponent} from './component/tree-selector/tree-selector.component';
import {MapSelectorComponent} from './component/map-selector/map-selector.component';
import {BreadcrumbComponent} from './component/breadcrumb/breadcrumb.component';
import {RouterModule} from '@angular/router';
import {DetailTitleComponent} from './component/detail-title/detail-title.component';
import {DatePickerComponent} from './component/date-picker/date-picker.component';
import {MapComponentComponent} from './component/map-selector/map-component/map-component.component';
import {TreeAreaSelectorComponent} from './component/tree-area-selector/tree-area-selector.component';
import {FiLinkModalService} from './service/filink-modal/filink-modal.service';
import {MapComponent} from './component/map/map.component';
import {DynamicPipe} from './pipe/dynamic.pipe';
import {CheckSelectInputComponent} from './component/check-select-input/check-select-input.component';
import {TelephoneInputComponent} from './component/telephone-input/telephone-input.component';
import {BsDropdownModule} from 'ngx-bootstrap';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {Download} from './util/download';
import {AccessPermissionDirective} from './directive/access-permission.directive';
import {TenantPermissionDirective} from './directive/tenant-permission.directive';
import {ProgressBarDirective} from './directive/progress-bar.directive';
import {ImageViewComponent} from './component/image-view/image-view.component';
import {PhotoInfoComponent} from './component/image-view/photo-info/photo-info.component';
import {TableVirtualComponent} from './component/table/table-virtual/table-virtual.component';
import {ImageViewService} from './service/picture-view/image-view.service';
import {TreeRoleSelectorComponent} from './component/tree-role-selector/tree-role-selector.component';
import {SelectValuePipe} from './pipe/selectValue.pipe';
import {RuleUtil} from './util/rule-util';
import {MapSelectorInspectionComponent} from './component/map-selector/map-selector-inspection/map-selector-inspection.component';
import {BusinessTemplateComponent} from './component/business-template/business-template.component';
import {AddTemplateComponent} from './component/business-template/add-template/add-template.component';
import {BoxTemplateComponent} from './component/business-template/box-template/box-template.component';
import {TemplateSearchComponent} from './component/business-template/template-search/template-search.component';
import {FrameTemplateComponent} from './component/business-template/frame-template/frame-template.component';
import {BoardTemplateComponent} from './component/business-template/board-template/board-template.component';
import {ExportMessagePushComponent} from './component/export-message-push/export-message-push.component';
import {ExportMessagePushService} from './service/message-push/message-push.service';
import {BusinessPictureComponent} from './component/business-picture/business-picture.component';
import {CityPickerComponent} from './component/city-picker/city-picker.component';
import {DeviceTypePipe} from './pipe/device-type.pipe';
import {MultipleValuePipe} from './pipe/multiple-value.pipe';
import {SearchInputComponent} from './component/search-input/search-input.component';
import {FormConfigService} from './component/business-template/form-config.service';
import {NavigationTranslatePipe} from './pipe/navigation-translate.pipe';
import {DrawTemplateService} from './component/business-template/draw-template.service';
import {AlarmNameComponent} from './component/business-component/alarm/alarm-name/alarm-name.component';
import {AreaComponent} from './component/business-component/alarm/area/area.component';
import {AlarmObjectComponent} from './component/business-component/alarm/alarm-object/alarm-object.component';
import {UserComponent} from './component/business-component/alarm/user/user.component';
import {UnitComponent} from './component/business-component/alarm/unit/unit.component';
import {XcNzSelectModule} from './component/select';
import {AudioComponent} from './component/audio/audio.component';
import {AudioMusicService} from './service/audio-music/audio-music.service';
import {NoticeMusicService} from './util/notice-music.service';
import {StatisticalSliderComponent} from './component/statistical-slider/statistical-slider.component';
import {BusinessFrameComponent} from './component/business-frame/business-frame.component';
import {DeviceObjectComponent} from './component/core-fusion/device-object.component';
import {BusinessFacilityService} from './service/business-facility/business-facility.service';
import {BusinessTemplateService} from './component/business-template/business-template.service';
import {AsyncRuleUtil} from './util/async-rule-util';
import {SerialNumberPipe} from './pipe/serial-number.pipe';
import {EquipmentBulkOperationsComponent} from './component/business-component/equipment-bulk-operations/equipment-bulk-operations.component';
import {DynamicRenderComponent} from './component/dynamic-render/dynamic-render.component';
import {DynamicRenderDirective} from './component/dynamic-render/dynamic-render.directive';
import {TableHeaderComponent} from './component/table/table-header/table-header.component';
import {TroubleSuggestComponent} from './component/trouble-suggest/trouble-suggest.component';
import {NgxEchartsModule} from 'ngx-echarts';
import {SliderControlComponent} from './component/dynamic-render/dynamic-component-repository/slider-control/slider-control.component';
import {UploadFileComponent} from './component/upload-file/upload-file.component';
import {ButtonControlComponent} from './component/dynamic-render/dynamic-component-repository/button-control/button-control.component';
import {InformationScreenComponent} from './component/dynamic-render/dynamic-component-repository/information-screen/information-screen.component';
import {MusicControlComponent} from './component/dynamic-render/dynamic-component-repository/music-control/music-control.component';
import {EquipmentStatusInformationComponent} from './component/business-component/equipment-status-information/equipment-status-information.component';
import {CompressUtil} from './util/compress-util';
import {EquipmentViewDetailCommonComponent} from './component/business-component/equipment-detail-view/equipment-view-detail-common.component';
import {AlarmTimerComponent} from './component/business-component/time-selector/alarm-timer.component';
import {
  EquipmentAlarmComponent,
  EquipmentBasicOperationComponent,
  EquipmentImgViewComponent,
  EquipmentInfrastructureComponent,
  EquipmentLogDetailComponent,
  EquipmentOperateLogComponent,
  EquipmentWorkOrderComponent
} from './component/business-component/equipment-detail-view';
import {HandelAlarmUtil} from './util/handel-alarm-util';
import {MapLinePointUtil} from './util/map-line-point-util';
import {ThumbnailComponent} from './component/business-component/thumbnail/thumbnail.component';
import {TimerSelectorService} from './service/time-selector/timer-selector.service';
import {TranslatePipe} from './pipe/translate.pipe';
import {ApplicationOperateComponent} from './component/business-component/equipment-detail-view/appliction-operate/application-operate.component';
import {EquipmentConfigCommonComponent} from './component/business-component/equipment-config-common/equipment-config-common.component';
import {GroupInfoListComponent} from './component/business-component/group-info-list/group-info-list.component';
import {ApplicationPolicyInfoListComponent} from './component/business-component/application-policy-info-list/application-policy-info-list.component';
import {SelectGroupService} from './service/index/select-group.service';
import {FacilityShowService} from './service/index/facility-show.service';
import {IndexCardControlService} from './service/index/index-card-control.service';
import {CloseShowFacilityService} from './service/index/close-show-facility.service';
import {AddWorkOrderComponent} from './component/business-component/alarm/add-work-order/add-work-order.component';
import {TimePickerRangeComponent} from './component/time-picker-range/time-picker-range.component';
import {EquipmentBindComponent} from './component/business-component/equipment-bind/equipment-bind.component';
import {EquipmentConfigComponent} from './component/business-component/equipment-config/equipment-config.component';
import {EquipmentListSelectorComponent} from './component/business-component/equipment-list-selector/equipment-list-selector.component';
import {FacilityListSelectorComponent} from './component/business-component/facility-list-selector/facility-list-selector.component';
import {MenuItemComponent} from './component/menu-item/menu-item.component';
import {OverlayModule} from '@angular/cdk/overlay';
import {MenuSelectedPipe} from './component/menu-item/menu-selected.pipe';
import {SplitScreenComponent} from './component/business-component/application/split-screen/split-screen.component';
import {CameraSettingsComponent} from './component/business-component/application/camera-settings/camera-settings.component';
import {LiveBroadcastComponent} from './component/business-component/application/live-broadcast/live-broadcast.component';
import {DetailImgViewComponent} from './component/detail-img-view/detail-img-view.component';
import {ScreenProgramBroadcastComponent} from './component/business-component/application/program-broadcast/screen-program-broadcast.component';
import {GroupViewDetailComponent} from './component/business-component/group-view-detail/group-view-detail.component';
import {AlarmTurnTroubleService} from '../core-module/mission/alarm-turn-trouble.service';
import {ApplicationService} from '../business-module/application-system/share/service/application.service';
import {ImportMessagePushComponent} from './component/import-message-push/import-message-push.component';
import {TopButtonDisablePipe} from './pipe/top-button-disable.pipe';
import {RelevanceAlarmComponent} from './component/relevance-alarm/relevance-alarm.component';
import {LoopMapComponent} from './component/business-component/loop-map/loop-map.component';
import {IntelligentEntranceGuardComponent} from './component/business-component/intelligent-entrance-guard/intelligent-entrance-guard.component';
import {GuardIconClassPipe} from './component/business-component/intelligent-entrance-guard/guard-icon-class.pipe';
import {InputNumberPipe} from './pipe/input-number.pipe';
import {DeviceDrawLineMapComponent} from './component/business-component/device-draw-line/device-draw-line-map.component';
import {UploadImageComponent} from './component/business-component/upload-img/upload-img.component';
import {LoopListSelectorComponent} from './component/business-component/loop/loop-list-selector/loop-list-selector.component';
import {LoopListMapComponent} from './component/business-component/loop/loop-list-map/loop-list-map.component';
import {BatchUploadFileComponent} from './component/business-component/batch-upload-file/batch-upload-file.component';
import {FacilityShowComponent} from './component/facility-show/facility-show.component';
import {RealPictureComponent} from './component/real-picture/real-picture.component';
import {GroupingChangesComponent} from './component/grouping-changes/grouping-changes.component';
import {EquipmentConfigGatewayComponent} from './component/business-component/equipment-config-gateway/equipment-config-gateway.component';
import {CableSettingComponent} from './component/business-component/cable-setting/cable-setting.component';
import {XcStepsComponent} from './component/business-component/application/xc-steps/xc-steps.component';
import {ButtonGroupComponent} from './component/business-component/application/button-group/button-group.component';
import {WebUploadComponent} from './component/business-component/web-upload/web-upload.component';
import {TenantConfigPipe} from './pipe/tenant-config.pipe';
import {IndexFacilityService} from '../core-module/api-service/index/facility';
import {MenuSearchService} from './service/menu-search/menu-search.service';

import {WebUploadService} from './service/web-upload/web-upload.service';
import {MapGroupCommonComponent} from './component/map/map-group-common.component';
import {MyAttentionComponent} from './component/business-component/application/my-attention/my-attention.component';
import {PositionService} from '../business-module/application-system/share/service/position.service';
import {MultipleCollectEquipmentComponent} from './component/business-component/application/multiple-collect-equipment/multiple-collect-equipment.component';
import {EquipmentSensorListComponent} from './component/business-component/equipment-sensor-list/equipment-sensor-list.component';
import {IndexApiService} from '../business-module/index/service/index/index-api.service';
import {RelevancyAlarmComponent} from './component/business-component/alarm/relevancy-alarm/relevancy-alarm.component';
import {SelectUserComponent} from './component/business-component/select-user/select-user.component';
import {MapSearchComponent} from './component/map-selector/map-search/map-search.component';
import {SelectSupplierComponent} from './component/business-component/select-supplier/select-supplier.component';
import {PlanPanelComponent} from './component/map/plan-panel/plan-panel.component';
import {PlanPointPanelComponent} from './component/map/plan-point-panel/plan-point-panel.component';
import {SelectPolymerizationService} from './service/index/selectPolymerizationService';

import {AudioBroadcastComponent} from './component/business-component/application/audio-broadcast/audio-broadcast.component';
import {CommonUtil} from './util/common-util';
import {CallTimeMeterComponent} from './component/business-component/application/call-time-meter/call-time-meter.component';
import {IndexBroadcastOperatingComponent} from './component/business-component/index-broadcast-operating/index-broadcast-operating.component';
import {IndexVolumeSliderModelComponent} from './component/business-component/index-volume-slider-model/volume-slider-model.component';
import {InsertBroadcastModelComponent} from './component/business-component/insert-broadcast/insert-broadcast-model.component';
import {AudioPreviewComponent} from './component/business-component/audio-preview/audio-preview.component';
import {OnlineBroadcastModelComponent} from './component/business-component/online-broadcast/online-broadcast-model.component';
import {SelectProjectComponent} from './component/business-component/select-project/select-project.component';
import {OverrideNzCalendarComponent} from './component/calendar/nz-calendar.component';
import {OverrideNzCalendarHeaderComponent} from './component/calendar/nz-calendar-header.component';
import {OverrideNzSelectModule} from './component/calendar/override-select/nz-select.module';
import {NzDateCellDirective, NzDateFullCellDirective, NzMonthFullCellDirective, NzMonthCellDirective} from './component/calendar/nz-calendar-cells';

const COMPONENT = [
  PaginationComponent,
  AssetPaginationComponent,
  ApplicationOperateComponent,
  ProgressComponent,
  FormComponent,
  VideoComponent,
  TableComponent,
  TableSearchComponent,
  TreeSelectorComponent,
  MapSelectorComponent,
  ImportMessagePushComponent,
  BreadcrumbComponent,
  DetailTitleComponent,
  DatePickerComponent,
  MapComponentComponent,
  TreeAreaSelectorComponent,
  MapComponent,
  CheckSelectInputComponent,
  TelephoneInputComponent,
  ImageViewComponent,
  PhotoInfoComponent,
  FacilityShowComponent,
  TableVirtualComponent,
  TreeRoleSelectorComponent,
  BusinessTemplateComponent,
  AddTemplateComponent,
  MapSelectorInspectionComponent,
  BoxTemplateComponent,
  TemplateSearchComponent,
  FrameTemplateComponent,
  BoardTemplateComponent,
  ExportMessagePushComponent,
  BusinessPictureComponent,
  CityPickerComponent,
  SearchInputComponent,
  AlarmNameComponent,
  AreaComponent,
  AlarmObjectComponent,
  DeviceObjectComponent,
  UserComponent,
  UnitComponent,
  AudioComponent,
  StatisticalSliderComponent,
  BusinessFrameComponent,
  DynamicRenderComponent,
  UploadFileComponent,
  SliderControlComponent,
  ButtonControlComponent,
  InformationScreenComponent,
  MusicControlComponent,
  GroupInfoListComponent,
  TimePickerRangeComponent,
  MenuItemComponent,
  RelevanceAlarmComponent,
  LoopMapComponent,
  IntelligentEntranceGuardComponent,
  DeviceDrawLineMapComponent,
  UploadImageComponent,
  BatchUploadFileComponent,
  RealPictureComponent,
  GroupingChangesComponent,
  MapGroupCommonComponent,
  MyAttentionComponent,
  SelectUserComponent,
  MapSearchComponent,
  PlanPanelComponent,
  PlanPointPanelComponent,
  AudioBroadcastComponent,
  CallTimeMeterComponent,
  IndexBroadcastOperatingComponent,
  IndexVolumeSliderModelComponent,
  InsertBroadcastModelComponent,
  AudioPreviewComponent,
  OnlineBroadcastModelComponent,
  SelectProjectComponent,
];

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ScrollingModule,
    RouterModule,
    XcNzSelectModule,
    OverlayModule,
    NgxEchartsModule,
    OverrideNzSelectModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    AccessPermissionDirective,
    TenantPermissionDirective,
    ProgressBarDirective,
    ...COMPONENT,
    DynamicPipe,
    DeviceTypePipe,
    MultipleValuePipe,
    TranslatePipe,
    NavigationTranslatePipe,
    TenantConfigPipe,
    EquipmentViewDetailCommonComponent,
    EquipmentConfigCommonComponent,
    XcNzSelectModule,
    EquipmentBulkOperationsComponent,
    EquipmentStatusInformationComponent,
    TroubleSuggestComponent,
    ThumbnailComponent,
    EquipmentBindComponent,
    AddWorkOrderComponent,
    EquipmentConfigComponent,
    FacilityListSelectorComponent,
    EquipmentListSelectorComponent,
    DetailImgViewComponent,
    ScreenProgramBroadcastComponent,
    CameraSettingsComponent,
    SplitScreenComponent,
    GroupViewDetailComponent,
    AlarmTimerComponent,
    LoopListSelectorComponent,
    LoopListMapComponent,
    BatchUploadFileComponent,
    GroupingChangesComponent,
    XcStepsComponent,
    ButtonGroupComponent,
    WebUploadComponent,
    MapGroupCommonComponent,
    MyAttentionComponent,
    MultipleCollectEquipmentComponent,
    RelevancyAlarmComponent,
    SelectValuePipe,
    SelectSupplierComponent,
    OverrideNzCalendarComponent,
    NzDateCellDirective,
    NzDateFullCellDirective,
    NzMonthCellDirective,
    NzMonthFullCellDirective,
    OverrideNzSelectModule,
  ],
  providers: [FiLinkModalService, TimerSelectorService, Download, ImageViewService,
    ExportMessagePushService, ApplicationService, RuleUtil, CompressUtil, AsyncRuleUtil, HandelAlarmUtil, MapLinePointUtil, FormConfigService, DrawTemplateService,
    AudioMusicService, NoticeMusicService, BusinessFacilityService, BusinessTemplateService,
    MenuSearchService, SelectGroupService, SelectPolymerizationService, FacilityShowService, IndexCardControlService,
    CloseShowFacilityService, AlarmTurnTroubleService, WebUploadService, PositionService,
    IndexFacilityService, IndexApiService, CommonUtil],
  declarations: [...COMPONENT, DynamicPipe, SelectValuePipe,
    AccessPermissionDirective, ProgressBarDirective, TenantPermissionDirective, DynamicRenderDirective,
    DeviceTypePipe, NavigationTranslatePipe, BusinessFrameComponent, MultipleValuePipe,
    SerialNumberPipe, EquipmentBulkOperationsComponent, TableHeaderComponent,
    EquipmentStatusInformationComponent,
    SplitScreenComponent,
    CameraSettingsComponent,
    ScreenProgramBroadcastComponent,
    LiveBroadcastComponent,
    AlarmTimerComponent,
    EquipmentWorkOrderComponent,
    EquipmentAlarmComponent,
    EquipmentViewDetailCommonComponent,
    EquipmentConfigCommonComponent,
    EquipmentOperateLogComponent,
    EquipmentLogDetailComponent,
    EquipmentInfrastructureComponent,
    EquipmentImgViewComponent,
    GroupViewDetailComponent,
    TranslatePipe,
    EquipmentBindComponent,
    EquipmentBasicOperationComponent,
    ApplicationPolicyInfoListComponent,
    ThumbnailComponent,
    TroubleSuggestComponent,
    AddWorkOrderComponent,
    EquipmentConfigComponent,
    FacilityListSelectorComponent,
    MenuSelectedPipe,
    EquipmentListSelectorComponent,
    DetailImgViewComponent,
    GuardIconClassPipe,
    UploadImageComponent,
    TopButtonDisablePipe,
    InputNumberPipe,
    LoopListSelectorComponent,
    LoopListSelectorComponent,
    LoopListMapComponent,
    EquipmentConfigGatewayComponent,
    CableSettingComponent, XcStepsComponent, ButtonGroupComponent,
    WebUploadComponent,
    TenantConfigPipe,
    MultipleCollectEquipmentComponent,
    EquipmentSensorListComponent,
    RelevancyAlarmComponent,
    SelectSupplierComponent,
    OverrideNzCalendarHeaderComponent,
    NzDateCellDirective,
    NzDateFullCellDirective,
    NzMonthCellDirective,
    NzMonthFullCellDirective,
    OverrideNzCalendarComponent,
  ],
  entryComponents: [...COMPONENT, ProgressComponent]
})

export class SharedModule {
}
