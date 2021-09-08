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
 * 地图选择器组件
 */
@Component({
  selector: 'xc-map-selector',
  templateUrl: './map-selector.component.html',
  styleUrls: ['./map-selector.component.scss']
})
export class MapSelectorComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  // 选择器配置
  @Input()
  mapSelectorConfig: MapSelectorConfigModel;
  // 区域id
  @Input() areaId;
  // 显示隐藏变化
  @Output() xcVisibleChange = new EventEmitter<boolean>();
  // 选择数据事件
  @Output() selectDataChange = new EventEmitter<any[]>();
  // 地图选择器dom
  @ViewChild('mapSelectorDom') mapSelectorDom: ElementRef<any>;
  // 去选模板
  @ViewChild('handleTemp') handleTemp: TemplateRef<any>;
  // table实例
  @ViewChild(TableComponent) childCmp: TableComponent;
  // 选择器分页
  public selectPageBean: PageModel = new PageModel(6, 1, 0);
  // 选择器table配置
  public selectorConfig: TableConfigModel;
  // 选择器数据
  public selectData = [];
  // 已选择分页数据
  public selectPageData = [];
  // 地图实例
  public mapInstance;
  // 地图数据
  public mapData = [];
  // 被选总数
  public treeNodeSum;
  // 设施数据
  public facilityData = [];
  // 第一次的数据
  public firstData = [];
  // 绘制类型
  public drawType: string = BMAP_ARROW;
  // 地图类型
  public mapType: string = 'baidu';
  // 是否加载
  public isLoading = false;
  // 搜索key
  public searchKey;
  // 区域没有设施
  public areaNotHasDevice: boolean;
  // 设施信息面板展示
  public isShowInfoWindow: boolean = false;
  // 设施信息面板left
  public infoWindowLeft;
  // 设施信息面板top
  public infoWindowTop;
  // 设施信息面板数据
  public infoData: InfoDataModel = {type: '', markerInfoData: new MarkerInfoDataModel(), collectionInfoData: []};
  // 区域集合map
  public areaMap = new Map<string, any>();
  // 公共语言包
  public language: CommonLanguageInterface;
  // 是否显示进度条
  public isShowProgressBar = true;
  // 进度条百分比
  public percent = 0;
  // 搜素框vale
  public inputValue;
  // 搜素结果选项
  public options: string[] = [];
  // 首页语言包
  public indexLanguage: IndexLanguageInterface;
  // 国际化
  public InspectionLanguage: InspectionLanguageInterface;
  // 搜素类型名称
  public searchTypeName;
  // 搜素类型显示隐藏
  public IndexObj = {
    facilityNameIndex: 1,
    bMapLocationSearch: -1,
    gMapLocationSearch: -1,
  };
  // 最大缩放级别
  public maxZoom: any;
  // 语言类型
  public typeLg;
  // 表格查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 地图服务
  public mapService = new BMapPlusService();
  // 地图绘画工具
  private mapDrawUtil: MapDrawingService;
  // 覆盖物集合
  private overlays = [];
  // 进度条增长百分比
  private increasePercent: number;
  // 进度条定时器
  private timer: any;


  // 重构 todo/////////////////////////////////////

  // 设施区域模型
  public deviceAreaModel: DeviceAreaModel = new DeviceAreaModel;
  // 区域点和项目回调
  public areaPoint: any;
  // 设施marker点事件
  public fn: any;
  // 设施权限集合
  public facilityList = [];
  // 克隆一份地图区域数据
  public mapCloneData: any;
  // 区域中心点查询条件
  public areaCenterModel = new AreaFacilityModel;
  // 区域下设施查询条件
  public areaFacilityModel = new AreaFacilityDataModel;
  // 保存区域code
  public areaCode: string;
  // 地图设施/设备类型
  public mapTypeEnum = MapTypeEnum;


  constructor(public $mapService: MapService,
              public $mapStoreService: MapStoreService,
              public $facilityCommonService: FacilityForCommonService,
              public $modalService: FiLinkModalService,
              public $i18n: NzI18nService) {
  }

  /**
   * 缩放防抖
   */
  zoomEnd = lodash.debounce(() => {
    // 清除设施或设备以外所有的点
    if (this.mapService.mapInstance) {
      this.mapService.mapInstance.clearOverlays();
    }
    if (this.mapService.markerClusterer) {
      this.mapService.markerClusterer.clearMarkers();
    }

    // 缩放层级区级
    if (this.mapService.getZoom() <= BMapConfig.areaZoom) {
      this.showProgressBar();
      // 还原设施或设备以外所有的点
      if (this.mapCloneData && this.mapCloneData.length > 0) {
        this.addMarker(this.mapCloneData);
      }
      this.hideProgressBar();
    }
    // 缩放层级街道级别
    if (this.mapService.getZoom() > BMapConfig.areaZoom) {
      this.showProgressBar();
      this.queryDevicePolymerizations();
      this.hideProgressBar();
    }
    // 是否为定位缩放判断
  }, 100, {leading: false, trailing: true});

  /**
   * 平移防抖
   */
  dragEnd = lodash.debounce(() => {

    if (this.mapService.getZoom() > BMapConfig.areaZoom) {
      // 获取窗口内的区域下设施设备点数据
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
    // 语言类型
    this.typeLg = JSON.parse(localStorage.getItem('localLanguage'));
    this.initSelectorConfig();
    // 获取区域列表
    this.getAreaInfoCurrentUser();


  }

  ngAfterViewInit(): void {
    // 加载地图
    this.initMap();
    // 获取列表数据
    this.getALLFacilityList();
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  /**
   * 选择绘画工具
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
   * 取消
   */
  public handleCancel(): void {
    this.xcVisible = false;
  }

  /**
   * 确定
   */
  public handleOk(): void {
    this.setAreaDevice();
  }

  /**
   * 佐罗弹框加载地图方式
   */
  public afterModelOpen(): void {
    if (!this.mapInstance) {
      this.initMap();
    }
  }

  /**
   * 清空数据
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
   * 左边表格数据变化
   * param event
   */
  public selectPageChange(event): void {
    this.selectPageBean.pageIndex = event.pageIndex;
    this.selectPageBean.pageSize = event.pageSize;
    this.refreshSelectPageData();
  }

  /**
   * 定位
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
        // this.$modalService.error('无结果');
      }
    });
  }

  /**
   * 清除所有的覆盖物
   */
  public clearAll(): void {
    for (let i = 0; i < this.overlays.length; i++) {
      this.mapService.removeOverlay(this.overlays[i]);
    }
    this.overlays.length = 0;
  }

  /**
   * 从列表中删除
   * param currentItem
   */
  public deleteFormTable(currentItem): void {
    const index = this.selectData.findIndex(item => item.deviceId === currentItem.deviceId);
    this.selectData.splice(index, 1);
    this.childCmp.checkStatus();
  }

  /**
   * 添加到列表
   * param item
   */
  public pushToTable(item): void {
    const index = this.selectData.findIndex(_item => item.deviceId === _item.deviceId);
    if (index === -1) {
      item.checked = true;
      if (item.areaId && item.areaId !== this.areaId) {
        // item.remarks = `当前选择属于${item.areaName}区`;
        item.rowActive = true;
      }
      this.selectData = this.selectData.concat([item]);
    }
  }

  /**
   * 去选
   * param currentItem
   */
  public handleDelete(currentItem): void {
    if (currentItem) {
      if (this.checkFacilityCanDelete(currentItem)) {
        return;
      }
      // 找到要删除的项目
      const index = this.selectData.findIndex(item => item.deviceId === currentItem.deviceId);
      this.selectData.splice(index, 1);
      this.childCmp.checkStatus();
      // 删除完刷新被选数据
      this.refreshSelectPageData();
      const imgUrl = CommonUtil.getFacilityIconUrl(iconSize, currentItem.deviceType, '1');
      const icon = this.mapService.toggleIcon(imgUrl, '18-24');
      this.mapService.getMarkerById(currentItem.deviceId).setIcon(icon);
    }
  }

  /**
   * 向地图中添加点
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
          // 地图上的设施点悬浮显示信息面板
          {
            eventName: 'mouseover',
            eventHandler: (event, __event) => {
              // 从map中拿到设施数据
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
   * 检查设备是否能被解除关联
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
   * 显示加载进度条
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
   * 隐藏加载进度条
   */
  public hideProgressBar() {
    this.percent = 100;
    setTimeout(() => {
      this.isShowProgressBar = false;
    }, 1000);
  }

  /**
   * 设施名称搜索
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
   * 地址搜索
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
   * 搜索input事件
   * param value
   */
  public onInput(value: string): void {
    const _value = value.trim();
    this.options = this.facilityData.filter(item => {
      return item.deviceName.includes(_value);
    });
  }

  /**
   * 键盘按下事件
   * param event
   */
  public keyDownEvent(event): void {
    if (event.key === 'Enter') {
      this.selectMarker(this.inputValue);
    }
  }

  /**
   * 选择搜索框值变化
   * param event
   * param id
   */
  public optionChange(event, id): void {
    this.selectMarker(id);
  }

  /**
   * 设施选中
   */
  public selectMarker(id): void {
    const data = this.facilityData.filter(item => item.equipmentId ? item.equipmentId : item.deviceId === id);
    const position = data[0].positionBase.split(',');
    const _lng = parseFloat(position[0]);
    const _lat = parseFloat(position[1]);
    this.mapService.setCenterAndZoom(_lng, _lat, 18);
  }

  /**
   * 获取告警级别名称
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
   * 鼠标移入显示信息
   * param info   设施点信息
   * param type   类型  c：聚合点 m：marker点
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
    // 10 为左边padding
    this.infoWindowLeft = offset.offsetX + 10 + pixel.x + 'px';
    this.infoWindowTop = _top + 'px';
    this.isShowInfoWindow = true;
  }

  /**
   * 缩小
   */
  public zoomOut() {
    this.mapService.zoomIn();
  }

  /**
   * 放大
   */
  public zoomIn() {
    this.mapService.zoomOut();
  }

  /**
   * 刷新数据
   */
  public refreshSelectPageData(): void {
    // 搜索逻辑
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
    // 排序逻辑
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
   * 初始化选择器配置
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
        // 操作
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
        // 加入被选容器
        if (currentItem) {
          if (this.checkFacilityCanDelete(currentItem)) {
            return;
          }
          // 找到要删除的项目
          const index = this.selectData.findIndex(item => item.deviceId === currentItem.deviceId);
          this.selectData.splice(index, 1);
          this.childCmp.checkStatus();
          // 删除完刷新被选数据
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
   * 初始化地图
   */
  public initMap(): void {
    // 实例化地图服务类
    if (this.mapType === 'baidu') {
      this.mapService = new BMapPlusService();
      this.mapService.createPlusMap('_mapContainer');
      this.mapService.addEventListenerToMap();
      this.maxZoom = GMapConfig.maxZoom;
      this.mapService.addLocationSearchControl('_suggestId', '_searchResultPanel');
      this.addEventListenerToMap();
      // 实例化鼠标绘制工具
      // @ts-ignore
      this.mapDrawUtil = new BMapDrawingService(this.mapService.mapInstance);
    } else {
      this.maxZoom = GMapConfig.maxZoom;
      // this.mapService = new GMapPlusService();
      this.mapService.createPlusMap('_mapContainer');
      // 实例化鼠标绘制工具
      // @ts-ignore
      this.mapDrawUtil = new GMapDrawingService(this.mapService.mapInstance);
    }
    // 添加缩放结束事件
    this.mapService.addZoomEnd(() => {
      this.isShowInfoWindow = false;
    });
    this.mapInstance = this.mapService.mapInstance;
    this.mapService.mapInstance.setMapStyleV2({
      styleId: '44dc7b975692cc3a4c9d3e7330dd21cf'
    });
    this.mapDrawUtil.setDrawingMode(null);
    // 添加鼠标绘制工具监听事件，用于获取绘制结果
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
   * 获取当前用户的有权限的区域列表
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
   * 获取框选的点
   */
  private getOverlayPath() {
    const box = this.overlays[this.overlays.length - 1];

    if (box.getPath && this.mapType === 'baidu') {
      const pointArray = box.getPath();
      // this.mapInstance.setViewport(pointArray); // 调整视野
      const bound = this.mapInstance.getBounds(); // 地图可视区域
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
            // 如果为多重设备，则添加其子集所有设备
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
      // 谷歌地图
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
   * 获取所有的设备点
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
      // 默认该区域下没有设施
      this.areaNotHasDevice = true;
      this.facilityData.forEach(item => {
        item._deviceType = CommonUtil.codeTranslate(DeviceTypeEnum, this.$i18n, item.deviceType);
        if (item.areaId === this.areaId) {
          item.checked = true;
          // 该区域下有设施
          this.areaNotHasDevice = false;
          this.firstData.push(item);
          this.pushToTable(item);
        }
      });
      this.queryCountDevice();
      this.refreshSelectPageData();
      // this.addMarkers(this.facilityData);
      // 创建区域点事件
      this.initAreaPoint();
      // 查询地图设施区域数据
      this.queryDeviceArea();
    }, () => {
      // this.$modalService.remove();
      this.hideProgressBar();
    });
  }

  /**
   * 查询设施总数
   */
  public queryCountDevice() {
    this.$facilityCommonService.countDeviceAreaList().subscribe((result: Result) => {
      if (result.code === ResultCodeEnum.success) {
        this.treeNodeSum = result.data;
      }
    });
  }

  /**
   * 关联设施
   * param body
   */
  private setAreaDevice() {
    this.isLoading = true;
    const list = [];
    // 去除已经属于该区域的设施
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


  // todo 区域选择器重构新方法  ////////////////////////////////////////////////////////////

  /**
   * 设施区域数据查询
   */
  public queryDeviceArea() {
    // 加载进度条
    this.showProgressBar();
    // 获取缓存
    const userInfo = SessionUtil.getUserInfo();
    // 创建设施权限变量空集
    this.facilityList = [];
    // 获取缓存中的设施权限
    if (userInfo.role.roleDeviceTypeDto) {
      this.facilityList = userInfo.role.roleDeviceTypeDto.deviceTypes;
    }
    // 固定查询条件
    this.deviceAreaModel.polymerizationType = '1';
    // 区域传空为查询全量
    this.deviceAreaModel.filterConditions.area = [];
    // 设施权限合集
    this.deviceAreaModel.filterConditions.device = this.facilityList;
    // 查询参数
    const testData = this.deviceAreaModel;
    this.$mapStoreService.polymerizationConfig = testData;
    // 接口查询
    this.$mapService.queryDevicePolymerizationList(testData).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        if (result.data.polymerizationData) {
          const data = result.data;
          // 创建区域中心点数据
          const centerPoint = result.data.positionCenter.split(',');
          data['lng'] = +centerPoint[0];
          data['lat'] = +centerPoint[1];
          // 创建区域点坐标
          // 更新标记点
          data.polymerizationData.forEach(item => {
            if (item.positionCenter) {
              const position = item.positionCenter.split(',');
              item.lng = parseFloat(position[0]);
              item.lat = parseFloat(position[1]);
              delete item.positionCenter;
            }
          });
          // 克隆地图区域数据
          this.mapCloneData = CommonUtil.deepClone(data.polymerizationData);
          // 设置地图中心点与层级
          if (centerPoint) {
            this.mapService.setCenterAndZoom(data.lng, data.lat, 8);
          }
          // 关闭进度条
          this.hideProgressBar();
        } else {
          // 如无数据定位到当前城市
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
   * 区域点点击事件
   */
  public areaClickEvent(event, markers) {
    // 查询点击区域cod
    this.areaCode = event.target.customData.code;
    // 区域中心点查询参数
    this.areaCenterModel.filterConditions.area = [];
    this.areaCenterModel.filterConditions.device = this.facilityList;
    this.areaCenterModel.filterConditions.group = [];
    this.areaCenterModel.polymerizationType = '1';
    this.areaCenterModel.codeList = [this.areaCode];
    // 获取设施区域中心点
    this.$mapService.queryDevicePolymerizationsPointCenter(this.areaCenterModel).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success && result.data && result.data.positionCenter) {

        // 设置区域中心点
        const centerPoint = result.data.positionCenter.split(',');
        this.mapService.setCenterAndZoom(centerPoint[0], centerPoint[1], BMapConfig.deviceZoom);
      }
    });
  }


  /**
   * 根据区域查设施
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

        // 清除所有点
        if (this.mapService.mapInstance) {
          this.mapService.mapInstance.clearOverlays();
        }
        if (this.mapService.markerClusterer) {
          this.mapService.markerClusterer.clearMarkers();
        }

        // 判断列表是否有数据
        const map = new Map();
        // 根据deviceId进行判断
        if (this.selectData && this.selectData.length) {
          this.selectData.forEach(item => {
            map.set(item.deviceId, item.deviceId);
          });
        }

        // 创建地图渲染数据
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

        // 创建点
        this.addMarkers(deviceDataList.deviceData);
      }
    });
  }

  /**
   * 获取窗口视图经纬度
   */
  getWindowIsArea() {
    // 获取可视区域
    const bs = this.mapService.mapInstance.getBounds();
    // 可视区域左下角
    const bssw = bs.getSouthWest();
    // 可视区域右上角
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
   *向地图添加点
   */
  public addMarker(facilityData: any[]) {
    if (facilityData) {
      const arr = [];
      // 创建区域点
      if (facilityData.length && facilityData[0].code) {
        facilityData.forEach(item => {
          // 过滤掉无坐标区域掉点
          if (item.lat && item.lng) {
            arr.push(this.mapService.createMarker(item, this.areaPoint, '50-50', 'area'));
          }
        });
        this.mapService.addMarkerClusterer(arr);
      }
    }
  }

  /**
   * 地图添加监听
   */
  public addEventListenerToMap(): void {
    this.mapService.mapEventHook().subscribe(data => {
      const type = data.type;
      // 标记点
      if (type === 'zoomend') {
        // 操作防抖，两秒后执行操作
        this.zoomEnd();
      } else if (type === 'dragend') {
        // 操作防抖，两秒后执行操作
        this.dragEnd();
      }
    });
  }

  /**
   * 设置地图区域点/项目点
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
