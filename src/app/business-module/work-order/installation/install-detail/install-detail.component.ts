import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {NzI18nService, NzTreeNode} from 'ng-zorro-antd';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {WorkOrderPageTypeEnum} from '../../share/enum/work-order-page-type.enum';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {InstallDetailFormUtil} from './install-detail-form.util';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {differenceInCalendarDays} from 'date-fns';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {DepartmentUnitModel} from '../../../../core-module/model/work-order/department-unit.model';
import {WorkOrderInitTreeUtil} from '../../share/util/work-order-init-tree.util';
import {AreaModel} from '../../../../core-module/model/facility/area.model';
import {WorkOrderCommonServiceUtil} from '../../share/util/work-order-common-service.util';
import {AlarmSelectorConfigModel} from '../../../../shared-module/model/alarm-selector-config.model';
import {FilterCondition, QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {EquipmentModel} from '../../../../core-module/model/equipment.model';
import {InspectionWorkOrderService} from '../../share/service/inspection';
import {InspectionReportParamModel} from '../../share/model/inspection-report-param.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {ClearBarrierOrInspectEnum, IsSelectAllEnum} from '../../share/enum/clear-barrier-work-order.enum';
import {AreaDeviceParamModel} from '../../../../core-module/model/work-order/area-device-param.model';
import {WorkOrderBusinessCommonUtil} from '../../share/util/work-order-business-common.util';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {InstallWorkOrderService} from '../../share/service/installation';
import {WorkOrderStatusEnum} from '../../../../core-module/enum/work-order/work-order-status.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {InstallWorkOrderModel} from '../../../../core-module/model/work-order/install-work-order.model';
import {WorkOrderMapTypeEnum} from '../../share/enum/work-order-map-type.enum';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {OrderEquipmentModel} from '../../share/model/install-work-order/order-equipment.model';
import {FormLanguageInterface} from '../../../../../assets/i18n/form/form.language.interface';

/**
 * ??????/??????????????????
 */
@Component({
  selector: 'app-install-detail',
  templateUrl: './install-detail.component.html',
  styleUrls: ['./install-detail.component.scss']
})
export class InstallDetailComponent implements OnInit {

  // ????????????????????????
  @ViewChild('ecTimeTemp') public ecTimeTemp: TemplateRef<any>;
  // ??????????????????
  @ViewChild('departmentSelector') public departmentSelector: TemplateRef<any>;
  // ????????????
  @ViewChild('selectDeviceTemp') private selectDeviceTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('equipmentTemp') private equipmentTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('positionDevTemplate') private positionDevTemplate: TemplateRef<HTMLDocument>;
  // ??????????????????
  @ViewChild('equipmentListTemp') public equipmentListTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('autoDispatch') public autoDispatch: TemplateRef<any>;
  // ????????????
  @ViewChild('equipModelTemp') private equipModelTemp: TemplateRef<HTMLDocument>;
  // ????????????
  public pageTitle: string;
  // ?????????
  public inspectionLanguage: InspectionLanguageInterface;
  public commonLanguage: CommonLanguageInterface;
  public formLanguage: FormLanguageInterface;
  // form????????????
  public formColumn: FormItem[] = [];
  public formStatus: FormOperate;
  // ????????????
  public isFormDisabled: boolean = false;
  // ??????????????????
  public isLoading: boolean = false;
  // ?????????
  public treeSelectorConfig: TreeSelectorConfigModel;
  // ??????????????????
  public isUnitVisible: boolean = false;
  // ???????????????title???
  public departmentName: string = '';
  // ????????????
  public isSelectDept: boolean = true;
  // ????????????
  public isSelectArea: boolean = false;
  // ??????ID
  public areaId: string = null;
  // ?????????????????????
  public areaSelectVisible: boolean = false;
  // ???????????????
  public areaSelectorConfig: TreeSelectorConfigModel;
  // ????????????
  public orderFacilityConfig: AlarmSelectorConfigModel;
  // ??????????????????????????????
  public isFacilityName: boolean = false;
  // ????????????????????????
  public isShowDeviceModel: boolean = false;
  // ????????????
  public deviceName: string;
  // ????????????????????????
  public isEquipName: boolean = true;
  public isNameInput: boolean = false;
  // ??????????????????
  public isAddEquip: boolean = false;
  // ????????????
  public showCheckName: boolean = false;
  // ????????????
  public showSpin: boolean = false;
  // ??????????????????
  public equipmentVisible: boolean = false;
  // ????????????
  public equipmentName: string;
  // ????????????????????????
  public equipmentFilter: FilterCondition[] = [];
  // ???????????????
  public selectEquipmentList: EquipmentModel[] = [];
  // ??????id
  public equipmentIds: string;
  // ????????????????????????
  public wisdomMountPosition;
  // ??????????????????
  public isShowModel: boolean = false;
  // ????????????
  public modelsType: string;
  // ??????/????????????
  public deviceOrEquipType: string;
  public selectModelData;
  // ????????????
  public equipModel: string = '';
  public equipModelData;
  // ????????????????????????
  public isEquipModel: boolean = true;
  // ??????????????????
  public isPoint: boolean = true;
  // ??????????????????
  public showPointSelect: boolean = false;
  // ?????????
  public pointValue: number | string;
  // ????????????
  public dispatchEnum = IsSelectAllEnum;
  public dispatchValue: string = IsSelectAllEnum.deny;
  public isDispatch: boolean = false;
  // ???????????????
  public selectDeviceList = [];
  // ??????
  public nameStr: string = '';
  // ????????????
  private isCanSelect: boolean = false;
  // ??????id
  private procId: string;
  // ????????????
  private pageType: string;
  // ?????????
  private unitTreeNodes: NzTreeNode[] = [];
  // ??????????????????
  private areaNodes: AreaModel[] = [];
  // ??????
  private pointList: any[] = [];
  // ????????????
  private procStatus: string;
  // ????????????????????????????????????
  private operateFrom: string;
  // ??????????????????????????????
  private isChangeDevice: boolean = false;
  // ??????????????????
  private checkName: boolean = false;
  // ??????????????????
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // ???????????????
  private editData: InstallWorkOrderModel;

  constructor(
    private $activatedRoute: ActivatedRoute,
    private $nzI18n: NzI18nService,
    private $router: Router,
    private $message: FiLinkModalService,
    private $ruleUtil: RuleUtil,
    private $workOrderCommonUtil: WorkOrderCommonServiceUtil,
    private $inspectService: InspectionWorkOrderService,
    private $facilityForCommonService: FacilityForCommonService,
    private $installService: InstallWorkOrderService
  ) { }

  public ngOnInit(): void {
    this.inspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.formLanguage = this.$nzI18n.getLocaleData(LanguageEnum.form);
    this.initPageJump();
    // ??????????????????
    WorkOrderInitTreeUtil.initTreeSelectorConfig(this);
  }

  /**
   * ?????????????????????
   * param event
   */
  public formInstance(event: {instance: FormOperate}): void {
    this.formStatus = event.instance;
    const that = this;
    this.formStatus.group.statusChanges.subscribe((param) => {
      setTimeout(() => {
        that.isFormDisabled = that.formStatus.getRealValid();
      }, 300);
    });
  }
  /**
   * ??????
   */
  public goBack(): void {
    window.history.go(-1);
  }
  /**
   * ??????/??????/??????????????????
   */
  public saveInstallData(): void {
    const data = this.formStatus.group.getRawValue();
    if (data.planCompletedTime && (new Date(data.planCompletedTime)).getTime() < (new Date()).getTime() && this.procStatus === WorkOrderStatusEnum.assigned) {
      this.$message.error(this.inspectionLanguage.expectedCompletionTimeMustBeGreaterThanCurrentTime);
      return;
    }
    const device = data.devicesName[0];
    const param = {
      title: data.title,
      procType: ClearBarrierOrInspectEnum.installation,
      describe: data.taskDesc,
      isGenerateEquipment: data.isGenerateEquipment,
      deviceName: device.deviceName,
      deviceId: device.deviceId,
      deviceType: device.deviceType,
      deviceModel: device.deviceModel,
      deviceAreaId: device.areaId,
      deviceAreaCode: device.areaCode,
      deviceAreaName: device.areaName,
      accountabilityDeptCode: '',
      accountabilityDeptName: '',
      equipmentType: data.equipmentType,
      equipment: [{
        assetCode: '',
        deviceId: device.deviceId,
        equipmentType: data.equipmentType,
        equipmentName: this.equipmentName,
        equipmentId: '',
        equipmentModel: data.equipmentModel,
      }],
      autoDispatch: data.autoDispatch,
      planCompletedTime: (new Date(data.planCompletedTime)).getTime(),
      remark: data.remark,
      pointPosition: data.pointPosition,
      id: '',
    };
    // ??????????????????
    if (data.isGenerateEquipment === IsSelectAllEnum.right) {
      param.equipment[0].assetCode = data.assetCode;
    } else {
      delete param.equipment[0].assetCode;
      param.equipment[0].equipmentId = data.equipmentName[0].equipmentId;
    }
    if (data.accountabilityDept) {
      param.accountabilityDeptCode = data.accountabilityDept.accountabilityDeptCode;
      param.accountabilityDeptName = data.accountabilityDept.accountabilityDeptName;
    }
    this.isLoading = true;
    let request;
    // console.info('??????', param);
    if (this.pageType === WorkOrderPageTypeEnum.add) {
      delete param.id;
      request = this.$installService.addInstallWorkOrder(param);
    } else if (this.pageType === WorkOrderPageTypeEnum.update) {
      // ??????
      param.id = this.procId;
      request = this.$installService.editInstallWorkOrder(param);
    } else {
      // ????????????
      param.id = this.procId;
      request = this.$installService.regenerateOrder(param);
    }
    // ????????????????????????
    if (data.isGenerateEquipment === IsSelectAllEnum.right) {
      if (this.pageType === WorkOrderPageTypeEnum.add) {
        this.addEquipmentInfo(param).then((result: any) => {
          if (result) {
            // ?????????????????????????????????????????????
            param.equipment[0].equipmentId = result.equipmentId;
            param.equipment[0].assetCode = result.equipmentCode;
            this.operateOrder(request);
          }
        });
      } else {
        // ????????????????????????
        if (this.editData.equipmentName !== param.equipment[0].equipmentName || this.editData.assetCode !== param.equipment[0].assetCode) {
          this.addEquipmentInfo(param).then((result: any) => {
            if (result) {
              // ?????????????????????????????????????????????
              param.equipment[0].equipmentId = result.equipmentId;
              param.equipment[0].assetCode = result.equipmentCode;
              this.operateOrder(request);
            }
          });
        } else {
          param.equipment[0].equipmentId = this.equipmentIds;
          this.operateOrder(request);
        }
      }
    } else {
      this.operateOrder(request);
    }
  }

  /**
   * ????????????
   */
  public operateOrder(request): void {
    request.subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        if (this.pageType === WorkOrderPageTypeEnum.add) {
          this.goBack();
          this.$message.success(this.inspectionLanguage.operateMsg.addSuccess);
        } else if (this.pageType === WorkOrderPageTypeEnum.update) {
          this.goBack();
          this.$message.success(this.inspectionLanguage.operateMsg.editSuccess);
        } else {
          this.$router.navigate([`/business/work-order/installation/unfinished-list`]).then();
          this.$message.success(this.inspectionLanguage.operateMsg.rebuildSuccess);
        }
      } else {
        this.$message.error(res.msg);
      }
      this.isLoading = false;
    }, () => this.isLoading = false);
  }
  /**
   * ????????????
   */
  public disabledEndDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) < 0 || CommonUtil.checkTimeOver(current);
  }
  /**
   * ???????????????????????????
   */
  public showDepartmentModal(): void {
    this.treeSelectorConfig.treeNodes = this.unitTreeNodes;
    this.isUnitVisible = true;
  }
  /**
   * ????????????????????????
   * param event
   */
  public selectDataChange(event: DepartmentUnitModel[]): void {
    // ??????????????????
    if (event && event.length > 0) {
      this.departmentName = event[0].deptName;
      this.formStatus.resetControlData('accountabilityDept', {
        accountabilityDeptCode: event[0].deptCode,
        accountabilityDeptName: event[0].deptName,
      });
      // ???????????????
      FacilityForCommonUtil.setTreeNodesStatus(this.unitTreeNodes, [event[0].id]);
    } else {
      this.departmentName = null;
      this.formStatus.resetControlData('accountabilityDept', null);
      // ???????????????
      FacilityForCommonUtil.setTreeNodesStatus(this.unitTreeNodes, []);
    }
  }
  /**
   * ?????????????????????
   */
  public showAreaSelectorModal(): void {
    this.areaSelectorConfig.treeNodes = this.areaNodes;
    this.areaSelectVisible = true;
  }
  /**
   * ????????????
   */
  public showSelectModel(): void {
    const data = this.formStatus.getRealData();
    // ????????????????????????
    this.modelsType = WorkOrderMapTypeEnum.equipment;
    this.deviceOrEquipType = data.equipmentType;
    if (data.equipmentType) {
      this.selectModelData = this.equipModelData;
    }
    this.isShowModel = true;
  }
  /**
   * ????????????
   */
  public selectDeviceModelData(data): void {
    // ??????????????????
    this.equipModelData = data;
    this.equipModel = data.productModel;
    this.formStatus.resetControlData('equipmentModel', data.productModel);
  }

  /**
   * ??????????????????
   * @param event ????????????????????????
   */
  public selectDeviceInfoData(event): void {
    if (event && event.length) {
      this.selectDeviceList = event;
      this.deviceName = event[0].deviceName;
      this.areaId = event[0].areaId;
      this.formStatus.resetControlData('devicesName', event);
      this.formStatus.resetControlData('deviceArea', event[0].areaName);
      this.formStatus.resetControlData('deviceType', WorkOrderBusinessCommonUtil.deviceTypeNames(this.$nzI18n, event[0].deviceType));
      this.formStatus.resetControlData('deviceModel', event[0].deviceModel);
      // ????????????
      this.getUnitDataList(event[0].areaCode);
      this.isSelectDept = false;
      // ????????????????????????
      const devType = event[0].deviceType;
      this.formColumn.forEach(item => {
        if (item.key === 'pointPosition') {
          item.hidden = devType !== DeviceTypeEnum.wisdom;
        }
      });
      this.isEquipName = false;
      // ????????????
      const form = this.formStatus.getRealData();
      if (devType === DeviceTypeEnum.wisdom && form.equipmentType && form.isGenerateEquipment === IsSelectAllEnum.right) {
        this.getMountPoint();
        this.isPoint = false;
      }
      this.showPointSelect = form.isGenerateEquipment === IsSelectAllEnum.right;
      // ??????????????????
      this.isChangeDevice = true;
      if (this.pageType !== WorkOrderPageTypeEnum.add) {
        this.isAddEquip = true;
        this.isEquipModel = false;
        this.isPoint = false;
        this.isNameInput = false;
        this.showPointSelect = false;
        if (this.editData.isGenerateEquipment === IsSelectAllEnum.right) {
          this.formStatus.group.controls['isGenerateEquipment'].reset(IsSelectAllEnum.right);
        } else {
          this.formStatus.group.controls['isGenerateEquipment'].reset(IsSelectAllEnum.deny);
        }
        this.formStatus.group.controls['isGenerateEquipment'].enable();
        this.formStatus.group.controls['assetCode'].enable();
        this.formStatus.group.controls['equipmentType'].enable();
      } else {
        this.showPointSelect = true;
        this.equipmentName = '';
        this.pointValue = '';
        this.wisdomMountPosition = '';
        this.selectEquipmentList = [];
        this.equipModel = '';
        this.formStatus.resetControlData('equipmentName', '');
        this.formStatus.resetControlData('assetCode', '');
        this.formStatus.resetControlData('equipmentType', '');
        this.formStatus.resetControlData('equipmentModel', '');
        this.formStatus.resetControlData('pointPosition', '');
      }
    }
  }

  /**
   * ????????????
   */
  public changePosition(event: string): void {
    this.wisdomMountPosition = event;
    this.formStatus.resetControlData('pointPosition', event);
  }
  /**
   * ????????????
   */
  public onEquipmentDataChange(event: EquipmentModel[]): void {
    if (event && event.length === 1) {
      this.showPointSelect = false;
      this.selectEquipmentList = event;
      this.equipmentName = event[0].equipmentName;
      this.equipmentIds = event[0].equipmentId;
      this.formStatus.resetControlData('equipmentName', this.selectEquipmentList);
      this.formStatus.resetControlData('equipmentType', event[0].equipmentType);
      this.equipModel = event[0].equipmentModel;
      this.formStatus.resetControlData('equipmentModel', this.equipModel);
      this.formStatus.resetControlData('pointPosition', event[0].mountPosition);
      this.pointValue = event[0].mountPosition;
    }
  }

  /**
   * ????????????
   */
  public inputEquipName(event): void {
    const that = this;
    const reg = /^(?!_)[a-zA-Z0-9-_\u4e00-\u9fa5\s]+$/;
    if (!CommonUtil.trim(event.target.value)) {
      this.nameStr = this.formLanguage.requiredMsg;
      this.showCheckName = true;
      this.isFormDisabled = false;
      this.formStatus.resetControlData('equipmentName', null);
      return;
    }
    // ??????????????????????????????????????????????????????
    if (reg.test(CommonUtil.trim(event.target.value))) {
      this.showCheckName = false;
      const data = {equipmentName: CommonUtil.trim(event.target.value), equipmentId: null };
      this.showSpin = true;
      const timer = setTimeout(() => {
        that.checkInputName(data);
        clearTimeout(timer);
      }, 1000);
    } else {
      // ??????????????????????????????????????????????????????
      this.showCheckName = true;
      this.nameStr = this.commonLanguage.nameCodeMsg;
      this.isFormDisabled = false;
    }
    this.formStatus.resetControlData('equipmentName', CommonUtil.trim(event.target.value));
  }
  public checkInputName(data): void {
    this.$installService.checkEquipmentNameIsExist(data).subscribe((res: ResultModel<boolean>) => {
      if (res.code === ResultCodeEnum.success) {
        if (!res.data) {
          this.nameStr = this.formLanguage.nameExistError;
          this.showCheckName = true;
          this.isFormDisabled = false;
        } else {
          this.showCheckName = false;
        }
      } else {
        this.nameStr = res.msg;
        this.showCheckName = true;
        this.isFormDisabled = false;
      }
      this.showSpin = false;
    });
  }

  /**
   * ????????????????????????
   */
  public showEquipmentTemp() {
    if (!this.selectDeviceList || this.selectDeviceList.length === 0) {
      this.$message.info(this.inspectionLanguage.selectFacilityFirst);
      return;
    }
    this.equipmentFilter = [
      { // ???????????????????????????
        filterField: 'equipmentStatus',
        filterValue: ['1'],
        operator: OperatorEnum.in
      },
      {
        filterField: 'areaId',
        filterValue: [this.areaId],
        operator: OperatorEnum.in
      },
      {
        filterField: 'deviceId',
        filterValue: [this.selectDeviceList[0].deviceId],
        operator: OperatorEnum.in
      }
    ];
    this.equipmentVisible = true;
  }
  /**
   * ??????????????????
   */
  public selectDispatch(event): void {
    this.formStatus.resetControlData('autoDispatch', event);
  }

  /**
   * ??????title??????
   */
  private getPageTitle(type: string): string {
    let title;
    switch (type) {
      case WorkOrderPageTypeEnum.add:
        title = `${this.inspectionLanguage.addArea}${this.inspectionLanguage.installOrder}`;
        break;
      case WorkOrderPageTypeEnum.update:
        title = `${this.inspectionLanguage.edit}${this.inspectionLanguage.installOrder}`;
        break;
      case WorkOrderPageTypeEnum.rebuild:
        title = `${this.inspectionLanguage.regenerate}${this.inspectionLanguage.installOrder}`;
        break;
    }
    return title;
  }

  /**
   *  ???????????????
   */
  private getMountPoint() {
    const data = new InspectionReportParamModel();
    const form = this.formStatus.getRealData();
    data.deviceId = this.selectDeviceList[0].deviceId;
    data.equipmentType = form.equipmentType;
    data.mountPosition = null;
    this.pointList = [];
    this.$installService.findMountPositionById(data).subscribe((result: ResultModel<string[]>) => {
      if (result.code === ResultCodeEnum.success && result.data) {
        this.pointList = result.data || [];
      }
    });
  }
  /**
   * ????????????
   */
  private getUnitDataList(areaCode: string): void {
    const params = new AreaDeviceParamModel();
    params.areaCodes = [areaCode];
    params.userId = WorkOrderBusinessCommonUtil.getUserId();
    this.unitTreeNodes = [];
    this.$facilityForCommonService.listDepartmentByAreaAndUserId(params).subscribe((result: ResultModel<NzTreeNode[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.unitTreeNodes = result.data || [];
      }
    });
  }
  /**
   * ??????????????????
   */
  private initPageJump(): void {
    this.$activatedRoute.queryParams.subscribe(params => {
      this.pageType = params.type;
      this.pageTitle = this.getPageTitle(this.pageType);
      this.operateFrom = params.operateFrom;
      // ???????????????
      if (this.pageType !== WorkOrderPageTypeEnum.add) {
        // ???????????????????????????
        this.procId = params.procId;
        this.procStatus = params.status;
        this.defaultFormData();
      }
      InstallDetailFormUtil.initInstallationForm(this);
    });
  }
  /**
   * ????????????????????????
   */
  private defaultFormData(): void {
    // ????????????????????????????????????????????????
    if (this.procStatus !== WorkOrderStatusEnum.assigned && this.pageType === WorkOrderPageTypeEnum.update) {
      this.isDispatch = true;
      this.isSelectArea = true;
      this.isCanSelect = true;
      this.isEquipName = true;
      this.isFacilityName = true;
    } else {
      this.isSelectDept = false;
      this.isEquipModel = false;
    }
    /**
     * ???????????? ??????-?????????
     * ??????????????? ?????? ????????????
     * ???????????? ????????????
     */
    const that = this;
    if (this.operateFrom === WorkOrderPageTypeEnum.finished) {
      this.$installService.historyDetailById(this.procId).subscribe((res: ResultModel<InstallWorkOrderModel>) => {
        if (res.code === ResultCodeEnum.success && res.data) {
          this.echoForm(res.data, that);
        }
      });
    } else {
      this.$installService.getDetailById(this.procId).subscribe((res: ResultModel<InstallWorkOrderModel>) => {
        if (res.code === ResultCodeEnum.success && res.data) {
          this.echoForm(res.data, that);
        }
      });
    }
  }

  /**
   * ??????-????????????
   */
  private echoForm(data: InstallWorkOrderModel, that): void {
    this.editData = data;
    data.taskDesc = data.describe;
    // ??????
    this.selectDeviceList = [{
      deviceName: data.deviceName,
      deviceId: data.deviceId,
      areaId: data.deviceAreaId,
      areaCode: data.deviceAreaCode,
      areaName: data.deviceAreaName,
      deviceModel: data.deviceModel,
      deviceType: data.deviceType,
      // ?????????????????????
      address: '',
      positionBase: ''
    }];
    this.deviceName = data.deviceName;
    this.areaId = data.deviceAreaId;
    this.formColumn.forEach(item => {
      if (item.key === 'pointPosition') {
        item.hidden = data.deviceType !== DeviceTypeEnum.wisdom;
      }
    });
    // ??????
    this.selectEquipmentList = [{
      equipmentId: data.equipment[0].equipmentId,
      equipmentModel: data.equipment[0].equipmentModel,
      equipmentName: data.equipment[0].equipmentName,
      equipmentType: data.equipmentType,
      mountPosition: data.pointPosition
    }];
    this.equipmentIds = data.equipment[0].equipmentId;
    this.editData.assetCode = data.equipment[0].assetCode;
    data.equipmentName = data.equipment[0].equipmentName;
    data.equipmentModel = data.equipment[0].equipmentModel;
    // ??????
    this.departmentName = data.accountabilityDeptName;
    data.accountabilityDept = {accountabilityDeptCode: data.accountabilityDeptCode, accountabilityDeptName: data.accountabilityDeptName};
    // ????????????
    this.getUnitDataList(data.deviceAreaCode);
    // FacilityForCommonUtil.setTreeNodesStatus(this.unitTreeNodes, [this.deptId]);
    // ??????????????????
    if (data.planCompletedTime && this.pageType === WorkOrderPageTypeEnum.update) {
      data.planCompletedTime = new Date(CommonUtil.convertTime(new Date(data.planCompletedTime).getTime()));
    } else {
      data.planCompletedTime = null;
    }
    this.dispatchValue = data.autoDispatch;
    // ??????????????????
    data.isGenerateEquipment = data.isGenerateEquipment ? data.isGenerateEquipment : IsSelectAllEnum.deny;
    data.procType = this.inspectionLanguage.installOrder;
    this.formStatus.resetData(data);
    this.equipmentName = data.equipment[0].equipmentName;
    this.equipModel = data.equipment[0].equipmentModel;
    // ????????????
    this.formStatus.resetControlData('devicesName', this.selectDeviceList);
    this.formStatus.resetControlData('deviceArea', data.deviceAreaName);
    this.formStatus.resetControlData('deviceType', WorkOrderBusinessCommonUtil.deviceTypeNames(this.$nzI18n, data.deviceType));
    // ????????????
    this.formStatus.resetControlData('equipmentName', this.selectEquipmentList);
    this.formStatus.resetControlData('assetCode', data.equipment[0].assetCode);
    // ????????????
    this.formStatus.resetControlData('pointPosition', data.pointPosition);
    this.pointValue = data.pointPosition;
    // ??????????????????
    if (data.isGenerateEquipment === IsSelectAllEnum.right) {
      this.showPointSelect = false;
      this.isAddEquip = true;
      this.isEquipModel = true;
      this.isPoint = true;
      this.isNameInput = true;
      this.formStatus.group.controls['isGenerateEquipment'].disable();
      this.formStatus.group.controls['assetCode'].disable();
      this.formStatus.group.controls['equipmentType'].disable();
      this.queryEquipment(this.equipmentIds);
    } else {
      // ?????????
      this.showPointSelect = false;
      if (this.procStatus !== WorkOrderStatusEnum.assigned) {
        this.isAddEquip = false;
        if (this.pageType === WorkOrderPageTypeEnum.update) {
          this.isEquipName = true;
          this.formStatus.group.controls['isGenerateEquipment'].disable();
          // ????????????????????????????????????
          that.isFormDisabled = true;
        } else {
          this.isEquipName = false;
        }
      } else {
        this.isAddEquip = false;
        this.isEquipName = false;
      }
    }
    if (this.pageType === WorkOrderPageTypeEnum.update) {
      setTimeout(() => {
        that.isFormDisabled = true;
      }, 1500);
    }
  }

  /**
   * ????????????
   */
  private addEquipmentInfo(param): Promise<object> {
    const dataObj = new OrderEquipmentModel();
    dataObj.equipmentName = param.equipment[0].equipmentName;
    dataObj.equipmentType = param.equipmentType;
    dataObj.equipmentModel = param.equipment[0].equipmentModel;
    dataObj.equipmentCode = param.equipment[0].assetCode;
    dataObj.mountPosition = param.pointPosition;
    dataObj.deviceId = param.deviceId;
    dataObj.deviceType = param.deviceType;
    dataObj.deviceName = param.deviceName;
    dataObj.address = this.selectDeviceList[0].address;
    dataObj.positionBase = this.selectDeviceList[0].positionBase;
    dataObj.areaId = param.deviceAreaId;
    dataObj.areaName = param.deviceAreaName;
    dataObj.areaCode = param.deviceAreaCode;
    dataObj.supplierId = this.equipModelData.supplier;
    dataObj.supplier = this.equipModelData.supplierName;
    dataObj.softwareVersion = this.equipModelData.softwareVersion;
    dataObj.hardwareVersion = this.equipModelData.hardwareVersion;
    return new Promise((resolve, reject) => {
      this.$installService.creatEquipment(dataObj).subscribe((res: ResultModel<any>) => {
        if (res.code === ResultCodeEnum.success && res.data) {
          resolve({equipmentId: res.data.equipmentId, equipmentCode: res.data.equipmentCode});
        } else {
          this.$message.error(res.msg);
          this.isLoading = false;
          resolve(null);
        }
      }, () => {
        this.isLoading = false;
        resolve(null);
      });
    });
  }

  /**
   * ??????????????????
   */
  private queryEquipment(id): void {
    this.queryCondition.filterConditions.push({
      filterField: 'equipmentId',
      filterValue: [id],
      operator: OperatorEnum.in
    });
      this.$installService.queryEquipList(this.queryCondition).subscribe((res: ResultModel<any[]>) => {
        if (res.code === ResultCodeEnum.success && res.data && res.data.length) {
          const data = res.data[0];
          this.selectDeviceList[0].address = data.address;
          this.selectDeviceList[0].positionBase = data.positionBase;
          this.equipModelData = {
            // ???????????????
            equipmentModel: data.equipmentModel,
            supplierId: data.supplierId,
            supplier: data.supplier,
            softwareVersion: data.softwareVersion,
            hardwareVersion: data.hardwareVersion
          };
        }
      });
  }
}
