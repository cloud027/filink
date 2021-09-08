import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {ChartsConfig} from '../../share/config/charts-config';
import {ApplicationFinalConst, RouterJumpConst, StrategyListConst} from '../../share/const/application-system.const';
import {ApplicationService} from '../../share/service/application.service';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {EquipmentCountListModel} from '../../share/model/lighting.model';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {ApplicationInterface} from '../../../../../assets/i18n/application/application.interface';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {OnlineLanguageInterface} from '../../../../../assets/i18n/online/online-language.interface';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {ExecTypeEnum, PolicyEnum, StrategyStatusEnum, TargetTypeEnum} from '../../share/enum/policy.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {SelectDataConfig} from '../../share/config/select.data.config';
import {GroupListModel} from '../../share/model/equipment.model';
import {PolicyControlModel, StrategyListModel} from '../../share/model/policy.control.model';
import {SliderValueConst} from '../../share/const/slider.const';
import {LoopModel} from '../../share/model/loop.model';
import {PageModel} from '../../../../shared-module/model/page.model';
import {OperationButtonEnum, PageOperationEnum} from '../../share/enum/operation-button.enum';
import {execType} from '../../share/util/application.util';
import {FacilityForCommonService} from '../../../../core-module/api-service';
import {DeviceTypeCountModel} from '../../../../core-module/model/facility/device-type-count.model';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';
import {listFmt} from '../../share/util/tool.util';
import {FilterValueConst} from '../../share/const/filter.const';
import * as _ from 'lodash';
import {CurrencyEnum} from '../../../../core-module/enum/operator-enable-disable.enum';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {InformationWorkBenchEnum, LightPolicyEnum, LightTableEnum} from '../../share/enum/auth.code.enum';
import {EquipmentStatisticsModel} from '../../../../core-module/model/equipment/equipment-statistics.model';
import {VideoControlEnum} from '../../../../shared-module/enum/video-control.enum';
import {ControlInstructEnum} from '../../../../core-module/enum/instruct/control-instruct.enum';
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {ApplicationSystemForCommonService} from '../../../../core-module/api-service/application-system';
import {WorkOrderIncreaseModel} from '../../../../core-module/model/application-system/work-order-increase.model';
import {getISOWeek} from 'date-fns';
import {DateTypeEnum, ReportAnalysisTypeEnum, StatisticalDimensionEnum} from '../../share/enum/report-analysis.enum';
import {MonthEnum} from '../../../../shared-module/enum/month.enum';
import {TimeTypeEnum} from '../../share/enum/program.enum';

@Component({
  selector: 'app-workbench',
  templateUrl: './workbench.component.html',
  styleUrls: ['./workbench.component.scss']
})

export class WorkbenchComponent implements OnInit {
  // 当前页
  public pageNum: number = PageOperationEnum.pageNum;
  // 总页数
  public totalPage: number = 0;
  // 控制便捷入口的显隐
  public isConvenient: boolean = true;
  // 控制暂无数据的时候展示的页面
  public isAvailable: boolean = false;
  // 控制亮灯率统计图是否显示
  public isLightingRate: boolean = false;
  // 控制工单增量统计图的显示
  public isWorkOrder: boolean = false;
  // 控制用电量统计图的显示
  public isElectricity: boolean = false;
  // 控制设备状态统计图的显示
  public isEquipmentStatus: boolean = false;
  // 控制告警数量统计的显示
  public isAlarmStatistics: boolean = false;
  // 是否有告警统计权限按当前告警权限来
  public isAlarmStatisticsRole: boolean = SessionUtil.checkHasRole('02-1');
  // 使用工单统计权限
  public isWorkOrderRole: boolean = SessionUtil.checkHasRole('07-3');
  // 便捷入口的禁用启用loading
  public isEnableStrategy: boolean = false;
  // 分页参数
  public pageBean: PageModel = new PageModel();
  // 设备分页参数
  public equipmentPageBean: PageModel = new PageModel(5, 1, 0);
  // 分组分页参数
  public groupPageBean: PageModel = new PageModel(5, 1, 0);
  // 回路分页参数
  public loopPageBean: PageModel = new PageModel(5, 1, 0);
  // 照明亮度
  public convenientVal: number = 0;
  // 滑块值的常量
  public sliderValue = SliderValueConst;
  // 策略状态枚举
  public StrategyStatusEnum = StrategyStatusEnum;
  // 操作按钮枚举
  public OperationButtonEnum = OperationButtonEnum;
  // 设备状态统计
  public equipmentStatusData: object;
  // 存储单控和集控数量
  public equipmentCountList: EquipmentCountListModel = new EquipmentCountListModel({});
  // 智慧杆数量
  public multiFunctionPoleCount: number = 0;
  // 表格多语言
  public language: OnlineLanguageInterface;
  // 设备列表多语言
  public languageTable: ApplicationInterface;
  // 设备列表配置项
  public equipmentTableConfig: TableConfigModel;
  // 设备列表
  public equipmentData: EquipmentListModel[] = [];
  // 分组列表配置项
  public groupTableConfig: TableConfigModel;
  // 分组列表
  public groupData: GroupListModel[] = [];
  // 回路列表配置项
  public loopTableConfig: TableConfigModel;
  // 回路列表
  public loopData: LoopModel[] = [];
  // 卡片数据集合
  public dataSet: PolicyControlModel[] = [];
  // 亮灯率统计
  public lightingRateData: object;
  // 便捷入口数据
  public convenientData: PolicyControlModel = new PolicyControlModel({});
  // 告警统计
  public emergencyData: object;
  // 工单增量统计
  public workOrderData: object;
  // 用电量统计
  public electricity: object;
  // 用电量的起始时间
  public dateRange: Array<Date>;
  // 用电量统计所选时间
  public date;
  // 用电量的日期筛选
  public electricityDate;
  // 亮灯率
  public lightRateList;
  // 工单增量
  public workOrderList;
  // 默认选中亮灯率的日期
  public lightingRateNumber: number = 3;
  // 默认选中工单增量的筛选条件
  public workOrderQueryType: number = 3;
  // 默认选择用电量的筛选条件
  public electricityNumber: number = 8;
  // 卡片的查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 分组id集合
  public groupIds: Array<string> = [];
  // 卡片的查询条件
  public equipmentQueryCondition: QueryConditionModel = new QueryConditionModel();
  // 卡片的查询条件
  public groupQueryCondition: QueryConditionModel = new QueryConditionModel();
  // 卡片的查询条件
  public loopQueryCondition: QueryConditionModel = new QueryConditionModel();
  /** 开关绑定值*/
  public radioValue: boolean;
  /** 照明策略列表全选枚举*/
  public lightPolicyEnum = LightPolicyEnum;
  /** 照明设备列表全选枚举*/
  public lightTableEnum = LightTableEnum;
  public openRole: boolean = false;
  public closeRole: boolean = false;
  public sliderRole: boolean = false;
  //
  public videoControlEnum = VideoControlEnum;
  /**
   * 工作台权限码
   */
  public informationWorkBenchEnum = InformationWorkBenchEnum;
  /**
   * 告警分类时间
   */
  public alarmClassificationTime = {
    startAndEndTime: [CommonUtil.funDate(-365), CommonUtil.getCurrentTime()]
  };
  /**
   * 当前语言环境
   */
  public currentLangType: boolean = false;
  /**
   * switch按钮防抖
   */
  buttonDebounce = _.debounce((strategyStatus: boolean, strategyId: string) => {
    const params = {
      strategyType: StrategyListConst.lighting,
      operation: strategyStatus ? CurrencyEnum.enable : CurrencyEnum.disabled,
      strategyId: strategyId
    };
    this.$applicationService.enableOrDisableStrategy([params]).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.isConvenient = false;
        this.initWorkbenchList();
      } else {
        this.$message.error(result.msg);
      }
    });
  }, 500, {leading: false, trailing: true});
  // 设备id集合
  private equipmentIds: Array<string> = [];
  // 回路id集合
  private loopIds: Array<string> = [];
  private areaIds: string[] = [];

  constructor(
    // 路由
    private $router: Router,
    // 提示
    private $message: FiLinkModalService,
    // 设施服务
    private $facilityService: FacilityForCommonService,
    // 多语言配置
    private $nzI18n: NzI18nService,
    // 接口服务
    private $applicationService: ApplicationService,
    private $applicationSystemForCommonService: ApplicationSystemForCommonService,
    // 设施公共服务
    private $facilityCommonService: FacilityForCommonService,
  ) {
    // 多语言
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.online);
    // 表格多语言配置
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 默认查询条件
    this.defaultQuery();
    // 卡片初始化
    this.initWorkbenchList();
    // 统计初始化
    this.initCharts();
    // 单控和集控数量
    this.getControlEquipmentCount();
    // 智慧杆数量
    this.queryDeviceFunctionPole();
    // 设备表格配置项
    this.initTableConfig();
    // 回路表格配置项
    this.initLoopTableConfig();
    // 分组表格配置项
    this.initGroupTableConfig();
    this.openRole = !SessionUtil.checkHasRole(this.lightTableEnum.primaryOpenKey);
    this.closeRole = !SessionUtil.checkHasRole(this.lightTableEnum.primaryShutKey);
    this.sliderRole = !SessionUtil.checkHasRole(this.lightTableEnum.primaryLightKey);
    this.currentLangType = localStorage.getItem('localId') === 'en_US';
  }

  /**
   * 默认查询
   */
  public defaultQuery(): void {
    // 用电量的默认查询条件
    this.electricityDate = SelectDataConfig.selectData(this.languageTable);
    // 亮灯率默认查询条件
    this.lightRateList = SelectDataConfig.lightingRateData(this.languageTable);
    // 工单默认查询条件
    this.workOrderList = SelectDataConfig.workOrderData(this.languageTable);
    // 默认显示6条数据
    this.queryCondition.pageCondition.pageSize = PageOperationEnum.pageSize;
    // 默认显示5条数据
    this.equipmentQueryCondition.pageCondition.pageSize = PageOperationEnum.tablePageSize;
    // // 默认显示5条数据
    this.groupQueryCondition.pageCondition.pageSize = PageOperationEnum.tablePageSize;
    // // 默认显示5条数据
    this.loopQueryCondition.pageCondition.pageSize = PageOperationEnum.tablePageSize;
  }

  /**
   * 设备列表分页
   * @ param event
   */
  public equipmentPageChange(event: PageModel): void {
    this.equipmentQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.equipmentQueryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 分组列表分页
   * @ param event
   */
  public groupPageChange(event: PageModel): void {
    this.groupQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.groupQueryCondition.pageCondition.pageSize = event.pageSize;
    this.refGroupList();
  }

  /**
   * 回路列表分页
   * @ param event
   */
  public loopPageChange(event: PageModel): void {
    this.loopQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.loopQueryCondition.pageCondition.pageSize = event.pageSize;
    this.refLoopList();
  }

  /**
   * 分页查询
   * @ param event
   */
  public handlePage(type: string): void {
    const pageNum = this.pageBean.pageIndex;
    // 上一页
    if (type === VideoControlEnum.prev) {
      if (pageNum > PageOperationEnum.pageNum) {
        this.queryCondition.pageCondition.pageNum = pageNum - 1;
      } else {
        return;
      }
    } else { // 下一页
      if (this.totalPage > pageNum) {
        this.queryCondition.pageCondition.pageNum = pageNum + 1;
      } else {
        return;
      }
    }
    this.initWorkbenchList();
  }

  /**
   * 禁用和启用
   */
  public switchChange(strategyStatus: boolean, strategyId: string, i: number): void {
    if (!SessionUtil.checkHasRole(this.lightPolicyEnum.primaryEnableKey)) {
      this.$message.warning(this.languageTable.frequentlyUsed.notPermission);
      this.dataSet[i].strategyStatus = true;
      return;
    }
    if (event) {
      event.stopPropagation();
    }
    this.dataSet[i].strategyStatus = !strategyStatus;
    this.buttonDebounce(this.dataSet[i].strategyStatus, strategyId);
  }

  /**
   * 亮度调整
   * @ param data
   */
  public handleConvenientChange(data: PolicyControlModel): void {
    if (!SessionUtil.checkHasRole(this.lightTableEnum.primaryLightKey)) {
      this.$message.warning(this.languageTable.frequentlyUsed.notPermission);
      this.convenientVal = 0;
      return;
    }
    this.checkEquipmentMode().then(resolve => {
      if (resolve.code === ResultCodeEnum.success) {
        this.instructionLight(data);
        return;
      } else {
        // 指令异常弹出指令模式提示,不再下发指令
        this.$message.error(resolve.msg);
      }
    });

  }


  /**
   * 开关信息屏
   */
  public onEnableStrategyDetail(): void {
    if (this.radioValue) {
      if (!SessionUtil.checkHasRole(this.lightTableEnum.primaryOpenKey)) {
        this.$message.warning(this.languageTable.frequentlyUsed.notPermission);
        this.radioValue = null;
        return;
      }
    } else {
      if (!SessionUtil.checkHasRole(this.lightTableEnum.primaryShutKey)) {
        this.$message.warning(this.languageTable.frequentlyUsed.notPermission);
        this.radioValue = null;
        return;
      }
    }
    this.checkEquipmentMode().then(resolve => {
      if (resolve.code === ResultCodeEnum.success) {
        this.instructionSwitch();
        return;
      } else {
        // 指令异常弹出指令模式提示,不再下发指令
        this.$message.error(resolve.msg);
      }
    });
  }

  /**
   * 开关指令下发
   */
  public instructionSwitch() {
    const parameter = {
      strategyId: this.convenientData.strategyId,
      commandId: this.radioValue ? ControlInstructEnum.turnOn : ControlInstructEnum.turnOff,
      param: {}
    };
    this.isEnableStrategy = true;
    this.$applicationService.strategyInstructDistribute(parameter).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(this.languageTable.frequentlyUsed.commandSuccessful);
      } else {
        this.$message.error(this.languageTable.frequentlyUsed.failedCommand);
      }
      this.isEnableStrategy = false;
    });
  }

  /**
   * 亮度指令下发
   */
  public instructionLight(data: PolicyControlModel): void {
    const params = {
      strategyId: data.strategyId,
      commandId: ControlInstructEnum.dimming,
      param: {
        lightnessNum: this.convenientVal
      }
    };
    this.$applicationService.strategyInstructDistribute(params).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(`${this.languageTable.contentList.distribution}!`);
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 校验指令模式 是否可以指令下发
   */
  public checkEquipmentMode(): Promise<ResultModel<any>> {
    return new Promise((resolve, reject) => {
      this.$facilityCommonService.checkEquipmentMode({strategyId: this.convenientData.strategyId}).subscribe((res: ResultModel<any>) => {
        resolve(res);
      });
    });
  }

  /**
   * 选择年月日
   *
   */
  public handleChange(event): void {
    this.lightingRateNumber = event;
    if (this.areaIds.length > 0) {
      this.getLightingRateStatisticsData(event);
    } else {
      // 亮灯率统计
      this.getAllArea().then(() => {
        this.getLightingRateStatisticsData(this.lightingRateNumber);
      });
    }
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
   * 单控数量和集控数量
   */
  public getControlEquipmentCount(): void {
    this.$facilityService.equipmentCount().subscribe((result: ResultModel<EquipmentStatisticsModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        result.data.forEach(item => {
          if (item.equipmentType === EquipmentTypeEnum.singleLightController) {
            this.equipmentCountList.singleControllerCount = item.equipmentNum;
          }
          if (item.equipmentType === EquipmentTypeEnum.centralController) {
            this.equipmentCountList.centralControllerCount = item.equipmentNum;
          }
        });
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 智慧杆数量
   */
  public queryDeviceFunctionPole(): void {
    this.$facilityService.queryDeviceTypeCount().subscribe((result: ResultModel<Array<DeviceTypeCountModel>>) => {
      if (result.code === ResultCodeEnum.success) {
        const temp = result.data.find(item => item.deviceType === DeviceTypeEnum.wisdom);
        if (temp) {
          this.multiFunctionPoleCount = temp.deviceNum;
        }
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 告警统计
   */
  public getStatisticsAlarmLevel(): void {
    const filterConditions = new FilterCondition(PolicyEnum.alarmSourceTypeId, OperatorEnum.in, FilterValueConst.lightingFilter);
    const params = {
      statisticsType: StrategyStatusEnum.centralizedControl,
      filterConditions: [
        filterConditions,
        {
        filterField: 'alarm_begin_time',
        operator: 'gt',
        filterValue: this.changeTime(this.alarmClassificationTime.startAndEndTime[0], TimeTypeEnum.start)
        },
        {
          filterField: 'alarm_begin_time',
          operator: 'lt',
          filterValue: this.changeTime(this.alarmClassificationTime.startAndEndTime[1], TimeTypeEnum.end)
        }
        ]
    };
    this.$applicationService.getStatisticsEquipmentAlarmLevel(params).subscribe((result: ResultModel<Object>) => {
      if (result.code === 0) {
        if (result.data && Object.keys(result.data).length) {
          this.isAlarmStatistics = false;
          this.emergencyData = ChartsConfig.emergency(result.data, this.$nzI18n);
        } else {
          this.isAlarmStatistics = true;
        }
      } else {
        this.isAlarmStatistics = true;
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 策略列表
   */
  public initWorkbenchList(): void {
    const strategyStatus = new FilterCondition(PolicyEnum.strategyStatus, OperatorEnum.like, StrategyStatusEnum.lighting);
    const strategyType = new FilterCondition(PolicyEnum.strategyType, OperatorEnum.like, StrategyStatusEnum.lighting);
    this.queryCondition.filterConditions = this.queryCondition.filterConditions.concat([strategyStatus, strategyType]);
    this.$applicationService.getLightingPolicyList(this.queryCondition).subscribe((result: ResultModel<PolicyControlModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        const {totalCount, pageNum, data, size, totalPage} = result;
        this.dataSet = data;
        this.pageBean.Total = totalCount;
        this.totalPage = totalPage;
        this.pageBean.pageIndex = pageNum;
        this.pageBean.pageSize = size;
        if (this.dataSet.length) {
          this.dataSet.forEach(item => {
            item.execType = execType(this.$nzI18n, item.execType) as ExecTypeEnum;
            item.startEndTime = `${CommonUtil.dateFmt(ApplicationFinalConst.dateTypeDay, new Date(item.effectivePeriodStart))}
        ~${CommonUtil.dateFmt(ApplicationFinalConst.dateTypeDay, new Date(item.effectivePeriodEnd))}`;
            item.strategyStatus = item.strategyStatus === CurrencyEnum.enable;
          });
        } else {
          this.isAvailable = true;
        }
      } else {
        this.$message.error(result.msg);
      }

    });
  }

  /**
   * 初始化统计数据格式
   */
  public initCharts(): void {
    this.getAllArea().then((resolve) => {
      // 亮灯率统计
      this.getLightingRateStatisticsData(this.lightingRateNumber);
      this.date = new Date();
      // 用电量统计
      this.getElectConsStatisticsData();
    });
    // 工单增量统计
    if (this.isWorkOrderRole) {
      this.findApplyStatisticsByCondition(this.workOrderQueryType);
    }
    // 告警统计
    if (this.isAlarmStatisticsRole) {
      this.getStatisticsAlarmLevel();
    }
    // 设备状态统计
    this.queryEquipmentStatus();
  }

  /**
   * 用电量统计
   */
  public getElectConsStatisticsData(): void {
    let timeType;
    const time = {
      day: null,
      week: null,
      month: null,
      year: this.date.getFullYear()
    };
    switch (this.electricityNumber) {
      // 按周
      case 5:
        timeType = DateTypeEnum.week;
        time.week = getISOWeek(this.date);
        break;
      // 按月
      case 6:
        timeType = DateTypeEnum.month;
        time.month = this.date.getMonth() + 1;
        break;
      // 按年
      case 8:
        timeType = DateTypeEnum.year;
        break;
      default:
        break;
    }
    const params = {
      statisticsType: ReportAnalysisTypeEnum.electricityConsumption,
      equipmentTypes: [EquipmentTypeEnum.singleLightController, EquipmentTypeEnum.centralController],
      statisticsScope: StatisticalDimensionEnum.area,
      filterConditions: [new FilterCondition('areaId', OperatorEnum.in, this.areaIds)],
      timeType: timeType,
      time: time
    };
    this.$applicationService.workBenchQueryElectricityConsumption(params).subscribe((res: ResultModel<any>) => {
      if (res.code === ResultCodeEnum.success) {
        if (res.data && res.data[0].result.length > 0) {
          this.isElectricity = false;
          this.electricity = ChartsConfig.electricity(res.data[0].result, this.electricityNumber, this.language);
        } else {
          this.isElectricity = true;
        }
      } else {
        this.isElectricity = true;
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 切换日，周，月，季度，年
   */
  public handleElectricityChange(event): void {
    this.electricityNumber = event;
    this.getElectConsStatisticsData();
  }

  /**
   * 选择时间查询
   * @ param event
   */
  public onDateChange(event: Array<Date>): void {
    this.dateRange = event;
    this.getElectConsStatisticsData();
  }

  /**
   * 亮灯率统计
   * @ param type 年月日
   */
  public getLightingRateStatisticsData(type): void {
    // 无区域
    if (!this.areaIds.length) {
      this.isLightingRate = true;
      return;
    }
    const date = new Date();
    let timeType;
    const time = {
      day: null,
      week: null,
      month: null,
      year: date.getFullYear()
    };
    switch (type) {
      case 1:
        // 本周
        time.week = getISOWeek(date);
        timeType = DateTypeEnum.week;
        break;
      case 2:
        // 本月
        time.month = date.getMonth() + 1;
        timeType = DateTypeEnum.month;
        break;
      case 3:
        // 本年
        timeType = DateTypeEnum.year;
        break;
      default:
        break;
    }
    const params = {
      statisticsType: ReportAnalysisTypeEnum.lightingRate,
      equipmentType: EquipmentTypeEnum.singleLightController,
      statisticsScope: StatisticalDimensionEnum.area,
      filterConditions: [new FilterCondition('areaId', OperatorEnum.in, this.areaIds)],
      timeType: timeType,
      time: time
    };
    this.$applicationService.queryReportAnalysisData(params).subscribe((res: ResultModel<any>) => {
      if (res.code === ResultCodeEnum.success) {
        this.isLightingRate = false;
        if (res.data[0].result.length > 0) {
          this.lightingRateData = ChartsConfig.lightingRate(res.data[0].result, type, this.language);
        }
      } else {
        this.isLightingRate = true;
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 获取区域 根据查询区域的亮灯率
   */
  public getAllArea(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.$facilityCommonService.queryAreaList().subscribe((res) => {
        if (res.code === ResultCodeEnum.success) {
          this.areaIds = this.handleAreaData(res.data);
          resolve();
        }
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * 递归获取区域id
   * @param data 区域数据
   */
  public handleAreaData(data) {
    const areaIds = [];
    data.forEach(item => {
      areaIds.push(item.areaId);
      if (item.children && item.children.length) {
        this.handleAreaData(item.children);
      }
    });
    return areaIds;
  }

  /**
   * 设备状态统计
   */
  public queryEquipmentStatus(): void {
    const parameter = {
      equipmentTypes: ['E002', 'E003']
    };
    this.$applicationService.queryEquipmentStatus(parameter).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        if (result.data && result.data.length) {
          this.isEquipmentStatus = false;
          this.equipmentStatusData = ChartsConfig.equipmentStatus(result.data, this.$nzI18n);
        } else {
          this.isEquipmentStatus = true;
        }
      } else {
        this.isEquipmentStatus = true;
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 工单增量统计
   */
  public findApplyStatisticsByCondition(type: number): void {
    const params = {
      statisticalType: type.toString()
    };
    this.$applicationSystemForCommonService.findApplyStatisticsByCondition(params).subscribe((result: ResultModel<WorkOrderIncreaseModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        if (result.data && result.data.length) {
          this.isWorkOrder = false;
          if (type === 3) {
            result.data.forEach(item => {
              // item.formatDate = `${parseInt(item.formatDate, 10)}${this.languageTable.workOrderList.month}`;
              const monthNum = Number(parseInt(item.formatDate, 10));
              item.formatDate = `${CommonUtil.codeTranslate(MonthEnum, this.$nzI18n, monthNum, LanguageEnum.common)}`;
            });
          }
          this.workOrderData = ChartsConfig.workOrder(result.data, this.language);
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
   * 跳转到策略详情页面
   */
  public handStrategyDetails(item: PolicyControlModel): void {
    this.$router.navigate([`${RouterJumpConst.lightingDetails}/${item.strategyId}`]).then();
  }

  /**
   * 跳转到策略新增页面
   */
  public handGoPage(): void {
    this.$router.navigate([RouterJumpConst.lightingPolicyControlAdd], {}).then();
  }

  /**
   * 跳转到策略页面
   */
  public handPolicyPage(): void {
    this.$router.navigate([RouterJumpConst.lightingPolicyControl], {}).then();
  }

  /**
   * 显示便捷入口
   */
  public handShowConvenient(event: MouseEvent, item: PolicyControlModel, index: number): void {
    if (event) {
      event.stopPropagation();
    }
    this.convenientData = item;
    if (this.dataSet[index].state) {
      this.dataSet[index].state = false;
      this.isConvenient = false;
      return;
    }
    // 将设备  分组  回路的数据清空
    this.equipmentData = [];
    this.groupData = [];
    this.loopData = [];
    // 先将所有的置为不选中的状态
    this.dataSet.forEach(it => it.state = false);
    this.equipmentQueryCondition.pageCondition.pageNum = 1;
    this.groupQueryCondition.pageCondition.pageNum = 1;
    this.loopQueryCondition.pageCondition.pageNum = 1;
    this.isConvenient = true;
    this.dataSet[index].state = true;
    this.radioValue = null;
    this.$applicationService.getLightingPolicyDetails(item.strategyId).subscribe((result: ResultModel<StrategyListModel>) => {
      if (result.code === ResultCodeEnum.success) {
        this.queryStrategy(result.data);
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 应用范围table默认条件，筛选对应策略id下的数据
   * @ param queryCondition 分页参数
   * @ param type 设备，分组，回路
   * @ param ids 对应的id集合
   */
  public defaultTableQuery(queryCondition, type, ids): void {
    const flag = queryCondition.filterConditions.some(item => item.filterField === type);
    if (!flag) {
      const equipmentId = new FilterCondition(type, OperatorEnum.in, ids);
      queryCondition.filterConditions.push(equipmentId);
    } else {
      const equipmentId = new FilterCondition(type, OperatorEnum.in, ids);
      queryCondition.filterConditions.forEach((item, index) => {
        if (item.filterField === type) {
          queryCondition.filterConditions.splice(index, 1, equipmentId);
        }
      });
    }
  }

  /**
   * 跳转告警页面
   */
  public goToAlarm(): void {
    this.$router.navigate([`business/alarm/current-alarm`], {
      queryParams: {alarmSourceTypeId: [TargetTypeEnum.singleControl, TargetTypeEnum.multiControl]}
    }).then();
  }

  /**
   * 查询策略下的设备，分组，回路
   */
  private queryStrategy(data: StrategyListModel): void {
    this.equipmentIds = [];
    this.groupIds = [];
    this.loopIds = [];
    const strategyRefList = listFmt(data.strategyRefList);
    this.equipmentIds = strategyRefList.equipment.map(equipmentItem => equipmentItem.refId);
    this.groupIds = strategyRefList.group.map(groupItem => groupItem.refId);
    this.loopIds = strategyRefList.loop.map(loopItem => loopItem.refId);
    if (this.equipmentIds.length) {
      // 设备列表
      this.refreshData();
    } else {
      this.equipmentTableConfig.isLoading = false;
      this.equipmentData = [];
      this.equipmentPageBean = new PageModel(5, 1, 0);
    }
    if (this.groupIds.length) {
      // 分组列表
      this.refGroupList();
    } else {
      this.groupTableConfig.isLoading = false;
      this.groupData = [];
      this.groupPageBean = new PageModel(5, 1, 0);
    }
    if (this.loopIds.length) {
      // 回路列表
      this.refLoopList();
    } else {
      this.loopTableConfig.isLoading = false;
      this.loopData = [];
      this.loopPageBean = new PageModel(5, 1, 0);
    }
  }

  /**
   * 设备表格配置
   */
  private initTableConfig(): void {
    this.equipmentTableConfig = {
      isDraggable: true,
      isLoading: false,
      scroll: {x: '280px', y: '200px'},
      outHeight: 100,
      noAutoHeight: true,
      simplePage: true,
      simplePageTotalShow: true,
      topButtons: [],
      noIndex: true,
      columnConfig: [
        {
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber
        },
        // 设备名称
        {
          title: this.languageTable.equipmentTable.equipment,
          key: 'equipmentName',
          width: 300,
          isShowSort: true
        },
      ],
      showSearchExport: false,
      showPagination: true,
      bordered: false,
      showSearch: false,
      operation: [],
      // 排序
      sort: (event: SortCondition) => {
        if (this.equipmentIds.length) {
          this.equipmentQueryCondition.sortCondition.sortField = event.sortField;
          this.equipmentQueryCondition.sortCondition.sortRule = event.sortRule;
          this.refreshData();
        }
      },
    };
  }

  /**
   * 设备表格数据
   */
  private refreshData(): void {
    this.equipmentTableConfig.isLoading = true;
    // 默认查询选中的id数据
    this.defaultTableQuery(this.equipmentQueryCondition, PolicyEnum.equipmentId, this.equipmentIds);
    this.$applicationService.equipmentListByPage(this.equipmentQueryCondition).subscribe((res: ResultModel<EquipmentListModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        this.equipmentTableConfig.isLoading = false;
        const {data, totalCount, pageNum, size} = res;
        this.equipmentPageBean.Total = totalCount;
        this.equipmentPageBean.pageIndex = pageNum;
        this.equipmentPageBean.pageSize = size;
        this.equipmentData = data;
      } else {
        this.$message.error(res.msg);
      }

    }, () => {
      this.equipmentTableConfig.isLoading = false;
    });
  }

  /**
   * 分组表格配置
   */
  private initGroupTableConfig(): void {
    this.groupTableConfig = {
      primaryKey: '03-1',
      isDraggable: true,
      isLoading: true,
      scroll: {x: '280px', y: '200px'},
      outHeight: 100,
      noIndex: true,
      simplePage: true,
      simplePageTotalShow: true,
      showSearchExport: false,
      columnConfig: [
        {
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber
        },
        // 分组名称
        {
          title: this.languageTable.equipmentTable.group,
          key: 'groupName',
          width: 300,
          isShowSort: true
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      leftBottomButtons: [],
      operation: [],
      // 排序
      sort: (event: SortCondition) => {
        if (this.groupIds.length) {
          this.groupQueryCondition.sortCondition.sortField = event.sortField;
          this.groupQueryCondition.sortCondition.sortRule = event.sortRule;
          this.refGroupList();
        }
      },
    };
  }

  /**
   * 分组表格数据
   */
  private refGroupList(): void {
    this.groupTableConfig.isLoading = true;
    // 默认查询选中的id数据
    this.defaultTableQuery(this.groupQueryCondition, PolicyEnum.groupId, this.groupIds);
    this.$applicationService.queryGroupInfoList(this.groupQueryCondition).subscribe((res: ResultModel<GroupListModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        this.groupTableConfig.isLoading = false;
        const {data, totalCount, pageNum, size} = res;
        this.groupPageBean.Total = totalCount;
        this.groupPageBean.pageIndex = pageNum;
        this.groupPageBean.pageSize = size;
        this.groupData = data;
      } else {
        this.$message.error(res.msg);
      }

    }, () => {
      this.groupTableConfig.isLoading = false;
    });
  }

  /**
   * 回路表格配置
   */
  private initLoopTableConfig(): void {
    this.loopTableConfig = {
      primaryKey: '03-1',
      isDraggable: true,
      isLoading: true,
      simplePage: true,
      simplePageTotalShow: true,
      scroll: {x: '280px', y: '200px'},
      outHeight: 100,
      noIndex: true,
      showSearchExport: false,
      columnConfig: [
        {
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber
        },
        // 回路名称
        {
          title: this.languageTable.equipmentTable.loop,
          key: 'loopName',
          width: 300,
          isShowSort: true
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      leftBottomButtons: [],
      operation: [],
      // 排序
      sort: (event: SortCondition) => {
        if (this.loopIds.length) {
          this.loopQueryCondition.sortCondition.sortField = event.sortField;
          this.loopQueryCondition.sortCondition.sortRule = event.sortRule;
          this.refLoopList();
        }
      },
    };
  }

  /**
   * 回路表格数据
   */
  private refLoopList(): void {
    this.loopTableConfig.isLoading = true;
    // 默认查询选中的id数据
    this.defaultTableQuery(this.loopQueryCondition, PolicyEnum.loopIds, this.loopIds);
    this.$applicationService.loopListByPage(this.loopQueryCondition).subscribe((res: ResultModel<LoopModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        this.loopTableConfig.isLoading = false;
        const {data, totalCount, pageNum, size} = res;
        this.loopPageBean.Total = totalCount;
        this.loopPageBean.pageIndex = pageNum;
        this.loopPageBean.pageSize = size;
        this.loopData = data;
      } else {
        this.$message.error(res.msg);
      }

    }, () => {
      this.groupTableConfig.isLoading = false;
    });
  }

  /**
   * 转换时间戳
   * @param time 时间
   * @param type start:开始时间 end:结束时间
   */
  public changeTime(time, type: string) {
    const timeString = CommonUtil.dateFmt('yyyy/MM/dd', new Date(time));
    const date = new Date(type === TimeTypeEnum.start ? `${timeString} 00:00:00` : `${timeString} 23:59:59`);
    return typeof date === 'string' ? Date.parse(date) : CommonUtil.getTimeStamp(date);
  }
}
