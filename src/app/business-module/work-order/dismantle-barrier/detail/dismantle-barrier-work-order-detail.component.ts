import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import _ from 'lodash';
import {
  initAlarmTableConfig,
  initUnitTreeConfig,
  initUnitTreeSelectConfig,
} from './detail-ref-alarm-table-util';
import { ActivatedRoute, Router } from '@angular/router';
import { FormItem } from '../../../../shared-module/component/form/form-config';
import { FormOperate } from '../../../../shared-module/component/form/form-operate.service';
import { NzI18nService, NzModalService, NzTreeNode } from 'ng-zorro-antd';
import { AbstractControl } from '@angular/forms';
import { Result } from '../../../../shared-module/entity/result';
import { DismantleBarrierWorkOrderService } from '../../share/service/dismantle-barrier';
import { RuleUtil } from '../../../../shared-module/util/rule-util';
import { FormLanguageInterface } from '../../../../../assets/i18n/form/form.language.interface';
import { PageModel } from '../../../../shared-module/model/page.model';
import {
  FilterCondition,
  QueryConditionModel,
} from '../../../../shared-module/model/query-condition.model';
import { TableConfigModel } from '../../../../shared-module/model/table-config.model';
import { AlarmLanguageInterface } from '../../../../../assets/i18n/alarm/alarm-language.interface';
import { AlarmForCommonService } from '../../../../core-module/api-service/alarm';
import { FiLinkModalService } from '../../../../shared-module/service/filink-modal/filink-modal.service';
import { CommonUtil } from '../../../../shared-module/util/common-util';
import { differenceInCalendarDays } from 'date-fns';
import { TreeSelectorConfigModel } from '../../../../shared-module/model/tree-selector-config.model';
import { UserForCommonService } from '../../../../core-module/api-service/user';
import { ResultModel } from '../../../../shared-module/model/result.model';
import { ClearBarrierWorkOrderModel } from '../../../../core-module/model/work-order/clear-barrier-work-order.model';
import { ResultCodeEnum } from '../../../../shared-module/enum/result-code.enum';
import { LanguageEnum } from '../../../../shared-module/enum/language.enum';
import {ClearBarrierOrInspectEnum, IsSelectAllEnum} from '../../share/enum/clear-barrier-work-order.enum';
import { WorkOrderPageTypeEnum } from '../../share/enum/work-order-page-type.enum';
import { DeviceTypeModel } from '../../share/model/device-type.model';
import { SelectAlarmModel } from '../../share/model/select-alarm.model';
import { FilterValueModel } from '../../../../core-module/model/work-order/filter-value.model';
import { DepartmentUnitModel } from '../../../../core-module/model/work-order/department-unit.model';
import { WorkOrderBusinessCommonUtil } from '../../share/util/work-order-business-common.util';
import { InspectionLanguageInterface } from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import { WorkOrderAlarmLevelColor } from '../../../../core-module/enum/trouble/trouble-common.enum';
import { AlarmForCommonUtil } from '../../../../core-module/business-util/alarm/alarm-for-common.util';
import { SelectModel } from '../../../../shared-module/model/select.model';
import { AlarmSelectorConfigModel } from '../../../../shared-module/model/alarm-selector-config.model';
import { SelectDeviceModel } from '../../../../core-module/model/facility/select-device.model';
import { InspectionWorkOrderService } from '../../share/service/inspection/inspection-work-order.service';
import { OperatorEnum } from '../../../../shared-module/enum/operator.enum';
import { AlarmStoreService } from '../../../../core-module/store/alarm.store.service';
import { EquipmentListModel } from '../../../../core-module/model/equipment/equipment-list.model';
import { RefAlarmFaultEnum } from '../../share/enum/refAlarm-faultt.enum';
import { RoleUnitModel } from '../../../../core-module/model/work-order/role-unit.model';
import { ClearWorkOrderEquipmentModel } from '../../share/model/clear-barrier-model/clear-work-order-equipment.model';
import { AreaModel } from '../../../../core-module/model/facility/area.model';
import { EquipmentApiService } from '../../../facility/share/service/equipment/equipment-api.service';
import {
  DismantleTypeEnum,
  DismantleWarnTroubleEnum,
  InsertOrDeleteEnum,
} from '../../share/enum/dismantle-barrier.config.enum';
import { DismantleBarrierInsertEditFormModel } from '../../share/model/dismantle-barrier-model/dismantle-barrier-insert-edit-form.model';
import { FacilityListModel } from '../../../../core-module/model/facility/facility-list.model';
import { FacilityForCommonUtil } from '../../../../core-module/business-util/facility/facility-for-common.util';
import { DeviceTypeEnum } from '../../../../core-module/enum/facility/facility.enum';
import { DismantleBarrierWorkOrderModel } from '../../share/model/dismantle-barrier-model/dismantle-barrier-work-order.model';
import { SelectEquipmentModel } from '../../../../core-module/model/equipment/select-equipment.model';
import { WorkOrderStatusEnum } from '../../../../core-module/enum/work-order/work-order-status.enum';

import { WorkOrderLanguageInterface } from '../../../../../assets/i18n/work-order/work-order.language.interface';
import { WorkOrderStatusUtil } from '../../../../core-module/business-util/work-order/work-order-for-common.util';
import { ClearBarrierWorkOrderService } from '../../share/service/clear-barrier';
import { AreaDeviceParamModel } from '../../../../core-module/model/work-order/area-device-param.model';
import { FacilityForCommonService } from '../../../../core-module/api-service/facility';
import { WorkOrderCommonServiceUtil } from '../../share/util/work-order-common-service.util';
import { WorkOrderInitTreeUtil } from '../../share/util/work-order-init-tree.util';

/**
 * ??????????????? ????????????
 */
@Component({
  selector: 'app-dismantle-barrier-work-order-detail',
  templateUrl: './dismantle-barrier-work-order-detail.component.html',
  styleUrls: ['./dismantle-barrier-work-order-detail.component.scss'],
})
export class DismantleBarrierWorkOrderDetailComponent implements OnInit {
  // ????????????
  @ViewChild('accountabilityUnit') accountabilityUnit: TemplateRef<any>;
  // ????????????
  @ViewChild('alarmTemp') alarmTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('alarmSelectorModalTemp') alarmSelectorModalTemp: TemplateRef<any>;
  // ????????????????????????
  @ViewChild('isCleanTemp') isCleanTemp: TemplateRef<any>;
  // ????????????????????????
  @ViewChild('isConfirmTemp') isConfirmTemp: TemplateRef<any>;
  // ??????
  @ViewChild('radioTemp') radioTemp: TemplateRef<any>;
  // ????????????????????????
  @ViewChild('ecTimeTemp') ecTimeTemp: TemplateRef<any>;
  // ????????????????????????
  @ViewChild('startTime') startTime: TemplateRef<any>;
  // ????????????
  @ViewChild('statusTemp') statusTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('unitNameSearch') unitNameSearch: TemplateRef<any>;
  // ????????????
  @ViewChild('deviceTemp') deviceTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('equipTemp') equipTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('alarmLevelTemp') alarmLevelTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('deviceNameTemp') deviceNameTemp: TemplateRef<any>;
  // ????????????(????????????)
  @ViewChild('alarmEquipmentTemp') alarmEquipmentTemp: TemplateRef<any>;

  // ???????????????
  @ViewChild('areaSelector') private areaSelector: TemplateRef<HTMLDocument>;
  // ????????????
  @ViewChild('equipmentNameTemp') private equipmentNameTemp: TemplateRef<HTMLDocument>;
// ????????????
  @ViewChild('autoDispatch') public autoDispatch: TemplateRef<any>;
  /** ?????????????????????,???????????????????????? ???????????? */
  equipmentNameFilterCondition: QueryConditionModel = new QueryConditionModel();
  // ?????????????????????
  public equipmentVisible: boolean = false;
  // ?????????????????????
  public equipmentFilterValue: FilterCondition;
  // ???????????????
  public checkEquipmentObject: ClearWorkOrderEquipmentModel = new ClearWorkOrderEquipmentModel();
  // ??????????????????
  public selectEquipments: EquipmentListModel[] = [];
  // ?????????
  public formLanguage: FormLanguageInterface;
  // ????????????
  public alarmLanguage: AlarmLanguageInterface;
  /** ????????? ???????????? ??????????????? ???????????????  */
  public unitDisabled: boolean = false;
  public ifDisabled: boolean = false;
  // ?????????
  public isLoading: boolean = false;
  // ??????
  public accountabilityUnitList = [];
  //  ?????????????????????
  public selectOption: DeviceTypeModel[] = [];
  // ??????????????????
  public alarmObjectConfig: AlarmSelectorConfigModel;
  // ????????????
  public _dataSet: ClearBarrierWorkOrderModel[] = [];
  // ??????
  public pageBean: PageModel = new PageModel();
  // ????????????
  public tableConfig: TableConfigModel;
  // ????????????
  public queryCondition: QueryConditionModel;
  // ?????????
  public formColumn: FormItem[] = [];
  // ??????
  public formStatus: FormOperate;
  // ????????????
  public isFormDisabled: boolean;
  // ????????????
  public pageTitle: string;
  // ????????????
  public checkAlarmObject: SelectEquipmentModel = new SelectEquipmentModel();
  // ??????????????????
  public alarmTypeList: SelectModel[] = [];
  // ????????????
  public selectDepartName: string = '';
  // ??????
  public alarmName: string = '';
  // ???????????????
  public selectedAlarm: SelectAlarmModel;
  // ?????????????????????
  public _selectedAlarm: SelectAlarmModel;
  // ????????????id
  public selectedAlarmId: string = null;
  // ????????????
  public isShowBtn: boolean;
  // ????????????
  public selectData: RoleUnitModel = {
    checked: false,
    label: '',
    value: '',
  };
  workOrderStatusListArr: any[];
  // ??????????????????
  public unitTreeSelectorConfig: TreeSelectorConfigModel;
  // ?????????
  public unitsTreeNode: DepartmentUnitModel[] = [];
  // ????????????
  public isVisible: boolean = false;
  // ????????????
  public InspectionLanguage: InspectionLanguageInterface;
  // ?????????????????????
  public language: AlarmLanguageInterface;
  // ????????????
  public filterObj: FilterValueModel = {
    deviceId: [],
    deviceName: '',
    equipmentId: [],
    equipmentName: '',
  };
  // ?????????
  public treeUnitSelectorConfig: TreeSelectorConfigModel;
  // ??????????????????
  public isUnitsVisible: boolean = false;
  // ????????????
  public dispatchEnum = IsSelectAllEnum;
  public dispatchValue: string = IsSelectAllEnum.deny;
  public isDispatch: boolean = false;
  // ????????????
  private alarmUnitNode: DepartmentUnitModel[] = [];

  // ????????????
  public pageType: string = '';
  // ???????????????
  private isFault: boolean = false;
  // ??????
  private alarmLevelList: DeviceTypeModel[] = [];
  // ??????id
  private workOrderId: string;
  // ????????????
  private filterValue: FilterValueModel;

  /** ???????????? form */
  dismantleBarrierInsertEditForm: DismantleBarrierInsertEditFormModel = new DismantleBarrierInsertEditFormModel();
  // ?????????????????????????????????
  public areaSelectVisible: boolean = false;
  // ??????????????????
  private areaNodes: AreaModel[] = [];
  // ??????????????????
  private areaInfo: AreaModel = new AreaModel();
  selectedAreaName: string;
  // ?????????????????????
  public areaSelectorConfig: TreeSelectorConfigModel = new TreeSelectorConfigModel();

  /** ???????????? */
  deviceNameModel;
  // ??????????????????
  public deviceNameModelVisible: boolean = false;

  /** ???????????????????????? */
  selectedEquipmentId: any = [];

  /** ????????????????????? ????????? */
  dismantleTypeVisible: boolean = false;
  /** ????????????\??????????????????????????? */
  warnTroubleFilterData;
  // ????????????
  public procType: string;
  /** ???????????? */
  equipmentNameModel: string;
  /** ???????????? ????????? */
  dismantlePointVisible: boolean = false;
  /** ?????????  ????????? ?????????????????? ?????? */
  selectedDismantlePointEquipment: any[] = [];
  /** ????????? ????????? ?????? ?????????????????? */
  selectEquipmentId: string = '';
  // ????????????
  public deviceTypeCode = DeviceTypeEnum;

  // ??????id
  private deptId: string;

  /** ?????????????????? */
  workOrderPageTypeEnum = WorkOrderPageTypeEnum;

  workOrderLanguage: WorkOrderLanguageInterface;
  constructor(
    public $nzI18n: NzI18nService,
    public $alarmUtil: AlarmForCommonUtil,
    public $activatedRoute: ActivatedRoute,
    public $router: Router,
    public $tempModal: NzModalService,
    public $dismantleBarrierWorkOrderService: DismantleBarrierWorkOrderService,
    public $alarmService: AlarmForCommonService,
    public $message: FiLinkModalService,
    public $ruleUtil: RuleUtil,
    public $userService: UserForCommonService,
    public $inspectionWorkOrderService: InspectionWorkOrderService,
    public $alarmStoreService: AlarmStoreService,
    public $equipmentAipService: EquipmentApiService,
    public $facilityUtilService: CommonUtil,
    private $clearBarrierWorkOrderService: ClearBarrierWorkOrderService,

    private $workOrderCommonUtil: WorkOrderCommonServiceUtil,
    private $facilityForCommonService: FacilityForCommonService,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
  }

  public ngOnInit(): void {
    this.formLanguage = this.$nzI18n.getLocaleData(LanguageEnum.form);
    this.alarmLanguage = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.InspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.workOrderLanguage = this.$nzI18n.getLocaleData(LanguageEnum.workOrder);
    this.loadPage();
    // ??????????????????
    AlarmForCommonUtil.getAlarmTypeList(this.$alarmService).then((data: SelectModel[]) => {
      this.alarmTypeList = data;
      initAlarmTableConfig(this);
    });
    // ????????????
    this.initAlarmObjectConfig();
    // ????????? ??????
    this.initColumn();
    // ??????????????????
    // this.getUnitDataList();
    initUnitTreeConfig(this);
    this.setSelectOption();
    initUnitTreeSelectConfig(this);
    for (const k in WorkOrderAlarmLevelColor) {
      if (WorkOrderAlarmLevelColor[k]) {
        this.alarmLevelList.push({
          label: this.alarmLanguage[k],
          code: WorkOrderAlarmLevelColor[k],
        });
      }
    }
  }

  /**
   * ????????????
   */
  private loadPage(): void {
    this.$activatedRoute.queryParams.subscribe((params) => {
      this.procType = ClearBarrierOrInspectEnum.remove;
      this.pageType = params.status;
      this.pageTitle = this.getPageTitle(this.pageType);
      this.isShowBtn = true;
      if (params.type === RefAlarmFaultEnum.alarm) {
        this.isFault = false;
      } else if (params.type === RefAlarmFaultEnum.fault) {
        this.isFault = true;
      }
      // ???????????????
      if (this.pageType === WorkOrderPageTypeEnum.add) {
        this.$workOrderCommonUtil.getRoleAreaList().then((areaData: AreaModel[]) => {
          this.areaNodes = areaData;
          WorkOrderInitTreeUtil.initAreaSelectorConfig(this, this.areaNodes);
          FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, null);
        });
      }
      if (
        this.pageType === WorkOrderPageTypeEnum.update ||
        this.pageType === WorkOrderPageTypeEnum.rebuild
      ) {
        this.workOrderId = params.id;
        this.getWorkOrderDetail();
      } else {
        this.isFault = false;
      }
    });
  }
  /**
   * ??????????????????
   */
  public initAlarmObjectConfig(): void {
    this.alarmObjectConfig = {
      clear: !this.checkAlarmObject.ids.length,
      handledCheckedFun: (event) => {
        this.checkAlarmObject = event;
      },
    };
  }

  /**
   * ????????????
   * param type
   * returns {string}
   */
  private getPageTitle(type: string): string {
    let title;
    switch (type) {
      case WorkOrderPageTypeEnum.add:
        title = this.workOrderLanguage.insertDismantleBarrier;
        break;
      case WorkOrderPageTypeEnum.update:
        title = this.workOrderLanguage.updateDismantleBarrier;
        break;
      case WorkOrderPageTypeEnum.view:
        title = this.workOrderLanguage.viewDismantleBarrier;
        this.isShowBtn = false;
        break;
      case WorkOrderPageTypeEnum.rebuild:
        title = this.workOrderLanguage.rebuildDismantleBarrier;
        break;
    }
    return title;
  }

  /**
   * ??????
   */
  public goBack(): void {
    window.history.back();
  }

  public formInstance(event): void {
    this.formStatus = event.instance;
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isFormDisabled = this.formStatus.getRealValid();
    });
  }

  /**
   * ????????????modal
   */
  public showAlarmSelectorModal(): void {
    if (this.unitDisabled) { return; }
    // ??????????????? ????????????
    if (!this.dismantleBarrierInsertEditForm.deviceName) {
      return this.$message.error(this.workOrderLanguage.pleaseChooseDeviceName);
    }
    this.dismantleTypeVisible = true;
  }

  public pageChange(event): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * ????????????
   * param event
   * param data
   */
  public selectedAlarmChange(data): void {
    this._selectedAlarm = data;
  }
  private turnAlarmLevel(code: string): string {
    let name = '';
    for (const k in WorkOrderAlarmLevelColor) {
      if (WorkOrderAlarmLevelColor[k] === code) {
        name = this.alarmLanguage[k];
        break;
      }
    }
    return name;
  }
  /**
   * ??????????????????
   */
  public refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$clearBarrierWorkOrderService.getRefAlarmInfo(this.queryCondition).subscribe(
      (res: Result) => {
        this._dataSet = [];
        if (res.data && res.data.length > 0) {
          this.pageBean.Total = res.totalCount;
          this.pageBean.pageSize = res.size;
          this.pageBean.pageIndex = res.pageNum;
          res.data.forEach((item) => {
            item.alarmClassificationName = AlarmForCommonUtil.showAlarmTypeInfo(
              this.alarmTypeList,
              item.alarmClassification,
            );
            if (item.alarmDeviceTypeId) {
              item.deviceTypeName = WorkOrderBusinessCommonUtil.deviceTypeNames(
                this.$nzI18n,
                item.alarmDeviceTypeId,
              );
              if (item.deviceTypeName) {
                item.deviceClass = CommonUtil.getFacilityIconClassName(item.alarmDeviceTypeId);
              }
            }
            if (item.alarmFixedLevel) {
              item.levelName = this.turnAlarmLevel(item.alarmFixedLevel);
              item.levelStyle = this.$alarmStoreService.getAlarmColorByLevel(
                item.alarmFixedLevel,
              ).backgroundColor;
            }
            if (item.alarmSourceTypeId) {
              item.equipmentTypeName = WorkOrderBusinessCommonUtil.equipTypeNames(
                this.$nzI18n,
                item.alarmSourceTypeId,
              );
              if (item.equipmentTypeName) {
                item.equipClass = CommonUtil.getEquipmentIconClassName(item.alarmSourceTypeId);
              }
            }
            if (item.alarmConfirmStatus && item.alarmConfirmStatus === 1) {
              item.alarmConfirmStatusName = this.language.isConfirm;
            } else if (item.alarmConfirmStatus && item.alarmConfirmStatus === 2) {
              item.alarmConfirmStatusName = this.language.noConfirm;
            }
            if (item.alarmCleanStatus) {
              switch (item.alarmCleanStatus) {
                case 1:
                  item.alarmCleanStatusName = this.language.isClean;
                  break;
                case 2:
                  item.alarmCleanStatusName = this.language.deviceClean;
                  break;
                case 3:
                  item.alarmCleanStatusName = this.language.noClean;
                  break;
                default:
                  item.alarmCleanStatusName = '';
                  break;
              }
            }
          });
          this._dataSet = res.data;
        }
        this.tableConfig.isLoading = false;
      },
      () => {
        this.tableConfig.isLoading = false;
      },
    );
  }

  /**
   * ??????????????????
   */
  public getWorkOrderDetail(): void {
    this.$dismantleBarrierWorkOrderService
      .getDismantleFailureByIdForProcess_API(this.workOrderId)
      .subscribe((result: ResultModel<DismantleBarrierWorkOrderModel>) => {
        if (result.code === ResultCodeEnum.success) {
          if (result.data.status === WorkOrderStatusEnum.assigned) {
            this.ifDisabled = true;
            this.formStatus.group.controls['removeType'].disable();

          } else if (result.data.status === WorkOrderStatusEnum.singleBack) {
            this.ifDisabled = true;
            this.formStatus.group.controls['removeType'].disable();

          } else {
            this.unitDisabled = true;

            this.formStatus.group.controls['title'].disable();
            this.formStatus.group.controls['taskDescribe'].disable();
            this.formStatus.group.controls['removeType'].disable();
            this.formStatus.group.controls['autoDispatch'].disable();
            this.isDispatch = true;
            // this.formStatus.group.controls['material'].disable()
          }
          this.setWorkOrderData(result.data);
        }
      });
  }

  /**
   * ????????????
   * param data
   */
  private setWorkOrderData(data: DismantleBarrierWorkOrderModel): void {
    if (this.isFault) {
      this.selectedAlarmId = null;
      this.alarmName = null;
    } else {
      this.selectedAlarmId = data.refAlarm;
      this.alarmName = data.refAlarmName;
    }
    //  id
    this.dismantleBarrierInsertEditForm.procId = data.procId;
    // ????????????
    this.formStatus.resetControlData('title', data.title);
    // ????????????
    this.formStatus.resetControlData('taskDescribe', data.taskDescribe);
    // ????????????
    this.formStatus.resetControlData('areaId', true);
    this.dismantleBarrierInsertEditForm.deviceAreaCode = this.areaInfo.areaCode =
      data.deviceAreaCode;
    this.dismantleBarrierInsertEditForm.deviceAreaId = this.areaInfo.areaId = data.deviceAreaId;
    this.dismantleBarrierInsertEditForm.deviceAreaName = this.areaInfo.areaName =
      data.deviceAreaName;
    this.dismantleBarrierInsertEditForm.deviceCode = data.deviceCode;
    this.dispatchValue = data.autoDispatch ? data.autoDispatch : this.dispatchEnum.deny;
    this.formStatus.resetControlData('autoDispatch', this.dispatchValue);
    // ????????????/??????
    this.formStatus.resetControlData('removeType', data.removeType);

    // ????????????
    this.dismantleBarrierInsertEditForm.deviceName = data.deviceName;
    this.dismantleBarrierInsertEditForm.deviceId = data.deviceId;
    this.dismantleBarrierInsertEditForm.deviceModel = data.deviceModel;
    this.dismantleBarrierInsertEditForm.deviceType = data.deviceType;
    this.formStatus.resetControlData('deviceName', true);

    // ????????????
    const typeData = FacilityForCommonUtil.translateDeviceType(this.$nzI18n, data.deviceType);
    this.formStatus.resetControlData('deviceType', typeData);
    // ????????????
    // this.formStatus.resetControlData("deviceType", data.deviceType)
    // ????????????
    this.formStatus.resetControlData('deviceModel', data.deviceModel);
    // ????????????????????????
    if (data.removeType === DismantleTypeEnum.device) {
      console.log(data, '??????');
      this.dismantleBarrierInsertEditForm.equipmentInfoList = data.equipmentInfoList;
    } else if (data.removeType === DismantleTypeEnum.equipment) {
      console.log(data, '??????');
      const equipmentNameList = [];
      const equipmentTypeList = [];
      this.dismantleBarrierInsertEditForm.equipmentInfoList = [
        {
          equipmentId: data.equipmentId,
          equipmentName: data.equipmentName,
          equipmentType: data.equipmentType,
          equipmentCode: data.equipmentCode,
          position: data.removePosition,
          deviceId: data.deviceId,
          sequenceId: data.sequenceId,
        },
      ];
      data.equipmentInfoList.forEach((item) => {
        equipmentNameList.push(item.equipmentName);
        // tslint:disable-next-line: no-shadowed-variable
        const typeData = FacilityForCommonUtil.translateEquipmentType(
          this.$nzI18n,
          item.equipmentType,
        );
        equipmentTypeList.push(typeData);
      });
      this.selectEquipmentId = data.equipmentId;
      this.equipmentNameModel =  data.equipmentName;
      this.formStatus.resetControlData('equipmentName', true);

      // ????????????
      this.formStatus.resetControlData('equipmentType', equipmentTypeList);
    }
    // ????????????/??????
    this.dismantleBarrierInsertEditForm.refName = data.refName;
    this.dismantleBarrierInsertEditForm.refId = data.refId;
    this.dismantleBarrierInsertEditForm.refType = data.refType;
    this.warnTroubleFilterData = data.deviceId;

    this.queryDeptList(data.deviceAreaCode).then();
    // ????????????
    this.dismantleBarrierInsertEditForm.accountabilityDept = data.accountabilityDept;
    this.dismantleBarrierInsertEditForm.accountabilityDeptName = data.accountabilityDeptName;
    this.dismantleBarrierInsertEditForm.accountabilityDeptId = data.accountabilityDeptId;
    // ??????
    if (data.expectedCompletedTime) {
      this.formStatus.resetControlData(
        'expectedCompletedTime',
        new Date(CommonUtil.convertTime(data.expectedCompletedTime)),
      );
    }
    this.deptId = data.accountabilityDeptId;
    // ???????????????????????????????????????
    this.$workOrderCommonUtil.getRoleAreaList().then((areaData: any[]) => {
      this.areaNodes = areaData;
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, data.deviceAreaId);
      WorkOrderInitTreeUtil.initAreaSelectorConfig(this, areaData);
    });
    // ??????
    this.formStatus.resetControlData('remark', data.remark);
    this.formStatus.group.updateValueAndValidity();
  }
  /**
   * ??????
   */
  public submitData(): void {
    const data = this.setSubmitData();
    this.isLoading = true;
    if (this.pageType === WorkOrderPageTypeEnum.rebuild) {
      this.$dismantleBarrierWorkOrderService.refundDismantleGeneratedAgain_API(data).subscribe(
        (result: Result) => {
          if (result.code === ResultCodeEnum.success) {
            window.history.back();
            this.$message.success(this.workOrderLanguage.regeneratedSuccessful);
          } else {
            this.isLoading = false;
            this.$message.error(result.msg);
          }
        },
        () => {
          this.isLoading = false;
        },
      );
    } else {
      const methodName =
        this.pageType === WorkOrderPageTypeEnum.add
          ? 'insertDismantleBarrier_API'
          : 'updateDismantleBarrier_API';
      this.$dismantleBarrierWorkOrderService[methodName](data).subscribe(
        (result: Result) => {
          if (result.code === ResultCodeEnum.success) {
            this.$router.navigate(['/business/work-order/dismantle-barrier/unfinished-list']).then();
            this.$message.success(this.InspectionLanguage.operateMsg.successful);
            this.getSelectEquipmentId();
          } else {
            this.isLoading = false;
            this.$message.error(result.msg);
          }
        },
        () => {
          this.isLoading = false;
        },
      );
    }
  }

  /**
   * ??????????????????
   */
  setSubmitData() {
    const formData = this.formStatus.group.getRawValue();
    const getParamsForm: DismantleBarrierInsertEditFormModel = _.cloneDeep(
      this.dismantleBarrierInsertEditForm,
    );
    getParamsForm.title = formData.title;
    getParamsForm.taskDescribe = formData.taskDescribe;
    getParamsForm.removeType = formData.removeType;
    getParamsForm.autoDispatch = formData.autoDispatch;
    // getParamsForm.material = formData.material
    getParamsForm.remark = formData.remark;
    getParamsForm.expectedCompletedTime = formData.expectedCompletedTime.getTime();
    console.log(getParamsForm, 'getParamsForm');
    return getParamsForm;
  }

  /** ????????????????????????????????? */
  getSelectEquipmentId() {
    const getParamsForm: DismantleBarrierInsertEditFormModel = _.cloneDeep(
      this.dismantleBarrierInsertEditForm,
    );
    const equipmentIdList = getParamsForm.equipmentInfoList.map((item) => item.equipmentId);
    const params = {
      equipmentIdList,
      type: InsertOrDeleteEnum.add,
    };
    this.$dismantleBarrierWorkOrderService
      .setSelectedEquipment_API(params)
      .subscribe((result: Result) => {
        console.log(result, 'result');
      });
  }

  // ???????????? ???????????????
  private setColumnHidden(key: string, value: boolean): void {
    const formColumn = this.formColumn.find((item) => item.key === key);
    if (formColumn) {
      formColumn.hidden = value;
    }
  }
  /** ?????????????????? */
  changeDismantleType(event: DismantleTypeEnum) {
    // ????????????
    if (event === DismantleTypeEnum.device) {
      this.setColumnHidden('equipmentType', true);
      this.setColumnHidden('equipmentName', true);
    } else if (event === DismantleTypeEnum.equipment) {
      this.setColumnHidden('equipmentType', false);
      this.setColumnHidden('equipmentName', false);
    }
    this.resetsFromData();
  }
  /**
   * form??????
   */
  private initColumn(): void {
    this.formColumn = [
      {
        // ????????????
        label: this.workOrderLanguage.name,
        key: 'title',
        type: 'input',
        require: true,
        rule: [
          { required: true },
          RuleUtil.getNameMinLengthRule(),
          RuleUtil.getNameMaxLengthRule(),
          RuleUtil.getAlarmNamePatternRule(this.InspectionLanguage.nameCodeMsg),
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(
            (value) =>
              this.$dismantleBarrierWorkOrderService.checkDismantleBarrierName_API(
                CommonUtil.trim(value),
                this.workOrderId,
              ),
            (res) => res.code === ResultCodeEnum.success,
          ),
        ],
      },
      {
        // ????????????
        label: this.workOrderLanguage.type,
        key: 'procType',
        type: 'input',
        disabled: true,
        initialValue: this.workOrderLanguage.remove,
        rule: [],
      },
      // ????????????
      {
        label: this.workOrderLanguage.taskDescription,
        key: 'taskDescribe',
        type: 'input',
        rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      // ????????????
      {
        label: this.workOrderLanguage.deviceArea,
        key: 'areaId',
        type: 'custom',
        template: this.areaSelector,
        require: true,
        rule: [{ required: true }],
        asyncRules: [],
      },
      // ????????????/??????
      {
        label: this.workOrderLanguage.facilitiesEquipment,
        key: 'removeType',
        type: 'radio',
        require: true,
        initialValue: DismantleTypeEnum.device,
        rule: [{ required: true }],
        customRules: [],
        radioInfo: {
          data: [
            {
              label: this.workOrderLanguage.device,
              value: DismantleTypeEnum.device,
            },
            {
              label: this.workOrderLanguage.equipment,
              value: DismantleTypeEnum.equipment,
            },
          ],
          label: 'label',
          value: 'value',
        },
        modelChange: (controls, $event) => {
          this.changeDismantleType($event);
        },
      },
      // ????????????
      {
        label: this.workOrderLanguage.deviceName,
        key: 'deviceName',
        type: 'custom',
        template: this.deviceNameTemp,
        require: true,
        rule: [{ required: true }],
        customRules: [],
      },
      // ????????????
      {
        label: this.workOrderLanguage.deviceType,
        key: 'deviceType',
        type: 'input',
        disabled: true,
        rule: [],
      },
      // ????????????
      {
        label: this.workOrderLanguage.facilityModel,
        key: 'deviceModel',
        type: 'input',
        disabled: true,
        rule: [],
      },
      // ????????????
      {
        label: this.workOrderLanguage.equipmentName,
        key: 'equipmentName',
        type: 'custom',
        template: this.equipmentNameTemp,
        hidden: true,
        require: true,
        rule: [{ required: true }],
        customRules: [],
      },
      // ????????????
      {
        label: this.workOrderLanguage.equipmentType,
        key: 'equipmentType',
        type: 'input',
        disabled: true,
        hidden: true,
        rule: [],
      },
      // ????????????/??????
      {
        label: this.workOrderLanguage.relevancyAlarmFault,
        key: 'refAlarm',
        type: 'custom',
        template: this.alarmTemp,
        rule: [],
        asyncRules: [],
      },
      // ????????????
      // {
      //     label: this.workOrderLanguage.materialInfo,
      //     key: 'material',
      //     type: 'input',
      //     require: true,
      //     rule: [
      //         { required: true },
      //         this.$ruleUtil.getRemarkMaxLengthRule(),
      //         this.$ruleUtil.getNameRule()
      //     ],
      //     customRules: [this.$ruleUtil.getNameCustomRule()]
      // },
      { // ??????????????????
        label: this.InspectionLanguage.autoDispatch,
        key: 'autoDispatch', type: 'custom',
        require: true, rule: [{required: true}],
        template: this.autoDispatch,
        initialValue: IsSelectAllEnum.deny
      },
      // ????????????
      {
        label: this.workOrderLanguage.accountabilityUnitName,
        key: 'accountabilityDept',
        type: 'custom',
        template: this.accountabilityUnit,
        rule: [],
        asyncRules: [],
      },
      {
        // ??????????????????
        label: this.workOrderLanguage.expectedCompleteTime,
        key: 'expectedCompletedTime',
        type: 'custom',
        template: this.ecTimeTemp,
        require: true,
        rule: [{ required: true }],
        customRules: [
          {
            code: 'isTime',
            msg: null,
            validator: (control: AbstractControl): { [key: string]: boolean } => {
              if (
                control.value &&
                CommonUtil.sendBackEndTime(new Date(control.value).getTime()) < new Date().getTime()
              ) {
                if (this.formStatus.group.controls['expectedCompletedTime'].dirty) {
                  this.$message.info(
                    this.InspectionLanguage.expectedCompletionTimeMustBeGreaterThanCurrentTime,
                  );
                  return { isTime: true };
                }
              } else {
                return null;
              }
            },
          },
        ],
      },
      {
        // ??????
        label: this.workOrderLanguage.remark,
        key: 'remark',
        type: 'textarea',
        rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
    ];
  }
  /**
   * ????????????
   */
  disabledEndDate = (current: Date): boolean => {
    const nowTime = new Date();
    return differenceInCalendarDays(current, nowTime) < 0 || CommonUtil.checkTimeOver(current);
  }

  /**
   * ??????????????????
   */
  public handleFilter(filters) {
    const filterEvent = [];
    filters.forEach((item) => {
      switch (item.filterField) {
        case 'alarmHappenCount':
          // ??????
          filterEvent.push({
            filterField: 'alarmHappenCount',
            filterValue: Number(item.filterValue) ? Number(item.filterValue) : 0,
            operator: 'lte',
          });
          break;
        case 'alarmSource':
          // ????????????
          if (this.checkEquipmentObject.name) {
            filterEvent.push({
              filterField: 'alarmSource',
              filterValue: this.checkEquipmentObject.ids,
              operator: OperatorEnum.in,
            });
          }
          break;
        case 'alarmDeviceName':
          // ????????????
          if (this.checkAlarmObject.name) {
            filterEvent.push({
              filterField: 'alarmDeviceId',
              filterValue: this.checkAlarmObject.ids,
              operator: OperatorEnum.in,
            });
          }
          break;
        default:
          filterEvent.push(item);
      }
    });
    return filterEvent;
  }

  /**
   * ????????????????????????
   */
  private setSelectOption(): void {
    this.selectOption = WorkOrderStatusUtil.getWorkOrderStatusList(this.$nzI18n).filter((item) => {
      // ????????????????????????????????????????????????????????????
      return item.value !== WorkOrderStatusEnum.completed;
    });
  }

  /**
   * ???????????????????????????
   */
  public showModal(filterValue): void {
    if (this.unitTreeSelectorConfig.treeNodes.length === 0) {
      this.queryDepartList().then((bool) => {
        if (bool) {
          this.filterValue = filterValue;
          if (!this.filterValue['filterValue']) {
            this.filterValue['filterValue'] = [];
          }
          this.unitTreeSelectorConfig.treeNodes = this.unitsTreeNode;
          this.isVisible = true;
        }
      });
    } else {
      this.isVisible = true;
    }
  }
  /**
   * ????????????
   */
  private queryDepartList(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.$userService.queryAllDepartment().subscribe(
        (result: Result) => {
          this.unitsTreeNode = result.data || [];
          resolve(true);
        },
        (error) => {
          reject(error);
        },
      );
    });
  }
  /**
   * ????????????????????????
   * param event
   */
  public selectDataChange(event: DepartmentUnitModel[]): void {
    let arr = [];
    this.selectDepartName = '';
    const name = [];
    if (event.length > 0) {
      arr = event.map((item) => {
        name.push(item.deptName);
        return item.id;
      });
    }
    this.selectDepartName = name.join(',');
    if (arr.length === 0) {
      this.filterValue.filterValue = null;
    } else {
      this.filterValue.filterValue = arr;
    }
    FacilityForCommonUtil.setTreeNodesStatus(this.unitsTreeNode, arr);
  }

  /**
   * ??????????????????
   */
  private getUnitDataList() {
    this.alarmUnitNode = [];
    this.$dismantleBarrierWorkOrderService
      .queryDismantleUnit_API({})
      .subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          this.alarmUnitNode = result.data || [];
        }
      });
  }

  /**
   * ??????????????????
   */
  public showAreaSelectorModal(): void {
    if (this.ifDisabled || this.unitDisabled) { return; }
    this.areaSelectorConfig.treeNodes = this.areaNodes;
    this.areaSelectVisible = true;
  }
  /**
   * ????????????
   */
  public areaSelectChange(event: AreaModel[]): void {
      if(!(this.areaInfo.areaId == event[0].areaId)){
        if (!_.isEmpty(event)) {
            this.areaInfo = event[0];
            FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, this.areaInfo.areaId);
            this.selectedAreaName = this.areaInfo.areaName;
            this.formStatus.resetControlData('areaId', this.areaInfo.areaId);
            this.dismantleBarrierInsertEditForm.deviceAreaCode = this.areaInfo.areaCode;
            this.dismantleBarrierInsertEditForm.deviceAreaId = this.areaInfo.areaId;
            this.dismantleBarrierInsertEditForm.deviceAreaName = this.areaInfo.areaName;

            this.queryDeptList(event[0].areaCode).then();
        } else {
            this.areaInfo = null;
            FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, null);
            this.selectedAreaName = '';
            this.formStatus.resetControlData('areaId', null);
            this.dismantleBarrierInsertEditForm.deviceAreaCode = null;
            this.dismantleBarrierInsertEditForm.deviceAreaId = null;
            this.dismantleBarrierInsertEditForm.deviceAreaName = null;
        }
        this.resetsFromData(true);
      }
  }

  /** ??????????????????????????? */
  resetsFromData(flag?: boolean) {
    this.dismantleBarrierInsertEditForm.refId = null
    this.dismantleBarrierInsertEditForm.refType = null
    this.deptId = null

    this.dismantleBarrierInsertEditForm.refName = null;
    this.dismantleBarrierInsertEditForm.accountabilityDeptName = null;
    this.equipmentNameModel = null;
    this.formStatus.resetControlData('equipmentName', null);
    this.formStatus.resetControlData('equipmentType', null);
    this.formStatus.resetControlData('refAlarm', null);
    this.formStatus.resetControlData('expectedCompletedTime', null);
    this.formStatus.resetControlData('remark', null);
    // ????????????
    if (flag) {
      this.dismantleBarrierInsertEditForm.deviceId = null;
      this.dismantleBarrierInsertEditForm.deviceName = null;
      this.formStatus.resetControlData('deviceName', null);
      this.formStatus.resetControlData('deviceType', null);
      this.formStatus.resetControlData('deviceModel', null);
    }

    this.formStatus.group.updateValueAndValidity();
  }

  /** ???????????? ??????????????? */
  deviceModelClick() {
    if (this.ifDisabled || this.unitDisabled) { return; }
    // ??????????????? ????????????
    if (!this.dismantleBarrierInsertEditForm.deviceAreaName) {
      return this.$message.error(this.workOrderLanguage.pleaseChooseArea);
    }
    this.deviceNameModelVisible = true;
  }

  /** ???????????? ??????????????? ?????? */
  selectModelDataChange(event) {
    if (!_.isEmpty(event)) {
      const getData: FacilityListModel = event[0];
      this.dismantleBarrierInsertEditForm.deviceName = getData.deviceName;
      this.dismantleBarrierInsertEditForm.deviceId = getData.deviceId;
      this.dismantleBarrierInsertEditForm.deviceModel = getData.deviceModel;
      this.dismantleBarrierInsertEditForm.deviceType = getData.deviceType;
      // @ts-ignore
      this.dismantleBarrierInsertEditForm.deviceCode = getData.deviceCode;

      // ????????????
      this.formStatus.resetControlData('deviceName', true);
      // ????????????
      const typeData = FacilityForCommonUtil.translateDeviceType(this.$nzI18n, getData.deviceType);
      this.formStatus.resetControlData('deviceType', typeData);
      // ????????????
      this.formStatus.resetControlData('deviceModel', getData.deviceModel);
      this.warnTroubleFilterData = getData.deviceId;

      // ???????????????
      if (this.dismantleBarrierInsertEditForm.removeType === DismantleTypeEnum.device) {
        // const isAddProCreMove = this.isDetailPage ? null : "0"
        const isAddProCreMove = '0';
        const bizCondition = {
          deviceId: getData.deviceId,
          isAddProCreMove,
        };
        this.equipmentNameFilterCondition.bizCondition = bizCondition;
        this.equipmentNameFilterCondition.pageCondition.pageSize = 100;
        this.$dismantleBarrierWorkOrderService
          .dismantlePointList_API(this.equipmentNameFilterCondition)
          .subscribe((res: ResultModel<EquipmentListModel[]>) => {
            if (res.code === ResultCodeEnum.success) {
              const equipmentInfoList = res.data.map((item) => {
                return {
                  equipmentId: item.equipmentId,
                  equipmentName: item.equipmentName,
                  equipmentType: item.equipmentType,
                  equipmentCode: item.equipmentCode,
                  position: item.mountPosition,
                  deviceId: getData.deviceId,
                  sequenceId: item.sequenceId,
                };
              });
              this.dismantleBarrierInsertEditForm.equipmentInfoList = equipmentInfoList;
            }
          });
      }
    } else {
      this.dismantleBarrierInsertEditForm.deviceName = null;
      this.dismantleBarrierInsertEditForm.deviceId = null;
      this.dismantleBarrierInsertEditForm.deviceModel = null;
      this.dismantleBarrierInsertEditForm.deviceType = null;
      this.dismantleBarrierInsertEditForm.deviceCode = null;
      // ????????????
      this.formStatus.resetControlData('deviceName', null);
      // ????????????
      this.formStatus.resetControlData('deviceType', null);
      // ????????????
      this.formStatus.resetControlData('deviceModel', null);
      this.dismantleBarrierInsertEditForm.equipmentInfoList = [
        {
          equipmentId: '',
          equipmentName: '',
          equipmentType: '',
          equipmentCode: '',
          position: '',
          deviceId: this.dismantleBarrierInsertEditForm.deviceId,
          sequenceId: '',
        },
      ];
    }
    // ????????????
    this.equipmentNameModel = null;
    this.formStatus.resetControlData('equipmentType', null);
    // ????????????
    this.formStatus.resetControlData('equipmentName', null);
  }

  /** ???????????? ????????? */
  dismantlePointModelClick() {
    if (this.ifDisabled || this.unitDisabled) { return; }
    // ??????????????? ????????????
    if (!this.dismantleBarrierInsertEditForm.deviceName) {
      return this.$message.error(this.workOrderLanguage.pleaseChooseDeviceName);
    }
    this.dismantlePointVisible = true;
  }

  /** ???????????? ??????????????? ?????? */
  selecDismantlePointEquipmentData(event) {
    console.log(event, 'event');
    this.selectedDismantlePointEquipment = event;
    if (!_.isEmpty(event)) {
      // ????????????????????? ???????????????
      if (this.pageType === this.workOrderPageTypeEnum.update) {
        this.selectEquipmentId = event[0].equipmentId;
      }
      const getData: EquipmentListModel[] = event;
      // ????????????
      const typeData = [];
      // ????????????
      const equipmentName = [];
      this.dismantleBarrierInsertEditForm.equipmentInfoList = getData.map((item) => {
        typeData.push(
          FacilityForCommonUtil.translateEquipmentType(this.$nzI18n, item.equipmentType),
        );
        equipmentName.push(item.equipmentName);
        return {
          equipmentId: item.equipmentId,
          equipmentName: item.equipmentName,
          equipmentType: item.equipmentType,
          equipmentCode: item.equipmentCode,
          position: item.mountPosition,
          deviceId: this.dismantleBarrierInsertEditForm.deviceId,
          sequenceId: item.sequenceId,
        };
      });
      this.equipmentNameModel = equipmentName.join(',');
      // ????????????
      this.formStatus.resetControlData('equipmentType', typeData.join(','));
      // ????????????
      this.formStatus.resetControlData('equipmentName', equipmentName.join(','));
    } else {
      this.dismantleBarrierInsertEditForm.equipmentInfoList = [
        {
          equipmentId: '',
          equipmentName: '',
          equipmentType: '',
          equipmentCode: '',
          position: '',
          deviceId: this.dismantleBarrierInsertEditForm.deviceId,
          sequenceId: '',
        },
      ];
      // ????????????
      this.equipmentNameModel = null;
      this.formStatus.resetControlData('equipmentType', null);
      // ????????????
      this.formStatus.resetControlData('equipmentName', null);
    }
  }

  /** ?????? ?????? ??????????????? ?????????????????? */
  dismantleTypeModelChange(event) {
    console.log(event, 'event');
    if (!_.isEmpty(event)) {
      this.dismantleBarrierInsertEditForm.refId = event.refId;
      this.dismantleBarrierInsertEditForm.refName = event.refName;
      this.dismantleBarrierInsertEditForm.refType = event.refType;
    } else {
      this.dismantleBarrierInsertEditForm.refId = null;
      this.dismantleBarrierInsertEditForm.refName = null;
      this.dismantleBarrierInsertEditForm.refType = null;
    }
  }

  /**
   * ?????? ???????????? ??????modal
   */
  public showSelectorModal(): void {
    console.log(this.deptId, 'this.deptId');
    if (this.unitDisabled) { return; }
    // ??????????????? ????????????
    if (!this.dismantleBarrierInsertEditForm.deviceAreaName) {
      return this.$message.error(this.workOrderLanguage.pleaseChooseArea);
    }
    initUnitTreeConfig(this);
    this.treeUnitSelectorConfig.treeNodes = this.alarmUnitNode;
    FacilityForCommonUtil.setTreeNodesStatus(this.alarmUnitNode, [this.deptId]);
    this.isUnitsVisible = true;
  }

  /**
   * ???????????? ????????????
   * param event
   */
  public selectUnitDataChange(event: DepartmentUnitModel[]): void {
    console.log(event, 'event');
    if (!_.isEmpty(event)) {
      this.dismantleBarrierInsertEditForm.accountabilityDeptName = event[0].deptName;
      this.dismantleBarrierInsertEditForm.accountabilityDept = event[0].deptCode;
      this.dismantleBarrierInsertEditForm.accountabilityDeptId = event[0].id;

      this.deptId = event[0].id;
      FacilityForCommonUtil.setTreeNodesStatus(this.alarmUnitNode, [event[0].id]);
      this.formStatus.resetControlData('accountabilityDept', event[0].deptCode);
    } else {
      this.dismantleBarrierInsertEditForm.accountabilityDeptName = null;
      this.dismantleBarrierInsertEditForm.accountabilityDept = null;
      this.dismantleBarrierInsertEditForm.accountabilityDeptId = null;
      this.formStatus.resetControlData('accountabilityDept', null);
    }
  }

  /**
   * ??????????????????
   */
  private queryDeptList(code: string): Promise<NzTreeNode[]> {
    return new Promise((resolve, reject) => {
      const param = new AreaDeviceParamModel();
      param.areaCodes = [code];
      param.userId = WorkOrderBusinessCommonUtil.getUserId();
      this.$facilityForCommonService
        .listDepartmentByAreaAndUserId(param)
        .subscribe((result: ResultModel<any[]>) => {
          if (result.code === ResultCodeEnum.success) {
            const deptData = result.data || [];
            this.alarmUnitNode = deptData;
            this.treeUnitSelectorConfig.treeNodes = [];
            resolve(deptData);
          }
        });
    });
  }
  /**
   * ??????????????????
   */
  public selectDispatch(event): void {
    this.formStatus.resetControlData('autoDispatch', event);
  }
}
