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
import {TableComponent} from '../table/table.component';
import {PageModel} from '../../model/page.model';
import {MapSelectorConfigModel} from '../../model/map-selector-config.model';
import {MapDrawingService} from './map-drawing.service';
import {BMAP_ARROW, BMAP_DRAWING_RECTANGLE, iconSize} from './map.config';
import {MapService} from '../../../core-module/api-service/index/map';
import {Result} from '../../entity/result';
import {NzI18nService} from 'ng-zorro-antd';
import {CommonUtil} from '../../util/common-util';
import {FiLinkModalService} from '../../service/filink-modal/filink-modal.service';
import {TableConfigModel} from '../../model/table-config.model';
import {CommonLanguageInterface} from '../../../../assets/i18n/common/common.language.interface';
import {IndexLanguageInterface} from '../../../../assets/i18n/index/index.language.interface';
import {MapConfig as GMapConfig} from '../map/g-map.config';
import {InspectionLanguageInterface} from '../../../../assets/i18n/inspection-task/inspection.language.interface';
import {BMapPlusService} from '../../service/map-service/b-map/b-map-plus.service';
import {MapServiceUtil} from '../../service/map-service/map-service.util';
import {BMapDrawingService} from '../../service/map-service/b-map/b-map-drawing.service';
import {GMapDrawingService} from '../../service/map-service/g-map/g-map-drawing.service';
import {ResultModel} from '../../model/result.model';
import {ResultCodeEnum} from '../../enum/result-code.enum';
import {FacilityForCommonService} from '../../../core-module/api-service/facility';
import {DeviceStatusNameEnum, DeviceTypeEnum} from '../../../core-module/enum/facility/facility.enum';
import {LanguageEnum} from '../../enum/language.enum';
import {QueryConditionModel, SortCondition} from '../../model/query-condition.model';
import {TableSortConfig} from '../../enum/table-style-config.enum';
import * as _ from 'lodash';
import * as lodash from 'lodash';
import {OperatorEnum} from '../../enum/operator.enum';
import {AreaModel} from '../../../core-module/model/facility/area.model';
import {MarkerInfoDataModel} from '../../model/marker-info-data.model';
import {InfoDataModel} from '../../model/info-data.model';
import {DeviceAreaModel} from '../../../business-module/index/shared/model/device-area.model';
import {SessionUtil} from '../../util/session-util';
import {AreaFacilityDataModel, AreaFacilityModel} from '../../../business-module/index/shared/model/area-facility-model';
import {MapConfig as BMapConfig} from '../map/b-map.config';
import {MapTypeEnum} from '../../enum/filinkMap.enum';
import {MapStoreService} from '../../../core-module/store/map.store.service';

declare const BMap: any;
declare const BMapLib: any;
declare const BMAP_ANCHOR_TOP_LEFT: any;
declare const BMAP_ANCHOR_TOP_RIGHT: any;
declare const MAP_TYPE;


/**
 * ?????????????????????
 */
@Component({
  selector: 'xc-map-selector',
  templateUrl: './map-selector.component.html',
  styleUrls: ['./map-selector.component.scss']
})
export class MapSelectorComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  // ???????????????
  @Input()
  mapSelectorConfig: MapSelectorConfigModel;
  // ??????id
  @Input() areaId;
  // ??????????????????
  @Output() xcVisibleChange = new EventEmitter<boolean>();
  // ??????????????????
  @Output() selectDataChange = new EventEmitter<any[]>();
  // ???????????????dom
  @ViewChild('mapSelectorDom') mapSelectorDom: ElementRef<any>;
  // ????????????
  @ViewChild('handleTemp') handleTemp: TemplateRef<any>;
  // table??????
  @ViewChild(TableComponent) childCmp: TableComponent;
  // ???????????????
  public selectPageBean: PageModel = new PageModel(6, 1, 0);
  // ?????????table??????
  public selectorConfig: TableConfigModel;
  // ???????????????
  public selectData = [];
  // ?????????????????????
  public selectPageData = [];
  // ????????????
  public mapInstance;
  // ????????????
  public mapData = [];
  // ????????????
  public treeNodeSum;
  // ????????????
  public facilityData = [];
  // ??????????????????
  public firstData = [];
  // ????????????
  public drawType: string = BMAP_ARROW;
  // ????????????
  public mapType: string = 'baidu';
  // ????????????
  public isLoading = false;
  // ??????key
  public searchKey;
  // ??????????????????
  public areaNotHasDevice: boolean;
  // ????????????????????????
  public isShowInfoWindow: boolean = false;
  // ??????????????????left
  public infoWindowLeft;
  // ??????????????????top
  public infoWindowTop;
  // ????????????????????????
  public infoData: InfoDataModel = {type: '', markerInfoData: new MarkerInfoDataModel(), collectionInfoData: []};
  // ????????????map
  public areaMap = new Map<string, any>();
  // ???????????????
  public language: CommonLanguageInterface;
  // ?????????????????????
  public isShowProgressBar = true;
  // ??????????????????
  public percent = 0;
  // ?????????vale
  public inputValue;
  // ??????????????????
  public options: string[] = [];
  // ???????????????
  public indexLanguage: IndexLanguageInterface;
  // ?????????
  public InspectionLanguage: InspectionLanguageInterface;
  // ??????????????????
  public searchTypeName;
  // ????????????????????????
  public IndexObj = {
    facilityNameIndex: 1,
    bMapLocationSearch: -1,
    gMapLocationSearch: -1,
  };
  // ??????????????????
  public maxZoom: any;
  // ????????????
  public typeLg;
  // ??????????????????
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // ????????????
  public mapService = new BMapPlusService();
  // ??????????????????
  private mapDrawUtil: MapDrawingService;
  // ???????????????
  private overlays = [];
  // ????????????????????????
  private increasePercent: number;
  // ??????????????????
  private timer: any;


  // ?????? todo/////////////////////////////////////

  // ??????????????????
  public deviceAreaModel: DeviceAreaModel = new DeviceAreaModel;
  // ????????????????????????
  public areaPoint: any;
  // ??????marker?????????
  public fn: any;
  // ??????????????????
  public facilityList = [];
  // ??????????????????????????????
  public mapCloneData: any;
  // ???????????????????????????
  public areaCenterModel = new AreaFacilityModel;
  // ???????????????????????????
  public areaFacilityModel = new AreaFacilityDataModel;
  // ????????????code
  public areaCode: string;
  // ????????????/????????????
  public mapTypeEnum = MapTypeEnum;


  constructor(public $mapService: MapService,
              public $mapStoreService: MapStoreService,
              public $facilityCommonService: FacilityForCommonService,
              public $modalService: FiLinkModalService,
              public $i18n: NzI18nService) {
  }

  /**
   * ????????????
   */
  zoomEnd = lodash.debounce(() => {
    // ???????????????????????????????????????
    if (this.mapService.mapInstance) {
      this.mapService.mapInstance.clearOverlays();
    }
    if (this.mapService.markerClusterer) {
      this.mapService.markerClusterer.clearMarkers();
    }

    // ??????????????????
    if (this.mapService.getZoom() <= BMapConfig.areaZoom) {
      this.showProgressBar();
      // ???????????????????????????????????????
      if (this.mapCloneData && this.mapCloneData.length > 0) {
        this.addMarker(this.mapCloneData);
      }
      this.hideProgressBar();
    }
    // ????????????????????????
    if (this.mapService.getZoom() > BMapConfig.areaZoom) {
      this.showProgressBar();
      this.queryDevicePolymerizations();
      this.hideProgressBar();
    }
    // ???????????????????????????
  }, 100, {leading: false, trailing: true});

  /**
   * ????????????
   */
  dragEnd = lodash.debounce(() => {

    if (this.mapService.getZoom() > BMapConfig.areaZoom) {
      // ????????????????????????????????????????????????
      this.showProgressBar();
      this.queryDevicePolymerizations();
      this.hideProgressBar();
    }
  }, 100, {leading: false, trailing: true});

  private _xcVisible = false;

  get xcVisible() {
    return this._xcVisible;
  }

  @Input()
  set xcVisible(params: boolean) {
    this._xcVisible = params;
    this.xcVisibleChange.emit(this._xcVisible);
  }

  ngOnInit() {
    this.mapType = MAP_TYPE;
    this.language = this.$i18n.getLocaleData(LanguageEnum.common);
    this.indexLanguage = this.$i18n.getLocaleData(LanguageEnum.index);
    this.InspectionLanguage = this.$i18n.getLocaleData(LanguageEnum.inspection);
    this.searchTypeName = this.indexLanguage.searchDeviceName;
    // ????????????
    this.typeLg = JSON.parse(localStorage.getItem('localLanguage'));
    this.initSelectorConfig();
    // ??????????????????
    this.getAreaInfoCurrentUser();


  }

  ngAfterViewInit(): void {
    // ????????????
    this.initMap();
    // ??????????????????
    this.getALLFacilityList();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  /**
   * ??????????????????
   * param event
   */
  public chooseUtil(event): void {
    this.drawType = event;
    if (event === BMAP_DRAWING_RECTANGLE) {
      this.mapDrawUtil.open();
      this.mapDrawUtil.setDrawingMode(BMAP_DRAWING_RECTANGLE);
    } else if (event === BMAP_ARROW) {
      this.mapDrawUtil.setDrawingMode(null);
      this.mapDrawUtil.close();
    }

  }

  /**
   * ??????
   */
  public handleCancel(): void {
    this.xcVisible = false;
  }

  /**
   * ??????
   */
  public handleOk(): void {
    this.setAreaDevice();
  }

  /**
   * ??????????????????????????????
   */
  public afterModelOpen(): void {
    if (!this.mapInstance) {
      this.initMap();
    }
  }

  /**
   * ????????????
   */
  public restSelectData(): void {
    this.selectData.forEach(item => {
      const imgUrl = CommonUtil.getFacilityIconUrl(iconSize, item.deviceType, '1');
      const icon = this.mapService.toggleIcon(imgUrl, '18-24');
      this.mapService.getMarkerById(item.deviceId).setIcon(icon);
    });
    this.firstData.forEach(item => {
      const imgUrl = CommonUtil.getFacilityIconUrl(iconSize, item.deviceType, '0');
      const icon = this.mapService.toggleIcon(imgUrl, '18-24');
      this.mapService.getMarkerById(item.deviceId).setIcon(icon);
    });
    this.selectData = this.firstData;
    this.refreshSelectPageData();

  }

  /**
   * ????????????????????????
   * param event
   */
  public selectPageChange(event): void {
    this.selectPageBean.pageIndex = event.pageIndex;
    this.selectPageBean.pageSize = event.pageSize;
    this.refreshSelectPageData();
  }

  /**
   * ??????
   */
  public location(): void {
    const key = this.searchKey.trimLeft().trimRight();
    if (!key) {
      return;
    }
    this.mapService.searchLocation(key, (results, status) => {
      if (status === 'OK') {
        this.mapInstance.setCenter(results[0].geometry.location);
      } else {
        // this.$modalService.error('?????????');
      }
    });
  }

  /**
   * ????????????????????????
   */
  public clearAll(): void {
    for (let i = 0; i < this.overlays.length; i++) {
      this.mapService.removeOverlay(this.overlays[i]);
    }
    this.overlays.length = 0;
  }

  /**
   * ??????????????????
   * param currentItem
   */
  public deleteFormTable(currentItem): void {
    const index = this.selectData.findIndex(item => item.deviceId === currentItem.deviceId);
    this.selectData.splice(index, 1);
    this.childCmp.checkStatus();
  }

  /**
   * ???????????????
   * param item
   */
  public pushToTable(item): void {
    const index = this.selectData.findIndex(_item => item.deviceId === _item.deviceId);
    if (index === -1) {
      item.checked = true;
      if (item.areaId && item.areaId !== this.areaId) {
        // item.remarks = `??????????????????${item.areaName}???`;
        item.rowActive = true;
      }
      this.selectData = this.selectData.concat([item]);
    }
  }

  /**
   * ??????
   * param currentItem
   */
  public handleDelete(currentItem): void {
    if (currentItem) {
      if (this.checkFacilityCanDelete(currentItem)) {
        return;
      }
      // ????????????????????????
      const index = this.selectData.findIndex(item => item.deviceId === currentItem.deviceId);
      this.selectData.splice(index, 1);
      this.childCmp.checkStatus();
      // ???????????????????????????
      this.refreshSelectPageData();
      const imgUrl = CommonUtil.getFacilityIconUrl(iconSize, currentItem.deviceType, '1');
      const icon = this.mapService.toggleIcon(imgUrl, '18-24');
      this.mapService.getMarkerById(currentItem.deviceId).setIcon(icon);
    }
  }

  /**
   * ?????????????????????
   * param {any[]} facilityData
   */
  public addMarkers(facilityData: any[]) {
    const arr = [];
    facilityData.forEach(item => {
      const status = item.checked ? '0' : '1';
      const urlSize = item.checked ? '36-48' : '18-24';
      const iconUrl = CommonUtil.getFacilityIconUrl(urlSize, item.deviceType, status);
      const position = item.positionBase.split(',');
      item.lng = parseFloat(position[0]);
      item.lat = parseFloat(position[1]);
      if (item.lng && item.lat) {
        const markerIcon = this.mapService.toggleIcon(iconUrl, urlSize);
        const markerPoint = this.mapService.createPoint(item.lng, item.lat);
        const func = [
          {
            eventName: 'click',
            eventHandler: (event, __event) => {
              const icon = event.target.getIcon();
              let _icon;
              const data = this.mapService.getMarkerDataById(event.target.customData.id);
              const imgUrl = CommonUtil.getFacilityIconUrl(iconSize, data.deviceType, '1');
              if (icon.imageUrl === imgUrl || icon.url === imgUrl) {
                const _imgUrl = CommonUtil.getFacilityIconUrl('36-48', data.deviceType);
                _icon = this.mapService.toggleIcon(_imgUrl, '36-48');
                this.pushToTable(data);
              } else {
                if (this.checkFacilityCanDelete(data)) {
                  return;
                }
                _icon = this.mapService.toggleIcon(imgUrl, '18-24');
                this.deleteFormTable(data);
              }
              this.refreshSelectPageData();
              event.target.setIcon(_icon);
            }
          },
          // ?????????????????????????????????????????????
          {
            eventName: 'mouseover',
            eventHandler: (event, __event) => {
              // ???map?????????????????????
              const data = this.mapService.getMarkerDataById(event.target.customData.id);
              const areaLevel = this.areaMap.get(data.areaId) ? this.areaMap.get(data.areaId).level : null;
              this.infoData = {
                type: 'm',
                markerInfoData: {
                  deviceName: data.deviceName,
                  deviceStatusName: CommonUtil.codeTranslate(DeviceStatusNameEnum, this.$i18n, data.deviceStatus, LanguageEnum.facility) as string,
                  deviceStatusColor: CommonUtil.getDeviceStatusIconClass(data.deviceStatus).colorClass.replace('-c', '-bg'),
                  areaLevelName: this.getAreaLevelName(areaLevel),
                  areaLevelColor: CommonUtil.getAreaColor(String(areaLevel)),
                  areaName: data.areaName,
                  address: data.address,
                  className: CommonUtil.getFacilityIconClassName(data.deviceType)
                }
              };
              this.showInfoWindow('m', data.lng, data.lat);
            }
          },
          {
            eventName: 'mouseout',
            eventHandler: () => {
              this.isShowInfoWindow = false;
            }
          }
        ];
        const marker = this.mapService.createNewMarker(markerPoint, markerIcon, func);
        marker.customData = {id: item.deviceId};
        arr.push(marker);
        this.mapService.setMarkerMap(item.deviceId, {marker: marker, data: item});
      }
    });
    this.mapService.addMarkerClusterer(arr);
  }

  /**
   * ????????????????????????????????????
   * param facility
   */
  public checkFacilityCanDelete(facility) {
    if (facility.areaId === this.areaId) {
      this.$modalService.error(this.language.setAreaMsg);
      return true;
    }
  }

  public ngOnDestroy(): void {
    this.$modalService.remove();
    this.mapService.destroy();
    this.mapService = null;
    this.childCmp = null;
  }

  /**
   * ?????????????????????
   */
  public showProgressBar() {
    this.percent = 0;
    this.increasePercent = 5;
    this.isShowProgressBar = true;
    this.timer = setInterval(() => {
      if (this.percent >= 100) {
        clearInterval(this.timer);
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
  public hideProgressBar() {
    this.percent = 100;
    setTimeout(() => {
      this.isShowProgressBar = false;
    }, 1000);
  }

  /**
   * ??????????????????
   */
  public searchFacilityName() {
    this.searchTypeName = this.indexLanguage.searchDeviceName;
    this.IndexObj = {
      facilityNameIndex: 1,
      bMapLocationSearch: -1,
      gMapLocationSearch: -1,
    };
  }

  /**
   * ????????????
   */
  public searchAddress() {
    this.searchTypeName = this.indexLanguage.searchAddress;
    if (this.mapType === 'baidu') {
      this.IndexObj = {
        facilityNameIndex: -1,
        bMapLocationSearch: 1,
        gMapLocationSearch: -1,
      };
    } else if (this.mapType === 'google') {
      this.IndexObj = {
        facilityNameIndex: -1,
        bMapLocationSearch: -1,
        gMapLocationSearch: 1,
      };
    }
  }

  /**
   * ??????input??????
   * param value
   */
  public onInput(value: string): void {
    const _value = value.trim();
    this.options = this.facilityData.filter(item => {
      return item.deviceName.includes(_value);
    });
  }

  /**
   * ??????????????????
   * param event
   */
  public keyDownEvent(event): void {
    if (event.key === 'Enter') {
      this.selectMarker(this.inputValue);
    }
  }

  /**
   * ????????????????????????
   * param event
   * param id
   */
  public optionChange(event, id): void {
    this.selectMarker(id);
  }

  /**
   * ????????????
   */
  public selectMarker(id): void {
    const data = this.facilityData.filter(item => item.equipmentId ? item.equipmentId : item.deviceId === id);
    const position = data[0].positionBase.split(',');
    const _lng = parseFloat(position[0]);
    const _lat = parseFloat(position[1]);
    this.mapService.setCenterAndZoom(_lng, _lat, 18);
  }

  /**
   * ????????????????????????
   * param level
   * returns {string}
   */
  public getAreaLevelName(level): string {
    if (level) {
      const a = CommonUtil.getAreaLevelName(String(level));
      return `${this.language[a]}${this.language.level}`;
    }
  }

  /**
   * ????????????????????????
   * param info   ???????????????
   * param type   ??????  c???????????? m???marker???
   */
  showInfoWindow(type, lng, lat) {
    const pixel = this.mapService.pointToOverlayPixel(lng, lat);
    const offset = this.mapService.getOffset();
    let _top = offset.offsetY + pixel.y;
    if (type === 'm') {
      const iconHeight = parseInt('10', 10);
      _top = _top - iconHeight + 16;
      if (this.mapType === 'google') {
        _top = _top - 10;
      }
    }
    // 10 ?????????padding
    this.infoWindowLeft = offset.offsetX + 10 + pixel.x + 'px';
    this.infoWindowTop = _top + 'px';
    this.isShowInfoWindow = true;
  }

  /**
   * ??????
   */
  public zoomOut() {
    this.mapService.zoomIn();
  }

  /**
   * ??????
   */
  public zoomIn() {
    this.mapService.zoomOut();
  }

  /**
   * ????????????
   */
  public refreshSelectPageData(): void {
    // ????????????
    let searchData = [];
    if (this.queryCondition.filterConditions.length) {
      searchData = this.selectData.filter(item => {
        return this.queryCondition.filterConditions.every(_item => {
          if (_item.operator === OperatorEnum.like) {
            return item[_item.filterField].includes(_item.filterValue);
          } else if (_item.operator === OperatorEnum.in) {
            return _item.filterValue.includes(item[_item.filterField]);
          }
        });
      });
    } else {
      searchData = this.selectData;
    }
    this.selectPageBean.Total = searchData.length;
    // ????????????
    let sortDataSet = [];
    if (this.queryCondition.sortCondition && this.queryCondition.sortCondition.sortRule) {
      sortDataSet = _.sortBy(searchData, this.queryCondition.sortCondition.sortField);
      if (this.queryCondition.sortCondition.sortRule === TableSortConfig.DESC) {
        sortDataSet.reverse();
      }
    } else {
      sortDataSet = searchData;
    }
    this.selectPageData = sortDataSet.slice(this.selectPageBean.pageSize * (this.selectPageBean.pageIndex - 1),
      this.selectPageBean.pageIndex * this.selectPageBean.pageSize);
  }

  /**
   * ????????????????????????
   */
  public initSelectorConfig(): void {
    this.selectorConfig = {
      noIndex: true,
      isDraggable: false,
      isLoading: false,
      showSearchSwitch: this.mapSelectorConfig.showSearchSwitch,
      notShowPrint: true,
      searchTemplate: null,
      scroll: {x: 92 + this.mapSelectorConfig.selectedColumn.reduce((prev, next) => prev + next.width, 0) + 'px'},
      columnConfig: [
        {type: 'render', renderTemplate: this.handleTemp, width: 30, title: ''},
        {type: 'serial-number', width: 62, title: this.language.serialNumber},
        ...this.mapSelectorConfig.selectedColumn,
        // ??????
        {
          title: this.language.operate,
          searchConfig: {type: 'operate'},
          searchable: true,
          hidden: true,
          key: '',
          width: 100,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      showSizeChanger: false,
      simplePage: true,
      hideOnSinglePage: true,
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition = event;
        this.refreshSelectPageData();
      },
      handleSearch: (event) => {
        this.queryCondition.filterConditions = event;
        this.refreshSelectPageData();
      },
      handleSelect: (data, currentItem) => {
        // ??????????????????
        if (currentItem) {
          if (this.checkFacilityCanDelete(currentItem)) {
            return;
          }
          // ????????????????????????
          const index = this.selectData.findIndex(item => item.deviceId === currentItem.deviceId);
          this.selectData.splice(index, 1);
          this.childCmp.checkStatus();
          // ???????????????????????????
          this.refreshSelectPageData();
          const imgUrl = CommonUtil.getFacilityIconUrl(iconSize, currentItem.deviceType, '1');
          const icon = this.mapService.toggleIcon(imgUrl, '18-24');
          this.mapService.getMarkerById(currentItem.deviceId).setIcon(icon);
        }
        if (data && data.length === 0) {
          this.restSelectData();
        }
      },
    };
  }

  /**
   * ???????????????
   */
  public initMap(): void {
    // ????????????????????????
    if (this.mapType === 'baidu') {
      this.mapService = new BMapPlusService();
      this.mapService.createPlusMap('_mapContainer');
      this.mapService.addEventListenerToMap();
      this.maxZoom = GMapConfig.maxZoom;
      this.mapService.addLocationSearchControl('_suggestId', '_searchResultPanel');
      this.addEventListenerToMap();
      // ???????????????????????????
      // @ts-ignore
      this.mapDrawUtil = new BMapDrawingService(this.mapService.mapInstance);
    } else {
      this.maxZoom = GMapConfig.maxZoom;
      // this.mapService = new GMapPlusService();
      this.mapService.createPlusMap('_mapContainer');
      // ???????????????????????????
      // @ts-ignore
      this.mapDrawUtil = new GMapDrawingService(this.mapService.mapInstance);
    }
    // ????????????????????????
    this.mapService.addZoomEnd(() => {
      this.isShowInfoWindow = false;
    });
    this.mapInstance = this.mapService.mapInstance;
    this.mapService.mapInstance.setMapStyleV2({
      styleId: '44dc7b975692cc3a4c9d3e7330dd21cf'
    });
    this.mapDrawUtil.setDrawingMode(null);
    // ???????????????????????????????????????????????????????????????
    this.mapDrawUtil.addEventListener('overlaycomplete', (e) => {
      this.overlays.push(e.overlay);
      this.getOverlayPath();
      this.clearAll();
      this.drawType = BMAP_ARROW;
      this.mapDrawUtil.close();
      this.mapDrawUtil.setDrawingMode(null);
    });
  }


  /**
   * ?????????????????????????????????????????????
   */
  private getAreaInfoCurrentUser(): void {
    this.$facilityCommonService.queryAreaList().subscribe((result: ResultModel<AreaModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        result.data.forEach(item => {
          this.areaMap.set(item.areaId, item);
        });
      }
    });
  }

  /**
   * ??????????????????
   */
  private getOverlayPath() {
    const box = this.overlays[this.overlays.length - 1];

    if (box.getPath && this.mapType === 'baidu') {
      const pointArray = box.getPath();
      // this.mapInstance.setViewport(pointArray); // ????????????
      const bound = this.mapInstance.getBounds(); // ??????????????????
      this.mapService.getMarkerMap().forEach(value => {
        if (bound.containsPoint(value.marker.point) === true) {
          if (MapServiceUtil.isInsidePolygon(value.marker.point, pointArray)) {
            let imgUrl;
            let marker;
            if (value.data.equipmentType) {
              imgUrl = CommonUtil.getEquipmentTypeIconUrl('36-48', value.data.equipmentType);
              marker = this.mapService.getMarkerById(value.data.equipmentId);
            } else {
              imgUrl = CommonUtil.getFacilityIconUrl(iconSize, value.data.deviceType);
              marker = this.mapService.getMarkerById(value.data.deviceId);
            }
            const icon = this.mapService.toggleIcon(imgUrl, '36-48');
            if (marker) {
              marker.setIcon(icon);
            }
            // ??????????????????????????????????????????????????????
            if (value.data.equipmentList && value.data.equipmentList.length > 1) {
              value.data.equipmentList.forEach(item => {
                this.pushToTable(item);
              });
            } else {
              this.pushToTable(value.data);
            }
          }
        }
      });
    } else {
      // ????????????
      const point = box.getBounds();
      this.mapService.getMarkerMap().forEach(value => {
        if (point.contains(value.marker.position)) {
          const imgUrl = CommonUtil.getFacilityIconUrl(iconSize, value.data.deviceType);
          const icon = this.mapService.toggleIcon(imgUrl);
          this.mapService.getMarkerById(value.data.deviceId).setIcon(icon);
          this.pushToTable(value.data);
        }
      });
    }
    this.refreshSelectPageData();
  }


  /**
   * ????????????????????????
   */
  private getALLFacilityList() {
    const data = {
      areaIdList : [this.areaId]
    };
    this.showProgressBar();
    this.$facilityCommonService.queryDeviceInfo(data).subscribe((result: Result) => {
    // this.$modalService.loading(this.language.loading, 1000 * 60);
    // this.$mapService.getALLFacilityList().subscribe((result: Result) => {
      // this.$modalService.remove();
      this.hideProgressBar();
      this.facilityData = result.data || [];
     // this.treeNodeSum = this.facilityData.length;
      // ??????????????????????????????
      this.areaNotHasDevice = true;
      this.facilityData.forEach(item => {
        item._deviceType = CommonUtil.codeTranslate(DeviceTypeEnum, this.$i18n, item.deviceType);
        if (item.areaId === this.areaId) {
          item.checked = true;
          // ?????????????????????
          this.areaNotHasDevice = false;
          this.firstData.push(item);
          this.pushToTable(item);
        }
      });
      this.queryCountDevice();
      this.refreshSelectPageData();
      // this.addMarkers(this.facilityData);
      // ?????????????????????
      this.initAreaPoint();
      // ??????????????????????????????
      this.queryDeviceArea();
    }, () => {
      // this.$modalService.remove();
      this.hideProgressBar();
    });
  }

  /**
   * ??????????????????
   */
  public queryCountDevice() {
    this.$facilityCommonService.countDeviceAreaList().subscribe((result: Result) => {
      if (result.code === ResultCodeEnum.success) {
        this.treeNodeSum = result.data;
      }
    });
  }

  /**
   * ????????????
   * param body
   */
  private setAreaDevice() {
    this.isLoading = true;
    const list = [];
    // ????????????????????????????????????
    this.selectData.forEach(item => {
      if (item.areaId !== this.areaId) {
        list.push(item.deviceId);
      }
    });
    const obj = {};
    obj[this.areaId] = list;
    this.$facilityCommonService.setAreaDevice(obj).subscribe((result: ResultModel<string>) => {
      this.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.$modalService.success(result.msg);
        this.handleCancel();
      } else {
        this.$modalService.error(result.msg);
      }
    }, () => {
      this.isLoading = false;
    });
  }


  // todo ??????????????????????????????  ////////////////////////////////////////////////////////////

  /**
   * ????????????????????????
   */
  public queryDeviceArea() {
    // ???????????????
    this.showProgressBar();
    // ????????????
    const userInfo = SessionUtil.getUserInfo();
    // ??????????????????????????????
    this.facilityList = [];
    // ??????????????????????????????
    if (userInfo.role.roleDeviceTypeDto) {
      this.facilityList = userInfo.role.roleDeviceTypeDto.deviceTypes;
    }
    // ??????????????????
    this.deviceAreaModel.polymerizationType = '1';
    // ???????????????????????????
    this.deviceAreaModel.filterConditions.area = [];
    // ??????????????????
    this.deviceAreaModel.filterConditions.device = this.facilityList;
    // ????????????
    const testData = this.deviceAreaModel;
    this.$mapStoreService.polymerizationConfig = testData;
    // ????????????
    this.$mapService.queryDevicePolymerizationList(testData).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        if (result.data.polymerizationData) {
          const data = result.data;
          // ???????????????????????????
          const centerPoint = result.data.positionCenter.split(',');
          data['lng'] = +centerPoint[0];
          data['lat'] = +centerPoint[1];
          // ?????????????????????
          // ???????????????
          data.polymerizationData.forEach(item => {
            if (item.positionCenter) {
              const position = item.positionCenter.split(',');
              item.lng = parseFloat(position[0]);
              item.lat = parseFloat(position[1]);
              delete item.positionCenter;
            }
          });
          // ????????????????????????
          this.mapCloneData = CommonUtil.deepClone(data.polymerizationData);
          // ??????????????????????????????
          if (centerPoint) {
            this.mapService.setCenterAndZoom(data.lng, data.lat, 8);
          }
          // ???????????????
          this.hideProgressBar();
        } else {
          // ?????????????????????????????????
          this.mapService.locateToUserCity();
          this.hideProgressBar();
        }
      } else {
        this.mapService.locateToUserCity();
        this.hideProgressBar();
      }
    }, () => {
      this.mapService.locateToUserCity();
      this.hideProgressBar();
    });
  }


  /**
   * ?????????????????????
   */
  public areaClickEvent(event, markers) {
    // ??????????????????cod
    this.areaCode = event.target.customData.code;
    // ???????????????????????????
    this.areaCenterModel.filterConditions.area = [];
    this.areaCenterModel.filterConditions.device = this.facilityList;
    this.areaCenterModel.filterConditions.group = [];
    this.areaCenterModel.polymerizationType = '1';
    this.areaCenterModel.codeList = [this.areaCode];
    // ???????????????????????????
    this.$mapService.queryDevicePolymerizationsPointCenter(this.areaCenterModel).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success && result.data && result.data.positionCenter) {

        // ?????????????????????
        const centerPoint = result.data.positionCenter.split(',');
        this.mapService.setCenterAndZoom(centerPoint[0], centerPoint[1], BMapConfig.deviceZoom);
      }
    });
  }


  /**
   * ?????????????????????
   */
  public queryDevicePolymerizations(areaCode?) {
    const points = this.getWindowIsArea();
    this.areaFacilityModel.filterConditions.area = [];
    this.areaFacilityModel.filterConditions.device = this.facilityList;
    this.areaFacilityModel.filterConditions.group = [];
    this.areaFacilityModel.polymerizationType = '1';
    this.areaFacilityModel.points = points;
    this.$mapService.queryDevicePolymerizations(this.areaFacilityModel).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success && result.data && result.data.positionCenter) {
        const deviceDataList = result.data || [];

        // ???????????????
        if (this.mapService.mapInstance) {
          this.mapService.mapInstance.clearOverlays();
        }
        if (this.mapService.markerClusterer) {
          this.mapService.markerClusterer.clearMarkers();
        }

        // ???????????????????????????
        const map = new Map();
        // ??????deviceId????????????
        if (this.selectData && this.selectData.length) {
          this.selectData.forEach(item => {
            map.set(item.deviceId, item.deviceId);
          });
        }

        // ????????????????????????
        deviceDataList.deviceData.forEach(item => {
          if (this.selectData && map.has(item.deviceId)) {
            item.checked = true;
          }
          item._deviceType = CommonUtil.codeTranslate(DeviceTypeEnum, this.$i18n, item.deviceType);
          item['facilityId'] = item.deviceId;
          item['cloneCode'] = item.code;
          item['code'] = null;
          item['equipmentList'] = [];
          item['facilityType'] = 'device';
          item['show'] = true;
        });

        // ?????????
        this.addMarkers(deviceDataList.deviceData);
      }
    });
  }

  /**
   * ???????????????????????????
   */
  getWindowIsArea() {
    // ??????????????????
    const bs = this.mapService.mapInstance.getBounds();
    // ?????????????????????
    const bssw = bs.getSouthWest();
    // ?????????????????????
    const bsne = bs.getNorthEast();
    const arry = [
      {
        longitude: bssw.lng,
        latitude: bssw.lat
      },
      {
        longitude: bsne.lng,
        latitude: bsne.lat
      }
    ];
    return arry;
  }


  /**
   *??????????????????
   */
  public addMarker(facilityData: any[]) {
    if (facilityData) {
      const arr = [];
      // ???????????????
      if (facilityData.length && facilityData[0].code) {
        facilityData.forEach(item => {
          // ??????????????????????????????
          if (item.lat && item.lng) {
            arr.push(this.mapService.createMarker(item, this.areaPoint, '50-50', 'area'));
          }
        });
        this.mapService.addMarkerClusterer(arr);
      }
    }
  }

  /**
   * ??????????????????
   */
  public addEventListenerToMap(): void {
    this.mapService.mapEventHook().subscribe(data => {
      const type = data.type;
      // ?????????
      if (type === 'zoomend') {
        // ????????????????????????????????????
        this.zoomEnd();
      } else if (type === 'dragend') {
        // ????????????????????????????????????
        this.dragEnd();
      }
    });
  }

  /**
   * ?????????????????????/?????????
   */
  public initAreaPoint(): void {
    this.areaPoint = [
      {
        eventName: 'onclick',
        eventHandler: (event, markers) => {
          this.areaClickEvent(event, markers);
        }
      }
    ];
  }


}
