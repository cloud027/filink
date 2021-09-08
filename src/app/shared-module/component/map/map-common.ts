import {
  ElementRef,
  EventEmitter,
  Input,
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
import {MapConfig} from './map.config';
import {MapConfig as BMapConfig} from './b-map.config';
import {InspectionLanguageInterface} from '../../../../assets/i18n/inspection-task/inspection.language.interface';
import {FacilityLanguageInterface} from '../../../../assets/i18n/facility/facility.language.interface';
import {FiLinkModalService} from '../../service/filink-modal/filink-modal.service';
import {MapStoreService} from '../../../core-module/store/map.store.service';
import {BMAP_ARROW} from '../map-selector/map.config';
import {MapCoverageService} from '../../service/index/map-coverage.service';
import {QueryConditionModel} from '../../model/query-condition.model';
import {TableConfigModel} from '../../model/table-config.model';
import {ResultModel} from '../../model/result.model';
import {PageModel} from '../../model/page.model';
import {ResultCodeEnum} from '../../enum/result-code.enum';
import {AreaFacilityDataModel, AreaFacilityModel} from '../../../business-module/index/shared/model/area-facility-model';
import {CloseShowFacilityService} from '../../service/index/close-show-facility.service';
import {SelectGroupService} from '../../service/index/select-group.service';
import {LanguageEnum} from '../../enum/language.enum';
import {MapTypeEnum, TipWindowType} from '../../enum/filinkMap.enum';
import {EquipmentStatusEnum} from '../../../core-module/enum/equipment/equipment.enum';
import {DeployNameEnum, DeviceStatusEnum} from '../../../core-module/enum/facility/facility.enum';
import {IndexAlarmLevelModel} from '../../../core-module/model/index/index-alarm-level-model';
import {AlarmLevelEnum} from '../../../core-module/enum/alarm/alarm-level.enum';
import {FacilityForCommonUtil} from '../../../core-module/business-util/facility/facility-for-common.util';
import {MapService} from '../../../core-module/api-service/index/map';
import {bigIconSize} from '../../service/map-service/map.config';
import {AdjustCoordinatesService} from '../../service/index/adjust-coordinates.service';
import {MapLinePointUtil} from '../../util/map-line-point-util';
import {MapOperateService} from './map-operate.service';
import {FacilitiesDetailsModel} from '../../../core-module/model/index/facilities-details.model';
import {Subject} from 'rxjs';
import {AlarmListHomeModel} from '../../../business-module/index/shared/model/alarm-list-home-model';
import {IndexApiService} from '../../../business-module/index/service/index/index-api.service';
import {PointProjectStatusEnum, ViewEnum} from '../../../core-module/enum/index/index.enum';
import {PointStatusEnum} from '../../../core-module/enum/plan/point-status.enum';
// 一定要声明BMap，要不然报错找不到BMap
declare let BMap: any;
declare let BMapLib: any;
declare let google: any;
declare let MarkerClusterer: any;

export class MapCommon extends MapOperateService {
  // 地图配置
  @Input() mapConfig: MapConfig;
  // 视图类型
  @Input() viewIndex: string;
  // 中心点
  @Input() centerPoint: string;
  // 其他模块跳转定位设备数据
  @Input() equipmentLocation;
  // 其他模块跳转定位设施数据
  @Input() deviceLocation;
  // 其他模块跳转定位:规划点/项目点
  @Input() planOrProjectLocation;
  // 其他模块跳转定位:规划/项目设施列表
  @Input() planOrProjectListLocation;
  // 图标大小   18-24
  @Input() iconSize: string;
  //  区域数据
  @Input() areaData: any[];
  // 要渲染的地图数据
  @Input() data: [];

  // 显示加载读条
  @Output() showProgressBar = new EventEmitter();
  // 关闭加载读条
  @Output() hideProgressBar = new EventEmitter();
  // 地图事件回传
  @Output() mapEvent = new EventEmitter();

  // 设备名称模版
  @ViewChild('equipmentNameTemp') equipmentNameTemp: TemplateRef<any>;
  // 拓扑单选框
  @ViewChild('radioTemp') radioTemp: TemplateRef<any>;
  // 弹出框底部
  @ViewChild('tplFooter') public tplFooter;
  // 地图模板
  @ViewChild('map') map: ElementRef;

  // 分页参数初始化
  public pageBean: PageModel = new PageModel(10, 1, 1);
  // 传参条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 国际化
  public InspectionLanguage: InspectionLanguageInterface;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 首页国际化
  public indexLanguage: IndexLanguageInterface;
  // 区域下设施数据模型
  public areaFacilityModel: AreaFacilityDataModel = new AreaFacilityDataModel;
  // 表格配置
  public equipmentTableConfig: TableConfigModel;
  // 国际化
  public language: FacilityLanguageInterface;
  // 表格配置
  public tableConfig: TableConfigModel;
  // 鼠标移上去时的提示框
  public isShowInfoWindow: boolean = false;
  // 多重设备点双击列表弹框
  public isShowTableWindow: boolean = false;
  // 区域点告警个数
  public loadingAlarm: boolean = false;
  // 区域点个数
  public loadingEquipment: boolean = false;
  // 上次创建的设施或设备点
  public lastCreatedEquipmentPoint: any[] = [];
  // 其他页面跳转开关
  public isLocation: boolean = false;
  // 绘制类型
  public drawType: string = BMAP_ARROW;
  // 上次创建的设施或设备点
  public lastCreatedPoint: any[] = [];
  // 浮窗类型
  public windowType = TipWindowType;
  // 地图设施/设备类型
  public mapTypeEnum = MapTypeEnum;
  // 地址搜索框值
  public addressInputValue: string;
  // 搜索类型名称
  public searchTypeName: string;
  // 信息框左边位置
  public infoWindowLeft = '0';
  // 信息框上边位置
  public infoWindowTop = '0';
  // 搜索框值
  public inputValue: string;
  // 下拉框
  public options: Array<FacilitiesDetailsModel> = [];
  // 地图类型
  public IndexObj = {
    facilityNameIndex: 1,
    bMapLocationSearch: -1,
    gMapLocationSearch: -1,
  };
  // 区域点和项目回调
  public areaPoint: any;
  // 目标标记点
  public targetMarker;
  // 定时器
  public timer: any;
  // 图表大小
  public _iconSize;
  // 地图方法
  public mapService;
  // 信息框
  public infoData = {
    type: '',
    data: null
  };
  // 设施marker点事件
  public fn: any;
  // 设备marker点事件
  public en: any;
  // 百度地图聚合点回调
  public cb: any;
  // 最大缩放级别
  public maxZoom: number;
  // 默认缩放级别
  public defaultZoom: number;
  // 谷歌地图地理位置搜索框
  public searchKey: string = '';
  // 地图类别id
  public mapTypeId: string;
  // 地图类型
  public mapType: string;
  // 地图区域告警
  public areaDataMap = new Map();
  // 新增弹出框显示隐藏
  public isVisible = false;
  // 光缆标题
  public title: string;
  // 多重设备列表数据
  public _dataSet = [];
  // 选中ID
  public selectedAlarmId = null;
  // 语言类型
  public typeLg: string;
  // 设备点数据集合
  public equipmentDataList;
  // 设施点数据集合
  public deviceDataList;
  // 表格数据
  public setData = [];
  // 地图分层设施类型
  public equipmentList: string[] = [];
  // 地图分层设施类型
  public deviceList: string[] = [];
  // 克隆一份地图区域数据
  public mapCloneData: any;
  // 地图绘画工具
  public mapDrawUtil: any;
  // 覆盖物集合
  public overlays = [];
  // 当前地图分层类型
  public indexType: string;
  // 多重设备列表区域下拉框
  public selectOption: Array<{ label: string, value: number }> = [];
  // 多重设备列表查询条件
  public queryConditions = [];
  // 多重设备列表查询数据
  public equipmentListData: Array<FacilitiesDetailsModel> = [];
  // 定位区域
  public locationArea: string[];
  // 定位Id
  public locationId: string;
  // 是否为定位
  public locationType: boolean = false;
  // 告警权限
  public roleAlarm: boolean = false;
  public selectGroup: boolean = false;
  public adjustCoordinates: boolean = false;
  public polylineSet: any;
  public coordinatesData = [];
  // 窗口视图的经纬度
  public points = [];
  // 区域中心点模型
  public areaCenterModel: AreaFacilityModel = new AreaFacilityModel;
  // 是否允许拖动
  public useDrag: boolean = false;
  // 关闭订阅流
  public destroy$ = new Subject<void>();
  // 运维视图
  public maintenanceView = ViewEnum.maintenanceView;
  // 项目视图
  public projectView = ViewEnum.projectView;
  // 规划视图
  public planView = ViewEnum.planView;

  constructor(public $nzI18n: NzI18nService,
              public $mapStoreService: MapStoreService,
              public $mapCoverageService: MapCoverageService,
              public $indexMapService: MapService,
              public $selectGroupService: SelectGroupService,
              public $adjustCoordinatesService: AdjustCoordinatesService,
              public $message: FiLinkModalService,
              public $closeShowFacilityService: CloseShowFacilityService,
              public $mapLinePointUtil: MapLinePointUtil,
              public $indexApiService: IndexApiService
  ) {
    super($mapStoreService, $mapCoverageService, $selectGroupService,
      $adjustCoordinatesService, $closeShowFacilityService, $mapLinePointUtil, $indexApiService);
  }

  /**
   * marker点点击事件
   * param event
   */
  public equipmentLocationEvent(event): void {
    this.mapService.panTo(event.lng, event.lat);
    this.mapEvent.emit({
      type: 'selected', id: event.equipmentId, facilityCode: event.equipmentModel, facilityType: event.facilityType,
      idData: {
        deviceId: event['equipmentName'] ? null : event['deviceId'],
        equipmentId: event['equipmentName'] ? event['equipmentId'] : null,
        equipmentModel: event['equipmentModel'] ? event['equipmentModel'] : null,
        equipmentType: event['equipmentType'] ? event['equipmentType'] : null,
        name: event['equipmentName'] ? event['equipmentName'] : event['deviceName'],
      },
    });
  }

  /**
   * 获取告警列表
   */
  public queryPolymerizationAlarmList(info) {
    let polymerizationData = info.polymerizationData;
    // 获取单个区域告警数量
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
    if (this.indexType === this.mapTypeEnum.facility) {
      requestHeader = this.$indexApiService.queryDeviceCountByMap(this.$mapStoreService.polymerizationConfig);
    } else {
      requestHeader = this.$indexApiService.queryEquipmentCountByMap(this.$mapStoreService.polymerizationConfig);
    }
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
        item.equipmentModelType = item.modelType;
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
  public openAInfoWindow(e, m): void {
    const id = e.target.customData.code;
    const info = this.mapService.getMarkerDataById(id);
    let equipment = [];

    // 判断是否有设备缓存
    if (info.equipmentData === null) {
      this.queryDeviceCountByMap(info).then(data => {
        info.equipmentData = data;
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
      type: 'a',
      data: {
        areaName: info.areaName,
        count: info.count,
        equipment: equipment,
        alarmData: alarmData
      }
    };
    this.showInfoWindow('a', info.lng, info.lat);
  }

  /**
   * 模拟title提示框  规划点/项目点
   * param e
   */
  public openWindow(type, e, m): void {
    const id = e.target.customData.code;
    const info = this.mapService.getMarkerDataById(id);
    const poleModelList = [];
    Object.getOwnPropertyNames(info.poleModelMap).forEach(function (key) {
      const obj = {
        model: key,
        modelCount: info.poleModelMap[key]
      };
      poleModelList.push(obj);
    });

    let name = '';
    if (type === ViewEnum.planView) {
      name = info.planName;
    }
    if (type === ViewEnum.projectView) {
      name = info.projectName;
    }
    this.infoData = {
      type: 'a',
      data: {
        name: name,
        count: info.count,
        poleModelMap: poleModelList,
        poleStatusMap: info.poleStatusMap
      }
    };
    this.showInfoWindow('a', info.lng, info.lat);
  }


  /**
   * 设施设备点点
   * param e
   */
  public openMInfoWindow(e, m): void {
    let id;
    id = e.currentTarget.customData.id;
    const info = this.mapService.getMarkerDataById(id);
    if (!info) {
      return;
    }
    if (info.facilityType === this.mapTypeEnum.device) {
      // 运维地图设施点浮窗
      if (this.viewIndex === ViewEnum.maintenanceView) {
        this.deviceWindow(info);
      } else {
        // 项目/规划地图设施点浮窗
        this.projectPlanDeviceWindow(info);
      }
    } else if (info.facilityType === this.mapTypeEnum.equipment && info.equipmentList.length === 1) {
      // 设备点浮窗
      this.equipmentWindow(info);
    }
  }

  /**
   * 项目/规划设施点浮窗
   */
  public projectPlanDeviceWindow(info): void {
    const name = info.planName ? info.planName : info.projectName;
    this.infoData = {
      type: 'p',
      data: {
        pointName: info.pointName,
        pointStatusColor: PointProjectStatusEnum[info.pointStatus],
        pointStatus: CommonUtil.codeTranslate(PointStatusEnum, this.$nzI18n, info.pointStatus, LanguageEnum.planProject) as any[],
        pointModel: info.pointModel,
        projectPlanName: name
      }
    };
    this.showInfoWindow('m', info.lng, info.lat);
  }

  /**
   * 设施点浮窗
   */
  public deviceWindow(info): void {
    // 设备权重排序
    info.equipmentCountInfoList = FacilityForCommonUtil.equipmentSort(info.equipmentCountInfoList);
    // 根据设备类型与设备型号判断摄像头类型(球型/枪型)
    info.equipmentCountInfoList.forEach(item => {
      item['_equipmentType'] = CommonUtil.getEquipmentTypeIcon(item);
      item['_equipmentStatus'] = CommonUtil.getFacilityColor(item.equipmentStatus);
    });
    this.infoData = {
      type: 'm',
      data: {
        deviceName: info.deviceName,
        deviceStatusName: CommonUtil.codeTranslate(DeviceStatusEnum, this.$nzI18n, info.deviceStatus, 'facility.config'),
        deviceStatusColor: CommonUtil.getDeviceStatusIconClass(info.deviceStatus)
          .colorClass
          .replace('-c', '-bg'),
        areaLevelName: this.getAreaLevelName(info.areaLevel),
        areaLevelColor: CommonUtil.getAreaColor(info.areaLevel),
        areaName: info.areaName,
        address: info.address,
        deployStatusColor: CommonUtil.getDeviceDeployColor('2'),
        deployStatusName: CommonUtil.codeTranslate(DeployNameEnum, this.$nzI18n, '3', LanguageEnum.common),
        equipmentCountInfoList: info.equipmentCountInfoList,
      }
    };
    this.showInfoWindow('m', info.lng, info.lat);
  }

  /**
   * 单个设备点浮窗
   */
  public equipmentWindow(info): void {
    this.infoData = {
      type: 'm',
      data: {
        deviceName: info.equipmentName,
        deviceStatusName: CommonUtil.codeTranslate(EquipmentStatusEnum, this.$nzI18n, info.equipmentStatus, LanguageEnum.facility) as string,
        deviceStatusColor: CommonUtil.getEquipmentStatusIconClass(info.equipmentStatus as EquipmentStatusEnum, 'list').bgColor,
        areaLevelName: this.getAreaLevelName(info.areaLevel),
        areaLevelColor: CommonUtil.getAreaColor(info.areaLevel),
        areaName:
        info.areaName,
        address:
        info.address,
        equipmentDataList:
          [],
      }
    }
    ;
    this.showInfoWindow('m', info.lng, info.lat);
  }

  /**
   * 多个设备点列表
   */
  public equipmentTableWindow(id, data): void {
    if (data.equipmentList.length > 1) {
      this.selectMarker(id);
      this.targetMarker = this.mapService.getMarkerById(id);
      if (this.useDrag) {
        this.targetMarker.enableDragging();
      } else {
        this.equipmentListData = data.equipmentList.map(item => {
          return item;
        });
        this.setData = this.equipmentListData;
        this.isShowTableWindow = true;
        // 平移中心点
        this.mapService.panTo(data.lng, data.lat);
        // 初始化多重设备列表下拉框
        this.setSelectOption();
        // 初始化多重设备列表
        this.initEquipmentTableConfig();
      }
    }
  }

  /**
   * 鼠标移入显示信息
   * param info   设施点信息
   * param type   类型  c：聚合点 m：marker点
   */
  public showInfoWindow(type, lng, lat): void {
    const pixel = this.mapService.pointToOverlayPixel(lng, lat);
    const offset = this.mapService.getOffset();
    let _top = offset.offsetY + pixel.y;
    if (type === 'c') {
      _top = _top - 20;
    } else if (type === 'm') {
      const iconHeight = parseInt(this._iconSize.height, 10);
      _top = _top - iconHeight + 16;
      if (this.mapType === 'google') {
        _top = _top - 10;
      }
    }
    this.infoWindowLeft = offset.offsetX + pixel.x + 'px';
    this.infoWindowTop = _top - 20 + 'px';
    this.isShowInfoWindow = true;
  }


  /**
   * 定位通过id
   * id存在走地图左上搜索框定位,不存在走关注,设施设备列表定位操作
   * */
  public locationById(id, deviceOrEquipment?): void {
    let data = {};
    if (id) {
      // 模糊查询定位
      // 对比查询结果找到当前定位数据
      if (this.options && this.options.length) {
        this.options.forEach(item => {
          if (item.deviceId === id || item.equipmentId === id || item.pointId === id) {
            data = item;
          }
        });
      }
      // 设施设备列表定位
    } else if (deviceOrEquipment) {
      if (this.viewIndex === ViewEnum.maintenanceView) {
        // 设施/设备ID转换为共同ID字段
        data = deviceOrEquipment;
        id = data['equipmentId'] || data['deviceId'];
        data['facilityId'] = id;
        // 规划/项目设施列表定位
      } else {
        data = deviceOrEquipment;
        id = deviceOrEquipment.id;
      }
    }
    if (!data) {
      return;
    }
    // 如果是设施列表定位/我的关注列表定位
    if (this.viewIndex === ViewEnum.maintenanceView) {
      // 使用cloneDeviceType作为详情卡查询条件
      if (data['cloneDeviceType']) {
        data['facilityCode'] = data['cloneDeviceType'];
      } else if (data['equipmentModel']) {
        data['facilityCode'] = data['equipmentModel'];
      } else {
        data['facilityCode'] = data['deviceType'];
      }
    }
    // 存储当前设施/设备ID
    this.locationId = id;
    // 当前为定位缩放
    this.locationType = true;
    // 清除地图数据
    if (this.mapService.mapInstance) {
      this.mapService.mapInstance.clearOverlays();
    }
    if (this.mapService.markerClusterer) {
      this.mapService.markerClusterer.clearMarkers();
    }
    // // 地图放大到设施/设备层级
    // // 在缩放监听事件里触发后续事件 参照zoomEnd事件
    // this.zoomLocation();
    this.mapService.setCenterAndZoom(data['lng'] || data['longitude'], data['lat'] || data['latitude'], BMapConfig.maxZoom);
    // 查询当前窗口数据并渲染
    this.getWindowAreaDatalist().then((resolve: any[]) => {
      if (resolve.length) {
        let equipmentId;
        resolve.forEach(item => {
          item.equipmentList.forEach(_item => {
            if (_item.equipmentId === this.locationId) {
              equipmentId = item.equipmentList[0].equipmentId;
            }
          });
        });
        // 多重设备选中高亮
        this.selectMarker(equipmentId);
        this.locationType = false;
      } else {
        // 单个设施选中高亮
        this.selectMarker(this.locationId);
        this.locationType = false;
      }
      if (this.viewIndex === ViewEnum.maintenanceView) {
        this.openParticularsCard(data);
      }
    });
  }

  public openParticularsCard(data) {
    const id = data['equipmentId'] || data['deviceId'];
    let cloneData;
    if (data['cloneEquipmentType']) {
      cloneData = {
        deviceId: data['equipmentName'] ? null : data['deviceId'],
        equipmentId: data['equipmentName'] ? data['equipmentId'] : null,
        equipmentModel: data['equipmentModel'] ? data['equipmentModel'] : null,
        equipmentType: data['cloneEquipmentType'] ? data['cloneEquipmentType'] : null,
        name: data['equipmentName'] ? data['equipmentName'] : data['deviceName'],
      };
    } else {
      cloneData = {
        deviceId: data['equipmentName'] ? null : data['deviceId'],
        equipmentId: data['equipmentName'] ? data['equipmentId'] : null,
        equipmentModel: data['equipmentModel'] ? data['equipmentModel'] : null,
        equipmentType: data['equipmentType'] ? data['equipmentType'] : null,
        name: data['equipmentName'] ? data['equipmentName'] : data['deviceName'],
      };
    }
    // 发送状态打开详情卡
    this.mapEvent.emit({
      type: 'selected',
      id: id,
      idData: cloneData,
      facilityCode: data['facilityCode'],
      facilityType: data['facilityType']
    });
  }

  public getWindowAreaDatalist(): any {
  }

  /**
   * 地址搜索
   */
  public searchAddress(): void {
    // 清空输入框数据
    this.clearSearch();
    // 搜索栏切换
    this.searchTypeName = this.indexLanguage.searchAddress;
    if (this.mapType === 'baidu') {
      this.IndexObj = {
        facilityNameIndex: -1,
        bMapLocationSearch: 1,
        gMapLocationSearch: -1,
      };
    }
  }

  /**
   * 设施设备点击事件
   */
  public markerClick(event): void {
    const id = event.target.customData.id;
    const data = this.mapService.getMarkerDataById(id);
    // 单个设施或设备点
    if ((data.equipmentList && data.equipmentList.length < 2) || this.viewIndex !== ViewEnum.maintenanceView) {
      this.markerClickEvent(id, data, event);
    }
    // 多重设备点
    this.multipleClick(id, data);
  }

  /**
   * 选中2个以上的设备
   * param id
   * param data
   */
  public multipleClick(id, data) {
    if (data.facilityType === this.mapTypeEnum.equipment && data.equipmentList.length > 1) {
      this.equipmentTableWindow(id, data);
    }
  }

  /**
   * 设备重合右键多重列表
   */
  public initEquipmentTableConfig(): void {
    this.equipmentTableConfig = {
      isDraggable: true,
      isLoading: false,
      scroll: {x: '280px', y: '85px'},
      outHeight: 250,
      noAutoHeight: true,
      topButtons: [],
      noIndex: true,
      columnConfig: [
        {
          title: this.language.areaName, key: 'areaName', width: 100,
          searchable: true,
          searchKey: 'areaId',
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: this.selectOption}
        },
        {
          title: this.language.equipmentName, key: 'equipmentName', width: 100,
          searchable: true,
          type: 'render',
          renderTemplate: this.equipmentNameTemp,
          searchConfig: {type: 'input'}
        },
        {
          title: '', searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 80, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: false,
      bordered: false,
      showSearch: true,
      operation: [
        {
          // 定位
          text: this.language.location,
          className: 'fiLink-location',
          handle: (currentIndex) => {
            this.equipmentLocationEvent(currentIndex);
          }
        },
      ],
      handleSearch: (event) => {
        this.queryConditions = event;
        this.filterData();
      }
    };
  }

  /**
   * 校检名称
   * param item
   * returns {boolean}
   */
  public checkFacility(item) {
    let bol = true;
    this.queryConditions.forEach(q => {
      /**
      if (q.filterValue && q.operator === 'eq' && item[q.filterField] !== q.filterValue) {
        bol = false;
      } else if (q.filterValue && q.operator === 'like' && !item[q.filterField].includes(q.filterValue)) {
        bol = false;
      } else if (q.filterValue && q.operator === 'in' && (q.filterValue.indexOf(item[q.filterField]) < 0)) {
        bol = false;
      }
       */
      if (q.filterValue && ((q.operator === 'eq' && item[q.filterField] !== q.filterValue) ||
        (q.operator === 'like' && !item[q.filterField].includes(q.filterValue)) ||
        (q.operator === 'in' && (q.filterValue.indexOf(item[q.filterField]) < 0)))) {
        bol = false;
      }
    });
    return bol;
  }

  /**
   * 地图定位
   */
  public mapPositioning(changes: SimpleChanges): void {

    // 缩放级别大的时候，拿到缩放层级
    this.maxZoom = BMapConfig.maxZoom;
    this.defaultZoom = BMapConfig.defaultZoom;
    if (this.mapService && changes.data && changes.data.currentValue) {
      // 如果根据开关判断是否为其他页面跳转
      // 如果是其他页面跳转则return,不走下面代码
      if (this.isLocation) {
        return;
      }
      // 其他页面跳转过来时，根据数据类型和地图分层类型判断，走定位方法
      if ((this.deviceLocation && this.$mapCoverageService.showCoverage === MapTypeEnum.facility)
        || (this.equipmentLocation && this.$mapCoverageService.showCoverage)) {
        this.isLocation = true;
        this.locationById('', this.deviceLocation || this.equipmentLocation);
        return;
      }
      if (this.planOrProjectLocation && this.planOrProjectLocation.lng && this.planOrProjectLocation.lat) {
        this.isLocation = true;
        this.mapService.setCenterAndZoom(this.planOrProjectLocation.lng, this.planOrProjectLocation.lat, BMapConfig.deviceZoom);
        return;
      }
      if (this.planOrProjectListLocation && this.planOrProjectListLocation.id) {
        this.isLocation = true;
        this.locationById('', this.planOrProjectListLocation);
        return;
      }
      if (!lodash.isEmpty(changes.data.previousValue)) {
        // 定位判断初始化
        this.locationType = false;
        // 清除上次渲染的区域点 previousValue
        this.mapService.markerClusterer.clearMarkers(changes.data.previousValue);
        // 重新渲染区域点 currentValue
        this.addMarkers(changes.data.currentValue);
        // 克隆一份最新的数据，过滤使用
        this.mapCloneData = CommonUtil.deepClone(changes.data.currentValue);
        // 定位视图中心点
        this.mapService.setCenterAndZoom(this.centerPoint[0], this.centerPoint[1], 8);
        // 重置左上角模糊查询
        this.searchFacilityName();
      } else {
        this.mapCloneData = CommonUtil.deepClone(this.data);
        this.addMarkers(this.data);
        if (this.centerPoint) {
          this.mapService.setCenterAndZoom(this.centerPoint[0], this.centerPoint[1], 8);

        }
      }
    }
  }

  /**
   * 设置区域中心信息
   */
  public areaCenterSetInformation(event): void {
    this.areaCenterModel = new AreaFacilityModel;
    // 查询点击区域cod
    const areaCode = event.target.customData.code;
    // 查询参数
    const areaStoreData = this.$mapStoreService.areaSelectedResults || [];
    this.areaCenterModel.filterConditions.area = areaStoreData ? areaStoreData : [];
    this.areaCenterModel.filterConditions.group = [];
    this.areaCenterModel.polymerizationType = '1';
    this.areaCenterModel.codeList = [areaCode];
  }

  /**
   * 获取设备区域中心点
   */
  public queryEquipmentAreaCenterPoint(): void {
    // 获取设备区域中心点
    this.$indexMapService.queryEquipmentPolymerizationsPointCenter(this.areaCenterModel).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success && result.data && result.data.positionCenter) {
        this.equipmentDataList = result.data || [];
        const centerPoint = this.equipmentDataList.positionCenter.split(',');
        this.mapService.setCenterAndZoom(centerPoint[0], centerPoint[1], BMapConfig.deviceZoom);
      }
    }, () => {
      this.$message.warning(this.indexLanguage.networkTips);
    });
  }

  /**
   * 区域级别国际化转换
   */
  public getAreaLevelName(areaLevel) {
    const a = CommonUtil.getAreaLevelName(areaLevel);
    return `${this.commonLanguage[a]}${this.commonLanguage.level}`;
  }

  /**
   * 设置设施类型下拉款选项
   */
  public setSelectOption(): void {
    const obj = {};
    this.setData.forEach(item => {
      if (!obj[item.areaId]) {
        obj[item.areaId] = {
          value: item.areaId,
          label: item.areaName
        };
      }
    });
    this.selectOption = Object.values(obj);
  }

  /**
   * 清除搜索事件
   */
  public clearSearch(): void {
    this.inputValue = '';
    this.addressInputValue = '';
    this.searchKey = '';
    this.options = [];
  }

  /**
   * 过滤数据
   */
  public filterData() {
    this.setData = this.equipmentListData.filter(item => {
      return this.checkFacility(item);
    });
  }

  /**
   * 地图设施/设备名称搜索
   */
  public searchFacilityName(): void {
    // 清空搜索栏数据
    this.clearSearch();
    // 搜索栏切换
    if (this.indexType === this.mapTypeEnum.facility || this.viewIndex !== this.maintenanceView) {
      this.searchTypeName = this.indexLanguage.searchDeviceName;
    } else {
      this.searchTypeName = this.indexLanguage.equipmentName;
    }
    this.IndexObj = {
      facilityNameIndex: 1,
      bMapLocationSearch: -1,
      gMapLocationSearch: -1,
    };
  }

  /**
   * marker点点击事件
   * param event
   */
  public markerClickEvent(id, data, event): void {
    // 重置之前的样式
    this.resetTargetMarker();
    this.hiddenShowTableWindow();
    this.locationId = id;
    let imgUrl;
    let _icon;
    if (data.facilityType === this.mapTypeEnum.device && !data.pointId) {
      // 获取设施点图标
      imgUrl = CommonUtil.getFacilityIconUrl(bigIconSize, data.deviceType);
    } else if (data.facilityType === this.mapTypeEnum.equipment) {
      // 获取设备点图标
      imgUrl = CommonUtil.getEquipmentTypeIconUrl(bigIconSize, data.equipmentType, '0', data.equipmentList);
    } else if (data.pointId) {
      imgUrl = CommonUtil.getFacilityPointIconUrl(this.iconSize, data.deviceType);
    } else {
      return;
    }
    // 切换大图标
    _icon = this.mapService.toggleBigIcon(imgUrl);
    // 替换图标
    event.target.setIcon(_icon);
    // 选中图标置顶
    event.target.setTop(true);
    // 为图标样式重置保存上一次数据
    this.targetMarker = this.mapService.getMarkerById(id);
    // 设置单个坐标点拖动
    if (this.useDrag) {
      this.targetMarker.enableDragging();
    } else {
      // 只有运维视图有详情卡
      if (this.viewIndex === ViewEnum.maintenanceView) {
        // 平移中心点
        this.mapService.panTo(data.lng, data.lat);
        // 发送状态打开详情卡
        // 如果为设施传送设施类型
        // 如果为设备传送设备型号
        this.mapEvent.emit({
          type: 'selected',
          id: id,
          idData: {
            deviceId: data['equipmentName'] ? null : data['deviceId'],
            equipmentId: data['equipmentName'] ? data['equipmentId'] : null,
            equipmentModel: data['equipmentModel'] ? data['equipmentModel'] : null,
            equipmentType: data['equipmentType'] ? data['equipmentType'] : null,
            name: data['equipmentName'] ? data['equipmentName'] : data['deviceName'],
          },
          facilityCode: data.equipmentModel || data.deviceType,
          facilityType: data.facilityType
        });
      }

    }


  }

  /**
   * 获取窗口视图经纬度
   */
  public getWindowIsArea() {
    if (!this.mapService.mapInstance) {
      return;
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
}
