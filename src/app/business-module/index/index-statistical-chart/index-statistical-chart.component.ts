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

  // ??????
  @Input() title: string;
  // ??????
  @Input() type: number;
  // ??????????????????
  @Input() isShowTitle: boolean;
  // ????????????select?????????
  @Input() isShowSelect: boolean;
  // ???????????????
  @Input() isOneType: any;
  // ????????????
  @Input() data: any[];
  // ?????????????????????????????????
  @Input() noFaultType: boolean = true;
  // ????????????????????????????????????
  @Input() noFailureRateAnalysis: boolean = true;
  // ????????????????????????
  @Input() selectEquipmentData;
  // ?????????????????????
  @Output() noFaultTypeEmitter = new EventEmitter();
  // ????????????????????????
  @Output() noFailureRateAnalysisEmitter = new EventEmitter();
  // ????????????????????????
  @Output() selectEquipmentEmitter = new EventEmitter();
  // ?????????
  public indexLanguage: IndexLanguageInterface;
  // ????????????
  public cardType = INDEX_CARD_TYPE;
  // ????????????????????????
  public statisticsCount: QueryFacilityCountModel[] = [];
  // ??????????????????
  public statisticsNumber = [0, 0, 0, 0, 0, 0];
  // ?????????????????????????????????
  public deviceStatusChartOption: any = {};
  // ????????????
  public noDeviceStatusChart = true;
  // ?????????????????????
  public procAddListCountOption: any = {};
  // ????????????????????????
  public noProcAddListCount = true;
  // ????????????TOP?????????
  public userUnlockingTopOption: any = {};
  // ????????????????????????TOP???
  public noUserUnlockingTop = true;
  // ????????????Top10?????????
  public screenDeviceIdsGroupOption: any = {};
  // ?????????????????????
  public equipmentOnlineRateOption: any = {};
  // ?????????????????????????????????
  public noEquipmentOnlineRate: boolean = true;
  // ???????????????????????????
  public equipmentOnlineRateNum: any;
  // ?????????????????????
  public faultTypeOption: any = {};
  // ???????????????????????????
  public faultTypeNum: any;
  // ????????????????????????
  public equipmentEnergyConsumptionOption: any = {};
  // ??????????????????????????????
  public equipmentTransmissionEfficiencyOption: any = {};
  // ????????????????????????
  public failureRateAnalysisOption: any = {};
  // ???????????????
  public planningOption: any = {};
  // ?????????????????????
  public workOrderOption: any = {};
  // ???????????????
  public projectOption: any = {};
  // ????????????????????????Top10???
  public noScreenDeviceIdsGroup = true;
  // ????????????ceshi???
  public noScreenCeShi = true;
  // ????????????????????????????????????
  public alarmCurrentLevelGroupOption: any = {};
  // ???????????????????????????????????????
  public noAlarmCurrentLevelGroup = true;
  // ?????????????????????
  public alarmDateStatisticsOption: any = {};
  // ????????????????????????
  public noAlarmDateStatistics = true;
  // ???????????????
  public deviceRole: string[] = [];
  // ????????????/???????????????????????????
  public deviceCount: boolean = false;
  // ????????????
  public deviceStatus: boolean = false;
  // ??????????????????
  public alarmCount: boolean = false;
  // ????????????
  public alarmIncrement: boolean = false;
  // ????????????
  public workIncrement: boolean = false;
  // ????????????TOP/????????????TOP
  public topRole: boolean = false;
  // ?????????????????????
  public equipmentType;
  // ???????????????????????????
  public equipmentFilterConditions;
  // ???????????????????????????
  public workOrderFilterConditions;
  // ???????????????
  public commonUtil;
  // ??????????????????
  public equipmentTypeEnum;
  // ???????????????
  public languageEnum;
  // ???????????????
  private destroy$ = new Subject<void>();
  // ????????????????????????
  public selectEquipment;
  // ????????????
  public procTypeList: SelectModel[] = [];
  // ??????????????????
  public selectOrderType: string;

  // ??????????????????
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
    // ???????????????
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
    // ????????????????????????
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
    // ??????????????????
    this.initCountChart();
  }

  /**
   * ????????????
   */
  queryDeviceRole() {
    const userInfo = SessionUtil.getUserInfo();
    this.deviceRole = userInfo.role.roleDeviceTypeDto.deviceTypes;
  }

  /**
   * ??????????????????
   */
  private initCountChart(): void {
    switch (this.type) {
      // ????????????
      case this.cardType.deviceCount:
        this.queryDeviceTypeALLCount();
        break;
      // ????????????
      case this.cardType.typeCount:
        this.queryDeviceTypeCount();
        break;
      // ????????????
      case this.cardType.deviceStatus:
        this.queryUserDeviceStatusCount();
        break;
      // ??????????????????
      case this.cardType.alarmCount:
        this.queryAlarmCurrentLevelGroup();
        break;
      // ????????????
      case this.cardType.alarmIncrement:
        this.queryAlarmDateStatistics();
        break;
      // ????????????
      case this.cardType.workIncrement:
        this.queryHomeProcAddListCountGroupByDay();
        break;
      // ????????????TOP
      case this.cardType.busyTop:
        this.queryUserUnlockingTopNum();
        break;
      // ????????????TOP
      case this.cardType.alarmTop:
        this.queryScreenDeviceIdsGroup();
        break;
      // ????????????????????????
      case this.cardType.equipmentOnlineRate:
        this.queryEquipmentOnlineRate();
        break;
      // ?????????????????????
      case this.cardType.faultType:
        this.queryFaultType();
        break;
      // ??????????????????
      case this.cardType.planning:
        this.queryPlanning();
        break;
      // ??????????????????
      case this.cardType.project:
        this.queryProject();
        break;
      // ??????????????????
      case this.cardType.workOrder:
        if (this.procTypeList && this.procTypeList.length) {
          this.queryWorkOrder();
        }
        break;
      // ?????????????????????
      case this.cardType.equipmentEnergyConsumption:
        this.queryEquipmentEnergyConsumption();
        break;
      // ???????????????????????????
      case this.cardType.equipmentTransmissionEfficiency:
        this.queryEquipmentTransmissionEfficiency();
        break;
      // ????????????????????????
      case this.cardType.failureRateAnalysis:
        this.queryFailureRateAnalysis();
        break;
    }
  }

  /**
   * ??????????????????
   */
  private queryDeviceTypeALLCount(): void {
    this.$facilityService.queryDeviceTypeCount().subscribe((result: ResultModel<Array<DeviceTypeCountModel>>) => {
      if (result.code === ResultCodeEnum.success) {
        const data: Array<DeviceTypeCountModel> = [];
        // ???????????????????????????
        result.data.forEach(item => {
          const role = this.deviceRole.indexOf(item.deviceType);
          if (role !== -1) {
            data.push(item);
          }
        });
        // ????????????
        let sum = 0;
        data.forEach(item => {
          sum += item.deviceNum;
        });
        // ??????
        const count = (Array('000000').join('0') + sum).slice(-6);
        this.statisticsNumber = [];
        // ??????????????????
        this.statisticsNumber = (count + '').split('').map(Number);
      }
    });
  }

  /**
   * ??????????????????
   */
  private queryDeviceTypeCount(): void {
    this.$facilityService.queryDeviceTypeCount().subscribe((result: ResultModel<Array<DeviceTypeCountModel>>) => {
      if (result.code === ResultCodeEnum.success) {
        const data: Array<DeviceTypeCountModel> = result.data || [];
        // ????????????????????????
        const deviceTypes = FacilityForCommonUtil.translateDeviceType(this.$nzI18n) as QueryFacilityCountModel[];
        // ???????????????????????????
        const deviceList: QueryFacilityCountModel[] = [];
        deviceTypes.forEach(item => {
          const role = this.deviceRole.indexOf(item.code);
          if (role !== -1) {
            deviceList.push(item);
          }
        });
        // ??????????????????
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
        // ????????????????????????
        this.statisticsCount = deviceList;
      }
    });
  }

  /**
   * ???????????????????????????
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
   * ????????????????????????
   */
  private queryAlarmCurrentLevelGroup(): void {
    this.$mapService.queryAlarmCurrentLevelGroup().subscribe((result: ResultModel<Array<AlarmLevelStatisticsModel>>) => {
      if (result.code === ResultCodeEnum.success) {
        if (result.data.length === 0) {
          this.noAlarmCurrentLevelGroup = true;
        } else {
          const data: Array<AlarmLevelStatisticsModel> = result.data || [];
          // ???????????????????????????
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
          // ???????????????????????????
          if (sum > 0) {
            this.noAlarmCurrentLevelGroup = false;
          }
          this.alarmCurrentLevelGroupOption = indexChart.setBarChartOption(alarmCount, this.indexLanguage.currentAlarmNum);
        }
      }
    });
  }

  /**
   * ????????????
   */
  private queryHomeProcAddListCountGroupByDay(): void {
    // ????????????
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
   * ????????????
   */
  private queryAlarmDateStatistics(): void {
    // ????????????
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
   * ??????????????????Top10
   */
  private queryScreenDeviceIdsGroup(): void {
    this.$mapService.queryScreenDeviceIdsGroup().subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        if (result.data.length === 0) {
          this.noScreenDeviceIdsGroup = true;
        } else {
          // ????????????
          const deviceIds = result.data.map(_item => {
            return _item.alarmSource;
          });
          // ????????????id???????????????
          this.$mapService.queryDeviceByIds(deviceIds).subscribe((getResult: ResultModel<Array<FacilityDetailInfoModel>>) => {
            const deviceData: Array<FacilityDetailInfoModel> = getResult.data || [];
            if (getResult.code === 0 && deviceData.length > 0) {
              this.noScreenDeviceIdsGroup = false;
              // ????????????
              const screenDeviceIdsGroupNum = result.data.map(_item => {
                return {
                  value: _item.count,
                  name: this.getAlarmIdFromName(_item.alarmSource, deviceData),
                };
              });
              // ????????????
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
   * ????????????TOP
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
   * ??????????????????id?????????data??????????????????
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
   * ????????????????????????
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
   * ?????????????????????
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
   * ????????????????????????
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
     const newTime = ['1???', '2???', '3???', '4???', '5???', '6???'];
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
   * ??????????????????????????????
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
          // ?????????????????????????????????1???????????????Jan???????????????
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
   * ????????????????????????
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
            // ?????????????????????????????????1???????????????Jan???????????????
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
   * ?????????????????????
   */
  queryPlanning() {
    const planObj = {
      running: this.indexLanguage.underConstruction,
      end: this.indexLanguage.hasBeenBuilt,
      runnable: this.indexLanguage.toBeBuilt,
    };
    if (!SessionUtil.checkHasProjectPlanningTypes('P001')) {
      // ????????????????????????
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
          // ????????????????????? ????????????????????????
          this.planningOption = indexChart.setHistogramChartOption(newlineData, newTime, [ '#cccccc', '#8ec9f7', '#90e15b'], true);
        } else {
          this.planningOption = indexChart.setHistogramChartOption(newlineData, newTime, [ '#cccccc', '#8ec9f7', '#90e15b']);
        }
      }
    });
  }

  /**
   * ?????????????????????
   */
  queryProject() {
    const planObj = {
      running: this.indexLanguage.underConstruction,
      end: this.indexLanguage.hasBeenBuilt,
      runnable: this.indexLanguage.toBeBuilt,
    };
    if (!SessionUtil.checkHasProjectPlanningTypes('P002')) {
      // ??????????????????
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
          // ????????????????????? ????????????????????????
          this.projectOption = indexChart.setHistogramChartOption(newlineData, newTime, [ '#cccccc', '#8ec9f7', '#90e15b'], true);
        } else {
          this.projectOption = indexChart.setHistogramChartOption(newlineData, newTime, [ '#cccccc', '#8ec9f7', '#90e15b']);
        }
      }
    });
  }

  /**
   * ?????????????????????
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
        // ???????????????????????????????????????????????????
        const tilt = localStorage.getItem('localLanguage') && JSON.parse(localStorage.getItem('localLanguage')) === 'EN';
        this.workOrderOption = indexChart.setHistogramChartOption(newlineData, newTime,
          ['#29d9a5', '#8de056', '#ffc63d', '#1296db', '#e70f05', '#3279f0'], tilt);
      }
    });
  }

  /**
   * ????????????change
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
   * ????????????change
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
   * ?????????
   */
  moreFailure() {
    this.$router.navigate([`/business/facility/asset-analysis`], {queryParams: {tabIndex: '2'}}).then();
  }
}
