import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {FiLinkModalService} from '../../../../service/filink-modal/filink-modal.service';
import {MapStoreService} from '../../../../../core-module/store/map.store.service';
import {MapConfig} from '../../../map/map.config';
import {SelectGroupService} from '../../../../service/index/select-group.service';
import {FilterCondition, QueryConditionModel} from '../../../../model/query-condition.model';
import {LoopMapDeviceDataModel} from '../../../../../business-module/facility/share/model/loop-map-device-data.model';
import { MapEventTypeEnum, MapTypeEnum} from '../../../../enum/filinkMap.enum';
import {OperatorEnum} from '../../../../enum/operator.enum';
import {LanguageEnum} from '../../../../enum/language.enum';
import {MapEventModel} from '../../../../../core-module/model/map-event.model';
import {FacilityForCommonService} from '../../../../../core-module/api-service/facility';
import {LoopMapComponent} from '../../loop-map/loop-map.component';
import {FacilityListTypeEnum} from '../../../../../core-module/enum/facility/facility.enum';
import {MapCoverageService} from '../../../../service/index/map-coverage.service';
import {IndexLanguageInterface} from '../../../../../../assets/i18n/index/index.language.interface';
import {PositionService} from '../../../../../business-module/application-system/share/service/position.service';
import {LoopListCommon} from './loop-list-common';
import {MapService} from '../../../../../core-module/api-service/index/map';
import {MapConfig as BMapConfig} from '../../../map/b-map.config';

/**
 * 回路列表地图组件
 */
@Component({
  selector: 'app-loop-list-map',
  templateUrl: './loop-list-map.component.html',
  styleUrls: ['./loop-list-map.component.scss']
})
export class LoopListMapComponent extends LoopListCommon implements OnInit, OnDestroy, OnChanges {
  // 地图
  @ViewChild('mainMap') mainMap: LoopMapComponent;
  // 发射地图选中设施变化
  @Output() refreshDataEmit = new EventEmitter<any>();
  // 接收回路数据变化
  @Input() loopEventChange;
  public facilityOrEquipment = FacilityListTypeEnum.facilitiesList;
  // 地图配置
  public mapConfig: MapConfig;
  // 地图区域设施数据
  public data: LoopMapDeviceDataModel[] = [];
  // 地图下列表筛选条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 地图回路列表弹窗筛选条件
  public filterConditions: FilterCondition[] = [];
  // 地图框选的设施id集合
  public deviceIds: string[] = [];
  // 回路地图请求参数标识
  public areaFacilityByLoop: boolean = false;
  // 已选设施数据
  public selectFacility: boolean = true;
  // 是否显示关注列表
  public isShowMyCollection: boolean = false;
  // 首页国际化
  public indexLanguage: IndexLanguageInterface;
  constructor(
    public $facilityCommonService: FacilityForCommonService,
    public $message: FiLinkModalService,
    public $modalService: NzModalService,
    public $selectGroupService: SelectGroupService,
    public $mapService: MapService,
    public $mapStoreService: MapStoreService,
    private $nzI18n: NzI18nService,
    private $router: Router,
    private $mapCoverageService: MapCoverageService,
    private $positionService: PositionService,
  ) {
    super($facilityCommonService, $message, $modalService, $selectGroupService, $mapService, $mapStoreService);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.assetLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
    this.isShowAddAttention = false;
    // 刷新列表数据
    this.refreshData();
    this.$mapCoverageService.showCoverage = MapTypeEnum.facility;
    // 初始化地图数据
    this.initMapData();
    // 初始数据处理
    this.handleInitData();
    // 监听我的关注设施列表定位
    this.$positionService.eventEmit.subscribe((value) => {
      if (value.positionBase) {
        const a = value.positionBase.split(',');
        value.code = null;
        value.lng = +a[0];
        value.lat = +a[1];
        value.facilityId = value.deviceId;
        this.mainMap.locationById('', value);
      }
    });
  }

  public ngOnChanges(changes: SimpleChanges) {
    // 忽略loopEventChange第一次改变
    if (changes.loopEventChange.currentValue && !changes.loopEventChange.firstChange) {
      // 根据地图操作选中的设施进行回路连线
      if (changes.loopEventChange.currentValue.length > 0) {
        const selectDataIds = this.loopEventChange.map(item => {
          return {loopId: item.loopId};
        });
        this.loopDrawLine(selectDataIds);
      } else {
        // 清除回路线
        if (this.mainMap) {
          this.mainMap.clearLoopDrawLine();
        }
      }
    }
  }
  /**
   * 组件销毁
   */
  public ngOnDestroy(): void {
    this.mainMap = null;
    this.destroy$.next();
    this.destroy$.complete();
  }
  /**
   * 我的关注窗口显示
   * @param data 我的关注列表显示隐藏切换
   */
  public onShowMyCollection(data: boolean): void {
    this.isShowMyCollection = !data;
  }
  /**
   * 地图事件回传
   */
  public mapEvent(event: MapEventModel): void {
    if (event.type === MapEventTypeEnum.selected) {
      this.deviceIds = [event.id];
      this.queryCondition.filterConditions = [new FilterCondition('deviceIds', OperatorEnum.in, [event.id])];
      this.refreshData();
      // 还原参数
      this.queryCondition.filterConditions = [];
    } else if (event.type === MapEventTypeEnum.mapBlackClick) {
      this.queryCondition.filterConditions = [];
      // 清除回路线
      this.mainMap.clearLoopDrawLine();
      this.mainMap.loopDrawLineData = [];
      // 清除选中状态
      if (!_.isEmpty(this.deviceIds)) {
        this.mainMap.resetMarkersStyle(this.deviceIds);
      }
      this.deviceIds = [];
      this.refreshData();
      this.isShowButton = false;
    }
    // 区域点点击展开事件
    if (event.type === MapEventTypeEnum.areaPoint) {
      this.areaFacilityByLoop = false;
      // 清除地图所有的点
      this.mainMap.mapService.markerClusterer.clearMarkers();
      // 定位到当前区域点的中心点
      const centerPoint = event.data.split(',');
      this.mainMap.mapService.setCenterAndZoom(centerPoint[0], centerPoint[1], BMapConfig.deviceZoom);
      // this.mainMap.mapService.panTo(event.data['lng'], event.data['lat']);
      // 创建设施点
      // this.mainMap.getMapDeviceData([event.data.code], 'area').then();
      this.mainMap.zoomLocation();
    }
  }


  /**
   * 批量关注设备/设施成功事件
   * @param event 关注成功
   */
  public onAddAttention(event) {
    if (_.isEmpty(this.deviceIds)) {
      this.$message.info(this.assetLanguage.pleaseSelectDevice);
      return;
    }
    if (event) {
      this.isShowMyCollection = false;
    }
    this.deviceIds = [];
  }
  /**
   * 添加关注按钮点击
   */
  public handleAddAttention(): void {
    this.isShowButton = false;
    this.isShowMyCollection = false;
    this.isHaveDistributionPanel = true;
    // 清除选中状态
    if (!_.isEmpty(this.deviceIds)) {
      this.mainMap.resetMarkersStyle(this.deviceIds);
    }
    // 重置框选数据
    this.deviceIds = [];
    this.$selectGroupService.eventEmit.emit({isShow: true});
  }
  /**
   * 下方回路列表表格查询条件改变
   */
  public refreshData(): void {
    this.refreshDataEmit.emit(this.deviceIds);
  }
}
