import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormItem} from '../../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../../shared-module/component/form/form-operate.service';
import {NzI18nService} from 'ng-zorro-antd';
import {AlarmLanguageInterface} from '../../../../../../../assets/i18n/alarm/alarm-language.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {FiLinkModalService} from '../../../../../../shared-module/service/filink-modal/filink-modal.service';
import {AlarmService} from '../../../../share/service/alarm.service';
import {RuleUtil} from '../../../../../../shared-module/util/rule-util';
import {
  AlarmSelectorConfigModel,
  AlarmSelectorInitialValueModel,
} from '../../../../../../shared-module/model/alarm-selector-config.model';
import {TreeSelectorComponent} from '../../../../../../shared-module/component/tree-selector/tree-selector.component';
import {TreeSelectorConfigModel} from '../../../../../../shared-module/model/tree-selector-config.model';
import {FacilityLanguageInterface} from '../../../../../../../assets/i18n/facility/facility.language.interface';
import {ResultCodeEnum} from '../../../../../../shared-module/enum/result-code.enum';
import {LanguageEnum} from '../../../../../../shared-module/enum/language.enum';
import {CommonLanguageInterface} from '../../../../../../../assets/i18n/common/common.language.interface';
import {SessionUtil} from '../../../../../../shared-module/util/session-util';
import {FacilityForCommonUtil} from '../../../../../../core-module/business-util/facility/facility-for-common.util';
import {WorkOrderForCommonService} from '../../../../../../core-module/api-service/work-order/work-order-for-common.service';
import {FacilityForCommonService} from '../../../../../../core-module/api-service/facility/facility-for-common.service';
import {ResultModel} from '../../../../../../shared-module/model/result.model';
import {AlarmSelectorConfigTypeEnum} from '../../../../../../shared-module/enum/alarm-selector-config-type.enum';
import {OperateTypeEnum} from '../../../../../../shared-module/enum/page-operate-type.enum';
import {SelectModel} from '../../../../../../shared-module/model/select.model';
import {AlarmOrderModel} from '../../../../share/model/alarm-order.model';
import {AlarmEnableStatusEnum, AlarmIsConfirmEnum, AlarmTriggerTypeEnum, AlarmWorkOrderTypeEnum} from '../../../../share/enum/alarm.enum';
import {DepartmentUnitModel} from '../../../../../../core-module/model/work-order/department-unit.model';
import {AreaModel} from '../../../../../../core-module/model/facility/area.model';
import {AlarmUtil} from '../../../../share/util/alarm.util';
import {CommonUtil} from "../../../../../../shared-module/util/common-util";

/**
 * ????????????-??????????????? ?????????????????????
 */
@Component({
  selector: 'app-work-order-add',
  templateUrl: './work-order-add.component.html',
  styleUrls: ['./work-order-add.component.scss'],
})

export class WorkOrderAddComponent implements OnInit {
  // ????????????
  @ViewChild('isNoStartUsing') private isNoStartUsing;
  // ????????????
  @ViewChild('alarmName') private alarmName;
  // ??????
  @ViewChild('areaSelector') private areaSelector;
  // ????????????
  @ViewChild('deviceTypeTemp') private deviceTypeTemp;
  // ????????????
  @ViewChild('accountabilityUnit') private accountabilityUnitTep;
  // ?????????????????????
  @ViewChild('unitTreeSelector') private unitTreeSelector: TreeSelectorComponent;
  // ????????????
  @ViewChild('equipmentTypeTemp') private equipmentTypeTemp: TemplateRef<any>;
  // ???????????????
  public commonLanguage: CommonLanguageInterface;
  // ???????????????????????????
  public formColumn: FormItem[] = [];
  // ???????????????????????????
  public formStatus: FormOperate;
  // ???????????????
  public language: AlarmLanguageInterface;
  // ???????????????
  public facilityLanguage: FacilityLanguageInterface;
  // ???????????? ?????? ??????
  public isNoStartData: boolean = true;
  // ?????????????????????
  public isLoading: boolean = false;
  // ??????
  public title: string = '';
  // ??????????????????
  public alarmNameConfig: AlarmSelectorConfigModel;
  // ??????????????????
  public deviceTypeList: SelectModel[] = [];
  // ?????????????????????
  public deviceTypeListValue: SelectModel[] = [];
  // ????????????????????????
  public equipmentTypeList: SelectModel[] = [];
  // ??????????????????
  public equipmentTypeListValue: string[] = [];
  // ??????????????????
  public unitDisabled: boolean = false;
  // ????????????????????????
  public isVisible: boolean = false;
  // ?????????????????????
  public treeSelectorConfig: TreeSelectorConfigModel;
  // ???????????????????????????
  public selectUnitName: string = '';
  // ????????????
  public areaName: string = '';
  // ??????????????????
  public areaSelectVisible: boolean = false;
  // ???????????????????????????
  public areaSelectorConfig: TreeSelectorConfigModel = new TreeSelectorConfigModel();
  // ??????????????????
  public isSubmit: boolean;
  // ????????????
  private pageType: OperateTypeEnum = OperateTypeEnum.add;
  // ??????Id
  private areaId: string[] = [];
  // ??????code
  private areaCode: string[] = [];
  // ??????????????????
  private areaNodes: AreaModel[] = [];
  // ?????????????????????
  private checkAlarmName: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // ??????id
  private updateParamsId: string;
  // ??????????????????
  private treeNodes: DepartmentUnitModel[] = [];
  // ??????????????????
  private echoDepartment: string;
  // ????????????????????????
  private department: string[] = [];
  // ??????code
  private departmentCode: string;
  // ??????id
  private userId: string;
  // ?????????????????????
  private alarmOrderData: AlarmOrderModel;

  constructor(
    public $nzI18n: NzI18nService,
    public $message: FiLinkModalService,
    public $active: ActivatedRoute,
    public $router: Router,
    public $alarmService: AlarmService,
    private $ruleUtil: RuleUtil,
    private $facilityForCommonService: FacilityForCommonService,
    private $inspectionService: WorkOrderForCommonService,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.facilityLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
  }

  public ngOnInit(): void {
    // ??????????????????????????????
    this.initTreeSelectorConfig();
    // ???????????????
    this.initForm();
    // ??????????????????????????????
    this.pageType = this.$active.snapshot.params.type;
    // ??????????????????
    if (SessionUtil.getToken()) {
      this.userId = SessionUtil.getUserInfo().id;
    }
    // ????????????????????????
    this.deviceTypeList = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
    // ????????????????????????
    this.equipmentTypeList = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n);
    if (this.pageType === OperateTypeEnum.add) {
      // ??????
      this.title = this.language.workOrderAdd;
      // ????????????
      this.initAlarmName();
      // ??????????????????
      this.$facilityForCommonService.queryAreaList().subscribe((res: ResultModel<AreaModel[]>) => {
        this.areaNodes = res.data || [];
        this.initAreaSelectorConfig();
      });
    } else {
      // ??????
      this.title = this.language.workOrderUpdate;
      this.$active.queryParams.subscribe(params => {
        this.updateParamsId = params.id;
        this.getAlarmData(params.id);
      });
    }
  }

  /**
   * ??????????????????
   */
  public formInstance(event: { instance: FormOperate }) {
    this.formStatus = event.instance;
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isSubmit = this.formStatus.getValid();
    });
  }

  /**
   * ???????????????????????????
   */
  public showModal(): void {
    this.queryDeptList().then(deptData => {
      if (deptData) {
        this.treeSelectorConfig.treeNodes = this.treeNodes;
        this.isVisible = true;
      }
    });
  }

  /**
   * ????????????????????????
   * param event
   */
  public selectDataChange(event: DepartmentUnitModel[]) {
    this.selectUnitName = '';
    // ??????????????????
    const selectArr = event.map(item => {
      this.selectUnitName += `${item.deptName},`;
      return item.id;
    });
    // ??????????????????code
    if (event[0]) {
      this.departmentCode = event[0].deptCode;
    } else {
      this.departmentCode = '';
    }
    // ????????????????????????
    this.selectUnitName = this.selectUnitName.substring(0, this.selectUnitName.length - 1);
    // ??????????????????
    FacilityForCommonUtil.setTreeNodesStatus(this.treeNodes, selectArr);
    if (selectArr.length === 0) {
      this.echoDepartment = '';
    } else {
      this.echoDepartment = selectArr[0];
    }
    this.formStatus.resetControlData('departmentId', selectArr[0]);
  }

  /**
   * ??????
   */
  public cancel(): void {
    this.$router.navigate(['business/alarm/alarm-work-order']).then();
  }

  /**
   *?????????????????????
   */
  public deviceTypeChange(event: string[]) {
    this.formStatus.resetControlData('deviceType', event);
  }

  /**
   * ?????????????????????
   */
  public onSearchEquipmentType(event: string[]) {
    this.formStatus.resetControlData('alarmOrderRuleEquipmentTypeList', event);
  }

  /**
   *????????????
   */
  public submit(): void {
    this.isLoading = true;
    const alarmObj: AlarmOrderModel = this.formStatus.getData();
    alarmObj.orderName = alarmObj.orderName.trim();
    alarmObj.remark = alarmObj.remark && alarmObj.remark.trim();
    // ??????????????? ??????????????????
    alarmObj.status = this.isNoStartData ? AlarmEnableStatusEnum.enable : AlarmEnableStatusEnum.disable;
    alarmObj.departmentCode = this.departmentCode;
    alarmObj.departmentName = this.selectUnitName;
    // ????????????
    alarmObj.alarmOrderRuleDeviceTypeList = this.deviceTypeListValue.map(deviceTypeId => {
      return {'deviceTypeId': deviceTypeId};
    });
    alarmObj.alarmOrderRuleEquipmentTypeList = this.equipmentTypeListValue.map(equipmentTypeId => {
      return {'equipmentTypeId': equipmentTypeId};
    });
    let requestPath: string = '';
    if (this.pageType === OperateTypeEnum.add) {
      // ??????
      requestPath = 'addAlarmWork';
    } else {
      // ??????
      alarmObj.id = this.updateParamsId;
      requestPath = 'updateAlarmWork';
    }
    this.$alarmService[requestPath](alarmObj).subscribe((res: ResultModel<string>) => {
      this.isLoading = false;
      if (res && res.code === 0) {
        this.$message.success(res.msg);
        this.$router.navigate(['business/alarm/alarm-work-order']).then();
      }
    }, error => {
      this.isLoading = false;
    });
  }

  /**
   * ?????????????????????
   */
  public showAreaSelectorModal(): void {
    FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, this.areaId.toString(), null);
    this.areaSelectorConfig.treeNodes = this.areaNodes;
    this.areaSelectVisible = true;
  }

  /**
   * ??????????????????
   * param event
   */
  public areaSelectChange(event: AreaModel): void {
    if (event[0]) {
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, event[0].areaId, null);
      this.areaName = event[0].areaName;
      this.areaId = [event[0].areaId];
      this.areaCode = [event[0].areaCode];
      this.formStatus.resetControlData('alarmOrderRuleArea', [event[0].areaId]);
      // ??????????????????
      this.selectUnitName = '';
      this.echoDepartment = '';
      this.formStatus.resetControlData('departmentId', null);
    } else {
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, null, null);
      this.areaName = '';
      this.areaId = [];
      this.formStatus.resetControlData('alarmOrderRuleArea', null);
    }
  }
  /**
   * ??????????????????????????????
   * param nodes
   */
  private initAreaSelectorConfig(): void {
    this.areaSelectorConfig = {
      title: this.language.area,
      width: '500px',
      height: '300px',
      treeNodes: this.areaSelectorConfig.treeNodes,
      treeSetting: {
        check: {
          enable: true,
          chkStyle: 'radio',
          radioType: 'all',
        },
        data: {
          simpleData: {
            enable: false,
            idKey: 'areaId',
          },
          key: {
            name: 'areaName',
          },
        },
        view: {
          showIcon: false,
          showLine: false,
        },
      },
      onlyLeaves: false,
      selectedColumn: [],
    };
  }

  /**
   * ???????????????????????????????????????
   */
  private initTreeSelectorConfig(): void {
    this.treeSelectorConfig = {
      title: this.language.selectUnit,
      width: '500px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting: {
        check: {
          enable: true,
          chkStyle: 'radio',
          radioType: 'all',
        },
        data: {
          simpleData: {
            enable: false,
            idKey: 'id',
          },
          key: {
            name: 'deptName',
            children: 'childDepartmentList',
          },
        },
        view: {
          showIcon: false,
          showLine: false,
        },
      },
      onlyLeaves: false,
      selectedColumn: [
        {
          title: `${this.facilityLanguage.deptName}`, key: 'deptName', width: 100,
        },
        {
          title: `${this.facilityLanguage.deptLevel}`, key: 'deptLevel', width: 100,
        },
        {
          title: `${this.facilityLanguage.parentDept}`, key: 'parentDepartmentName', width: 100,
        },
      ],
    };
  }

  /**
   * ????????????ID??????????????????
   */
  private queryDeptList(): Promise<DepartmentUnitModel[]> {
    return new Promise((resolve, reject) => {
      if (this.areaId && this.areaId.length > 0) {
        this.$inspectionService.alarmQueryResponsibilityUnit(this.areaId).subscribe((result: ResultModel<DepartmentUnitModel[]>) => {
          if (result.code === ResultCodeEnum.success) {
            const arrDept = result.data || [];
            this.department = [];
            this.department.push(this.echoDepartment);
            FacilityForCommonUtil.setTreeNodesStatus(arrDept, this.department);
            this.department = [];
            this.treeNodes = arrDept;
            resolve(arrDept);
          }
        });
      } else {
        this.isVisible = false;
        this.$message.info(`${this.commonLanguage.pleaseSelectTheAreaInformationFirstTip}`);
      }
    });
  }

  /**
   * ??????????????????
   */
  private initAlarmName(): void {
    this.alarmNameConfig = {
      type: AlarmSelectorConfigTypeEnum.form,
      initialValue: this.checkAlarmName,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.checkAlarmName = event;
        this.formStatus.resetControlData('alarmOrderRuleNameList', event.ids);
      },
    };
  }

  /**
   * ?????????????????????
   */
  private getAlarmData(id: string): void {
    this.$alarmService.queryAlarmWorkById(id).subscribe((res: ResultModel<AlarmOrderModel>) => {
      if (res.code === 0) {
        const alarmData = res.data[0];
        const areaIds = [];
        // ??????????????????
        if (alarmData.alarmOrderRuleNameList && alarmData.alarmOrderRuleNameList.length) {
          const alarmName = alarmData.alarmOrderRuleNames.join(',');
          this.checkAlarmName = new AlarmSelectorInitialValueModel(alarmName, alarmData.alarmOrderRuleNameList);
          this.formStatus.resetControlData('alarmOrderRuleNameList', alarmData.alarmOrderRuleNameList);
        }
        // ?????????????????????id
        alarmData.alarmOrderRuleArea.forEach(areaId => {
          if (areaIds.indexOf(areaId) === -1) {
            areaIds.push(areaId);
          }
        });
        alarmData.alarmOrderRuleAreaName = [];
        // ??????AreaID??????AreaName
        AlarmUtil.getAreaName(this.$alarmService, areaIds).then((result: AreaModel[]) => {
          AlarmUtil.joinAlarmWorkOrderForwardRuleAreaName([this.alarmOrderData], result);
          this.checkAlarmName.name = this.alarmOrderData.areaName;
          // ?????????????????????
          this.areaName = this.alarmOrderData.areaName;
          this.areaCode = result.map(item => item.areaCode);
        });
        // ????????????
        this.initAlarmName();
        // ????????????
        if (alarmData.alarmOrderRuleDeviceTypeList && alarmData.alarmOrderRuleDeviceTypeList.length) {
          this.deviceTypeListValue = alarmData.alarmOrderRuleDeviceTypeList.map(deviceType => deviceType.deviceTypeId);
          alarmData.deviceType = this.deviceTypeListValue;
        }
        // ????????????
        if (alarmData.alarmOrderRuleEquipmentTypeList && alarmData.alarmOrderRuleEquipmentTypeList.length) {
          this.equipmentTypeListValue = alarmData.alarmOrderRuleEquipmentTypeList.map(equipmentType => equipmentType.equipmentTypeId);
          alarmData.deviceType = this.deviceTypeListValue;
        }
        // ?????? ????????????
        if (alarmData.status) {
          this.isNoStartData = alarmData.status === AlarmEnableStatusEnum.enable;
        }
        // ??????
        if (alarmData.alarmOrderRuleArea && alarmData.alarmOrderRuleArea.length) {
          this.$facilityForCommonService.queryAreaList().subscribe((result: ResultModel<AreaModel[]>) => {
            this.areaNodes = result.data || [];
            // ????????????
            FacilityForCommonUtil.setTreeNodesStatus(this.areaNodes, alarmData.alarmOrderRuleArea);
            this.initAreaSelectorConfig();
          });
        }
        // ??????????????????
        alarmData.autoDispatch = (alarmData.autoDispatch === AlarmIsConfirmEnum.yes) ? alarmData.autoDispatch : AlarmIsConfirmEnum.no;
        this.alarmOrderData = alarmData;
        this.formStatus.resetData(alarmData);
        // ????????????????????????
        this.selectUnitName = res.data[0].departmentName;
        // ??????????????????????????????code
        this.departmentCode = res.data[0].departmentCode;
        // ????????????
        this.areaId = res.data[0].alarmOrderRuleArea;
        // ??????????????????
        this.echoDepartment = res.data[0].departmentId;
      }
    });
  }

  /**
   * ??????
   */
  private initForm(): void {
    this.formColumn = [
      {
        // ??????
        label: this.language.name,
        key: 'orderName',
        type: 'input',
        require: true,
        rule: [
          {required: true},
          RuleUtil.getNameMinLengthRule(),
          RuleUtil.getNameMaxLengthRule(),
          RuleUtil.getNamePatternRule(this.commonLanguage.namePattenMsg),
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule((value) => {
            return this.$inspectionService.queryAlarmNameExist(CommonUtil.trim(value));
          }, (res) => res.data)
        ],
      },
      {
        // ????????????
        label: this.language.alarmName,
        key: 'alarmOrderRuleNameList',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: this.alarmName,
      },
      {
        // ????????????
        label: this.language.workOrderType,
        key: 'orderType',
        type: 'select',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        selectInfo: {
          data: [
            {label: this.language.eliminateWork, value: AlarmWorkOrderTypeEnum.eliminateWork},
          ],
          label: 'label',
          value: 'value',
        },
      },
      {
        // ??????
        label: this.language.area,
        key: 'alarmOrderRuleArea', type: 'custom',
        template: this.areaSelector,
        require: true,
        rule: [{required: true}], asyncRules: [],
      },
      {
        // ????????????
        label: this.language.alarmSourceType, key: 'deviceType',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: this.deviceTypeTemp,
      },
      {
        // ????????????
        label: this.language.equipmentType, key: 'alarmOrderRuleEquipmentTypeList',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: this.equipmentTypeTemp,
      },
      {
        // ????????????
        label: this.language.triggerCondition,
        key: 'triggerType',
        type: 'select',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        selectInfo: {
          data: [
            {label: this.language.alarmHappenedTrigger, value: AlarmTriggerTypeEnum.alarmHappenedTrigger},
          ],
          label: 'label',
          value: 'value',
        },
      },
      {
        // ??????????????????(???)
        label: this.language.expectAccomplishTime,
        key: 'completionTime',
        type: 'input',
        require: true,
        initialValue: 3,
        rule: [
          {required: true},
          {min: 1},
          {max: 365},
          {
            pattern: /^\+?[1-9][0-9]*$/,
            msg: this.language.positiveInteger,
          },
        ],
      },
      {
        // ????????????
        label: this.language.openStatus,
        key: 'status',
        type: 'custom',
        template: this.isNoStartUsing,
        initialValue: this.isNoStartData,
        require: true,
        rule: [],
        asyncRules: [],
        radioInfo: {
          type: 'select', selectInfo: [
            {label: this.language.disable, value: AlarmEnableStatusEnum.disable},
            {label: this.language.enable, value: AlarmEnableStatusEnum.enable},
          ],
        },
      },
      { // ??????????????????
        label: this.language.isAutoDispatch,
        key: 'autoDispatch', type: 'radio',
        require: true,
        rule: [{required: true}],
        initialValue: AlarmIsConfirmEnum.no,
        radioInfo: {
          data: [
            {label: this.language.yes, value: AlarmIsConfirmEnum.yes}, // ???
            {label: this.language.no, value: AlarmIsConfirmEnum.no}, // ???
          ],
          label: 'label', value: 'value'
        },
      },
      {
        // ????????????
        label: this.language.responsibleUnit,
        key: 'departmentId',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: this.accountabilityUnitTep,
      },
      {
        label: this.language.remark,
        key: 'remark',
        type: 'input',
        rule: [
          this.$ruleUtil.getRemarkMaxLengthRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
    ];
  }
}
