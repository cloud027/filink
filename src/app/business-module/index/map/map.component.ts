import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MapControl} from '../util/map-control';
import {MapStoreService} from '../../../core-module/store/map.store.service';
import {MapService} from '../../../core-module/api-service/index/map';
import {IndexApiService} from '../service/index/index-api.service';
import {FacilityService} from '../../../core-module/api-service/facility/facility-manage';
import {ActivatedRoute, Router} from '@angular/router';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import {IndexMissionService} from '../../../core-module/mission/index.mission.service';
import {FacilityDetailPanelComponent} from '../index-component/facility-detail-panel/facility-detail-panel.component';
import {SessionUtil} from '../../../shared-module/util/session-util';
import {MapConfig} from '../../../shared-module/component/map/map.config';
import {MapAbstract} from '../../../shared-module/component/map/map-abstract';
import {MapComponent} from '../../../shared-module/component/map/map.component';
import {indexFacilityPanel, indexOperationalLeftPanel} from '../shared/const/index-const';
import {Title} from '@angular/platform-browser';
import {ResultCodeEnum} from '../../../shared-module/enum/result-code.enum';
import {MapCoverageService} from '../../../shared-module/service/index/map-coverage.service';
import {PositionService} from '../service/position.service';
import {FacilityShowService} from '../../../shared-module/service/index/facility-show.service';
import {FilterConditionService} from '../service/filter-condition.service';
import {PositionFacilityShowService} from '../service/position-facility-show.service';
import {FacilitiesDetailsModel} from '../../../core-module/model/index/facilities-details.model';
import {MapTypeEnum} from '../../../shared-module/enum/filinkMap.enum';
import * as lodash from 'lodash';
import {DeviceAreaModel} from '../shared/model/device-area.model';
import {EquipmentAreaModel} from '../../../core-module/model/index/equipment-area.model';
import {AlarmAreaModel} from '../shared/model/alarm-area.model';
import {MapEventTypeEnum, ViewEnum} from '../../../core-module/enum/index/index.enum';
import {IndexCoverageTypeEnum} from '../shared/enum/index-enum';
import {INDEX_CARD_TYPE, indexCoverageType} from '../../../core-module/const/index/index.const';
import {ResultModel} from '../../../shared-module/model/result.model';
import {mapIconConfig} from '../../../shared-module/service/map-service/map.config';
import {ConfigModel} from '../shared/model/config-model';
import {MapDataModel} from '../../../core-module/model/index/map-data-model';
import {StatisticsConfigModel} from '../shared/model/statistics-config-model';
import {DetailCodeModel} from '../shared/model/detail-code-model';
import {statisticsIconConst} from '../shared/const/statistics-icon-const';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {PlanProjectListModel, PlanProjectModel} from '../../../core-module/model/index/plan-project.model';
import {SelectPolymerizationService} from '../../../shared-module/service/index/selectPolymerizationService';
import {AdjustCoordinatesService} from '../../../shared-module/service/index/adjust-coordinates.service';
import {FacilityForCommonUtil} from '../../../core-module/business-util/facility/facility-for-common.util';
import {WorkOrderStatusUtil} from '../../../core-module/business-util/work-order/work-order-for-common.util';
import {SelectModel} from '../../../shared-module/model/select.model';
import {MapConfig as BMapConfig} from '../../../shared-module/component/map/b-map.config';
import {IndexOperationalDataComponent} from '../index-operational-data/index-operational-data.component';

declare const MAP_TYPE;

/**
 *  ????????????????????????????????????????????????????????????????????????????????????????????????
 */
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapIndexComponent extends MapControl implements OnInit, AfterViewInit, OnDestroy {
  // ????????????temp
  @ViewChild('MapConfigTemp') MapConfigTemp: TemplateRef<any>;
  // ??????
  @ViewChild('mainMap') mainMap: MapComponent;
  // ????????????
  @ViewChild('facilityDetailPanelComponent') facilityDetailPanelComponent: FacilityDetailPanelComponent;
  @ViewChild('indexOperationalDataComponent') indexOperationalDataComponent: IndexOperationalDataComponent;
  // ???????????????id
  public facilityId: string;
  // ?????????????????????id????????????
  public idData;
  // ???????????????name
  public facilityName: string;
  // ????????????
  public mapType: string;
  // ????????????
  public mapConfig: MapConfig;
  // ????????????
  public mapService: MapAbstract;
  // ????????????????????????
  public facilityIconSizeValue: string;
  // ??????????????????????????????
  public facilityIconSizeConfig: ConfigModel[];
  // ??????????????????
  public iconSize: string;
  // ????????????
  public data: MapDataModel[];
  // ????????????tab????????????index
  public selectedIndex: number = indexFacilityPanel.facilityDetail;
  // ???????????????list
  public clustererFacilityList: MapDataModel[];
  // ??????code
  public facilityPowerCode: string[] = [];
  // public tables;
  // ????????????????????????tab
  public isShowFacilityDetailTab: boolean = true;
  // ?????????????????????????????????
  public noFaultType: boolean;
  // ????????????????????????????????????
  public noFailureRateAnalysis: boolean;
  // ??????????????????????????????
  public isShowOpenFacilityPanel: boolean = false;
  // ????????????????????????
  public selectEquipmentData;
  // ???????????????????????????????????????
  public isShowBusinessPicture: boolean = false;
  // ???????????????????????????
  public isShowCard: boolean = false;
  // ????????????????????????
  public facilityNoticeArr = ['focusDevice', 'unFollowDevice'];
  // ???????????????????????????
  public isShowProgressBar: boolean = false;
  // ?????????????????????
  public percent: number;
  // ????????????????????????
  public increasePercent: number;
  // ?????????????????????
  private scheduleTime: number;
  // ????????????
  public areaData: string[];
  // ??????????????????
  public statisticsConfig: StatisticsConfigModel[] = [];
  // ????????????
  public cardType = INDEX_CARD_TYPE;
  // ??????????????????
  public cardIcon = statisticsIconConst;
  // ??????????????????
  public facilityType = IndexCoverageTypeEnum.facility;
  // ?????????
  public centerPoint: string[];
  // ????????????????????????:????????????
  public deviceLocation: FacilitiesDetailsModel;
  // ????????????????????????:????????????
  public equipmentLocation: FacilitiesDetailsModel;
  // ????????????????????????:?????????/?????????
  public planOrProjectLocation: PlanProjectModel = new PlanProjectModel();
  // ????????????????????????:??????/??????????????????
  public planOrProjectListLocation: PlanProjectListModel = new PlanProjectListModel();
  // ??????????????????
  public facilityStoreData = [];
  // ??????????????????
  public equipmentStoreData: string[];
  // ??????????????????
  public roleSelect: boolean = false;
  // ????????????
  public roleAlarm: boolean = false;
  public initMapDevice: boolean = false;
  // ????????????/????????????
  public mapTypeEnum = MapTypeEnum;
  // ????????????????????????
  public deviceAreaModel: DeviceAreaModel = new DeviceAreaModel;
  // ????????????????????????
  public equipmentAreaModel: EquipmentAreaModel = new EquipmentAreaModel;
  // ??????????????????????????????
  public alarmAreaModel: AlarmAreaModel = new AlarmAreaModel;
  // ????????????/???????????????????????????
  public deviceCount: boolean = false;
  // ????????????
  public deviceStatus: boolean = false;
  // ??????????????????
  public alarmCount: boolean = false;
  // ????????????
  public alarmIncrement: boolean = false;
  // ????????????
  public workIncrement: boolean = false;
  // ????????????TOP/????????????TOP
  public topRole: boolean = false;
  // ????????????
  public workerOrder: boolean = false;
  // ?????????????????????????????????????????????
  public facilityCode: string;
  // ???????????????
  private destroy$ = new Subject<void>();
  // ????????????
  public viewIndex;
  // ????????????
  public maintenanceView = ViewEnum.maintenanceView;
  // ????????????
  public projectView = ViewEnum.projectView;
  // ????????????
  public planView = ViewEnum.planView;
  // ????????????????????????
  public polymerizationChange = '1';
  //  ???????????????
  public viewShow = true;
  public maintenanceShow = SessionUtil.checkHasTenantRole('1');
  public projectShow = SessionUtil.checkHasTenantRole('2');
  public planShow = SessionUtil.checkHasTenantRole('3');
  public planRole = SessionUtil.checkHasRole('18');
  public projectRole = SessionUtil.checkHasRole('25');
  public planTypes = SessionUtil.checkHasProjectPlanningTypes('P001');
  public projectTypes = SessionUtil.checkHasProjectPlanningTypes('P002');

  // ?????????
  constructor(
    public $nzI18n: NzI18nService,
    private $mapStoreService: MapStoreService,
    private $facilityService: FacilityService,
    private $mapService: MapService,
    private $indexApiService: IndexApiService,
    private $title: Title,
    private $message: FiLinkModalService,
    private $router: Router,
    private $modal: NzModalService,
    private $activatedRoute: ActivatedRoute,
    private $modalService: FiLinkModalService,
    private $indexMissionService: IndexMissionService,
    private $MapCoverageService: MapCoverageService,
    private $facilityShowService: FacilityShowService,
    private $filterConditionService: FilterConditionService,
    private $positionService: PositionService,
    private $positionFacilityShowService: PositionFacilityShowService,
    private $selectPolymerizationService: SelectPolymerizationService,
    public $adjustCoordinatesService: AdjustCoordinatesService,
    private cdr: ChangeDetectorRef,
  ) {
    super($nzI18n);
  }

  // ??????????????????
  mapShowRefresh = lodash.debounce(() => {
    this.queryHomeData();
  }, 1000, {leading: false, trailing: true});
  // ??????????????????
  mapProjectRefresh = lodash.debounce(() => {
    this.projectViewMap();
  }, 1000, {leading: false, trailing: true});
  // ??????????????????
  mapPlanRefresh = lodash.debounce(() => {
    this.planViewMap();
  }, 1000, {leading: false, trailing: true});

  ngOnInit(): void {
    this.roleSelect = SessionUtil.checkHasRole('03-9-1');
    this.roleAlarm = SessionUtil.checkHasRole('02');
    const equipmentType = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n);

    if (equipmentType[0]) {
      this.selectEquipmentData = equipmentType[0].code;
    }
    window.addEventListener('popstate', function () {
      sessionStorage.setItem('backHistory', 'backHistory');
    }, {passive: false, capture: true});
    // ?????????????????????
    this.mapInit();
    // ??????????????????
    this.viewRole();
    // ??????????????????
    this.viewLocation();
    // ????????????
    this.viewMapChange();
    // ?????????????????????????????????
    this.$adjustCoordinatesService.eventEmit.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value.isShow === true || value.isDrag === true) {
        this.closePanel();
      }
    });
  }

  ngAfterViewInit(): void {
    this.$title.setTitle(`FiLink - ${this.indexLanguage.home}`);
    // ??????????????????
    this.getStatisticsConfig();
    // ????????????????????????
    this.getAllMapConfig();
    // ??????????????????????????????
    this.otherLocation();
  }

  ngOnDestroy(): void {
    // ???????????????????????????
    if (this.scheduleTime) {
      clearInterval(this.scheduleTime);
    }
    sessionStorage.removeItem('backHistory');
    this.$mapStoreService.mapLastID = this.facilityId;
    this.data = [];
    this.$MapCoverageService.showCoverage = null;
    this.$mapStoreService.resetConfig();
    this.destroy$.next();
    this.destroy$.complete();
  }


  /**
   * ????????????
   */
  viewSwitch(event) {
    if (this.viewIndex !== event) {
      this.$mapStoreService.planningSelectedResults = [];
      // ??????????????????
      if (this.mainMap.mapService.mapInstance) {
        this.mainMap.mapService.mapInstance.clearOverlays();
      }
      if (this.mainMap.mapService.markerClusterer) {
        this.mainMap.mapService.markerClusterer.clearMarkers();
      }
      this.viewIndex = event;
      this.polymerizationChange = '1';
      this.refresh();
    }
    if (event !== ViewEnum.maintenanceView) {
      this.$facilityShowService.subject.next({mapShowType: indexCoverageType.facility});
      this.$MapCoverageService.showCoverage = indexCoverageType.facility;
    }
    this.$mapStoreService.resetConfig();
    if (this.$mapStoreService.locationProjectOrPlanId) {
      this.$mapStoreService.locationProjectOrPlanId = null;
      this.mainMap.mapService.setCenterAndZoom(this.centerPoint[0], this.centerPoint[1] , BMapConfig.defaultZoom);
    }
  }

  /**
   * ??????
   */
  public refresh(): void {
    // ??????????????????
    this.locationClear();
    // ??????????????????
    this.mainMap.clearSearch();
    this.mainMap.clearArr = [];
    // ??????????????????
    if (this.viewIndex === this.maintenanceView) {
      this.queryHomeData();
      this.statisticsConfig = [];
      this.getStatisticsConfig();
    }
    // ??????????????????
    if (this.viewIndex === this.projectView) {
      this.statisticsConfig = [];
      this.getStatisticsConfig();
      this.projectViewMap();
    }
    // ??????????????????
    if (this.viewIndex === this.planView) {
      this.statisticsConfig = [];
      this.getStatisticsConfig();
      this.planViewMap();
    }
  }

  /**
   * ??????????????????
   */
  public locationClear(): void {
    // ????????????
    window.location.hash = 'business/index';
    // ????????????????????????????????????
    this.equipmentLocation = null;
    // ????????????????????????????????????
    this.deviceLocation = null;
    // ????????????????????????:?????????/?????????
    this.planOrProjectLocation = new PlanProjectModel();
    // ????????????????????????:??????????????????
    this.planOrProjectListLocation = null;
  }

  /**
   * ???????????????????????????
   */
  mapInit() {
    // ?????????????????????
    this.facilityNoticeArr = ['focusDevice', 'unFollowDevice'];
    this.mapType = MAP_TYPE;
    this.mapConfig = new MapConfig('index-map', this.mapType, mapIconConfig.defaultIconSize, []);
    // ?????????????????????
    this.$mapStoreService.mapType = this.mapType;
    // ??????????????????
    this.facilityIconSizeConfig = mapIconConfig.iconConfig;
    // ????????????????????????
    this.iconSize = mapIconConfig.defaultIconSize;
    // ?????????????????????
    this.facilityIconSizeValue = mapIconConfig.defaultIconSize;
    // ????????????
    this.checkUser();
  }

  /**
   * ???????????????????????????
   */
  viewMapChange() {
    // ??????????????????
    this.$MapCoverageService.showCoverage = this.mapTypeEnum.facility;
    // ??????????????????????????????
    this.$positionService.eventEmit.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value) {
        this.facilityCardLocation(value);
      }
    });
    // ????????????????????????????????????
    this.$selectPolymerizationService.eventEmit.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value) {
        if (value.polymerizationValue !== this.polymerizationChange) {
          if (this.polymerizationChange ===  '1') {
            this.$indexApiService.getProjectNames({}).subscribe(res => {
              if ( res.code === ResultCodeEnum.success) {
                this.$mapStoreService.planningSelectedResults = res.data.map(v => v.projectId);
              }
            });
          } else {
            this.$mapStoreService.planningSelectedResults = [];
          }
          // ???????????????????????????????????????
          this.mapShowRefresh();
          if (value.polymerizationValue === 'maintenance') {
            this.polymerizationChange = '1';
          } else {
            this.polymerizationChange = '2';
          }
        }
      }
    });
    // ???????????????????????????????????????????????????
    this.$facilityShowService.subject.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value.mapShowType) {
        // ??????????????????????????????
        if (this.mainMap.mapService.mapInstance) {
          this.mainMap.mapService.mapInstance.clearOverlays();
        }
        if (this.mainMap.mapService.markerClusterer) {
          this.mainMap.mapService.markerClusterer.clearMarkers();
        }
      }
      if (this.viewIndex === ViewEnum.maintenanceView) {
        // ?????????????????????
        this.mapShowRefresh();
      }
    });
    // ?????????????????????????????????????????????????????????????????????
    this.$filterConditionService.eventEmit.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value.refresh) {
        this.queryMapData();
      }
    });
    // ????????????????????????
    this.queryDeviceRole();
  }

  /**
   * ??????????????????
   */
  queryMapData() {
    // ??????????????????
    if (this.viewIndex === this.maintenanceView) {
      // ?????????????????????
      this.mapShowRefresh();
    }
    // ??????????????????
    if (this.viewIndex === this.projectView) {
      this.mapProjectRefresh();
    }
    // ??????????????????
    if (this.viewIndex === this.planView) {
      this.mapPlanRefresh();
    }
  }

  /**
   * ???????????????????????????
   */
  projectViewMap() {
    this.showProgressBar();
    if (!this.projectTypes) {
      // ??????????????????
      this.$mapStoreService.planningSelectedResults  = ['noData'];
    }
    if (this.$mapStoreService.planningSelectedResults[0] === ['noData'] ||
      this.$mapStoreService.smartPoleModelTreeSelectedResults[0] === 'noData' || this.$mapStoreService.constructionStatusSelectedResults[0] === 'noData'
    ) {
      this.planProjectCacheData([]);
      this.mainMap.mapService.locateToUserCity();
      this.hideProgressBar();
      // ??????????????????????????????
      if (this.mainMap.mapService.mapInstance) {
        this.mainMap.mapService.mapInstance.clearOverlays();
      }
      if (this.mainMap.mapService.markerClusterer) {
        this.mainMap.mapService.markerClusterer.clearMarkers();
      }
      return;
    }
    const data = {
      filterConditions: [
        {
          filterField: 'projectId',
          operator: 'in',
          filterValue: this.$mapStoreService.planningSelectedResults || []
        },
        {
          filterField: 'pointModel',
          operator: 'in',
          filterValue: this.$mapStoreService.smartPoleModelTreeSelectedResults[0] === 'noData' ? ['noData'] : this.$mapStoreService.smartPoleModelTreeSelectedResults[0] || []
        },
        {
          filterField: 'supplierId',
          operator: 'in',
          filterValue: this.$mapStoreService.smartPoleModelTreeSelectedResults[1] || []
        },
        {
          filterField: 'pointStatus',
          operator: 'in',
          filterValue: this.$mapStoreService.constructionStatusSelectedResults || []
        }
      ],
      bizCondition: {
        modelSupplier : this.$mapStoreService.projectModelData ? this.$mapStoreService.projectModelData : []
      }
    };
    this.$indexApiService.getProjectPolymerizationPoint(data).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success && result.data.projectData && result.data.longitude && result.data.latitude) {
        this.centerPoint = [result.data.longitude, result.data.latitude];
        this.planProjectCacheData(result.data.projectData);
        this.hideProgressBar();
      } else {
        this.planProjectCacheData([]);
        this.mainMap.mapService.locateToUserCity();
        this.hideProgressBar();
        // ??????????????????
        if (this.mainMap.mapService.mapInstance) {
          this.mainMap.mapService.mapInstance.clearOverlays();
        }
        if (this.mainMap.mapService.markerClusterer) {
          this.mainMap.mapService.markerClusterer.clearMarkers();
        }
      }
    }, () => {
      this.mainMap.mapService.locateToUserCity();
      this.hideProgressBar();
      // ??????????????????
      if (this.mainMap.mapService.mapInstance) {
        this.mainMap.mapService.mapInstance.clearOverlays();
      }
      if (this.mainMap.mapService.markerClusterer) {
        this.mainMap.mapService.markerClusterer.clearMarkers();
      }
    });
  }

  /**
   * ???????????????????????????
   */
  planViewMap() {
    this.showProgressBar();
    if (!this.planTypes) {
      // ??????????????????
      this.$mapStoreService.planningSelectedResults = ['noData'];
    }
    if (this.$mapStoreService.planningSelectedResults[0] === ['noData'] ||
      this.$mapStoreService.smartPoleModelTreeSelectedResults[0] === 'noData' || this.$mapStoreService.constructionStatusSelectedResults[0] === 'noData'
    ) {
      this.planProjectCacheData([]);
      this.mainMap.mapService.locateToUserCity();
      this.hideProgressBar();
      // ??????????????????
      if (this.mainMap.mapService.mapInstance) {
        this.mainMap.mapService.mapInstance.clearOverlays();
      }
      if (this.mainMap.mapService.markerClusterer) {
        this.mainMap.mapService.markerClusterer.clearMarkers();
      }
      return;
    }
    const data = {

      filterConditions: [
        {
          filterField: 'planId',
          operator: 'in',
          filterValue: this.$mapStoreService.planningSelectedResults || []
        },
        {
          filterField: 'pointModel',
          operator: 'in',
          filterValue: this.$mapStoreService.smartPoleModelSelectedResults || []
        },
        {
          filterField: 'pointStatus',
          operator: 'in',
          filterValue: this.$mapStoreService.constructionStatusSelectedResults || []
        }
      ]
    };

    this.$indexApiService.getPlanPolymerizationPoint(data).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success && result.data.planData && result.data.longitude && result.data.latitude) {
        this.centerPoint = [result.data.longitude, result.data.latitude];
        this.planProjectCacheData(result.data.planData);
        this.hideProgressBar();
      } else {
        this.planProjectCacheData([]);
        this.mainMap.mapService.locateToUserCity();
        this.hideProgressBar();
        // ??????????????????
        if (this.mainMap.mapService.mapInstance) {
          this.mainMap.mapService.mapInstance.clearOverlays();
        }
        if (this.mainMap.mapService.markerClusterer) {
          this.mainMap.mapService.markerClusterer.clearMarkers();
        }
      }
    }, () => {
      this.mainMap.mapService.locateToUserCity();
      this.hideProgressBar();
      // ??????????????????
      if (this.mainMap.mapService.mapInstance) {
        this.mainMap.mapService.mapInstance.clearOverlays();
      }
      if (this.mainMap.mapService.markerClusterer) {
        this.mainMap.mapService.markerClusterer.clearMarkers();
      }
    });
  }

  /**
   * ????????????????????????
   */
  getAllMapConfig() {
    // ???????????????????????????
    this.$mapService.getALLFacilityConfig().subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        // ??????????????????
        if (result.data && result.data.deviceIconSize) {
          this.facilityIconSizeValue = result.data.deviceIconSize;
          this.$mapStoreService.facilityIconSize = result.data.deviceIconSize;
          this.iconSize = result.data.deviceIconSize;
        }
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.$message.remove();
    });
  }


  /**
   * ??????????????????
   */
  viewLocation() {
    const type = this.$activatedRoute.snapshot.queryParams.type;
    const deviceId = this.$activatedRoute.snapshot.queryParams.deviceId;
    const equipmentId = this.$activatedRoute.snapshot.queryParams.equipmentId;
    if (type === ViewEnum.planView || type === ViewEnum.planViewList) {
      this.viewIndex = ViewEnum.planView;
      // ??????????????????
      this.mapPlanRefresh();
    } else if (type === ViewEnum.projectView || type === ViewEnum.projectViewList) {
      this.viewIndex = ViewEnum.projectView;
      // ??????????????????
      this.mapProjectRefresh();
    } else if (deviceId || equipmentId) {
      // ???????????????????????????????????????????????????
      this.viewIndex = ViewEnum.maintenanceView;
    }
  }

  /**
   * ??????????????????
   */
  otherLocation() {
    const type = this.$activatedRoute.snapshot.queryParams.type;
    const deviceId = this.$activatedRoute.snapshot.queryParams.deviceId;
    const equipmentId = this.$activatedRoute.snapshot.queryParams.equipmentId;
    this.$mapStoreService.locationProjectOrPlanId = null;
    if (type === ViewEnum.planView || type === ViewEnum.projectView) {
      const planOrProjectId = this.$activatedRoute.snapshot.queryParams.id;
      this.planOrProjectViewLocation();
      const current = type === ViewEnum.planView ? indexOperationalLeftPanel.planning : indexOperationalLeftPanel.projectFacilities;
      // ????????????????????????????????? ????????????????????????????????????
      this.indexOperationalDataComponent.tabClick(current);
      this.cdr.detectChanges(); // ???????????? ????????????????????????????????? ?????????model???????????? ?????????????????????
      // ??????????????????????????????id
      this.$mapStoreService.locationProjectOrPlanId = planOrProjectId;
    } else if (type === ViewEnum.planViewList || type === ViewEnum.projectViewList) {
      this.planProjectListViewLocation();
    } else if (deviceId || equipmentId) {
      // ??????/??????????????????
      this.deviceListLocation();
    }
  }


  /**
   * ?????????/???????????????
   */
  public planOrProjectViewLocation() {
    const xPosition = this.$activatedRoute.snapshot.queryParams.xPosition;
    const yPosition = this.$activatedRoute.snapshot.queryParams.yPosition;
    if (xPosition && yPosition) {
      this.planOrProjectLocation.lng = xPosition;
      this.planOrProjectLocation.lat = yPosition;
    }
  }

  public planProjectListViewLocation() {
    const id = this.$activatedRoute.snapshot.queryParams.id;
    const xPosition = this.$activatedRoute.snapshot.queryParams.xPosition;
    const yPosition = this.$activatedRoute.snapshot.queryParams.yPosition;
    this.planOrProjectListLocation.id = id;
    this.planOrProjectListLocation.lng = xPosition;
    this.planOrProjectListLocation.lat = yPosition;
  }


  /**
   * ??????/??????????????????
   */
  deviceListLocation() {
    const deviceId = this.$activatedRoute.snapshot.queryParams.deviceId;
    const equipmentId = this.$activatedRoute.snapshot.queryParams.equipmentId;
    if (deviceId) {
      this.$indexApiService.queryDeviceById(deviceId).subscribe((result: ResultModel<FacilitiesDetailsModel>) => {
        if (result.code === ResultCodeEnum.success && result.data) {
          this.convertInfo(result.data, MapTypeEnum.facility);
        }
      }, () => {
        this.$message.warning(this.indexLanguage.networkTips);
      });
    } else if (equipmentId) {
      this.$indexApiService.queryHomeEquipmentInfoById(equipmentId).subscribe((result: ResultModel<FacilitiesDetailsModel>) => {
        if (result.code === ResultCodeEnum.success && result.data) {
          this.convertInfo(result.data, MapTypeEnum.equipment);
        }
      }, () => {
        this.$message.warning(this.indexLanguage.networkTips);
      });
    } else {
      return;
    }
  }


  /**
   * ????????????
   * param data
   */
  public convertInfo(data, mapType): void {
    // ???????????????????????????
    const selectType = MapTypeEnum.facility === mapType;
    const centerPoint = data.positionBase.split(',');
    data['lng'] = +centerPoint[0];
    data['lat'] = +centerPoint[1];
    data['facilityType'] = selectType ? 'device' : 'equipment';
    this.$MapCoverageService.showCoverage = selectType ? this.mapTypeEnum.facility : this.mapTypeEnum.equipment;
    if (selectType) {
      this.deviceLocation = data;
      this.$positionFacilityShowService.eventEmit.emit({type: 'facility'});
    } else {
      this.equipmentLocation = data;
      this.$positionFacilityShowService.eventEmit.emit({type: 'equipment', equipmentType: data.equipmentType});
    }
  }


  /**
   * ???????????????
   */
  facilityCardLocation(value): void {
    if (this.viewIndex === this.maintenanceView && value.positionBase) {
      const a = value.positionBase.split(',');
      value.code = null;
      value.lng = +a[0];
      value.lat = +a[1];
      // ????????????
      if (this.$MapCoverageService.showCoverage === this.mapTypeEnum.facility) {
        // ??????????????????????????????Id?????????Id????????????????????????????????????
        value.facilityId = value.deviceId;
      } else {
        value.facilityId = value.equipmentId;
      }
    } else {
      value.id = value.pointId;
    }
    this.mainMap.locationById('', value);
  }

  /**
   * ????????????????????????
   */
  public checkUser(): void {
    // ???????????????????????????
    if (SessionUtil.getToken() !== this.$mapStoreService.token) {
      this.$mapStoreService.resetData();
      this.$mapStoreService.resetConfig();
      this.data = [];
    }
    this.$mapStoreService.token = SessionUtil.getToken();
  }


  /**
   * ??????????????????
   */
  public queryHomeData(): void {
    this.showProgressBar();
    // ???????????????
    if (this.$mapStoreService) {
      this.queryHomeDeviceArea().then(result => {
        this.listAreaByAreaCodeList(result).then(_result => {
          // ??????????????????
          this.queryAlarmListHome(result);
        });
      });
    } else {
      this.hideProgressBar();
    }
  }


  /**
   * ??????????????????
   */
  public queryHomeDeviceArea() {
    // ????????????????????????????????????
    const areaStoreData = this.$mapStoreService.areaSelectedResults || [];
    // ??????????????????????????????????????????
    if (this.$mapStoreService.facilityTypeSelectedResults.length) {
      this.facilityStoreData = [];
      this.$mapStoreService.facilityTypeSelectedResults.forEach(item => {
        this.$mapStoreService.showFacilityTypeSelectedResults.forEach(_item => {
          if (item === _item) {
            this.facilityStoreData.push(item);
          }
        });
      });
      if (!this.facilityStoreData.length && this.initMapDevice && this.$mapStoreService.showFacilityTypeSelectedResults &&
        this.$mapStoreService.showFacilityTypeSelectedResults && this.$mapStoreService.showFacilityTypeSelectedResults.length) {
        this.facilityStoreData = ['noData'];
      }
    } else {
      this.facilityStoreData = this.$mapStoreService.showFacilityTypeSelectedResults;
    }
    // ??????????????????????????????????????????
    if (this.$mapStoreService.equipmentTypeSelectedResults.length) {
      this.equipmentStoreData = [];
      this.$mapStoreService.equipmentTypeSelectedResults.forEach(item => {
        if (item === this.$mapStoreService.showEquipmentTypeSelectedResults[0]) {
          this.equipmentStoreData = [item];
        }
      });
      if (!this.equipmentStoreData.length) {
        this.equipmentStoreData = ['noData'];
      }
    } else {
      this.equipmentStoreData = this.$mapStoreService.showEquipmentTypeSelectedResults;
    }
    let requestHeader;
    if (this.$MapCoverageService.showCoverage === this.mapTypeEnum.facility) {
      // ????????????
      this.deviceAreaModel.polymerizationType = this.polymerizationChange;
      this.deviceAreaModel.filterConditions.area = areaStoreData ? areaStoreData : [];
      this.deviceAreaModel.filterConditions.projectId = this.$mapStoreService.planningSelectedResults || [];
      this.deviceAreaModel.filterConditions.device = this.facilityStoreData ? this.facilityStoreData : [];
      const testData = this.deviceAreaModel;
      this.$mapStoreService.polymerizationConfig = testData;
      requestHeader = this.$indexApiService.queryDevicePolymerizationList(testData);
    } else {

      // ????????????
      this.equipmentAreaModel.polymerizationType = '1';
      this.equipmentAreaModel.filterConditions.area = areaStoreData ? areaStoreData : [];
      this.equipmentAreaModel.filterConditions.equipment = this.equipmentStoreData ? this.equipmentStoreData : [];
      const testData = this.equipmentAreaModel;
      this.$mapStoreService.polymerizationConfig = testData;
      requestHeader = this.$mapService.queryEquipmentPolymerizationList(testData);
    }
    return new Promise((resolve, reject) => {
      // ?????????????????????
      requestHeader.subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          if (result.data.polymerizationData && result.data.polymerizationData.length && (this.deviceAreaModel.polymerizationType === '1' || this.equipmentAreaModel.polymerizationType === '1')) {
            const data = result.data;
            resolve(data);
            this.hideProgressBar();
          } else if (result.data.projectData && result.data.projectData.length && this.deviceAreaModel.polymerizationType === '2') {
            /**this.centerPoint = [result.data.polymerizationPointVO.longitude, result.data.polymerizationPointVO.latitude];*/
            this.centerPoint = result.data.positionCenter.split(',');
            this.planProjectCacheData(result.data.projectData);
            this.hideProgressBar();
          } else {
            this.cacheData([]);
            this.mainMap.mapService.locateToUserCity();
            this.hideProgressBar();
          }
        } else {
          this.mainMap.mapService.locateToUserCity();
          this.hideProgressBar();
        }
      }, () => {
        this.mainMap.mapService.locateToUserCity();
        this.hideProgressBar();
      });
    });
  }

  /**
   * ??????????????????????????????????????????
   */
  public listAreaByAreaCodeList(data) {
    return new Promise((resolve, reject) => {
      const areaList = data.polymerizationData.map(item => {
        return item.code;
      });
      this.$indexApiService.listAreaByAreaCodeList(areaList).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          resolve(result.data.map((item) => {
            return item.areaCode;
          }));
        }
      });
    });
  }

  /**
   * ????????????????????????
   */
  public queryAlarmListHome(data) {
    if (!data.polymerizationData.length) {
      this.mainMap.mapService.markerClusterer.clearMarkers();
      return;
    }
    this.centerPoint = data.positionCenter.split(',');
    const alarmData = new AlarmAreaModel();
    alarmData.filterConditions[0].filterField = this.$MapCoverageService.showCoverage === 'facility' ? 'alarm_device_type_id' : 'alarm_source_type_id';
    alarmData.filterConditions[0].filterValue = this.$MapCoverageService.showCoverage === 'facility' ? this.facilityStoreData : this.equipmentStoreData;
    this.$mapStoreService.alarmDataConfig = alarmData;
    this.cacheData(data.polymerizationData);
    this.hideProgressBar();
  }


  /**
   * ??????????????????????????????
   * param data
   */
  public cacheData(data): void {
    // ???????????????
    data.forEach(item => {
      if (item.positionCenter) {
        const position = item.positionCenter.split(',');
        item.lng = parseFloat(position[0]);
        item.lat = parseFloat(position[1]);
        delete item.positionCenter;
        if (this.$mapStoreService) {
          this.$mapStoreService.updateMarker(item, true);
        }
      }
    });
    // ??????????????????
    this.data = data;
    this.initMapDevice = true;
  }

  /**
   * ?????????????????????????????????
   * param data
   */
  public planProjectCacheData(data): void {
    // ???????????????
    data.forEach(item => {
      item.lng = parseFloat(item.longitude);
      item.lat = parseFloat(item.latitude);
      if (this.$mapStoreService) {
        this.$mapStoreService.updateMarker(item, true);
      }
    });
    // ??????????????????
    this.data = data;
  }

  /**
   * ?????????????????????
   */
  public showProgressBar(): void {
    this.percent = 0;
    this.increasePercent = 5;
    this.isShowProgressBar = true;
    this.scheduleTime = window.setInterval(() => {
      if (this.percent >= 100) {
        clearInterval(this.scheduleTime);
      } else {
        this.percent += this.increasePercent;
        if (this.percent === 50) {
          this.increasePercent = 2;
        } else if (this.percent === 80) {
          this.increasePercent = 1;
        } else if (this.percent === 99) {
          this.increasePercent = 0;
        }
      }
    }, 500);
  }

  /**
   * ?????????????????????
   */
  public hideProgressBar(): void {
    this.percent = 100;
    setTimeout(() => {
      this.isShowProgressBar = false;
    }, 1000);
  }


  /**
   * ?????????????????????
   * param target
   */
  public openPanel(event): void {
    // ???????????????
    this.isShowOpenFacilityPanel = false;
    // ????????????
    this.mainMap.closeRightClick();
    let request;
    if (event.facilityType === this.mapTypeEnum.device) {
      request = this.$indexApiService.getDeviceDetailCode({deviceType: event.facilityCode, deviceId: event.id});
      this.deviceLocation = null;
    }
    if (event.facilityType === this.mapTypeEnum.equipment) {
      request = this.$indexApiService.getEquipmentDetailCode({equipmentId: event.id});
      this.equipmentLocation = null;
    }
    // ????????????????????????????????????id
    request.subscribe((result: ResultModel<DetailCodeModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        const data = result.data || [];
        this.facilityPowerCode = data.map(item => item.id);
        if (this.facilityPowerCode.length) {
          setTimeout(() => {
            this.openFacilityCard();
          }, 50);
        } else {
          this.facilityPowerCode.push('detail');
          setTimeout(() => {
            this.openFacilityCard();
          }, 50);
        }
      }
    }, () => {
      this.$message.warning(this.indexLanguage.networkTips);
    });
    // ??????????????????
    this.isShowCard = true;
    // ??????????????????
    this.isExpandFacilityStatus = false;
    // ????????????????????????????????????
    this.ClickAllItems();
  }

  /**
   * ????????????????????????
   * param event
   */
  public openFacilityCard(): void {
    // ????????????
    this.isShowFacilityDetailTab = true;
    this.selectedIndex = indexFacilityPanel.facilityDetail;
    this.showFacilityPanel();
  }

  /**
   * ????????????????????????
   * param event
   */
  public closePanel(): void {
    this.hideFacilityPanel();
    this.hideClustererFacilityTable();
  }

  /**
   * ??????????????????
   * param event
   */
  public mapEvent(event): void {
    if (event.type === MapEventTypeEnum.mapClick || event.type === MapEventTypeEnum.mapDrag) {
      // ????????????????????????
      this.closePanel();
      this.mainMap.closeRightClick();
    } else if (event.type === MapEventTypeEnum.clickClusterer) {
      // ???????????????table
      this.clustererFacilityList = event.data;
      this.showClustererFacilityTable();
    } else if (event.type === MapEventTypeEnum.cityListControlStatus) {
      // ???????????????????????????
      if (event.value) {
        this.hideLeftComponents();
      } else {
        this.showLeftComponents();
      }
    } else if (event.type === MapEventTypeEnum.cityChange) {
      // ????????????
      this.showLeftComponents();
    } else if (event.type === MapEventTypeEnum.selected) {
      // ???????????????????????????????????????
      this.closePanel();
      if (event.id && event.facilityCode && event.facilityType) {
        this.facilityCode = event.facilityCode;
        this.facilityId = event.id;
        this.idData = event.idData;
        this.facilityName = event.name;
        this.openPanel(event);
      }
    } else if (event.type === MapEventTypeEnum.mapBlackClick) {
      // ???????????????????????????????????????
      this.closePanel();
    }
    /**else if (event.type === MapEventTypeEnum.mapDrag) {
      // ????????????
      this.closePanel();
      this.mainMap.closeRightClick();
    }
     */
  }


  /**
   * ??????????????????
   */
  public hideFacilityPanel(): void {
    this.isShowFacilityPanel = false;
    this.facilityId = null;
  }

  /**
   * ????????????????????????
   */
  queryDeviceRole() {
    // ????????????
    const procRole = WorkOrderStatusUtil.checkProcAuthority(this.$nzI18n) as SelectModel[];
    // ????????????/???????????????????????????
    this.deviceCount = SessionUtil.checkHasRole('07-2-1');
    // ????????????
    this.deviceStatus = SessionUtil.checkHasRole('07-2-2');
    // ??????????????????
    this.alarmCount = SessionUtil.checkHasRole('07-1-1');
    // ????????????
    this.alarmIncrement = SessionUtil.checkHasRole('07-1-5');
    // ????????????
    this.workIncrement = SessionUtil.checkHasRole('07-3-11');
    // ????????????TOP/????????????TOP
    this.topRole = SessionUtil.checkHasRole('07-8');
    // ????????????
    this.workerOrder = SessionUtil.checkHasRole('06') && procRole.length > 0;
  }


  /**
   * ?????????????????????????????????
   * param  label ??????
   * param  title ??????
   * param  type  ??????????????????
   * param  isShow ????????????
   */
  getStatisticsConfig(): void {
    // ??????????????????????????????????????????????????????????????????????????????
    this.isShowCard = false;
    // ??????????????????
    if (this.viewIndex === this.maintenanceView) {
      if (this.deviceCount) {
        if (SessionUtil.checkHasTenantRole('1-3-1')) {
          this.statisticsConfig.push({
            label: this.indexLanguage.card.deviceCount,
            title: this.indexLanguage.card.deviceCount,
            type: this.cardType.deviceCount,
            icon: this.cardIcon.deviceCount,
            isShow: false,
            isShowTitle: true,
            isOneType: 'other',
          });
        }
        if (SessionUtil.checkHasTenantRole('1-3-2')) {
          this.statisticsConfig.push({
            label: this.indexLanguage.card.typeCount,
            title: this.indexLanguage.card.dfTypeDeviceCount,
            type: this.cardType.typeCount,
            icon: this.cardIcon.typeCount,
            isShow: false,
            isShowTitle: true,
            isOneType: 'other',
          });
        }
      }
      if (this.deviceStatus && SessionUtil.checkHasTenantRole('1-3-3')) {
        this.statisticsConfig.push({
          label: this.indexLanguage.card.deviceStatus,
          title: this.indexLanguage.card.deviceStatus,
          type: this.cardType.deviceStatus,
          icon: this.cardIcon.deviceStatus,
          isShow: false,
          isShowTitle: true,
          isOneType: 'other',
        });
      }
      if (this.alarmCount && SessionUtil.checkHasTenantRole('1-3-4')) {
        this.statisticsConfig.push({
          label: this.indexLanguage.card.alarmCount,
          title: this.indexLanguage.card.currentAlarmCount,
          type: this.cardType.alarmCount,
          icon: this.cardIcon.alarmCount,
          isShow: false,
          isShowTitle: true,
          isOneType: 'other',
        });
      }
      if (this.alarmIncrement && SessionUtil.checkHasTenantRole('1-3-5')) {
        this.statisticsConfig.push({
          label: this.indexLanguage.card.alarmINC,
          title: this.indexLanguage.card.alarmIncrement,
          type: this.cardType.alarmIncrement,
          icon: this.cardIcon.alarmIncrement,
          isShow: false,
          isShowTitle: true,
          isOneType: 'other',
        });
      }
      if (this.workIncrement && SessionUtil.checkHasTenantRole('1-3-6')) {
        this.statisticsConfig.push({
          label: this.indexLanguage.card.workINC,
          title: this.indexLanguage.card.workIncrement,
          type: this.cardType.workIncrement,
          icon: this.cardIcon.workIncrement,
          isShow: false,
          isShowTitle: true,
          isOneType: 'other',
        });
      }
      if (this.topRole) {
        if (SessionUtil.checkHasTenantRole('1-3-7')) {
          this.statisticsConfig.push({
            label: this.indexLanguage.card.busyTop,
            title: this.indexLanguage.card.busyDeviceTop,
            type: this.cardType.busyTop,
            icon: this.cardIcon.busyTop,
            isShow: false,
            isShowTitle: true,
            isOneType: 'other',
          });
        }
        if (SessionUtil.checkHasTenantRole('1-3-8')) {
          this.statisticsConfig.push({
            label: this.indexLanguage.card.alarmTop,
            title: this.indexLanguage.card.alarmDeviceTop,
            type: this.cardType.alarmTop,
            icon: this.cardIcon.alarmTop,
            isShow: false,
            isShowTitle: true,
            isOneType: 'other',
          });
        }
      }
      if (this.workerOrder && SessionUtil.checkHasTenantRole('1-3-9')) {
        this.statisticsConfig.push({
          label: this.indexLanguage.card.workOrder,
          title: this.indexLanguage.card.workOrder,
          type: this.cardType.workOrder,
          icon: this.cardIcon.workOrder,
          isShow: false,
          isShowTitle: true,
          isOneType: 'workOrder',
          isShowSelect: true
        });
      }
      if (SessionUtil.checkHasTenantRole('1-3-10')) {
        this.statisticsConfig.push({
          label: this.indexLanguage.card.equipmentOnlineRate,
          title: this.indexLanguage.card.equipmentOnlineRate,
          type: this.cardType.equipmentOnlineRate,
          icon: this.cardIcon.equipmentOnlineRate,
          isShow: false,
          isOneType: 'device',
          isShowTitle: true,
        });
      }
      if (SessionUtil.checkHasTenantRole('1-3-11')) {
        this.statisticsConfig.push({
          label: this.indexLanguage.card.equipmentEnergy,
          title: this.indexLanguage.card.equipmentEnergy,
          type: this.cardType.equipmentEnergyConsumption,
          icon: this.cardIcon.equipmentEnergy,
          isShow: false,
          isOneType: 'device',
          isShowTitle: true,
        });
      }
      if (SessionUtil.checkHasTenantRole('1-3-12')) {
        this.statisticsConfig.push({
          label: this.indexLanguage.card.equipmentTransmissionEfficiency,
          title: this.indexLanguage.card.equipmentTransmissionEfficiency,
          type: this.cardType.equipmentTransmissionEfficiency,
          icon: this.cardIcon.equipmentTransmissionEfficiency,
          isShow: false,
          isOneType: 'device',
          isShowTitle: true,
        });
      }
      if (SessionUtil.checkHasTenantRole('1-3-13')) {
        this.statisticsConfig.push({
          label: this.indexLanguage.card.faultType,
          title: this.indexLanguage.card.faultType,
          type: this.cardType.faultType,
          icon: this.cardIcon.faultType,
          isShow: false,
          isOneType: 'device',
          isShowTitle: true,
        });
      }
      if (SessionUtil.checkHasTenantRole('1-3-14')) {
        this.statisticsConfig.push({
          label: this.indexLanguage.card.failureRateAnalysis,
          title: this.indexLanguage.card.failureRateAnalysis,
          type: this.cardType.failureRateAnalysis,
          icon: this.cardIcon.failureRateAnalysis,
          isShow: false,
          isOneType: 'device',
          isShowTitle: true,
        });
      }
    }
    // ??????????????????
    if (this.viewIndex === this.projectView) {
      if (SessionUtil.checkHasTenantRole('2-2-1')) {
        this.statisticsConfig.push({
          label: this.indexLanguage.projectBuildStatus,
          title: this.indexLanguage.projectBuildStatus,
          type: this.cardType.project,
          icon: this.cardIcon.workOrder,
          isShow: false,
          isShowTitle: true,
          isOneType: 'other',
        });
      }
    }
    // ??????????????????
    if (this.viewIndex === this.planView) {
      if (SessionUtil.checkHasTenantRole('3-2-1')) {
        this.statisticsConfig.push({
          label: this.indexLanguage.planDataStatistics,
          title: this.indexLanguage.planDataStatistics,
          type: this.cardType.planning,
          icon: this.cardIcon.workOrder,
          isShow: false,
          isShowTitle: true,
          isOneType: 'other',
        });
      }
    }
  }

// ????????????????????????????????????
  public ClickAllItems(): void {
    // ????????????????????????
    if (this.isShowFacilityPanel) {
      this.closePanel();
    }
    // ??????????????????
    this.isExpandFacilityStatus = false;
    // ??????????????????????????????
    this.statisticsConfig.forEach(_item => _item.isShow = !this.isShowCard);
    this.isShowCard = !this.isShowCard;
    this.OpenCardDevice();
  }

  // ???????????????????????????
  statisticsItemClick(item): void {
    // ????????????????????????
    if (this.isShowFacilityPanel) {
      this.closePanel();
    }
    // ??????????????????
    this.isExpandFacilityStatus = false;
    // ????????????
    if (item.isShow && this.isShowCard) {
      this.isShowCard = !this.isShowCard;
    }
    // ????????????
    if (!item.isShow && item.type !== 0) {
      // ??????????????????
      this.statisticsConfig[0].isShow = true;
      item.isShow = true;
    } else {
      item.isShow = !item.isShow;
    }
    this.OpenCardDevice();
  }

  /**
   * ???????????????????????????
   */
  OpenCardDevice() {
    let num = 0;
    this.statisticsConfig.forEach(__item => {
      if (__item.isOneType === 'device') {
        __item.isShowTitle = false;
        __item.isShowSelect = false;
      }
    });
    this.statisticsConfig.forEach(_item => {
      if (_item.isShow) {
        if ((_item.isOneType === 'device') && (num === 0)) {
          num = 1;
          _item.isShowTitle = true;
          _item.isShowSelect = true;
        } else if ((_item.isOneType === 'device') && (num !== 0)) {
          _item.isShowTitle = false;
          _item.isShowSelect = false;
        }
      }
    });
  }

  /**
   * ??????????????????modal
   */
  openMapSettingModal(): void {
    const modal = this.$modal.create({
      nzTitle: this.indexLanguage.mapConfigTitle,
      nzContent: this.MapConfigTemp,
      nzOkType: 'danger',
      nzMaskClosable: false,
      nzClassName: 'custom-create-modal',
      nzOnCancel: () => {
        // ?????????????????????
        this.facilityIconSizeConfig = mapIconConfig.iconConfig;
        this.facilityIconSizeValue = this.$mapStoreService.facilityIconSize;
        modal.destroy();
      },
      nzFooter: [
        {
          label: this.commonLanguage.confirm,
          onClick: () => {
            // ???????????????????????????????????????????????????
            this.modifyMapConfig(modal);
            this.isShowFacilityPanel = false;
          }
        },
        {
          label: this.commonLanguage.cancel,
          type: 'danger',
          onClick: () => {
            // ?????????????????????
            this.facilityIconSizeConfig = mapIconConfig.iconConfig;
            this.facilityIconSizeValue = this.$mapStoreService.facilityIconSize;
            modal.destroy();
          }
        },
      ]
    });
  }

  /**
   * ??????????????????
   */
  modifyMapConfig(modal): void {
    const data = {configValue: this.facilityIconSizeValue};
    this.$message.loading(this.commonLanguage.saving);
    this.$mapService.modifyFacilityIconSize(data).subscribe((result: ResultModel<any>) => {
      // ????????????data????????????????????????
      if (result.code !== ResultCodeEnum.success) {
        this.$message.remove();
        this.$message.error(result.msg);
        return;
      }
      this.$message.remove();
      this.$message.success(this.commonLanguage.operateSuccess);
      if (this.$mapStoreService.facilityIconSize !== this.facilityIconSizeValue) {
        this.$mapStoreService.facilityIconSize = this.facilityIconSizeValue;
        this.iconSize = this.facilityIconSizeValue;
      }
      setTimeout(() => {
        modal.destroy();
        this.$message.remove();
      }, 500);
    }, () => {
      this.$message.remove();
    });
  }

  /**
   * ??????????????????
   */
  viewRole() {
    if (this.maintenanceShow) {
      this.viewIndex = ViewEnum.maintenanceView;
    }
    if (!this.maintenanceShow && this.projectShow && this.projectTypes) {
      this.viewIndex = ViewEnum.projectView;
      this.projectViewMap();
    }
    if (!this.maintenanceShow && !this.projectShow && this.projectTypes && this.planShow && this.planTypes) {
      this.viewIndex = ViewEnum.planView;
      this.planViewMap();
    }
    let view = 0;
    if (this.maintenanceShow) {
      view++;
    }
    if (this.projectShow && this.projectRole) {
      view++;
    }
    if (this.planShow && this.planRole) {
      view++;
    }
    if (view <= 1) {
      this.viewShow = false;
    }
  }

  public noFaultTypeEmitter(event) {
    this.noFaultType = event;
  }

  public noFailureRateAnalysisEmitter(event) {
    this.noFailureRateAnalysis = event;
  }

  public selectEquipmentEmitter(event) {
    this.selectEquipmentData = event;
  }

}
