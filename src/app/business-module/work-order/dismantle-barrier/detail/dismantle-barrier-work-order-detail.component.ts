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
 * 新增和编辑 拆除工单
 */
@Component({
  selector: 'app-dismantle-barrier-work-order-detail',
  templateUrl: './dismantle-barrier-work-order-detail.component.html',
  styleUrls: ['./dismantle-barrier-work-order-detail.component.scss'],
})
export class DismantleBarrierWorkOrderDetailComponent implements OnInit {
  // 单位模板
  @ViewChild('accountabilityUnit') accountabilityUnit: TemplateRef<any>;
  // 关联告警
  @ViewChild('alarmTemp') alarmTemp: TemplateRef<any>;
  // 告警选择
  @ViewChild('alarmSelectorModalTemp') alarmSelectorModalTemp: TemplateRef<any>;
  // 清除状态过滤模板
  @ViewChild('isCleanTemp') isCleanTemp: TemplateRef<any>;
  // 确认状态过滤模板
  @ViewChild('isConfirmTemp') isConfirmTemp: TemplateRef<any>;
  // 单选
  @ViewChild('radioTemp') radioTemp: TemplateRef<any>;
  // 完成时间选择模板
  @ViewChild('ecTimeTemp') ecTimeTemp: TemplateRef<any>;
  // 开始时间选择模板
  @ViewChild('startTime') startTime: TemplateRef<any>;
  // 状态模板
  @ViewChild('statusTemp') statusTemp: TemplateRef<any>;
  // 单位选择
  @ViewChild('unitNameSearch') unitNameSearch: TemplateRef<any>;
  // 设施图标
  @ViewChild('deviceTemp') deviceTemp: TemplateRef<any>;
  // 设备类型
  @ViewChild('equipTemp') equipTemp: TemplateRef<any>;
  // 设备类型
  @ViewChild('alarmLevelTemp') alarmLevelTemp: TemplateRef<any>;
  // 设施名称
  @ViewChild('deviceNameTemp') deviceNameTemp: TemplateRef<any>;
  // 设备名称(告警对象)
  @ViewChild('alarmEquipmentTemp') alarmEquipmentTemp: TemplateRef<any>;

  // 区域选择器
  @ViewChild('areaSelector') private areaSelector: TemplateRef<HTMLDocument>;
  // 设备名称
  @ViewChild('equipmentNameTemp') private equipmentNameTemp: TemplateRef<HTMLDocument>;
// 自动派单
  @ViewChild('autoDispatch') public autoDispatch: TemplateRef<any>;
  /** 选择设施的时候,该设施下设备数据 过滤条件 */
  equipmentNameFilterCondition: QueryConditionModel = new QueryConditionModel();
  // 设备选择器显示
  public equipmentVisible: boolean = false;
  // 设备选择器显示
  public equipmentFilterValue: FilterCondition;
  // 勾选的设备
  public checkEquipmentObject: ClearWorkOrderEquipmentModel = new ClearWorkOrderEquipmentModel();
  // 设备勾选容器
  public selectEquipments: EquipmentListModel[] = [];
  // 国际化
  public formLanguage: FormLanguageInterface;
  // 告警语言
  public alarmLanguage: AlarmLanguageInterface;
  /** 状态为 指派之后 禁用所有除 备注的操作  */
  public unitDisabled: boolean = false;
  public ifDisabled: boolean = false;
  // 加载中
  public isLoading: boolean = false;
  // 单位
  public accountabilityUnitList = [];
  //  设施类型下拉框
  public selectOption: DeviceTypeModel[] = [];
  // 设施名称配置
  public alarmObjectConfig: AlarmSelectorConfigModel;
  // 列表数据
  public _dataSet: ClearBarrierWorkOrderModel[] = [];
  // 分页
  public pageBean: PageModel = new PageModel();
  // 表格配置
  public tableConfig: TableConfigModel;
  // 查询参数
  public queryCondition: QueryConditionModel;
  // 表单列
  public formColumn: FormItem[] = [];
  // 表单
  public formStatus: FormOperate;
  // 表单校验
  public isFormDisabled: boolean;
  // 页面标题
  public pageTitle: string;
  // 设施名称
  public checkAlarmObject: SelectEquipmentModel = new SelectEquipmentModel();
  // 告警类型数组
  public alarmTypeList: SelectModel[] = [];
  // 单位名称
  public selectDepartName: string = '';
  // 告警
  public alarmName: string = '';
  // 已选择告警
  public selectedAlarm: SelectAlarmModel;
  // 复制已选择告警
  public _selectedAlarm: SelectAlarmModel;
  // 选择告警id
  public selectedAlarmId: string = null;
  // 按钮显示
  public isShowBtn: boolean;
  // 过滤参数
  public selectData: RoleUnitModel = {
    checked: false,
    label: '',
    value: '',
  };
  workOrderStatusListArr: any[];
  // 树选择器配置
  public unitTreeSelectorConfig: TreeSelectorConfigModel;
  // 树节点
  public unitsTreeNode: DepartmentUnitModel[] = [];
  // 显示隐藏
  public isVisible: boolean = false;
  // 工单语言
  public InspectionLanguage: InspectionLanguageInterface;
  // 告警国际化引用
  public language: AlarmLanguageInterface;
  // 过滤参数
  public filterObj: FilterValueModel = {
    deviceId: [],
    deviceName: '',
    equipmentId: [],
    equipmentName: '',
  };
  // 单位树
  public treeUnitSelectorConfig: TreeSelectorConfigModel;
  // 显示单位弹窗
  public isUnitsVisible: boolean = false;
  // 自动派单
  public dispatchEnum = IsSelectAllEnum;
  public dispatchValue: string = IsSelectAllEnum.deny;
  public isDispatch: boolean = false;
  // 告警单位
  private alarmUnitNode: DepartmentUnitModel[] = [];

  // 页面类型
  public pageType: string = '';
  // 告警或故障
  private isFault: boolean = false;
  // 告警
  private alarmLevelList: DeviceTypeModel[] = [];
  // 工单id
  private workOrderId: string;
  // 过滤条件
  private filterValue: FilterValueModel;

  /** 新增编辑 form */
  dismantleBarrierInsertEditForm: DismantleBarrierInsertEditFormModel = new DismantleBarrierInsertEditFormModel();
  // 区域选择器弹框是否展示
  public areaSelectVisible: boolean = false;
  // 区域选择节点
  private areaNodes: AreaModel[] = [];
  // 选择区域对象
  private areaInfo: AreaModel = new AreaModel();
  selectedAreaName: string;
  // 区域选择器配置
  public areaSelectorConfig: TreeSelectorConfigModel = new TreeSelectorConfigModel();

  /** 设施名称 */
  deviceNameModel;
  // 设备弹框展示
  public deviceNameModelVisible: boolean = false;

  /** 选择设施回显数组 */
  selectedEquipmentId: any = [];

  /** 关联故障、告警 弹出框 */
  dismantleTypeVisible: boolean = false;
  /** 关联告警\故障的表格过滤参数 */
  warnTroubleFilterData;
  // 页面类型
  public procType: string;
  /** 设备名称 */
  equipmentNameModel: string;
  /** 拆分点位 弹出框 */
  dismantlePointVisible: boolean = false;
  /** 新增时  多选的 已选拆除点位 设备 */
  selectedDismantlePointEquipment: any[] = [];
  /** 编辑时 单选的 已选 拆除点位设备 */
  selectEquipmentId: string = '';
  // 设施枚举
  public deviceTypeCode = DeviceTypeEnum;

  // 单位id
  private deptId: string;

  /** 当前页面类型 */
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
    // 异步告警类别
    AlarmForCommonUtil.getAlarmTypeList(this.$alarmService).then((data: SelectModel[]) => {
      this.alarmTypeList = data;
      initAlarmTableConfig(this);
    });
    // 设施名称
    this.initAlarmObjectConfig();
    // 初始化 表单
    this.initColumn();
    // 获取责任单位
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
   * 初始数据
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
      // 页面为新增
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
   * 设施名称配置
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
   * 获取标题
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
   * 返回
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
   * 告警选择modal
   */
  public showAlarmSelectorModal(): void {
    if (this.unitDisabled) { return; }
    // 必须先选择 设施名称
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
   * 选择告警
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
   * 获取当前告警
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
   * 获取工单详情
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
   * 设置数据
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
    // 工单名称
    this.formStatus.resetControlData('title', data.title);
    // 任务描述
    this.formStatus.resetControlData('taskDescribe', data.taskDescribe);
    // 设施区域
    this.formStatus.resetControlData('areaId', true);
    this.dismantleBarrierInsertEditForm.deviceAreaCode = this.areaInfo.areaCode =
      data.deviceAreaCode;
    this.dismantleBarrierInsertEditForm.deviceAreaId = this.areaInfo.areaId = data.deviceAreaId;
    this.dismantleBarrierInsertEditForm.deviceAreaName = this.areaInfo.areaName =
      data.deviceAreaName;
    this.dismantleBarrierInsertEditForm.deviceCode = data.deviceCode;
    this.dispatchValue = data.autoDispatch ? data.autoDispatch : this.dispatchEnum.deny;
    this.formStatus.resetControlData('autoDispatch', this.dispatchValue);
    // 拆除设施/设备
    this.formStatus.resetControlData('removeType', data.removeType);

    // 设施名称
    this.dismantleBarrierInsertEditForm.deviceName = data.deviceName;
    this.dismantleBarrierInsertEditForm.deviceId = data.deviceId;
    this.dismantleBarrierInsertEditForm.deviceModel = data.deviceModel;
    this.dismantleBarrierInsertEditForm.deviceType = data.deviceType;
    this.formStatus.resetControlData('deviceName', true);

    // 设施类型
    const typeData = FacilityForCommonUtil.translateDeviceType(this.$nzI18n, data.deviceType);
    this.formStatus.resetControlData('deviceType', typeData);
    // 设施类型
    // this.formStatus.resetControlData("deviceType", data.deviceType)
    // 设施型号
    this.formStatus.resetControlData('deviceModel', data.deviceModel);
    // 选择拆除的是设施
    if (data.removeType === DismantleTypeEnum.device) {
      console.log(data, '设施');
      this.dismantleBarrierInsertEditForm.equipmentInfoList = data.equipmentInfoList;
    } else if (data.removeType === DismantleTypeEnum.equipment) {
      console.log(data, '设备');
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

      // 设备类型
      this.formStatus.resetControlData('equipmentType', equipmentTypeList);
    }
    // 关联故障/告警
    this.dismantleBarrierInsertEditForm.refName = data.refName;
    this.dismantleBarrierInsertEditForm.refId = data.refId;
    this.dismantleBarrierInsertEditForm.refType = data.refType;
    this.warnTroubleFilterData = data.deviceId;

    this.queryDeptList(data.deviceAreaCode).then();
    // 责任单位
    this.dismantleBarrierInsertEditForm.accountabilityDept = data.accountabilityDept;
    this.dismantleBarrierInsertEditForm.accountabilityDeptName = data.accountabilityDeptName;
    this.dismantleBarrierInsertEditForm.accountabilityDeptId = data.accountabilityDeptId;
    // 时间
    if (data.expectedCompletedTime) {
      this.formStatus.resetControlData(
        'expectedCompletedTime',
        new Date(CommonUtil.convertTime(data.expectedCompletedTime)),
      );
    }
    this.deptId = data.accountabilityDeptId;
    // 递归设置责任单位的选择情况
    this.$workOrderCommonUtil.getRoleAreaList().then((areaData: any[]) => {
      this.areaNodes = areaData;
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, data.deviceAreaId);
      WorkOrderInitTreeUtil.initAreaSelectorConfig(this, areaData);
    });
    // 备注
    this.formStatus.resetControlData('remark', data.remark);
    this.formStatus.group.updateValueAndValidity();
  }
  /**
   * 提交
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
   * 设置提交数据
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

  /** 提交时需要传递所选设备 */
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

  // 显示隐藏 指定的字段
  private setColumnHidden(key: string, value: boolean): void {
    const formColumn = this.formColumn.find((item) => item.key === key);
    if (formColumn) {
      formColumn.hidden = value;
    }
  }
  /** 改变拆除类型 */
  changeDismantleType(event: DismantleTypeEnum) {
    // 所选设施
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
   * form配置
   */
  private initColumn(): void {
    this.formColumn = [
      {
        // 工单名称
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
        // 工单类型
        label: this.workOrderLanguage.type,
        key: 'procType',
        type: 'input',
        disabled: true,
        initialValue: this.workOrderLanguage.remove,
        rule: [],
      },
      // 任务描述
      {
        label: this.workOrderLanguage.taskDescription,
        key: 'taskDescribe',
        type: 'input',
        rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      // 设施区域
      {
        label: this.workOrderLanguage.deviceArea,
        key: 'areaId',
        type: 'custom',
        template: this.areaSelector,
        require: true,
        rule: [{ required: true }],
        asyncRules: [],
      },
      // 拆除设施/设备
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
      // 设施名称
      {
        label: this.workOrderLanguage.deviceName,
        key: 'deviceName',
        type: 'custom',
        template: this.deviceNameTemp,
        require: true,
        rule: [{ required: true }],
        customRules: [],
      },
      // 设施类型
      {
        label: this.workOrderLanguage.deviceType,
        key: 'deviceType',
        type: 'input',
        disabled: true,
        rule: [],
      },
      // 设施型号
      {
        label: this.workOrderLanguage.facilityModel,
        key: 'deviceModel',
        type: 'input',
        disabled: true,
        rule: [],
      },
      // 设备名称
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
      // 设备类型
      {
        label: this.workOrderLanguage.equipmentType,
        key: 'equipmentType',
        type: 'input',
        disabled: true,
        hidden: true,
        rule: [],
      },
      // 关联故障/告警
      {
        label: this.workOrderLanguage.relevancyAlarmFault,
        key: 'refAlarm',
        type: 'custom',
        template: this.alarmTemp,
        rule: [],
        asyncRules: [],
      },
      // 物料信息
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
      { // 是否自动派单
        label: this.InspectionLanguage.autoDispatch,
        key: 'autoDispatch', type: 'custom',
        require: true, rule: [{required: true}],
        template: this.autoDispatch,
        initialValue: IsSelectAllEnum.deny
      },
      // 责任单位
      {
        label: this.workOrderLanguage.accountabilityUnitName,
        key: 'accountabilityDept',
        type: 'custom',
        template: this.accountabilityUnit,
        rule: [],
        asyncRules: [],
      },
      {
        // 期望完工时间
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
        // 备注
        label: this.workOrderLanguage.remark,
        key: 'remark',
        type: 'textarea',
        rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
    ];
  }
  /**
   * 日期禁用
   */
  disabledEndDate = (current: Date): boolean => {
    const nowTime = new Date();
    return differenceInCalendarDays(current, nowTime) < 0 || CommonUtil.checkTimeOver(current);
  }

  /**
   * 过滤条件处理
   */
  public handleFilter(filters) {
    const filterEvent = [];
    filters.forEach((item) => {
      switch (item.filterField) {
        case 'alarmHappenCount':
          // 频次
          filterEvent.push({
            filterField: 'alarmHappenCount',
            filterValue: Number(item.filterValue) ? Number(item.filterValue) : 0,
            operator: 'lte',
          });
          break;
        case 'alarmSource':
          // 告警对象
          if (this.checkEquipmentObject.name) {
            filterEvent.push({
              filterField: 'alarmSource',
              filterValue: this.checkEquipmentObject.ids,
              operator: OperatorEnum.in,
            });
          }
          break;
        case 'alarmDeviceName':
          // 设施名称
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
   * 设置类型下拉选项
   */
  private setSelectOption(): void {
    this.selectOption = WorkOrderStatusUtil.getWorkOrderStatusList(this.$nzI18n).filter((item) => {
      // 未确认的已退单的工单也会出现在未完工列表
      return item.value !== WorkOrderStatusEnum.completed;
    });
  }

  /**
   * 打开责任单位选择器
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
   * 查询单位
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
   * 责任单位选择结果
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
   * 获取告警单位
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
   * 展示区域选择
   */
  public showAreaSelectorModal(): void {
    if (this.ifDisabled || this.unitDisabled) { return; }
    this.areaSelectorConfig.treeNodes = this.areaNodes;
    this.areaSelectVisible = true;
  }
  /**
   * 选择区域
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

  /** 重置已经填写的数据 */
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
    // 改变区域
    if (flag) {
      this.dismantleBarrierInsertEditForm.deviceId = null;
      this.dismantleBarrierInsertEditForm.deviceName = null;
      this.formStatus.resetControlData('deviceName', null);
      this.formStatus.resetControlData('deviceType', null);
      this.formStatus.resetControlData('deviceModel', null);
    }

    this.formStatus.group.updateValueAndValidity();
  }

  /** 设施名称 模板弹出框 */
  deviceModelClick() {
    if (this.ifDisabled || this.unitDisabled) { return; }
    // 必须先选择 设施区域
    if (!this.dismantleBarrierInsertEditForm.deviceAreaName) {
      return this.$message.error(this.workOrderLanguage.pleaseChooseArea);
    }
    this.deviceNameModelVisible = true;
  }

  /** 设施名称 模板弹出框 确认 */
  selectModelDataChange(event) {
    if (!_.isEmpty(event)) {
      const getData: FacilityListModel = event[0];
      this.dismantleBarrierInsertEditForm.deviceName = getData.deviceName;
      this.dismantleBarrierInsertEditForm.deviceId = getData.deviceId;
      this.dismantleBarrierInsertEditForm.deviceModel = getData.deviceModel;
      this.dismantleBarrierInsertEditForm.deviceType = getData.deviceType;
      // @ts-ignore
      this.dismantleBarrierInsertEditForm.deviceCode = getData.deviceCode;

      // 设施名称
      this.formStatus.resetControlData('deviceName', true);
      // 设施类型
      const typeData = FacilityForCommonUtil.translateDeviceType(this.$nzI18n, getData.deviceType);
      this.formStatus.resetControlData('deviceType', typeData);
      // 设施型号
      this.formStatus.resetControlData('deviceModel', getData.deviceModel);
      this.warnTroubleFilterData = getData.deviceId;

      // 说明是设施
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
      // 设施名称
      this.formStatus.resetControlData('deviceName', null);
      // 设施类型
      this.formStatus.resetControlData('deviceType', null);
      // 设施型号
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
    // 设备名称
    this.equipmentNameModel = null;
    this.formStatus.resetControlData('equipmentType', null);
    // 设备名称
    this.formStatus.resetControlData('equipmentName', null);
  }

  /** 设备名称 弹出框 */
  dismantlePointModelClick() {
    if (this.ifDisabled || this.unitDisabled) { return; }
    // 必须先选择 设施名称
    if (!this.dismantleBarrierInsertEditForm.deviceName) {
      return this.$message.error(this.workOrderLanguage.pleaseChooseDeviceName);
    }
    this.dismantlePointVisible = true;
  }

  /** 设备名称 模板弹出框 确认 */
  selecDismantlePointEquipmentData(event) {
    console.log(event, 'event');
    this.selectedDismantlePointEquipment = event;
    if (!_.isEmpty(event)) {
      // 如果是编辑页面 是单选数据
      if (this.pageType === this.workOrderPageTypeEnum.update) {
        this.selectEquipmentId = event[0].equipmentId;
      }
      const getData: EquipmentListModel[] = event;
      // 设备类型
      const typeData = [];
      // 设备名称
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
      // 设备类型
      this.formStatus.resetControlData('equipmentType', typeData.join(','));
      // 设备名称
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
      // 设备名称
      this.equipmentNameModel = null;
      this.formStatus.resetControlData('equipmentType', null);
      // 设备名称
      this.formStatus.resetControlData('equipmentName', null);
    }
  }

  /** 关联 告警 故障弹出框 点击确认按钮 */
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
   * 打开 责任单位 选择modal
   */
  public showSelectorModal(): void {
    console.log(this.deptId, 'this.deptId');
    if (this.unitDisabled) { return; }
    // 必须先选择 设施区域
    if (!this.dismantleBarrierInsertEditForm.deviceAreaName) {
      return this.$message.error(this.workOrderLanguage.pleaseChooseArea);
    }
    initUnitTreeConfig(this);
    this.treeUnitSelectorConfig.treeNodes = this.alarmUnitNode;
    FacilityForCommonUtil.setTreeNodesStatus(this.alarmUnitNode, [this.deptId]);
    this.isUnitsVisible = true;
  }

  /**
   * 责任单位 选择结果
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
   * 查询责任单位
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
   * 选择自动派单
   */
  public selectDispatch(event): void {
    this.formStatus.resetControlData('autoDispatch', event);
  }
}
