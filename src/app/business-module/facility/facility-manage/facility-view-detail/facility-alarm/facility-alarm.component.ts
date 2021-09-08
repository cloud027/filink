import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {QueryConditionModel} from '../../../../../shared-module/model/query-condition.model';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {AlarmStoreService} from '../../../../../core-module/store/alarm.store.service';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../shared-module/component/form/form-operate.service';
import {RuleUtil} from '../../../../../shared-module/util/rule-util';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {TabSetEnum} from '../../../../../core-module/enum/tab-set.enum';
import {TimeItemModel} from '../../../../../core-module/model/equipment/time-item.model';
import {DateTypeEnum} from '../../../../../shared-module/enum/date-type.enum';
import {HandelAlarmUtil} from '../../../../../shared-module/util/handel-alarm-util';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {SessionUtil} from '../../../../../shared-module/util/session-util';
import {DeviceChartUntil} from '../../../../../shared-module/util/device-chart-until';
import {AlarmListModel} from '../../../../../core-module/model/alarm/alarm-list.model';
import {AlarmLevelStatisticsModel} from '../../../../../core-module/model/alarm/alarm-level-statistics.model';
import {AlarmNameStatisticsModel} from '../../../../../core-module/model/alarm/alarm-name-statistics.model';
import {AlarmTypeEnum} from '../../../../../core-module/enum/equipment/equipment.enum';
import {AlarmForCommonService} from '../../../../../core-module/api-service/alarm';
import {FacilityApiService} from '../../../share/service/facility/facility-api.service';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {AlarmCleanStatusEnum} from '../../../../../core-module/enum/alarm/alarm-clean-status.enum';
import {AlarmLevelEnum} from '../../../../../core-module/enum/alarm/alarm-level.enum';
import {QueryFacilityParamsModel} from '../../../../../core-module/model/facility/query-facility-params.model';
import {AlarmSourceIncrementalModel} from '../../../../../core-module/model/alarm/alarm-source-incremental.model';
import {AlarmClearAffirmModel} from '../../../../../core-module/model/alarm/alarm-clear-affirm.model';

/**
 * 设施详情告警板块组件
 */
@Component({
  selector: 'app-facility-alarm',
  templateUrl: './facility-alarm.component.html',
  styleUrls: ['./facility-alarm.component.scss']
})
export class FacilityAlarmComponent implements OnInit {
  // 设施id
  @Input() public deviceId: string;
  // 告警级别
  @ViewChild('alarmLevelTemp') public alarmLevelTemp: TemplateRef<HTMLDocument>;
  // 期望完工时间
  @ViewChild('ecTimeTemp') public ecTimeTemp: TemplateRef<HTMLDocument>;
  // 当前告警饼图配置
  public chartOption = {};
  // 当前告警环图配置
  public ringOption = {};
  // 历史告警环图配置
  public ringOptionHistory = {};
  // 告警增量配置
  public columnarOption = {};
  // 历史告警饼图配置
  public chartOptionHistory = {};
  // 列表配置
  public tableConfig: TableConfigModel;
  // 列表数据
  public dataSet: AlarmListModel[] = [];
  // 查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 告警语言包
  public language: AlarmLanguageInterface;
  // 公共语言包
  public commonLanguage: CommonLanguageInterface;
  // 设施语言包
  public facilityLanguage: FacilityLanguageInterface;
  // 历史告警数据
  public dataSetHistory: AlarmListModel[] = [];
  // 历史告警配置
  public tableConfigH: TableConfigModel;
  // 备注表单
  public formColumnRemark: FormItem[] = [];
  // 表单状态
  public formStatus: FormOperate;
  // 备注表单状态
  public formStatusRemark: FormOperate;
  // 创建工单显示隐藏
  public creationWorkOrder: boolean;
  // 创建工单的数据
  public creationWorkOrderData: AlarmListModel;
  // 是否加载
  public isLoading: boolean;
  // 备注显示隐藏
  public remarkTable = false;
  // 时间选择器数据
  public timeList: Array<TimeItemModel> = [];
  // 时间选择器默认值
  public dateType: DateTypeEnum;
  // 页面是否加载
  public pageLoading = false;
  // 告警创建工单区域id
  public areaId: string | number;
  // 当前tab下表
  public tabIndex = TabSetEnum.one;
  // 当前数据
  private alarmListModel: AlarmListModel;
  // 告警类型
  private alarmType: AlarmTypeEnum;

  constructor(public $nzI18n: NzI18nService,
              public $message: FiLinkModalService,
              public $alarmStoreService: AlarmStoreService,
              public $alarmService: AlarmForCommonService,
              private $facilityApiService: FacilityApiService,
              private $modal: NzModalService,
              private $ruleUtil: RuleUtil,
              private $alarmUtil: HandelAlarmUtil,
              private $router: Router) {
  }

  public ngOnInit(): void {
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.facilityLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.initTableConfig();
    this.refreshData();
    this.refreshHistory();
    this.initRemarkForm();
    // 初始化时间选择器列表
    this.timeList = [{
      label: this.language.oneWeek,
      value: DateTypeEnum.oneWeek
    }, {
      label: this.language.oneMonth,
      value: DateTypeEnum.oneMonth
    }, {
      label: this.language.threeMonth,
      value: DateTypeEnum.threeMonth
    }];
    this.dateType = this.timeList[0].value;

  }

  /**
   * 判断是否有操作权限
   */
  public checkHasRole(code: string): boolean {
    return SessionUtil.checkHasRole(code);
  }

  /**
   * 获取当前告警列表信息
   */
  public refreshData(): void {
    this.refreshCommon('queryAlarmDeviceId', this.dataSet, this.tableConfig);
  }

  /**
   * 刷新历史告警列表
   */
  public refreshHistory(): void {
    this.refreshCommon('queryAlarmHistoryDeviceId', this.dataSetHistory, this.tableConfigH);
  }

  /**
   * 清除告警
   * param params
   */
  public clearAlarm(params: { id: string, alarmSource: string }[]): void {
    const alarmClearParams = new AlarmClearAffirmModel(params, []);
    this.$alarmService.updateAlarmCleanStatus(alarmClearParams).subscribe((res: ResultModel<string>) => {
      if (res.code === 0) {
        this.$message.success(res.msg);
        this.refreshData();
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 表单状态
   * param event
   */
  public formInstanceRemark(event: {instance: FormOperate}): void {
    this.formStatusRemark = event.instance;
  }

  /**
   * 初始化remark
   */
  public initRemarkForm(): void {
    this.formColumnRemark = [
      {
        label: this.facilityLanguage.remarks, key: 'remarks', type: 'textarea',
        col: 24,
        width: 500,
        labelWidth: 76,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()]
      }
    ];
  }

  /**
   * 修改备注
   */
  public updateAlarmRemark(): void {
    const data = [{id: this.alarmListModel.id, remark: this.formStatusRemark.getData('remarks') || null}];
    let reqMethod, refreshMethod;
    if (this.alarmType === AlarmTypeEnum.history) {
      reqMethod = 'updateHistoryAlarmRemark';
      refreshMethod = 'refreshHistory';
    } else {
      reqMethod = 'updateAlarmRemark';
      refreshMethod = 'refreshData';
    }
    this.isLoading = true;
    this.$alarmService[reqMethod](data).subscribe((res: ResultModel<string>) => {
      this.remarkTable = false;
      if (res.code === ResultCodeEnum.success) {
        this[refreshMethod]();
        this.isLoading = false;
        this.$message.success(res.msg);
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 跳转到对应的告警页面
   * param url
   */
  public navigatorTo(tabIndex: TabSetEnum): void {
    let url: string;
    if (tabIndex === TabSetEnum.one) {
      url = '/business/alarm/current-alarm';
    } else {
      url = '/business/alarm/history-alarm';
    }
    this.$router.navigate([url], {queryParams: {deviceId: this.deviceId}}).then();
  }

  /**
   * 日期选择回调
   * param event
   */
  public changeFilter(event: {startTime: number, endTime: number}): void {
    this.pageLoading = true;
    const body = new QueryFacilityParamsModel(this.deviceId, new Date(event.startTime).getTime(), new Date(event.endTime).getTime());
    this.currentLevelStatistics(body);
    this.historyLevelStatistics(body);
    this.currentSourceNameStatistics(body);
    this.historySourceNameStatistics(body);
    this.queryAlarmSourceIncremental(body);
  }

  /**
   * 设施统计当前告警级别信息
   */
  public currentLevelStatistics(body: QueryFacilityParamsModel): void {
    this.$alarmService.currentLevelStatistics(body).subscribe(
      (result: ResultModel<AlarmLevelStatisticsModel>) => {
        this.pageLoading = false;
        if (result.code === 0) {
          const data = this.$alarmUtil.handleAlarmLevelData(result).data;
          const color = this.$alarmUtil.handleAlarmLevelData(result).color;
          // 当前告警饼图配置
          this.chartOption = DeviceChartUntil.setAlarmLevelStatisticsChartOption(this.language.currentAlarm, data, color);
        }
      }, () => {
        this.pageLoading = false;
      });
  }

  /**
   * 设施统计历史告警级别信息
   */
  public historyLevelStatistics(body: QueryFacilityParamsModel): void {
    this.$alarmService.historyLevelStatistics(body).subscribe((result: ResultModel<AlarmLevelStatisticsModel>) => {
      this.pageLoading = false;
      if (result.code === 0) {
        const data = this.$alarmUtil.handleAlarmLevelData(result).data;
        const color = this.$alarmUtil.handleAlarmLevelData(result).color;
        this.chartOptionHistory = DeviceChartUntil.setAlarmLevelStatisticsChartOption(this.language.historyAlarm, data, color);
      }
    }, () => {
      this.pageLoading = false;
    });
  }

  /**
   * 设施统计当前告警名称信息
   */
  public currentSourceNameStatistics(body: QueryFacilityParamsModel): void {
    this.commonSourceNameStatistics(body, 'currentSourceNameStatistics', 'currentAlarm');
  }

  /**
   * 设施统计历史告警名称信息
   */
  public historySourceNameStatistics(body: QueryFacilityParamsModel): void {
    this.commonSourceNameStatistics(body, 'historySourceNameStatistics', 'historyAlarm');
  }

  /**
   * 资源名称统计公共方法
   */
  private commonSourceNameStatistics(body: QueryFacilityParamsModel,
                                     apiName: string, alarmName: string): void {
    this.$alarmService[apiName](body)
      .subscribe((result: ResultModel<AlarmNameStatisticsModel[]>) => {
        this.pageLoading = false;
        if (result.code === 0) {
          let alarmArr = [];
          if (!_.isEmpty(result.data)) {
            alarmArr = result.data.map(row => {
              return {
                name: row.name, value: row.count
              };
            });
          } else {
            alarmArr = [{name: '', value: 0}];
          }
          if (alarmName === 'currentAlarm') {
            this.ringOption = DeviceChartUntil.setAlarmNameStatisticsChartOption(this.language[alarmName], alarmArr);
          } else {
            this.ringOptionHistory = DeviceChartUntil.setAlarmNameStatisticsChartOption(this.language[alarmName], alarmArr);
          }

        }
      }, () => {
        this.pageLoading = false;
      });
  }

  /**
   * 查询告警增量
   * param body
   */
  public queryAlarmSourceIncremental(body: QueryFacilityParamsModel): void {
    this.$alarmService.queryAlarmSourceIncremental(body).subscribe((result: ResultModel<AlarmSourceIncrementalModel[]>) => {
      this.pageLoading = false;
      if (result.code === 0) {
        let data = result.data || [];
        data = data.sort((a, b) => {
          if (+new Date(a.groupTime) - (+new Date(b.groupTime)) > 0) {
            return 1;
          } else {
            return -1;
          }
        });
        const seriesData = [];
        data.forEach(item => {
          seriesData.push([item.groupTime, item.count]);
        });
        this.columnarOption = DeviceChartUntil.setAlarmSourceIncrementalChartOption(seriesData);
      }
    }, () => {
      this.pageLoading = false;
    });
  }



  /**
   * 刷新数据公共方法
   * @param apiName string
   * @param dataSet AlarmListModel[]
   */
  private refreshCommon(apiName: string, data: AlarmListModel[], tableConfig: TableConfigModel): void {
    tableConfig.isLoading = true;
    this.$facilityApiService[apiName](this.deviceId).subscribe((res: ResultModel<AlarmListModel[]>) => {
      tableConfig.isLoading = false;
      if (res.code === ResultCodeEnum.success || res.code === 0) {
        data = res.data || [];
        data.forEach(item => {
          // 设置告警清除状态
          item.alarmCleanStatus = CommonUtil.codeTranslate(AlarmCleanStatusEnum, this.$nzI18n, item.alarmCleanStatus) as string;
          if (item.alarmFixedLevel) {
            item.alarmLevelName = CommonUtil.codeTranslate(AlarmLevelEnum, this.$nzI18n, item.alarmFixedLevel, LanguageEnum.alarm) as string;
            item.style = this.$alarmStoreService.getAlarmColorByLevel(item.alarmFixedLevel);
          }
        });
        if (apiName === 'queryAlarmDeviceId') {
          this.dataSet = data;
        } else {
          this.dataSetHistory = data;
        }
      }
    }, () => {
      tableConfig.isLoading = false;
    });
  }

  private initTableConfig(): void {
    const columnConfig = [
      {
        title: this.language.alarmName, key: 'alarmName', width: 100
      },
      {
        title: this.language.alarmFixedLevel, key: 'alarmFixedLevel', width: 120,
        type: 'render',
        renderTemplate: this.alarmLevelTemp,
      },
      {
        title: this.language.alarmHappenCount, key: 'alarmHappenCount', width: 100,
      },
      {
        title: this.language.alarmCleanStatus, key: 'alarmCleanStatus', width: 100,
      },
      {
        title: this.language.alarmCleanPeopleNickname, key: 'alarmCleanPeopleNickname', width: 100,
      },
      {
        title: this.language.alarmNearTime, key: 'alarmNearTime', width: 200, pipe: 'date',
      },
      {
        title: this.language.alarmCleanTime, key: 'alarmCleanTime', width: 200, pipe: 'date',
      },
      {
        title: this.language.alarmAdditionalInformation, key: 'extraMsg', width: 200,
      },
      {
        title: this.language.alarmobject, key: 'alarmObject', width: 120,
      },
      {
        title: this.language.remark, key: 'remark', width: 200,
      },
    ];
    const config = {
      noIndex: true,
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: false,
      scroll: {x: '1366px', y: '600px'},
      columnConfig: columnConfig,
      showPagination: false,
      bordered: false,
      searchReturnType: 'object',
      leftBottomButtons: [],
    };
    this.tableConfig = Object.assign({
      operation: [
        {
          text: this.language.alarmClean,
          permissionCode: '02-1-2',
          className: 'fiLink-clear',
          needConfirm: true,
          confirmContent: this.language.alarmAffirmClear,
          handle: (item: AlarmListModel) => {
            const params = [{id: item.id, alarmSource: item.alarmSource}];
            this.clearAlarm(params);
          }
        },
        {
          text: this.language.updateRemark,
          permissionCode: '02-1-4',
          className: 'fiLink-edit',
          handle: (alarmListModel: AlarmListModel) => {
            this.remarkTable = true;
            this.formStatusRemark.resetData({remarks: alarmListModel.remark});
            this.alarmListModel = alarmListModel;
            this.alarmType = AlarmTypeEnum.current;
          }
        },
        {
          text: this.language.buildOrder,
          permissionCode: '06-2-1-1',
          className: 'fiLink-create',
          handle: (alarmListModel: AlarmListModel) => {
            this.creationWorkOrder = true;
            this.areaId = alarmListModel.areaId;
            this.alarmType = AlarmTypeEnum.current;
            this.creationWorkOrderData = alarmListModel;
          }
        }
      ],
    }, config);
    this.tableConfig.columnConfig = this.tableConfig.columnConfig.concat([
      {title: this.language.operate, key: '', width: 200, fixedStyle: {fixedRight: true, style: {right: '0px'}}}
    ]);
    this.tableConfigH = Object.assign({}, config);
  }
}
