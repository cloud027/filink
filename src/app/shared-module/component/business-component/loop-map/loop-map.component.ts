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
  ViewChild
} from '@angular/core';
import * as _ from 'lodash';
import {CommonUtil} from '../../../util/common-util';
import {NzI18nService} from 'ng-zorro-antd';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {MapConfig as BMapConfig} from '../../map/b-map.config';
import {MapConfig} from '../../map/map.config';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {QueryConditionModel} from '../../../model/query-condition.model';
import {Router} from '@angular/router';
import {FacilityService} from '../../../../core-module/api-service/facility/facility-manage';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {FiLinkModalService} from '../../../service/filink-modal/filink-modal.service';
import {MapStoreService} from '../../../../core-module/store/map.store.service';
import {BMapPlusService} from '../../../service/map-service/b-map/b-map-plus.service';
import {BMAP_ARROW, BMAP_DRAWING_RECTANGLE} from '../../map-selector/map.config';
import {MapCoverageService} from '../../../service/index/map-coverage.service';
import {ResultModel} from '../../../model/result.model';
import {ResultCodeEnum} from '../../../enum/result-code.enum';
import {AreaFacilityModel} from '../../../../business-module/index/shared/model/area-facility-model';
import {SelectGroupService} from '../../../service/index/select-group.service';
import {FacilityShowService} from '../../../service/index/facility-show.service';
import {BMapDrawingService} from '../../../service/map-service/b-map/b-map-drawing.service';
import {MapServiceUtil} from '../../../service/map-service/map-service.util';
import {GMapDrawingService} from '../../../service/map-service/g-map/g-map-drawing.service';
import {LanguageEnum} from '../../../enum/language.enum';
import {FilinkMapEnum, MapEventTypeEnum, MapTypeEnum, TipWindowType} from '../../../enum/filinkMap.enum';
import {DeployNameEnum, DeviceStatusEnum, DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {AlarmLevelEnum} from '../../../../core-module/enum/alarm/alarm-level.enum';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {MapService} from '../../../../core-module/api-service/index/map';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {AreaLevelEnum} from '../../../../core-module/enum/area/area.enum';
import {LoopListModel} from '../../../../core-module/model/loop/loop-list.model';
import {OperatorEnum} from '../../../enum/operator.enum';
import {bigIconSize} from '../../../service/map-service/map.config';
import {IndexAlarmLevelModel} from '../../../../core-module/model/index/index-alarm-level-model';
import {AlarmListHomeModel} from '../../../../business-module/index/shared/model/alarm-list-home-model';
import {SessionUtil} from '../../../util/session-util';
import {IndexApiService} from '../../../../business-module/index/service/index/index-api.service';
import {AlarmAreaModel} from '../../../../business-module/index/shared/model/alarm-area.model';
import {Subject} from 'rxjs';
// 一定要声明BMap，要不然报错找不到BMap
declare let BMap: any;
declare let BMapLib: any;
declare let google: any;
declare let MarkerClusterer: any;

@Component({
  selector: 'loop-map',
  templateUrl: './loop-map.component.html',
  styleUrls: ['./loop-map.component.scss']
})
export class LoopMapComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  // 是否来自智慧照明
  @Input() isFromLight: boolean = false;
  // 地图配置
  @Input() mapConfig: MapConfig;
  // 要渲染的地图数据
  @Input() data: any[];
  // 图标大小   18-24
  @Input() iconSize: string;
  //  区域数据
  @Input() areaData: any[];
  // 中心点
  @Input() centerPoint: string;
  // 所选回路
  @Input()
  public selectedLoop: LoopListModel[];
  // 地图事件回传
  @Output() mapEvent = new EventEmitter();
  // 地图模板
  @ViewChild('mapRef') map: ElementRef;
  // 图表大小
  public _iconSize;
  // 地图方法
  public mapService;
  // 信息框
  public infoData = {
    type: '',
    data: null
  };
  // 信息框左边位置
  public infoWindowLeft = '0';
  // 信息框上边位置
  public infoWindowTop = '0';
  // 鼠标移上去时的提示框
  public isShowInfoWindow = false;
  // 目标标记点
  public targetMarker;
  // 搜索框值
  public inputValue: string;
  // 地址搜索框值
  public addressInputValue: string;
  // 下拉框
  public options: any[] = [];
  // 首页国际化
  public indexLanguage: IndexLanguageInterface;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 搜索类型名称
  public searchTypeName;
  // 国际化
  public inspectionLanguage: InspectionLanguageInterface;
  // 地图类型
  public mapSearchObj = {
    facilityNameIndex: 1,
    bMapLocationSearch: -1,
    gMapLocationSearch: -1,
  };
  // 设施marker点事件
  public fn: any;
  // 设备marker点事件
  public en: any;
  // 百度地图聚合点回调
  public cb: any;
  // 区域点和项目回调
  public areaPoint: any;
  // 回路线条事件
  public loopEvent: any;
  // 谷歌地图地理位置搜索框
  public searchKey = '';
  // 地图类别id
  public mapTypeId: string;
  // 地图类型
  public mapType;
  // 新增弹出框显示隐藏
  public isVisible = false;
  // 光缆标题
  public title: string;
  // 传参条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 国际化
  public language: FacilityLanguageInterface;
  // 语言类型
  public typeLg;
  // 区域下设施数据模型
  public areaFacilityModel = new AreaFacilityModel;
  // 设施点数据集合
  public deviceDataList;
  // 地图分层设施类型
  public deviceList: string[] = [];
  // 地图分层设施类型
  public equipmentList: string[] = [];
  // 克隆一份地图区域数据
  public mapCloneData: any;
  // 地图绘画工具
  public mapDrawUtil;
  // 绘制类型
  public drawType: string = BMAP_ARROW;
  // 覆盖物集合
  public overlays = [];
  // 当前地图分层类型
  public currentMapLevel;
  // 多重设备列表区域下拉框
  public selectOption;
  // 多重设备列表查询条件
  public queryConditions = [];
  // 定位区域
  public locationArea;
  // 定位Id
  public locationId: string;
  // 是否为定位
  public locationType = false;
  // 上次创建的设施或设备点
  public lastCreatedPoint = [];
  // 上次创建的设施或设备点
  public lastCreatedEquipmentPoint = [];
  // 回路画线数据保存
  public loopDrawLineData = [];
  // 其他页面跳转开关
  public isLocation: boolean = false;
  // 地图设施/设备类型
  public mapTypeEnum = MapTypeEnum;
  // 浮窗类型
  public windowType = TipWindowType;
  // 回路数据
  public loopInfo = [];
  // 区域中心点模型
  public areaCenterModel: AreaFacilityModel = new AreaFacilityModel;
  // 告警权限
  public roleAlarm: boolean = false;
  // 区域点告警个数
  public loadingAlarm: boolean = false;
  // 区域点个数
  public loadingEquipment: boolean = false;
  // 窗口视图的经纬度
  public points = [];
  // 关闭订阅流
  private destroy$ = new Subject<void>();
  /**
   * 缩放防抖
   */
  zoomEnd = _.debounce(() => {
    // 清除设施或设备以外所有的点
    if (this.mapService.markerClusterer && this.locationType === false) {
      if (this.mapService.mapInstance) {
        //  this.mapService.mapInstance.clearOverlays();
      }
      if (this.mapService.markerClusterer) {
        this.mapService.markerClusterer.clearMarkers();
      }
    }
    // 缩放到区域级别关闭其他页面跳转定位开关
    if (this.mapService.getZoom() <= BMapConfig.areaZoom) {
      this.locationType = false;
    }
    // 缩放层级区级
    if (this.mapService.getZoom() <= BMapConfig.areaZoom) {
      this.addMarkers(this.data);
      this.isLocation = false;
      this.locationId = null;
      //  this.mapEvent.emit({type: MapEventTypeEnum.mapDrag});
    }
    // this.loopDrawLine(this.loopDrawLineData);
    // 缩放层级街道级别
    if (this.mapService.getZoom() > BMapConfig.areaZoom && this.locationType === false) {
      // 常规放大
      this.getWindowAreaDetailList(this.locationArea).then(() => {
        // this.loopDrawLine(this.loopDrawLineData);
      });
      // 有不调用接口的场景，通过判断promise有没有返回值规避then方法报undefined
      // if (promise) {
      //   this.getWindowAreaDetailList(this.locationArea).then((resolve: any[]) => {
      //     if (this.locationId) {
      //       this.onSelectMarker(this.locationId);
      //     }
      //   });
      // }
    }
    // 是否为定位缩放判断
  }, 100, {leading: false, trailing: true});

  /**
   * 平移防抖
   */
  dragEnd = _.debounce(() => {
    this.locationType = false;
    if (this.mapService.getZoom() > BMapConfig.areaZoom) {
      // 获取窗口内的区域下设施设备点数据
      this.getWindowAreaDetailList().then();
    }
  }, 100, {leading: false, trailing: true});
  /**
   * 查询设施名称
   */
  queryDeviceDrop = _.debounce((value) => {
    this.queryDeviceByName(value);
  }, 500, {leading: false, trailing: true});
  private newCenterPoint: { lng: string; lat: string }[];
  private isClick: any;

  constructor(private $nzI18n: NzI18nService,
              private $indexApiService: IndexApiService,
              private $mapStoreService: MapStoreService,
              private $el: ElementRef,
              private $router: Router,
              private $facilityService: FacilityService,
              private $modalService: FiLinkModalService,
              private $mapCoverageService: MapCoverageService,
              private $indexMapService: MapService,
              private $selectGroupService: SelectGroupService,
              private $facilityShowService: FacilityShowService,
              private $message: FiLinkModalService,
  ) {
  }

  public ngOnInit(): void {
    // 初始化国际化
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
    this.searchTypeName = this.indexLanguage.searchDeviceName;
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.inspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    // 语言类型
    this.typeLg = JSON.parse(localStorage.getItem('localLanguage'));
    // 告警权限查询
    this.roleAlarm = SessionUtil.checkHasRole('02');
    this.mapTypeId = 'roadmap';
    this.title = this.indexLanguage.chooseFibre;
    // 默认是设施
    this.currentMapLevel = this.$mapCoverageService.showCoverage;
    // 创建设施点事件
    this.setDeviceEvent();
    // 创建区域点事件
    this.setAreaEvent();
    // 初始化线条事件
    this.setLoopLineEvent();
    // 创建绘画工具类
    this.changChooseUtil();
  }

  public ngAfterViewInit(): void {
    // 如果传入的配置信息为空需要给个提示信息
    if (!this.mapConfig) {
      return;
    }
    // 如果未设置地图显示的位置容器
    if (!this.mapConfig.mapId) {
      return;
    } else {
      // 实力化地图到容器
      this.map.nativeElement.setAttribute('id', this.mapConfig.mapId);
    }
    // 地图类型
    this.mapType = this.mapConfig.mapType;
    // 谷歌地图
    if (this.mapType === FilinkMapEnum.google) {
      this.initGMap();
    } else if (this.mapType === FilinkMapEnum.baiDu) {
      // 百度地图
      this.initBMap();
    } else {
      return;
    }
    // 地图分层过滤设施类型
    this.currentMapLevel = this.$mapCoverageService.showCoverage ? this.$mapCoverageService.showCoverage : this.mapTypeEnum.facility;
  }

  /**
   * 监听数据的变化情况
   */
  public ngOnChanges(changes: SimpleChanges): void {
    // 监听中中心点的变化
    if (this.mapService) {
      if (changes.centerPoint && changes.centerPoint.currentValue.length > 1) {
        // this.mapService.setCenterAndZoom(this.centerPoint[0], this.centerPoint[1], 9);
      } else {
        // 默认定位到当前的地市
        this.mapService.locateToUserCity();
      }
    }
  }

  /**
   * 组件销毁需要清除
   */
  public ngOnDestroy(): void {
    if (this.mapService) {
      this.clearDeviceListData();
      this.mapService.mapInstance.clearOverlays();
      if (this.mapService.markerClusterer) {
        this.mapService.markerClusterer.clearMarkers();
      }
      this.mapService.clearMarkerMap();
      this.mapService.destroy();
    }
    this.zoomEnd.cancel();

  }

  /**
   * 初始化百度地图
   */
  private initBMap(): void {
    this.mapType = FilinkMapEnum.baiDu;
    try {
      if (!BMap || !BMapLib) {
        // 百度地图资源未加载
        return;
      }
      this.mapService = new BMapPlusService();
      this.mapService.createPlusMap(this.mapConfig.mapId);
      this.mapService.addEventListenerToMap();
      // 初始化百度搜索框样式
      this.mapService.addLocationSearchControl('addressSearch', 'searchResultOption');
      this.mapService.cityListHook().subscribe(result => {
        this.mapEvent.emit(result);
      });
      this.addEventListenerForMap();
      const size = this.mapConfig.defaultIconSize.split('-');
      this._iconSize = this.mapService.createSize(size[0], size[1]);
      this.mapService.setCenterPoint();
      this.mapService.mapInstance.setMapStyleV2({
        styleId: '44dc7b975692cc3a4c9d3e7330dd21cf'
      });
      // 实例化鼠标绘制工具
      this.mapDrawUtil = new BMapDrawingService(this.mapService.mapInstance);
      this.addEventListener();
      // 添加点位
      this.addMarkers(this.data);
      // 设置中心点
      // this.mapService.setCenterAndZoom(this.centerPoint[0], this.centerPoint[1], 8);
    } catch (e) {
    }
  }

  private initGMap(): void {
    try {
      if (!google || !MarkerClusterer) {
        // 谷歌地图资源未加载
        return;
      }
      // this.mapService = new GMapPlusService();
      this.mapService.createPlusMap(this.mapConfig.mapId);
      this.mapService.addEventListenerToMap();
      this.addEventListenerForMap();
      const size = this.mapConfig.defaultIconSize.split('-');
      this._iconSize = this.mapService.createSize(size[0], size[1]);
      // 实例化鼠标绘制工具
      this.mapDrawUtil = new GMapDrawingService(this.mapService.mapInstance);
      this.addMarkers(this.data);
    } catch (e) {
    }
  }


  /**
   * 向地图中添加点
   * param {any[]} markerDataList
   */
  public addMarkers(markerDataList: any): void {
    if (!_.isEmpty(markerDataList)) {
      const arr = [];
      // 创建区域点如果有code就是区域点
      if (markerDataList[0].code) {
        markerDataList.forEach(item => {
          // 将存在经纬度的区域数据存放到数组中
          if (item.lat && item.lng) {
            // 添加区域点
            arr.push(this.mapService.createMarker(item, this.areaPoint, this.iconSize, 'area'));
          }
        });
      } else {
        // 绘制设施点
        markerDataList.forEach(row => {
          if (row.show) {
            arr.push(this.mapService.createMarker(row, this.fn, this.iconSize));
          }
        });
      }
      /*   const zoom = this.mapService.getZoom();
         if (zoom > 11) {
           Promise.resolve().then(() => {
             this.mapService.addMarkerClusterer(arr, null , false, zoom);
           });
         } else {*/
      this.mapService.addMarkerClusterer(arr);
      //
      //  }
    }
  }

  /**
   * 监听input
   */
  public onInput(value: string): void {
    const _value = value.trim();
    this.queryDeviceDrop(_value);
  }

  /**
   * 设施选中操作
   */
  public onSelectMarker(id?: string): void {
    this.setMarkerStyleCommon(id);
  }

  /**
   * 点击图标公共操作
   */
  private setMarkerStyleCommon(id?: string): void {
    // 重置之前的样式
    if (!id) {
      this.resetTargetMarker();
    }
    // 拿到标记点
    const marker = this.mapService.getMarkerById(id);
    let imgUrl;
    // 地图缓存的数据
    const data = this.mapService.getMarkerDataById(id);
    if (!data) {
      return;
    }
    // 设施图标设施
    if (data.facilityType === this.mapTypeEnum.device) {
      // 如果是配电箱就图标不变
      if (data.deviceType === DeviceTypeEnum.distributionPanel) {
        return;
      } else {
        // 如果不是配电箱就放大图标
        imgUrl = CommonUtil.getFacilityIconUrl(bigIconSize, data.deviceType);
      }
    }
    // 切换大图标
    const iconStyle = this.mapService.toggleBigIcon(imgUrl);
    marker.setIcon(iconStyle);
    // 选中图标置顶
    marker.setTop(true);
    this.targetMarker = marker;
  }

  /**
   * marker点点击事件
   * param event
   */
  private markerClickEvent(id, data): void {
    this.locationId = id;
    // 重置之前的样式
    this.setMarkerStyleCommon(id);
    // 为图标样式重置保存上一次数据
    this.targetMarker = this.mapService.getMarkerById(id);
    // 平移中心点
    this.mapService.panTo(data.lng, data.lat);
    if (data.deviceType === DeviceTypeEnum.wisdom) {
      this.mapEvent.emit({
        type: MapEventTypeEnum.selected,
        id: id,
        idData: {
          deviceId: data['equipmentName'] ? null : data['deviceId'],
          name: data['equipmentName'] ? data['equipmentName'] : data['deviceName'],
        },
        facilityCode: data.deviceType,
        facilityType: data.facilityType
      });
    }
  }


  /**
   * 重置marker点样式为初始状态
   */
  private resetTargetMarker(): void {
    // 关闭多重设施列表
    if (this.targetMarker) {
      // 获取地图中数据
      const data = this.mapService.getMarkerDataById(this.targetMarker.customData.id);
      if (!data) {
        return;
      }
      let imgUrl;
      if (data.facilityType === this.mapTypeEnum.device) {
        // 取消删除状态
        imgUrl = CommonUtil.getFacilityIconUrl(this.iconSize, data.deviceType, data.deviceStatus);
        // 还原图标
        const _icon = this.mapService.getIcon(imgUrl, this._iconSize);
        this.targetMarker.setIcon(_icon);
        this.targetMarker.setTop(false);
      } else {
        return;
      }
    }
  }

  /**
   * 区域点点击事件
   */
  private areaClickEvent(event): void {
    const id = event.target.customData.code;
    const data = this.mapService.getMarkerDataById(id);
    console.log(data);
    this.areaCenterModel.codeList = [data.code];
    // 获取设施区域中心点
    this.$indexMapService.queryDevicePolymerizationsPointCenter(this.areaCenterModel).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success && result.data && result.data.positionCenter) {
        this.mapEvent.emit({type: MapEventTypeEnum.areaPoint, data: result.data.positionCenter});
      }
    }, () => {
      this.$message.warning(this.indexLanguage.networkTips);
    });

  }

  /**
   * 获取告警列表
   */
  public queryPolymerizationAlarmList(info) {
    let polymerizationData = info.polymerizationData;
    // 获取单个区域告警数量
    const alarmData = new AlarmAreaModel();
    alarmData.filterConditions[0].filterField = 'alarm_device_type_id';
    alarmData.filterConditions[0].filterValue = this.$mapStoreService.polymerizationConfig.filterConditions.device;
    this.$mapStoreService.alarmDataConfig = alarmData;
    this.$mapStoreService.alarmDataConfig.areaCodes = [info.code];
    // 设施的区域接口
    if (this.roleAlarm) {
      return new Promise((resolve, reject) => {
        this.$indexApiService.queryPolymerizationAlarmList(this.$mapStoreService.alarmDataConfig).subscribe((result: ResultModel<AlarmListHomeModel[]>) => {
          if (result.code === 0) {
            if (result.data) {
              result.data.forEach(item => {
                polymerizationData = item.alarmData;
              });
              resolve(polymerizationData);
            }
          }
        }, (error) => {
          reject(polymerizationData);
        });
      });
    }
  }

  /**
   * 获取设施中设备详情数据
   */
  public queryDeviceCountByMap(info) {
    let equipmentData = info.equipmentData;
    // 获取单个区域设备数量
    this.$mapStoreService.polymerizationConfig.filterConditions.area = [info.code];
    let requestHeader;
    requestHeader = this.$indexApiService.queryDeviceCountByMap(this.$mapStoreService.polymerizationConfig);
    return new Promise((resolve, reject) => {
      // 设施/设备的区域接口
      requestHeader.subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          if (result.data) {
            // 设备类型排序重组
            equipmentData = FacilityForCommonUtil.equipmentSort(result.data);
            resolve(equipmentData);
          }
        }
      }, (error) => {
        reject(equipmentData);
      });
    });
  }

  /**
   * 返回设备结构数据
   */
  public getEquipmentData(info, equipment) {
    if (info.equipmentData) {
      info.equipmentData.forEach(item => {
        const obj = {};
        obj['equipmentType'] = CommonUtil.getEquipmentTypeIcon(item);
        obj['equipmentCount'] = item.count;
        equipment.push(obj);
      });
    }
    this.loadingEquipment = true;
    return equipment;
  }


  /**
   * 返回告警结构数据
   */
  public getAlarmData(info, alarmData) {
    if (info.polymerization) {
      info.polymerization.forEach(item => {
        switch (item.alarmLevel) {
          case AlarmLevelEnum.urgent:
            // 紧急
            alarmData.URGENT = item.count;
            break;
          case AlarmLevelEnum.main:
            // 主要
            alarmData.MAIN = item.count;
            break;
          case AlarmLevelEnum.secondary:
            // 次要
            alarmData.SECONDARY = item.count;
            break;
          case AlarmLevelEnum.prompt:
            // 提示
            alarmData.PROMPT = item.count;
            break;
          default:
            break;
        }
      });
    }
    this.loadingAlarm = true;
    return alarmData;
  }

  /**
   * 模拟title提示框  区域点
   * param e
   */
  private openAInfoWindow(e): void {

    const id = e.target.customData.code;
    const info = this.mapService.getMarkerDataById(id);
    let equipment = [];

    // 判断是否有设备缓存
    if ( info.equipmentData === null) {
      this.queryDeviceCountByMap(info).then(data => {
        info.equipmentData =  data;
        equipment = this.getEquipmentData(info, equipment);
        // 更新缓存
        this.$mapStoreService.updateMarker(info, true);
      });
    } else {
      equipment = this.getEquipmentData(info, equipment);
    }


    // 判断告警数据
    let alarmData = new IndexAlarmLevelModel();
    // 判断是否有告警缓存
    if (info.polymerization === null) {
      this.queryPolymerizationAlarmList(info).then(data => {
        info.polymerization = data;
        alarmData = this.getAlarmData(info, alarmData);
        // 更新缓存
        this.$mapStoreService.updateMarker(info, true);
      });
    } else {
      alarmData = this.getAlarmData(info, alarmData);
    }
    this.infoData = {
      type: TipWindowType.a,
      data: {
        areaName: info.areaName,
        count: info.count,
        equipment: equipment,
        alarmData: alarmData
      }
    };
    this.showInfoWindow(TipWindowType.a, info.lng, info.lat);
  }


  /**
   * 设施设备点浮窗
   * param e
   */
  private openMInfoWindow(e): void {
    let id;
    if (this.mapConfig.mapType === FilinkMapEnum.google) {
      id = e.target.customData.id;
    } else {
      id = e.currentTarget.customData.id;
    }
    const info = this.mapService.getMarkerDataById(id);
    if (!info) {
      return;
    }
    if (info.facilityType === this.mapTypeEnum.device) {
      // 设施点浮窗
      this.deviceWindow(info);
    } else {
      return;
    }
  }

  /**
   * 回路线条浮窗
   */
  private loopLineInfoWindow(e): void {
    const point = e.point;
    // 获取鼠标点两端的设施坐标
    const pointLeft = e.target.vu.Kl;
    const pointRight = e.target.vu.wl;
    // 获取当前回路id
    const loopId = e.currentTarget.data.loopId;
    let loops;
    // 根据坐标找到对应 的设施
    const loopRefDevice = this.loopInfo.find(item => item.loopId === loopId);
    if (loopRefDevice) {
      let deviceIdLeft;
      let deviceRight;
      loopRefDevice.devices.forEach(v => {
        if (String(v.positionBase.lng) === String(pointLeft.lng) && String(v.positionBase.lat)) {
          deviceIdLeft = v;
        }
        if (String(v.positionBase.lng) === String(pointRight.lng) && String(v.positionBase.lat)) {
          deviceRight = v;
        }
      });
      const deviceIdLeftId = deviceIdLeft.deviceId;
      const deviceRightId = deviceRight.deviceId;
      const loopIds = [];
      if (deviceIdLeftId && deviceRightId) {
        this.loopInfo.forEach(v => {
          const index = v.devices.findIndex(item => item.deviceId === deviceIdLeftId);
          const index2 = v.devices.findIndex(item => item.deviceId === deviceRightId);
          if (index >= 0 && index2 >= 0) {
            loopIds.push(v.loopId);
          }
        });
        if (!_.isEmpty(loopIds)) {
          loops = this.selectedLoop.filter(row => loopIds.includes(row.loopId));
        }
      }
    }
    this.infoData = {
      type: TipWindowType.l,
      data: loops,
    };
    this.showInfoWindow(TipWindowType.l, point.lng, point.lat);
  }

  /**
   * 设施点浮窗
   */
  private deviceWindow(info): void {
    // 设备权重排序
    info.equipmentCountInfoList = FacilityForCommonUtil.equipmentSort(info.equipmentCountInfoList);
    // 获取设备状态的图标
    info.equipmentCountInfoList.forEach(item => {
      item['_equipmentStatus'] = CommonUtil.getEquipmentStatusIconClass(item.equipmentStatus).colorClass;
    });
    this.infoData = {
      type: 'm',
      data: {
        deviceName: info.deviceName,
        deviceStatusName: CommonUtil.codeTranslate(DeviceStatusEnum, this.$nzI18n, info.deviceStatus),
        deviceStatusColor: CommonUtil.getDeviceStatusIconClass(info.deviceStatus)
          .colorClass
          .replace('-c', '-bg'),
        areaLevelName: CommonUtil.codeTranslate(AreaLevelEnum, this.$nzI18n, Number(info.areaLevel), LanguageEnum.facility),
        areaLevelColor: CommonUtil.getAreaColor(info.areaLevel),
        areaName: info.areaName,
        address: info.address,
        deployStatusColor: CommonUtil.getDeviceDeployColor('2'),
        deployStatusName: CommonUtil.codeTranslate(DeployNameEnum, this.$nzI18n, DeployNameEnum.built, LanguageEnum.common),
        equipmentCountInfoList: info.equipmentCountInfoList,
      }
    };
    this.showInfoWindow(TipWindowType.m, info.lng, info.lat);
  }

  /**
   * 多重设备列表鼠标移出
   * param event
   */
  private itemMouseOut(event): void {
    this.isShowInfoWindow = false;
  }

  /**
   * 鼠标移入显示信息
   * param info   设施点信息
   * param type   类型  c：聚合点 m：marker点
   */
  private showInfoWindow(type: TipWindowType, lng: string, lat: string): void {
    const pixel = this.mapService.pointToOverlayPixel(lng, lat);
    const currentOffset = this.mapService.getOffset();
    let topPos = currentOffset.offsetY + pixel.y;
    if (type === TipWindowType.c) {
      topPos = topPos - 20;
    } else if (type === TipWindowType.m) {
      const iconHeight = parseInt(this._iconSize.height, 10);
      topPos = topPos - iconHeight + 16;
      if (this.mapType === FilinkMapEnum.google) {
        topPos = topPos - 10;
      }
    } else if (type === TipWindowType.l) {
      topPos = topPos + 25;
      currentOffset.offsetX = currentOffset.offsetX + 30;
    }
    this.infoWindowLeft = currentOffset.offsetX + pixel.x + 'px';
    this.isShowInfoWindow = true;
    this.infoWindowTop = topPos - 20 + 'px';
  }


  /**
   * 鼠标移出隐藏信息
   */
  private hideInfoWindow(): void {
    this.isShowInfoWindow = false;
  }

  /**
   * 地图添加监听
   */
  private addEventListenerForMap(): void {
    this.mapService.mapEventHook().subscribe(data => {
      const type = data.type;
      // 标记点
      if (type === 'zoomend') {
        // 操作防抖，两秒后执行操作
        if (!this.isClick) {
          this.zoomEnd();
        }
        this.hideInfoWindow();
      } else if (type === 'dragend') {
        // 操作防抖，两秒后执行操作
        this.isLocation = false;
        this.dragEnd();
        this.hideInfoWindow();
        this.mapEvent.emit({type: MapEventTypeEnum.mapDrag});
      } else if (type === 'click') {
        this.resetTargetMarker();
        this.mapEvent.emit({type: MapEventTypeEnum.mapBlackClick});
        this.isLocation = false;
        this.hideInfoWindow();
      }
    });
  }

  /**
   * 定位通过id
   * id存在走地图左上搜索框定位,不存在走关注,设施设备列表定位操作
   * */
  public locationById(id: string, deviceOrEquipment?): void {
    let data = {};
    if (id) {
      // 搜索定位
      if (this.options && this.options.length) {
        data = this.options.find(item => item.deviceId === id) || {};
      }
    } else {
      // 设施/设备ID转换为共同ID字段
      data = deviceOrEquipment;
      id = data['deviceId'];
      data['facilityId'] = id;
    }
    if (!data) {
      return;
    }
    // 存储当前设施/设备区域code
    this.locationArea = data['areaCode'];
    // 当前为定位缩放
    this.locationType = true;
    // 存储当前设施/设备ID
    this.locationId = id;
    // 清除地图数据
    if (this.mapService.mapInstance) {
      this.mapService.mapInstance.clearOverlays();
    }
    if (this.mapService.markerClusterer) {
      this.mapService.markerClusterer.clearMarkers();
    }
    // 地图放大到设施/设备层级
    this.mapService.setCenterAndZoom(data['lng'], data['lat'], BMapConfig.maxZoom);
    // 查询当前窗口数据并渲染
    this.getWindowAreaDetailList(this.locationArea).then((resolve: any[]) => {
      // 选中高亮
      this.onSelectMarker(this.locationId);
      this.locationType = false;
    });
    const cloneData = {
      deviceId: data['equipmentName'] ? null : data['deviceId'],
      equipmentId: data['equipmentName'] ? data['equipmentId'] : null,
      equipmentModel: data['equipmentModel'] ? data['equipmentModel'] : null,
      equipmentType: data['equipmentType'] ? data['equipmentType'] : null,
      name: data['equipmentName'] ? data['equipmentName'] : data['deviceName'],
    };
    if (data['deviceType'] === DeviceTypeEnum.wisdom) {
      // 发送状态打开详情卡
      this.mapEvent.emit({
        type: MapEventTypeEnum.selected,
        id: id,
        idData: cloneData,
        facilityCode: data['deviceType'],
        facilityType: data['facilityType']
      });
    }
  }


  /**
   * 获取窗口内的区域下设施设备点数据
   */
  private getWindowAreaDetailList(areaData?) {
    // 获取区域内的区域点
    const areaCode = this.getWindowIsAreaAndFacilityOrEquipment(areaData, this.mapCloneData);
    if (areaCode) {
      // 将操作后区域结果存入缓存，和下次操作结果对比。如完全一致则不调用接口
      this.$mapStoreService.mapAreaComparedList = areaCode;
      // 创建设施点
      if (this.$mapCoverageService.showCoverage === this.mapTypeEnum.facility) {
        return this.getMapDeviceData(areaCode);
      }
    }
  }

  /**
   * 获取窗口视图内的区域或设施设备点
   */
  private getWindowIsAreaAndFacilityOrEquipment(areaData, dataList) {
    const areaCode = [];
    if (areaData) {
      areaCode.push(areaData);
    }
    // 遍历所有区域点，查找在视图区域内的区域点
    if (!_.isEmpty(dataList)) {
      dataList.forEach(item => {
        // 回路不区分视图区域
        areaCode.push(item.code);
      });
    }
    return areaCode;
  }

  /**
   * 清除设施设备点
   */
  private clearDeviceListData(): void {
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
      this.mapService.markerClusterer.clearMarkers();
      this.mapService.mapInstance.clearOverlays();
    }
    this.$mapStoreService.mapEquipmentList = [];
    this.$mapStoreService.mapDeviceList = [];
    this.lastCreatedEquipmentPoint = [];
    this.lastCreatedPoint = [];
  }

  /**
   * 获取设施点
   */
  public getMapDeviceData(areaData, area?) {
    // 获取窗口经纬度
    this.points = this.getWindowIsArea();
    const areaStoreData = this.$mapStoreService.areaSelectedResults || [];
    // 缓存读取筛选条件设施类型数据
    let facilityStoreData = [];
    if (this.$mapStoreService.facilityTypeSelectedResults.length) {
      this.$mapStoreService.facilityTypeSelectedResults.forEach(item => {
        this.$mapStoreService.showFacilityTypeSelectedResults.forEach(v => {
          if (item === v) {
            facilityStoreData.push(v);
          }
        });
      });
      if (!facilityStoreData.length) {
        facilityStoreData = ['noData'];
      }
    } else {
      facilityStoreData = this.$mapStoreService.showFacilityTypeSelectedResults;
    }
    this.areaFacilityModel.polymerizationType = '1';
    this.areaFacilityModel.codeList = areaData;
    this.areaFacilityModel.filterConditions.area = areaStoreData ? areaStoreData : [];
    this.areaFacilityModel.filterConditions.device = facilityStoreData;
    this.areaFacilityModel.filterConditions.area = areaData;
    this.areaFacilityModel.codeList = [];
    this.areaFacilityModel.filterConditions.device = [DeviceTypeEnum.wisdom, DeviceTypeEnum.distributionPanel];
    this.areaFacilityModel.points = this.points;
    return this.queryDeviceByArea(this.areaFacilityModel, area);
  }

  /**
   * 地图缩小
   * 数字越小，级别越高
   */
  public zoomOut(): void {
    this.mapService.zoomIn();

  }
  /**
   * 获取窗口视图经纬度
   */
  public getWindowIsArea() {
    if (!this.mapService.mapInstance) {
      return ;
    }
    // 获取可视区域
    const bs = this.mapService.mapInstance.getBounds();
    // 可视区域左下角
    const bssw = bs.getSouthWest();
    // 可视区域右上角
    const bsne = bs.getNorthEast();
    const area = [
      {
        longitude: bssw.lng,
        latitude: bssw.lat
      },
      {
        longitude: bsne.lng,
        latitude: bsne.lat
      }
    ];
    return area;
  }
  /**
   * 地图放大
   * 数字越大，级别越小
   */
  public zoomIn(): void {
    this.mapService.zoomOut();
  }

  /**
   * 设施/设备名称模糊查询
   */
  public queryDeviceByName(value: string): void {
    if (value && value !== '') {
      const body = {
        filterConditions: [
          {
            filterField: 'deviceName',
            operator: OperatorEnum.like,
            filterValue: value
          }
        ]
      };
      if (this.currentMapLevel === this.mapTypeEnum.facility) {
        body.filterConditions[0].filterField = 'deviceName';
        this.$indexMapService.queryDeviceByName(body).subscribe((result: ResultModel<any>) => {
          result.data.forEach(item => {
            const devicePoint = item.positionBase.split(',');
            item['facilityId'] = item.deviceId;
            item['lat'] = +devicePoint[1];
            item['lng'] = +devicePoint[0];
            item['equipmentList'] = [];
            item['code'] = null;
            item['show'] = true;
            item['type'] = 'device';
            item['facilityType'] = 'device';
            item['facilityName'] = item.deviceName;
          });
          this.options = result.data;
        });
      }
    }
  }

  /**
   * 清除搜索事件
   */
  private clearSearch(): void {
    this.inputValue = '';
    this.addressInputValue = '';
    this.searchKey = '';
    this.options = [];
  }

  /**
   * 搜索input回车事件
   */
  public onKeyUp(evt): void {
    if (evt.code === 'Enter') {
      if (!this.options.length) {
        if (this.currentMapLevel === 'facility') {
          this.$message.warning(this.indexLanguage.noFacility);
        }
      } else {
        this.locationById(this.inputValue);
      }
    }
  }

  /**
   * 下拉框事件
   */
  public onOptionChange(event, id, name): void {
    if (name) {
      this.inputValue = name;
    }
    this.locationById(id);
  }

  /**
   * 地图设施/设备名称搜索
   */
  public onSearchFacilityName(): void {
    // 清空搜索栏数据
    this.clearSearch();
    // 搜索栏切换
    if (this.currentMapLevel === this.mapTypeEnum.facility) {
      this.searchTypeName = this.indexLanguage.searchDeviceName;
    }
    this.mapSearchObj = {
      facilityNameIndex: 1,
      bMapLocationSearch: -1,
      gMapLocationSearch: -1,
    };
  }

  /**
   * 地址搜索
   */
  public searchAddress(): void {
    // 清空输入框数据
    this.clearSearch();
    // 搜索栏切换
    this.searchTypeName = this.indexLanguage.searchAddress;
    this.mapSearchObj = {
      facilityNameIndex: -1,
      bMapLocationSearch: this.mapType === FilinkMapEnum.baiDu ? 1 : -1,
      gMapLocationSearch: this.mapType === FilinkMapEnum.baiDu ? -1 : 1,
    };
  }

  /**
   * 定位
   */
  public location(): void {
    const key = this.searchKey.trim();
    if (!key) {
      return;
    }
    this.mapService.locationByAddress(key);
  }

  /**
   * 设置地图类型
   * terrain  roadmap  hybrid  satellite
   */
  public setMapType(type: string): void {
    this.mapTypeId = type;
    this.mapService.setMapTypeId(type);
  }

  /**
   * 设施设备点击事件
   */
  private markerClick(event): void {
    const id = event.target.customData.id;
    const data = this.mapService.getMarkerDataById(id);
    if (data.equipmentList.length < 2) {
      this.markerClickEvent(id, data);
    }
  }

  /**
   * 设置地图上面的设施点的事件
   */
  private setDeviceEvent(): void {
    this.fn = [
      {
        eventName: 'click',
        eventHandler: (event) => {
          this.markerClick(event);
        }
      },
      // 地图上的设施点悬浮显示信息面板
      {
        eventName: 'onmouseover',
        eventHandler: (event) => {
          this.openMInfoWindow(event);
        }
      },
      {
        eventName: 'onmouseout',
        eventHandler: () => {
          this.hideInfoWindow();
        }
      },
    ];
  }

  /**
   * 设置地图区域点
   */
  private setAreaEvent(): void {
    this.areaPoint = [
      { // 鼠标移上区域点
        eventName: 'onmouseover',
        eventHandler: (event) => {
          this.openAInfoWindow(event);
        }
      },
      { // 鼠标移除区域点
        eventName: 'onmouseout',
        eventHandler: () => {
          this.hideInfoWindow();
        }
      },
      { // 点击区域点
        eventName: 'onclick',
        eventHandler: (event) => {
          this.areaClickEvent(event);
        }
      }
    ];
  }

  /**
   * 设置线条的事件
   */
  private setLoopLineEvent(): void {
    this.loopEvent = [
      {
        eventName: 'onmouseover',
        eventHandler: (event) => {
          this.loopLineInfoWindow(event);
        }
      },
      {
        eventName: 'onmouseout',
        eventHandler: () => {
          this.hideInfoWindow();
        }
      },
    ];
  }

  /**
   * 创建绘画工具
   */
  public changChooseUtil(): void {
    this.$selectGroupService.eventEmit.subscribe((value) => {
      if (value.isShow === true) {
        this.chooseUtil(BMAP_DRAWING_RECTANGLE);
      }
      if (value.isShow === false) {
        this.clearAll();
      }
    });
  }

  /**
   * 地图放大
   * 点击区域点或定位，定位到设施/设备层级
   */
  public zoomLocation() {
    this.mapService.setZoom(BMapConfig.maxZoom);
  }

  /**
   *添加监听并获取数据
   */
  public addEventListener(): void {
    this.mapDrawUtil.setDrawingMode(null);
    // 添加鼠标绘制工具监听事件，用于获取绘制结果
    this.mapDrawUtil.addEventListener('overlaycomplete', (e) => {
      this.overlays.push(e.overlay);
      this.getOverlayPath();
      this.clearAll();
      this.mapDrawUtil.close();
      this.drawType = BMAP_ARROW;
      this.mapDrawUtil.setDrawingMode(null);
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
    } else if (event === BMAP_ARROW) {
      this.mapDrawUtil.setDrawingMode(null);
      this.mapDrawUtil.close();
    }
  }

  /**
   * 清除所有的覆盖物
   */
  public clearAll(): void {
    if (!_.isEmpty(this.overlays)) {
      for (let i = 0; i < this.overlays.length; i++) {
        this.mapService.removeOverlay(this.overlays[i]);
      }
    }
    this.overlays.length = 0;
    this.drawType = BMAP_ARROW;
    this.mapDrawUtil.close();
    this.mapDrawUtil.setDrawingMode(null);
  }

  /**
   * 回路画线
   */
  public loopDrawLine(loopData, mapCenterPoint?, dataSet?: LoopListModel[]): void {
    this.isClick = true;
    // this.zoomEnd = () => {};
    this.loopDrawLineData = loopData;
    if (!_.isEmpty(loopData)) {
      loopData.forEach(item => {
        if (item && item[0].loopId) {
          this.loopInfo.push({loopId: item[0].loopId, devices: item});
          this.loopInfo = _.uniqBy(this.loopInfo, 'loopId');
        }
      });
    }
    const loopDataTemp = _.cloneDeep(loopData);
    // const mapCenterPointTemp = _.cloneDeep(mapCenterPoint);
    if (this.mapService.mapInstance) {
      // 先定位避免查询窗口设施时传给后台经纬度幅度过大接口性能慢
      this.mapService.setCenterAndZoom(mapCenterPoint[0].lng, mapCenterPoint[0].lat, BMapConfig.deviceZoom);
    }
    this.getWindowAreaDetailList(this.locationArea).then(() => {
      setTimeout(() => {
        // if (!_.isEmpty(loopDataTemp) && mapCenterPointTemp) {
        //   // 缩放到设施图层
        //   if (loopDataTemp.length > 1) {
        //     this.mapService.setCenterAndZoom(mapCenterPointTemp[0].lng, mapCenterPointTemp[0].lat, BMapConfig.maxZoom);
        //   } else {
        //     // 获取每个设施的point
        //     const points = loopDataTemp[0].map(item => {
        //       const point = item.positionBase.split(',');
        //       return {
        //         lat: point[1],
        //         lng: point[0]
        //       };
        //     });
        //     this.mapService.centerAndZoom(points);
        //   }
        // }
        this.mapService.loopDrawLine(loopDataTemp, this.loopEvent);
        this.isClick = false;
      }, 1000);
    });
  }

  /**
   * 清除回路画线
   */
  public clearLoopDrawLine(): void {
    this.mapService.clearLoopDrawLine();
  }

  /**
   * 根据区域查设施
   */
  private queryDeviceByArea(areaFacility, area?) {
    return new Promise((resolve, reject) => {
      this.$indexMapService.queryDevicePolymerizations(areaFacility).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          this.deviceDataList = result.data || [];
          // 分割坐标点字符串
          // const centerPoint = this.deviceDataList.positionCenter.split(',');
          this.deviceDataList.deviceData.forEach(item => {
            const devicePoint = item.positionBase.split(',');
            item['facilityId'] = item.deviceId;
            item['lat'] = +devicePoint[1];
            item['lng'] = +devicePoint[0];
            item['cloneCode'] = item.code;
            item['code'] = null;
            item['equipmentList'] = [];
            item['facilityType'] = 'device';
            item['show'] = true;
          });
          //    this.mapService.mapInstance.clearOverlays();
          this.mapService.markerClusterer.clearMarkers();
          this.addMarkers(this.deviceDataList.deviceData);
          // this.loopDrawLine(this.loopDrawLineData);
          // if (area) {
          //   this.mapService.setCenterAndZoom(centerPoint[0], centerPoint[1], BMapConfig.deviceZoom);
          // }
          // 设施返回空数组给定位做判断
          resolve([]);
        }
      }, () => {
        reject(this.indexLanguage.networkTips);
      });
    });

  }

  /**
   * 地图可视区域内的点
   */
  private getOverlayPath(): void {
    const box = this.overlays[this.overlays.length - 1];
    if (box.getPath && this.mapType === FilinkMapEnum.baiDu) {
      const pointArray = box.getPath();
      const bound = this.mapService.mapInstance.getBounds(); // 地图可视区域
      let dataList = [];
      this.mapService.getMarkerMap().forEach(value => {
        if (bound.containsPoint(value.marker.point) === true) {
          if (MapServiceUtil.isInsidePolygon(value.marker.point, pointArray) && value.data.facilityId) {
            dataList.push(value.data);
          }
        }
      });
      if (dataList.length > 0) {
        if (!this.isFromLight) {
          // 智慧照明不过滤配电箱，资产回路过滤配电箱
          dataList = dataList.filter(v => v.deviceType !== DeviceTypeEnum.distributionPanel);
        }
        this.$selectGroupService.eventEmit.emit({datas: dataList, showCoverage: this.$mapCoverageService.showCoverage});
      }
    } else if (box.getPath && this.mapType === FilinkMapEnum.google) {
      const point = box.getBounds();
      // 谷歌地图
      const dataList = [];
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

  /**
   * 批量重置图标样式
   */
  public resetMarkersStyle(deviceIds: string[]): void {
    // 关闭多重设施列表
    if (deviceIds.length > 0) {
      deviceIds.forEach(v => {
        this.targetMarker = this.mapService.getMarkerById(v);
        this.resetTargetMarker();
      });
    }
  }
}
