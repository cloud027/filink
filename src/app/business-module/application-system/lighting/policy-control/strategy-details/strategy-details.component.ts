import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {QueryConditionModel, SortCondition} from '../../../../../shared-module/model/query-condition.model';
import {NzI18nService} from 'ng-zorro-antd';
import {OnlineLanguageInterface} from '../../../../../../assets/i18n/online/online-language.interface';
import {Router} from '@angular/router';
import {ApplicationService} from '../../../share/service/application.service';
import {AlarmLevelModel} from '../../../share/model/lighting.model';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ApplicationInterface} from '../../../../../../assets/i18n/application/application.interface';
import {ExecStatusConst} from '../../../share/const/application-system.const';
import {LightIntensityModel} from '../../../share/model/light.intensity.model';
import {AlarmModel} from '../../../share/model/alarm.model';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {StrategyStatusEnum, SwitchStatus} from '../../../share/enum/policy.enum';
import {InstructUtil} from '../../../share/util/instruct-util';
import {StrategyListModel} from '../../../share/model/policy.control.model';
import {EquipmentListModel} from '../../../../../core-module/model/equipment/equipment-list.model';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {FilterSelectEnum} from '../../../../../shared-module/enum/operator.enum';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {SelectModel} from '../../../../../shared-module/model/select.model';
import {AlarmColorUtil} from '../../../share/util/alarm-color-util';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import * as lodash from 'lodash';
import {AlarmListModel} from '../../../../../core-module/model/alarm/alarm-list.model';
import {AlarmForCommonService} from '../../../../../core-module/api-service';
import {AlarmForCommonUtil} from '../../../../../core-module/business-util/alarm/alarm-for-common.util';
import {SunriseOrSunsetEnum} from '../../../share/enum/sunrise-or-sunset.enum';

@Component({
  selector: 'app-strategy-details',
  templateUrl: './strategy-details.component.html',
  styleUrls: ['./strategy-details.component.scss']
})
export class StrategyDetailsComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  public stepsFirstParams: StrategyListModel = new StrategyListModel();
  @Output()
  public strategyDetailValidChange = new EventEmitter<boolean>();
  // 事件源单选
  @ViewChild('radioReportTemp') radioReportTemp: TemplateRef<any>;
  // 表格告警级别过滤模板
  @ViewChild('alarmDefaultLevelTemp') alarmDefaultLevelTemp: TemplateRef<any>;
  //  告警级别
  @ViewChild('alarmLevelTemp') alarmLevelTemp: TemplateRef<HTMLDocument>;
  // 告警类别
  @ViewChild('alarmTypeTemp') alarmTypeTemp: TemplateRef<any>;
  //  告警确认
  @ViewChild('alarmConfirmTemp') alarmConfirmTemp: TemplateRef<HTMLDocument>;
  // 时段
  public dateRange: Array<Date>;
  // 是否编辑
  public isEditIndex: number = -1;
  // 选中的设备id
  public selectedEquipmentId: string = '';
  // 事件源id
  public selectedReportId: string = '';
  // 选中的设备
  public selectEquipment: EquipmentListModel = new EquipmentListModel();
  // 选中事件源
  public selectReport: AlarmModel = new AlarmModel();
  // 开关常量
  public execStatus = ExecStatusConst;
  public switchStatus = SwitchStatus;
  // 策略详情
  public instructLightList = [];
  // 光照强度
  public params: LightIntensityModel = new LightIntensityModel({});
  // 告警类别枚举
  public typeStatus: SelectModel = new SelectModel();
  // 其他事件源
  public alarmName: string = '';
  // 显示添加按钮
  public isShowDetails: boolean = false;
  // 设备显隐
  public isStrategy: boolean = false;
  // 告警显隐
  public isSource: boolean = false;
  // 告警列表数据
  public reportData: AlarmListModel[] = [];
  // 告警类别
  public alarmTypeList: SelectModel[] = [];
  // 分页参数
  public pageBean: PageModel = new PageModel();
  // 告警表格配置
  public tableConfig: TableConfigModel;
  // 事件表格配置
  public eventTableConfig: TableConfigModel;
  // 选中的设备表格配置
  public multiEquipmentTable: TableConfigModel;
  // 表格多语言
  public language: OnlineLanguageInterface;
  // 设备列表多语言
  public languageTable: ApplicationInterface;
  // 告警语言包
  public alarmLanguage: AlarmLanguageInterface;
  // 表格查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 告警列表查询
  public reportQueryCondition: QueryConditionModel = new QueryConditionModel();
  // 日出日落枚举
  public sunriseOrSunsetEnum = SunriseOrSunsetEnum;
  // 公共语言包
  public commonLanguage: CommonLanguageInterface;
  // 操作符下拉选项
  public filterSelect = Object.entries(FilterSelectEnum);
  // 调光最大值
  public max: number = 99;
  // 调光最大值
  public min: number = 1;

  constructor(
    // 多语言配置
    public $nzI18n: NzI18nService,
    private $alarmService: AlarmForCommonService,
    // 提示
    private $message: FiLinkModalService,
    // 路由
    public $router: Router,
    // 接口服务
    public $applicationService: ApplicationService,
  ) {
    // 多语言
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.online);
    this.alarmLanguage = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.initTableConfig();
    this.initEventTable();
    // 告警类别
    this.getAlarmTypeList();
    this.initMultiEquipment();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.stepsFirstParams.instructLightList) {
      this.instructLightList = this.stepsFirstParams.instructLightList;
      InstructUtil.instructLight(this.instructLightList, this.languageTable);
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
    this.alarmDefaultLevelTemp = null;
    this.alarmLevelTemp = null;
    this.alarmTypeTemp = null;
    this.alarmConfirmTemp = null;
  }

  /**
   * 选择日期
   * @ param result
   */
  public onChange(result: number[]): void {
    this.params.startTime = result[0];
    this.params.endTime = result[1];
  }

  /**
   * 告警列表分页
   * @ param event
   */
  public reportPageChange(event: PageModel): void {
    this.reportQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.reportQueryCondition.pageCondition.pageSize = event.pageSize;
    this.getAlarmLevelList();
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
          return {label: String(item.value), code: item.key, value: item.key};
        });
        // 故障类型枚举
        if (data && data.length > 0) {
          data.forEach(item => {
            this.typeStatus[item.key] = item.value;
          });
        }
        this.tableConfig.columnConfig.forEach(item => {
          if (item.searchKey === 'alarmClassification') {
            item['searchConfig']['selectInfo'] = resultData;
          }
        });
        this.alarmTypeList = resultData;
      }
    });
  }

  /**
   * 选中事件源
   * param event
   * param data
   */
  public selectedReportChange(event: string, data: AlarmLevelModel): void {
    this.selectReport.alarmName = data.alarmName;
    this.selectReport.id = data.id;
  }

  /**
   * 切换开关事件
   * param event
   */
  public switchLightChange(event) {
    // 当前有开关指令时，调光置空
    // 当开关指令为关时，默认调光值为0
    if (this.params.switchLight === SwitchStatus.off) {
      this.min = 0;
      this.params.light = 0;
    } else {
      // 当开关指令为开时，默认调光值为100，调光范围为1~100
      this.max = 100;
      this.min = 1;
      this.params.light = 100;
    }
  }

  handleSwitchLightClear() {
    // 未选择开关指令时，调光范围未1~99
    this.params.switchLight = null;
    this.params.light = null;
    this.max = 99;
    this.min = 1;
  }

  handleLightClose() {
    this.params.light = null;
  }

  /**
   * 调光变化事件
   * param event
   */
  public lightSliderChange(event) {
    // 当前有调光指令时，开关指令置空
    if (this.params.switchLight === SwitchStatus.off) {
      this.params.switchLight = null;
    }
  }

  /**
   * 告警列表
   */
  public getAlarmLevelList(): void {
    this.tableConfig.isLoading = true;
    this.$applicationService.queryAlarmNamePage(this.reportQueryCondition).subscribe((res: ResultModel<AlarmListModel[]>) => {
      if (res.code === 0) {
        this.tableConfig.isLoading = false;
        const {data, totalCount, pageNum, size} = res;
        this.reportData = data || [];
        this.pageBean.Total = totalCount;
        this.pageBean.pageIndex = pageNum;
        this.pageBean.pageSize = size;
        if (this.reportData.length) {
          AlarmColorUtil.alarmFmt(this.reportData, this.alarmLanguage, this.$nzI18n);
        }
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 取消
   */
  public handleCancel(): void {
    this.isStrategy = false;
    this.isSource = false;
  }

  /**
   * 光照强度
   */
  public handleClickStrategy(): void {
    this.isStrategy = true;
    this.selectEquipment.equipmentId = this.params.sensor;
  }

  /**
   * 事件源
   */
  public handleSource(): void {
    this.isSource = true;
    this.selectReport.alarmName = this.params.refObjectName;
    this.selectReport.id = this.params.alarmId;
    if (!this.reportData.length) {
      this.getAlarmLevelList();
    }
  }

  /**
   * 选中设备列表
   */
  public handleEquipmentOk(selectEquipment): void {
    this.params.sensor = selectEquipment.equipmentId;
    this.params.sensorName = selectEquipment.equipmentName;
    this.isStrategy = false;
  }

  /**
   * 编辑策略
   */
  public instructLightEdit(index: number): void {
    this.isEditIndex = index;
    this.params = lodash.cloneDeep(this.instructLightList[index]);
    this.selectEquipment.equipmentName = this.params.sensorName;
    this.alarmName = StrategyStatusEnum.lighting;
    this.isShowDetails = true;
  }


  /**
   * 选中事件源
   */
  public handleReportOk(): void {
    this.params.refType = StrategyStatusEnum.lighting;
    this.params.alarmId = this.selectReport.id;
    this.params.refObjectName = this.selectReport.alarmName;
    this.isSource = false;
  }

  /**
   * 保存操作
   */
  public handSave(): void {
    if (this.params.lightIntensity) {
      const value = String(this.params.lightIntensity);
      if (value.length > 0 && !/^[1-9]\d*$/.test(value)) {
        this.$message.warning(this.languageTable.equipmentTable.strategyLightIntensity);
        return;
      }
    }
    if (this.params.sensorName && !this.params.lightIntensity) {
      this.$message.warning(this.languageTable.strategyList.lightValueErrorTip);
      return;
    }
    if (this.params.endTime && !this.params.startTime) {
      this.$message.warning(this.languageTable.strategyList.onlyEndTime);
      return;
    }
    // 单个时间点不能未关指令
    if (!this.params.endTime && this.params.startTime && this.params.switchLight === SwitchStatus.off) {
      this.$message.warning(this.languageTable.strategyList.canNotChooseOff);
      return;
    }

    // 条件和动作至少有一个项有值
    let actionKey;
    if (this.params.sunriseOrSunset === SunriseOrSunsetEnum.custom) {
      actionKey = ['startTime', 'endTime', 'alarmId', 'sensor'];
    } else {
      actionKey = ['startTime', 'sunriseOrSunset', 'sensor'];
    }
    if (!actionKey.some(item => this.params[item])) {
      return;
    }
    if (!this.params.switchLight && this.params.light === null) {
      return;
    }

    // 判断该时间能否执行所选光照或动作(规则，重复时间只能为调光，不允许为开或关)
    if (this.isOperationConflict()) {
      return;
    }

    this.params.sensorName = this.selectEquipment.equipmentName;
    // 编辑策略
    if (this.isEditIndex !== -1) {
      this.instructLightList.splice(this.isEditIndex, 1, lodash.cloneDeep(this.params));
      this.instructLightList = this.instructLightList.slice();
    } else {
      // 新增策略创建随机数id
      this.params.instructId = CommonUtil.getUUid();
      this.instructLightList.splice(this.instructLightList.length, 0, lodash.cloneDeep(this.params));
      this.instructLightList = this.instructLightList.slice();
      this.alarmName = '';
    }
    this.params = new LightIntensityModel({});
    InstructUtil.instructLight(this.instructLightList, this.languageTable);
    this.stepsFirstParams.instructLightList = this.instructLightList;
    this.isShowDetails = false;
    this.isEditIndex = -1;
    this.strategyDetailValid();

  }

  public handleClose(): void {
    this.isShowDetails = false;
    this.isEditIndex = -1;
    this.params = new LightIntensityModel({});
  }

  /**
   * 操作是否冲突(时间对比，操作动作对比)
   */
  isOperationConflict() {
    return this.stepsFirstParams.instructLightList.some(item => {
      if (item.instructId && this.params.instructId && item.instructId === this.params.instructId) {
        return false;
      }
      // 新增子策略和已存在子策略都是时间段时
      if (item.startTime && item.endTime && this.params.startTime && this.params.endTime) {
        // 时间段有重合
        if (item.startTime <= this.params.endTime && item.endTime >= this.params.startTime) {
          return this.judgeIfSwitchLight(item);
        }
      }

      if (this.params.startTime && !this.params.endTime && item.startTime && item.endTime) {
        // 新增子策略是时间点， 和已存在策略的时间段对比
        if (item.startTime <= this.params.startTime && this.params.startTime <= item.endTime) {
          return this.judgeIfSwitchLight(item);
        }
      }

      if (this.params.startTime && !this.params.endTime && item.startTime && !item.endTime) {
        // 新增子策略是时间点，已存在子策略是时间点 时间点冲突时不允许做任何操作
        if (this.params.startTime === item.startTime) {
          this.$message.warning(this.languageTable.strategyList.conflictTip);
          return true;
        } else {
          return  false;
        }
      }

      if (this.params.startTime && this.params.endTime && item.startTime && !item.endTime) {
        // 新增子策略是时间段, 已存在子策略是时间点 ,存在重合时
        if (this.params.startTime <= item.startTime && item.startTime <= this.params.endTime) {
          return this.judgeIfSwitchLight(item);
        }
      }
    });
  }

  /**
   * 判断是否不是纯调光
   * @item 已存在的子策略
   */
  private judgeIfSwitchLight(item): boolean {
    if (this.params.switchLight === null && this.params.light) {
      // 新增的子策略只存在调光操作时
      return false;
    } else if (this.params.switchLight && this.params.light !== null && item.light && item.switchLight === null) {
      // 新增策略不是纯调光，已存在的子策略为纯调光
      return false;
    } else {
      // 两个子策略不存在纯调光的
      this.$message.warning(this.languageTable.strategyList.sameTimeErrorTip);
      return true;
    }
  }

  /**
   * 照明策略第二步的校验
   */
  private strategyDetailValid() {
    this.strategyDetailValidChange.emit(Boolean(this.stepsFirstParams.instructLightList.length));
  }

  /**
   * 新增的策略列表
   */
  private initMultiEquipment(): void {
    this.multiEquipmentTable = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: false,
      showSizeChanger: true,
      scroll: {x: '500px', y: '600px'},
      noIndex: true,
      notShowPrint: true,
      columnConfig: [
        // 时段
        {
          title: this.languageTable.strategyList.timeInterval,
          key: 'timeInterval',
          width: 100,
        },
        // 开关
        {
          title: this.languageTable.strategyList.switch,
          key: 'switches',
          width: 80,
        },
        // 亮度
        {
          title: this.languageTable.strategyList.dimming,
          key: 'light',
          width: 100,
        },
        // 光照强度
        {
          title: this.languageTable.strategyList.lightIntensity,
          key: 'sensorList',
          width: 200,
        },
        // 操作
        {
          title: this.language.operate,
          searchConfig: {type: 'operate'},
          key: '',
          width: 80,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        }
      ],
      showPagination: false,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      operation: [
        // 编辑
        {
          text: this.languageTable.strategyList.strategyEdit,
          className: 'fiLink-edit',
          handle: (data) => {
            const idx = this.instructLightList.findIndex(item => item.instructId === data.instructId);
            this.instructLightEdit(idx);
          },
        },
        {
          text: this.languageTable.strategyList.strategyDelete,
          className: 'fiLink-delete red-icon',
          needConfirm: true,
          confirmContent: `${this.languageTable.strategyList.confirmDelete}?`,
          handle: (data) => {
            const index = this.instructLightList.findIndex(item => item.instructId === data.instructId);
            this.instructLightList.splice(index, 1);
            this.instructLightList = this.instructLightList.slice();
            // 同步修改stepsFirstParams
            this.stepsFirstParams.instructLightList = this.instructLightList;
            this.stepsFirstParams.instructLightList = this.stepsFirstParams.instructLightList.slice();
            this.strategyDetailValid();
          }
        }
      ],
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

  /**
   * 初始化表格配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
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
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.getAlarmLevelList();
      },
      // 搜索
      handleSearch: (event) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.getAlarmLevelList();
      }
    };
  }

}
