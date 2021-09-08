import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {ApplicationService} from '../../share/service/application.service';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {RouterJumpConst} from '../../share/const/application-system.const';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {StatisticalChartModel} from '../../share/model/lighting.model';
import {ChartsConfig} from '../../share/config/charts-config';
import {ApplicationInterface} from '../../../../../assets/i18n/application/application.interface';
import {OnlineLanguageInterface} from '../../../../../assets/i18n/online/online-language.interface';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {CallListModel} from '../../share/model/call-list.model';
import {ContentListModel} from '../../share/model/content.list.model';
import {ReleasePolicyEnum, ReleaseTableEnum, InformationWorkBenchEnum} from '../../share/enum/auth.code.enum';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {TimeTypeEnum} from '../../share/enum/program.enum';
import {CallOperateTypeEnum, CallStatusEnum, CallTableEnum} from '../../share/enum/call.enum';
import {EquipmentTypeEnum, EquipmentStatusEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {EquipmentModel} from '../../share/model/equipment.model';
import {CallWebsocketImplService} from '../../../../core-module/call-websocket/call-websocket-impl.service';
import {WorkOrderIncreaseModel} from '../../../../core-module/model/application-system/work-order-increase.model';
import {ApplicationSystemForCommonService} from '../../../../core-module/api-service/application-system';
import {SelectDataConfig} from '../../share/config/select.data.config';
import {CallTimeMeterComponent} from '../../../../shared-module/component/business-component/application/call-time-meter/call-time-meter.component';
import {TargetTypeEnum} from '../../share/enum/policy.enum';

/**
 * 一键呼叫 工作台页面
 */
@Component({
  selector: 'app-call-workbench',
  templateUrl: './call-workbench.component.html',
  styleUrls: ['./call-workbench.component.scss']
})
export class CallWorkbenchComponent implements OnInit, OnDestroy {
  @ViewChild('callTimeMeter') callTimeMeter: CallTimeMeterComponent;
  /**
   * 便捷入口开关
   */
  public convenientEntranceSwitch: Boolean = false;
  /**
   * 列表请求参数
   */
  private queryCondition: QueryConditionModel = new QueryConditionModel();

  /**
   * 策略列表数据
   */
  public listData: CallListModel[] = [];
  public statusList = {};

  /**
   * 策略详情数据
   */
  public detailData: CallListModel;

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
  public inputValue: any;

  /**
   * 工单增量统计
   */
  public workOrderIncrement: object;

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
   * 告警分类时间
   */
  public alarmClassificationTime = {
    startAndEndTime: [CommonUtil.funDate(-365), CommonUtil.getCurrentTime()]
  };

  /**
   * 选中的节目ＩＤ
   */
  public selectProgramId: string;
  public selectEquipmentId: string;
  public selectEquipmentName: string;
  public selectSequenceId: string;
  public selectEquipmentModelType: string;
  public boxWidth = 500;
  public callData: any;
  public handleResize = _.debounce((event) => {
    this.calcWidth();
  }, 200);
  // 快捷入口展示的设备id
  public entranceEquipmentId: string;
// 下拉框
  public options = [];
  public selectIndex = 0;
  public showSearch: Boolean = true;
  public showPage: Boolean = true;
  /**
   * 节目地址
   */
  public programIdPath: string;
  /**
   * 国际化
   */
  public language: ApplicationInterface;
  // 表格多语言
  public onlineLanguage: OnlineLanguageInterface;
  /**
   * 是否是视屏
   */
  public isVideo: boolean = true;
  /**
   * 工作台权限码
   */
  public callOperateTypeEnum = CallOperateTypeEnum;
  public callStatusEnum = CallStatusEnum;
  public callTableEnum = CallTableEnum;
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
  /** 是否展示设备状态图表*/
  public isShowEquipmentStatus: boolean = false;
  /** 是否展示按钮*/
  public isShowBtn: boolean = false;
  /** 信息屏code码枚举*/
  public releasePolicyEnum = ReleasePolicyEnum;
  /** 设备列表code码枚举*/
  public releaseTableEnum = ReleaseTableEnum;
  /** 开关绑定值*/
  public radioValue: boolean;
  public isLISTEN: boolean = false;


  // 呼叫设备名称查询
  public searchValue: '';
  public wisdomPoles: number = 0; // 智慧杆数量
  public calls: number = 0; // 一键呼叫数量

  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  public equipmentStatusEnum = EquipmentStatusEnum;
  // 国际化语言枚举
  public languageEnum = LanguageEnum;
  // 是否有告警统计权限按当前告警权限来
  public isAlarmStatisticsRole: boolean = SessionUtil.checkHasRole('02-1');
  // 使用工单统计权限
  public isWorkOrderRole: boolean = SessionUtil.checkHasRole('07-3');
  // 控制工单增量统计图的显示
  public isWorkOrder: boolean = false;
  // 默认选中工单增量的筛选条件，默认按年统计
  public workOrderQueryType: number = 3;
  // 工单增量统计
  public workOrderData: object;
  // 工单增量
  public workOrderList;
  /**
   * 工作台权限码
   */
  public informationWorkBenchEnum = InformationWorkBenchEnum;
  /**
   * 地图搜索栏防抖
   */
  queryInputName = _.debounce((value) => {
    this.queryDeviceByName(value);
  }, 100, {leading: false, trailing: true});

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
    private callWebsocketImplService: CallWebsocketImplService,
    private $applicationSystemForCommonService: ApplicationSystemForCommonService,
  ) {
  }

  public ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.onlineLanguage = this.$nzI18n.getLocaleData(LanguageEnum.online);
    window.addEventListener('resize', this.handleResize);
    // 默认查询条件
    this.defaultQuery();
    this.onInitialization();
    // this.workOrderIncrementStatistics();
    this.queryEquipmentStatus();
    this.statisticsAlarmLevelType();
    this.queryCalls();
    this.queryWisdomPoles();
    // 工单增量统计
    if (this.isWorkOrderRole) {
      this.findApplyStatisticsByCondition(this.workOrderQueryType);
    }
  }

  /**
   * 列表初始化
   */
  private onInitialization(pageNum?): void {
    this.queryCondition.pageCondition = {
      pageNum: pageNum ? pageNum : 1,
      pageSize: 6
    };
    this.queryCondition.filterConditions = [];
    switch (this.selectIndex) {
      // 呼叫中
      case 1:
        this.showSearch = false;
        this.queryCondition.bizCondition = {
          queryStatus: [this.callStatusEnum.stateCall, this.callStatusEnum.stateCalling]
        };
        break;
      // 监听中
      case 2:
        this.queryCondition.bizCondition = {
          queryStatus: [this.callStatusEnum.stateListening, this.callStatusEnum.stateListen]
        };
        break;
      // 所有设备
      default:
        this.showSearch = true;
        this.queryCondition.bizCondition = {
          queryStatus: []
        };
    }
    this.$applicationService.callingEquipmentsByPage(this.queryCondition)
      .subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          if (!_.isEmpty(result.data)) {
            this.listData = _.cloneDeep(result.data);
            this.$applicationService.queryCallStatus([]).subscribe((res: ResultModel<any>) => {
              if (res.code === ResultCodeEnum.success) {
                this.statusList = res.data;
                // 将时间戳转化为时间  转化执行状态  转化策略类型
                this.listData.forEach(listItem => {
                  if (listItem.equipmentId === this.inputValue) {
                    this.selectSequenceId = listItem.sequenceId;
                    this.selectEquipmentId = listItem.equipmentId;
                    this.selectEquipmentName = listItem.equipmentName;
                    this.convenientEntranceSwitch = true;
                    this.detailData = listItem;
                    this.selectEquipmentModelType = this.detailData.equipmentModelType;
                    // 给列表加上状态 来显示样式(是否被选中)
                    listItem.state = true;
                  } else if (listItem.equipmentId === this.selectEquipmentId) {
                    this.selectSequenceId = listItem.sequenceId;
                    this.selectEquipmentId = listItem.equipmentId;
                    this.selectEquipmentName = listItem.equipmentName;
                    this.convenientEntranceSwitch = true;
                    this.detailData = listItem;
                    this.selectEquipmentModelType = this.detailData.equipmentModelType;
                    // 给列表加上状态 来显示样式(是否被选中)
                    listItem.state = true;
                  } else {
                    listItem.state = false;
                  }
                  if (this.statusList) {
                    for (let i in this.statusList) {
                      if (listItem.equipmentId === i) {
                        const statusItem = this.statusList[i];
                        if (statusItem.equipment_status === this.callStatusEnum.stateCalling
                          || statusItem.equipment_status === this.callStatusEnum.stateCall) {
                          if (statusItem.is_host === '0') {
                            listItem.callStatus = this.callStatusEnum.stateCalled;
                          } else {
                            listItem.callStatus = this.callStatusEnum.stateCalling;
                          }
                        } else if (statusItem.equipment_status === this.callStatusEnum.stateListen
                          || statusItem.equipment_status === this.callStatusEnum.stateListening) {
                          if (statusItem.is_host === '0') {
                            listItem.callStatus = this.callStatusEnum.stateListened;
                          } else {
                            listItem.callStatus = this.callStatusEnum.stateListening;
                          }
                        } else {
                          listItem.callStatus = statusItem.equipment_status;
                        }
                      }
                    }
                  }
                  // 设置状态样式
                  const iconStyle = CommonUtil.getEquipmentStatusIconClass(listItem.equipmentStatus, 'list');
                  listItem.statusIconClass = iconStyle.iconClass;
                  listItem.statusColorClass = iconStyle.colorClass;
                  // 获取设备类型的图标
                  listItem.iconClass = CommonUtil.getEquipmentTypeIcon(listItem);
                });
                // 分页
                this.showPage = true;
                this.paging.Total = result.totalCount;
                this.paging.pageIndex = result.pageNum;
                this.paging.pageSize = result.size;
                this.paging.totalPage = result.totalPage;
              }
            });
          } else {
            this.listData = [];
            this.paging = {Total: 0, pageIndex: 1, pageSize: 6, totalPage: 0};
            this.showPage = false;
          }
        } else {
          this.$message.error(result.msg);
        }
      });

  }

  /**
   *  查询空闲一键呼叫数量
   */
  queryCalls() {
    this.queryCondition.filterConditions = [{
      filterValue: ['E030'],
      filterField: 'equipmentType',
      operator: 'in'
    }];
    this.$applicationService.equipmentListByPage(this.queryCondition)
      .subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          this.calls = result.totalCount;
        } else {
          this.$message.error(result.msg);
        }
      }, function () {

      });
  }

  /**
   *  查询智慧杆数量
   */
  queryWisdomPoles() {
    this.queryCondition.filterConditions = [{
      filterValue: ['D002'],
      filterField: 'deviceType',
      operator: 'in'
    }];
    this.$applicationService.querydeviceList(this.queryCondition)
      .subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          this.wisdomPoles = result.totalCount;
        } else {
          this.$message.error(result.msg);
        }
      }, function () {

      });
  }


  /**
   * 搜索
   */
  searchChange(id) {
    this.queryCondition.filterConditions = [{
      filterValue: [id],
      filterField: 'equipmentId',
      operator: 'in'
    }];
    this.onInitialization();
  }

  /**
   * 跳转到设备列表
   */
  public onGoEquipmentList(): void {
    this.$router.navigate(['business/application/call/equipment-list'], {}).then();
  }

  /**
   * 展示便捷入口
   * @param option 被选中的数据下标
   * @param event 鼠标事件
   */
  public handShowConvenient(event: MouseEvent, option: CallListModel): void {
    if (event) {
      event.stopPropagation();
    }
    const callTime = JSON.parse(sessionStorage.getItem('callTime'));
    if (option.state === true) {
      // option.state = false;
      // 取消选择时  如果取消选择的那个设备是正在对讲的设备`
      if (callTime && callTime.callingId && this.callTimeMeter.equipmentId === callTime.callingId) {
        // 取消选择  存储数据
        this.callData = {
          equipmentId: this.callTimeMeter.equipmentId,
          sequenceId: this.callTimeMeter.sequenceId,
          equipmentModelType: this.callTimeMeter.equipmentModelType,
          calltype: this.callTimeMeter.calltype,
          hangupEnable: this.callTimeMeter.hangupEnable,
          isCall: this.callTimeMeter.isCall,
          isListening: this.callTimeMeter.isListening,
          callingId: this.callTimeMeter.callingId,
        };
        sessionStorage.setItem('callData', JSON.stringify(this.callData));
      }
      // this.convenientEntranceSwitch = false;
      return;
    }
    this.convenientEntranceSwitch = true;
    this.calcWidth();
    // 重置列表的状态
    this.listData.forEach(listItem => {
      listItem.state = false;
    });
    // 被选中的状态改为true
    option.state = true;
    // 将详情中的已选节目ID  和地址置空
    this.selectEquipmentId = null;
    this.selectEquipmentName = null;
    this.selectSequenceId = null;
    this.selectEquipmentModelType = null;
    this.selectProgramId = null;
    this.inputValue = null;
    this.programList = [];
    this.detailData = option;
    this.entranceEquipmentId = option.equipmentId;
    this.selectProgramId = option.equipmentId;
    this.selectEquipmentId = option.equipmentId;
    this.selectEquipmentName = option.equipmentName;
    this.selectSequenceId = option.sequenceId;
    this.selectEquipmentModelType = option.equipmentModelType;
    // 选中设备时，如果选中的设备是正在通话的设备，则赋值
    if (callTime && callTime.callingId && this.selectEquipmentId === callTime.callingId) {
      this.callData = JSON.parse(sessionStorage.getItem('callData'));
    }
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
    this.onInitialization(this.queryCondition.pageCondition.pageNum);
  }

  /**
   *
   * 跳转设备详情
   */
  public callDetails(data: CallListModel): void {
    this.$router.navigate([`${RouterJumpConst.callDetails}`], {
      queryParams: {
        equipmentId: data.equipmentId,
        equipmentType: data.equipmentType,
        equipmentModel: data.equipmentModel,
        equipmentStatus: data.equipmentStatus,
        equipmentModelType: data.equipmentModelType,
        sequenceId: data.sequenceId,
      }
    }).then();
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
      equipmentTypes: ['E030']
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
          filterValue: [TargetTypeEnum.oneTouchCalling]
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
   * 搜索input回车事件
   */
  public keyUpEvent(evt): void {
    if (evt.code === 'Enter') {
      if (!this.inputValue) {
        this.$message.warning(this.language.callWorkbench.equipmentSearch);
        this.selectSequenceId = null;
        return;
      } else {
        if (!this.options.length) {
          this.$message.warning(this.language.callWorkbench.noDevice);
        } else {
          this.searchChange(this.inputValue);
        }
      }
    }
  }

  /**
   * 监听input
   */
  public onInput(value: string): void {
    this.selectSequenceId = null;
    this.selectEquipmentId = null;
    const _value = value.trim();
    if (!_value) {
      this.options = [];
    } else {
      this.queryInputName(_value);
    }
  }

  /**
   * 设施/设备名称模糊查询
   */
  public queryDeviceByName(value): void {
    if (value && value !== '') {
      const body = {
        filterConditions: [
          {
            filterField: 'equipmentName',
            operator: 'like',
            filterValue: value
          }
        ],
        pageCondition: {
          pageNum: 1,
          pageSize: 100
        }
      };
      this.$applicationService.callingEquipmentsByPage(body).subscribe((result: ResultModel<any>) => {
        this.options = result.data;
      });
    }
  }

  /**
   * 下拉框事件
   */
  public optionChange(event, option): void {
    option.state = false;
    this.selectSequenceId = option.sequenceId;
    this.handShowConvenient(null, option);
    this.searchChange(option.equipmentId);
  }

  call() {
    if (!this.inputValue) {
      this.$message.warning(this.language.callWorkbench.equipmentSearch);
    } else {
      if (!this.selectSequenceId) {
        this.$message.warning(this.language.callWorkbench.noDevice);
        return;
      } else {
        this.calcWidth();
        this.callTimeMeter.onCallOperate(this.callOperateTypeEnum.CALL, this.callTableEnum.primaryCallKey);
        // this.callWebsocketImplService.inviteCommand(this.selectSequenceId);
      }
    }
  }

  selectedIndexChange(event) {
    if (event === 0) {
      this.showSearch = true;
    } else {
      this.showSearch = false;
    }
    this.selectIndex = event;
    this.listData = [];
    // this.convenientEntranceSwitch = false;
    this.inputValue = null;
    this.options = [];
    this.onInitialization();
  }

  /**
   * 工单增量统计
   */
  public findApplyStatisticsByCondition(type: number): void {
    const params = {
      statisticalType: type.toString()
    };
    this.$applicationSystemForCommonService.findApplyAKeyToCallStatisticsByCondition(params).subscribe((result: ResultModel<WorkOrderIncreaseModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        if (result.data && result.data.length) {
          this.isWorkOrder = false;
          if (type === 3) {
            result.data.forEach(item => {
              item.formatDate = `${parseInt(item.formatDate, 10)}${this.language.electricityDate.month}`;
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
   * 工单增量按最近一年/30天/7天
   *
   */
  public handleChangeWorkOrder(event): void {
    this.workOrderQueryType = event;
    this.findApplyStatisticsByCondition(event);
  }

  /**
   * 默认查询
   */
  public defaultQuery(): void {
    // 工单默认查询条件
    this.workOrderList = SelectDataConfig.workOrderData(this.language);
  }

  public calcWidth() {
    const id = document.getElementById('entranceBox');
    this.boxWidth = id.clientWidth - 32;
  }
  /**
   * 跳转告警页面
   */
  public goToAlarm(): void {
    this.$router
      .navigate([`business/alarm/current-alarm`], {
        queryParams: { alarmSourceTypeId: TargetTypeEnum.oneTouchCalling },
      })
      .then()
  }

  /**
   * 销毁
   */
  public ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleResize);
  }
}
