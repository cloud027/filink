import {LoopListModel} from '../../../../../core-module/model/loop/loop-list.model';
import {ResultModel} from '../../../../model/result.model';
import {ResultCodeEnum} from '../../../../enum/result-code.enum';
import * as _ from 'lodash';
import * as $ from 'jquery';
import {EventEmitter, Output, ViewChild} from '@angular/core';
import {FilinkMapEnum} from '../../../../enum/filinkMap.enum';
import {FilterCondition, QueryConditionModel} from '../../../../model/query-condition.model';
import {LoopMapDeviceDataModel} from '../../../../../business-module/facility/share/model/loop-map-device-data.model';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {LanguageEnum} from '../../../../enum/language.enum';
import {AssetManagementLanguageInterface} from '../../../../../../assets/i18n/asset-manage/asset-management.language.interface';
import {MAP_DEFAULT_HEIGHT_CONST, MAX_HEIGHT_EDGE_CONST, MIN_HEIGHT_CONST} from '../../../../../core-module/const/facility/facility.const';
import {FacilityForCommonService} from '../../../../../core-module/api-service/facility';
import {FiLinkModalService} from '../../../../service/filink-modal/filink-modal.service';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';
import {LoopDrawDeviceModel} from '../../../../../core-module/model/facility/loop-draw-device.model';
import {LoopMapComponent} from '../../loop-map/loop-map.component';
import {MapConfig} from '../../../map/map.config';
import {NzModalService} from 'ng-zorro-antd';
import {SelectGroupService} from '../../../../service/index/select-group.service';
import {OperatorEnum} from '../../../../enum/operator.enum';
import {MapAreaRequestModel} from '../../../../../core-module/model/map-area-request.model';
import {AREA_POINT_CONST} from '../../../../../core-module/const/index/map.const';
import {DeviceTypeEnum} from '../../../../../core-module/enum/facility/facility.enum';
import {MapAreaResponseModel} from '../../../../../core-module/model/map-area-response.model';
import {MapService} from '../../../../../core-module/api-service/index/map';
import {MapStoreService} from '../../../../../core-module/store/map.store.service';
import {mapIconConfig} from '../../../../service/map-service/map.config';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

/**
 * 资产回路地图与应用系统回路公用部分（划线 拖拽）
 */
export class LoopListCommon {
  // 地图
  @ViewChild('mainMap') mainMap: LoopMapComponent;
  // 是否隐藏列表部分
  @Output() public showTableChange = new EventEmitter<any>();
  // 地图配置
  public mapConfig: MapConfig;
  // 地图区域设施数据
  public data: LoopMapDeviceDataModel[] = [];
  // 设施图标大小
  public iconSize: string = mapIconConfig.defaultIconSize;
  // 地图类型
  public mapType: FilinkMapEnum;
  // 地图是否显示移入移出按钮
  public isShowButton: boolean = false;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 资产语言包
  public assetLanguage: AssetManagementLanguageInterface;

  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 地图回路列表弹窗筛选条件
  public filterConditions: FilterCondition[] = [];
  // 是否隐藏列表部分
  public isShowTable: boolean = true;
  // 是否隐藏地图变小化按钮
  public isShowUpIcon: boolean = true;
  // 是否显示地图变大的按钮
  public isShowDownIcon: boolean = true;
  // 回路弹框是否展开
  public isVisible: boolean = false;
  // 回路弹框标题
  public loopModalTitle: string;
  // 区域中心点
  public centerPoint: string[];
  // 地图框选的设施id集合
  public deviceIds: string[] = [];
  // 地图移出回路列表要筛选传值
  public isMoveOut: boolean;
  // 鼠标拖拽默认起始位置
  public srcPositionY: number;
  // 拖拽最新高度隐藏
  public minHeight: number = MIN_HEIGHT_CONST;
  // 地图全屏最大高度
  public maxHeight: number;
  // 设备列表多语言
  public languageTable: ApplicationInterface;
  // 国际化前缀枚举
  public languageEnum = LanguageEnum;
  // 已选回路列表数据
  public loopSelectedData: LoopListModel[] = [];
  // 已选设施数据
  public selectFacility: boolean = true;
  // 框选列表数据集
  public loopChangeDataSet: object[] = [];
  // 框选数据是否有配电箱,默认去除配电箱
  public isHaveDistributionPanel: boolean = false;
  // 是否显示批量关注弹窗
  public isShowAddAttention: boolean;
  // 关闭订阅流
  public destroy$ = new Subject<void>();
  constructor(
    public $facilityCommonService: FacilityForCommonService,
    public $message: FiLinkModalService,
    public $modalService: NzModalService,
    public $selectGroupService: SelectGroupService,
    public $mapService: MapService,
    public $mapStoreService: MapStoreService,
  ) {
  }

  /**
   * 回路弹框选择数据
   */
  public selectLoopData(ev: LoopListModel[]): void {
    if (!_.isEmpty(ev)) {
      const loopIds = ev.map(item => item.loopId);
      const moveInOrOutParam = {
        loopIds: loopIds,
        deviceIds: this.deviceIds
      };
      let beforeMsgTip;
      let request;
      let msgTip;
      // 移出回路请求
      if (this.isMoveOut) {
        request = this.$facilityCommonService.moveOutLoop(moveInOrOutParam);
        msgTip = this.assetLanguage.moveOutLoopSucceededTip;
        beforeMsgTip = this.assetLanguage.moveOutLoopBeforeTip;
      } else {
        // 将设施移入回路前提示
        loopIds.length > 1 ? beforeMsgTip = this.assetLanguage.moveInLoopManyBeforeTip : beforeMsgTip = this.assetLanguage.moveInLoopEachBeforeTip;
        // 移入回路
        request = this.$facilityCommonService.moveIntoLoop(moveInOrOutParam);
        msgTip = this.assetLanguage.moveIntoLoopSucceededTip;
      }
      this.$modalService.confirm({
        nzTitle: this.language.prompt,
        nzContent: `<span>${beforeMsgTip}</span>`,
        nzOkText: this.language.handleCancel,
        nzOkType: 'danger',
        nzMaskClosable: false,
        nzOnOk: () => {
        },
        nzCancelText: this.language.handleOk,
        nzOnCancel: () => {
          request.subscribe((result: ResultModel<string>) => {
            if (result.code === ResultCodeEnum.success) {
              this.$message.success(msgTip);
              const loops = this.loopSelectedData.map(item => {
                return {loopId: item.loopId};
              });
              this.refreshData();
              this.loopDrawLine(loops);
              this.isVisible = false;
              this.isShowButton = false;
            } else {
              this.$message.error(result.msg);
            }
          });
        }
      });
    } else {
      // 关闭弹框
      this.isVisible = false;
    }
  }

  /**
   * 刷新地图下列表
   */
  public refreshData() {
  }

  /**
   * 回路画线操作
   */
  public loopDrawLine(event: { loopId: string }[]) {
    if (!_.isEmpty(event)) {
      // 选择回路画线
      this.$facilityCommonService.queryDeviceMapByLoop(event).subscribe((result: ResultModel<LoopDrawDeviceModel>) => {
        if (result.code === ResultCodeEnum.success) {
          const res = result.data.loopDeviceMap;
          if (!_.isEmpty(res) && !_.isEmpty(res[0])) {
            const mapCenterPoint = res[0][0].positionBase.split(',');
            const centerPoint = [{
              lng: mapCenterPoint[0], lat: mapCenterPoint[1]
            }];
            if (this.mainMap) {
              this.mainMap.loopDrawLine(res, centerPoint);
            }
          }
        }
      });
    } else {
      // 无选中数据清除画线
      if (this.mainMap) {
        this.mainMap.clearLoopDrawLine();
      }
    }
  }

  /**
   * 获取初始拖拽位置坐标
   */
  public dragstartHandle(e): void {
    // 取起始位置
    this.srcPositionY = e.pageY;
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
    // 移动的时候表格显示
    this.isShowTable = true;
    // 获取鼠标拖拽距离
    const move_dist = e.pageY - this.srcPositionY;
    const doc = $('#drag-content');
    // 获取地图内容高度
    let afterAdjHeight = doc.height() + move_dist;
    afterAdjHeight = afterAdjHeight > this.minHeight ? afterAdjHeight : this.minHeight;
    // 最外层高度
    $('#drag-box').height(afterAdjHeight);
    doc.height(afterAdjHeight);
    this.srcPositionY = e.pageY;
    e.preventDefault();
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
   * 地图变小化
   */
  public mapMinHeightChange(): void {
    // 地图下表格部分
    this.showTableChange.emit(true);
    // 表格部分
    this.isShowTable = true;
    this.isShowDownIcon = true;
    if ($('#drag-box').height() > (window.innerHeight / 2)) {
      $('#drag-content').height(MAP_DEFAULT_HEIGHT_CONST);
      $('#drag-box').height(MAP_DEFAULT_HEIGHT_CONST);
    } else {
      // 地图部分和外层不显示
      $('#drag-content').height(0);
      $('#drag-box').height(0);
      $('#drag-content').hide();
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
    if ($('#drag-content').height() === 0) {
      // 刷新地图数据
      $('#drag-content').height(MAP_DEFAULT_HEIGHT_CONST);
      $('#drag-box').height(MAP_DEFAULT_HEIGHT_CONST);
      $('#drag-content').show();
      // this.initMapData();
    } else {
      // 发射表格隐藏事件
      this.showTableChange.emit(false);
      // 地图全屏高度 = 浏览器高度 - 上下边距
      this.maxHeight = window.innerHeight - MAX_HEIGHT_EDGE_CONST;
      // 全屏显示地图部分
      $('#drag-content').height(this.maxHeight);
      $('#drag-box').height(this.maxHeight);
      // 表格
      this.isShowTable = false;
      this.isShowDownIcon = false;
    }
  }

  /**
   * 点击框选事件
   */
  public mapSelectData(): void {
    this.isShowButton = !this.isShowButton;
    this.selectFacility = false;
    // 清除选中状态
    if (!_.isEmpty(this.deviceIds) && this.mainMap) {
      this.mainMap.resetMarkersStyle(this.deviceIds);
    }
    // 重置框选数据
    this.deviceIds = [];
    this.isHaveDistributionPanel = false;
    this.$selectGroupService.eventEmit.emit({isShow: this.isShowButton});
  }

  /**
   * 移入,移出回路事件
   */
  public moveIntoOrOutLoop(event: boolean): void {
    if (_.isEmpty(this.deviceIds)) {
      this.$message.info(this.assetLanguage.pleaseSelectDevice);
      return;
    }
    this.selectFacility = true;
    this.isMoveOut = event;
    this.isVisible = true;
    // 查询移除移入回路列表
    this.moveOutOrMoveIntoLoop();
  }

  /**
   * 初始化数据处理
   */
  public handleInitData(): void {
    // 地图相关配置
    this.mapType = FilinkMapEnum.baiDu;
    this.getAllMapConfig();
    this.mapConfig = new MapConfig('loop-map', this.mapType, this.iconSize, []);
    this.$selectGroupService.eventEmit.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value && !value.isShow) {
        if (!_.isEmpty(value.datas) && !this.isHaveDistributionPanel) {
          value.datas = value.datas.filter(v => v.deviceType !== DeviceTypeEnum.distributionPanel);
        }
        if (!_.isEmpty(value.datas)) {
          this.loopChangeDataSet = value.datas;
          // 先清空之前的框选数据
          if (!_.isEmpty(this.deviceIds) && this.mainMap) {
            this.mainMap.resetMarkersStyle(this.deviceIds);
            this.deviceIds = [];
          }
          // 筛选出智慧功能杆子id集合
          this.deviceIds = value.datas.map(item => item.deviceId) || [];
          value.datas.forEach(v => {
            if (this.mainMap) {
              this.mainMap.onSelectMarker(v.deviceId);
            }
          });
          if (this.isHaveDistributionPanel) {
            this.isShowAddAttention = true;
          }
          this.queryCondition.filterConditions = [new FilterCondition('deviceIds', OperatorEnum.in, this.deviceIds)];
        } else {
          this.queryCondition.filterConditions = [];
        }
        this.refreshData();
      }
    });
    if (!this.isHaveDistributionPanel) {
      this.$selectGroupService.eventEmit.emit({isShow: this.isShowButton});
    } else {
      this.$selectGroupService.eventEmit.emit({isShow: true});
    }
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
   * 初始化地图区域设施统计数据
   */
  public initMapData(): void {
    const mapByAreaRequest: MapAreaRequestModel = {
      // 用来区分区域点
      polymerizationType: AREA_POINT_CONST,
      filterConditions: {area: [], device: [DeviceTypeEnum.wisdom, DeviceTypeEnum.distributionPanel]}
    };
    this.$mapStoreService.polymerizationConfig = mapByAreaRequest;
    // 用户有权限的区域下所有智慧功能杆子设施总数
    this.$mapService.queryDevicePolymerizationList(mapByAreaRequest).subscribe((result: ResultModel<MapAreaResponseModel>) => {
      if (result.code === ResultCodeEnum.success) {
        if (!_.isEmpty(result.data.positionCenter)) {
          this.centerPoint = result.data.positionCenter.split(',');
          // 区域点数据
          this.data = result.data.polymerizationData.map(item => {
            if (!_.isEmpty(item.positionCenter)) {
              const position = item.positionCenter.split(',');
              item.lng = position[0];
              item.lat = position[1];
            }
            return item;
          });
          if (this.centerPoint && this.mainMap) {
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
   * 查询移入移除回路数据列表
   */
  private moveOutOrMoveIntoLoop(): void {
    // 根据ids筛选出回路列表
    if (this.isMoveOut) {
      this.loopModalTitle = this.assetLanguage.moveOutTheLoop;
      this.filterConditions = [new FilterCondition('deviceIds', OperatorEnum.in, this.deviceIds)];
    } else {
      this.filterConditions = [];
      this.loopModalTitle = this.assetLanguage.moveIntoLoop;
    }
  }
}
