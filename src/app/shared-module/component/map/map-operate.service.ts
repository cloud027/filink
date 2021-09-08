import {
  EventEmitter,
  Input,
  Output,
  OnDestroy,
} from '@angular/core';
import * as lodash from 'lodash';
import {CommonUtil} from '../../util/common-util';
import {MapConfig} from './map.config';
import {MapConfig as BMapConfig} from './b-map.config';
import {MapConfig as GMapConfig} from './g-map.config';
import {MapStoreService} from '../../../core-module/store/map.store.service';
import {BMapPlusService} from '../../service/map-service/b-map/b-map-plus.service';
import {BMAP_ARROW, BMAP_DRAWING_POLYLINE, BMAP_DRAWING_RECTANGLE} from '../map-selector/map.config';
import {MapCoverageService} from '../../service/index/map-coverage.service';
import {CloseShowFacilityService} from '../../service/index/close-show-facility.service';
import {BMapDrawingService} from '../../service/map-service/b-map/b-map-drawing.service';
import {GMapDrawingService} from '../../service/map-service/g-map/g-map-drawing.service';
import {SelectGroupService} from '../../service/index/select-group.service';
import {MapServiceUtil} from '../../service/map-service/map-service.util';
import {FilinkMapEnum, MapEventTypeEnum, MapTypeEnum} from '../../enum/filinkMap.enum';
import {bigIconSize} from '../../service/map-service/map.config';
import {AdjustCoordinatesService} from '../../service/index/adjust-coordinates.service';
import {MapLinePointUtil} from '../../util/map-line-point-util';
import {FacilitiesDetailsModel} from '../../../core-module/model/index/facilities-details.model';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {IndexApiService} from '../../../business-module/index/service/index/index-api.service';
// 一定要声明BMap，要不然报错找不到BMap
declare let BMap: any;
declare let BMapLib: any;
declare let google: any;
declare let MarkerClusterer: any;

export class MapOperateService implements OnDestroy {
  // 地图配置
  @Input() mapConfig: MapConfig;
  // 视图类型
  @Input() viewIndex: string;
  // 中心点
  @Input() centerPoint: string;
  // 图标大小   18-24
  @Input() iconSize: string;
  // 要渲染的地图数据
  @Input() data: [];

  // 显示加载读条
  @Output() showProgressBar = new EventEmitter();
  // 关闭加载读条
  @Output() hideProgressBar = new EventEmitter();
  // 地图事件回传
  @Output() mapEvent = new EventEmitter();
  // 鼠标移上去时的提示框
  public isShowInfoWindow: boolean = false;
  // 多重设备点双击列表弹框
  public isShowTableWindow: boolean = false;
  // 上次创建的设施或设备点
  public lastCreatedEquipmentPoint: any[] = [];
  // 其他页面跳转开关
  public isLocation: boolean = false;
  // 绘制类型
  public drawType: string = BMAP_ARROW;
  // 上次创建的设施或设备点
  public lastCreatedPoint: any[] = [];
  // 地图设施/设备类型
  public mapTypeEnum = MapTypeEnum;
  // 区域点和项目回调
  public areaPoint: any;
  // 目标标记点
  public targetMarker;
  // 图表大小
  public _iconSize;
  // 地图方法
  public mapService;
  // 设施marker点事件
  public fn: any;
  // 设备marker点事件
  public en: any;
  // 最大缩放级别
  public maxZoom: number;
  // 默认缩放级别
  public defaultZoom: number;
  // 地图类型
  public mapType: string;
  // 表格数据
  public setData = [];
  // 克隆一份地图区域数据
  public mapCloneData: any;
  // 地图绘画工具
  public mapDrawUtil: any;
  // 覆盖物集合
  public overlays = [];
  // 多重设备列表区域下拉框
  public selectOption: Array<{ label: string, value: number }> = [];
  // 多重设备列表查询数据
  public equipmentListData: Array<FacilitiesDetailsModel> = [];
  // 定位Id
  public locationId: string;
  // 是否为定位
  public locationType: boolean = false;
  public selectGroup: boolean = false;
  public adjustCoordinates: boolean = false;
  public polylineSet: any;
  public coordinatesData = [];
  // 重置多个设施/设备
  public targetMarkerArr = [];
  // 关闭订阅流
  public destroy$ = new Subject<void>();

  constructor(public $mapStoreService: MapStoreService,
              public $mapCoverageService: MapCoverageService,
              public $selectGroupService: SelectGroupService,
              public $adjustCoordinatesService: AdjustCoordinatesService,
              public $closeShowFacilityService: CloseShowFacilityService,
              public $mapLinePointUtil: MapLinePointUtil,
              public $indexApiService: IndexApiService) {
  }

  /**
   * 缩放防抖
   */
  zoomEnd = lodash.debounce(() => {
    // 地图缩放时会自动重置框选绘画工具类
    // 缩放默认关闭框选触发
    this.selectGroup = false;
    this.clearAll();
    if (!this.mapService) {
      return;
    }
    // 缩放到区域级别关闭其他页面跳转定位开关
    if (this.mapService.getZoom() <= BMapConfig.areaZoom) {
      this.locationType = false;
    }
    // 清除设施或设备以外所有的点
    if (this.mapService.markerClusterer && this.locationType === false) {
      if (this.mapService.mapInstance) {
        this.mapService.mapInstance.clearOverlays();
      }
      if (this.mapService.markerClusterer) {
        this.mapService.markerClusterer.clearMarkers();
      }
    }

    // 缩放层级区级
    if (this.mapService.getZoom() <= BMapConfig.areaZoom) {
      this.showProgressBar.emit();
      this.isLocation = false;
      // 清除设施设备点
      this.clearDeviceListData();
      // 还原设施或设备以外所有的点
      if (this.mapCloneData && this.mapCloneData.length > 0) {
        this.addMarkers(this.mapCloneData);
      } else {
        this.addMarkers(this.data);
      }
      this.locationId = null;
      this.mapEvent.emit({type: MapEventTypeEnum.mapDrag});
      this.hideProgressBar.emit();
    }
    // 缩放层级街道级别
    if (this.mapService.getZoom() > BMapConfig.areaZoom && this.locationType === false) {
      this.showProgressBar.emit();
      // 常规放大
      this.getWindowAreaDatalist().then((resolve: any[]) => {
        if (this.locationId) {
          this.selectMarker(this.locationId);
        }
      });
      this.hideProgressBar.emit();
    }
  }, 100, {leading: false, trailing: true});

  /**
   * 平移防抖
   */
  dragEnd = lodash.debounce(() => {
    this.locationType = false;
    if (this.mapService.getZoom() > BMapConfig.areaZoom) {
      // 获取窗口内的区域下设施设备点数据
      this.showProgressBar.emit();
      this.getWindowAreaDatalist();
      this.hideProgressBar.emit();
      this.locationId = null;
      this.closeOverlayInfoWindow();
      this.resetTargetMarker();
    }
  }, 100, {leading: false, trailing: true});

  public getWindowAreaDatalist(): any {
  }

  /**
   * 初始化百度地图
   */
  initBMap(): void {
    this.mapType = FilinkMapEnum.baiDu;
    try {
      if (!BMap || !BMapLib) {
        // 百度地图资源未加载
        return;
      }
      this.mapService = new BMapPlusService();
      this.mapService.createPlusMap(this.mapConfig.mapId);
      this.mapService.addEventListenerToMap();
      this.mapService.addLocationSearchControl('suggestId', 'searchResultPanel');
      this.mapService.cityListHook().subscribe(result => {
        this.mapEvent.emit(result);
      });
      this.addEventListenerToMap();
      this.maxZoom = BMapConfig.maxZoom;
      this.defaultZoom = BMapConfig.defaultZoom;
      const size = this.mapConfig.defaultIconSize.split('-');
      this._iconSize = this.mapService.createSize(size[0], size[1]);
      this.mapService.setCenterPoint();
      this.mapService.mapInstance.setMapStyleV2({
        styleId: '44dc7b975692cc3a4c9d3e7330dd21cf'
      });
      // 实例化鼠标绘制工具
      this.mapDrawUtil = new BMapDrawingService(this.mapService.mapInstance);
      this.addEventListener();
      this.addMarkers(this.data);
      this.mapService.setCenterAndZoom(this.centerPoint[0], this.centerPoint[1], 8);

    } catch (e) {
      // 百度地图资源未加载
    }
  }

  /**
   * 初始化谷歌地图
   */
  initGMap() {
    this.mapType = FilinkMapEnum.google;
    try {
      if (!google || !MarkerClusterer) {
        // 谷歌地图资源未加载
        return;
      }
      // this.mapService = new GMapPlusService();
      this.mapService.createPlusMap(this.mapConfig.mapId);
      this.mapService.addEventListenerToMap();
      this.addEventListenerToMap();
      this.maxZoom = GMapConfig.maxZoom;
      this.defaultZoom = GMapConfig.defaultZoom;
      const size = this.mapConfig.defaultIconSize.split('-');
      this._iconSize = this.mapService.createSize(size[0], size[1]);
      // 实例化鼠标绘制工具
      this.mapDrawUtil = new GMapDrawingService(this.mapService.mapInstance);
      this.addMarkers(this.data);
    } catch (e) {
      // 谷歌地图资源未加载
    }
  }

  /**
   * 创建绘画工具
   */
  public changChooseUtil() {
    this.$selectGroupService.eventEmit.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value.isShow === true) {
        this.selectGroup = true;
        this.chooseUtil('rectangle');
      }
      if (value.isShow === false) {
        this.selectGroup = false;
        this.clearAll();
      }
    });
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
    } else if (event === BMAP_DRAWING_POLYLINE) {
      this.mapDrawUtil.open();
      this.mapDrawUtil.setDrawingMode(BMAP_DRAWING_POLYLINE);
    } else if (event === BMAP_ARROW) {
      this.mapDrawUtil.setDrawingMode(null);
      this.mapDrawUtil.close();
    }
  }

  /**
   * 地图添加监听
   */
  public addEventListenerToMap(): void {
    this.mapService.mapEventHook().subscribe(data => {
      const type = data.type;
      // 如果在进行坐标调整，默认不重新请求数据
      if (this.adjustCoordinates) {
        return;
      }
      // 标记点
      if (type === 'zoomend') {
        this.closeShowFacility();
        // 操作防抖，两秒后执行操作
        this.zoomEnd();
        this.hideInfoWindow();
        this.hiddenShowTableWindow();
      } else if (type === 'dragend') {
        this.closeShowFacility();
        // 操作防抖，两秒后执行操作
        this.isLocation = false;
        this.dragEnd();
        this.hideInfoWindow();
        this.hiddenShowTableWindow();
        this.mapEvent.emit({type: 'mapDrag'});
      } else if (type === 'click') {
        this.closeShowFacility();
        this.resetTargetMarker();
        this.resetAllTargetMarker();
        this.closeOverlayInfoWindow();
        this.locationId = null;
        this.hiddenShowTableWindow();
        this.mapEvent.emit({type: 'mapBlackClick'});
        this.isLocation = false;
        this.hideInfoWindow();
        this.closeShowFacility();
      }
    });
  }

  /**
   *添加监听并获取数据
   */
  public addEventListener(): void {
  }

  /**
   * 向地图中添加点
   * param {any[]} facilityData
   */
  public addMarkers(data: any) {
    if (data && data.length) {
      const arr = [];
      const markerType = this.markerType(data);
      // 创建区域点
      if (markerType && data[0].code !== null) {
        data.forEach(item => {
          // 过滤掉无坐标区域掉点
          if (item.lat && item.lng) {
            arr.push(this.mapService.createMarker(item, this.areaPoint, this.iconSize, markerType));
          }
        });
        this.mapService.addMarkerClusterer(arr);
      } else {
        // 创建设施/设备点
        data.forEach(_item => {
          if (_item.show === true) {
            arr.push(this.mapService.createMarker(_item, this.fn, this.iconSize));
          }
        });
        this.mapService.addMarkerClusterer(arr);
        return arr;
      }
    }
  }

  /**
   * 判断当前类型
   */
  public markerType(data) {
    if (data[0].code) {
      return 'area';
    } else if (data[0].planId) {
      return 'plan';
    } else if (data[0].projectId) {
      return 'project';
    } else {
      return null;
    }
  }

  /**
   * 清除所有的覆盖物
   */
  public clearAll(): void {
    for (let i = 0; i < this.overlays.length; i++) {
      this.mapService.removeOverlay(this.overlays[i]);
    }
    this.overlays.length = 0;
    this.drawType = BMAP_ARROW;
    this.mapDrawUtil.close();
    this.mapDrawUtil.setDrawingMode(null);
  }

  /**
   * 清除设施设备点
   */
  public clearDeviceListData(): void {
    // 清除设施设备点
    if (this.lastCreatedPoint.length) {
      this.lastCreatedPoint.forEach(item => {
        this.mapService.updateMarker('delete', item);
      });
      this.mapService.mapInstance.clearOverlays();
      this.mapService.markerClusterer.clearMarkers();
    }
    if (this.lastCreatedEquipmentPoint.length) {
      this.lastCreatedEquipmentPoint.forEach(item => {
        this.mapService.updateMarker('delete', item);
      });
      this.mapService.mapInstance.clearOverlays();
      this.mapService.markerClusterer.clearMarkers();
    }
    this.$mapStoreService.mapDeviceList = [];
    this.$mapStoreService.mapEquipmentList = [];
    this.lastCreatedPoint = [];
    this.lastCreatedEquipmentPoint = [];
    const markerMap = this.mapService.getMarkerMap();
    // 清除除区域点以外的数据
    markerMap.forEach((value) => {
      markerMap.delete(value.marker.isShow.id);
    });
  }

  /**
   * 样式重置清空
   */
  public closeOverlayInfoWindow(): void {
    if (this.targetMarker) {
      this.resetTargetMarker();
    }
    if (this.targetMarkerArr && this.targetMarkerArr.length) {
      this.resetAllTargetMarker();
    }
    this.targetMarker = null;
    this.targetMarkerArr = [];
  }

  /**
   * 关闭多个设备列表弹窗
   */
  public hiddenShowTableWindow(): void {
    this.isShowTableWindow = false;
    this.setData = [];
    this.equipmentListData = [];
    // 清空下拉框
    this.selectOption = [];
  }

  /**
   * 设施选中
   */
  public selectMarker(id?: string): void {
    // 重置之前的样式
    this.resetTargetMarker();
    // 拿到标记点
    const marker = this.mapService.getMarkerById(id);
    let imgUrl;
    // 地图缓存的数据
    const data = this.mapService.getMarkerDataById(id);
    if (!data) {
      return;
    }
    if (data.facilityType === this.mapTypeEnum.device) {
      // 获取设施图标
      imgUrl = CommonUtil.getFacilityIconUrl(bigIconSize, data.deviceType);
    } else if (data.facilityType === this.mapTypeEnum.equipment) {
      // 获取设备图标
      // 如果为设备传送设备型号
      imgUrl = CommonUtil.getEquipmentTypeIconUrl(bigIconSize, data.equipmentType, '0', data.equipmentList);
    }
    // 切换大图标
    const _icon = this.mapService.toggleBigIcon(imgUrl);
    marker.setIcon(_icon);
    // 选中图标置顶
    marker.setTop(true);
    // 为图标样式重置保存上一次数据
    this.targetMarker = marker;
  }

  /**
   * 关闭设施展示
   */
  public closeShowFacility(): void {
    this.$closeShowFacilityService.eventEmit.emit({isShow: false});
  }

  /**
   * 鼠标移出隐藏信息
   */
  public hideInfoWindow(): void {
    this.isShowInfoWindow = false;
  }

  /**
   * 重置之前选中marker点样式
   */
  public resetTargetMarker(): void {
    // 关闭多重设施列表
    if (this.targetMarker) {
      // 获取地图中数据
      const data = this.mapService.getMarkerDataById(this.targetMarker.customData.id);
      if (!data) {
        return;
      }
      let imgUrl;
      if (data.facilityType === this.mapTypeEnum.device && !data.pointId) {
        // 设施图标替换为选中状态
        imgUrl = CommonUtil.getFacilityIconUrl(this.iconSize, data.deviceType, data.deviceStatus);
      } else if (data.facilityType === this.mapTypeEnum.equipment) {
        // 设备图标替换为选中状态
        imgUrl = CommonUtil.getEquipmentTypeIconUrl(this.iconSize, data.equipmentType, data.equipmentStatus, data.equipmentList);
      } else if (data.pointId) {
        imgUrl = CommonUtil.getFacilityPointIconUrl(this.iconSize, data.deviceType, data.pointStatus);
      } else {
        return;
      }
      // 切换地图中图标
      const _icon = this.mapService.getIcon(imgUrl, this._iconSize);
      this.targetMarker.setIcon(_icon);
      this.targetMarker.setTop(false);
      // 设置图标禁止拖动
      this.targetMarker.disableDragging();
    }
  }

  /**
   * 重置多个设施/设备样式
   */
  public resetAllTargetMarker(): void {
    // 关闭多重设施列表
    if (this.targetMarkerArr && this.targetMarkerArr.length > 0) {
      this.targetMarkerArr.forEach(item => {
        // 获取地图中数据
        const data = this.mapService.getMarkerDataById(item.customData.id);
        if (!data) {
          return;
        }
        let imgUrl;
        if (data.facilityType === this.mapTypeEnum.device) {
          // 设施图标替换为选中状态
          imgUrl = CommonUtil.getFacilityIconUrl(this.iconSize, data.deviceType, data.deviceStatus);
        } else if (data.facilityType === this.mapTypeEnum.equipment) {
          // 设备图标替换为选中状态
          imgUrl = CommonUtil.getEquipmentTypeIconUrl(this.iconSize, data.equipmentType, data.equipmentStatus, data.equipmentList);
        } else {
          return;
        }
        // 切换地图中图标
        const _icon = this.mapService.getIcon(imgUrl, this._iconSize);
        item.setIcon(_icon);
        item.setTop(false);
        // 设置图标禁止拖动
        item.disableDragging();
      });
    }
  }

  /**
   * 地图可视区域内的点
   */
  public getOverlayPath(): void {
    const box = this.overlays[this.overlays.length - 1];
    if (box.getPath && this.mapType === 'baidu') {
      const pointArray = box.getPath();
      const bound = this.mapService.mapInstance.getBounds(); // 地图可视区域
      const dataList = [];
      this.coordinatesData = [];
      this.mapService.getMarkerMap().forEach(value => {
        if (bound.containsPoint(value.marker.point) === true) {
          if (MapServiceUtil.isInsidePolygon(value.marker.point, pointArray) && value.data.facilityId) {
            dataList.push(value.data);
          }
        }
      });
      if (dataList.length > 0 && this.selectGroup) {
        this.$selectGroupService.eventEmit.emit({datas: dataList, showCoverage: this.$mapCoverageService.showCoverage});
      }
      if (dataList.length > 0 && this.adjustCoordinates) {
        this.$adjustCoordinatesService.eventEmit.emit({
          datas: dataList,
          showCoverage: this.$mapCoverageService.showCoverage,
        });
      }
    } else if (box.getPath && this.mapType === 'google') {
      // 谷歌地图
      const dataList = [];
      const point = box.getBounds();
      this.mapService.getMarkerMap().forEach(value => {
        if (point.contains(value.marker.position)) {
          dataList.push(value.data);
        }
      });
      if (dataList.length > 0) {
        this.$selectGroupService.eventEmit.emit({datas: dataList});
      }
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
