import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../../shared-module/model/query-condition.model';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {OnlineLanguageInterface} from '../../../../../../assets/i18n/online/online-language.interface';
import {ApplicationService} from '../../../share/service/application.service';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';
import {StrategyListModel, StrategyRefListModel} from '../../../share/model/policy.control.model';
import {ExecStatusEnum, SwitchStatus, TargetTypeEnum} from '../../../share/enum/policy.enum';
import {SliderValueConst} from '../../../share/const/slider.const';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {InstructInfoBaseModel, InstructLightBaseModel, LinkageStrategyModel} from '../../../share/model/linkage.strategy.model';
import {AlarmModel} from '../../../share/model/alarm.model';
import {DimmingLightModel, EquipmentModel} from '../../../share/model/equipment.model';
import {EquipmentListModel} from '../../../../../core-module/model/equipment/equipment-list.model';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {ConditionTypeEnum} from '../../../share/enum/condition-type.enum';
import {SelectModel} from '../../../../../shared-module/model/select.model';
import {AlarmColorUtil} from '../../../share/util/alarm-color-util';
import {AlarmListModel} from '../../../../../core-module/model/alarm/alarm-list.model';
import {AlarmForCommonService} from '../../../../../core-module/api-service';
import {EquipmentStatusEnum, EquipmentTypeEnum} from 'src/app/core-module/enum/equipment/equipment.enum';
import {AlarmForCommonUtil} from '../../../../../core-module/business-util/alarm/alarm-for-common.util';

/**
 * 联动策略第二步组件
 */
@Component({
  selector: 'app-strategy-management-details',
  templateUrl: './strategy-management-details.component.html',
  styleUrls: ['./strategy-management-details.component.scss']
})
export class StrategyManagementDetailsComponent implements OnInit, OnDestroy, OnChanges {
  // 选中的设备
  @Input() public strategyRefList: StrategyRefListModel[] = [];
  // 策略模型
  @Input() public stepsFirstParams: StrategyListModel = new StrategyListModel();
  // 策略详情的参数
  @Input() linkageStrategyInfo: LinkageStrategyModel = new LinkageStrategyModel({});
  // 策略详情发射器
  @Output() strategyDetailValidChange = new EventEmitter<boolean>();
  // 表格告警级别过滤模板
  @ViewChild('alarmDefaultLevelTemp') alarmDefaultLevelTemp: TemplateRef<any>;
  // 告警列表单选
  @ViewChild('radioReportTemp') radioReportTemp: TemplateRef<any>;
  //  告警级别
  @ViewChild('alarmLevelTemp') alarmLevelTemp: TemplateRef<HTMLDocument>;
  //  告警确认
  @ViewChild('alarmConfirmTemp') alarmConfirmTemp: TemplateRef<HTMLDocument>;
  // 告警类别
  @ViewChild('alarmTypeTemp') alarmTypeTemp: TemplateRef<any>;
  // 设备列表
  @ViewChild('equipment') equipment: TemplateRef<any>;
  // 应用范围设备列表显隐
  public isStrategy: boolean = false;
  // 告警列表显隐
  public isSource: boolean = false;
  // 事件列表显隐
  public isSourceEvent: boolean = false;
  // 开关枚举常量
  public ExecStatusEnum = ExecStatusEnum;
  // 告警类别枚举
  public typeStatus: SelectModel = new SelectModel();
  // 滑块值的常量
  public sliderValue = SliderValueConst;
  // 单控，集控
  public targetTypeEnum = TargetTypeEnum;
  // 选中的设备id
  public selectedEquipmentId: string = '';
  // 事件源id
  public selectedReportId: string = '';
  // 节目弹框显示
  public isShowProgram: boolean = false;
  // 节目id
  public selectedProgramId: string = '';
  // 节目名称
  public programName: string = '';
  // 选中事件源
  public selectEquipment: DimmingLightModel = new DimmingLightModel();
  // 选中的设备
  public selectReport: AlarmModel = new AlarmModel();
  // 选中的节目
  public selectedProgram = {id: '', name: ''};
  // 设备列表显隐
  public isMultiEquipment: boolean = false;
  // 表格是否显示类型筛选
  public isDisplay: boolean;
  // 设备列表数据集合
  public dataSet: EquipmentListModel[] = [];
  // 告警列表数据集合
  public reportData: AlarmListModel[] = [];
  // 选中的设备列表
  public multiEquipmentData: EquipmentModel[] = [];
  // 告警列表
  public tableConfigReport: TableConfigModel;
  // 分页参数
  public pageBean: PageModel = new PageModel();
  // 告警分页
  public reportPageBean: PageModel = new PageModel();
  // 选择设备表格配置
  public tableConfig: TableConfigModel;
  // 表格多语言
  public language: OnlineLanguageInterface;
  // 设备列表多语言
  public languageTable: ApplicationInterface;
  // 表格查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 表格查询条件
  public reportQueryCondition: QueryConditionModel = new QueryConditionModel();
  // 单灯和集控的参数
  public instructLightBase: InstructLightBaseModel = new InstructLightBaseModel({});
  // 信息屏参数
  public instructInfoBase: InstructInfoBaseModel = new InstructInfoBaseModel({});
  // 高亮开关
  public switchLight: boolean = false;
  public equipmentLanguage: FacilityLanguageInterface;
  // 设备状态枚举
  public equipmentStatusEnum = EquipmentStatusEnum;
  public languageEnum = LanguageEnum;
  public commonLanguage: CommonLanguageInterface;
  // 事件源类型枚举
  public conditionTypeEnum = ConditionTypeEnum;
  // 事件列表
  public eventList: any[] = [];
  // 事件列表表格配置
  public eventTableConfig: TableConfigModel;
  public alarmLanguage: AlarmLanguageInterface;
  // 调光最大值
  public max: number = 99;
  // 调光最大值
  public min: number = 1;

  constructor(
    // 多语言配置
    private $nzI18n: NzI18nService,
    private $alarmService: AlarmForCommonService,
    // 消息提示
    private $message: FiLinkModalService,
    // 接口服务
    private $applicationService: ApplicationService,
  ) {
    // 多语言
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.online);
    // 表格多语言配置
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.equipmentLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.alarmLanguage = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 告警列表配置
    this.initTableConfig();
    // 告警类别
    this.getAlarmTypeList();
    // 事件列表
    this.initEventTable();
    // 告警列表
    this.getAlarmLevelList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.linkageStrategyInfo && changes.linkageStrategyInfo.currentValue) {
      this.selectReport.alarmName = this.linkageStrategyInfo.conditionName;
      this.selectEquipment.equipmentName = this.linkageStrategyInfo.equipmentName;
      this.multiEquipmentData = this.stepsFirstParams.multiEquipmentData;

      // 信息屏实体没有值的时候赋值
      if (_.isEmpty(this.linkageStrategyInfo.instructInfoBase)) {
        this.linkageStrategyInfo.instructInfoBase = new InstructInfoBaseModel();
      }
      this.instructInfoBase = this.linkageStrategyInfo.instructInfoBase;
      // 照明实体没有值的时候赋值
      if (_.isEmpty(this.linkageStrategyInfo.instructLightBase)) {
        this.linkageStrategyInfo.instructLightBase = new InstructLightBaseModel();
      }
      this.instructLightBase = this.linkageStrategyInfo.instructLightBase;
      this.switchLight = this.linkageStrategyInfo.instructLightBase.switchLight === SwitchStatus.on;
      this.instructInfoBase = this.linkageStrategyInfo.instructInfoBase;
      Promise.resolve().then(() => {
        this.strategyDetailValid();
      });
    }
  }

  /**
   * 销毁
   */
  public ngOnDestroy(): void {
    this.radioReportTemp = null;
    this.equipment = null;
  }


  /**
   *选中节目提交
   */
  public handleProgramOk(selectedProgram): void {
    this.stepsFirstParams.linkageStrategyInfo.instructInfoBase.programId = selectedProgram.id;
    this.stepsFirstParams.linkageStrategyInfo.instructInfoBase.programName = selectedProgram.name;
    this.isShowProgram = false;
    this.strategyDetailValid();
  }

  switchLightChange(switchLight): void {
    this.switchLight = switchLight === ExecStatusEnum.implement;
    this.linkageStrategyInfo.instructLightBase.switchLight = switchLight;

    // 当前有开关指令时，调光置空
    // 当开关指令为关时，默认调光值为0
    if (this.linkageStrategyInfo.instructLightBase.switchLight === ExecStatusEnum.free) {
      this.min = 0;
      this.linkageStrategyInfo.instructLightBase.light = `0`;
    } else {
      // 当开关指令为开时，默认调光值为100，调光范围为1~100
      this.max = 100;
      this.min = 1;
      this.linkageStrategyInfo.instructLightBase.light = `100`;
    }
  }

  /**
   * 清除开关选择
   */
  handleSwitchLightClear() {
    // 未选择开关指令时，调光范围未1~99
    this.linkageStrategyInfo.instructLightBase.switchLight = null;
    this.linkageStrategyInfo.instructLightBase.light = '1';
    this.max = 99;
    this.min = 1;
  }
  /**
   * 多选
   */
  public handleMultiEquipmentOk(data: EquipmentModel[]): void {
    this.multiEquipmentData = data;
    const arr = [];
    data.forEach(item => {
      arr.push({
        refName: item.equipmentName,
        refEquipmentType: item.equipmentType,
        refType: ExecStatusEnum.implement,
        refId: item.equipmentId
      });
    });
    this.stepsFirstParams.strategyRefList = arr;
    this.stepsFirstParams.multiEquipmentData = data;
    this.isMultiEquipment = false;
  }

  /**
   * 告警分页
   * @ param event
   */
  public reportPageChange(event: PageModel): void {
    this.reportQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.reportQueryCondition.pageCondition.pageSize = event.pageSize;
    this.getAlarmLevelList();
  }

  /**
   * 设备选择
   */
  public handleTableOk(event): void {
    this.handleMultiEquipmentOk(event.data);
    this.linkageStrategyInfo.targetType = event.targetType;
    if (this.linkageStrategyInfo.targetType === EquipmentTypeEnum.informationScreen) {
      if (!this.linkageStrategyInfo.instructInfoBase) {
        this.linkageStrategyInfo.instructInfoBase = new InstructInfoBaseModel();
      }
    } else {
      if (!this.linkageStrategyInfo.instructLightBase) {
        this.linkageStrategyInfo.instructLightBase = new InstructLightBaseModel();
      }
    }
    this.strategyDetailValid();
  }

  /**
   * 取消操作
   */
  public handleCancel(): void {
    this.isStrategy = false;
    this.isSource = false;
    this.isSourceEvent = false;
  }

  /**
   * 点击设备弹出框
   */
  public handleEquipment(): void {
    // 打开触发条件选择设备弹框 将弹框显示的值改成目前的值
    this.selectEquipment.equipmentId = this.stepsFirstParams.linkageStrategyInfo.equipmentId;
    this.isStrategy = true;
  }

  /**
   * 点击告警弹出框
   */
  public handleReport(): void {
    this.reportQueryCondition = new QueryConditionModel();
    this.getAlarmLevelList();
    this.selectReport.alarmCode = this.stepsFirstParams.linkageStrategyInfo.conditionId;
    this.tableConfigReport.showSearch = false;
    this.isSource = true;
  }

  /**
   * 点击事件弹出框
   */
  public handleReportEvent(): void {
    this.selectReport.alarmCode = this.stepsFirstParams.linkageStrategyInfo.conditionId;
    this.isSourceEvent = true;
  }

  public handleProgram(): void {
    this.selectedProgram.id = this.stepsFirstParams.linkageStrategyInfo.instructInfoBase.programId;
    this.selectedProgram.name = this.stepsFirstParams.linkageStrategyInfo.instructInfoBase.programName;
    this.isShowProgram = true;
  }

  /**
   * 设备列表的确认事件
   */
  public handleEquipmentOk(selectEquipment): void {
    // 关闭触发条件选择设备弹框 将目前的值改成弹框显示的值
    this.stepsFirstParams.linkageStrategyInfo.equipmentName = selectEquipment.equipmentName;
    this.stepsFirstParams.linkageStrategyInfo.equipmentId = selectEquipment.equipmentId;
    this.strategyDetailValid();
    this.isStrategy = false;
  }

  /**
   * 告警列表的确认事件
   */
  public handleReportOk(): void {
    this.stepsFirstParams.linkageStrategyInfo.conditionId = this.selectReport.alarmCode;
    this.stepsFirstParams.linkageStrategyInfo.conditionName = this.selectReport.alarmName;
    this.strategyDetailValid();
    this.isSource = false;
  }

  /**
   * 事件列表的确认事件
   */
  public handleReportEventOk(): void {
    this.stepsFirstParams.linkageStrategyInfo.conditionId = this.selectReport.alarmCode;
    this.stepsFirstParams.linkageStrategyInfo.conditionName = this.selectReport.alarmName;
    this.strategyDetailValid();
    this.isSourceEvent = false;
  }

  /**
   * 事件源类型切换
   * param event
   */
  public conditionChange(event): void {
    // 清空当前的事件或者告警名称
    this.stepsFirstParams.linkageStrategyInfo.conditionName = '';
    this.stepsFirstParams.linkageStrategyInfo.conditionId = null;
    this.strategyDetailValid();
  }

  /**
   * 告警类别
   */
  public getAlarmTypeList(): void {
    this.$alarmService.getAlarmTypeList().subscribe((res: ResultModel<SelectModel[]>) => {
      if (res.code === 0) {
        const data = res.data;
        // 表单时
        const resultData = data.map(item => {
          return ({
            label: String(item.value),
            code: item.key,
            value: item.key,
          });
        });
        // 故障类型枚举
        if (data && data.length > 0) {
          data.forEach(item => {
            this.typeStatus[item.key] = item.value;
          });
        }
        this.tableConfigReport.columnConfig.forEach(item => {
          if (item.searchKey === 'alarmClassification') {
            item['searchConfig']['selectInfo'] = resultData;
          }
        });
      }
    });
  }

  /**
   * 告警列表
   */
  public getAlarmLevelList(): void {
    this.tableConfigReport.isLoading = true;
    this.$applicationService.queryAlarmNamePage(this.reportQueryCondition).subscribe((res: ResultModel<AlarmListModel[]>) => {
      this.tableConfigReport.isLoading = false;
      if (res.code === 0) {
        const {data, totalCount, pageNum, size} = res;
        this.reportData = data || [];
        this.reportPageBean.Total = totalCount;
        this.reportPageBean.pageIndex = pageNum;
        this.reportPageBean.pageSize = size;
        if (this.reportData.length) {
          AlarmColorUtil.alarmFmt(this.reportData, this.alarmLanguage, this.$nzI18n);
        }
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.tableConfigReport.isLoading = false;
    });
  }

  /**
   * 选中事件源
   * @ param event
   * @ param data
   */
  public selectedReportChange(event: string, data: AlarmModel) {
    this.selectReport.alarmCode = data.alarmCode;
    this.selectReport.alarmName = data.alarmName;
  }

  public strategyDetailValid(): void {
    // 为了方便阅读 不简化
    let valid = false;
    if (this.linkageStrategyInfo.equipmentId && this.linkageStrategyInfo.conditionId && this.linkageStrategyInfo.conditionType
      && this.linkageStrategyInfo.conditionId
      && this.stepsFirstParams.multiEquipmentData.length
    ) {
      valid = true;
    } else {
      valid = false;
    }
    // 当前选择的设备为信息屏时要再校验instructInfoBase.programId
    if (this.linkageStrategyInfo.targetType && this.linkageStrategyInfo.targetType.includes(EquipmentTypeEnum.informationScreen)) {
      valid = valid && Boolean(this.linkageStrategyInfo.instructInfoBase.programId);
    }
    this.strategyDetailValidChange.emit(valid);
  }

  public deleteEquipmentChange(data) {
    this.handleMultiEquipmentOk(data);
    this.linkageStrategyInfo.targetType = [...new Set(data.map(item => item.equipmentType))].join(',');
  }

  /**
   * 初始化表格配置
   */
  private initTableConfig(): void {
    this.tableConfigReport = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1600px', y: '420px'},
      noIndex: true,
      noAutoHeight: true,
      notShowPrint: true,
      columnConfig: [
        {
          title: '',
          type: 'render',
          key: 'selectedReportId',
          renderTemplate: this.radioReportTemp,
          width: 42
        },
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
        },
        // 告警名称
        {
          title: this.alarmLanguage.alarmName, key: 'alarmName', width: 200,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        // 告警代码
        {
          title: this.alarmLanguage.AlarmCode, key: 'alarmCode', width: 200,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        // 告警级别
        {
          title: this.alarmLanguage.alarmDefaultLevel, key: 'alarmDefaultLevel', width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: AlarmForCommonUtil.translateAlarmLevel(this.$nzI18n), label: 'label', value: 'code'
          },
          type: 'render',
          renderTemplate: this.alarmDefaultLevelTemp,
        },
        // 定制级别
        {
          title: this.alarmLanguage.alarmLevel, key: 'alarmLevel', width: 150,
          searchable: true,
          isShowSort: true,
          type: 'render',
          renderTemplate: this.alarmLevelTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: AlarmForCommonUtil.translateAlarmLevel(this.$nzI18n), label: 'label', value: 'code'
          },
        },
        {
          // 告警类别
          title: this.alarmLanguage.AlarmType, key: 'alarmClassification', width: 150, isShowSort: true,
          searchable: true,
          searchKey: 'alarmClassification',
          type: 'render',
          searchConfig: {
            type: 'select', selectType: 'multiple',
          },
          renderTemplate: this.alarmTypeTemp
        },
        { // 自动确认
          title: this.alarmLanguage.alarmAutomaticConfirmation, key: 'alarmAutomaticConfirmation', width: 150,
          searchable: true,
          isShowSort: true,
          type: 'render',
          renderTemplate: this.alarmConfirmTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              {label: this.alarmLanguage.yes, value: '1'},
              {label: this.alarmLanguage.no, value: '0'},
            ]
          }
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 100, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      // 排序
      sort: (event: SortCondition) => {
        this.reportQueryCondition.sortCondition.sortField = event.sortField;
        this.reportQueryCondition.sortCondition.sortRule = event.sortRule;
        this.getAlarmLevelList();
      },
      // 搜索
      handleSearch: (event: FilterCondition[]) => {
        this.reportQueryCondition.pageCondition.pageNum = 1;
        this.reportQueryCondition.filterConditions = event;
        this.getAlarmLevelList();
      }
    };
  }

  /**
   * 初始化事件源表格配置
   */
  private initEventTable(): void {
    this.eventTableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1600px', y: '600px'},
      noIndex: true,
      notShowPrint: true,
      columnConfig: [
        {
          title: '',
          type: 'render',
          key: 'selectedReportId',
          renderTemplate: this.radioReportTemp,
          fixedStyle: {fixedLeft: true, style: {left: '0px'}},
          width: 42
        },
        // 序号
        {
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
        },
        // 操作用户
        {
          title: this.languageTable.strategyList.operationUser,
          key: 'alarmName',
          width: 150,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 操作时间
        {
          title: this.languageTable.strategyList.operationTime,
          key: 'alarmObject',
          width: 150,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 操作结果
        {
          title: this.languageTable.strategyList.operationResult,
          key: 'alarmDeviceName',
          width: 150,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // 操作详情
        {
          title: this.languageTable.strategyList.operationDetails,
          key: 'areaName',
          width: 150,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {right: '0px'}}
        }
      ],
      showPagination: false,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
    };
  }
}
