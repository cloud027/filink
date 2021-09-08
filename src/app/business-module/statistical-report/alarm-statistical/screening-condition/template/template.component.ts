import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {DateHelperService, NzI18nService} from 'ng-zorro-antd';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../../shared-module/model/query-condition.model';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {FormOperate} from '../../../../../shared-module/component/form/form-operate.service';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {RuleUtil} from '../../../../../shared-module/util/rule-util';
import {AlarmSelectorConfigModel} from '../../../../../shared-module/model/alarm-selector-config.model';
import {TableComponent} from '../../../../../shared-module/component/table/table.component';
import {DateFormatStringEnum} from '../../../../../shared-module/enum/date-format-string.enum';
import {differenceInCalendarDays} from 'date-fns';
import {DeviceTypeEnum} from '../../../../../core-module/enum/facility/facility.enum';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {AlarmStatisticalService} from '../../../share/service/alarm-statistical.service';
import {AlarmSelectorConfigTypeEnum} from '../../../../../shared-module/enum/alarm-selector-config-type.enum';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {StatisticalTemplateModel} from '../../../share/model/alarm/statistical-template.model';
import {OperateTypeEnum} from '../../../../../shared-module/enum/page-operate-type.enum';
import {CurrentPageTypeEnum} from '../../../share/enum/current-page-type.enum';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import * as _ from 'lodash';
import {AlarmNameListModel} from '../../../../../core-module/model/alarm/alarm-name-list.model';
import {FacilityForCommonUtil} from '../../../../../core-module/business-util/facility/facility-for-common.util';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})

export class TemplateComponent implements OnInit {
  @Input() bool = false;

  // 从父组件获取页面类型
  @Input()
  set currentPage(currentPage) {
    this.currentPageType = currentPage;
    if (currentPage === CurrentPageTypeEnum.areaRatio) {
      this.selectNumber = 1;
    } else {
      this.selectNumber = 5;
    }
    this.queryTemplateData();
  }
  // 设备是否多选
  @Input() equipmentIsRadio: boolean = false;

  // 模板统计中点击确定或取消的emit事件
  @Output() resultAndClose = new EventEmitter();
  // 单选按钮
  @ViewChild('radioTemp') radioTemp: TemplateRef<any>;
  // 区域选择器
  @ViewChild('areaSelector') private areaSelector;
  // 新增模板时间空间
  @ViewChild('recentlyTimeTemp') private recentlyTimeTemp: TableComponent;
  // 表格设施类型模板
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<any>;
  // 新增模板中选择设施类型多选框
  @ViewChild('addDeviceTypeTemp') addDeviceTypeTemp: TemplateRef<any>;
  @ViewChild('modalContentWork') modalContentWork;
  @ViewChild('alarmNameTemp') alarmNameTemp: TemplateRef<any>;
  // 模板统计表格数据
  public dataSetTemplate: StatisticalTemplateModel[] = [];
  // 表格翻页配置
  public pageBeanTemplate: PageModel = new PageModel(100, 1, 1);
  // 表格配置
  public tableConfigTemplate: TableConfigModel;
  // 国际化
  public language: AlarmLanguageInterface;
  // 控制按模板统计的显示隐藏
  public display = {
    templateTable: true,
    creationTemplate: false
  };
  public alarmName = '';
  public alarmNameSelectVisible: boolean = false;
  public selectAlarms: any[] = [];
  public selectAlarmData = {
    // 选择的告警代码数组
    selectAlarmCodes: [],
    // 选择的告警id数组
    ids: [],
    // 选择的告警名称数组
    alarmNames: []
  };
  public selectedAlarm: StatisticalTemplateModel = new StatisticalTemplateModel();
  // 表单配置
  public formColumn: FormItem[] = [];
  // 表单状态
  public formStatus: FormOperate;
  // 选择区域组件配置
  public areaConfig: AlarmSelectorConfigModel;
  // 时间选择控件值
  public timeModel = {
    recentlyTimeModel: [],
  };
  // 新增修改模板的设施类型下拉框数据
  public deviceTypeList: { label: string, code: any }[] = [];
  // 选择的设施类型
  public deviceTypeListValue: string[] = [];
  // 选择模板的title
  public templateTitle: string;
  // 设施选择数量
  public selectNumber: number;
  // 过滤事件
  private filterEvent: FilterCondition[];
  // 查询条件
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // 区域列表
  private areaList = {
    ids: [],
    name: ''
  };
  public alarmList = {
    ids: [],
    name: ''
  };
  // 页面类型
  private currentPageType: CurrentPageTypeEnum = CurrentPageTypeEnum.alarmType;
  // 区分新增模板或者更新模板
  private type: OperateTypeEnum = OperateTypeEnum.add;
  // 修改的模板ID
  private updateParamsId: string;

  constructor(
    public $router: Router,
    private $ruleUtil: RuleUtil,
    public $nzI18n: NzI18nService,
    public $alarmStatisticalService: AlarmStatisticalService,
    public $message: FiLinkModalService,
    private $dateHelper: DateHelperService,
  ) {
    // 设施类型
    // this.deviceTypeList = CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n) as any[];
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.templateListConfig();
    // 区域
    this.initAreaConfig();
    // 筛选当前用户权限可查看的设施类型
    // this.deviceTypeList = StatisticalUtil.getUserCanLookDeviceType(this.deviceTypeList);
    this.deviceTypeList = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
  }

  /**
   * 点击取消
   */
  public cancelText(): void {
    this.display.templateTable = false;
    this.resultAndClose.emit();
  }

  /**
   * 翻页查询
   */
  public pageTemplateChange(event: PageModel): void {
    this.queryCondition.filterConditions = this.filterEvent;
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryTemplateData();
  }

  /**
   * 点击确认
   */
  public okText(): void {
    this.resultAndClose.emit(this.selectedAlarm);
  }

  /**
   * 选择列表数据
   * param event
   * param data
   */
  public selectedAlarmChange(event: string, data: StatisticalTemplateModel): void {
    // 防止数据不变 克隆一份对象
    this.selectedAlarm = _.cloneDeep(data);
  }

  /**
   * 新增表单
   */
  public initForm(): void {
    this.formColumn = [
      {
        // 模板名称
        label: this.language.templateName,
        key: 'templateName',
        type: 'input',
        require: true,
        width: 300,
        col: 24,
        rule: [
          {required: true},
          RuleUtil.getNameMaxLengthRule(),
        ],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$alarmStatisticalService.checkAlarmStatisticalName(value, this.updateParamsId),
            res => res.code === ResultCodeEnum.success)
        ],
      },
      {
        // 区域
        label: this.language.area,
        key: 'areaNameList',
        type: 'custom',
        width: 300,
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: this.areaSelector,
      }, {
        // 设施类型
        label: this.language.alarmSourceType,
        key: 'alarmSourceTypeId',
        type: this.equipmentIsRadio ? 'select' : 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        selectInfo: this.equipmentIsRadio ? {
          data: FacilityForCommonUtil.getRoleFacility(this.$nzI18n),
          label: 'label', value: 'code',
        } : null,
        template: this.equipmentIsRadio ? '' : this.addDeviceTypeTemp
      }, {
        // 时间
        label: this.language.time,
        key: 'time',
        type: 'custom',
        width: 300,
        template: this.recentlyTimeTemp,
        require: true,
        rule: [{required: true}],
        asyncRules: []
      }
    ];
    if (this.bool) {
      this.formColumn.push(
        {
          // 设施类型
          label: this.language.alarm,
          key: 'alarmName',
          type: 'custom',
          require: true,
          width: 300,
          rule: [{required: true}],
          asyncRules: [],
          template: this.alarmNameTemp,
        }
      );
    }
  }

  /**
   * 关闭弹框
   */
  public closePopUp(): void {
    this.display.creationTemplate = false;
    this.areaList = {
      ids: [],
      name: ''
    };
    this.initAreaConfig();
    this.timeModel.recentlyTimeModel = [];
    this.deviceTypeListValue = [];
  }

  /**
   * 创建工单弹框this.timeModel.recentlyTimeModel
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
  }

  /**
   * 最近发生时间
   */
  public recentlyTimeChange(event): void {
    this.timeModel.recentlyTimeModel = event;
    this.formStatus.resetControlData('time', this.timeModel.recentlyTimeModel);
  }

  /**
   * 设施类型改变时
   */
  public deviceTypeChange(event): void {
    this.formStatus.resetControlData('alarmSourceTypeId', event);
  }

  /**
   * 最近打开时间改变时
   */
  public recentlyTimeOnOpenChange(event) {
    if (event) {
      return;
    }
    if (+this.timeModel.recentlyTimeModel[0] > +this.timeModel.recentlyTimeModel[1]) {
      this.timeModel.recentlyTimeModel = [];
      this.$message.warning(this.language.timeMsg);
    }
    // 关闭时 避免时间控件的一些非常规操作 重新赋值下
    this.timeModel.recentlyTimeModel = this.timeModel.recentlyTimeModel.slice();
  }

  /**
   * 禁用时间
   * param {Date} current
   * returns {boolean}
   */
  public disabledEndDate = (current: Date): boolean => {
    const nowTime = new Date();
    return differenceInCalendarDays(current, nowTime) > 0;
  }

  /**
   * 打开告警名称选择弹窗
   */
  public showAlarmNameSelect(): void {
    this.alarmNameSelectVisible = true;
  }

  /**
   * 选择告警名称
   * @param event 选择的告警数据
   */
  public onSelectAlarmName(event: AlarmNameListModel[]): void {
    const obj = {
      selectAlarmCodes: [],
      ids: [],
      alarmNames: []
    };
    event.forEach((item: AlarmNameListModel) => {
      obj['selectAlarmCodes'].push(item.alarmCode);
      obj['ids'].push(item.id);
      obj['alarmNames'].push(item.alarmName);
    });
    this.selectAlarmData = Object.assign(this.selectAlarmData, obj);
    this.selectAlarms = event;
    this.alarmName = this.selectAlarmData.alarmNames.toString();
    this.formStatus.resetControlData('alarmName', this.alarmName);
  }

  /**
   * 新增和编辑模板
   */
  public submitWork(): void {
    const alarmObj = this.formStatus.getData();
    let deviceIds;
    if (typeof(alarmObj.alarmSourceTypeId) === 'string') {
      deviceIds = [alarmObj.alarmSourceTypeId];
    } else {
      deviceIds = alarmObj.alarmSourceTypeId;
    }
    const data = {
      id: this.updateParamsId,
      pageType: this.currentPageType,
      templateName: alarmObj.templateName,
      condition: JSON.stringify({
        beginTime: +this.timeModel.recentlyTimeModel[0],
        endTime: +this.timeModel.recentlyTimeModel[1],
        // deviceIds: this.equipmentIsRadio ? [this.formStatus.getData('alarmSourceTypeId')] : this.deviceTypeListValue,
        deviceIds: deviceIds,
        areaList: this.areaList,
        alarmList: this.selectAlarmData,
      })
    };
    if (this.type === OperateTypeEnum.add) {
      // 新增
      this.$alarmStatisticalService.addAlarmStatisticalTemplate(data).subscribe((res: ResultModel<any>) => {
        if (res.code === 0) {
          this.$message.success(res.msg);
          this.display.creationTemplate = false;
          this.queryTemplateData();
        }
      });
    } else {
      // 编辑
      this.$alarmStatisticalService.updateAlarmStatisticalTemplate(data).subscribe((res: ResultModel<any>) => {
        if (res.code === 0) {
          this.$message.success(res.msg);
          this.display.creationTemplate = false;
          this.queryTemplateData();
        }
      });
    }

  }

  /**
   * 初始化区域配置
   * param data
   */
  private initAreaConfig(): void {
    const clear = !this.areaList.ids.length;
    this.areaConfig = {
      type: AlarmSelectorConfigTypeEnum.form,
      initialValue: this.areaList,
      clear: clear,
      handledCheckedFun: (event) => {
        this.areaList = event;
        const names = this.areaList.name.split(',');
        const areaNameList = this.areaList.ids.map((id, index) => {
          return {'areaName': names[index], 'areaId': id};
        });
        this.formStatus.resetControlData('areaNameList', areaNameList);
      }
    };
  }

  /**
   * 获取模板列表信息
   */
  private queryTemplateData() {
    this.$alarmStatisticalService.alarmStatisticalList(this.currentPageType).subscribe((res: ResultModel<StatisticalTemplateModel[]>) => {
      if (res.code === 0) {
        if (res.data && res.data.length) {
          this.dataSetTemplate = res.data.map(item => {
            if (item.condition) {
              item.condition = JSON.parse(item.condition as any);
            }
            item.areaNames = item.condition.areaList.name;
            item.alarmName = item.condition.alarmList ? item.condition.alarmList.alarmNames.join(',') : '';
            if (typeof (item.condition.deviceIds) === 'string') {
              item.condition.deviceIds = [item.condition.deviceIds];
            }
            item.alarmForwardRuleDeviceTypeList = item.condition.deviceIds.map(type => {
              return CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n, type);
            });
            item.time = this.$dateHelper.format(new Date(Number(item.condition.beginTime)),
              DateFormatStringEnum.DATE_FORMAT_STRING_SIMPLE) + '~' + this.$dateHelper.format(new Date(Number(item.condition.endTime)),
              DateFormatStringEnum.DATE_FORMAT_STRING_SIMPLE);
            return item;
          });
        } else {
          this.dataSetTemplate = [];
        }
      }
    });
  }

  /**
   * 模板列表
   */
  private templateListConfig(): void {
    const columnConfig = [
      {
        title: '',
        type: 'render',
        renderTemplate: this.radioTemp,
        fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 42
      },
      {
        type: 'serial-number', width: 52, title: this.language.serialNumber,
        fixedStyle: {fixedLeft: true, style: {left: '0px'}}
      },
      {
        // 模板名称
        title: this.language.templateName, key: 'templateName',
        width: 100,
        fixedStyle: {fixedLeft: true, style: {left: '0px'}}
      },
      {
        // 区域
        title: this.language.area,
        key: 'areaNames', width: 150,
      },
      {
        // 设施类型
        title: this.language.alarmSourceType,
        key: 'alarmForwardRuleDeviceTypeList', width: 100,
        renderTemplate: this.deviceTypeTemp,
      },
      {
        // 时间
        title: this.language.time,
        key: 'time', width: 400,
      },
      {
        title: this.language.operate, searchable: true,
        searchConfig: {type: 'operate'}, key: '', width: 80, fixedStyle: {fixedRight: true, style: {right: '0px'}}
      },
    ];
    if (this.bool) {
      columnConfig.splice(3, 0, {
        // 区域
        title: this.language.alarmName,
        key: 'alarmName', width: 150,
      });
    }
    this.tableConfigTemplate = {
      isDraggable: true,
      isLoading: false,
      showSizeChanger: true,
      noIndex: true,
      notShowPrint: true,
      scroll: {x: '800px', y: '300px'},
      columnConfig: columnConfig,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Object',
      topButtons: [
        {
          // 新增
          text: this.language.add,
          iconClassName: 'fiLink-add-no-circle',
          handle: () => {
            // 初始化数据
            this.areaList = {
              ids: [],
              name: ''
            };
            this.type = OperateTypeEnum.add;
            this.alarmName = '';
            this.areaConfig.initialValue = this.areaList;
            this.deviceTypeListValue = [];
            this.timeModel.recentlyTimeModel = [];
            // 初始化表单
            this.initForm();
            this.display.creationTemplate = true;
            this.templateTitle = this.language.addStatisticalTemplate;
          }
        }
      ],
      operation: [
        {
          // 编辑
          text: this.language.update,
          className: 'fiLink-edit',
          handle: (currentIndex) => {
            this.type = OperateTypeEnum.update;
            this.templateTitle = this.language.updateStatisticalTemplate;
            this.queryAlarmTempId(currentIndex.id);
          }
        },
        {
          text: this.language.deleteHandle,
          needConfirm: true,
          className: 'fiLink-delete red-icon',
          handle: (data) => {
            const ids = data.id;
            if (ids) {
              this.$alarmStatisticalService.deleteAlarmStatistical([ids]).subscribe((res: ResultModel<any>) => {
                if (res.code === 0) {
                  this.queryTemplateData();
                  this.$message.success(res.msg);
                } else {
                  this.$message.info(res.msg);
                }
              });
            }
          }
        },
      ],
      leftBottomButtons: [],
      sort: (event: SortCondition) => {
        this.queryCondition.filterConditions = this.filterEvent;
        this.queryCondition.bizCondition.sortField = event.sortField;
        this.queryCondition.bizCondition.sortRule = event.sortRule;
        this.queryTemplateData();
      },
    };
  }

  /**
   * 通过ID查询告警模板信息
   */
  private queryAlarmTempId(id: string[]): void {
    this.initForm();
    this.$alarmStatisticalService.queryAlarmStatByTempId(id).subscribe((res: ResultModel<StatisticalTemplateModel>) => {
      if (res.code === 0) {
        this.display.creationTemplate = true;
        const alarmData = res.data;
        this.updateParamsId = alarmData.id;
        const conditionData = JSON.parse(alarmData.condition as any);
        this.timeModel.recentlyTimeModel = [new Date(conditionData.beginTime), new Date(conditionData.endTime)];
        this.formStatus.resetControlData('time', this.timeModel.recentlyTimeModel);
        if (typeof(conditionData.deviceIds) === 'string') {
          this.deviceTypeListValue = [conditionData.deviceIds];
        } else {
          this.deviceTypeListValue = conditionData.deviceIds;
        }
        this.formStatus.resetControlData('alarmSourceTypeId', this.deviceTypeListValue);
        this.areaList = conditionData.areaList;
        // 区域
        this.initAreaConfig();
        const areaNameList = conditionData.areaList.name.split(',');
        if ( this.bool ) {
          this.alarmName = conditionData.alarmList ? conditionData.alarmList.alarmNames.join(',') : '';
          const ids = conditionData.alarmList.ids.map((item, index) => {
            return {
              id: item,
              alarmName: conditionData.alarmList.alarmNames[index],
              alarmCode: conditionData.alarmList.selectAlarmCodes[index],
              checked: true
            };
          });
          this.selectAlarms = ids;
          this.selectAlarmData = {
            // 选择的告警代码数组
            selectAlarmCodes:  conditionData.alarmList.selectAlarmCodes,
            // 选择的告警id数组
            ids: conditionData.alarmList.ids,
            // 选择的告警名称数组
            alarmNames: conditionData.alarmList.alarmNames
          };
          this.formStatus.resetControlData('alarmName', this.alarmName);
        }
        this.formStatus.resetControlData('templateName', alarmData.templateName);
        this.formStatus.resetControlData('areaNameList', areaNameList);
      }
    });
  }
}
