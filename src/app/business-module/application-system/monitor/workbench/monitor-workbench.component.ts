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
  // 环境监测仪数量 智慧杆数量
  public equipmentCountList: EquipmentCountListModel = new EquipmentCountListModel({});
  /** 便捷入口数据 */
  public convenientData: PolicyControlModel = new PolicyControlModel({});
  // 分页
  public page = { Total: 1, pageIndex: 1, pageSize: 6, totalPage: 0 };
  /** 开关绑定值*/
  public radioValue: boolean;
  // 策略列表数据
  public listData: PolicyControlModel[] = [];
  // 便捷入口的禁用启用loading
  public isEnableStrategy: boolean = false;
  // 控制便捷入口的显隐
  public isConvenient: boolean = true;
  public monitorWorkBenchEnum = MonitorWorkBenchEnum;
  /** 快捷入口的数据 */
  public MonitorConvenientEntranceList: MonitorConvenientEntranceModel = new MonitorConvenientEntranceModel(
    {},
  );
  /** 便捷入口 加载状态 */
  convenientLoading: boolean = false;
  // 列表请求参数
  private queryCondition: QueryConditionModel = new QueryConditionModel();

  /** 传递给 monitor-point 组件的 设备 id */
  pointEquipmentId: string;
  // Echarts 设备状态统计
  public equipmentStatusData: object;
  // Echarts 告警分类
  public alarmClassification: object;
  // 是否展示告警分类数量统计图表
  public isShowAlarmClassification: boolean = false;

  /**
   * 工作台权限码
   */
  public informationWorkBenchEnum = InformationWorkBenchEnum;
  /**
   * 告警分类时间
   */
  public alarmClassificationTime = {
    startAndEndTime: [CommonUtil.funDate(-365), CommonUtil.getCurrentTime()],
  };
  // 是否展示设备状态图表
  public isShowEquipmentStatus: boolean = false;
  // 工单增量
  isWorkOrder: boolean = false;
  // 默认选中工单增量的筛选条件
  public workOrderQueryType: number = 3;
  // 工单增量 选择的最近一年 30天 7天
  public workOrderList;

  // 工单增量统计
  public workOrderData: object;
  /**
   * 工单增量时间
   */
  public workOrderIncrementTime = {
    startAndEndTime: [CommonUtil.funDate(-365), CommonUtil.getCurrentTime()],
  };

  // 操作按钮枚举
  public OperationButtonEnum = OperationButtonEnum;

  // 表格多语言
  public onlineLanguage: OnlineLanguageInterface;
  // 国际化
  public language: ApplicationInterface;
  constructor(
    private $router: Router,
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    // 接口服务
    private $applicationService: ApplicationService,
    // 设施服务
    private $facilityService: FacilityService,
    private $facilityForCommonService: FacilityForCommonService,
  ) {}

  public ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.onlineLanguage = this.$nzI18n.getLocaleData(LanguageEnum.online);
    // 工单默认查询条件
    this.workOrderList = SelectDataConfig.workOrderData(this.language);
    // 环境监测仪数量
    this.getMonitorCount();
    // 智慧杆数量
    this.queryDeviceFunctionPole();
    this.initWorkbenchList();
    // 统计 Echarts 初始化
    this.initEcharts();
  }

  /** 环境监测仪数量 */
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

  /** 智慧杆数量 */
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
   * 策略列表
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

  /** 统计 Echarts 初始化 */
  initEcharts() {
    // 设备状态统计
    this.queryEquipmentStatus();

    // 告警分类数量统计
    this.statisticsAlarmLevelType();

    // 工单增量统计
    this.findApplyStatisticsByCondition(this.workOrderQueryType);
  }

  /**
   * @param type 类型 left：分页页码减一 right:分页页码加一   * 分页切换
   */
  public onPagingChange(type: string): void {
    if (type === 'left') {
      // 当分页页码是第一页和最后一页时  则直接return
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
   * 展示便捷入口
   * @param index 被选中的数据下标
   * @param event 鼠标事件
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
    // 先将所有的置为不选中的状态
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
  // 全部策略
  onGoStrategyList() {
    this.$router.navigate(['business/application/monitor/equipment-list'], {}).then();
  }

  // 跳转策略详情
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
  // 刷新按钮
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

  /** 设备状态统计 Ecahrts */
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

  /** 告警分类数量统计 Echarts */
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
        // 此处属于特殊地方 仅这一接口返回为number0
        if (result.code === 0) {
          this.isShowAlarmClassification = !!result.data;
          this.alarmClassification = ChartsConfig.alarmStatistics(result.data, this.$nzI18n);
        } else {
          this.$message.error(result.msg);
        }
      });
  }
  /**
   * 跳转告警页面
   */
  public goToAlarm(): void {
    this.$router
      .navigate([`business/alarm/current-alarm`], {
        queryParams: { alarmSourceTypeId: EquipmentTypeEnum.weatherInstrument },
      })
      .then();
  }

  /**
   * 工单增量按最近一年/30天/7天
   *
   */
  public handleChangeWorkOrder(event): void {
    this.workOrderQueryType = event;
    this.findApplyStatisticsByCondition(event);
  }

  /**
   * 工单增量统计
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
   * 处理统计图但会结果数据
   * @param result 返回的结果
   * @param field 字段
   */
  private processingData(result, field) {
    const statisticsData = _.cloneDeep(result.data || []);
    const returnData: StatisticalChartModel = {
      xData: [],
      data: [],
      isShow: false,
      company: '',
    };
    // 判断数据是否为空 数据为空则为false
    returnData.isShow = statisticsData.length !== 0;
    statisticsData.forEach((listItem) => {
      returnData.xData.push(listItem.time);
      returnData.data.push(listItem[field]);
    });
    return returnData;
  }

  /**
   * 转换时间戳
   * @param time 时间
   * @param type start:开始时间 end:结束时间
   */
  public changeTime(time, type: string) {
    const timeString = CommonUtil.dateFmt('yyyy/MM/dd', new Date(time));
    const date = new Date(
      type === TimeTypeEnum.start ? `${timeString} 00:00:00` : `${timeString} 23:59:59`,
    );
    return typeof date === 'string' ? Date.parse(date) : CommonUtil.getTimeStamp(date);
  }
}
