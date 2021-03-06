import { Component, OnInit } from '@angular/core';
import { ApplicationInterface } from '../../../../../assets/i18n/application/application.interface';
import { LanguageEnum } from '../../../../shared-module/enum/language.enum';
import { Router } from '@angular/router';
import { NzI18nService } from 'ng-zorro-antd';
import * as _ from 'lodash';
import { FiLinkModalService } from '../../../../shared-module/service/filink-modal/filink-modal.service';
import { MonitorWorkBenchEnum } from '../../share/enum/auth.code.enum';
import {
  EquipmentCountListModel,
  PolicyControlModel,
  MonitorConvenientEntranceModel,
} from '../../share/model/monitor.model';
import { OperationButtonEnum, PageOperationEnum } from '../../share/enum/operation-button.enum';
import { SelectDataConfig } from '../../share/config/select.data.config';
import { ChartsConfig } from '../../share/config/charts-config';
import { ApplicationService } from '../../share/service/application.service';
import {
  FilterCondition,
  QueryConditionModel,
} from '../../../../shared-module/model/query-condition.model';
import { CommonUtil } from '../../../../shared-module/util/common-util';
import { ResultModel } from '../../../../shared-module/model/result.model';
import { ResultCodeEnum } from '../../../../shared-module/enum/result-code.enum';
import { OperatorEnum } from '../../../../shared-module/enum/operator.enum';
import { PolicyEnum, TargetTypeEnum } from '../../share/enum/policy.enum';
import { EquipmentTypeEnum } from '../../../../core-module/enum/equipment/equipment.enum';
import { InformationWorkBenchEnum } from '../../share/enum/auth.code.enum';
import { TimeTypeEnum } from '../../share/enum/program.enum';
import { OnlineLanguageInterface } from '../../../../../assets/i18n/online/online-language.interface';
import { EquipmentApiService } from '../../../facility/share/service/equipment/equipment-api.service';
import { FacilityService } from '../../../../core-module/api-service/facility/facility-manage';
import { DeviceTypeEnum } from '../../../../core-module/enum/facility/facility.enum';
import { FacilityForCommonService } from '../../../../core-module/api-service/facility';
import { StatisticalChartModel } from '../../share/model/lighting.model';

@Component({
  selector: 'app-monitor-workbench',
  templateUrl: './monitor-workbench.component.html',
  styleUrls: ['./monitor-workbench.component.scss'],
})
export class MonitorWorkbenchComponent implements OnInit {
  // ????????????????????? ???????????????
  public equipmentCountList: EquipmentCountListModel = new EquipmentCountListModel({});
  /** ?????????????????? */
  public convenientData: PolicyControlModel = new PolicyControlModel({});
  // ??????
  public page = { Total: 1, pageIndex: 1, pageSize: 6, totalPage: 0 };
  /** ???????????????*/
  public radioValue: boolean;
  // ??????????????????
  public listData: PolicyControlModel[] = [];
  // ???????????????????????????loading
  public isEnableStrategy: boolean = false;
  // ???????????????????????????
  public isConvenient: boolean = true;
  public monitorWorkBenchEnum = MonitorWorkBenchEnum;
  /** ????????????????????? */
  public MonitorConvenientEntranceList: MonitorConvenientEntranceModel = new MonitorConvenientEntranceModel(
    {},
  );
  /** ???????????? ???????????? */
  convenientLoading: boolean = false;
  // ??????????????????
  private queryCondition: QueryConditionModel = new QueryConditionModel();

  /** ????????? monitor-point ????????? ?????? id */
  pointEquipmentId: string;
  // Echarts ??????????????????
  public equipmentStatusData: object;
  // Echarts ????????????
  public alarmClassification: object;
  // ??????????????????????????????????????????
  public isShowAlarmClassification: boolean = false;

  /**
   * ??????????????????
   */
  public informationWorkBenchEnum = InformationWorkBenchEnum;
  /**
   * ??????????????????
   */
  public alarmClassificationTime = {
    startAndEndTime: [CommonUtil.funDate(-365), CommonUtil.getCurrentTime()],
  };
  // ??????????????????????????????
  public isShowEquipmentStatus: boolean = false;
  // ????????????
  isWorkOrder: boolean = false;
  // ???????????????????????????????????????
  public workOrderQueryType: number = 3;
  // ???????????? ????????????????????? 30??? 7???
  public workOrderList;

  // ??????????????????
  public workOrderData: object;
  /**
   * ??????????????????
   */
  public workOrderIncrementTime = {
    startAndEndTime: [CommonUtil.funDate(-365), CommonUtil.getCurrentTime()],
  };

  // ??????????????????
  public OperationButtonEnum = OperationButtonEnum;

  // ???????????????
  public onlineLanguage: OnlineLanguageInterface;
  // ?????????
  public language: ApplicationInterface;
  constructor(
    private $router: Router,
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    // ????????????
    private $applicationService: ApplicationService,
    // ????????????
    private $facilityService: FacilityService,
    private $facilityForCommonService: FacilityForCommonService,
  ) {}

  public ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.onlineLanguage = this.$nzI18n.getLocaleData(LanguageEnum.online);
    // ????????????????????????
    this.workOrderList = SelectDataConfig.workOrderData(this.language);
    // ?????????????????????
    this.getMonitorCount();
    // ???????????????
    this.queryDeviceFunctionPole();
    this.initWorkbenchList();
    // ?????? Echarts ?????????
    this.initEcharts();
  }

  /** ????????????????????? */
  public getMonitorCount(): void {
    this.$facilityForCommonService.equipmentCount().subscribe((result: ResultModel<any[]>) => {
      if (result.code === ResultCodeEnum.success) {
        result.data.forEach((item) => {
          if (item.equipmentType === EquipmentTypeEnum.weatherInstrument) {
            this.equipmentCountList.numberMonitors = item.equipmentNum;
          }
        });
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /** ??????????????? */
  public queryDeviceFunctionPole(): void {
    this.$facilityService.queryDeviceTypeCount().subscribe((result: ResultModel<any[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.equipmentCountList.wisdomPoles = result.data.find(
          (item) => item.deviceType === DeviceTypeEnum.wisdom,
        ).deviceNum;
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * ????????????
   */
  public initWorkbenchList(): void {
    this.queryCondition.pageCondition.pageSize = PageOperationEnum.pageSize;
    const strategyType = new FilterCondition(PolicyEnum.equipmentType, OperatorEnum.in, [
      EquipmentTypeEnum.weatherInstrument,
    ]);
    this.queryCondition.filterConditions = this.queryCondition.filterConditions.concat([
      strategyType,
    ]);
    this.$applicationService
      .monitorQueryListData_API(this.queryCondition)
      .subscribe((result: ResultModel<any[]>) => {
        if (result.code === ResultCodeEnum.success) {
          const { totalCount, pageNum, data, size, totalPage } = result;
          console.log(result, 'result');
          this.listData = data;
          this.page.Total = totalCount;
          this.page.totalPage = totalPage;
          this.page.pageIndex = pageNum;
          this.page.pageSize = size;
          if (this.listData.length) {
            this.listData.forEach((item) => {
              const getDeviceType = item.deviceType;
              item['iconClass'] = CommonUtil.getFacilityIconClassName(getDeviceType);
            });
          }
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /** ?????? Echarts ????????? */
  initEcharts() {
    // ??????????????????
    this.queryEquipmentStatus();

    // ????????????????????????
    this.statisticsAlarmLevelType();

    // ??????????????????
    this.findApplyStatisticsByCondition(this.workOrderQueryType);
  }

  /**
   * @param type ?????? left????????????????????? right:??????????????????   * ????????????
   */
  public onPagingChange(type: string): void {
    if (type === 'left') {
      // ?????????????????????????????????????????????  ?????????return
      if (this.page.pageIndex <= 1) {
        return;
      }
      this.queryCondition.pageCondition.pageNum = this.queryCondition.pageCondition.pageNum - 1;
    } else {
      if (this.page.pageIndex >= this.page.totalPage) {
        return;
      }
      this.queryCondition.pageCondition.pageNum = this.queryCondition.pageCondition.pageNum + 1;
    }
    this.initWorkbenchList();
  }
  /**
   * ??????????????????
   * @param index ????????????????????????
   * @param event ????????????
   */
  public handShowConvenient(event: MouseEvent, item: PolicyControlModel, index: number): void {
    if (event) {
      event.stopPropagation();
    }
    this.convenientData = item;
    if (this.listData[index].state) {
      this.listData[index].state = false;
      this.isConvenient = false;
      this.pointEquipmentId = null;
      return;
    }
    // ???????????????????????????????????????
    this.listData.forEach((it) => (it.state = false));
    this.isConvenient = true;
    this.listData[index].state = true;
    this.pointEquipmentId = item.equipmentId;

    const params = {
      idList: [item.equipmentId],
    };
    this.$applicationService
      .monitorQueryInfoData_API(params)
      .subscribe((result: ResultModel<any>) => {
        console.log(result, 'result');
        if (result && result.code === ResultCodeEnum.success) {
          if (result.data.length > 0 && result.data[0].performanceData) {
            this.MonitorConvenientEntranceList.initData(JSON.parse(result.data[0].performanceData));
          } else { this.MonitorConvenientEntranceList.initData({}); }
        } else {
          this.$message.error(result.msg);
        }
      });
  }
  // ????????????
  onGoStrategyList() {
    this.$router.navigate(['business/application/monitor/equipment-list'], {}).then();
  }

  // ??????????????????
  public strategyDetails(data): void {
    this.$router
      .navigate([`business/application/monitor/equipment-list/policy-details`], {
        queryParams: {
          equipmentId: data.equipmentId,
          equipmentType: data.equipmentType,
          equipmentModel: data.equipmentModel,
          equipmentStatus: data.equipmentStatus,
        },
      })
      .then();
  }
  // ????????????
  refreshIcon(e: MouseEvent, item: PolicyControlModel, index) {
    e.stopPropagation();
    if (!this.listData[index].state) { return; }
    this.convenientLoading = true;
    this.convenientData = item;
    const params = {
      idList: [item.equipmentId],
    };
    this.pointEquipmentId = null;
    this.$applicationService.monitorQueryInfoData_API(params).subscribe(
      (result: ResultModel<any>) => {
        if (result && result.code === ResultCodeEnum.success) {
          if (result.data.length > 0 && result.data[0].performanceData) {
            this.MonitorConvenientEntranceList.initData(JSON.parse(result.data[0].performanceData));
          } else { this.MonitorConvenientEntranceList.initData({}); }
          this.pointEquipmentId = item.equipmentId;
        } else {
          this.$message.error(result.msg);
        }
        this.convenientLoading = false;
      },
      () => (this.convenientLoading = false),
    );
  }

  /** ?????????????????? Ecahrts */
  public queryEquipmentStatus(): void {
    const parameter = {
      equipmentTypes: [EquipmentTypeEnum.weatherInstrument],
    };
    this.$applicationService
      .queryEquipmentStatus(parameter)
      .subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          if (result.data && result.data.length) {
            this.isShowEquipmentStatus = true;
            this.equipmentStatusData = ChartsConfig.equipmentStatus(result.data, this.$nzI18n);
          } else {
            this.isShowEquipmentStatus = false;
          }
        } else {
          this.isShowEquipmentStatus = false;
          this.$message.error(result.msg);
        }
      });
  }

  /** ???????????????????????? Echarts */
  public statisticsAlarmLevelType(): void {
    const parameter = {
      filterConditions: [
        {
          filterField: 'alarm_begin_time',
          operator: 'gt',
          filterValue: this.changeTime(
            this.alarmClassificationTime.startAndEndTime[0],
            TimeTypeEnum.start,
          ),
        },
        {
          filterField: 'alarm_begin_time',
          operator: 'lt',
          filterValue: this.changeTime(
            this.alarmClassificationTime.startAndEndTime[1],
            TimeTypeEnum.end,
          ),
        },
        {
          filterField: 'alarm_source_type_id',
          operator: 'in',
          filterValue: [EquipmentTypeEnum.weatherInstrument],
        },
      ],
      statisticsType: '1',
    };
    this.$applicationService
      .statisticsAlarmLevelType(parameter)
      .subscribe((result: ResultModel<object>) => {
        // ???????????????????????? ????????????????????????number0
        if (result.code === 0) {
          this.isShowAlarmClassification = !!result.data;
          this.alarmClassification = ChartsConfig.alarmStatistics(result.data, this.$nzI18n);
        } else {
          this.$message.error(result.msg);
        }
      });
  }
  /**
   * ??????????????????
   */
  public goToAlarm(): void {
    this.$router
      .navigate([`business/alarm/current-alarm`], {
        queryParams: { alarmSourceTypeId: EquipmentTypeEnum.weatherInstrument },
      })
      .then();
  }

  /**
   * ???????????????????????????/30???/7???
   *
   */
  public handleChangeWorkOrder(event): void {
    this.workOrderQueryType = event;
    this.findApplyStatisticsByCondition(event);
  }

  /**
   * ??????????????????
   */
  public findApplyStatisticsByCondition(type: number): void {
    const params = {
      statisticalType: type.toString(),
    };
    this.$applicationService
      .monitorWorkInsert_API(params)
      .subscribe((result: ResultModel<any[]>) => {
        if (result.code === ResultCodeEnum.success) {
          if (result.data && result.data.length) {
            this.isWorkOrder = false;
            if (type === 3) {
              result.data.forEach((item) => {
                item.formatDate = `${parseInt(item.formatDate, 10)}${
                  this.language.electricityDate.month
                }`;
              });
            }
            this.workOrderData = ChartsConfig.workOrder(result.data, this.onlineLanguage);
          } else {
            this.isWorkOrder = true;
          }
        } else {
          this.isWorkOrder = true;
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * ?????????????????????????????????
   * @param result ???????????????
   * @param field ??????
   */
  private processingData(result, field) {
    const statisticsData = _.cloneDeep(result.data || []);
    const returnData: StatisticalChartModel = {
      xData: [],
      data: [],
      isShow: false,
      company: '',
    };
    // ???????????????????????? ??????????????????false
    returnData.isShow = statisticsData.length !== 0;
    statisticsData.forEach((listItem) => {
      returnData.xData.push(listItem.time);
      returnData.data.push(listItem[field]);
    });
    return returnData;
  }

  /**
   * ???????????????
   * @param time ??????
   * @param type start:???????????? end:????????????
   */
  public changeTime(time, type: string) {
    const timeString = CommonUtil.dateFmt('yyyy/MM/dd', new Date(time));
    const date = new Date(
      type === TimeTypeEnum.start ? `${timeString} 00:00:00` : `${timeString} 23:59:59`,
    );
    return typeof date === 'string' ? Date.parse(date) : CommonUtil.getTimeStamp(date);
  }
}
