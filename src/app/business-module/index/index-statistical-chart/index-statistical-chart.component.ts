import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {MapService} from '../../../core-module/api-service/index/map';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import {IndexLanguageInterface} from '../../../../assets/i18n/index/index.language.interface';
import {LockService} from '../../../core-module/api-service/lock';
import {FacilityService} from '../../../core-module/api-service/facility/facility-manage';
import {CommonUtil} from '../../../shared-module/util/common-util';
import {INDEX_CARD_TYPE} from '../../../core-module/const/index/index.const';
import {indexChart} from '../util/index-charts';
import {AlarmLevelColorEnum} from '../../../core-module/enum/alarm/alarm-level-color.enum';
import {DeviceDetailStatusEnum} from '../../../core-module/enum/facility/facility.enum';
import {LanguageEnum} from '../../../shared-module/enum/language.enum';
import {ResultModel} from '../../../shared-module/model/result.model';
import {FacilityForCommonUtil} from '../../../core-module/business-util/facility/facility-for-common.util';
import {AlarmLevelCountEnum} from '../../../core-module/enum/alarm/alarm-level-count.enum';
import {DeviceTypeCountModel} from '../../../core-module/model/facility/device-type-count.model';
import {AlarmLevelStatisticsModel} from '../../../core-module/model/alarm/alarm-level-statistics.model';
import {AlarmStatisticsGroupInfoModel} from '../../../core-module/model/alarm/alarm-statistics-group-Info.model';
import {FacilityLogTopNumModel} from '../../../core-module/model/facility/facility-log-top-num.model';
import {FacilityDetailInfoModel} from '../../../core-module/model/facility/facility-detail-info.model';
import {ResultCodeEnum} from '../../../shared-module/enum/result-code.enum';
import {ApplicationSystemForCommonService} from '../../../core-module/api-service/application-system';
import {WorkOrderIncreaseModel} from '../../../core-module/model/application-system/work-order-increase.model';
import {QueryFacilityCountModel} from '../shared/model/query-facility-count.model';
import {SessionUtil} from '../../../shared-module/util/session-util';
import {Router} from '@angular/router';
import {EquipmentTypeEnum} from '../../../core-module/enum/equipment/equipment.enum';
import {takeUntil} from 'rxjs/operators';
import {AdjustCoordinatesService} from '../../../shared-module/service/index/adjust-coordinates.service';
import {Subject} from 'rxjs';
import * as lodash from 'lodash';
import {SelectModel} from '../../../shared-module/model/select.model';
import {WorkOrderStatusUtil} from '../../../core-module/business-util/work-order/work-order-for-common.util';
import {MonthEnum} from '../../../shared-module/enum/month.enum';
import {TroubleUtil} from '../../../core-module/business-util/trouble/trouble-util';

@Component({
  selector: 'app-index-statistics',
  templateUrl: './index-statistical-chart.component.html',
  styleUrls: ['./index-statistical-chart.component.scss']
})
export class IndexStatisticalChartComponent implements OnInit, AfterViewInit {

  // 标题
  @Input() title: string;
  // 类型
  @Input() type: number;
  // 是否显示标题
  @Input() isShowTitle: boolean;
  // 是否显示select选择器
  @Input() isShowSelect: boolean;
  // 统计图类型
  @Input() isOneType: any;
  // 区域信息
  @Input() data: any[];
  // 是否显示故障类型统计图
  @Input() noFaultType: boolean = true;
  // 是否显示故障增长率统计图
  @Input() noFailureRateAnalysis: boolean = true;
  // 设备类型选择结果
  @Input() selectEquipmentData;
  // 故障类型统计图
  @Output() noFaultTypeEmitter = new EventEmitter();
  // 故障增长率统计图
  @Output() noFailureRateAnalysisEmitter = new EventEmitter();
  // 设备类型选择结果
  @Output() selectEquipmentEmitter = new EventEmitter();
  // 国际化
  public indexLanguage: IndexLanguageInterface;
  // 卡片类型
  public cardType = INDEX_CARD_TYPE;
  // 统计不同类型总数
  public statisticsCount: QueryFacilityCountModel[] = [];
  // 统计设施总数
  public statisticsNumber = [0, 0, 0, 0, 0, 0];
  // 是否显示设施状态图实例
  public deviceStatusChartOption: any = {};
  // 设施状态
  public noDeviceStatusChart = true;
  // 工单增量图实例
  public procAddListCountOption: any = {};
  // 是否显示工单增量
  public noProcAddListCount = true;
  // 查询繁忙TOP图实例
  public userUnlockingTopOption: any = {};
  // 是否显示查询繁忙TOP图
  public noUserUnlockingTop = true;
  // 告警设施Top10图实例
  public screenDeviceIdsGroupOption: any = {};
  // 设备在线统计图
  public equipmentOnlineRateOption: any = {};
  // 是否显示设备在线统计图
  public noEquipmentOnlineRate: boolean = true;
  // 设备在线统计图总数
  public equipmentOnlineRateNum: any;
  // 故障类型统计图
  public faultTypeOption: any = {};
  // 故障类型统计图总数
  public faultTypeNum: any;
  // 设备总能耗统计图
  public equipmentEnergyConsumptionOption: any = {};
  // 设备传输有效率统计图
  public equipmentTransmissionEfficiencyOption: any = {};
  // 故障率分析统计图
  public failureRateAnalysisOption: any = {};
  // 规划统计图
  public planningOption: any = {};
  // 工单类型统计图
  public workOrderOption: any = {};
  // 项目统计图
  public projectOption: any = {};
  // 是否显示告警设施Top10图
  public noScreenDeviceIdsGroup = true;
  // 是否显示ceshi图
  public noScreenCeShi = true;
  // 当前告警各级别数量图实例
  public alarmCurrentLevelGroupOption: any = {};
  // 是否显示当前告警各级别数量
  public noAlarmCurrentLevelGroup = true;
  // 告警增量图实例
  public alarmDateStatisticsOption: any = {};
  // 是否显示告警增量
  public noAlarmDateStatistics = true;
  // 设施集权限
  public deviceRole: string[] = [];
  // 设施总数/不同类型的设施总数
  public deviceCount: boolean = false;
  // 设施状态
  public deviceStatus: boolean = false;
  // 当前告警总数
  public alarmCount: boolean = false;
  // 告警增量
  public alarmIncrement: boolean = false;
  // 工单增量
  public workIncrement: boolean = false;
  // 繁忙设施TOP/告警设施TOP
  public topRole: boolean = false;
  // 权限下设备类型
  public equipmentType;
  // 设备统计图筛选条件
  public equipmentFilterConditions;
  // 工单统计图筛选条件
  public workOrderFilterConditions;
  // 翻译工具类
  public commonUtil;
  // 设备类型枚举
  public equipmentTypeEnum;
  // 国际化枚举
  public languageEnum;
  // 关闭订阅流
  private destroy$ = new Subject<void>();
  // 设备类型选择结果
  public selectEquipment;
  // 工单类型
  public procTypeList: SelectModel[] = [];
  // 选择工单类型
  public selectOrderType: string;

  // 运维数据防抖
  showRefresh = lodash.debounce(() => {
    this.queryFailureRateAnalysis();
    this.queryEquipmentTransmissionEfficiency();
    this.queryFaultType();
    this.queryEquipmentOnlineRate();
    this.queryEquipmentEnergyConsumption();
  }, 1000, {leading: false, trailing: true});

  constructor(private $nzI18n: NzI18nService,
              private $router: Router,
              private $message: FiLinkModalService,
              private $mapService: MapService,
              private $modal: NzModalService,
              private $lockService: LockService,
              private $facilityService: FacilityService,
              private $applicationSystemForCommonService: ApplicationSystemForCommonService,
              public $adjustCoordinatesService: AdjustCoordinatesService,
  ) {
    this.commonUtil = CommonUtil;
    this.equipmentTypeEnum = EquipmentTypeEnum;
    this.languageEnum = LanguageEnum;
    this.equipmentType = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n);
    this.procTypeList = WorkOrderStatusUtil.checkProcAuthority(this.$nzI18n) as SelectModel[];
    if (this.procTypeList.length) {
      this.selectOrderType = this.procTypeList[0].code as string;
    }
  }

  ngOnInit() {
    this.selectEquipment = this.selectEquipmentData;
    this.equipmentFilterConditions = [
      {
        filterField: 'equipmentType',
        operator: 'eq',
        filterValue: this.selectEquipment
      }
    ];
    this.workOrderFilterConditions = [
      {
        filterField: 'orderType',
        operator: 'eq',
        filterValue: this.procTypeList.length ? this.procTypeList[0].code : null
      }
    ];
    // 国际化配置
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
    // 统计卡片权限查询
    this.queryDeviceRole();
    this.$adjustCoordinatesService.eventEmit.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value.selectEquipment) {
        this.selectEquipment = value.selectEquipment;
      }
      if (value.faultTypeNum) {
        this.faultTypeNum = value.faultTypeNum;
      }
      if (value.faultTypeOption) {
        this.faultTypeOption = value.faultTypeOption;
      }
      if (value.hasOwnProperty('equipmentEnergyConsumptionOption')) {
        if (value.equipmentEnergyConsumptionOption) {
          this.equipmentEnergyConsumptionOption = value.equipmentEnergyConsumptionOption;
        } else {
          this.equipmentEnergyConsumptionOption = null;
        }
      }
      if (value.equipmentTransmissionEfficiencyOption) {
        this.equipmentTransmissionEfficiencyOption = value.equipmentTransmissionEfficiencyOption;
      }
      if (value.failureRateAnalysisOption) {
        this.failureRateAnalysisOption = value.failureRateAnalysisOption;
      }
    });
  }

  ngAfterViewInit() {
    // 初始化统计图
    this.initCountChart();
  }

  /**
   * 权限查询
   */
  queryDeviceRole() {
    const userInfo = SessionUtil.getUserInfo();
    this.deviceRole = userInfo.role.roleDeviceTypeDto.deviceTypes;
  }

  /**
   * 初始化统计图
   */
  private initCountChart(): void {
    switch (this.type) {
      // 设施总数
      case this.cardType.deviceCount:
        this.queryDeviceTypeALLCount();
        break;
      // 类型总数
      case this.cardType.typeCount:
        this.queryDeviceTypeCount();
        break;
      // 设施状态
      case this.cardType.deviceStatus:
        this.queryUserDeviceStatusCount();
        break;
      // 当前告警总数
      case this.cardType.alarmCount:
        this.queryAlarmCurrentLevelGroup();
        break;
      // 告警增量
      case this.cardType.alarmIncrement:
        this.queryAlarmDateStatistics();
        break;
      // 工单增量
      case this.cardType.workIncrement:
        this.queryHomeProcAddListCountGroupByDay();
        break;
      // 繁忙设施TOP
      case this.cardType.busyTop:
        this.queryUserUnlockingTopNum();
        break;
      // 告警设施TOP
      case this.cardType.alarmTop:
        this.queryScreenDeviceIdsGroup();
        break;
      // 设备在线率统计图
      case this.cardType.equipmentOnlineRate:
        this.queryEquipmentOnlineRate();
        break;
      // 故障类型统计图
      case this.cardType.faultType:
        this.queryFaultType();
        break;
      // 规划数据统计
      case this.cardType.planning:
        this.queryPlanning();
        break;
      // 项目数据统计
      case this.cardType.project:
        this.queryProject();
        break;
      // 工单类型统计
      case this.cardType.workOrder:
        if (this.procTypeList && this.procTypeList.length) {
          this.queryWorkOrder();
        }
        break;
      // 设备总能耗统计
      case this.cardType.equipmentEnergyConsumption:
        this.queryEquipmentEnergyConsumption();
        break;
      // 设备传输有效率统计
      case this.cardType.equipmentTransmissionEfficiency:
        this.queryEquipmentTransmissionEfficiency();
        break;
      // 故障率分析统计图
      case this.cardType.failureRateAnalysis:
        this.queryFailureRateAnalysis();
        break;
    }
  }

  /**
   * 查询设施总数
   */
  private queryDeviceTypeALLCount(): void {
    this.$facilityService.queryDeviceTypeCount().subscribe((result: ResultModel<Array<DeviceTypeCountModel>>) => {
      if (result.code === ResultCodeEnum.success) {
        const data: Array<DeviceTypeCountModel> = [];
        // 根据权限集进行过滤
        result.data.forEach(item => {
          const role = this.deviceRole.indexOf(item.deviceType);
          if (role !== -1) {
            data.push(item);
          }
        });
        // 设施总数
        let sum = 0;
        data.forEach(item => {
          sum += item.deviceNum;
        });
        // 补零
        const count = (Array('000000').join('0') + sum).slice(-6);
        this.statisticsNumber = [];
        // 统计设施总数
        this.statisticsNumber = (count + '').split('').map(Number);
      }
    });
  }

  /**
   * 查询类型总数
   */
  private queryDeviceTypeCount(): void {
    this.$facilityService.queryDeviceTypeCount().subscribe((result: ResultModel<Array<DeviceTypeCountModel>>) => {
      if (result.code === ResultCodeEnum.success) {
        const data: Array<DeviceTypeCountModel> = result.data || [];
        // 获取全部设施类型
        const deviceTypes = FacilityForCommonUtil.translateDeviceType(this.$nzI18n) as QueryFacilityCountModel[];
        // 根据权限集进行过滤
        const deviceList: QueryFacilityCountModel[] = [];
        deviceTypes.forEach(item => {
          const role = this.deviceRole.indexOf(item.code);
          if (role !== -1) {
            deviceList.push(item);
          }
        });
        // 构造设施数据
        deviceList.forEach(item => {
          const type = data.find(_item => _item.deviceType === item.code);
          if (type) {
            item.sum = type.deviceNum;
          } else {
            item.sum = 0;
          }
          item.textClass = CommonUtil.getFacilityTextColor(item.code);
          item.iconClass = CommonUtil.getFacilityIConClass(item.code);
        });
        // 统计不同类型总数
        this.statisticsCount = deviceList;
      }
    });
  }

  /**
   * 查询各设施状态数量
   */
  private queryUserDeviceStatusCount(): void {
    this.$mapService.queryUserDeviceStatusCount().subscribe((result: ResultModel<Array<DeviceTypeCountModel>>) => {
      if (result.code === ResultCodeEnum.success) {
        const data: Array<DeviceTypeCountModel> = result.data || [];
        if (data.length === 0) {
          this.noDeviceStatusChart = true;
        } else {
          this.noDeviceStatusChart = false;
          const userDeviceStatusCount = data.map(_item => {
            if (_item.deviceNum !== 0) {
              return {
                value: _item.deviceNum,
                name: CommonUtil.codeTranslate(DeviceDetailStatusEnum, this.$nzI18n, _item.deviceStatus, 'facility.config') || '',
                itemStyle: {color: CommonUtil.getFacilityColor(_item.deviceStatus)}
              };
            }
          });
          this.deviceStatusChartOption = indexChart.setRingChartOption(userDeviceStatusCount, this.indexLanguage.facilityStatusTitle);
        }
      }
    });
  }

  /**
   * 获取当前告警总数
   */
  private queryAlarmCurrentLevelGroup(): void {
    this.$mapService.queryAlarmCurrentLevelGroup().subscribe((result: ResultModel<Array<AlarmLevelStatisticsModel>>) => {
      if (result.code === ResultCodeEnum.success) {
        if (result.data.length === 0) {
          this.noAlarmCurrentLevelGroup = true;
        } else {
          const data: Array<AlarmLevelStatisticsModel> = result.data || [];
          // 获取全部的告警级别
          const alarmCount = CommonUtil.codeTranslate(AlarmLevelCountEnum, this.$nzI18n, null, LanguageEnum.bigScreen);
          let sum = 0;
          Object.keys(data).forEach(item => {
            const alarmItem = alarmCount[Object.keys(data).indexOf(item)];
            if (item === alarmItem['code']) {
              sum += data[item];
              if (data[item] !== 0) {
                alarmItem['value'] = data[item];
                alarmItem['name'] = alarmItem['label'];
                alarmItem['itemStyle'] = {color: AlarmLevelColorEnum[item.replace('Count', '')]};
              }
            }
          });
          // 如果告警总数大于零
          if (sum > 0) {
            this.noAlarmCurrentLevelGroup = false;
          }
          this.alarmCurrentLevelGroupOption = indexChart.setBarChartOption(alarmCount, this.indexLanguage.currentAlarmNum);
        }
      }
    });
  }

  /**
   * 工单增量
   */
  private queryHomeProcAddListCountGroupByDay(): void {
    // 固定参数
    const params = {
      statisticalType: '4'
    };
    this.$applicationSystemForCommonService.findApplyStatisticsByCondition(params).subscribe((result: ResultModel<WorkOrderIncreaseModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        if (result.data.length === 0) {
          this.noProcAddListCount = true;
        } else {
          this.noProcAddListCount = false;
          const time = result.data.map(item => item.formatDate);
          const count = result.data.map(item => item.count);
          const lineData = [
            {data: count, type: 'line', name: this.indexLanguage.clearBarrierWorkOrder},
          ];
          this.procAddListCountOption = indexChart.setLineChartOption(lineData, time);
        }
      }
    });
  }

  /**
   * 告警增量
   */
  private queryAlarmDateStatistics(): void {
    // 固定参数
    const params: string = 'DAY';
    this.$mapService.queryAlarmDateStatistics(params, '').subscribe((result: ResultModel<Array<AlarmStatisticsGroupInfoModel>>) => {
      if (result.code === ResultCodeEnum.success) {
        const data: Array<AlarmStatisticsGroupInfoModel> = result.data || [];
        if (data.length === 0) {
          this.noAlarmDateStatistics = true;
        } else {
          this.noAlarmDateStatistics = false;
          const time = data.map(item => item.groupLevel);
          const count = data.map(item => item.groupNum);
          const lineData = [
            {data: count, type: 'line', name: this.indexLanguage.alarmIncrement},
          ];
          this.alarmDateStatisticsOption = indexChart.setLineChartOption(lineData, time);
        }
      }
    });
  }

  /**
   * 查询告警设施Top10
   */
  private queryScreenDeviceIdsGroup(): void {
    this.$mapService.queryScreenDeviceIdsGroup().subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        if (result.data.length === 0) {
          this.noScreenDeviceIdsGroup = true;
        } else {
          // 告警设施
          const deviceIds = result.data.map(_item => {
            return _item.alarmSource;
          });
          // 根据设备id加设备名称
          this.$mapService.queryDeviceByIds(deviceIds).subscribe((getResult: ResultModel<Array<FacilityDetailInfoModel>>) => {
            const deviceData: Array<FacilityDetailInfoModel> = getResult.data || [];
            if (getResult.code === 0 && deviceData.length > 0) {
              this.noScreenDeviceIdsGroup = false;
              // 告警设施
              const screenDeviceIdsGroupNum = result.data.map(_item => {
                return {
                  value: _item.count,
                  name: this.getAlarmIdFromName(_item.alarmSource, deviceData),
                };
              });
              // 告警名称
              const screenDeviceIdsGroupName = result.data.map(_item => {
                return this.getAlarmIdFromName(_item.alarmSource, deviceData);
              });
              this.screenDeviceIdsGroupOption = indexChart.setHistogramChartOption(screenDeviceIdsGroupNum, screenDeviceIdsGroupName, null, true);
            }
          });

        }
      }
    });
  }

  /**
   * 查询繁忙TOP
   */
  private queryUserUnlockingTopNum(): void {
    this.$mapService.queryUserUnlockingTopNum().subscribe((result: ResultModel<Array<FacilityLogTopNumModel>>) => {
      if (result.code === ResultCodeEnum.success) {
        const data: Array<FacilityLogTopNumModel> = result.data || [];
        if (data.length === 0) {
          this.noUserUnlockingTop = true;
        } else {
          this.noUserUnlockingTop = false;
          const userUnlockingTopNum = data.map(_item => {
            return {
              value: _item.countValue,
              name: _item.deviceName,
            };
          });
          const userUnlockingTopName = data.map(item => item.deviceName);
          this.userUnlockingTopOption = indexChart.setHistogramChartOption(userUnlockingTopNum, userUnlockingTopName);
        }
      }
    });
  }

  /**
   * 首页根据设施id和缓存data查询设施名称
   */
  private getAlarmIdFromName(id: string, data: any): string {
    let alarmName = '';
    data.filter(item => {
      if (item.deviceId === id) {
        alarmName = item.deviceName;
      }
    });
    return alarmName;
  }

  /**
   * 设备在线率统计图
   */
  queryEquipmentOnlineRate() {
    const body = {
      'filterConditions': this.equipmentFilterConditions
    };
    this.$mapService.equipmentOnlineRateStatistics(body).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        if (result.data.total === 0) {
          this.noEquipmentOnlineRate = true;
        } else {
          this.noEquipmentOnlineRate = false;
          const newlineData = [
            {value: result.data.onLineNum, name:  this.indexLanguage.card.online, itemStyle: {color: '#5ed8a9'}},
            {value: result.data.otherLineNum, name: this.indexLanguage.card.other, itemStyle: {color: '#898989'}},
          ];
          const newTime = this.indexLanguage.card.equipmentOnlineRate;
          this.equipmentOnlineRateNum = result.data.total;
          this.equipmentOnlineRateOption = indexChart.setNewBarChartOption(newlineData, newTime);
        }
      }
    });
  }

  /**
   * 故障类型统计图
   */
  queryFaultType() {
    const body = {
      'filterConditions': this.equipmentFilterConditions
    };
    this.$mapService.troubleTypeStatistics(body).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        if (result.data.total === 0) {
          this.noFaultType = true;
        } else {
          this.noFaultType = false;
          const newlineData = [];
          result.data.troubleTypeList.forEach(item => {
            newlineData.push({value: item.count, name: TroubleUtil.translateTroubleType(this.$nzI18n, item.typeCode)});
          });
          const newTime = this.indexLanguage.card.faultType;
          this.faultTypeNum = result.data.total;
          this.faultTypeOption = indexChart.setNewBarChartOption(newlineData, newTime);
        }
        if (this.selectEquipmentData) {
          this.selectEquipment = this.selectEquipmentData;
        } else {
          this.selectEquipment = this.equipmentType[0].code;
        }
        this.$adjustCoordinatesService.eventEmit.emit({
          faultTypeOption: this.faultTypeOption,
          selectEquipment: this.selectEquipment,
          faultTypeNum: this.faultTypeNum,
        });
        this.noFaultTypeEmitter.emit(this.noFaultType);
      }
    });
  }

  /**
   * 设备总能耗统计图
   */
  queryEquipmentEnergyConsumption() {
    /**const body = {
      'filterConditions': this.equipmentFilterConditions
    };
    this.$mapService.equipmentTotalEnergyConsumptionStatistics(body).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
      }
    });
     const newlineData = [10, 20, 30, 20, 10, 43];
     const newTime = ['1月', '2月', '3月', '4月', '5月', '6月'];
     this.equipmentEnergyConsumptionOption = indexChart.setHistogramChartOption(newlineData, newTime);
     */
    this.$mapService.equipmentTotalEnergyStatistics(this.selectEquipment).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success && !lodash.isEmpty(result.data)) {
        const newlineData = [];
        const newTime = [];
        result.data.forEach(item => {
          newlineData.push(item.energyConsumption);
          // newTime.push(`${item.monthAxis}${this.indexLanguage.month}`);
          newTime.push(`${CommonUtil.codeTranslate(MonthEnum, this.$nzI18n, Number(item.monthAxis), LanguageEnum.common)}`);
        });
        this.equipmentEnergyConsumptionOption = indexChart.setEfficiencyChartOption(newlineData, newTime, null, true);
      } else {
        this.equipmentEnergyConsumptionOption = null;
      }
      this.$adjustCoordinatesService.eventEmit.emit({
        equipmentEnergyConsumptionOption: this.equipmentEnergyConsumptionOption
      });
    });
  }

  /**
   * 设备传输有效率统计图
   */
  queryEquipmentTransmissionEfficiency() {
    // month: "2020-10"
    // transferRate: 0
    const body = {
      filterConditions: this.equipmentFilterConditions
    };
    this.$mapService.equipmentTransmissionEfficiencyStatistics(body).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        const newlineData = [];
        const newTime = [];
        result.data.forEach(item => {
          newlineData.push(item.transferRate);
          // 修改按月份显示时中文：1月，英文：Jan，以此类推
          newTime.push(`${CommonUtil.codeTranslate(MonthEnum, this.$nzI18n, Number(item.month.replace(/^0/, '')), LanguageEnum.common)}`);
        });
        this.equipmentTransmissionEfficiencyOption = indexChart.setEfficiencyChartOption(newlineData, newTime);
        this.$adjustCoordinatesService.eventEmit.emit({
          equipmentTransmissionEfficiencyOption: this.equipmentTransmissionEfficiencyOption
        });
      }
    });
  }

  /**
   * 故障率分析统计图
   */
  queryFailureRateAnalysis() {
    const body = {
      'filterConditions': this.equipmentFilterConditions
    };
    this.$mapService.troubleRateStatistics(body).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        if (result.data.length === 0) {
          this.noFailureRateAnalysis = true;
        } else {
          this.noFailureRateAnalysis = false;
          const newTime = [];
          const lineData = [];
          result.data[0].troubleRateList.forEach(item => {
            // 修改按月份显示时中文：1月，英文：Jan，以此类推
            newTime.push(`${CommonUtil.codeTranslate(MonthEnum, this.$nzI18n, Number(item.month.replace(/^0/, '')), LanguageEnum.common)}`);
          });
          result.data.forEach((item, index) => {
            lineData.push(
              {
                name: `${item.equipmentModel} : `,
                type: 'line',
                stack: '',
                data: [],
              }
            );
            item.troubleRateList.forEach(_item => {
              lineData[index].data.push(_item.rate.replace(/\+/, ''));
            });
          });
          this.failureRateAnalysisOption = indexChart.setNewLineChartOption(lineData, newTime);
          this.$adjustCoordinatesService.eventEmit.emit({
            failureRateAnalysisOption: this.failureRateAnalysisOption
          });
          this.noFailureRateAnalysisEmitter.emit(this.noFailureRateAnalysis);
        }
      }
    });
  }

  /**
   * 规划数据统计图
   */
  queryPlanning() {
    const planObj = {
      running: this.indexLanguage.underConstruction,
      end: this.indexLanguage.hasBeenBuilt,
      runnable: this.indexLanguage.toBeBuilt,
    };
    if (!SessionUtil.checkHasProjectPlanningTypes('P001')) {
      // 如果无规划集权限
      this.planningOption = indexChart.setHistogramChartOption([], []);
      return;
    }
    this.$mapService.planStatistics({}).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        const newlineData = [];
        const newTime = [];
        result.data.forEach(item => {
          newlineData.push(item.count);
          newTime.push(planObj[item.statusCode]);
        });
        if (JSON.parse(localStorage.getItem('localLanguage')) === 'EN') {
          // 如果是英文环境 统计图横坐标倾斜
          this.planningOption = indexChart.setHistogramChartOption(newlineData, newTime, [ '#cccccc', '#8ec9f7', '#90e15b'], true);
        } else {
          this.planningOption = indexChart.setHistogramChartOption(newlineData, newTime, [ '#cccccc', '#8ec9f7', '#90e15b']);
        }
      }
    });
  }

  /**
   * 项目数据统计图
   */
  queryProject() {
    const planObj = {
      running: this.indexLanguage.underConstruction,
      end: this.indexLanguage.hasBeenBuilt,
      runnable: this.indexLanguage.toBeBuilt,
    };
    if (!SessionUtil.checkHasProjectPlanningTypes('P002')) {
      // 无项目集权限
      this.projectOption = indexChart.setHistogramChartOption([], []);
      return;
    }
    this.$mapService.projectStatistics({}).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        result.data.forEach((_item, index) => {
          if (_item.statusCode === 'running') {
            _item.num = 2;
          } else if (_item.statusCode === 'end') {
            _item.num = 3;
          } else if (_item.statusCode === 'runnable') {
            _item.num = 1;
          }
        });
        result.data = result.data.sort((a, b) => {
          return a.num - b.num;
        });
        const newlineData = [];
        const newTime = [];
        result.data.forEach(item => {
          newlineData.push(item.count);
          newTime.push(planObj[item.statusCode]);
        });
        if (JSON.parse(localStorage.getItem('localLanguage')) === 'EN') {
          // 如果是英文环境 统计图横坐标倾斜
          this.projectOption = indexChart.setHistogramChartOption(newlineData, newTime, [ '#cccccc', '#8ec9f7', '#90e15b'], true);
        } else {
          this.projectOption = indexChart.setHistogramChartOption(newlineData, newTime, [ '#cccccc', '#8ec9f7', '#90e15b']);
        }
      }
    });
  }

  /**
   * 工单类型统计图
   */
  queryWorkOrder() {
    const workOrderObj = {
      assigned: this.indexLanguage.assigned,
      pending: this.indexLanguage.pending,
      processing: this.indexLanguage.processing,
      completed: this.indexLanguage.completed,
      singleBack: this.indexLanguage.singleBack,
      turnProcess: this.indexLanguage.turnProcess,
    };
    const body = {
      'filterConditions': this.workOrderFilterConditions
    };
    this.$mapService.workOrderStatistics(body).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        result.data.forEach((_item, index) => {
          if (_item.statusCode === 'assigned') {
            _item.num = 1;
          } else if (_item.statusCode === 'pending') {
            _item.num = 2;
          } else if (_item.statusCode === 'processing') {
            _item.num = 3;
          } else if (_item.statusCode === 'turnProcess') {
            _item.num = 4;
          } else if (_item.statusCode === 'singleBack') {
            _item.num = 5;
          } else if (_item.statusCode === 'completed') {
            _item.num = 6;
          }
        });
        result.data = result.data.sort((a, b) => {
          return a.num - b.num;
        });
        const newlineData = [];
        const newTime = [];
        result.data.forEach(item => {
          newlineData.push(item.count);
          newTime.push(workOrderObj[item.statusCode]);
        });
        // 如果是英文状态则需要横坐标倾斜展示
        const tilt = localStorage.getItem('localLanguage') && JSON.parse(localStorage.getItem('localLanguage')) === 'EN';
        this.workOrderOption = indexChart.setHistogramChartOption(newlineData, newTime,
          ['#29d9a5', '#8de056', '#ffc63d', '#1296db', '#e70f05', '#3279f0'], tilt);
      }
    });
  }

  /**
   * 设备变化change
   */
  equipmentChange(evt) {
    this.equipmentFilterConditions = [
      {
        filterField: 'equipmentType',
        operator: 'eq',
        filterValue: evt
      }
    ];
    this.showRefresh();
    this.selectEquipmentEmitter.emit(evt);
  }

  /**
   * 工单变化change
   */
  workOrderChange(evt) {
    this.workOrderFilterConditions = [
      {
        filterField: 'orderType',
        operator: 'eq',
        filterValue: evt
      }
    ];
    this.selectOrderType = evt;
    this.initCountChart();
  }

  /**
   * 跳转至
   */
  moreFailure() {
    this.$router.navigate([`/business/facility/asset-analysis`], {queryParams: {tabIndex: '2'}}).then();
  }
}
