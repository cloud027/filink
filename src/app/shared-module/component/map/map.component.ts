import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import * as lodash from 'lodash';
import {CommonUtil} from '../../util/common-util';
import {NzI18nService} from 'ng-zorro-antd';
import {IndexLanguageInterface} from '../../../../assets/i18n/index/index.language.interface';
import {CommonLanguageInterface} from '../../../../assets/i18n/common/common.language.interface';
import {Router} from '@angular/router';
import {MapConfig} from './map.config';
import {MapConfig as BMapConfig} from './b-map.config';
import {InspectionLanguageInterface} from '../../../../assets/i18n/inspection-task/inspection.language.interface';
import {FacilityLanguageInterface} from '../../../../assets/i18n/facility/facility.language.interface';
import {FacilityService} from '../../../core-module/api-service/facility/facility-manage';
import {FiLinkModalService} from '../../service/filink-modal/filink-modal.service';
import {MapStoreService} from '../../../core-module/store/map.store.service';
import {BMAP_ARROW, BMAP_DRAWING_POLYLINE} from '../map-selector/map.config';
import {MapCoverageService} from '../../service/index/map-coverage.service';
import {QueryConditionModel} from '../../model/query-condition.model';
import {TableConfigModel} from '../../model/table-config.model';
import {ResultModel} from '../../model/result.model';
import {PageModel} from '../../model/page.model';
import {ResultCodeEnum} from '../../enum/result-code.enum';
import {AreaFacilityDataModel, AreaFacilityModel} from '../../../business-module/index/shared/model/area-facility-model';
import {CloseShowFacilityService} from '../../service/index/close-show-facility.service';
import {FacilityShowService} from '../../service/index/facility-show.service';
import {OtherLocationService} from '../../service/index/otherLocation.service';
import {SelectGroupService} from '../../service/index/select-group.service';
import {LanguageEnum} from '../../enum/language.enum';
import {FacilityForCommonUtil} from '../../../core-module/business-util/facility/facility-for-common.util';
import {MapService} from '../../../core-module/api-service/index/map';
import {SessionUtil} from '../../util/session-util';
import {AdjustCoordinatesService} from '../../service/index/adjust-coordinates.service';
import {MapLinePointUtil} from '../../util/map-line-point-util';
import {MapCommon} from './map-common';
import {FacilitiesDetailsModel} from '../../../core-module/model/index/facilities-details.model';
import {FilinkMapEnum, MapTypeEnum, TipWindowType} from '../../enum/filinkMap.enum';
import {takeUntil} from 'rxjs/operators';
import {IndexApiService} from '../../../business-module/index/service/index/index-api.service';
import {ViewEnum} from '../../../core-module/enum/index/index.enum';
import {PointStatusEnum} from '../../../core-module/enum/plan/point-status.enum';
// ???????????????BMap???????????????????????????BMap
declare let BMap: any;
declare let BMapLib: any;
declare let google: any;
declare let MarkerClusterer: any;


/**
 * ????????????
 */
@Component({
  selector: 'xc-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent extends MapCommon implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  // ????????????
  @Input() mapConfig: MapConfig;
  // ????????????
  @Input() viewIndex: string;
  // ?????????
  @Input() centerPoint: string;
  // ????????????????????????????????????
  @Input() equipmentLocation;
  // ????????????????????????????????????
  @Input() deviceLocation;
  // ????????????????????????:?????????/?????????
  @Input() planOrProjectLocation;
  // ????????????????????????:??????/??????????????????
  @Input() planOrProjectListLocation;
  // ??????????????????????????????
  @Input() polymerizationChange = '1';
  // ????????????   18-24
  @Input() iconSize: string;
  //  ????????????
  @Input() areaData: any[];
  // ????????????????????????
  @Input() data: [];
  // ???????????????????????????
  @Input() equipmentTypeArr: string[];
  // ??????????????????
  @Output() showProgressBar = new EventEmitter();
  // ??????????????????
  @Output() hideProgressBar = new EventEmitter();
  // ??????????????????
  @Output() mapEvent = new EventEmitter<any>();

  // ??????????????????
  @ViewChild('equipmentNameTemp') equipmentNameTemp: TemplateRef<any>;
  // ???????????????
  @ViewChild('radioTemp') radioTemp: TemplateRef<any>;
  // ???????????????
  @ViewChild('tplFooter') public tplFooter;
  // ????????????
  @ViewChild('map') map: ElementRef;

  // ?????????????????????
  public pageBean: PageModel = new PageModel(10, 1, 1);
  // ????????????
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // ?????????
  public InspectionLanguage: InspectionLanguageInterface;
  // ???????????????
  public commonLanguage: CommonLanguageInterface;
  // ???????????????
  public indexLanguage: IndexLanguageInterface;
  // ???????????????????????????
  public areaFacilityModel: AreaFacilityDataModel = new AreaFacilityDataModel;
  // ????????????
  public equipmentTableConfig: TableConfigModel;
  // ?????????
  public language: FacilityLanguageInterface;
  // ????????????
  public tableConfig: TableConfigModel;
  // ??????????????????????????????
  public isShowInfoWindow: boolean = false;
  // ?????????????????????????????????
  public isShowTableWindow: boolean = false;
  // ?????????????????????
  public loadingAlarm: boolean = false;
  // ???????????????
  public loadingEquipment: boolean = false;
  // ?????????????????????????????????
  public lastCreatedEquipmentPoint: any[] = [];
  // ????????????????????????
  public isLocation: boolean = false;
  // ????????????
  public drawType: string = BMAP_ARROW;
  // ?????????????????????????????????
  public lastCreatedPoint: any[] = [];
  // ????????????
  public windowType = TipWindowType;
  // ????????????/????????????
  public mapTypeEnum = MapTypeEnum;
  // ??????????????????
  public addressInputValue: string;
  // ??????????????????
  public searchTypeName: string;
  // ?????????????????????
  public infoWindowLeft = '0';
  // ?????????????????????
  public infoWindowTop = '0';
  // ????????????
  public inputValue: string;
  // ?????????
  public options = [];
  // ????????????
  public IndexObj = {
    facilityNameIndex: 1,
    bMapLocationSearch: -1,
    gMapLocationSearch: -1,
  };
  // ????????????????????????
  public areaPoint: any;
  // ???????????????
  public targetMarker;
  // ?????????
  public timer: any;
  // ????????????
  public _iconSize;
  // ????????????
  public mapService;
  // ?????????
  public infoData = {
    type: '',
    data: null
  };
  // ??????marker?????????
  public fn: any;
  // ??????marker?????????
  public en: any;
  // ???????????????????????????
  public cb: any;
  // ??????????????????
  public maxZoom: number;
  // ??????????????????
  public defaultZoom: number;
  // ?????????????????????????????????
  public searchKey: string = '';
  // ????????????id
  public mapTypeId: string;
  // ????????????
  public mapType: string;
  // ??????????????????
  public areaDataMap = new Map();
  // ???????????????????????????
  public isVisible = false;
  // ????????????
  public title: string;
  // ????????????????????????
  public _dataSet = [];
  // ??????ID
  public selectedAlarmId = null;
  // ????????????
  public typeLg: string;
  // ?????????????????????
  public equipmentDataList;
  // ?????????????????????
  public deviceDataList;
  // ????????????
  public setData = [];
  // ????????????????????????
  public equipmentList: string[] = [];
  // ????????????????????????
  public deviceList: string[] = [];
  // ??????????????????????????????
  public mapCloneData: any;
  // ??????????????????
  public mapDrawUtil: any;
  // ???????????????
  public overlays = [];
  // ????????????????????????
  public indexType: string;
  // ?????????????????????????????????
  public selectOption: Array<{ label: string, value: number }> = [];
  // ??????????????????????????????
  public queryConditions = [];
  // ??????????????????????????????
  public equipmentListData: Array<FacilitiesDetailsModel> = [];
  // ????????????
  public locationArea: string[];
  // ??????Id
  public locationId: string;
  // ???????????????
  public locationType: boolean = false;
  // ????????????
  public roleAlarm: boolean = false;
  public selectGroup: boolean = false;
  public adjustCoordinates: boolean = false;
  public polylineSet: any;
  public coordinatesData = [];
  // ????????????????????????
  public points = [];
  // ?????????????????????
  public areaCenterModel: AreaFacilityModel = new AreaFacilityModel;
  // ??????????????????
  public useDrag: boolean = false;
  // ???????????????????????????marker????????????
  public clearArr = [];
  // ?????????map?????????marker????????????
  public lastArr;
  // ??????????????????????????????????????????
  public cacheMapData = [];
  // ??????????????????????????????marker????????????
  public dragMarkerList = [];
  // ??????????????????????????????marker????????????
  public batchMarkerList = [];
  // ????????????
  public maintenanceView = ViewEnum.maintenanceView;
  // ????????????
  public projectView = ViewEnum.projectView;
  // ????????????
  public planView = ViewEnum.planView;

  /**
   * ?????????????????????
   */
  queryInputName = lodash.debounce((value) => {
    // ????????????
    if (this.viewIndex === this.maintenanceView) {
      this.queryDeviceByName(value);
    }
    // ????????????
    if (this.viewIndex === this.planView) {
      this.queryDeviceByNameOfPlan(value);
    }
    // ????????????
    if (this.viewIndex === this.projectView) {
      this.queryDeviceByNameOfProject(value);
    }
  }, 500, {leading: false, trailing: true});


  constructor(public $nzI18n: NzI18nService,
              public $mapStoreService: MapStoreService,
              public $router: Router,
              public $facilityService: FacilityService,
              public $modalService: FiLinkModalService,
              public $mapCoverageService: MapCoverageService,
              public $indexMapService: MapService,
              public $selectGroupService: SelectGroupService,
              public $adjustCoordinatesService: AdjustCoordinatesService,
              public $facilityShowService: FacilityShowService,
              public $message: FiLinkModalService,
              public $otherLocationService: OtherLocationService,
              public $closeShowFacilityService: CloseShowFacilityService,
              public $mapLinePointUtil: MapLinePointUtil,
              public $indexApiService: IndexApiService
  ) {
    super($nzI18n, $mapStoreService, $mapCoverageService,
      $indexMapService, $selectGroupService, $adjustCoordinatesService,
      $message, $closeShowFacilityService, $mapLinePointUtil, $indexApiService);
  }

  ngOnInit() {
    // ??????????????????
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.InspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    // ????????????
    this.typeLg = JSON.parse(localStorage.getItem('localLanguage'));
    // ??????????????????
    this.roleAlarm = SessionUtil.checkHasRole('02');
    this.searchTypeName = this.indexLanguage.searchDeviceName;
    this.mapTypeId = 'roadmap';
    this.title = this.indexLanguage.chooseFibre;
    // ????????????????????????
    this.indexType = this.$mapCoverageService.showCoverage;
    // ?????????????????????
    this.changChooseUtil();
    // ?????????????????????????????????
    this.adjustCoordinatesUtil();
  }

  ngAfterViewInit(): void {
    if (!this.mapConfig) {
      // ???????????????????????????
      return;
    }
    if (!this.mapConfig.mapId) {
      // ?????????id
    } else {
      this.map.nativeElement.setAttribute('id', this.mapConfig.mapId);
    }
    this.mapType = this.mapConfig.mapType;
    if (this.mapType === FilinkMapEnum.baiDu) {
      this.initBMap();
    } else {
      // ????????????????????????
    }
    // ?????????????????????
    this.initFn();
    // ?????????????????????
    this.initAreaPoint();

    // ??????????????????????????????
    this.indexType = this.$mapCoverageService.showCoverage;
    // ??????????????????????????????????????????????????????
    if (this.indexType === null) {
      this.indexType = this.mapTypeEnum.facility;
    }
    // ?????????????????????????????????????????????????????????
    this.$facilityShowService.subject.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value.mapShowType) {
        this.indexType = value.mapShowType;
        // ?????????????????????????????????????????????
        this.clearSearch();
        if (this.indexType === this.mapTypeEnum.facility) {
          this.searchTypeName = this.indexLanguage.searchDeviceName;
        } else {
          this.searchTypeName = this.indexLanguage.equipmentName;
        }
        // ?????????????????????????????????????????????
        this.clearSearch();
      }
      // ????????????????????????
      if (value.deviceType) {
        this.deviceList = value.deviceType;
      }
      // ????????????????????????
      if (value.equipmentType) {
        this.equipmentList = value.equipmentType;
      }
      // ????????????????????????
      this.isLocation = false;
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    // ?????????????????????????????????????????????
    this.mapPositioning(changes);
    if (this.mapService && changes.iconSize && changes.iconSize.currentValue) {
      this.setIconSize(changes.iconSize.previousValue);
    }
    if (changes.areaData && changes.areaData.currentValue) {

      this.setAreaDataMap();
    }
  }

  ngOnDestroy(): void {
    if (this.mapService) {
      this.clearDeviceListData();
      if (this.mapService.mapInstance) {
        this.mapService.mapInstance.clearOverlays();
      }
      if (this.mapService.markerClusterer) {
        this.mapService.markerClusterer.clearMarkers();
      }
      this.mapService.clearMarkerMap();
      this.mapService.destroy();
    }
    this.destroy$.next();
    this.destroy$.complete();
    this.zoomEnd.cancel();
  }

  /**
   * ?????????????????????
   */
  public areaClickEvent(event, markers): void {
    this.areaCenterSetInformation(event);
    let facilityStoreData = [];
    let equipmentStoreData = [];
    // ??????????????????????????????????????????
    if (this.$mapCoverageService.showCoverage === this.mapTypeEnum.facility) {
      if (this.$mapStoreService.facilityTypeSelectedResults.length) {
        this.$mapStoreService.facilityTypeSelectedResults.forEach(item => {
          this.$mapStoreService.showFacilityTypeSelectedResults.forEach(_item => {
            if (item === _item) {
              facilityStoreData.push(item);
            }
          });
        });
        if (!facilityStoreData.length) {
          facilityStoreData = ['noData'];
        }
      } else {
        facilityStoreData = this.$mapStoreService.showFacilityTypeSelectedResults;
      }
      this.areaCenterModel.filterConditions.device = facilityStoreData;
      // ???????????????????????????
      this.$indexMapService.queryDevicePolymerizationsPointCenter(this.areaCenterModel).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success && result.data && result.data.positionCenter) {
          this.deviceDataList = result.data || [];
          const centerPoint = this.deviceDataList.positionCenter.split(',');
          this.mapService.setCenterAndZoom(centerPoint[0], centerPoint[1], BMapConfig.deviceZoom);
        }
      }, () => {
        this.$message.warning(this.indexLanguage.networkTips);
      });
    } else {
      // ??????????????????????????????????????????
      if (this.$mapStoreService.equipmentTypeSelectedResults.length) {
        equipmentStoreData = ['noData'];
        this.$mapStoreService.equipmentTypeSelectedResults.forEach(item => {
          if (item === this.$mapStoreService.showEquipmentTypeSelectedResults[0]) {
            equipmentStoreData = [item];
          }
        });
      } else {
        equipmentStoreData = this.$mapStoreService.showEquipmentTypeSelectedResults;
      }
      this.areaCenterModel.filterConditions.equipment = equipmentStoreData ? equipmentStoreData : [];
      // ???????????????????????????
      this.queryEquipmentAreaCenterPoint();
    }
  }


  /**
   * ?????????????????????
   */
  public projectClickEvent(event, markers, polymerization?): void {
    // ??????????????????cod
    const project = event.target.customData.code;
    let pointStatus = [];
    if (polymerization && polymerization === '2') {
      pointStatus = [PointStatusEnum.hasBeenBuilt];
    } else {
      pointStatus = Object.values(PointStatusEnum);
    }
    const data = {
      filterConditions: [
        {
          filterField: 'projectId',
          operator: 'in',
          filterValue: [project]
        },
        {
          filterField: 'pointStatus',
          operator: 'in',
          filterValue: pointStatus
        },
        // polymerizationType ???2 ???????????????????????? ???????????????????????????
        {
          filterField: 'polymerizationType',
          operator: 'in',
          filterValue: ['2'],
        }
      ]
    };
    if (this.polymerizationChange === '2') {
      const param: AreaFacilityModel = new AreaFacilityModel();
      param.polymerizationType = '2';
      param.filterConditions.projectId = [project];
      this.$indexMapService.queryDevicePolymerizationsPointCenter(param).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success && result.data) {
          const centerPoint = result.data.positionCenter.split(',');
          this.mapService.setCenterAndZoom(centerPoint[0], centerPoint[1], BMapConfig.deviceZoom);
        } else {
          this.$message.warning(result.msg);
        }
      }, () => {
        this.$message.warning(this.indexLanguage.networkTips);
      });
    } else {
      this.$indexMapService.getProjectPolymerizationPointCenter(data).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success && result.data) {
          this.mapService.setCenterAndZoom(result.data.longitude, result.data.latitude, BMapConfig.deviceZoom);
        } else {
          this.$message.warning(result.msg);
        }
      }, () => {
        this.$message.warning(this.indexLanguage.networkTips);
      });
    }
  }


  /**
   * ?????????????????????
   */
  public planClickEvent(event, markers): void {
    // ??????????????????cod
    const planCode = event.target.customData.code;
    const data = {
      filterConditions: [
        {
          filterField: 'planId',
          operator: 'in',
          filterValue: [planCode]
        },
      ]
    };
    this.$indexMapService.getPlanPolymerizationPointCenter(data).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success && result.data) {
        this.mapService.setCenterAndZoom(result.data.longitude, result.data.latitude, BMapConfig.deviceZoom);
      } else {
        this.$message.warning(result.msg);
      }
    }, () => {
      this.$message.warning(this.indexLanguage.networkTips);
    });
  }


  /**
   * ??????????????????????????????
   * param event
   * param data
   */
  public itemMouseOver(event, data): void {
    this.equipmentWindow(data);
  }

  /**
   * ??????????????????????????????
   * param event
   */
  public itemMouseOut(event): void {
    this.isShowInfoWindow = false;
  }

  /**
   * ??????iconSize
   * param previousValue
   */
  public setIconSize(previousValue): void {
    const size = this.iconSize.split('-');
    this._iconSize = this.mapService.createSize(size[0], size[1]);
    if (this.mapService && previousValue && previousValue !== this.iconSize) {
      this.mapService.changeAllIconSize(this.iconSize);
    }
  }


  /**
   * ????????????????????????????????????????????????
   */
  public getWindowAreaDatalist() {
    // ??????????????????
    if (this.viewIndex === ViewEnum.maintenanceView) {
      if (this.$mapCoverageService.showCoverage === this.mapTypeEnum.facility) {
        return this.getMapDeviceData();
      } else {
        return this.getMapEquipmentData();
      }
    }
    // ??????????????????
    if (this.viewIndex === ViewEnum.projectView) {
      return this.getProjectDeviceData();
    }
    // ??????????????????
    if (this.viewIndex === ViewEnum.planView) {
      return this.getPlanDeviceData();
    }
  }

  /**
   * ???????????????
   */
  public getMapDeviceData(area?) {
    this.areaFacilityModel = new AreaFacilityDataModel;
    // ?????????????????????
    this.points = this.getWindowIsArea();
    const areaStoreData = this.$mapStoreService.areaSelectedResults || [];
    // ??????????????????????????????????????????
    let facilityStoreData = [];
    if (this.$mapStoreService.facilityTypeSelectedResults.length) {
      this.$mapStoreService.facilityTypeSelectedResults.forEach(item => {
        this.$mapStoreService.showFacilityTypeSelectedResults.forEach(_item => {
          if (item === _item) {
            facilityStoreData.push(item);
          }
        });
      });
      if (!facilityStoreData.length) {
        facilityStoreData = ['noData'];
      }
    } else {
      facilityStoreData = this.$mapStoreService.showFacilityTypeSelectedResults;
    }
    this.areaFacilityModel.filterConditions.area = areaStoreData ? areaStoreData : [];
    this.areaFacilityModel.filterConditions.device = facilityStoreData;
    this.areaFacilityModel.filterConditions.group = [];
    this.areaFacilityModel.polymerizationType = '1';
    this.areaFacilityModel.points = this.points;
    return this.queryDevicePolymerizations(this.areaFacilityModel, area);
  }


  /**
   * ?????????????????????
   */
  public queryDevicePolymerizations(areaFacility, area?) {
    return new Promise((resolve, reject) => {
      this.$indexMapService.queryDevicePolymerizations(areaFacility).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success && result.data && result.data.positionCenter) {
          this.deviceDataList = result.data || [];
          // ????????????????????????
          this.deviceDataList.deviceData.forEach(item => {
            const devicePoint = item.positionBase.split(',');
            item['facilityId'] = item.deviceId;
            item['lng'] = +devicePoint[0];
            item['lat'] = +devicePoint[1];
            item['cloneCode'] = item.code;
            item['code'] = null;
            item['equipmentList'] = [];
            item['facilityType'] = 'device';
            item['show'] = true;
          });
          this.cacheMapData = lodash.cloneDeep(this.deviceDataList.deviceData);
          // ???????????????
          if (this.mapService.mapInstance) {
            this.mapService.mapInstance.clearOverlays();
          }
          if (this.mapService.markerClusterer) {
            this.mapService.markerClusterer.clearMarkers();
          }
          // ?????????
          this.lastArr = this.addMarkers(this.deviceDataList.deviceData);
          // ???????????????????????????????????????
          resolve([]);
        }
      }, () => {
        this.$message.warning(this.indexLanguage.networkTips);
      });
    });
  }

  /**
   * ???????????????
   */
  public getMapEquipmentData(area?) {
    this.$mapStoreService.mapEquipmentList = [];
    this.areaFacilityModel = new AreaFacilityDataModel;
    // ?????????????????????
    this.points = this.getWindowIsArea();
    // ????????????????????????????????????
    const areaStoreData = this.$mapStoreService.areaSelectedResults || [];
    // ??????????????????????????????????????????
    let equipmentStoreData;
    if (this.$mapStoreService.equipmentTypeSelectedResults.length) {
      equipmentStoreData = ['noData'];
      this.$mapStoreService.equipmentTypeSelectedResults.forEach(item => {
        if (item === this.$mapStoreService.showEquipmentTypeSelectedResults[0]) {
          equipmentStoreData = [item];
        }
      });
    } else {
      equipmentStoreData = this.$mapStoreService.showEquipmentTypeSelectedResults;
    }
    this.areaFacilityModel.polymerizationType = '1';
    this.areaFacilityModel.points = this.points;
    this.areaFacilityModel.filterConditions.area = areaStoreData ? areaStoreData : [];
    this.areaFacilityModel.filterConditions.equipment = equipmentStoreData ? equipmentStoreData : [];
    this.areaFacilityModel.filterConditions.group = [];
    return new Promise((resolve, reject) => {
      this.$indexMapService.queryEquipmentPolymerizations(this.areaFacilityModel).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success && result.data && result.data.positionCenter) {
          this.equipmentDataList = result.data || [];
          // ??????????????????
          this.equipmentDataList.equipmentData.forEach((item, index) => {
            if (item.length > 1) {
              this.equipmentDataList.equipmentData[index] = FacilityForCommonUtil.equipmentStatusSort(item);
            }
          });

          this.equipmentDataList.equipmentData.forEach(item => {
            item.forEach((_item, index) => {
              const equipmentPoint = _item.positionBase.split(',');
              _item['facilityId'] = _item.equipmentId;
              _item['lng'] = +equipmentPoint[0];
              _item['lat'] = +equipmentPoint[1];
              _item['cloneCode'] = item.areaCode;
              _item['code'] = null;
              _item['facilityType'] = 'equipment';
              if (index === 0) {
                _item['show'] = true;
              } else {
                _item['show'] = false;
              }
            });
          });

          this.equipmentDataList.equipmentData.forEach((item, index) => {
            const arr = CommonUtil.deepClone(item);
            item.forEach((_item) => {
              if (_item.show === true) {
                _item.equipmentList = arr;
              }
            });
          });


          // ????????????????????????????????????
          lodash.flattenDeep(this.equipmentDataList.equipmentData).forEach(item => {
            this.$mapStoreService.mapEquipmentList.push(item);
          });
          let equipmentData = this.$mapStoreService.mapEquipmentList;
          equipmentData = lodash.uniqBy(equipmentData, 'equipmentId');
          equipmentData = lodash.uniqBy(equipmentData, 'positionBase');
          // ?????????
          if (this.mapService.mapInstance) {
            this.mapService.mapInstance.clearOverlays();
          }
          if (this.mapService.markerClusterer) {
            this.mapService.markerClusterer.clearMarkers();
          }
          // ?????????
          this.lastArr = this.addMarkers(equipmentData);
          resolve(equipmentData);
        }
      }, () => {
        this.$message.warning(this.indexLanguage.networkTips);
      });
    });
  }

  /**
   * ???????????????????????????
   */
  public getPlanDeviceData() {

    return new Promise((resolve, reject) => {
      // ?????????????????????
      this.points = this.getWindowIsArea();

      const data = {
        queryCondition: {
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
        },
        pointList: this.points
      };


      this.$indexMapService.getPlanNonPolymerizationPoint(data).subscribe((result: ResultModel<any>) => {

        if (result.code === ResultCodeEnum.success && result.data && result.data.planPoleData) {
          result.data.planPoleData.forEach(item => {
            item['facilityId'] = item.pointId;
            item['lng'] = item.longitude;
            item['lat'] = item.latitude;
            item['cloneCode'] = item.planId;
            item['code'] = null;
            item['show'] = true;
          });

          const addMarkerData = result.data.planPoleData;
          this.cacheMapData = lodash.cloneDeep(result.data.planPoleData);
          // ?????????
          if (this.mapService.mapInstance) {
            this.mapService.mapInstance.clearOverlays();
          }

          if (this.mapService.markerClusterer) {
            this.mapService.markerClusterer.clearMarkers();
          }

          // ??????????????????????????????
          this.lastArr = this.addMarkers(addMarkerData);
          resolve([]);
        }
      }, () => {
        this.$message.warning(this.indexLanguage.networkTips);
      });
    });
  }

  /**
   * ???????????????????????????
   */
  public getProjectDeviceData() {

    return new Promise((resolve, reject) => {
      // ?????????????????????
      this.points = this.getWindowIsArea();
      const data = {
        'queryCondition': {
          'filterConditions': [
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
          ]
        },
        pointList: this.points
      };


      this.$indexMapService.getProjectNonPolymerizationPoint(data).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success && result.data && result.data.projectData) {
          result.data.projectData.forEach(item => {
            item['facilityId'] = item.pointId;
            item['lng'] = item.longitude;
            item['lat'] = item.latitude;
            item['cloneCode'] = item.projectId;
            item['code'] = null;
            item['show'] = true;
          });

          const addMarkerData = result.data.projectData;
          this.cacheMapData = lodash.cloneDeep(result.data.projectData);
          // ?????????
          if (this.mapService.mapInstance) {
            this.mapService.mapInstance.clearOverlays();
          }

          if (this.mapService.markerClusterer) {
            this.mapService.markerClusterer.clearMarkers();
          }

          // ??????????????????????????????
          this.lastArr = this.addMarkers(addMarkerData);
          resolve([]);
        }
      }, () => {
        this.$message.warning(this.indexLanguage.networkTips);
      });
    });
  }


  /**
   * ?????????????????????
   */
  public centerAndZoom(data): void {
    this.mapService.setCenterAndZoom(data.lng, data.lat, this.maxZoom);
  }

  /**
   * ????????????
   * ???????????????????????????
   */
  public zoomOut(): void {
    this.mapService.zoomIn();

  }

  /**
   * ????????????
   * ???????????????????????????
   */
  public zoomIn(): void {
    this.mapService.zoomOut();
  }


  /**
   * ??????input
   */
  public onInput(value: string): void {
    const _value = value.trim();
    this.queryInputName(_value);
  }


  /**
   * ??????/????????????????????????
   */
  public queryDeviceByName(value): void {
    if (value && value !== '') {
      const body = {
        filterConditions: [
          {
            filterField: 'deviceName',
            operator: 'like',
            filterValue: value
          }
        ]
      };
      if (this.indexType === this.mapTypeEnum.facility) {
        body.filterConditions[0].filterField = 'deviceName';
        this.$indexMapService.queryDeviceByName(body).subscribe((result: ResultModel<any>) => {
          result.data.forEach(item => {
            const devicePoint = item.positionBase.split(',');
            item['facilityName'] = item.deviceName;
            item['facilityId'] = item.deviceId;
            item['facilityType'] = 'device';
            item['lng'] = +devicePoint[0];
            item['lat'] = +devicePoint[1];
            item['equipmentList'] = [];
            item['type'] = 'device';
            item['code'] = null;
            item['show'] = true;
          });
          this.options = result.data;
        });
      } else {
        body.filterConditions[0].filterField = 'equipmentName';
        this.$indexMapService.queryEquipmentByName(body).subscribe((result: ResultModel<any>) => {
          result.data.forEach(item => {
            const devicePoint = item.positionBase.split(',');
            item['facilityName'] = item.equipmentName;
            item['facilityId'] = item.equipmentId;
            item['lng'] = +devicePoint[0];
            item['lat'] = +devicePoint[1];
            item['type'] = 'equipment';
            item['code'] = null;
            item['show'] = true;
          });
          this.options = result.data;
        });
      }
    }
  }

  /**
   * ???????????????????????????
   */
  public queryDeviceByNameOfPlan(value): void {
    if (value && value !== '') {
      const body = {
        filterConditions: [
          {
            filterField: 'pointName',
            operator: 'like',
            filterValue: value
          }
        ]
      };
      // body.filterConditions[0].filterField = 'deviceName';
      this.$indexMapService.queryDeviceByNameOfPlan(body).subscribe((result: ResultModel<any>) => {
        this.options = result.data;
      });
    }
  }

  /**
   * ???????????????????????????
   */
  public queryDeviceByNameOfProject(value): void {
    if (value && value !== '') {
      const body = {
        filterConditions: [
          {
            filterField: 'pointName',
            operator: 'like',
            filterValue: value
          }
        ]
      };
      // body.filterConditions[0].filterField = 'deviceName';
      this.$indexMapService.queryDeviceByNameOfProject(body).subscribe((result: ResultModel<any>) => {
        this.options = result.data;
      });
    }
  }


  /**
   * ??????input????????????
   */
  public keyUpEvent(evt): void {
    if (evt.code === 'Enter') {
      if (!this.options.length) {
        if (this.indexType === 'facility') {
          this.$message.warning(this.indexLanguage.noFacility);
        } else {
          this.$message.warning(this.indexLanguage.noDevice);
        }
      } else {
        this.locationById(this.inputValue);
      }
    }
  }

  /**
   * ???????????????
   */
  public optionChange(event, id, name): void {
    if (name) {
      this.inputValue = name;
    }
    this.locationById(id);
  }

  /**
   * ??????
   */
  public location(): void {
    const key = this.searchKey.trim();
    if (!key) {
      return;
    }
    this.mapService.locationByAddress(key);
  }

  /**
   * ??????????????????
   * terrain  roadmap  hybrid  satellite
   */
  public setMapType(type): void {
    this.mapTypeId = type;
    this.mapService.setMapTypeId(type);
  }

  /**
   * ????????????????????????
   */
  public setAreaDataMap(): void {
    this.areaData.forEach(item => {
      this.areaDataMap.set(item.areaId, item);
    });
  }

  // ?????????????????????
  public closeRightClick(): void {
    this.infoData.type = null;
  }

  /**
   * ???????????????????????????
   */
  public initFn(): void {
    this.fn = [
      {
        eventName: 'click',
        eventHandler: (event, m) => {
          // this.mapEvent.emit({type: 'mapBlackClick'});
          this.markerClick(event);
        }
      },
      // ?????????????????????????????????????????????
      {
        eventName: 'onmouseover',
        eventHandler: (event, m) => {
          this.openMInfoWindow(event, m);
        }
      },
      {
        eventName: 'onmouseout',
        eventHandler: () => {
          this.hideInfoWindow();
        }
      },
      {
        eventName: 'dragend',
        eventHandler: (event) => {
          if (event.currentTarget.$detail.equipmentList && event.currentTarget.$detail.equipmentList.length) {
            const list = [];
            event.currentTarget.$detail.equipmentList.forEach(item => {
              item.lat = event.point.lng;
              item.lng = event.point.lat;
              item.positionBase = `${event.point.lng},${event.point.lat}`;
              list.push(item);
            });
            this.dragMarkerList.push(...list);
          } else {
            this.dragMarkerList.push(event.currentTarget.$detail);
            event.currentTarget.$detail.lng = event.point.lng;
            event.currentTarget.$detail.lat = event.point.lat;
            event.currentTarget.$detail.positionBase = `${event.point.lng},${event.point.lat}`;
          }
          // ????????????Id??????
          this.dragMarkerList = lodash.uniqBy(this.dragMarkerList, this.indexType === 'facility' ? 'deviceId' : 'equipmentId');
          this.clearArr = this.dragMarkerList;
        }
      },
    ];
  }

  /**
   * ?????????????????????/?????????
   */
  public initAreaPoint(): void {
    this.areaPoint = [
      {
        eventName: 'onmouseover',
        eventHandler: (event, markers) => {
          this.loadingAlarm = false;
          this.loadingEquipment = false;
          // ??????????????????????????????
          if (this.viewIndex === ViewEnum.maintenanceView && this.polymerizationChange === '1') {
            this.openAInfoWindow(event, markers);
          }
          // ??????????????????????????????
          if (this.viewIndex === ViewEnum.maintenanceView && this.polymerizationChange === '2') {
            this.openWindow(ViewEnum.projectView, event, markers);
          }
          // ??????????????????
          if (this.viewIndex === ViewEnum.projectView) {
            this.openWindow(ViewEnum.projectView, event, markers);
          }
          // ??????????????????
          if (this.viewIndex === ViewEnum.planView) {
            this.openWindow(ViewEnum.planView, event, markers);
          }
        }
      },
      {
        eventName: 'onmouseout',
        eventHandler: (event) => {
          this.hideInfoWindow();
        }
      },
      {
        eventName: 'onclick',
        eventHandler: (event, markers) => {
          // ???????????????????????????
          if (this.viewIndex === ViewEnum.maintenanceView && this.polymerizationChange === '1') {
            this.areaClickEvent(event, markers);
          }
          // ???????????????????????????
          if (this.viewIndex === ViewEnum.maintenanceView && this.polymerizationChange === '2') {
            this.projectClickEvent(event, markers, '2');
          }
          // ???????????????
          if (this.viewIndex === ViewEnum.projectView) {
            this.projectClickEvent(event, markers);
          }
          // ???????????????
          if (this.viewIndex === ViewEnum.planView) {
            this.planClickEvent(event, markers);
          }
        }
      }
    ];
  }

  /**
   * ????????????????????????
   */
  public adjustCoordinatesUtil(): void {
    this.$adjustCoordinatesService.eventEmit.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value.isShow === undefined && value.line === undefined
        && value.isEdit === undefined && value.isDrag === undefined && value.isSave === undefined) {
        // ???????????????????????????????????????????????????
        return;
      }
      this.adjustCoordinates = true;
      if (value.isShow === true) {
        if (this.clearArr && this.clearArr.length > 0) {
          // ????????????????????? ???????????????
          if (this.mapService.mapInstance) {
            this.mapService.mapInstance.clearOverlays();
          }
          if (this.mapService.markerClusterer) {
            this.mapService.markerClusterer.clearMarkers();
          }
          // ????????????????????????????????????????????????
          this.addMarkers(lodash.cloneDeep(this.cacheMapData));
        }
        this.chooseUtil('rectangle');
      }
      if (value.isShow === false) {
        this.adjustCoordinates = false;
        this.clearAll();
      }
      if (value.line === true) {
        this.chooseUtil('polyline');
        this.polylineSet = value.data;
        this.coordinatesData = value.value;
      }
      if (value.line === false) {
        this.clearAll();
      }

      if (value.isEdit === true) {
        this.editing('enable');
      }

      if (value.isEdit === false) {
        this.editing('able');
        this.polylineSet = value.data;
        this.coordinatesData = value.value;
        this.drawCoordinateAdjustment(this.overlays[0]);
      }

      if (value.isDrag === true) {
        this.useDrag = true;
      }

      if (value.isSave === true) {
        if (value.isDrags) {
          // ??????????????????
          if (this.dragMarkerList.length) {
            this.coordinateAPI(this.dragMarkerList);
          }
        } else {
          // ??????????????????
          this.polylineSet = value.data;
          this.coordinatesData = value.value;
          const body = [];
          this.coordinatesData.forEach(item => {
            body.push(lodash.cloneDeep(item));
          });
          if (this.coordinatesData.length) {
            this.coordinateAPI(body);
          }
        }
        this.coordinatesData = [];
        this.dragMarkerList = [];
      }

      if (value.isSave === false) {
        this.adjustCoordinates = false;
        this.coordinatesData = [];
        this.resetTargetMarker();
        // ??????????????????
        if (this.targetMarker) {
          this.useDrag = false;
          this.targetMarker.disableDragging();
        } else {
          // ??????????????????
          this.clearAll();
          this.drawType = BMAP_ARROW;
          this.mapDrawUtil.close();
          this.mapDrawUtil.setDrawingMode(null);
        }
        this.dragMarkerList = [];
        this.dragEnd();
        if (this.mapService.getZoom() > BMapConfig.areaZoom) {
          if (this.mapService.mapInstance) {
            this.mapService.mapInstance.clearOverlays();
          }
          if (this.mapService.markerClusterer) {
            this.mapService.markerClusterer.clearMarkers();
          }
        }
      }
    });
  }

  /**
   * ????????????????????????
   * param body
   */
  coordinateAPI(body) {
    let api;
    if (this.viewIndex === ViewEnum.maintenanceView) {
      if (this.indexType === 'facility') {
        api = this.$indexMapService.deviceUpdateCoordinates(body);
      } else {
        api = this.$indexMapService.equipmentUpdateCoordinates(body);
      }
    } else {
      api = this.$indexMapService.updateCoordinates(body);
    }

    // ??????
    api.subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.indexLanguage.adjustmentCoordinate + this.indexLanguage.success);
        this.dragEnd();
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   *???????????????????????????
   */
  public addEventListener(): void {
    this.mapDrawUtil.setDrawingMode(null);
    // ???????????????????????????????????????????????????????????????
    this.mapDrawUtil.addEventListener('overlaycomplete', (e) => {
      if (this.drawType !== BMAP_DRAWING_POLYLINE) {
        this.overlays.push(e.overlay);
        this.getOverlayPath();
        this.clearAll();
        this.drawType = BMAP_ARROW;
        this.mapDrawUtil.close();
        this.mapDrawUtil.setDrawingMode(null);
      } else {
        // ????????????
        this.overlays.push(e.overlay);
        this.drawCoordinateAdjustment(e.overlay);
      }
    }, {passive: false, capture: true});
  }

  /**
   * ??????????????????
   */
  public drawCoordinateAdjustment(e) {
    if (!e) {
      return;
    }
    // ?????????????????????????????????
    const list = [];
    this.batchMarkerList = [];
    const lineMarkerList = e.getPath();
    // ?????????????????????
    if (lineMarkerList) {
      for (let i = 0; i < lineMarkerList.length - 1; i++) {
        list.push({
          length: this.$mapLinePointUtil.getDistance(lineMarkerList[i].lng, lineMarkerList[i].lat, lineMarkerList[i + 1].lng, lineMarkerList[i + 1].lat),
          pointOne: lineMarkerList[i],
          pointTwo: lineMarkerList[i + 1]
        });
      }
    }
    // ????????????20?????????
    if (list.length > 20) {
      this.$message.info(this.indexLanguage.noMoreThanLinesCanBeDrawnPleaseReselectToDraw);
      this.clearAll();
      return;
    }
    if (this.clearArr && this.clearArr.length) {
      this.clearArr.forEach(item => {
        this.mapService.mapInstance.removeOverlay(item);
      });
      this.clearArr = [];
    } else if (this.lastArr && this.lastArr.length) {
      const changePoints = this.coordinatesData.map(v => v.deviceId || v.facilityId);
      this.lastArr.forEach(item => {
        if (changePoints.includes(item.$detail.deviceId)) {
          this.mapService.mapInstance.removeOverlay(item);
        }
      });
      this.lastArr = [];
    }
    if (this.polylineSet.type === '1') {
      this.coordinatesData = this.$mapLinePointUtil.spliceData(this.polylineSet.spacing, list, this.coordinatesData);
      // ??????
      this.$mapLinePointUtil.lineSegmentArrangement(this.coordinatesData, list, this.polylineSet.spacing).forEach((item, index) => {
        this.clearArr.push(this.$mapLinePointUtil.autoLinePointSingle(this.polylineSet.spacing,
          item.data, 0, list[index].pointOne, list[index].pointTwo,
          this.mapService));
      });
      this.clearArr = this.flat(this.clearArr);
      if (this.clearArr && this.clearArr.length > 0) {
        this.clearArr.forEach(item => {
          this.batchMarkerList.push(item.$detail);
        });
      }
    } else {
      this.coordinatesData = this.$mapLinePointUtil.spliceData(this.polylineSet.spacing / 2, list, this.coordinatesData, true);
      // ??????
      this.$mapLinePointUtil.doubleLineSegmentArrangement(this.coordinatesData, list, this.polylineSet.spacing).forEach((item, index) => {
        this.clearArr.push(this.$mapLinePointUtil.autoLinePointBoth(this.polylineSet.spacing,
          item.data, this.polylineSet.width, list[index].pointOne, list[index].pointTwo, this.mapService));
      });
      this.clearArr = this.flat(this.clearArr);
      if (this.clearArr && this.clearArr.length > 0) {
        this.clearArr.forEach(item => {
          this.batchMarkerList.push(item.$detail);
        });
      }
    }
  }

  /**
   * ???????????????
   * param state
   */
  public editing(state) {
    for (let i = 0; i < this.overlays.length; i++) {
      state === 'enable' ? this.overlays[i].enableEditing() : this.overlays[i].disableEditing();
    }
  }

  /**
   * ??????????????????
   * param arr
   */
  public flat(arr) {
    return arr.reduce((pre, value) => {
      return Array.isArray(value) ? [...pre, ...this.flat(value)] : [...pre, value];
    }, []);
  }


}
