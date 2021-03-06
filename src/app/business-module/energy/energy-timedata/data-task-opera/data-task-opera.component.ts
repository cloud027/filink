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
  // ????????????
  @ViewChild('scopeOfApplication') private scopeOfApplication: TemplateRef<HTMLDocument>;
  // ????????????
  @ViewChild('equipmentTypeTemplate') equipmentTypeTemp: TemplateRef<HTMLDocument>;
  //  ??????????????????
  @ViewChild('equipmentStatusTemplate') equipmentStatusFilterTemp: TemplateRef<HTMLDocument>;
  // ??????????????????
  @ViewChild('facilityTemplate') deviceFilterTemplate: TemplateRef<HTMLDocument>;

  // ??????????????????
  @ViewChild('areaTableTemp') areaTableTemp: TabAreaorComponent;
  // ????????? ??????????????????
  @ViewChild('areaTableModelTemp') areaTableModelTemp;

  // ?????? ????????????
  @ViewChild('groupTableTemp') groupTableTemp: GroupComponent;
  // ????????? ??????????????????
  @ViewChild('groupTableModelTemp') groupTableModelTemp: GroupComponent;

  // ?????? ????????????
  @ViewChild('equipmentTableTemp') equipmentTableTemp: EquipmentComponent;
  // ?????? ??????????????????
  @ViewChild('equipmentTableModelTemp') equipmentTableModelTemp: EquipmentComponent;

  // ????????????
  @ViewChild('startEndTime') private startEndTime: TemplateRef<any>;

  // ????????????????????????
  @Output() public getFormDisabled = new EventEmitter<boolean>();

  pageLoading: boolean = false;
  // ????????????
  public pageTitle: string;
  // ????????????????????????????????????
  public operateType: string = SwitchPageToTableEnum.insert;
  // ????????????
  // ??????id??????
  areaIds: Array<string> = [];
  // ??????id??????
  groupIds: Array<string> = [];
  // ??????id??????
  equipmentIds: Array<string> = [];

  /** ???????????? */
  public dateRange: Array<Date> = [];

  SwitchPageToTable = SwitchPageToTableEnum;

  public formColumn: FormItem[] = [];
  // ????????????
  public isDisabled: boolean = true;
  // ????????????
  formStatus: FormOperate;
  // ??????????????????
  @Output() public getFormStatus = new EventEmitter<FormOperate>();
  // ??????????????? ?????????
  acquisitionCycleValue: collectionTaskCycleEnum = collectionTaskCycleEnum.dayByDay;
  collectionTaskCycleEnum = collectionTaskCycleEnum;
  // ????????????
  public showGroupViewDetail: boolean = false;
  public currentGroup: GroupListModel;

  // ????????????
  public isVisible: boolean = false;
  public selectedTab = TabTypeEnum.equipment;
  public areaSelectedData: any[] = [];
  public groupSelectedData: any[] = [];
  public equipmentSelectedData: any[] = [];

  // ????????????
  dataTaskInsertData = {
    areaList: [],
    groupList: [],
    equipmentList: [],
  };
  // id
  strategyId: string;

  // ??????????????????
  public equipmentStatusEnum = EquipmentStatusEnum;

  public language: EnergyLanguageInterface;
  // ???????????????
  public formLanguage: FormLanguageInterface;
  public commonLanguage: CommonLanguageInterface;
  public equipmentLanguage: FacilityLanguageInterface;
  // ?????????????????????
  public languageEnum = LanguageEnum;
  // ??????????????????
  public equipmentTypeEnum = EquipmentTypeEnum;
  // ?????????????????????
  public languageTable: ApplicationInterface;
  // ????????????
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
    // ?????????????????????
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.equipmentLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.$active.queryParams.subscribe((params) => {
      this.operateType = params.id ? SwitchPageToTableEnum.edit : SwitchPageToTableEnum.insert;
      // ????????????????????? ???????????????????????????
      this.pageTitle = params.id
        ? this.language.UpdateDataAcquisitionTask
        : this.language.InsertDataAcquisitionTask;

      this.handelInit(params);
    });
  }

  /**
   * ????????????????????????????????????????????????????????????
   */
  private handelInit(params): void {
    const isEdit = this.operateType === SwitchPageToTableEnum.edit ? true : false;
    // ???????????????
    this.initColumn();
    if (isEdit) {
      this.strategyId = params.id;
      // ????????????
      this.queryDetailById();
    }
  }

  // ?????????????????????
  private initColumn(): void {
    this.formColumn = [
      {
        // ??????
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
      // ?????????
      {
        label: this.languageTable.strategyList.effectivePeriodTime,
        key: 'effectivePeriodTime',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: this.startEndTime,
      },
      /** ???????????? */
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
      /** ???????????? */
      {
        label: this.language.collectionTime,
        key: 'execTime',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: this.collectionTime,
      },
      // ???????????? 0/1 (??????/??????)
      {
        label: this.language.enableStatus,
        key: 'strategyStatus',
        type: 'custom',
        rule: [],
        initialValue: '1',
        asyncRules: [],
        template: this.enableStatus,
      },
      // ??????
      {
        label: this.language.remarks,
        key: 'remark',
        type: 'textarea',
        col: 24,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      // ????????????
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

  // ??????????????????
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    // ????????????
    event.instance.group.statusChanges.subscribe(() => {
      this.isDisabled = !event.instance.getRealValid();
      this.getFormDisabled.emit(this.isDisabled);
    });
    this.getFormStatus.emit(this.formStatus);
  }

  // ????????????
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
   * ?????????????????????????????????
   * ????????????????????????????????????
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

  /** ???????????? ???????????? ???????????? */
  editEchoForm(params: EnergyTaskCollectionOpeartionModel) {
    // ????????????
    this.formStatus.resetControlData('strategyName', params.strategyName);
    // ????????????
    this.formStatus.resetControlData('execType', params.execType);

    /** ????????? */
    this.formStatus.resetControlData('effectivePeriodTime', true);

    this.dateRange = [new Date(params.effectivePeriodStart), new Date(params.effectivePeriodEnd)];

    // ???????????????????????????
    this.formStatus.resetControlData('execTime', new Date(params.execTime));
    // ????????????
    this.formStatus.resetControlData('strategyStatus', params.strategyStatus);
    // ??????
    this.formStatus.resetControlData('remark', params.remark);
    this.strategyStatus = params.strategyStatus;
    // ????????????
    this.formStatus.resetControlData('scopeOfApplication', true);
  }

  // ??????????????????
  radioChange(value) {
    this.formStatus.resetControlData('strategyStatus', value);
  }

  // ??????????????????
  chooseApplication() {
    this.isVisible = true;
    // ?????? Tab ??????
    this.selectedTab = TabTypeEnum.equipment;
  }

  // ????????????????????????
  public handleTableOk(): void {
    this.isVisible = false;

    // ??????
    const areaTableModelData: any = this.areaTableModelTemp;
    const getAreaTableSelectedData: [] = areaTableModelData.getDataChecked();

    this.areaSelectedData = getAreaTableSelectedData;
    this.dataTaskInsertData.areaList = getAreaTableSelectedData;
    setTimeout(() => {
      if (this.areaTableTemp) {
        this.areaTableTemp.init_tableList(this.areaSelectedData);
      }
    });

    // ??????
    const groupTableModelData = this.groupTableModelTemp;
    const getGroupTableSelectedData: [] = groupTableModelData.getDataChecked();
    this.groupSelectedData = getGroupTableSelectedData;
    this.dataTaskInsertData.groupList = getGroupTableSelectedData;
    setTimeout(() => {
      if (this.groupTableTemp) {
        this.groupTableTemp.init_tableList(this.groupSelectedData);
      }
    });

    // ??????
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

  // ????????????????????????
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

  // ???????????? ???????????? ????????????
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

  // ??????
  public handleCleanUp() {
    this.areaTableModelTemp.tableClearSelected();
    this.groupTableModelTemp.tableClearSelected();
    this.equipmentTableModelTemp.tableClearSelected();
  }

  // ????????????
  addFacility() {
    const formValue = _.cloneDeep(this.formStatus.group.getRawValue());
    const areaData = _.cloneDeep(this.areaSelectedData);
    const groupData = _.cloneDeep(this.groupSelectedData);
    const equipmentData = _.cloneDeep(this.equipmentSelectedData);
    const submitForm: EnergyTaskCollectionOpeartionModel = {
      // ????????????
      controlType: '1',
      strategyType: '6',
      // ?????????
      createUser: localStorage.getItem('userName'),
      // ????????????
      strategyName: formValue.strategyName,
      // ????????????
      execType: formValue.execType,
      // ?????????????????????
      effectivePeriodStart: `${new Date(
        CommonUtil.dateFmt(TimeFormatEnum.startTime, new Date(this.dateRange[0])),
      ).getTime()}`,
      effectivePeriodEnd: `${new Date(
        CommonUtil.dateFmt(TimeFormatEnum.endTime, new Date(this.dateRange[1])),
      ).getTime()}`,
      execTime: `${new Date(formValue.execTime).getTime()}`,
      // ????????????
      strategyStatus: formValue.strategyStatus,
      remark: formValue.remark,
      // ????????????
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
    // ??????
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

  // ????????????
  goBack() {
    this.$router.navigateByUrl('/business/energy/energy-collect');
  }

  /**
   * ?????????
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
   * ?????????????????????????????????
   * @ param current
   */
  public disabledEndDate(current: Date): boolean {
    const nowTime = new Date();
    return differenceInCalendarDays(current, nowTime) < 0 || CommonUtil.checkTimeOver(current);
  }
}
