import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {FiLinkModalService} from '../../../../service/filink-modal/filink-modal.service';
import {TimerSelectorService} from '../../../../service/time-selector/timer-selector.service';
import {AlarmForCommonService} from '../../../../../core-module/api-service/alarm';
import {AlarmStoreService} from '../../../../../core-module/store/alarm.store.service';
import {FacilityForCommonService} from '../../../../../core-module/api-service/facility';
import {PageModel} from '../../../../model/page.model';
import {TableConfigModel} from '../../../../model/table-config.model';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {QueryConditionModel, SortCondition} from '../../../../model/query-condition.model';
import {FormOperate} from '../../../form/form-operate.service';
import {FormItem} from '../../../form/form-config';
import {RuleUtil} from '../../../../util/rule-util';
import {ResultModel} from '../../../../model/result.model';
import {LanguageEnum} from '../../../../enum/language.enum';
import {PageSizeEnum} from '../../../../enum/page-size.enum';
import {TimeItemModel} from '../../../../../core-module/model/equipment/time-item.model';
import {DateTypeEnum} from '../../../../enum/date-type.enum';
import {DeviceChartUntil} from '../../../../util/device-chart-until';
import {CommonUtil} from '../../../../util/common-util';
import {HandelAlarmUtil} from '../../../../util/handel-alarm-util';
import {ResultCodeEnum} from '../../../../enum/result-code.enum';
import {SessionUtil} from '../../../../util/session-util';
import {QueryAlarmStatisticsModel} from '../../../../../core-module/model/alarm/query-alarm-statistics.model';
import {AlarmNameStatisticsModel} from '../../../../../core-module/model/alarm/alarm-name-statistics.model';
import {AlarmListModel} from '../../../../../core-module/model/alarm/alarm-list.model';
import {AlarmLevelStatisticsModel} from '../../../../../core-module/model/alarm/alarm-level-statistics.model';
import {AlarmSourceIncrementalModel} from '../../../../../core-module/model/alarm/alarm-source-incremental.model';
import {AlarmTypeEnum, StatisticsTypeEnum} from '../../../../../core-module/enum/equipment/equipment.enum';
import {AlarmCleanStatusEnum} from '../../../../../core-module/enum/alarm/alarm-clean-status.enum';
import {AlarmLevelEnum} from '../../../../../core-module/enum/alarm/alarm-level.enum';
import {AlarmClearAffirmModel} from '../../../../../core-module/model/alarm/alarm-clear-affirm.model';
/**
 * ????????????
 * created by PoHe
 */
@Component({
  selector: 'app-equipment-alarm',
  templateUrl: './equipment-alarm.component.html',
  styleUrls: ['./equipment-alarm.component.scss']
})
export class EquipmentAlarmComponent implements OnInit {
  // ????????????id
  @Input()
  public equipmentId: string = '';
  // ????????????
  @Input()
  public equipmentType: string = '';
  // ??????????????????
  @ViewChild('alarmFixedLevelTemp') public alarmFixedLevelTemp: TemplateRef<HTMLDocument>;
  // ??????????????????
  @ViewChild('isCleanTemp') public isCleanTemp: TemplateRef<HTMLDocument>;
  // ???????????????
  public language: AlarmLanguageInterface;
  // ?????????????????????
  public equipmentLanguage: FacilityLanguageInterface;
  // ???????????????
  public commonLanguage: CommonLanguageInterface;
  // ????????????????????????
  public currentAlarmDataSet: AlarmListModel[] = [];
  // ????????????
  public historyAlarmDataSet: AlarmListModel[] = [];
  // ??????????????????
  public pageBean: PageModel = new PageModel(PageSizeEnum.sizeFive);
  // ??????????????????????????????
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // ????????????
  public tableConfig: TableConfigModel;
  // ????????????????????????
  public historyTableConfig: TableConfigModel;
  // ??????????????????
  public pageLoading: boolean = false;
  // ????????????????????????
  public chartOption = {};
  // ????????????????????????
  public ringOption = {};
  // ??????????????????
  public columnarOption = {};
  // ????????????????????????
  public ringOptionHistory = {};
  // ????????????????????????
  public chartOptionHistory = {};
  // ?????????????????????
  public timeList: TimeItemModel[] = [];
  // ???????????????????????????????????????
  public saveButtonDisabled: boolean = true;
  // ????????????????????????
  public dateType: DateTypeEnum;
  // ????????????
  public alarmType: AlarmTypeEnum = AlarmTypeEnum.current;
  // ??????????????????
  public alarmTypeEnum = AlarmTypeEnum;
  // ??????????????????
  public currentAlarmData: AlarmListModel;
  // ??????????????????
  public remarkFormModal: boolean = false;
  // ???????????????????????????????????????
  public remarkFormSaveLoading: boolean = false;
  // ????????????
  public formColumnRemark: FormItem[] = [];
  // ?????????????????????????????????
  public creatWorkOrderShow: boolean = false;
  // ???????????????????????????id
  public areaId: string;
  // ??????????????????
  public createWorkOrderData: AlarmListModel = new AlarmListModel();
  // ??????????????????
  private formRemark: FormOperate;


  /**
   * ?????????
   */
  constructor(
    private $nzI18n: NzI18nService,
    public $message: FiLinkModalService,
    public $timeSelectorService: TimerSelectorService,
    private $ruleUtil: RuleUtil,
    private $alarmUtil: HandelAlarmUtil,
    private $facilityCommonService: FacilityForCommonService,
    private $router: Router,
    private $alarmCommonService: AlarmForCommonService,
    private $alarmStoreService: AlarmStoreService,
  ) {
  }

  /**
   *  ???????????????
   */
  public ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.equipmentLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // ??????????????????????????????
    this.timeList = this.$timeSelectorService.getTimeList();
    this.dateType = _.first(this.timeList).value;
    // ???????????????
    this.initTableConfig();
    // ?????????????????????
    this.initRemarkForm();
    // ??????????????????
    this.queryCurrentAlarmByEquipment();
    // ????????????????????????
    this.queryHistoryAlarmList();
  }
  /**
   * ???????????????????????????
   */
  public checkHasRole(code: string): boolean {
    return SessionUtil.checkHasRole(code);
  }
  /**
   * ?????????????????????
   */
  public changeFilter(event: { startTime: number, endTime: number }): void {
    // ?????????????????????????????????????????????
    const queryBody = new QueryAlarmStatisticsModel();
    queryBody.beginTime = new Date(event.startTime).getTime();
    queryBody.endTime = new Date(event.endTime).getTime();
    queryBody.equipmentId = this.equipmentId;
    queryBody.statisticsType = StatisticsTypeEnum.equipment;
    queryBody.equipmentType = this.equipmentType;
    // ????????????????????????
    this.getCurrentSourceNameStatistics(queryBody);
    this.getCurrentLevelStatistics(queryBody);
    this.queryAlarmSourceIncremental(queryBody);
    // ????????????????????????
    this.getHistorySourceNameStatistics(queryBody);
    this.queryAlarmHistorySourceLevel(queryBody);
  }

  /**
   * ???????????????tab
   */
  public onChangeTab(type: AlarmTypeEnum): void {
    this.alarmType = type;
    if (this.alarmType === AlarmTypeEnum.current) {
      this.queryCurrentAlarmByEquipment();
    } else {
      this.queryHistoryAlarmList();
    }
  }

  /**
   * ?????????????????????
   */
  public onClickShowMore(): void {
    const routerPath = this.alarmType === AlarmTypeEnum.current ?
      'business/alarm/current-alarm' : 'business/alarm/history-alarm';
    this.$router.navigate([routerPath],
      {queryParams: {equipmentId: this.equipmentId}}).then();
  }

  /**
   * ???????????????????????????
   */
  public formInstanceRemark(event: { instance: FormOperate }): void {
    this.formRemark = event.instance;
    // ????????????
    event.instance.group.statusChanges.subscribe(() => {
      this.saveButtonDisabled = event.instance.getValid();
    });
  }

  /**
   * ??????????????????
   */
  public onClickUpdateRemark(): void {
    const updateData = [{
      id: this.currentAlarmData.id,
      remark: this.formRemark.getData('remarks') || null
    }];
    this.remarkFormSaveLoading = true;
    this.$alarmCommonService.updateAlarmRemark(updateData).subscribe(
      (result: ResultModel<string>) => {
        if (result.code === ResultCodeEnum.success) {
          this.remarkFormSaveLoading = false;
          this.remarkFormModal = false;
          this.$message.success(result.msg);
          // ???????????????????????????????????????
          this.queryCurrentAlarmByEquipment();
        } else {
          this.$message.error(result.msg);
          this.remarkFormSaveLoading = false;
        }
      }, () => {
        this.remarkFormSaveLoading = false;
      });
  }

  /**
   * ?????????????????????????????????
   */
  private getCurrentSourceNameStatistics(body: QueryAlarmStatisticsModel): void {
    this.$facilityCommonService.queryAlarmNameStatistics(body).subscribe(
      (result: ResultModel<AlarmNameStatisticsModel[]>) => {
        if (result.code === 0) {
         let arr = [];
          if (!_.isEmpty(result.data)) {
             arr = result.data.map(item => {
              return {name: item.name, value: item.count};
            });
          } else {
            arr = [{name: '', value: 0}];
          }
          this.ringOption = DeviceChartUntil.setAlarmNameStatisticsChartOption(this.language.currentAlarm, arr);
        }
      });
  }

  /**
   * ???????????????????????????
   */
  private getHistorySourceNameStatistics(body: QueryAlarmStatisticsModel): void {
    this.$facilityCommonService.queryAlarmHistorySourceName(body).subscribe(
      (result: ResultModel<AlarmNameStatisticsModel[]>) => {
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
          this.ringOptionHistory = DeviceChartUntil.setAlarmNameStatisticsChartOption(this.language.historyAlarm, alarmArr);
        }
      });
  }

  /**
   * ????????????????????????
   */
  private queryAlarmHistorySourceLevel(body: QueryAlarmStatisticsModel): void {
    this.$facilityCommonService.queryAlarmHistorySourceLevel(body).subscribe(
      (result: ResultModel<AlarmLevelStatisticsModel>) => {
        if (result.code === 0) {
          // ?????????????????????????????????
          const currentData = this.$alarmUtil.handleAlarmLevelData(result);
          const data = currentData.data;
          const color = currentData.color;
          this.chartOptionHistory = DeviceChartUntil.setAlarmLevelStatisticsChartOption(this.language.historyAlarm, data, color);
        }
      });
  }

  /**
   * ??????????????????????????????
   */
  private getCurrentLevelStatistics(body: QueryAlarmStatisticsModel): void {
    // ???????????????????????????????????????
    this.$facilityCommonService.queryCurrentAlarmLevelStatistics(body).subscribe(
      (result: ResultModel<AlarmLevelStatisticsModel>) => {
        if (result.code === 0) {
          // ?????????????????????????????????
          const currentData = this.$alarmUtil.handleAlarmLevelData(result);
          const data = currentData.data;
          const color = currentData.color;
          this.chartOption = DeviceChartUntil.setAlarmLevelStatisticsChartOption(this.language.currentAlarm, data, color);
        }
      });
  }


  /**
   * ????????????????????????
   */
  private queryAlarmSourceIncremental(body: QueryAlarmStatisticsModel) {
    this.$facilityCommonService.queryAlarmSourceIncremental(body).subscribe(
      (result: ResultModel<AlarmSourceIncrementalModel[]>) => {
        if (result.code === 0) {
          const data = result.data || [];
          const seriesData = this.$alarmUtil.sortAlarmData(data);
          this.columnarOption = DeviceChartUntil.setAlarmSourceIncrementalChartOption(seriesData);
        }
      });
  }

  /**
   * ????????????????????????
   */
  private queryHistoryAlarmList(): void {
    this.historyTableConfig.isLoading = true;
    this.$facilityCommonService.queryHistoryAlarmList(this.equipmentId).subscribe(
      (result: ResultModel<AlarmListModel[]>) => {
        this.historyTableConfig.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.historyAlarmDataSet = result.data || [];
          this.pageBean.Total = result.totalCount;
          if (!_.isEmpty(this.historyAlarmDataSet)) {
            // ?????????????????????????????????????????????????????????????????????
            this.historyAlarmDataSet.forEach(item => {
              item.alarmLevelName = CommonUtil.codeTranslate(AlarmLevelEnum, this.$nzI18n, item.alarmFixedLevel, LanguageEnum.alarm) as string;
              item.style = this.$alarmStoreService.getAlarmColorByLevel(item.alarmFixedLevel);
              item.alarmCleanStatusName = CommonUtil.codeTranslate(AlarmCleanStatusEnum, this.$nzI18n, item.alarmCleanStatus) as string;
            });
          }
        } else {
          this.historyTableConfig.isLoading = false;
          this.$message.error(result.msg);
        }
      }, () => {
        this.historyTableConfig.isLoading = false;
      });
  }

  /**
   * ?????????????????????
   */
  private initTableConfig(): void {
    const tempColumn = [
      //  ??????
      {
        type: 'serial-number',
        width: 62,
        title: this.language.serialNumber,
        fixedStyle: {fixedLeft: true, style: {left: '0px'}}
      },
      {
        title: this.language.alarmName,
        key: 'alarmName',
        width: 140,
        fixedStyle: {fixedLeft: true, style: {left: '62px'}}
      },
      {
        // ????????????
        title: this.language.alarmFixedLevel,
        key: 'alarmFixedLevel',
        width: 100,
        type: 'render',
        renderTemplate: this.alarmFixedLevelTemp
      },
      {
        // ??????
        title: this.language.alarmHappenCount,
        key: 'alarmHappenCount',
        width: 80,
      },
      {
        // ????????????
        title: this.language.alarmCleanStatus,
        key: 'alarmCleanStatus',
        width: 120,
        type: 'render',
        renderTemplate: this.isCleanTemp,
      },
      {
        // ????????????
        title: this.language.alarmCleanPeopleNickname,
        key: 'alarmCleanPeopleNickname',
        width: 120,
      },
      {
        // ??????????????????
        title: this.language.alarmNearTime,
        key: 'alarmNearTime',
        width: 180,
        pipe: 'date',
      },
      {
        // ????????????
        title: this.language.alarmCleanTime,
        key: 'alarmCleanTime',
        width: 180,
        pipe: 'date',
      },
      {
        // ??????????????????
        title: this.language.alarmAdditionalInformation,
        key: 'extraMsg',
        width: 150,
      },
      { // ??????
        title: this.language.remark,
        key: 'remark',
        width: 200,
      }
    ];
    const currentAlarmOperate = [{
      // ??????
      title: this.commonLanguage.operate, searchable: false,
      searchConfig: {
        type: 'operate'
      },
      key: '',
      width: 120,
      fixedStyle: {fixedRight: true, style: {right: '0px'}}
    }];
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      scroll: {x: '1000px', y: '400px'},
      topButtons: [],
      noIndex: true,
      columnConfig: _.concat(tempColumn, currentAlarmOperate),
      showPagination: false,
      bordered: false,
      showSearch: false,
      operation: [
        { // ????????????
          text: this.language.alarmClean,
          className: 'fiLink-clear',
          permissionCode: '02-1-2',
          handle: (data: AlarmListModel) => {
            const temp = [{id: data.id, alarmSource: data.alarmSource}];
            this.handelClearAlarm(temp);
          }
        },
        { // ????????????
          text: this.language.updateRemark,
          className: 'fiLink-edit',
          permissionCode: '02-1-4',
          handle: (data: AlarmListModel) => {
            this.remarkFormModal = true;
            this.formRemark.resetControlData('remarks', data.remark);
            this.currentAlarmData = data;
            this.alarmType = AlarmTypeEnum.current;
          }
        },
        { // ????????????
          text: this.language.buildOrder,
          className: 'fiLink-create',
          permissionCode: '06-2-1-1',
          handle: (data: AlarmListModel) => {
            this.creatWorkOrderShow = true;
            this.alarmType = AlarmTypeEnum.current;
            this.createWorkOrderData = data;
          }
        },
      ],
      // ??????
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.queryCurrentAlarmByEquipment();
      },
    };
    this.historyTableConfig = {
      isDraggable: true,
      isLoading: false,
      scroll: {x: '1000px', y: '400px'},
      topButtons: [],
      noIndex: true,
      columnConfig: _.cloneDeep(tempColumn),
      showPagination: false,
      bordered: false,
      showSearch: false,
      operation: []
    };
  }

  /**
   * ????????????
   */
  private handelClearAlarm(data: { id: string, alarmSource: string }[]): void {
    const alarmClearParams = new AlarmClearAffirmModel(data, []);
    this.$alarmCommonService.updateAlarmCleanStatus(alarmClearParams).subscribe((res: ResultModel<string>) => {
      if (res.code === 0) {
        this.$message.success(res.msg);
        this.queryCurrentAlarmByEquipment();
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * ??????????????????????????????
   */
  private queryCurrentAlarmByEquipment(): void {
    this.tableConfig.isLoading = true;
    this.$facilityCommonService.queryEquipmentCurrentAlarm(this.equipmentId).subscribe(
      (result: ResultModel<AlarmListModel[]>) => {
        if (result.code === 0) {
          this.currentAlarmDataSet = result.data;
          this.pageBean.Total = result.totalCount;
          this.tableConfig.isLoading = false;
          // ????????????????????????????????????????????????????????????
          if (!_.isEmpty(this.currentAlarmDataSet)) {
            this.currentAlarmDataSet.forEach(item => {
              item.style = this.$alarmStoreService.getAlarmColorByLevel(item.alarmFixedLevel);
              item.alarmLevelName = CommonUtil.codeTranslate(AlarmLevelEnum, this.$nzI18n, item.alarmFixedLevel, LanguageEnum.alarm) as string;
              item.alarmCleanStatusName = CommonUtil.codeTranslate(AlarmCleanStatusEnum, this.$nzI18n, item.alarmCleanStatus) as string;
            });
          }
        } else {
          this.tableConfig.isLoading = false;
          this.$message.error(result.msg);
        }
      }, () => {
        this.tableConfig.isLoading = false;
      });
  }

  /**
   * ?????????????????????
   */
  private initRemarkForm(): void {
    this.formColumnRemark = [
      {
        label: this.language.remark, key: 'remarks', type: 'textarea',
        col: 24,
        width: 500,
        labelWidth: 76,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()]
      }
    ];
  }
}
