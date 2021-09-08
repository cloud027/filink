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
 * 设备告警
 * created by PoHe
 */
@Component({
  selector: 'app-equipment-alarm',
  templateUrl: './equipment-alarm.component.html',
  styleUrls: ['./equipment-alarm.component.scss']
})
export class EquipmentAlarmComponent implements OnInit {
  // 入参设备id
  @Input()
  public equipmentId: string = '';
  // 设备类型
  @Input()
  public equipmentType: string = '';
  // 告警级别模板
  @ViewChild('alarmFixedLevelTemp') public alarmFixedLevelTemp: TemplateRef<HTMLDocument>;
  // 清除状态模板
  @ViewChild('isCleanTemp') public isCleanTemp: TemplateRef<HTMLDocument>;
  // 告警国际化
  public language: AlarmLanguageInterface;
  // 设备管理国际化
  public equipmentLanguage: FacilityLanguageInterface;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 当前告警列表数据
  public currentAlarmDataSet: AlarmListModel[] = [];
  // 历史告警
  public historyAlarmDataSet: AlarmListModel[] = [];
  // 列表分页实体
  public pageBean: PageModel = new PageModel(PageSizeEnum.sizeFive);
  // 当前告警列表查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 列表配置
  public tableConfig: TableConfigModel;
  // 历史告警列表配置
  public historyTableConfig: TableConfigModel;
  // 页面是否加载
  public pageLoading: boolean = false;
  // 当前告警饼图配置
  public chartOption = {};
  // 当前告警环图配置
  public ringOption = {};
  // 告警增量配置
  public columnarOption = {};
  // 历史告警环图配置
  public ringOptionHistory = {};
  // 历史告警饼图配置
  public chartOptionHistory = {};
  // 时间选择器数据
  public timeList: TimeItemModel[] = [];
  // 保存修改备注按钮是否不可用
  public saveButtonDisabled: boolean = true;
  // 时间选择器默认值
  public dateType: DateTypeEnum;
  // 告警分类
  public alarmType: AlarmTypeEnum = AlarmTypeEnum.current;
  // 告警类型枚举
  public alarmTypeEnum = AlarmTypeEnum;
  // 当前告警对象
  public currentAlarmData: AlarmListModel;
  // 备注显示隐藏
  public remarkFormModal: boolean = false;
  // 修改备注弹框保存按钮的状态
  public remarkFormSaveLoading: boolean = false;
  // 备注表单
  public formColumnRemark: FormItem[] = [];
  // 是否显示创建工单的弹框
  public creatWorkOrderShow: boolean = false;
  // 创建工单传入的区域id
  public areaId: string;
  // 创建工单数据
  public createWorkOrderData: AlarmListModel = new AlarmListModel();
  // 备注表单状态
  private formRemark: FormOperate;


  /**
   * 构造器
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
   *  初始化组件
   */
  public ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.equipmentLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // 初始化时间选择器列表
    this.timeList = this.$timeSelectorService.getTimeList();
    this.dateType = _.first(this.timeList).value;
    // 初始化配置
    this.initTableConfig();
    // 初始化备注表单
    this.initRemarkForm();
    // 查询告警列表
    this.queryCurrentAlarmByEquipment();
    // 查询历史告警列表
    this.queryHistoryAlarmList();
  }
  /**
   * 判断是否有操作权限
   */
  public checkHasRole(code: string): boolean {
    return SessionUtil.checkHasRole(code);
  }
  /**
   * 触发事件选择器
   */
  public changeFilter(event: { startTime: number, endTime: number }): void {
    // 实例化告警等级和增量的查询条件
    const queryBody = new QueryAlarmStatisticsModel();
    queryBody.beginTime = new Date(event.startTime).getTime();
    queryBody.endTime = new Date(event.endTime).getTime();
    queryBody.equipmentId = this.equipmentId;
    queryBody.statisticsType = StatisticsTypeEnum.equipment;
    queryBody.equipmentType = this.equipmentType;
    // 查询当前告警统计
    this.getCurrentSourceNameStatistics(queryBody);
    this.getCurrentLevelStatistics(queryBody);
    this.queryAlarmSourceIncremental(queryBody);
    // 查询历史告警统计
    this.getHistorySourceNameStatistics(queryBody);
    this.queryAlarmHistorySourceLevel(queryBody);
  }

  /**
   * 切换告警的tab
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
   * 跳转更多的告警
   */
  public onClickShowMore(): void {
    const routerPath = this.alarmType === AlarmTypeEnum.current ?
      'business/alarm/current-alarm' : 'business/alarm/history-alarm';
    this.$router.navigate([routerPath],
      {queryParams: {equipmentId: this.equipmentId}}).then();
  }

  /**
   * 实例化修改备注表单
   */
  public formInstanceRemark(event: { instance: FormOperate }): void {
    this.formRemark = event.instance;
    // 校验表单
    event.instance.group.statusChanges.subscribe(() => {
      this.saveButtonDisabled = event.instance.getValid();
    });
  }

  /**
   * 确认修改备注
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
          // 修改备注成功就刷新告警列表
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
   * 获取当前告警名称环形图
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
   * 历史告警名称环形图
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
   * 历史告警等级饼图
   */
  private queryAlarmHistorySourceLevel(body: QueryAlarmStatisticsModel): void {
    this.$facilityCommonService.queryAlarmHistorySourceLevel(body).subscribe(
      (result: ResultModel<AlarmLevelStatisticsModel>) => {
        if (result.code === 0) {
          // 获取告警等级饼状图样式
          const currentData = this.$alarmUtil.handleAlarmLevelData(result);
          const data = currentData.data;
          const color = currentData.color;
          this.chartOptionHistory = DeviceChartUntil.setAlarmLevelStatisticsChartOption(this.language.historyAlarm, data, color);
        }
      });
  }

  /**
   * 设备当前告警级别统计
   */
  private getCurrentLevelStatistics(body: QueryAlarmStatisticsModel): void {
    // 调用后台设备当前告警的接口
    this.$facilityCommonService.queryCurrentAlarmLevelStatistics(body).subscribe(
      (result: ResultModel<AlarmLevelStatisticsModel>) => {
        if (result.code === 0) {
          // 处理告警级别统计的颜色
          const currentData = this.$alarmUtil.handleAlarmLevelData(result);
          const data = currentData.data;
          const color = currentData.color;
          this.chartOption = DeviceChartUntil.setAlarmLevelStatisticsChartOption(this.language.currentAlarm, data, color);
        }
      });
  }


  /**
   * 查询告警增量统计
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
   * 查询历史告警记录
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
            // 设置告警等级国际化，状态国际化和告警等级的样式
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
   * 初始化表格参数
   */
  private initTableConfig(): void {
    const tempColumn = [
      //  序号
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
        // 告警级别
        title: this.language.alarmFixedLevel,
        key: 'alarmFixedLevel',
        width: 100,
        type: 'render',
        renderTemplate: this.alarmFixedLevelTemp
      },
      {
        // 频次
        title: this.language.alarmHappenCount,
        key: 'alarmHappenCount',
        width: 80,
      },
      {
        // 清除状态
        title: this.language.alarmCleanStatus,
        key: 'alarmCleanStatus',
        width: 120,
        type: 'render',
        renderTemplate: this.isCleanTemp,
      },
      {
        // 清除用户
        title: this.language.alarmCleanPeopleNickname,
        key: 'alarmCleanPeopleNickname',
        width: 120,
      },
      {
        // 最近发生时间
        title: this.language.alarmNearTime,
        key: 'alarmNearTime',
        width: 180,
        pipe: 'date',
      },
      {
        // 清除时间
        title: this.language.alarmCleanTime,
        key: 'alarmCleanTime',
        width: 180,
        pipe: 'date',
      },
      {
        // 告警附加信息
        title: this.language.alarmAdditionalInformation,
        key: 'extraMsg',
        width: 150,
      },
      { // 备注
        title: this.language.remark,
        key: 'remark',
        width: 200,
      }
    ];
    const currentAlarmOperate = [{
      // 操作
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
        { // 告警清除
          text: this.language.alarmClean,
          className: 'fiLink-clear',
          permissionCode: '02-1-2',
          handle: (data: AlarmListModel) => {
            const temp = [{id: data.id, alarmSource: data.alarmSource}];
            this.handelClearAlarm(temp);
          }
        },
        { // 修改备注
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
        { // 创建工单
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
      // 排序
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
   * 清除告警
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
   * 查询当前告警列表数据
   */
  private queryCurrentAlarmByEquipment(): void {
    this.tableConfig.isLoading = true;
    this.$facilityCommonService.queryEquipmentCurrentAlarm(this.equipmentId).subscribe(
      (result: ResultModel<AlarmListModel[]>) => {
        if (result.code === 0) {
          this.currentAlarmDataSet = result.data;
          this.pageBean.Total = result.totalCount;
          this.tableConfig.isLoading = false;
          // 处理当前告警的级别名称状态名称和级别图标
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
   * 初始化备注表单
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
