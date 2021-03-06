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
 * ???????????? ???????????????
 */
@Component({
  selector: 'app-call-workbench',
  templateUrl: './call-workbench.component.html',
  styleUrls: ['./call-workbench.component.scss']
})
export class CallWorkbenchComponent implements OnInit, OnDestroy {
  @ViewChild('callTimeMeter') callTimeMeter: CallTimeMeterComponent;
  /**
   * ??????????????????
   */
  public convenientEntranceSwitch: Boolean = false;
  /**
   * ??????????????????
   */
  private queryCondition: QueryConditionModel = new QueryConditionModel();

  /**
   * ??????????????????
   */
  public listData: CallListModel[] = [];
  public statusList = {};

  /**
   * ??????????????????
   */
  public detailData: CallListModel;

  /**
   * ????????????????????????
   */
  public programLaunchQuantity: object;

  /**
   * ????????????
   */
  public equipmentStatusData: object;

  /**
   * ????????????
   */
  public alarmClassification: object;

  /**
   * ??????????????????
   */
  public duration: any;
  public inputValue: any;

  /**
   * ??????????????????
   */
  public workOrderIncrement: object;

  /**
   * ??????
   * Total
   */
  public paging = {Total: 0, pageIndex: 1, pageSize: 6, totalPage: 0};

  /**
   * ??????????????????
   */
  public workOrderIncrementTime = {
    startAndEndTime: [CommonUtil.funDate(-365), CommonUtil.getCurrentTime()]
  };
  /**
   * ????????????????????????
   */
  public programLaunchQuantityTime = {
    startAndEndTime: [CommonUtil.funDate(-365), CommonUtil.getCurrentTime()]
  };
  /**
   * ??????????????????
   */
  public alarmClassificationTime = {
    startAndEndTime: [CommonUtil.funDate(-365), CommonUtil.getCurrentTime()]
  };

  /**
   * ?????????????????????
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
  // ???????????????????????????id
  public entranceEquipmentId: string;
// ?????????
  public options = [];
  public selectIndex = 0;
  public showSearch: Boolean = true;
  public showPage: Boolean = true;
  /**
   * ????????????
   */
  public programIdPath: string;
  /**
   * ?????????
   */
  public language: ApplicationInterface;
  // ???????????????
  public onlineLanguage: OnlineLanguageInterface;
  /**
   * ???????????????
   */
  public isVideo: boolean = true;
  /**
   * ??????????????????
   */
  public callOperateTypeEnum = CallOperateTypeEnum;
  public callStatusEnum = CallStatusEnum;
  public callTableEnum = CallTableEnum;
  /**
   * ????????????
   */
  public programList: ContentListModel[] = [];
  /** ??????????????????????????????*/
  public isShowWorkOrder: boolean = false;
  /** ??????????????????????????????????????????*/
  public isShowProgramLaunch: boolean = false;
  /** ????????????????????????????????????*/
  public isShowDuration: boolean = false;
  /** ??????????????????????????????????????????*/
  public isShowAlarmClassification: boolean = false;
  /** ??????????????????????????????*/
  public isShowEquipmentStatus: boolean = false;
  /** ??????????????????*/
  public isShowBtn: boolean = false;
  /** ?????????code?????????*/
  public releasePolicyEnum = ReleasePolicyEnum;
  /** ????????????code?????????*/
  public releaseTableEnum = ReleaseTableEnum;
  /** ???????????????*/
  public radioValue: boolean;
  public isLISTEN: boolean = false;


  // ????????????????????????
  public searchValue: '';
  public wisdomPoles: number = 0; // ???????????????
  public calls: number = 0; // ??????????????????

  // ??????????????????
  public equipmentTypeEnum = EquipmentTypeEnum;
  public equipmentStatusEnum = EquipmentStatusEnum;
  // ?????????????????????
  public languageEnum = LanguageEnum;
  // ???????????????????????????????????????????????????
  public isAlarmStatisticsRole: boolean = SessionUtil.checkHasRole('02-1');
  // ????????????????????????
  public isWorkOrderRole: boolean = SessionUtil.checkHasRole('07-3');
  // ????????????????????????????????????
  public isWorkOrder: boolean = false;
  // ????????????????????????????????????????????????????????????
  public workOrderQueryType: number = 3;
  // ??????????????????
  public workOrderData: object;
  // ????????????
  public workOrderList;
  /**
   * ??????????????????
   */
  public informationWorkBenchEnum = InformationWorkBenchEnum;
  /**
   * ?????????????????????
   */
  queryInputName = _.debounce((value) => {
    this.queryDeviceByName(value);
  }, 100, {leading: false, trailing: true});

  /**
   * @param $router ??????????????????
   * @param $applicationService ??????????????????
   * @param $nzI18n ??????????????????
   * @param $message ??????????????????
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
    // ??????????????????
    this.defaultQuery();
    this.onInitialization();
    // this.workOrderIncrementStatistics();
    this.queryEquipmentStatus();
    this.statisticsAlarmLevelType();
    this.queryCalls();
    this.queryWisdomPoles();
    // ??????????????????
    if (this.isWorkOrderRole) {
      this.findApplyStatisticsByCondition(this.workOrderQueryType);
    }
  }

  /**
   * ???????????????
   */
  private onInitialization(pageNum?): void {
    this.queryCondition.pageCondition = {
      pageNum: pageNum ? pageNum : 1,
      pageSize: 6
    };
    this.queryCondition.filterConditions = [];
    switch (this.selectIndex) {
      // ?????????
      case 1:
        this.showSearch = false;
        this.queryCondition.bizCondition = {
          queryStatus: [this.callStatusEnum.stateCall, this.callStatusEnum.stateCalling]
        };
        break;
      // ?????????
      case 2:
        this.queryCondition.bizCondition = {
          queryStatus: [this.callStatusEnum.stateListening, this.callStatusEnum.stateListen]
        };
        break;
      // ????????????
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
                // ???????????????????????????  ??????????????????  ??????????????????
                this.listData.forEach(listItem => {
                  if (listItem.equipmentId === this.inputValue) {
                    this.selectSequenceId = listItem.sequenceId;
                    this.selectEquipmentId = listItem.equipmentId;
                    this.selectEquipmentName = listItem.equipmentName;
                    this.convenientEntranceSwitch = true;
                    this.detailData = listItem;
                    this.selectEquipmentModelType = this.detailData.equipmentModelType;
                    // ????????????????????? ???????????????(???????????????)
                    listItem.state = true;
                  } else if (listItem.equipmentId === this.selectEquipmentId) {
                    this.selectSequenceId = listItem.sequenceId;
                    this.selectEquipmentId = listItem.equipmentId;
                    this.selectEquipmentName = listItem.equipmentName;
                    this.convenientEntranceSwitch = true;
                    this.detailData = listItem;
                    this.selectEquipmentModelType = this.detailData.equipmentModelType;
                    // ????????????????????? ???????????????(???????????????)
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
                  // ??????????????????
                  const iconStyle = CommonUtil.getEquipmentStatusIconClass(listItem.equipmentStatus, 'list');
                  listItem.statusIconClass = iconStyle.iconClass;
                  listItem.statusColorClass = iconStyle.colorClass;
                  // ???????????????????????????
                  listItem.iconClass = CommonUtil.getEquipmentTypeIcon(listItem);
                });
                // ??????
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
   *  ??????????????????????????????
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
   *  ?????????????????????
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
   * ??????
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
   * ?????????????????????
   */
  public onGoEquipmentList(): void {
    this.$router.navigate(['business/application/call/equipment-list'], {}).then();
  }

  /**
   * ??????????????????
   * @param option ????????????????????????
   * @param event ????????????
   */
  public handShowConvenient(event: MouseEvent, option: CallListModel): void {
    if (event) {
      event.stopPropagation();
    }
    const callTime = JSON.parse(sessionStorage.getItem('callTime'));
    if (option.state === true) {
      // option.state = false;
      // ???????????????  ?????????????????????????????????????????????????????????`
      if (callTime && callTime.callingId && this.callTimeMeter.equipmentId === callTime.callingId) {
        // ????????????  ????????????
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
    // ?????????????????????
    this.listData.forEach(listItem => {
      listItem.state = false;
    });
    // ????????????????????????true
    option.state = true;
    // ???????????????????????????ID  ???????????????
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
    // ???????????????????????????????????????????????????????????????????????????
    if (callTime && callTime.callingId && this.selectEquipmentId === callTime.callingId) {
      this.callData = JSON.parse(sessionStorage.getItem('callData'));
    }
  }

  /**
   * @param type ?????? left????????????????????? right:??????????????????   * ????????????
   */
  public onPagingChange(type: string): void {
    if (type === 'left') {
      // ?????????????????????????????????????????????  ?????????return
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
   * ??????????????????
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
   * ??????????????????
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
          // ??????:???
          workOrderIncrement.company = `${this.language.frequentlyUsed.unit}:${this.language.frequentlyUsed.piece}`;
          this.workOrderIncrement = ChartsConfig.workOrderIncrement(workOrderIncrement, 'workOrderIncrement', this.language);
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * ??????????????????
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
   * ????????????????????????
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
      // ???????????????????????? ????????????????????????number0
      if (result.code === 0) {
        this.isShowAlarmClassification = !!(result.data);
        this.alarmClassification = ChartsConfig.alarmStatistics(result.data, this.$nzI18n);
      } else {
        this.$message.error(result.msg);
      }
    });
  }


  /**
   * ???????????????
   * @param time ??????
   * @param type start:???????????? end:????????????
   */
  public changeTime(time, type: string) {
    const timeString = CommonUtil.dateFmt('yyyy/MM/dd', new Date(time));
    const date = new Date(type === TimeTypeEnum.start ? `${timeString} 00:00:00` : `${timeString} 23:59:59`);
    return typeof date === 'string' ? Date.parse(date) : CommonUtil.getTimeStamp(date);
  }

  /**
   * ?????????????????????????????????
   * @param result ???????????????
   * @param field ??????
   */
  private processingData(result, field) {
    const statisticsData = _.cloneDeep(result.data || []);
    const returnData: StatisticalChartModel = {xData: [], data: [], isShow: false, company: ''};
    // ???????????????????????? ??????????????????false
    returnData.isShow = statisticsData.length !== 0;
    statisticsData.forEach(listItem => {
      returnData.xData.push(listItem.time);
      returnData.data.push(listItem[field]);
    });
    return returnData;
  }

  /**
   * ??????input????????????
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
   * ??????input
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
   * ??????/????????????????????????
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
   * ???????????????
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
   * ??????????????????
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
   * ???????????????????????????/30???/7???
   *
   */
  public handleChangeWorkOrder(event): void {
    this.workOrderQueryType = event;
    this.findApplyStatisticsByCondition(event);
  }

  /**
   * ????????????
   */
  public defaultQuery(): void {
    // ????????????????????????
    this.workOrderList = SelectDataConfig.workOrderData(this.language);
  }

  public calcWidth() {
    const id = document.getElementById('entranceBox');
    this.boxWidth = id.clientWidth - 32;
  }
  /**
   * ??????????????????
   */
  public goToAlarm(): void {
    this.$router
      .navigate([`business/alarm/current-alarm`], {
        queryParams: { alarmSourceTypeId: TargetTypeEnum.oneTouchCalling },
      })
      .then()
  }

  /**
   * ??????
   */
  public ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleResize);
  }
}
