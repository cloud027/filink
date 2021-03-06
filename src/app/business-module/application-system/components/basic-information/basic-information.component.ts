import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import * as _ from 'lodash';
import {differenceInCalendarDays} from 'date-fns';
import {Observable} from 'rxjs';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {NzI18nService} from 'ng-zorro-antd';
import {OnlineLanguageInterface} from '../../../../../assets/i18n/online/online-language.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {ApplicationService} from '../../share/service/application.service';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {TabTypeEnum} from '../../../../core-module/enum/tab-type.enum';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {ApplicationInterface} from '../../../../../assets/i18n/application/application.interface';
import {ApplicationFinalConst, StrategyListConst} from '../../share/const/application-system.const';
import {LoopModel} from '../../share/model/loop.model';
import {CheckSelectService} from '../../share/service/check.select.service';
import {StrategyListModel, StrategyRefListModel} from '../../share/model/policy.control.model';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {ExecStatusEnum, FormTypeEnum, PolicyEnum, StrategyStatusEnum} from '../../share/enum/policy.enum';
import {FormConfig} from '../../share/config/form.config';
import {GroupListModel} from '../../share/model/equipment.model';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {FilterValueConst} from '../../share/const/filter.const';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {OperationButtonEnum} from '../../share/enum/operation-button.enum';
import {InstructConfig} from '../../share/config/instruct.config';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';
import {CameraTypeEnum, EquipmentStatusEnum, EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {AssetManagementLanguageInterface} from '../../../../../assets/i18n/asset-manage/asset-management.language.interface';
import {ExecTypeEnum} from '../../../../core-module/enum/equipment/policy.enum';
import {listFmt} from '../../share/util/tool.util';
import {LoopUtil} from '../../share/util/loop-util';
import {FormControl} from '@angular/forms';
import {FacilityListModel} from '../../../../core-module/model/facility/facility-list.model';
import {BasicInformationModel} from '../../share/model/basic-information.model';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {LoopStatusEnum, LoopTypeEnum} from '../../../../core-module/enum/loop/loop.enum';
import {AsyncRuleUtil} from '../../../../shared-module/util/async-rule-util';

@Component({
  selector: 'app-basic-information',
  templateUrl: './basic-information.component.html',
  styleUrls: ['./basic-information.component.scss']
})
export class BasicInformationComponent implements OnInit, OnDestroy, OnChanges {
  // ???????????????????????????
  @Input() basicInfo: string;
  @Input() linkageType: boolean = false;
  // ??????form??????
  @Input()
  public stepsFirstParams: StrategyListModel;
  // ????????????????????????
  @Input()
  public isScope: boolean = false;
  // ??????????????????
  @ViewChild('facilityTemplate')
  deviceFilterTemplate: TemplateRef<HTMLDocument>;
  //  ??????????????????
  @ViewChild('equipmentStatusTemp') equipmentStatusFilterTemp: TemplateRef<HTMLDocument>;
  // ????????????
  @ViewChild('equipmentTypeTemp') equipmentTypeTemp: TemplateRef<HTMLDocument>;
  // ????????????
  public isVisible: boolean = false;
  // ?????????????????????
  public facilityVisible: boolean = false;
  // ?????????????????????
  public applicationFinal = ApplicationFinalConst;
  // ????????????
  public interval: boolean = true;
  // ????????????????????????
  public filterDeviceName: string = '';
  // ????????????
  public dateRange: Array<Date> = [];
  // ?????????????????????
  public selectFacility: FacilityListModel[] = [];
  // ?????????
  public implement: boolean = true;
  // form????????????
  public formColumn: FormItem[];
  // ????????????
  public strategyStatus: boolean = false;
  // ?????????????????????
  public isDisabled: boolean = false;
  // ??????????????????
  public strategyRefList: StrategyRefListModel[] = [];
  // ??????????????????
  public selectUnitName: string;
  // ????????????
  public filterValue: FilterCondition;
  // ??????????????????
  public dataSet: EquipmentListModel[] = [];
  // ????????????
  public pageBean: PageModel = new PageModel();
  // ??????????????????
  public pageBeanGroup: PageModel = new PageModel();
  // ??????????????????
  public pageBeanLoop: PageModel = new PageModel();
  // ????????????
  public tableConfig: TableConfigModel;
  // ??????????????????
  public groupTable: TableConfigModel;
  // ????????????
  public groupData: GroupListModel[] = [];
  // ??????????????????
  public loopTable: TableConfigModel;
  // ??????????????????
  public loopData: LoopModel[] = [];
  // ???????????????
  public language: OnlineLanguageInterface;
  // ?????????????????????
  public languageTable: ApplicationInterface;
  // ??????id
  public strategyId: string = '';
  // form??????
  public formStatus: FormOperate;
  public equipmentLanguage: FacilityLanguageInterface;
  // ??????????????????
  public equipmentStatusEnum = EquipmentStatusEnum;
  public equipmentTypeEnum = EquipmentTypeEnum;
  public languageEnum = LanguageEnum;
  public commonLanguage: CommonLanguageInterface;
  // ?????????????????????
  public assetsLanguage: AssetManagementLanguageInterface;
  strategyType = StrategyListConst;
  public selectedTab = TabTypeEnum.equipment;
  public selectedEquipment: any[] = [];
  public selectedGroup: any[] = [];
  public selectedLoop: any[] = [];
  public currentGroup: GroupListModel;
  public showGroupViewDetail: boolean = false;
  @Output()
  private formValid = new EventEmitter<boolean>();
  // ????????????
  @ViewChild('startEndTime')
  private startEndTime: TemplateRef<any>;
  // ????????????
  @ViewChild('execTime')
  private execTime: TemplateRef<any>;
  // ????????????
  @ViewChild('enableStatus')
  private enableStatus: TemplateRef<any>;
  // ????????????
  @ViewChild('applicationScope')
  private applicationScope: TemplateRef<any>;
  // ????????????
  @ViewChild('equipment')
  private equipment;
  // ????????????
  @ViewChild('group')
  private group;
  // ????????????
  @ViewChild('loop')
  private loop;
  // ????????????????????????
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // ??????????????????
  private queryConditionGroup: QueryConditionModel = new QueryConditionModel();
  // ??????????????????
  private queryConditionLoop: QueryConditionModel = new QueryConditionModel();

  private strategyRefListObject: BasicInformationModel;
  // ?????????????????????flag
  private isFirstEnter: boolean = false;
  // ????????????????????????
  private equipmentStatusSelect: any;

  constructor(
    // ?????????
    private $nzI18n: NzI18nService,
    // ??????
    private $message: FiLinkModalService,
    // ???????????????
    private $checkSelect: CheckSelectService,
    // ????????????
    private $activatedRoute: ActivatedRoute,
    // ??????
    public $router: Router,
    // ??????
    private $ruleUtil: RuleUtil,
    // ????????????
    private $applicationService: ApplicationService,
    // ????????????
    private $asyncRuleUtil: AsyncRuleUtil,
  ) {
    // ?????????
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.online);
    // ?????????????????????
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.equipmentLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.assetsLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);

  }

  public ngOnInit(): void {
    // ?????????????????????
    this.equipmentStatusSelect = CommonUtil.codeTranslate(EquipmentStatusEnum, this.$nzI18n, null, LanguageEnum.facility);
    this.equipmentStatusSelect = this.equipmentStatusSelect.filter(v => v.code !== EquipmentStatusEnum.dismantled);
    // ????????????
    this.initTableConfig();
    // ????????????id
    this.getActivatedRoute();
    // ????????????????????????
    this.equipmentCondition();
    // ??????????????????
    this.initGroupTable();
    // ??????????????????
    this.initLoopTable();
    // ??????form???????????????
    this.defaultConditions();
  }

  // ????????????????????????
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.stepsFirstParams && changes.stepsFirstParams.currentValue) {

      // ????????????????????????????????????
      if (this.stepsFirstParams && this.stepsFirstParams.execType === ExecTypeEnum.custom) {
        // ??????????????????????????????
        this.stepsFirstParams.execTime = new Date(this.stepsFirstParams.execTime);
      } else {
        this.stepsFirstParams.execTime = null;
      }
      // ???????????????????????????????????????
      if (this.stepsFirstParams.effectivePeriodStart && this.stepsFirstParams.effectivePeriodEnd) {
        // ???????????????
        this.dateRange = [
          CommonUtil.dateFmt(ApplicationFinalConst.dateType, new Date(this.stepsFirstParams.effectivePeriodStart)),
          CommonUtil.dateFmt(ApplicationFinalConst.dateType, new Date(this.stepsFirstParams.effectivePeriodEnd))
        ];
      }
      // ????????????????????????
      if (this.stepsFirstParams.strategyRefList) {
        this.selectUnitName = this.stepsFirstParams.strategyRefList.map(item => item.refName).join(',');
        this.strategyRefListObject = listFmt(this.stepsFirstParams.strategyRefList);
        this.strategyRefList = this.stepsFirstParams.strategyRefList;
      }
      // ????????????
      if (this.formStatus) {
        this.isFirstEnter = true;
        this.formStatus.resetData(this.stepsFirstParams);
        this.formStatus.resetControlData('effectivePeriodTime', this.stepsFirstParams.effectivePeriodStart);
        if (this.stepsFirstParams.strategyRefList && this.stepsFirstParams.strategyRefList.length) {
          this.formStatus.resetControlData('applicationScope', 'applicationScope');
        }
      }
    }
  }

  /**
   * ??????
   */
  public ngOnDestroy(): void {
    this.startEndTime = null;
    this.execTime = null;
    this.enableStatus = null;
    this.applicationScope = null;
    this.equipment = null;
    this.group = null;
    this.loop = null;
    this.deviceFilterTemplate = null;
  }

  /**
   * form??????
   * @ param event
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formStatus.group.statusChanges.subscribe(() => {
      this.formValid.emit(this.formStatus.getRealValid());
    });
    this.formStatus.group.valueChanges.subscribe(value => {
      Object.keys(value).forEach(key => {
        if (key === 'execTime' && value[key]) {
          if (!this.dateRange.length) {
            this.$message.warning(this.languageTable.strategyList.execTimeErrorTip);
            this.formStatus.group.get('execTime').setValue(null);
            this.formStatus.group.get('execTime').markAsPristine();
          }
        }
      });
    });
  }

  /**
   * ?????????????????????
   */
  public showDisabled(): void {
    const data = this.formStatus.group.getRawValue();
    const flag = data.strategyName &&
      data.strategyType &&
      this.dateRange &&
      this.selectUnitName &&
      data.execType &&
      data.controlType;
    if (data.execType === StrategyStatusEnum.linkage) {
      this.isDisabled = flag && data.intervalTime;
    } else if (data.execType === StrategyStatusEnum.execType) {
      this.isDisabled = flag && data.execTime;
    } else {
      this.isDisabled = flag;
    }
  }

  /**
   * ?????????
   * @ param event
   */
  public onDateChange(event: Array<Date>): void {
    if (event[0] >= event[1]) {
      this.$message.warning(this.commonLanguage.timeRangeErrorTip);
      event = [];
    }
    this.dateRange = event;
    this.formStatus.resetControlData('execTime', null);
    // ????????????????????????????????????????????? ?????????????????????????????????
    this.formStatus.resetControlData('intervalTime', null);
    this.formStatus.resetControlData('effectivePeriodTime', event);
  }

  /**
   * ?????????????????????????????????
   */
  public onShowFacility(value: FilterCondition): void {
    this.filterValue = value;
    if (!this.filterValue.filterValue) {
      this.filterValue.filterValue = [];
    }
    this.facilityVisible = true;
  }

  /**
   * ??????????????????
   */
  public onFacilityChange(event: FacilityListModel[]): void {
    this.selectFacility = event || [];
    if (!_.isEmpty(event)) {
      this.filterDeviceName = event.map(item => {
        return item.deviceName;
      }).join(',');
    } else {
      this.filterDeviceName = '';
    }
    this.filterValue.filterValue = event.map(item => {
      return item.deviceId;
    });
    this.filterValue.operator = OperatorEnum.in;
  }

  /**
   * ??????
   */
  public handleTableCancel(): void {
    this.isVisible = false;
  }

  /**
   * ????????????????????????
   */
  public handleTableOk(): void {
    const data = this.equipmentFormat();
    const groupData = this.groupFormat();
    const loopData = this.loopFormat();
    this.strategyRefList = data.concat(groupData, loopData);
    this.strategyRefListObject = listFmt(this.strategyRefList);
    this.selectUnitName = this.strategyRefList.map(item => item.refName).join(',');
    this.formStatus.resetControlData('applicationScope', this.selectUnitName);
    this.showDisabled();
    this.isVisible = false;
  }

  /**
   * ??????
   */
  public handleCleanUp() {
    const item = ['equipment', 'group', 'loop'][this.selectedTab];
    this[item].keepSelectedData.clear();
    this[item].updateSelectedData();
    this[item].checkStatus();
  }

  /**
   * ???????????????????????????
   */
  public showModal(): void {
    this.isVisible = true;
    // ?????? Tab ??????
    this.selectedTab = TabTypeEnum.equipment;
    // ????????????????????????
    this.tableConfig.showSearch = false;
    this.groupTable.showSearch = false;
    this.loopTable.showSearch = false;
    // ????????????
    this.queryCondition = new QueryConditionModel();
    this.refreshData();
    // ????????????
    this.queryConditionGroup = new QueryConditionModel();
    this.refreshGroup();
    if (this.stepsFirstParams.strategyType !== this.strategyType.information && this.stepsFirstParams.strategyType !== this.strategyType.broadcast) {
      // ????????????
      this.queryConditionLoop = new QueryConditionModel();
      this.refreshLoop();
    }
    this.selectedEquipment = this.strategyRefListObject.equipment.map(item => {
      return {equipmentName: item.refName, equipmentId: item.refId, equipmentType: item.refEquipmentType};
    });

    this.selectedGroup = this.strategyRefListObject.group.map(item => {
      return {groupName: item.refName, groupId: item.refId};
    });
    this.selectedLoop = this.strategyRefListObject.loop.map(item => {
      return {loopName: item.refName, loopId: item.refId};
    });
  }

  /**
   * ????????????????????????????????????????????????????????????
   * @ param val
   */
  public handChangeValue(val: string): void {
    if (val === ExecTypeEnum.intervalExecution) {
      this.setHidden(FormTypeEnum.intervalTime, false);
      this.formStatus.resetControlData(FormTypeEnum.execTime, null);
    } else if (val === ExecTypeEnum.custom) {
      this.setHidden(FormTypeEnum.execTime, false);
      this.formStatus.resetControlData(FormTypeEnum.intervalTime, null);
    } else {
      this.setHidden(FormTypeEnum.all);
      this.formStatus.resetControlData(FormTypeEnum.execTime, null);
      this.formStatus.resetControlData(FormTypeEnum.intervalTime, null);
    }
    this.formStatus.group.updateValueAndValidity();
  }

  /**
   * ????????????
   * @ param event
   */
  public pageGroupChange(event: PageModel): void {
    this.queryConditionGroup.pageCondition.pageNum = event.pageIndex;
    this.queryConditionGroup.pageCondition.pageSize = event.pageSize;
    this.refreshGroup();
  }

  /**
   * ????????????
   * @ param event
   */
  public pageLoopChange(event: PageModel): void {
    this.queryConditionLoop.pageCondition.pageNum = event.pageIndex;
    this.queryConditionLoop.pageCondition.pageSize = event.pageSize;
    this.refreshLoop();
  }

  /**
   * ?????????
   */
  public handNextSteps(): StrategyListModel {
    const data = this.formStatus.group.getRawValue();
    // ???????????????????????????????????????
    data.effectivePeriodStart = new Date(CommonUtil.dateFmt('yyyy/MM/dd 00:00:00', new Date(this.dateRange[0]))).getTime();
    data.effectivePeriodEnd = new Date(CommonUtil.dateFmt('yyyy/MM/dd 00:00:00', new Date(this.dateRange[1]))).getTime();
    data.strategyStatus = this.strategyStatus ? ExecStatusEnum.implement : ExecStatusEnum.free;
    data.createUser = localStorage.getItem('userName');
    if (data.strategyType !== StrategyListConst.linkage) {
      data.strategyRefList = this.strategyRefList;
    }
    if (data.execType === ExecTypeEnum.custom) {
      data.execTime = new Date(data.execTime).getTime();
    } else {
      data.execTime = null;
    }
    _.assign(this.stepsFirstParams, data);
    return data;
  }

  /**
   * ?????????????????????????????????
   * @ param current
   */
  public disabledEndDate(current: Date): boolean {
    const nowTime = new Date();
    return differenceInCalendarDays(current, nowTime) < 0 || CommonUtil.checkTimeOver(current);
  }

  /**
   * ???????????????????????????
   * ????????????????????????????????????
   * param current
   */
  public execTimeDisabledEndDate = (current: Date) => {
    if (this.dateRange.length) {
      const startTime = this.dateRange[0];
      const endTime = this.dateRange[1];
      return differenceInCalendarDays(current, startTime) < 0 || differenceInCalendarDays(current, endTime) > 0 || CommonUtil.checkTimeOver(current);
    } else {
      const nowTime = new Date();
      return differenceInCalendarDays(current, nowTime) < 0 || CommonUtil.checkTimeOver(current);
    }
  }


  /**
   * ??????form???????????????
   */
  private defaultConditions() {
    const url = this.$router.url;
    let controlType;
    controlType = url.includes(OperationButtonEnum.update);
    if (this.basicInfo === ApplicationFinalConst.lighting) {
      // form????????????
      this.stepsFirstParams.strategyType = StrategyListConst.lighting;
      this.initColumn(StrategyStatusEnum.lighting, !this.linkageType, controlType, null, false);
    } else if (this.basicInfo === ApplicationFinalConst.release) {
      this.stepsFirstParams.strategyType = StrategyListConst.information;
      this.initColumn(StrategyStatusEnum.information, !this.linkageType, controlType, null, false);
    } else if (this.basicInfo === ApplicationFinalConst.broadcast) {
      this.stepsFirstParams.strategyType = StrategyListConst.broadcast;
      this.initColumn(StrategyStatusEnum.broadcast, !this.linkageType, controlType, '1', true);
    } else {
      this.initColumn(null, controlType, controlType, null, false);
    }
  }

  /**
   * ????????????id
   */
  private getActivatedRoute(): void {
    this.$activatedRoute.queryParams.subscribe(queryParams => {
      if (queryParams.id) {
        this.strategyId = queryParams.id;
      }
    });
  }

  /**
   * ????????????????????????
   */
  private equipmentCondition(): void {
    this.queryCondition.filterConditions = [];
    let equipmentTypes;
    if (this.basicInfo === ApplicationFinalConst.lighting) {
      equipmentTypes = new FilterCondition(PolicyEnum.equipmentType, OperatorEnum.in, FilterValueConst.lightingFilter);
    } else if (this.basicInfo === ApplicationFinalConst.release) {
      equipmentTypes = new FilterCondition(PolicyEnum.equipmentType, OperatorEnum.in, FilterValueConst.informationFilter);
    } else if (this.basicInfo === ApplicationFinalConst.strategy) {
      equipmentTypes = new FilterCondition(PolicyEnum.equipmentType, OperatorEnum.in, FilterValueConst.allFilter);
    } else if (this.basicInfo === ApplicationFinalConst.broadcast) {
      equipmentTypes = new FilterCondition(PolicyEnum.equipmentType, OperatorEnum.in, FilterValueConst.broadcastFilter);
    }
    this.queryCondition.filterConditions.push(equipmentTypes);
  }

  /**
   * ????????????????????????????????????
   */
  private equipmentFormat(): StrategyRefListModel[] {
    const data = this.equipment && this.equipment.getDataChecked() || [];
    if (data.length) {
      return data.map(item => {
        return {
          refName: item.equipmentName,
          refEquipmentType: item.equipmentType,
          refType: StrategyStatusEnum.lighting,
          refId: item.equipmentId,
        };
      });
    }
    return data;
  }

  /**
   * ????????????????????????????????????
   */
  private groupFormat(): StrategyRefListModel[] {
    const groupData = this.group && this.group.getDataChecked() || [];
    if (groupData.length) {
      return groupData.map(item => {
        return {
          refName: item.groupName,
          refType: StrategyStatusEnum.centralizedControl,
          refId: item.groupId,
        };
      });
    }
    return groupData;
  }

  /**
   * ????????????????????????????????????
   */
  private loopFormat(): StrategyRefListModel[] {
    const loopData = this.loop && this.loop.getDataChecked() || [];
    if (loopData.length) {
      return loopData.map(item => {
        return {
          refName: item.loopName,
          refType: StrategyStatusEnum.information,
          refId: item.loopId,
        };
      });
    }
    return loopData;
  }

  /**
   * ?????????????????????
   * @ param key
   * @ param value
   * @ param hidden
   */
  private setHidden(keyValue: string, value?) {
    this.formColumn.forEach(item => {
      if (item.key === FormTypeEnum.intervalTime || item.key === FormTypeEnum.execTime) {
        item.hidden = true;
      }
    });
    if (keyValue !== FormTypeEnum.all) {
      const formItem: FormItem = this.formColumn.find(item => item.key === keyValue);
      formItem.hidden = value;
    }
  }

  /**
   * ?????????????????????
   * @ param key
   * @ param value
   */
  private setColumnHidden(key: string, value: boolean): void {
    const formColumn = this.formColumn.find(item => item.key === key);
    if (formColumn) {
      formColumn.hidden = value;
    }
  }

  /**
   * ????????????
   * @ param event
   */
  private pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * ?????????????????????
   */
  private initTableConfig(): void {
    const isShowEquipment = this.basicInfo === ApplicationFinalConst.release;
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1600px', y: '600px'},
      noIndex: true,
      notShowPrint: true,
      noAutoHeight: true,
      keepSelected: true,
      selectedIdKey: 'equipmentId',
      columnConfig: [
        {
          type: 'select',
          fixedStyle: {fixedLeft: true, style: {left: '0px'}},
          width: 62
        },
        // ??????
        {
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
        },
        // ????????????
        {
          title: this.languageTable.strategyList.equipmentName,
          key: 'equipmentName',
          width: 200,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // ????????????
        {
          title: this.languageTable.strategyList.equipmentCode,
          key: 'equipmentCode',
          width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        { // ??????
          title: this.equipmentLanguage.type,
          key: 'equipmentType',
          isShowSort: true,
          type: 'render',
          width: 160,
          searchable: true,
          renderTemplate: this.equipmentTypeTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n),
            label: 'label',
            value: 'code'
          }
        },
        { // ??????
          title: this.equipmentLanguage.status,
          key: 'equipmentStatus',
          width: 130,
          type: 'render',
          renderTemplate: this.equipmentStatusFilterTemp,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: this.equipmentStatusSelect,
            label: 'label',
            value: 'code'
          }
        },
        { // ??????
          title: this.equipmentLanguage.equipmentModel,
          key: 'equipmentModel',
          width: 125,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // ?????????
          title: this.equipmentLanguage.supplierName,
          key: 'supplier',
          width: 125,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // ????????????
          title: this.equipmentLanguage.scrapTime,
          key: 'scrapTime',
          width: 125,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // ????????????
          title: this.equipmentLanguage.affiliatedDevice,
          key: 'deviceName',
          searchKey: 'deviceId',
          width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {
            type: 'render',
            renderTemplate: this.deviceFilterTemplate
          },
        },
        { // ????????????
          title: this.equipmentLanguage.mountPosition,
          key: 'mountPosition',
          hidden: isShowEquipment,
          width: 100,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        // ??????
        {
          title: this.language.operate,
          searchConfig: {type: 'operate'},
          searchable: true,
          key: '',
          width: 100,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
      // ??????
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      // ??????
      handleSearch: (event: FilterCondition[]) => {
        if (!event.some(item => item.filterField === 'deviceId')) {
          this.filterDeviceName = '';
          this.selectFacility = [];
        }
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event.filter(item => item.filterField !== PolicyEnum.equipmentType);
        // ????????????????????????????????????
        const filterCondition = event.find(item => item.filterField === PolicyEnum.equipmentType);
        let tempValue = [];
        if (filterCondition) {
          if (this.stepsFirstParams.strategyType === this.strategyType.information) {
            // ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
            tempValue = _.intersection(filterCondition.filterValue, FilterValueConst.informationFilter);
          } else if (this.stepsFirstParams.strategyType === this.strategyType.lighting) {
            // ???????????????????????????????????????????????????????????????????????????????????????????????????????????????
            tempValue = _.intersection(filterCondition.filterValue, FilterValueConst.lightingFilter);
          }
          if (tempValue.length) {
            this.queryCondition.filterConditions.push(new FilterCondition(PolicyEnum.equipmentType, OperatorEnum.in, tempValue));
            this.refreshData(true);
          } else {
            // ?????????????????????????????????????????????????????????????????????
            this.dataSet = [];
          }
        } else {
          this.refreshData();
        }
      }
    };
  }

  /**
   * ??????????????????
   */
  private refreshData(isNeedAddEquipmentType: boolean = false): void {
    this.tableConfig.isLoading = true;
    // ??????????????????????????????????????????????????????????????????????????????
    if (!isNeedAddEquipmentType) {
      this.defaultQuery(this.queryCondition);
    }
    this.$applicationService.equipmentListByPage(this.queryCondition).subscribe((res: ResultModel<EquipmentListModel[]>) => {
      this.tableConfig.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        const {data, totalCount, pageNum, size} = res;
        this.dataSet = data || [];
        this.pageBean.Total = totalCount;
        this.pageBean.pageIndex = pageNum;
        this.pageBean.pageSize = size;
        this.dataSet.forEach(item => {
          // ??????????????????
          const iconStyle = CommonUtil.getEquipmentStatusIconClass(item.equipmentStatus, 'list');
          item.statusIconClass = iconStyle.iconClass;
          item.statusColorClass = iconStyle.colorClass;
          // ???????????????????????????
          let iconClass;
          if (item.equipmentType === EquipmentTypeEnum.camera && item.equipmentModelType === CameraTypeEnum.bCamera) {
            // ???????????????
            iconClass = `iconfont facility-icon fiLink-shexiangtou-qiuji camera-color`;
          } else {
            iconClass = CommonUtil.getEquipmentIconClassName(item.equipmentType);
          }
          item.iconClass = iconClass;
          // item.checked = this.strategyRefListObject.equipment.some(_item => _item.refId === item.equipmentId);
          item.deviceName = item.deviceInfo ? item.deviceInfo.deviceName : '';
        });
      } else {
        this.$message.error(res.msg);
      }

    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * form????????????
   */
  private initColumn(initialValue, flag, isShowControlType, initialControlType, controlTypeEnable): void {
    this.formColumn = [
      // ????????????
      {
        label: this.languageTable.strategyList.strategyName,
        key: 'strategyName',
        type: 'input',
        require: true,
        rule: [
          {required: true},
          {maxLength: 64},
          this.$ruleUtil.getSpecialCharacterReg()
        ],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value =>
              this.$applicationService.checkStrategyNameExist(
                {strategyId: this.strategyId, strategyName: value}),
            res => {
              return res.code !== ResultCodeEnum.z4042;
            })
        ],
      },
      // ????????????
      {
        label: this.languageTable.strategyList.strategyType,
        key: 'strategyType',
        initialValue: initialValue,
        disabled: flag,
        type: 'select',
        selectInfo: {
          data: FormConfig.formDataConfig(this.languageTable.policyControl),
          label: 'label',
          value: 'code'
        },
        modelChange: (controls, $event) => {
          this.basicInfo = $event;
          this.stepsFirstParams.strategyType = $event;
          if ($event === StrategyListConst.linkage) {
            this.setColumnHidden('applicationScope', true);
          } else {
            this.setColumnHidden('applicationScope', false);
          }
          if ($event === StrategyListConst.broadcast) {
            this.formStatus.resetControlData('controlType', '1');
            this.formStatus.group.controls['controlType'].disable();
          } else {
            this.formStatus.resetControlData('controlType', null);
            this.formStatus.group.controls['controlType'].enable();
          }
          // ????????????form????????????????????????modelChange ??????????????????
          if (!this.isFirstEnter) {
            // ??????????????????????????????????????????
            this.strategyRefList = [];
            this.strategyRefListObject = {loop: [], equipment: [], group: []};
            this.selectUnitName = '';
            this.formStatus.resetControlData('applicationScope', this.selectUnitName);
            // ??? flag ??????
            this.isFirstEnter = false;
          }
          this.formStatus.group.updateValueAndValidity();
          this.queryCondition.filterConditions = [];
          this.refreshData();
        },
        require: true,
        rule: [{required: true}],
        asyncRules: []
      },
      // ????????????
      {
        label: this.languageTable.strategyList.applicationScope,
        key: 'applicationScope',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        hidden: this.isScope,
        template: this.applicationScope
      },
      // ????????????
      {
        label: this.languageTable.strategyList.effectivePeriodTime,
        key: 'effectivePeriodTime',
        type: 'custom',
        require: true,
        rule: [
          {required: true}
        ],
        asyncRules: [],
        template: this.startEndTime
      },
      // ????????????
      {
        label: this.languageTable.strategyList.execCron,
        key: 'execType',
        type: 'select',
        selectInfo: {
          data: FormConfig.strategyDataConfig(this.languageTable.execType),
          label: 'label',
          value: 'code'
        },
        modelChange: (controls, $event) => {
          this.handChangeValue($event);
        },
        require: true,
        rule: [{required: true}],
        asyncRules: []
      },
      // ????????????
      {
        label: this.languageTable.strategyList.daysBetween,
        disabled: false,
        key: 'intervalTime',
        type: 'input',
        hidden: true,
        require: true,
        rule: [
          {required: true},
          this.$ruleUtil.mustInt()
        ],
        asyncRules: [
          {
            asyncRule: (control: FormControl) => {
              // ?????????????????????????????????
              return Observable.create(observer => {
                if (this.dateRange.length > 1) {
                  const date = this.dateRange;
                  const time = new Date(date[1]).getTime() - new Date(date[0]).getTime();
                  const day = Math.abs(time) / (1000 * 60 * 60 * 24);
                  if (day - control.value >= 0) {
                    observer.next(null);
                    observer.complete();
                  } else {
                    observer.next({error: true, duplicated: true});
                    observer.complete();
                  }
                } else {
                  observer.next(null);
                  observer.complete();
                }
              });
            },
            asyncCode: 'duplicated', msg: this.languageTable.strategyList.intervalTimeTips
          }
        ]
      },
      // ????????????
      {
        label: this.languageTable.strategyList.execution,
        key: 'execTime',
        type: 'custom',
        require: true,
        rule: [
          {required: true}
        ],
        asyncRules: [],
        hidden: true,
        template: this.execTime
      },
      // ?????????
      {
        label: this.languageTable.strategyList.applyUser,
        disabled: false,
        key: 'applyUser',
        type: 'input',
        rule: [
          {maxLength: 32},
          this.$ruleUtil.getLetterRule()
        ]
      },
      // ????????????
      {
        label: this.languageTable.strategyList.controlType,
        key: 'controlType',
        initialValue: initialControlType,
        disabled: controlTypeEnable,
        type: 'select',
        selectInfo: {
          data: FormConfig.controlDataConfig(this.languageTable.controlType),
          label: 'label',
          value: 'code'
        },
        require: true,
        rule: [{required: true}],
        asyncRules: []
      },
      // ????????????
      {
        label: this.languageTable.strategyList.enableStatus,
        key: 'strategyStatus',
        type: 'custom',
        rule: [],
        asyncRules: [],
        template: this.enableStatus
      },
      // ??????
      {
        label: this.languageTable.strategyList.remark,
        disabled: false,
        key: 'remark',
        type: 'textarea',
        rule: [{maxLength: 255}]
      }
    ];
  }

  /**
   * ??????????????????
   */
  private initGroupTable(): void {
    this.groupTable = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1600px', y: '600px'},
      noIndex: true,
      notShowPrint: true,
      noAutoHeight: true,
      keepSelected: true,
      selectedIdKey: 'groupId',
      columnConfig: [
        {
          type: 'select',
          fixedStyle: {fixedLeft: true, style: {left: '0px'}},
          width: 62
        },
        // ??????
        {
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        // ????????????
        {
          title: this.languageTable.equipmentTable.groupName,
          key: 'groupName',
          width: 300,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // ??????
        {
          title: this.languageTable.equipmentTable.remark,
          key: 'remark',
          width: 300,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // ??????
        {
          title: this.language.operate,
          searchConfig: {type: 'operate'},
          searchable: true,
          key: '',
          width: 100,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [],
      operation: [
        { // ????????????
          permissionCode: '03-9-3',
          text: this.equipmentLanguage.groupDetail, className: 'fiLink-view-detail',
          handle: (data: GroupListModel) => {
            this.currentGroup = data;
            this.showGroupViewDetail = true;
          },
        },
      ],
      // ??????
      sort: (event: SortCondition) => {
        this.queryConditionGroup.sortCondition.sortField = event.sortField;
        this.queryConditionGroup.sortCondition.sortRule = event.sortRule;
        this.refreshGroup();
      },
      // ??????
      handleSearch: (event: FilterCondition[]) => {
        this.queryConditionGroup.pageCondition.pageNum = 1;
        this.queryConditionGroup.filterConditions = event;
        this.refreshGroup();
      }
    };
  }

  /**
   * ??????????????????
   */
  private refreshGroup(): void {
    this.groupTable.isLoading = true;
    InstructConfig.defaultQuery(this.$router, this.queryConditionGroup, this.stepsFirstParams.strategyType);
    this.$applicationService.queryEquipmentGroupInfoList(this.queryConditionGroup)
      .subscribe((res: ResultModel<GroupListModel[]>) => {
        this.groupTable.isLoading = false;
        if (res.code === ResultCodeEnum.success) {
          const {data, totalCount, pageNum, size} = res;
          this.groupData = data || [];
          this.pageBeanGroup.Total = totalCount;
          this.pageBeanGroup.pageIndex = pageNum;
          this.pageBeanGroup.pageSize = size;
        } else {
          this.$message.error(res.msg);
        }
      }, () => {
        this.groupTable.isLoading = false;
      });
  }

  /**
   * ?????????????????????
   */
  private initLoopTable(): void {
    this.loopTable = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      showSizeChanger: true,
      scroll: {x: '1600px', y: '600px'},
      noIndex: true,
      notShowPrint: true,
      keepSelected: true,
      selectedIdKey: 'loopId',
      columnConfig: [
        {
          type: 'select',
          fixedStyle: {fixedLeft: true, style: {left: '0px'}},
          width: 62
        },
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // ????????????
          title: this.equipmentLanguage.loopName,
          key: 'loopName',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'},
        },
        { // ????????????
          title: this.assetsLanguage.loopCode,
          key: 'loopCode',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // ????????????
          title: this.equipmentLanguage.loopType,
          key: 'loopType',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: CommonUtil.codeTranslate(LoopTypeEnum, this.$nzI18n, null, LanguageEnum.facility),
            label: 'label',
            value: 'code'
          }
        },
        { // ????????????
          title: this.assetsLanguage.loopStatus,
          key: 'loopStatus',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            selectInfo: CommonUtil.codeTranslate(LoopStatusEnum, this.$nzI18n, null, LanguageEnum.facility),
            label: 'label',
            value: 'code'
          }
        },
        { // ???????????????
          title: this.equipmentLanguage.distributionBox,
          key: 'distributionBoxName',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // ????????????
          title: this.equipmentLanguage.controlledObject,
          key: 'centralizedControlName',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // ??????
          title: this.equipmentLanguage.remarks,
          key: 'remark',
          width: 150,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // ??????
          title: this.language.operate,
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '',
          width: 180,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [],
      operation: [],
      leftBottomButtons: [],
      // ??????
      sort: (event: SortCondition) => {
        this.queryConditionLoop.sortCondition.sortField = event.sortField;
        this.queryConditionLoop.sortCondition.sortRule = event.sortRule;
        this.refreshLoop();
      },
      // ??????
      handleSearch: (event: FilterCondition[]) => {
        this.queryConditionLoop.pageCondition.pageNum = 1;
        this.queryConditionLoop.filterConditions = event;
        this.refreshLoop();
      }
    };
  }


  /**
   * ??????????????????
   */
  private refreshLoop(): void {
    this.loopTable.isLoading = true;
    this.$applicationService.loopListByPage(this.queryConditionLoop).subscribe((res: ResultModel<LoopModel[]>) => {
      this.loopTable.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        const {data, totalCount, pageNum, size} = res;
        this.loopData = data || [];
        LoopUtil.loopFmt(this.loopData, this.$nzI18n);
        this.pageBeanLoop.Total = totalCount;
        this.pageBeanLoop.pageIndex = pageNum;
        this.pageBeanLoop.pageSize = size;
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.loopTable.isLoading = false;
    });
  }

  /**
   * ???????????????????????????????????????????????????????????????????????????
   */
  private defaultQuery(queryCondition) {
    let equipmentTypes;
    // ??????????????????
    if (this.stepsFirstParams.strategyType === this.strategyType.information) {
      equipmentTypes = new FilterCondition(PolicyEnum.equipmentType, OperatorEnum.in, FilterValueConst.informationFilter);
    } else if (this.stepsFirstParams.strategyType === this.strategyType.lighting) {
      // ????????????
      equipmentTypes = new FilterCondition(PolicyEnum.equipmentType, OperatorEnum.in, FilterValueConst.lightingFilter);
    } else if (this.stepsFirstParams.strategyType === this.strategyType.linkage) {
      // ????????????
      equipmentTypes = new FilterCondition(PolicyEnum.equipmentType, OperatorEnum.in, FilterValueConst.allFilter);
    } else if (this.stepsFirstParams.strategyType === this.strategyType.broadcast) {
      // ????????????
      equipmentTypes = new FilterCondition(PolicyEnum.equipmentType, OperatorEnum.in, FilterValueConst.broadcastFilter);
    }
    queryCondition.filterConditions.push(equipmentTypes);
  }
}
