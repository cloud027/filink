import {Component, OnInit, ViewChild, TemplateRef, Output, EventEmitter} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {NzI18nService, NzMessageService} from 'ng-zorro-antd';
import _ from 'lodash';

import {differenceInCalendarDays} from 'date-fns';

import {EnergyLanguageInterface} from '../../../../../assets/i18n/energy/energy.language.interface';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';

import {FormLanguageInterface} from '../../../../../assets/i18n/form/form.language.interface';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {TabTypeEnum} from '../../../../core-module/enum/tab-type.enum';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {GroupListModel} from '../../../application-system/share/model/equipment.model';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {ApplicationInterface} from '../../../../../assets/i18n/application/application.interface';
import {EnergyApiService} from '../../share/service/energy/energy-api.service';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {
  EquipmentStatusEnum,
  EquipmentTypeEnum,
} from '../../../../core-module/enum/equipment/equipment.enum';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {TabAreaorComponent} from './components/tab-areaor/tab-areaor.component';
import {GroupComponent} from './components/group/group.component';
import {EquipmentComponent} from './components/equipment/equipment.component';
import {
  InsertCollectionTaskRefType,
  collectionTaskCycleEnum,
  SwitchPageToTableEnum,
  ApplicationScopeTableEnum,
} from '../../share/enum/energy-config.enum';
import {EnergyTaskCollectionOpeartionModel} from '../../share/model/energy-task-collection-opeartion.model';
import {listFmt} from '../../share/utils/tool.util';
import {TimeFormatEnum} from '../../../../shared-module/enum/time-format.enum';

@Component({
  selector: 'app-data-task-opera',
  templateUrl: './data-task-opera.component.html',
  styleUrls: ['./data-task-opera.component.scss'],
})
export class DataTaskOperaComponent implements OnInit {
  @ViewChild('enableStatus') private enableStatus: TemplateRef<HTMLDocument>;
  @ViewChild('collectionTime') private collectionTime: TemplateRef<HTMLDocument>;
  // 应用范围
  @ViewChild('scopeOfApplication') private scopeOfApplication: TemplateRef<HTMLDocument>;
  // 设备类型
  @ViewChild('equipmentTypeTemplate') equipmentTypeTemp: TemplateRef<HTMLDocument>;
  //  设备状态模版
  @ViewChild('equipmentStatusTemplate') equipmentStatusFilterTemp: TemplateRef<HTMLDocument>;
  // 设施过滤模版
  @ViewChild('facilityTemplate') deviceFilterTemplate: TemplateRef<HTMLDocument>;

  // 区域组件实体
  @ViewChild('areaTableTemp') areaTableTemp: TabAreaorComponent;
  // 弹出框 区域组件实体
  @ViewChild('areaTableModelTemp') areaTableModelTemp;

  // 分组 组件实体
  @ViewChild('groupTableTemp') groupTableTemp: GroupComponent;
  // 弹出框 分组组件实体
  @ViewChild('groupTableModelTemp') groupTableModelTemp: GroupComponent;

  // 设备 组件实体
  @ViewChild('equipmentTableTemp') equipmentTableTemp: EquipmentComponent;
  // 弹框 分组组件实体
  @ViewChild('equipmentTableModelTemp') equipmentTableModelTemp: EquipmentComponent;

  // 有效时间
  @ViewChild('startEndTime') private startEndTime: TemplateRef<any>;

  // 表单是否可以提交
  @Output() public getFormDisabled = new EventEmitter<boolean>();

  pageLoading: boolean = false;
  // 页面标题
  public pageTitle: string;
  // 页面操作类型，新增或编辑
  public operateType: string = SwitchPageToTableEnum.insert;
  // 详情数据
  // 区域id集合
  areaIds: Array<string> = [];
  // 分组id集合
  groupIds: Array<string> = [];
  // 设备id集合
  equipmentIds: Array<string> = [];

  /** 时间选择 */
  public dateRange: Array<Date> = [];

  SwitchPageToTable = SwitchPageToTableEnum;

  public formColumn: FormItem[] = [];
  // 表单校验
  public isDisabled: boolean = true;
  // 表单操作
  formStatus: FormOperate;
  // 获取表单实例
  @Output() public getFormStatus = new EventEmitter<FormOperate>();
  // 采集周期的 选择值
  acquisitionCycleValue: collectionTaskCycleEnum = collectionTaskCycleEnum.dayByDay;
  collectionTaskCycleEnum = collectionTaskCycleEnum;
  // 分组详情
  public showGroupViewDetail: boolean = false;
  public currentGroup: GroupListModel;

  // 应用范围
  public isVisible: boolean = false;
  public selectedTab = TabTypeEnum.equipment;
  public areaSelectedData: any[] = [];
  public groupSelectedData: any[] = [];
  public equipmentSelectedData: any[] = [];

  // 数据合集
  dataTaskInsertData = {
    areaList: [],
    groupList: [],
    equipmentList: [],
  };
  // id
  strategyId: string;

  // 设备状态枚举
  public equipmentStatusEnum = EquipmentStatusEnum;

  public language: EnergyLanguageInterface;
  // 表单语言包
  public formLanguage: FormLanguageInterface;
  public commonLanguage: CommonLanguageInterface;
  public equipmentLanguage: FacilityLanguageInterface;
  // 国际化前缀枚举
  public languageEnum = LanguageEnum;
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 设备列表多语言
  public languageTable: ApplicationInterface;
  // 启用状态
  public strategyStatus: string = '1';

  constructor(
    private $nzI18n: NzI18nService,
    private $message: NzMessageService,
    private $active: ActivatedRoute,
    private $router: Router,
    private $ruleUtil: RuleUtil,
    private $energyApiService: EnergyApiService,
  ) {
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.energy);
    this.formLanguage = this.$nzI18n.getLocaleData(LanguageEnum.form);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // 表格多语言配置
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.equipmentLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.$active.queryParams.subscribe((params) => {
      this.operateType = params.id ? SwitchPageToTableEnum.edit : SwitchPageToTableEnum.insert;
      // 根据页面的操作 设置新增编辑的标题
      this.pageTitle = params.id
        ? this.language.UpdateDataAcquisitionTask
        : this.language.InsertDataAcquisitionTask;

      this.handelInit(params);
    });
  }

  /**
   * 跳转到页面之后进行新增或者编辑的路由参数
   */
  private handelInit(params): void {
    const isEdit = this.operateType === SwitchPageToTableEnum.edit ? true : false;
    // 初始化表单
    this.initColumn();
    if (isEdit) {
      this.strategyId = params.id;
      // 查询详情
      this.queryDetailById();
    }
  }

  // 初始化表单配置
  private initColumn(): void {
    this.formColumn = [
      {
        // 名称
        label: this.language.taskName,
        key: 'strategyName',
        type: 'input',
        require: true,
        rule: [{required: true}, RuleUtil.getNameMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(
            (value) =>
              this.$energyApiService.queryCollectionNameIsExist_API({
                strategyId: this.strategyId,
                strategyName: value,
              }),
            (res) => res.data,
          ),
        ],
      },
      // 有效期
      {
        label: this.languageTable.strategyList.effectivePeriodTime,
        key: 'effectivePeriodTime',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: this.startEndTime,
      },
      /** 采集周期 */
      {
        label: this.language.acquisitionCycle,
        key: 'execType',
        type: 'select',
        selectInfo: {
          data: CommonUtil.codeTranslate(collectionTaskCycleEnum, this.$nzI18n, null, 'energy'),
          label: 'label',
          value: 'code',
        },
        modelChange: (control, event) => {
          console.log(event, 'event');
          this.acquisitionCycleValue = event;
        },
        require: true,
        rule: [{required: true}],
        asyncRules: [],
      },
      /** 采集时间 */
      {
        label: this.language.collectionTime,
        key: 'execTime',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: this.collectionTime,
      },
      // 启用状态 0/1 (禁用/启用)
      {
        label: this.language.enableStatus,
        key: 'strategyStatus',
        type: 'custom',
        rule: [],
        initialValue: '1',
        asyncRules: [],
        template: this.enableStatus,
      },
      // 备注
      {
        label: this.language.remarks,
        key: 'remark',
        type: 'textarea',
        col: 24,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      // 应用范围
      {
        label: this.language.scopeOfApplication,
        key: 'scopeOfApplication',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: this.scopeOfApplication,
      },
    ];
  }

  // 获取表单实例
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    // 校验表单
    event.instance.group.statusChanges.subscribe(() => {
      this.isDisabled = !event.instance.getRealValid();
      this.getFormDisabled.emit(this.isDisabled);
    });
    this.getFormStatus.emit(this.formStatus);
  }

  // 查询详情
  queryDetailById() {
    this.pageLoading = true;
    this.$energyApiService
      .dataCollecttionTaskInfo_API({
        strategyId: this.strategyId,
      })
      .subscribe(
        (result: ResultModel<any>) => {
          console.log(result, 'result');
          this.pageLoading = false;
          if (result.code === ResultCodeEnum.success) {
            const strategyRefList = listFmt(result.data.strategyRefList);
            this.equipmentIds = strategyRefList.equipment.map((item) => item.refId);
            this.groupIds = strategyRefList.group.map((item) => item.refName);
            this.areaIds = strategyRefList.area.map((item) => item.refId);
            this.editEchoForm(result.data);
          } else {
            this.$message.error(result.msg);
          }
        },
        () => (this.pageLoading = false),
      );
  }

  /**
   * 逐月选择日期的禁用选择
   * 需禁用有效期范围外的时间
   */
  public MonthDisabledEndDate = (current: Date) => {
    if (this.dateRange.length) {
      const startTime = this.dateRange[0];
      const endTime = this.dateRange[1];
      return (
        differenceInCalendarDays(current, startTime) < 0 ||
        differenceInCalendarDays(current, endTime) > 0 ||
        CommonUtil.checkTimeOver(current)
      );
    } else {
      const nowTime = new Date();
      return differenceInCalendarDays(current, nowTime) < 0 || CommonUtil.checkTimeOver(current);
    }
  }

  /** 修改页面 根据数据 回显表单 */
  editEchoForm(params: EnergyTaskCollectionOpeartionModel) {
    // 任务名称
    this.formStatus.resetControlData('strategyName', params.strategyName);
    // 采集周期
    this.formStatus.resetControlData('execType', params.execType);

    /** 有效期 */
    this.formStatus.resetControlData('effectivePeriodTime', true);

    this.dateRange = [new Date(params.effectivePeriodStart), new Date(params.effectivePeriodEnd)];

    // 采集时间需要做处理
    this.formStatus.resetControlData('execTime', new Date(params.execTime));
    // 启用状态
    this.formStatus.resetControlData('strategyStatus', params.strategyStatus);
    // 备注
    this.formStatus.resetControlData('remark', params.remark);
    this.strategyStatus = params.strategyStatus;
    // 应用范围
    this.formStatus.resetControlData('scopeOfApplication', true);
  }

  // 启用状态修改
  radioChange(value) {
    this.formStatus.resetControlData('strategyStatus', value);
  }

  // 应用范围弹框
  chooseApplication() {
    this.isVisible = true;
    // 重置 Tab 状态
    this.selectedTab = TabTypeEnum.equipment;
  }

  // 确认选择应用范围
  public handleTableOk(): void {
    this.isVisible = false;

    // 区域
    const areaTableModelData: any = this.areaTableModelTemp;
    const getAreaTableSelectedData: [] = areaTableModelData.getDataChecked();

    this.areaSelectedData = getAreaTableSelectedData;
    this.dataTaskInsertData.areaList = getAreaTableSelectedData;
    setTimeout(() => {
      if (this.areaTableTemp) {
        this.areaTableTemp.init_tableList(this.areaSelectedData);
      }
    });

    // 分组
    const groupTableModelData = this.groupTableModelTemp;
    const getGroupTableSelectedData: [] = groupTableModelData.getDataChecked();
    this.groupSelectedData = getGroupTableSelectedData;
    this.dataTaskInsertData.groupList = getGroupTableSelectedData;
    setTimeout(() => {
      if (this.groupTableTemp) {
        this.groupTableTemp.init_tableList(this.groupSelectedData);
      }
    });

    // 设备
    const equipmentTableModelData = this.equipmentTableModelTemp;
    const getEquipmentTableSelectedData: [] = equipmentTableModelData.getDataChecked();
    this.equipmentSelectedData = getEquipmentTableSelectedData;
    this.dataTaskInsertData.equipmentList = getEquipmentTableSelectedData;
    setTimeout(() => {
      if (this.equipmentTableTemp) {
        this.equipmentTableTemp.init_tableList(this.equipmentSelectedData);
      }
    });
    if (
      getEquipmentTableSelectedData.length === 0 &&
      getAreaTableSelectedData.length === 0 &&
      getGroupTableSelectedData.length === 0
    ) {
      this.formStatus.resetControlData('scopeOfApplication', null);
    } else {
      this.formStatus.resetControlData('scopeOfApplication', true);
    }
    this.formStatus.group.updateValueAndValidity();
  }

  // 底部表格删除事件
  tableDeleteItem(event) {
    const {data, type} = event;
    if (type === ApplicationScopeTableEnum.area) {
      this.areaSelectedData = data;
    }
    if (type === ApplicationScopeTableEnum.group) {
      this.groupSelectedData = data;
    }
    if (type === ApplicationScopeTableEnum.equipment) {
      this.equipmentSelectedData = data;
    }
    if (
      this.areaSelectedData.length === 0 &&
      this.groupSelectedData.length === 0 &&
      this.equipmentSelectedData.length === 0
    ) {
      this.formStatus.resetControlData('scopeOfApplication', null);
    } else {
      this.formStatus.resetControlData('scopeOfApplication', true);
    }
    this.formStatus.group.updateValueAndValidity();
  }

  // 编辑页面 重新渲染 表格数据
  editPageChangeData(event) {
    console.log(event, 'event');
    const {data, type} = event;
    if (type === ApplicationScopeTableEnum.area) {
      if (data.length > 0) {
        this.areaSelectedData = data;
        this.areaTableTemp.init_tableList(this.areaSelectedData);
      }
    }
    if (type === ApplicationScopeTableEnum.group) {
      if (data.length > 0) {
        this.groupSelectedData = data;
        this.groupTableTemp.init_tableList(this.groupSelectedData);
      }
    }
    if (type === ApplicationScopeTableEnum.equipment) {
      if (data.length > 0) {
        this.equipmentSelectedData = data;
        this.equipmentTableTemp.init_tableList(this.equipmentSelectedData);
      }
    }
  }

  // 清空
  public handleCleanUp() {
    this.areaTableModelTemp.tableClearSelected();
    this.groupTableModelTemp.tableClearSelected();
    this.equipmentTableModelTemp.tableClearSelected();
  }

  // 确定按钮
  addFacility() {
    const formValue = _.cloneDeep(this.formStatus.group.getRawValue());
    const areaData = _.cloneDeep(this.areaSelectedData);
    const groupData = _.cloneDeep(this.groupSelectedData);
    const equipmentData = _.cloneDeep(this.equipmentSelectedData);
    const submitForm: EnergyTaskCollectionOpeartionModel = {
      // 固定参数
      controlType: '1',
      strategyType: '6',
      // 创建人
      createUser: localStorage.getItem('userName'),
      // 任务名称
      strategyName: formValue.strategyName,
      // 采集周期
      execType: formValue.execType,
      // 采集时间选择器
      effectivePeriodStart: `${new Date(
        CommonUtil.dateFmt(TimeFormatEnum.startTime, new Date(this.dateRange[0])),
      ).getTime()}`,
      effectivePeriodEnd: `${new Date(
        CommonUtil.dateFmt(TimeFormatEnum.endTime, new Date(this.dateRange[1])),
      ).getTime()}`,
      execTime: `${new Date(formValue.execTime).getTime()}`,
      // 启用状态
      strategyStatus: formValue.strategyStatus,
      remark: formValue.remark,
      // 应用范围
      strategyRefList: [],
    };
    const getAreaData = areaData.map((item) => {
      return {
        refName: item.areaName,
        refEquipmentType: '',
        refType: InsertCollectionTaskRefType.areaRefType,
        refId: item.areaId,
      };
    });
    const getGroupData = groupData.map((item) => {
      return {
        refName: item.groupName,
        refEquipmentType: item.groupType,
        refType: InsertCollectionTaskRefType.groupRefType,
        refId: item.groupId,
      };
    });
    const getEquipmentData = equipmentData.map((item) => {
      return {
        refName: item.equipmentName,
        refEquipmentType: item.equipmentType,
        refType: InsertCollectionTaskRefType.equipmentRefType,
        refId: item.equipmentId,
      };
    });
    if (this.operateType === SwitchPageToTableEnum.edit) {
      submitForm.strategyId = this.strategyId;
    }
    submitForm.strategyRefList = [...getAreaData, ...getGroupData, ...getEquipmentData];
    console.log(submitForm);
    // return
    // 新增
    this.pageLoading = true;
    if (this.operateType === SwitchPageToTableEnum.insert) {
      this.$energyApiService.dataCollectTaskInsert_API(submitForm).subscribe(
        (result: ResultModel<any>) => {
          console.log(result, 'result');
          if (result.code === ResultCodeEnum.success) {
            this.$message.success(this.commonLanguage.addSuccess);
            this.goBack();
          } else {
            this.$message.error(result.msg);
          }
          this.pageLoading = false;
        },
        () => (this.pageLoading = false),
      );
    } else if (this.operateType === SwitchPageToTableEnum.edit) {
      this.$energyApiService.dataCollectTaskUpdate_API(submitForm).subscribe(
        (result: ResultModel<any>) => {
          console.log(result, 'result');
          if (result.code === ResultCodeEnum.success) {
            this.$message.success(this.commonLanguage.updateSuccess);
            this.goBack();
          } else {
            this.$message.error(result.msg);
          }
          this.pageLoading = false;
        },
        () => (this.pageLoading = false),
      );
    }
  }

  // 取消按钮
  goBack() {
    this.$router.navigateByUrl('/business/energy/energy-collect');
  }

  /**
   * 有效期
   * @ param event
   */
  public onDateChange(event: Array<Date>): void {
    console.log(event, 'event');
    // if (event[0] >= event[1]) {
    //     this.$message.warning(this.commonLanguage.timeRangeErrorTip)
    //     event = []
    // }
    this.dateRange = event;
    this.formStatus.resetControlData('effectivePeriodTime', true);
  }

  /**
   * 禁止选中今天之前的时间
   * @ param current
   */
  public disabledEndDate(current: Date): boolean {
    const nowTime = new Date();
    return differenceInCalendarDays(current, nowTime) < 0 || CommonUtil.checkTimeOver(current);
  }
}
