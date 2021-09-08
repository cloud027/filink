import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {MapConfig} from '../../../../shared-module/component/map/map.config';
import {MapAbstract} from '../../../../shared-module/component/map/map-abstract';
import {MapDataModel} from '../../../../core-module/model/index/map-data-model';
import {MapEventTypeEnum, ViewEnum} from '../../../../core-module/enum/index/index.enum';
import {FilinkMapEnum, MapTypeEnum} from '../../../../shared-module/enum/filinkMap.enum';
import {AREA_POINT_CONST} from '../../../../core-module/const/index/map.const';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {MapStoreService} from '../../../../core-module/store/map.store.service';
import {Router} from '@angular/router';
import {ApplicationFinalConst} from '../../share/const/application-system.const';
import {EquipmentTypeEnum, QueryGroupTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {EquipmentAreaModel} from '../../../../core-module/model/index/equipment-area.model';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import * as _ from 'lodash';
import * as $ from 'jquery';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {MAP_DEFAULT_HEIGHT_CONST, MAX_HEIGHT_EDGE_CONST, MIN_HEIGHT_CONST} from '../../../../core-module/const/facility/facility.const';
import {FacilityListTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {PositionService} from '../../share/service/position.service';
import {MapCoverageService} from '../../../../shared-module/service/index/map-coverage.service';
import {MapService} from '../../../../core-module/api-service/index/map';
import {MapEventModel} from '../../../../core-module/model/map-event.model';
import {SelectFacilityChangeService} from '../../share/service/select-facility-change.service';
import {ApplicationInterface} from '../../../../../assets/i18n/application/application.interface';
import {SelectGroupService} from '../../../../shared-module/service/index/select-group.service';
import {chooseTypeEnum} from '../../share/enum/operation-button.enum';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {FilterCondition, QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {ApplicationMapComponent} from './application-map.compnent';
import {SelectTableEquipmentChangeService} from '../../share/service/select-table-equipment-change.service';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {mapIconConfig} from '../../../../shared-module/service/map-service/map.config';
import {AlarmAreaModel} from '../../../index/shared/model/alarm-area.model';
import {MapConfig as BMapConfig} from '../../../../shared-module/component/map/b-map.config';
import {ListTypeEnum} from '../../share/enum/list-type.enum';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

/**
 * 设备列表/分组列表地图
 */
@Component({
  selector: 'app-map-list',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class EquipmentListMapComponent implements OnInit, OnDestroy {
  constructor(
    public $mapCoverageService: MapCoverageService,
    private $mapStoreService: MapStoreService,
    // 路由
    private $router: Router,
    // 提示
    private $message: FiLinkModalService,
    private $nzI18n: NzI18nService,
    private $positionService: PositionService,
    private $mapService: MapService,
    // 地图框选设施监听服务
    private $selectFacilityChangeService: SelectFacilityChangeService,
    private $selectGroupService: SelectGroupService,
    private $groupApiService: FacilityForCommonService,
    private $selectTableEquipmentChangeService: SelectTableEquipmentChangeService,
  ) {
  }

  @Output() emptySelectChange = new EventEmitter<boolean>();
  // 是否是智能安防列表地图
  @Input() public isSecurity: boolean = false;
  @Input() listType: ListTypeEnum;
  // 地图
  @ViewChild('mainMap') mainMap: ApplicationMapComponent;
  // 是否隐藏列表部分
  @Output() public showTableChange = new EventEmitter<any>();
  // 当前视图
  public viewIndex = ViewEnum.maintenanceView;
  // 首页国际化
  public indexLanguage: IndexLanguageInterface;
  // 应用系统语言包
  public language: ApplicationInterface;
  // 资产语言包
  public facilityLanguage: FacilityLanguageInterface;
  // 公共语言包
  public commonLanguage: CommonLanguageInterface;
  // 地图配置
  public mapConfig: MapConfig;
  // 地图服务
  public mapService: MapAbstract;
  // 地图类型
  public mapType: FilinkMapEnum;
  // 设施图标大小
  public iconSize: string = mapIconConfig.defaultIconSize;
  // 设施数据
  public data: MapDataModel[];
  // 中心点
  public centerPoint: string;
  // 区域数据
  public areaData: string[];
  // 地图显示的设备类型
  public equipmentTypeArr: string[] = [];
  // 是否隐藏地图变小化按钮
  public isShowUpIcon: boolean = true;
  // 是否显示地图变大的按钮
  public isShowDownIcon: boolean = true;
  // 鼠标拖拽默认起始位置
  public srcPositionY: number;
  // 拖拽最新高度隐藏
  public minHeight: number = MIN_HEIGHT_CONST;
  // 地图全屏最大高度
  public maxHeight: number;
  // 设备or设施
  public facilityOrEquipment: string = FacilityListTypeEnum.equipmentList;
  // 是否显示我的关注列表窗口
  public isShowMyCollection: boolean = false;
  // 设备id集合
  public equipmentIds: string[] = [];
  // 地图是否显示添加关注，分组变更按钮
  public isShowButton: boolean = false;
  // 是否展示分组变更弹框
  public isShowGroupChange: boolean = false;
  // 框选的列表数据集
  public groupChangeDataSet = [];
  // 当前
  public selectMapType = QueryGroupTypeEnum.equipment;
  // 是否显示批量添加关注弹窗
  public isShowAddAttention: boolean = false;
  // 操作事件类型
  public selectedType: string = chooseTypeEnum.collect;
  // 是否显示地图
  public isShowMap: boolean = true;
// 是否显示加载进度条
  public isShowProgressBar: boolean = false;
  // 进度条初始进度
  public percent: number;
  // 进度条增长百分比
  public increasePercent: number;
  // 缓存的地图勾选的分组数据中的设备数据，需要高亮展示的设`备
  public facilityInGroup: any;
  // 关闭订阅流
  public destroy$ = new Subject<void>();
  // 进度条的定时器
  private scheduleTime: number;

  public ngOnInit() {
    // 初始化国际化
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.facilityLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // 初始化地图数据
    this.initMapData();
    // 框选通知注册
    this.initSelectGroup();
    // 初始数据处理
    this.handleInitData();
    // 监听我的关注设备列表定位
    this.$positionService.eventEmit.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value.positionBase) {
        const a = value.positionBase.split(',');
        value.code = null;
        value.lng = +a[0];
        value.lat = +a[1];
        this.mainMap.locationById('', value);
      }
    });
    // 监听分组列表勾选分组数据变化
    this.$selectTableEquipmentChangeService.eventEmit.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value.type === 'groupId') {
        // 勾选分组列表联动地图
        if (value.groupIds.length > 0) {
          const deviceMapQueryCondition = new QueryConditionModel();
          deviceMapQueryCondition.filterConditions.push(new FilterCondition('groupId', OperatorEnum.in, value.groupIds));
          deviceMapQueryCondition.filterConditions.push(new FilterCondition('equipmentType', OperatorEnum.in, this.equipmentTypeArr));
          this.$groupApiService.getEquipmentMapByGroupIds(deviceMapQueryCondition).subscribe((result: ResultModel<any>) => {
            if (result.code === ResultCodeEnum.success) {
              if (result.data.polymerizationData.length > 0 && this.mainMap) {
                this.mainMap.targetMarkerArr = [];
                this.mainMap.selectedFacility(result.data);
                this.facilityInGroup = _.cloneDeep(result.data);
              }
            }
          });
        } else {
          if (this.mainMap) {
            if (value.isFromTable === false) {
              return;
            }
            this.mainMap.resetAllTargetMarker();
          }
        }
      }
    });
  }

  /**
   * 组件销毁
   */
  public ngOnDestroy(): void {
    this.mainMap = null;
    // 取消订阅
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * 地图事件回传
   * param event
   */
  public mapEvent(event: MapEventModel): void {
    if (event.type === MapEventTypeEnum.clickClusterer) {
      // 打开聚合点table
    } else if (event.type === MapEventTypeEnum.selected) {
      // 设备选中，根据选中设备联动设备列表
      this.equipmentIds = [event.id];
      // 发送选中的设备id变化
      this.$selectFacilityChangeService.eventEmit.emit({equipmentIds: this.equipmentIds});
      if (this.mainMap) {
        this.mainMap.equipmentSelected = [{equipmentId: event.id}];
      }
    } else if (event.type === MapEventTypeEnum.mapBlackClick) {
      // 点击地图空白
      // 地图框选数据清空
      this.groupChangeDataSet = [];
      // 设施设备样式重置
      this.mainMap.resetAllTargetMarker();
      this.emptySelectChange.emit(true);
      // 发射清空选中设备
      this.$selectFacilityChangeService.eventEmit.emit({equipmentIds: []});
      if (this.listType === ListTypeEnum.groupList) {
        // 分组列表勾选缓存数据清空
        this.facilityInGroup = null;
      }
      if (this.mainMap && this.listType === ListTypeEnum.equipmentList) {
        // 设备列表勾选缓存数据清空
        this.mainMap.equipmentSelected = null;
      }
    } else if (event.type === MapEventTypeEnum.mapDrag) {
      // 地图拖动
      if (this.facilityInGroup) {
        this.facilityInGroup.positionCenter = null;
      }
    }
  }

  /**
   * 我的关注窗口显示
   * @param data 我的关注列表显示隐藏切换
   */
  public onShowMyCollection(data: boolean): void {
    this.isShowMyCollection = !data;
  }

  /**
   * 框选通知注册
   */
  public initSelectGroup(): void {
    this.$selectGroupService.eventEmit.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      // 清空勾选
      this.emptySelectChange.emit(true);
      // 框选中设备
      if (!_.isEmpty(value.datas)) {
        const equipmentData = [];
        value.datas.forEach(item => {
          equipmentData.push(item.equipmentList);
          this.mainMap.selectMarkerId(item.equipmentId);
        });
        this.groupChangeDataSet = _.flattenDeep(equipmentData);
        const equipmentIds = [];
        this.groupChangeDataSet.forEach(item => {
          equipmentIds.push(item.equipmentId);
        });
        // 传递框选数据联动地图下列表
        this.$selectFacilityChangeService.eventEmit.emit({equipmentIds: equipmentIds});
      }
    });
  }

  /**
   * 展示分组弹窗
   */
  public showCollectOrGroup() {
    // 当前缩放级别小于设备设施层 框选数据置空
    if (this.mainMap.mapService.getZoom() <= BMapConfig.areaZoom) {
      this.groupChangeDataSet = [];
    }
    if (_.isEmpty(this.groupChangeDataSet)) {
      this.$message.info(this.language.equipmentMap.pleaseChoose);
      return;
    }
    if (this.selectedType === chooseTypeEnum.groupChange) {
      // 分组变更弹窗
      this.isShowGroupChange = true;
    } else if (this.selectedType === chooseTypeEnum.collect) {
      // 批量关注弹窗
      this.isShowAddAttention = true;
    }
    this.isShowButton = false;
  }

  /**
   * 获取初始拖拽位置坐标
   */
  public dragstartHandle(e: DragEvent): void {
    // 取起始位置
    this.srcPositionY = e.pageY;
  }

  /**
   * 添加关注
   * @param e 点击事件
   */
  public handleAddAttention(e): void {
    this.selectedType = chooseTypeEnum.collect;
    this.isShowMyCollection = false;
    this.showCollectOrGroup();
    e.preventDefault();
    e.stopPropagation();
  }

  /**
   * 分组变更
   */
  public groupChange(e): void {
    this.selectedType = chooseTypeEnum.groupChange;
    this.isShowMyCollection = false;
    this.showCollectOrGroup();
    e.preventDefault();
    e.stopPropagation();
  }

  /**
   * 地图变小化
   */
  public mapMinHeightChange(): void {
    // 地图下表格部分
    this.showTableChange.emit(true);
    this.isShowDownIcon = true;
    if ($('#equipment-map-box').height() > (window.innerHeight / 2)) {
      $('#equipment-map-content').height(MAP_DEFAULT_HEIGHT_CONST);
      $('#equipment-map-box').height(MAP_DEFAULT_HEIGHT_CONST);
    } else {
      // 地图部分和外层不显示
      $('#equipment-map-content').height(0);
      // 地图隐藏
      this.isShowMap = false;
      $('#equipment-map-box').height(0);
      //  最小化隐藏变小按钮
      this.isShowUpIcon = false;
    }
  }

  /**
   * 地图变大化
   */
  public mapBigHeightChange(): void {
    // 地图和最小化按钮显示
    this.isShowUpIcon = true;
    if ($('#equipment-map-content').height() === 0) {
      // 显示地图
      this.isShowMap = true;
      // 刷新地图数据
      $('#equipment-map-content').height(MAP_DEFAULT_HEIGHT_CONST);
      $('#equipment-map-box').height(MAP_DEFAULT_HEIGHT_CONST);
      // this.initMapData();
    } else {
      // 发射表格隐藏事件
      this.showTableChange.emit(false);
      // 地图全屏高度 = 浏览器高度 - 上下边距
      this.maxHeight = window.innerHeight - MAX_HEIGHT_EDGE_CONST;
      // 全屏显示地图部分
      $('#equipment-map-content').height(this.maxHeight);
      $('#equipment-map-box').height(this.maxHeight);
      this.isShowDownIcon = false;
    }
  }

  /**
   * 拖拽鼠标松开触发事件
   */
  public dropHandle(e): void {
    // 如果地图隐藏了就直接返回不让推拽
    if (!this.isShowUpIcon) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
  }

  /**
   * 鼠标移动的时候地图部分高度变化
   */
  public dragoverHandle(e): void {
    // 如果地图隐藏了就直接返回不让推拽
    if (!this.isShowUpIcon) {
      return;
    }
    // 移动的时候表格显示
    this.showTableChange.emit(true);
    // 获取鼠标拖拽距离
    const move_dist = e.pageY - this.srcPositionY;
    const doc = $('#equipment-map-content');
    // 获取地图内容高度
    let afterAdjHeight = doc.height() + move_dist;
    afterAdjHeight = afterAdjHeight > this.minHeight ? afterAdjHeight : this.minHeight;
    // 最外层高度
    $('#equipment-map-box').height(afterAdjHeight);
    doc.height(afterAdjHeight);
    this.srcPositionY = e.pageY;
    e.preventDefault();
  }

  /**
   * 获取地图配置信息
   */
  public getAllMapConfig(): void {
    // 获取全部设施的配置
    this.$mapService.getALLFacilityConfig().subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        // 更新设施图标
        if (result.data && result.data.deviceIconSize) {
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
   * 分组变更操作后刷新数据
   */
  public reloadGroup(): void {
    this.$selectGroupService.eventEmit.emit({isShow: false});
    // 去除高亮
    this.mainMap.resetAllTargetMarker();
    // 重置框选数据
    this.groupChangeDataSet = [];
    this.isShowButton = false;
    // 发射刷新地图下列表事件
    this.$selectFacilityChangeService.eventEmit.emit({equipmentIds: this.groupChangeDataSet});
  }

  /**
   * 未分组
   */
  public noneGroupOperation() {
    // 获取当前视图下地图的设施
    const facilityListInWindow = FacilityForCommonUtil.getFacilityListInWindow(this, this.facilityLanguage);
    if (!facilityListInWindow) {
      return;
    }
    // 可能存在坐标相同聚合的设备，取聚合点上equipmentList 数据
    const equipmentIds = [];
    facilityListInWindow.forEach(item => {
      item.equipmentList.forEach( v => {
        equipmentIds.push(v.equipmentId);
      });
    });
    const queryCondition: QueryConditionModel = new QueryConditionModel();
    queryCondition.filterConditions = [new FilterCondition('equipmentType', OperatorEnum.in, this.equipmentTypeArr)];
    queryCondition.filterConditions.push(new FilterCondition('equipmentId', OperatorEnum.in, equipmentIds));
    this.$groupApiService.notInGroupForEquipmentMap(queryCondition).subscribe((res: ResultModel<any>) => {
      if (res.code === ResultCodeEnum.success) {
        // FacilityListModel
        if (res.data.equipmentData.length > 0) {
          if (this.mainMap) {
            this.mainMap.locationByIds(res.data, facilityListInWindow);
          }
        } else {
          this.$message.info('当前视图内无未分组的设备');
        }
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 确定批量关注设备/设施成功事件
   * @param event 关注成功
   */
  public onAddAttention(event) {
    if (event) {
      this.isShowMyCollection = false;
    }
  }

  /**
   * 框选按钮点击事件
   */
  public multipleSelect(): void {
    // 先清空之前的框选数据
    if (!_.isEmpty(this.groupChangeDataSet)) {
      this.mainMap.selectMarkerId();
      this.groupChangeDataSet = [];
    }
    this.isShowButton = !this.isShowButton;
    this.$selectGroupService.eventEmit.emit({isShow: this.isShowButton});
  }

  /**
   * 显示加载进度条
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
   * 隐藏加载进度条
   */
  public hideProgressBar(): void {
    this.percent = 100;
    setTimeout(() => {
      this.isShowProgressBar = false;
    }, 1000);
  }

  /**
   * 初始化地图区域设备数据
   */
  private initMapData(): void {
    const url = this.$router.url;
    if (url.includes(ApplicationFinalConst.lighting)) {
      // 照明筛选出单灯控制器和集中控制器
      this.equipmentTypeArr = [EquipmentTypeEnum.singleLightController, EquipmentTypeEnum.centralController];
    } else if (url.includes(ApplicationFinalConst.release)) {
      // 信息发布筛选出信息屏
      this.equipmentTypeArr = [EquipmentTypeEnum.informationScreen];
    } else if (url.includes(ApplicationFinalConst.broadcast)) {
      // 广播发布
      this.equipmentTypeArr = [EquipmentTypeEnum.broadcast];
    } else if (url.includes(ApplicationFinalConst.call)) {
      // 一键呼叫
      this.equipmentTypeArr = [EquipmentTypeEnum.oneTouchCalling];
    } else if (url.includes(ApplicationFinalConst.monitor)) {
      // 环境监测
      this.equipmentTypeArr = [EquipmentTypeEnum.weatherInstrument];
    } else {
      // 智能安防筛选出摄像头
      this.equipmentTypeArr = [EquipmentTypeEnum.camera];
    }
    const testData: EquipmentAreaModel = {
      // 用来区分区域点
      polymerizationType: AREA_POINT_CONST,
      filterConditions: {area: [], equipment: this.equipmentTypeArr}
    };
    this.$mapStoreService.polymerizationConfig = testData;
    // 获取设备数据
    this.$mapService.queryEquipmentPolymerizationList(testData).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        // 区域点数据
        if (result.data.polymerizationData && result.data.polymerizationData.length > 0) {
          this.data = result.data.polymerizationData.map(item => {
            if (!_.isEmpty(item.positionCenter)) {
              const position = item.positionCenter.split(',');
              item.lng = position[0];
              item.lat = position[1];
            }
            return item;
          });
        }
        const alarmData = new AlarmAreaModel();
        alarmData.filterConditions[0].filterField = 'alarm_source_type_id';
        alarmData.filterConditions[0].filterValue = this.equipmentTypeArr;
        this.$mapStoreService.alarmDataConfig = alarmData;
        if (!_.isEmpty(result.data.positionCenter)) {
          this.centerPoint = result.data.positionCenter.split(',');
          if (this.mainMap.mapService) {
            this.mainMap.mapService.setCenterAndZoom(this.centerPoint[0], this.centerPoint[1], 8);
          }
        } else {
          // 定位到当前所在城市
          if (this.mainMap.mapService) {
            this.mainMap.mapService.locateToUserCity();
          }
        }
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 初始化数据处理
   */
  private handleInitData(): void {
    // 地图相关配置
    this.mapType = FilinkMapEnum.baiDu;
    // 获取地图配置的图标大小
    this.getAllMapConfig();
    this.mapConfig = new MapConfig('equipment-map', this.mapType, this.iconSize, []);
    // 初始化地图类型
    this.$mapStoreService.mapType = this.mapType;
    this.$mapCoverageService.showCoverage = MapTypeEnum.equipment;
    this.$mapStoreService.showEquipmentTypeSelectedResults = this.equipmentTypeArr;
  }
}
