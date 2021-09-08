import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {ApplicationService} from '../../share/service/application.service';
import {execType, getExecStatus, getPolicyType} from '../../share/util/application.util';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {ApplicationFinalConst} from '../../share/const/application-system.const';
import {QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {StatisticalChartModel} from '../../share/model/lighting.model';
import {ChartsConfig} from '../../share/config/charts-config';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {ApplicationInterface} from '../../../../../assets/i18n/application/application.interface';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {PolicyControlModel} from '../../share/model/policy.control.model';
import {ExecTypeEnum, TargetTypeEnum} from '../../share/enum/policy.enum';
import {InterfaceModel} from '../../share/model/interface.model';
import {ContentListModel} from '../../share/model/content.list.model';
import {InformationWorkBenchEnum, ReleasePolicyEnum, ReleaseTableEnum} from '../../share/enum/auth.code.enum';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {FileTypeEnum, TimeTypeEnum} from '../../share/enum/program.enum';
import {ControlInstructEnum} from '../../../../core-module/enum/instruct/control-instruct.enum';
import {SystemCommonUtil} from '../../share/util/system-common-util';

/**
 * 信息发布系统 工作台页面
 */
@Component({
  selector: 'app-release-workbench',
  templateUrl: './release-workbench.component.html',
  styleUrls: ['./release-workbench.component.scss']
})
export class ReleaseWorkbenchComponent implements OnInit {
  /**
   * 便捷入口开关
   */
  public convenientEntranceSwitch: boolean = false;
  /**
   * 列表请求参数
   */
  private queryCondition: QueryConditionModel = new QueryConditionModel();

  /**
   * 策略列表数据
   */
  public listData: PolicyControlModel[] = [];

  /**
   * 策略详情数据
   */
  public detailData: PolicyControlModel;

  /**
   * 节目投放统计数据
   */
  public programLaunchQuantity: object;

  /**
   * 设备状态
   */
  public equipmentStatusData: object;

  /**
   * 告警分类
   */
  public alarmClassification: object;

  /**
   * 时长统计数据
   */
  public duration: any;

  /**
   * 工单增量统计
   */
  public workOrderIncrement: object;
  /**
   * 是否有工单增量统计权限
   */
  public isWorkOrderRole: boolean = SessionUtil.checkHasRole('09-2-5');

  /**
   * 分页
   * Total
   */
  public paging = {Total: 0, pageIndex: 1, pageSize: 6, totalPage: 0};

  /**
   * 工单增量时间
   */
  public workOrderIncrementTime = {
    startAndEndTime: [CommonUtil.funDate(-365), CommonUtil.getCurrentTime()]
  };
  /**
   * 节目投放数量时间
   */
  public programLaunchQuantityTime = {
    startAndEndTime: [CommonUtil.funDate(-365), CommonUtil.getCurrentTime()]
  };
  /**
   * 播放时间
   */
  public durationTime = {
    startAndEndTime: [CommonUtil.funDate(-365), CommonUtil.getCurrentTime()]
  };
  /**
   * 告警分类时间
   */
  public alarmClassificationTime = {
    startAndEndTime: [CommonUtil.funDate(-365), CommonUtil.getCurrentTime()]
  };

  /**
   * 选中的节目ＩＤ
   */
  public selectProgramId: string;

  /**
   * 节目地址
   */
  public programIdPath: string;
  /**
   * 国际化
   */
  public language: ApplicationInterface;
  /**
   * 是否是视屏
   */
  public isVideo: boolean = true;
  /**
   * 工作台权限码
   */
  public informationWorkBenchEnum = InformationWorkBenchEnum;

  /**
   * 节目列表
   */
  public programList: ContentListModel[] = [];
  /** 是否展示工单增量图表*/
  public isShowWorkOrder: boolean = false;
  /** 是否展示设备节目投放数量图表*/
  public isShowProgramLaunch: boolean = false;
  /** 是否展示设备播放时长图表*/
  public isShowDuration: boolean = false;
  /** 是否展示告警分类数量统计图表*/
  public isShowAlarmClassification: boolean = false;
  /** 是否有告警分类统计权限按当前告警权限来*/
  public isAlarmStatisticsRole: boolean = SessionUtil.checkHasRole('02-1');
  /** 是否展示设备状态图表*/
  public isShowEquipmentStatus: boolean = false;
  /** 信息屏code码枚举*/
  public releasePolicyEnum = ReleasePolicyEnum;
  /** 设备列表code码枚举*/
  public releaseTableEnum = ReleaseTableEnum;
  /** 开关绑定值*/
  public radioValue: boolean;
  public openRole: boolean = false;
  public closeRole: boolean = false;
  public sliderRole: boolean = false;
  public volumeRole: boolean = false;
  /**
   * 当前语言环境
   */
  public currentLangType: boolean = false;
  /**
   * @param $router 路由跳转服务
   * @param $applicationService 后台接口服务
   * @param $nzI18n 路由跳转服务
   * @param $message 信息提示服务
   */
  constructor(
    private $router: Router,
    private $applicationService: ApplicationService,
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
  ) {
  }

  public ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.currentLangType = localStorage.getItem('localId') === 'en_US';
    this.onInitialization();
    this.launchQuantityStatistics();
    if (this.isWorkOrderRole) {
      this.workOrderIncrementStatistics();
    }
    this.durationStatistics();
    this.queryEquipmentStatus();
    if (this.isAlarmStatisticsRole) {
      this.statisticsAlarmLevelType();
    }
    this.openRole = !SessionUtil.checkHasRole(this.releaseTableEnum.primaryOpenKey);
    this.closeRole = !SessionUtil.checkHasRole(this.releaseTableEnum.primaryShutKey);
    this.sliderRole = !SessionUtil.checkHasRole(this.releaseTableEnum.primaryLightKey);
    this.volumeRole = !SessionUtil.checkHasRole(this.releaseTableEnum.primaryVolume);
  }


  /**
   * 列表初始化
   */
  private onInitialization(): void {
    this.queryCondition.pageCondition.pageSize = 6;
    this.queryCondition.filterConditions = [
      {filterValue: '1', filterField: 'strategyStatus', operator: 'like'},
      {filterValue: '3', filterField: 'strategyType', operator: 'like'}
    ];
    this.$applicationService.getLightingPolicyList(this.queryCondition)
      .subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          this.listData = _.cloneDeep(result.data);
          // 将时间戳转化为时间  转化执行状态  转化策略类型
          this.listData.forEach(listItem => {
            // 给列表加上状态 来显示样式(是否被选中)
            listItem.state = false;
            listItem.strategyType = getPolicyType(this.$nzI18n, listItem.strategyType);
            listItem.createTime = SystemCommonUtil.processingTime(listItem.createTime);
            listItem.execType = execType(this.$nzI18n, listItem.execType) as ExecTypeEnum;
            listItem.strategyStatus = listItem.strategyStatus === '1';
            listItem.effectivePeriodTime = `${CommonUtil.dateFmt(ApplicationFinalConst.dateTypeDay, new Date(listItem.effectivePeriodStart))}
            ~${CommonUtil.dateFmt(ApplicationFinalConst.dateTypeDay, new Date(listItem.effectivePeriodEnd))}`;
          });
          // 分页
          this.paging.Total = result.totalCount;
          this.paging.pageIndex = result.pageNum;
          this.paging.pageSize = result.size;
          this.paging.totalPage = result.totalPage;
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * 策略新增
   */
  public onAddStrategy(): void {
    this.$router.navigate(['business/application/release/policy-control/add'], {}).then();
  }

  /**
   * 跳转到策略列表
   */
  public onGoStrategyList(): void {
    this.$router.navigate(['business/application/release/policy-control'], {}).then();
  }

  /**
   * 展示便捷入口
   * @param index 被选中的数据下标
   * @param event 鼠标事件
   */
  public handShowConvenient(event: MouseEvent, index: number): void {
    if (event) {
      event.stopPropagation();
    }
    // 当前策略是被选中的  再次点击  则取消改策略
    if (this.listData[index].state === true) {
      this.listData[index].state = false;
      this.convenientEntranceSwitch = false;
      return;
    }
    this.convenientEntranceSwitch = true;
    // 重置列表的状态
    this.listData.forEach(listItem => {
      listItem.state = false;
    });
    // 被选中的状态改为true
    this.listData[index].state = true;
    // 将详情中的已选节目ID  和地址置空
    this.selectProgramId = null;
    this.programIdPath = '';
    this.programList = [];
    this.radioValue = null;
    this.$applicationService.getReleasePolicyDetails(this.listData[index].strategyId)
      .subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          this.detailData = result.data;
          this.detailData.execStatus = getExecStatus(this.$nzI18n, this.detailData.execStatus);
          this.detailData.strategyStatus = this.detailData.strategyStatus === '1';
          this.detailData.effectivePeriodTime = `${CommonUtil.dateFmt(ApplicationFinalConst.dateTypeDay, new Date(this.detailData.effectivePeriodStart))}
            ~${CommonUtil.dateFmt(ApplicationFinalConst.dateTypeDay, new Date(this.detailData.effectivePeriodEnd))}`;
          this.queryProgram();
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * 查询节目信息
   */
  private queryProgram(): void {
    const selectProgramIds = this.detailData.strategyProgRelationList.map(item => item.programId);
    this.$applicationService.lookReleaseProgramIds(selectProgramIds)
      .subscribe((result: ResultModel<ContentListModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.programList = result.data || [];
          if (!_.isEmpty(this.programList)) {
            this.selectProgramId = this.programList[0].programId;
            this.changeProgram();
          }
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * 改变节目数据
   */
  public changeProgram(): void {
    this.programList.forEach(item => {
      if (this.selectProgramId === item.programId) {
        // 判断是否是图片 或者视频
        this.isVideo = item.programFileType === FileTypeEnum.video;
        // 将'\'换成'/'
        this.programIdPath = item.programPath.replace(/\\/g, '/');
        // this.onInstructionIssue(item);
      }
    });
  }

  /**
   * 防抖
   */
  buttonDebounce = _.debounce((event: MouseEvent, strategyId: string, status: boolean) => {
    const params = {
      strategyType: '3',
      operation: status ? '1' : '0',
      strategyId: strategyId
    };
    this.$applicationService.enableOrDisableStrategy([params]).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        // 如果当前列表为长度为一,且分页
        if (!status && this.listData.length === 1 && this.paging.pageIndex > 1) {
          // this.paging.pageIndex = this.paging.pageIndex - 1;
          this.queryCondition.pageCondition.pageNum = this.queryCondition.pageCondition.pageNum - 1;
        }
      } else {
        this.$message.error(result.msg);
      }

      // 成功与失败 都应初始化列表
      this.onInitialization();
    });
  }, 500, {leading: false, trailing: true});

  /**
   * 启用禁用
   * @param event 鼠标事件
   * @param strategyId 策略ID
   * @param status 策略状态
   * @param i 策略状态
   */
  public onEnableOrDisableStrategy(event: MouseEvent, strategyId: string, status: boolean, i: number): void {
    if (!SessionUtil.checkHasRole(this.releasePolicyEnum.primaryDisableKey)) {
      this.$message.warning(this.language.frequentlyUsed.notPermission);
      this.listData[i].strategyStatus = true;
      return;
    }
    if (event) {
      event.stopPropagation();
    }
    this.listData[i].strategyStatus = !status;
    this.buttonDebounce(event, strategyId, !status);
  }

  /**
   * @param type 类型 left：分页页码减一 right:分页页码加一   * 分页切换
   */
  public onPagingChange(type: string): void {
    if (type === 'left') {
      // 当分页页码是第一页和最后一页时  则直接return
      if (this.paging.pageIndex <= 1) {
        return;
      }
      this.queryCondition.pageCondition.pageNum = this.queryCondition.pageCondition.pageNum - 1;
    } else {
      if (this.paging.pageIndex >= this.paging.totalPage) {
        return;
      }
      this.queryCondition.pageCondition.pageNum = this.queryCondition.pageCondition.pageNum + 1;
    }
    this.onInitialization();
  }

  /**
   *
   * 跳转策略详情
   */
  public strategyDetails(strategyId: string): void {
    this.$router.navigate([`business/application/release/policy-details/${strategyId}`], {}).then();
  }

  /**
   * 设备节目投放数量统计
   */
  public launchQuantityStatistics(): void {
    const parameter = {
      startTime: this.changeTime(this.programLaunchQuantityTime.startAndEndTime[0], TimeTypeEnum.start),
      endTime: this.changeTime(this.programLaunchQuantityTime.startAndEndTime[1], TimeTypeEnum.end)
    };
    this.$applicationService.launchQuantityStatistics(parameter)
      .subscribe((result: ResultModel<string>) => {
        if (result.code === ResultCodeEnum.success) {
          const programLaunchQuantity = this.processingData(result, 'programCount');
          this.isShowProgramLaunch = programLaunchQuantity.isShow;
          // 单位:个
          programLaunchQuantity.company = `${this.language.frequentlyUsed.unit}:${this.language.frequentlyUsed.piece}`;
          this.programLaunchQuantity = ChartsConfig.workOrderIncrement(programLaunchQuantity, 'programCount' , this.language);
        } else {
          this.$message.warning(result.msg);
        }
      });
  }


  /**
   * 设备播放时长统计
   */
  public durationStatistics(): void {
    const parameter = {
        startTime: this.changeTime(this.durationTime.startAndEndTime[0], TimeTypeEnum.start),
        endTime: this.changeTime(this.durationTime.startAndEndTime[1], TimeTypeEnum.end)
      }
    ;
    this.$applicationService.durationStatistics(parameter)
      .subscribe((result: ResultModel<any[]>) => {
        if (result.code === ResultCodeEnum.success) {
          const duration = this.processingData(result, 'equipmentPlayTime');
          this.isShowDuration = duration.isShow;
          duration.data = duration.data.map(item => {
            return (item / 3600).toFixed(2);
          });
          // 单位:小时
          duration.company = `${this.language.frequentlyUsed.unit}:${this.language.frequentlyUsed.hour}`;
          this.duration = ChartsConfig.workOrderIncrement(duration, 'equipmentPlayTime', this.language);
          this.duration.grid.x = 80;
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * 工单增量统计
   */
  public workOrderIncrementStatistics(): void {
    const parameter = {
      startTime: this.changeTime(this.workOrderIncrementTime.startAndEndTime[0], TimeTypeEnum.start),
      endTime: this.changeTime(this.workOrderIncrementTime.startAndEndTime[1], TimeTypeEnum.end)
    };
    this.$applicationService.workOrderIncrementStatistics(parameter)
      .subscribe((result: ResultModel<string>) => {
        if (result.code === ResultCodeEnum.success) {
          const workOrderIncrement = this.processingData(result, 'workOrderIncrement');
          this.isShowWorkOrder = workOrderIncrement.isShow;
          // 单位:个
          workOrderIncrement.company = `${this.language.frequentlyUsed.unit}:${this.language.frequentlyUsed.piece}`;
          this.workOrderIncrement = ChartsConfig.workOrderIncrement(workOrderIncrement, 'workOrderIncrement', this.language);
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * 设备状态统计
   *
   */
  public queryEquipmentStatus(): void {
    const parameter = {
      equipmentTypes: ['E004']
    };
    this.$applicationService.queryEquipmentStatus(parameter).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.isShowEquipmentStatus = !!(result.data && result.data.length);
        this.equipmentStatusData = ChartsConfig.equipmentStatus(result.data, this.$nzI18n);
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 告警分类数量统计
   *
   */
  public statisticsAlarmLevelType(): void {
    const parameter = {
      filterConditions: [
        {
          filterField: 'alarm_begin_time',
          operator: 'gt',
          filterValue: this.changeTime(this.alarmClassificationTime.startAndEndTime[0], TimeTypeEnum.start)
        },
        {
          filterField: 'alarm_begin_time',
          operator: 'lt',
          filterValue: this.changeTime(this.alarmClassificationTime.startAndEndTime[1], TimeTypeEnum.end)
        },
        {
          filterField: 'alarm_source_type_id',
          operator: 'in',
          filterValue: ['E004']
        }
      ],
      statisticsType: '1'
    };
    this.$applicationService.statisticsAlarmLevelType(parameter).subscribe((result: ResultModel<object>) => {
      // 此处属于特殊地方 仅这一接口返回为number0
      if (result.code === 0) {
        this.isShowAlarmClassification = !!(result.data);
        this.alarmClassification = ChartsConfig.alarmStatistics(result.data, this.$nzI18n);
      } else {
        this.$message.error(result.msg);
      }
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

  /**
   * 处理统计图但会结果数据
   * @param result 返回的结果
   * @param field 字段
   */
  private processingData(result, field) {
    const statisticsData = _.cloneDeep(result.data || []);
    const returnData: StatisticalChartModel = {xData: [], data: [], isShow: false, company: ''};
    // 判断数据是否为空 数据为空则为false
    returnData.isShow = statisticsData.length !== 0;
    statisticsData.forEach(listItem => {
      returnData.xData.push(listItem.time);
      returnData.data.push(listItem[field]);
    });
    return returnData;
  }

  /**
   * 调节亮度
   */
  public onAdjustBrightness(): void {
    if (!SessionUtil.checkHasRole(this.releaseTableEnum.primaryLightKey)) {
      this.$message.warning(this.language.frequentlyUsed.notPermission);
      return;
    }
    const parameter = new InterfaceModel({
      strategyId: this.detailData.strategyId,
      commandId: ControlInstructEnum.setBrightness,
      param: {
        lightnessNum: this.detailData.instructInfo.light
      }
    });
    this.onAdjust(parameter);
  }

  /**
   * 调节音量
   */
  public onAdjustVolume(): void {
    if (!SessionUtil.checkHasRole(this.releaseTableEnum.primaryVolume)) {
      this.$message.warning(this.language.frequentlyUsed.notPermission);
      return;
    }
    const parameter = new InterfaceModel({
      strategyId: this.detailData.strategyId,
      commandId: ControlInstructEnum.setVolume,
      param: {
        volumeNum: this.detailData.instructInfo.volume
      }
    });
    this.onAdjust(parameter);
  }

  /**
   * 开关信息屏
   */
  public onEnableStrategyDetail(): void {
    if (this.radioValue) {
      if (!SessionUtil.checkHasRole(this.releaseTableEnum.primaryOpenKey)) {
        this.$message.warning(this.language.frequentlyUsed.notPermission);
        this.radioValue = null;
        return;
      }
    } else {
      if (!SessionUtil.checkHasRole(this.releaseTableEnum.primaryShutKey)) {
        this.$message.warning(this.language.frequentlyUsed.notPermission);
        this.radioValue = null;
        return;
      }
    }
    const parameter = new InterfaceModel({
      strategyId: this.detailData.strategyId,
      commandId: this.radioValue ? ControlInstructEnum.turnOn : ControlInstructEnum.turnOff,
      param: {}
    });
    this.onAdjust(parameter);
  }

  /**
   * 跳转告警页面
   */
  public goToAlarm(): void {
    this.$router.navigate([`business/alarm/current-alarm`], {
      queryParams: {alarmSourceTypeId: TargetTypeEnum.informationScreen}
    }).then();
  }

  /**
   * 指令接口
   */
  private onAdjust(parameter: InterfaceModel): void {
    this.$applicationService.adjustVolumeBrightness(parameter).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.language.frequentlyUsed.commandSuccessful);
      } else {
        this.$message.error(this.language.frequentlyUsed.failedCommand);
      }
    });
  }

  /**
   * 节目下发指令
   */
  public onInstructionIssue(data?: ContentListModel): void {
    if (!data) {
      this.programList.forEach((item) => {
        if (this.selectProgramId === item.programId) {
          data = item;
        }
      });
    }
    const parameter = new InterfaceModel({
      strategyId: this.detailData.strategyId,
      commandId: ControlInstructEnum.screenPlay,
      param: {
        // 当前策略的音量
        volume: this.detailData.instructInfo.volume,
        // 当前策略的亮度
        light: this.detailData.instructInfo.light,
        periodType: 6,
        dayTime: [
          {
            // 当前月份
            month: new Date().getMonth() + 1,
            // 当前日（今天）
            monthDay: [new Date().getDate()]
          }
        ],
        // 今天
        startDate: CommonUtil.dateFmt(ApplicationFinalConst.dateTypeDay, new Date()),
        // 今天
        endDate: CommonUtil.dateFmt(ApplicationFinalConst.dateTypeDay, new Date()),
        // 节目中的fastdfsAddr地址
        fastdfsAddr: data.fastdfsAddr,
        // 节目总大小
        totalSize: data.programSize,
        // 播放时间  默认时间
        playTimes: [{
          playStartTime: '00:00',
          playEndTime: '23:59'
        }],
        program: [{
          playType: 0,
          playOrder: 0,
          type: data.programFileType,
          fileExt: data.mode,
          md5: data.md5,
          programId: data.programId,
          programPath: data.programPath,
          height: data.resolution.split('*')[1],
          width: data.resolution.split('*')[0],
          programName: data.programName,
          progSize: data.programSize,
          timespan: 86400,
          speed: '',
          displayLeft: '',
          displayRight: ''
        }]
      }
    });
    this.onAdjust(parameter);
  }

  /**
   * 切换上一条,下一条
   */
  public handlePrevChange(prevAndNext: boolean): void {
    let selectProgramIdIndex;
    this.programList.forEach((item, index) => {
      if (this.selectProgramId === item.programId) {
        selectProgramIdIndex = index;
      }
    });
    if (prevAndNext) {
      if (selectProgramIdIndex === 0) {
        this.$message.warning(this.language.frequentlyUsed.isFirst);
        return;
      }
    } else {
      if (selectProgramIdIndex >= this.programList.length - 1) {
        this.$message.warning(this.language.frequentlyUsed.isLast);
        return;
      }
    }
    this.selectProgramId = prevAndNext ? this.programList[selectProgramIdIndex - 1].programId : this.programList[selectProgramIdIndex + 1].programId;
    this.changeProgram();
  }
}
