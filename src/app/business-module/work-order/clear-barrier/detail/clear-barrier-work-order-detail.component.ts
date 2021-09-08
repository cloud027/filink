import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {PageModel} from '../../../../shared-module/model/page.model';
import {AddClearBarrierOrderUtil} from './detail-ref-alarm-table.util';
import {ActivatedRoute, Router} from '@angular/router';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {NzI18nService, NzModalService, NzTreeNode} from 'ng-zorro-antd';
import {AbstractControl} from '@angular/forms';
import {ClearBarrierWorkOrderService} from '../../share/service/clear-barrier';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {FormLanguageInterface} from '../../../../../assets/i18n/form/form.language.interface';
import {FilterCondition, QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {AlarmLanguageInterface} from '../../../../../assets/i18n/alarm/alarm-language.interface';
import {AlarmForCommonService} from '../../../../core-module/api-service/alarm';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {differenceInCalendarDays} from 'date-fns';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ClearBarrierWorkOrderModel} from '../../../../core-module/model/work-order/clear-barrier-work-order.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {ClearBarrierOrInspectEnum, IsSelectAllEnum, ResourceTypeEnum} from '../../share/enum/clear-barrier-work-order.enum';
import {WorkOrderPageTypeEnum} from '../../share/enum/work-order-page-type.enum';
import {DeviceTypeModel} from '../../share/model/device-type.model';
import {SelectAlarmModel} from '../../share/model/select-alarm.model';
import {FilterValueModel} from '../../../../core-module/model/work-order/filter-value.model';
import {DepartmentUnitModel} from '../../../../core-module/model/work-order/department-unit.model';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {WorkOrderAlarmLevelColor} from '../../../../core-module/enum/trouble/trouble-common.enum';
import {SelectModel} from '../../../../shared-module/model/select.model';
import {AlarmSelectorConfigModel} from '../../../../shared-module/model/alarm-selector-config.model';
import {AreaDeviceParamModel} from '../../../../core-module/model/work-order/area-device-param.model';
import {InspectionWorkOrderService} from '../../share/service/inspection';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {WorkOrderBusinessCommonUtil} from '../../share/util/work-order-business-common.util';
import {AlarmStoreService} from '../../../../core-module/store/alarm.store.service';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';
import {AlarmCleansStatusEnum, AlarmConfirmStatusNumberEnum, RefAlarmFaultEnum} from '../../share/enum/refAlarm-faultt.enum';
import {RoleUnitModel} from '../../../../core-module/model/work-order/role-unit.model';
import {ClearWorkOrderEquipmentModel} from '../../share/model/clear-barrier-model/clear-work-order-equipment.model';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {WorkOrderLanguageInterface} from '../../../../../assets/i18n/work-order/work-order.language.interface';
import {UserForCommonService} from '../../../../core-module/api-service/user';
import {AlarmForCommonUtil} from '../../../../core-module/business-util/alarm/alarm-for-common.util';
import {SelectEquipmentModel} from '../../../../core-module/model/equipment/select-equipment.model';
import {WorkOrderStatusEnum} from '../../../../core-module/enum/work-order/work-order-status.enum';
import {AlarmWorkOrderModel} from '../../share/model/clear-barrier-model/alarm-work-order.model';
import {WorkOrderNumber} from '../../share/const/work-order-chart-color';
import {WorkOrderFormLabelWidth} from '../../share/const/work-order.const';
import {TableComponent} from '../../../../shared-module/component/table/table.component';

/**
 * 新增和编辑销账工单
 */
@Component({
  selector: 'app-clear-barrier-work-order-detail',
  templateUrl: './clear-barrier-work-order-detail.component.html',
  styleUrls: ['./clear-barrier-work-order-detail.component.scss']
})
export class ClearBarrierWorkOrderDetailComponent implements OnInit {
  // 单位模板
  @ViewChild('accountabilityUnit') public accountabilityUnit: TemplateRef<any>;
  // 关联告警
  @ViewChild('alarmTemp') public alarmTemp: TemplateRef<any>;
  // 告警选择
  @ViewChild('alarmSelectorModalTemp') public alarmSelectorModalTemp: TemplateRef<any>;
  // 清除状态过滤模板
  @ViewChild('isCleanTemp') public isCleanTemp: TemplateRef<any>;
  // 确认状态过滤模板
  @ViewChild('isConfirmTemp') public isConfirmTemp: TemplateRef<any>;
  // 单选
  @ViewChild('radioTemp') public radioTemp: TemplateRef<any>;
  // 完成时间选择模板
  @ViewChild('ecTimeTemp') public ecTimeTemp: TemplateRef<any>;
  // 开始时间选择模板
  @ViewChild('startTime') public startTime: TemplateRef<any>;
  // 状态模板
  @ViewChild('statusTemp') public statusTemp: TemplateRef<any>;
  // 单位选择
  @ViewChild('unitNameSearch') public unitNameSearch: TemplateRef<any>;
  // 设施图标
  @ViewChild('deviceTemp') public deviceTemp: TemplateRef<any>;
  // 设备类型
  @ViewChild('equipTemp') public equipTemp: TemplateRef<any>;
  // 设备类型
  @ViewChild('alarmLevelTemp') public alarmLevelTemp: TemplateRef<any>;
  // 设施名称
  @ViewChild('deviceNameTemp') public deviceNameTemp: TemplateRef<any>;
  // 设备名称(告警对象)
  @ViewChild('alarmEquipmentTemp') public alarmEquipmentTemp: TemplateRef<any>;
  // 自动派单
  @ViewChild('autoDispatch') public autoDispatch: TemplateRef<any>;
  @ViewChild('restTableComponent') restTableComponent: TableComponent;
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
  // 工单国际化
  public workOrderLanguage: WorkOrderLanguageInterface;
  // 工单语言
  public InspectionLanguage: InspectionLanguageInterface;
  // 告警国际化引用
  public language: AlarmLanguageInterface;
  // 单位禁用
  public unitDisabled: boolean;
  // 加载中
  public isLoading: boolean = false;
  // 单位
  public accountabilityUnitList = [];
  // 设施名称配置
  public alarmObjectConfig: AlarmSelectorConfigModel;
  // 列表数据
  public _dataSet: AlarmWorkOrderModel[] = [];
  // 分页
  public pageBean: PageModel = new PageModel();
  // 表格配置
  public tableConfig: TableConfigModel;
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
    value: ''
  };
  // 树选择器配置
  public unitTreeSelectorConfig: TreeSelectorConfigModel;
  // 树节点
  public unitsTreeNode: DepartmentUnitModel[] = [];
  // 显示隐藏
  public isVisible: boolean = false;
  // 过滤参数
  public filterObj: FilterValueModel = new FilterValueModel();
  // 单位树
  public treeUnitSelectorConfig: TreeSelectorConfigModel;
  // 页面类型
  public procType: string;
  // 显示单位弹窗
  public isUnitsVisible: boolean = false;
  // 自动派单
  public dispatchEnum = IsSelectAllEnum;
  public dispatchValue: string = IsSelectAllEnum.deny;
  public isDispatch: boolean = false;
  // 是否校验时间
  private isCheckTime: boolean = true;
  // 告警禁用
  private alarmDisabled: boolean;
  // 全选
  private isAllChecked: boolean = false;
  // 单位数据
  private selectedAccountabilityUnitIdList: string[] = [];
  // 告警单位
  private alarmUnitNode: NzTreeNode[] = [];
  // 页面类型
  private pageType: string = '';
  // 告警或故障
  private isFault: boolean = false;
  // 告警
  private alarmLevelList: DeviceTypeModel[] = [];
  // 工单id
  private workOrderId: string;
  // 表单状态  如果是编辑    1为重新生成 2为待指派 0为其他状态
  private updateStatus: number;
  // 过滤条件
  private filterValue: FilterValueModel;
  // 单位code
  private selectDeptCode: string = '';
  // 查询条件设备名称
  private selectEquipName: string;
  // 查询参数
  private queryCondition: QueryConditionModel = new QueryConditionModel();

  constructor(
    private $nzI18n: NzI18nService,
    private $activatedRoute: ActivatedRoute,
    private $router: Router,
    private $tempModal: NzModalService,
    private $clearBarrierWorkOrderService: ClearBarrierWorkOrderService,
    private $alarmService: AlarmForCommonService,
    private $message: FiLinkModalService,
    private $ruleUtil: RuleUtil,
    private $userService: UserForCommonService,
    private $inspectionWorkOrderService: InspectionWorkOrderService,
    private $alarmStoreService: AlarmStoreService,
    private $facilityForCommonService: FacilityForCommonService,
  ) {}

  /**
   * 初始数据
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.formLanguage = this.$nzI18n.getLocaleData(LanguageEnum.form);
    this.alarmLanguage = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.InspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.workOrderLanguage = this.$nzI18n.getLocaleData(LanguageEnum.workOrder);
    this.loadPage();
    // 异步告警类别
    AlarmForCommonUtil.getAlarmTypeList(this.$alarmService).then((data: SelectModel[]) => {
      this.alarmTypeList = data;
      AddClearBarrierOrderUtil.initAlarmTableConfig(this);
    }, error => {
      AddClearBarrierOrderUtil.initAlarmTableConfig(this);
    });
    // 设施名称
    this.initAlarmObjectConfig();
    this.initColumn();
    AddClearBarrierOrderUtil.initUnitTreeConfig(this);
    AddClearBarrierOrderUtil.initUnitTreeSelectConfig(this);
    for (const k in WorkOrderAlarmLevelColor) {
      if (WorkOrderAlarmLevelColor[k]) {
        this.alarmLevelList.push({
          label: this.alarmLanguage[k],
          code: WorkOrderAlarmLevelColor[k]
        });
      }
    }
  }

  /**
   * 表单初始化
   */
  public formInstance(event: {instance: FormOperate}): void {
    this.formStatus = event.instance;
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isFormDisabled = this.formStatus.getValid();
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
      }
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
        title = this.workOrderLanguage.addClearBarrierWorkOrder;
        break;
      case WorkOrderPageTypeEnum.update:
        title = this.workOrderLanguage.modifyClearBarrierWorkOrder;
        break;
      case WorkOrderPageTypeEnum.view:
        title = this.workOrderLanguage.viewClearBarrierWorkOrder;
        this.isShowBtn = false;
        break;
      case WorkOrderPageTypeEnum.rebuild:
        title = this.workOrderLanguage.rebuildOrder;
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

  /**
   * 页面改变
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 打开部门选择modal
   */
  public showSelectorModal(): void {
    if (this.unitDisabled) {
      return;
    }
    if (!this.isFault && !this.selectedAlarmId) { // 先选告警
      this.$message.error(this.workOrderLanguage.alarmSelectedError);
      return;
    }
    AddClearBarrierOrderUtil.initUnitTreeConfig(this);
    this.treeUnitSelectorConfig.treeNodes = this.alarmUnitNode;
    this.isUnitsVisible = true;
  }

  /**
   * 告警选择modal
   */
  public showAlarmSelectorModal(): void {
    if (this.unitDisabled) {
      return;
    }
    const modal = this.$tempModal.create({
      nzTitle: this.workOrderLanguage.refAlarm,
      nzContent: this.alarmSelectorModalTemp,
      nzOkType: 'danger',
      nzClassName: 'custom-create-modal',
      nzMaskClosable: false,
      nzWidth: 1000,
      nzFooter: [
        {
          label: this.InspectionLanguage.handleOk,
          onClick: () => {
            this.selectAlarm(modal);
            this.restQuery();
          }
        },
        {
          label: this.InspectionLanguage.handleCancel,
          type: 'danger',
          onClick: () => {
            this.restQuery();
            modal.destroy();
          }
        },
      ],
    });
    modal.afterOpen.subscribe(() => {
      this.refreshData();
    });
  }

  /**
   * 选择告警
   * param event
   * param data
   */
  public selectedAlarmChange(event: boolean, data: SelectAlarmModel): void {
    this._selectedAlarm = data;
  }

  /**
   * 选择自动派单
   */
  public selectDispatch(event): void {
    this.formStatus.resetControlData('autoDispatch', event);
  }

  /**
   * 选择告警     只能选单条
   * param modal
   */
  private selectAlarm(modal): void {
    if (this._selectedAlarm) {
      this.selectedAlarm = CommonUtil.deepClone(this._selectedAlarm);
      this.selectedAlarmId = this.selectedAlarm.id;
      this.selectDepartName = null;
      this.selectedAccountabilityUnitIdList = [];
      this.accountabilityUnitList = [];
      this.isAllChecked = false;
      this.alarmName = this.selectedAlarm.alarmName;
      this.formStatus.resetControlData('refAlarm', this.alarmName);
      this.formStatus.resetControlData('equipmentName', this.selectedAlarm.alarmObject);
      this.formStatus.resetControlData('deviceName', this.selectedAlarm.alarmDeviceName);
      this.getUnitDataList(this.selectedAlarm.areaCode);
      this.selectDepartName = '';
      this.selectDeptCode = '';
      modal.destroy();
    } else {
      this.$message.warning(this.workOrderLanguage.alarmSelectedError);
    }
  }

  /**
   * 获取工单详情
   */
  public getWorkOrderDetail(): void {
    this.$clearBarrierWorkOrderService.getWorkOrderDetail(this.workOrderId).subscribe((result: ResultModel<ClearBarrierWorkOrderModel>) => {
      if (result.code === ResultCodeEnum.success) {
        if (result.data.status === WorkOrderStatusEnum.assigned) {
          this.updateStatus = WorkOrderNumber.two;
        } else if (result.data.status === WorkOrderStatusEnum.singleBack) {
          this.updateStatus = WorkOrderNumber.one;
        } else {
          this.updateStatus = WorkOrderNumber.three;
          this.unitDisabled = true;
          this.alarmDisabled = true;
          this.isCheckTime = false;
          this.isDispatch = true;
          this.formStatus.group.controls['title'].disable();
          this.formStatus.group.controls['expectedCompletedTime'].disable();
        }
        this.setWorkOrderData(result.data);
      }
    });
  }

  /**
   * 过滤条件处理
   */
  public handleFilter(filters: FilterCondition[]): FilterCondition[] {
    const filterEvent = [];
    filters.forEach(item => {
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
   * 获取当前告警
   */
  public refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$clearBarrierWorkOrderService.getRefAlarmInfo(this.queryCondition).subscribe((res: ResultModel<AlarmWorkOrderModel[]>) => {
      this._dataSet = [];
      if (res.data && res.data.length > 0) {
        this.pageBean.Total = res.totalCount;
        this.pageBean.pageSize = res.size;
        this.pageBean.pageIndex = res.pageNum;
        res.data.forEach(item => {
          const name = AlarmForCommonUtil.translateAlarmNameByCode(this.$nzI18n, item.alarmCode);
          if (name) {
            item.alarmName = name;
          }
          item.alarmClassificationName = AlarmForCommonUtil.showAlarmTypeInfo(this.alarmTypeList, item.alarmClassification);
          if (item.alarmDeviceTypeId) {
            item.deviceTypeName = WorkOrderBusinessCommonUtil.deviceTypeNames(this.$nzI18n, item.alarmDeviceTypeId);
            if (item.deviceTypeName) {
              item.deviceClass = CommonUtil.getFacilityIconClassName(item.alarmDeviceTypeId);
            }
          }
          if (item.alarmFixedLevel) {
            item.levelName = this.turnAlarmLevel(item.alarmFixedLevel);
            item.levelStyle = this.$alarmStoreService.getAlarmColorByLevel(item.alarmFixedLevel).backgroundColor;
          }
          if (item.alarmSourceTypeId) {
            item.equipmentTypeName = WorkOrderBusinessCommonUtil.equipTypeNames(this.$nzI18n, item.alarmSourceTypeId);
            if (item.equipmentTypeName) {
              item.equipClass = CommonUtil.getEquipmentIconClassName(item.alarmSourceTypeId);
            }
          }
          if (item.alarmConfirmStatus && item.alarmConfirmStatus === AlarmConfirmStatusNumberEnum.isConfirm) {
            item.alarmConfirmStatusName = this.language.isConfirm;
          } else if (item.alarmConfirmStatus && item.alarmConfirmStatus === AlarmConfirmStatusNumberEnum.noConfirm) {
            item.alarmConfirmStatusName = this.language.noConfirm;
          }
          if (item.alarmCleanStatus) {
            switch (item.alarmCleanStatus) {
              case AlarmCleansStatusEnum.isClean:
                item.alarmCleanStatusName = this.language.isClean;
                break;
              case AlarmCleansStatusEnum.deviceClean:
                item.alarmCleanStatusName = this.language.deviceClean;
                break;
              case AlarmCleansStatusEnum.noClean:
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
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 告警对象弹框
   */
  public openEquipmentSelector(filterValue: FilterCondition): void {
    this.equipmentVisible = true;
    this.equipmentFilterValue = filterValue;
  }

  /**
   * 数据加载
   */
  private loadPage(): void {
    this.$activatedRoute.queryParams.subscribe(params => {
      this.procType = ClearBarrierOrInspectEnum.clearBarrier;
      this.pageType = params.status;
      this.pageTitle = this.getPageTitle(this.pageType);
      this.isShowBtn = true;
      if (params.type === RefAlarmFaultEnum.alarm) {
        this.isFault = false;
      } else if (params.type === RefAlarmFaultEnum.fault) {
        this.isFault = true;
      }
      if (this.pageType === WorkOrderPageTypeEnum.update || this.pageType === WorkOrderPageTypeEnum.rebuild) {
        this.workOrderId = params.id;
        this.getWorkOrderDetail();
      } else {
        this.isFault = false;
      }
    });
  }
  /**
   * 提交
   */
  public submitClearData(): void {
    const data = this.setSubmitData();
    const etime = this.formStatus.group.controls.expectedCompletedTime.value.getTime();
    if (this.isCheckTime && etime < new Date().getTime()) {
      this.$message.error(this.InspectionLanguage.expectedCompletionTimeMustBeGreaterThanCurrentTime);
      return;
    }
    this.isLoading = true;
    if (this.pageType === WorkOrderPageTypeEnum.rebuild) {
      // 重新生成
      data.regenerateId = data.procId;
      this.$clearBarrierWorkOrderService.refundGeneratedAgain(data).subscribe((result: ResultModel<string>) => {
        if (result.code === ResultCodeEnum.success) {
          window.history.back();
          this.$message.success(this.workOrderLanguage.regeneratedSuccessful);
        } else {
          this.isLoading = false;
          this.$message.error(result.msg);
        }
      }, () => {
        this.isLoading = false;
      });
    } else {
      const methodName = this.pageType === WorkOrderPageTypeEnum.add ? 'addWorkOrder' : 'updateWorkOrder';
      this.$clearBarrierWorkOrderService[methodName](data).subscribe((result: ResultModel<string>) => {
        if (result.code === ResultCodeEnum.success) {
          this.$router.navigate(['/business/work-order/clear-barrier/unfinished-list']).then();
          this.$message.success(this.InspectionLanguage.operateMsg.successful);
        } else {
          this.isLoading = false;
          this.$message.error(result.msg);
        }
      }, () => {
        this.isLoading = false;
      });
    }
  }

  /**
   * 设置提交数据
   */
  private setSubmitData(): ClearBarrierWorkOrderModel {
    const formData = this.formStatus.group.getRawValue();
    const clearBarrierWorkOrderModel = new ClearBarrierWorkOrderModel();
    clearBarrierWorkOrderModel.title = CommonUtil.trim(formData.title);
    clearBarrierWorkOrderModel.materiel = [];
    clearBarrierWorkOrderModel.autoDispatch = formData.autoDispatch;
    clearBarrierWorkOrderModel.deviceId = this.selectedAlarm.alarmDeviceId;
    clearBarrierWorkOrderModel.deviceName = this.selectedAlarm.alarmDeviceName;
    clearBarrierWorkOrderModel.deviceType = this.selectedAlarm.alarmDeviceTypeId;
    clearBarrierWorkOrderModel.deviceAreaId = this.selectedAlarm.areaId;
    clearBarrierWorkOrderModel.deviceAreaName = this.selectedAlarm.areaName;
    clearBarrierWorkOrderModel.remark = CommonUtil.trim(formData.remark);
    clearBarrierWorkOrderModel.accountabilityDept = this.selectDeptCode;
    clearBarrierWorkOrderModel.accountabilityDeptName = this.selectDepartName;
    clearBarrierWorkOrderModel.equipment = [{
      deviceId: this.selectedAlarm.alarmDeviceId,
      equipmentId: this.selectedAlarm.alarmSource,
      equipmentName: this.selectedAlarm.alarmObject,
      equipmentType: this.selectedAlarm.alarmSourceTypeId,
    }];
    clearBarrierWorkOrderModel.procResourceType = ResourceTypeEnum.manuallyAdd;
    clearBarrierWorkOrderModel.deviceAreaCode = this.selectedAlarm.areaCode;
    if (formData.expectedCompletedTime) {
      clearBarrierWorkOrderModel.expectedCompletedTime = CommonUtil.sendBackEndTime(new Date(formData.expectedCompletedTime).getTime());
    }
    if (this.pageType !== WorkOrderPageTypeEnum.add) {
      clearBarrierWorkOrderModel.procId = this.workOrderId;
    }
    // 故障
    if (this.isFault) {
      clearBarrierWorkOrderModel.troubleId = this.selectedAlarm.troubleId;
      clearBarrierWorkOrderModel.troubleName = this.selectedAlarm.troubleName;
      clearBarrierWorkOrderModel.troubleCode = this.selectedAlarm.troubleCode;
    } else {
      clearBarrierWorkOrderModel.refAlarm = this.selectedAlarmId;
      clearBarrierWorkOrderModel.refAlarmName = this.alarmName;
      clearBarrierWorkOrderModel.refAlarmCode = this.selectedAlarm.alarmCode;
    }
    return clearBarrierWorkOrderModel;
  }

  /**
   * form配置
   */
  private initColumn(): void {
    this.formColumn = [
      {  // 工单名称
        label: this.workOrderLanguage.name,
        key: 'title', type: 'input', require: true,
        rule: [
          {required: true},
          RuleUtil.getNameMinLengthRule(),
          RuleUtil.getNameMaxLengthRule(),
          RuleUtil.getAlarmNamePatternRule(this.InspectionLanguage.nameCodeMsg)
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$clearBarrierWorkOrderService.checkClearName(CommonUtil.trim(value), this.workOrderId),
            res => res.code === ResultCodeEnum.success)
        ]
      },
      { // 工单类型
        label: this.workOrderLanguage.type, key: 'procType', type: 'input',
        disabled: true,
        initialValue: this.workOrderLanguage.clearBarrier, rule: []
      },
      {  // 关联告警
        label: this.workOrderLanguage.relevancyAlarm, key: 'refAlarm', type: 'custom',
        require: true, template: this.alarmTemp,
        rule: [{required: true}], asyncRules: []
      },
      {  // 关联故障
        label: this.workOrderLanguage.relevancyFault, key: 'troubleName', type: 'input',
        require: true, disabled: true,
        rule: [{required: true}], asyncRules: []
      },
      {  // 设施
        label: this.workOrderLanguage.deviceName,
        key: 'deviceName', type: 'input',
        disabled: true, rule: []
      },
      {  // 设备
        label: this.workOrderLanguage.equipmentName,
        key: 'equipmentName', type: 'input',
        disabled: true, rule: []
      },
      { // 是否自动派单
        label: this.InspectionLanguage.autoDispatch,
        key: 'autoDispatch', type: 'custom',
        require: true, rule: [{required: true}],
        template: this.autoDispatch,
        initialValue: IsSelectAllEnum.deny
      },
      { // 责任单位
        label: this.workOrderLanguage.accountabilityUnitName, key: 'accountabilityDept', type: 'custom',
        template: this.accountabilityUnit,
        rule: [], asyncRules: []
      },
      { // 期望完工时间
        label: this.workOrderLanguage.expectedCompleteTime,
        key: 'expectedCompletedTime', type: 'custom',
        template: this.ecTimeTemp, require: true,
        rule: [{required: true}],
        customRules: [{
          code: 'isTime', msg: null, validator: (control: AbstractControl): { [key: string]: boolean } => {
            if (control.value && CommonUtil.sendBackEndTime(new Date(control.value).getTime()) < new Date().getTime()) {
              if (this.formStatus.group.controls['expectedCompletedTime'].dirty) {
                this.$message.info(this.InspectionLanguage.expectedCompletionTimeMustBeGreaterThanCurrentTime);
                return {isTime: true};
              }
            } else {
              return null;
            }
          }
        }]
      },
      {  // 备注
        label: this.workOrderLanguage.remark,
        key: 'remark', type: 'textarea',
        rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
    ];
    this.hiddenColumn();
  }

  /**
   * 获取当前告警等级
   */
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
   * 日期禁用
   */
  disabledEndDate = (current: Date): boolean => {
    const nowTime = new Date();
    return differenceInCalendarDays(current, nowTime) < 0 || CommonUtil.checkTimeOver(current);
  }

  /**
   * 设置数据
   * param data
   */
  private setWorkOrderData(data: ClearBarrierWorkOrderModel): void {
    if (this.isFault) {
      this.selectedAlarmId = null;
      this.alarmName = null;
    } else {
      this.selectedAlarmId = data.refAlarm;
      this.alarmName = data.refAlarmName;
    }
    if (data.procRelatedDepartments) {
      this.selectedAccountabilityUnitIdList = data.procRelatedDepartments.map(item => item.accountabilityDept);
    }
    this.selectDeptCode = data.accountabilityDept;
    this.selectDepartName = data.accountabilityDeptName;
    this.formStatus.resetControlData('title', data.title);
    if (this.isFault) {
      this.formStatus.resetControlData('troubleName', data.troubleName);
    } else {
      this.formStatus.resetControlData('refAlarm', data.refAlarmName);
    }
    this.formStatus.resetControlData('remark', data.remark);
    this.formStatus.resetControlData('deviceName', data.deviceName);
    this.formStatus.resetControlData('equipmentName', data.equipmentName);
    if (data.expectedCompletedTime) {
      this.formStatus.resetControlData('expectedCompletedTime', new Date(CommonUtil.convertTime(data.expectedCompletedTime)));
    }
    if (data.refAlarmName || data.troubleName) {
      this.getUnitDataList(data.deviceAreaCode);
    }
    this.dispatchValue = data.autoDispatch ? data.autoDispatch : IsSelectAllEnum.deny;
    this.formStatus.resetControlData('autoDispatch', this.dispatchValue);
    this.selectedAlarm = {
      alarmName: data.refAlarmName,
      // 设施id
      alarmDeviceId: data.deviceId,
      // 设施名称
      alarmDeviceName: data.deviceName,
      // 设施类型
      alarmDeviceTypeId: data.deviceType,
      // 设备id
      alarmSource: data.equipmentId,
      // 设备类型
      alarmSourceTypeId: data.equipmentType,
      // 设备名称
      alarmObject: data.equipmentName,
      // 区域id
      areaId: data.deviceAreaId,
      // 区域名称
      areaName: data.deviceAreaName,
      id: data.refAlarm,
      // 告警编码
      alarmCode: data.refAlarmCode,
      procId: data.procId,
      // 区域code
      areaCode: data.deviceAreaCode,
      // 故障名称
      troubleName: data.troubleName,
      // 故障id
      troubleId: data.troubleId,
      // 故障code
      troubleCode: data.troubleCode,
      // 自动派单
      autoDispatch: data.autoDispatch ? data.autoDispatch : IsSelectAllEnum.deny,
    };
    this._selectedAlarm = this.selectedAlarm;
  }

  /**
   * 打开责任单位选择器
   */
  public showModal(filterValue: FilterValueModel): void {
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
      this.$userService.queryAllDepartment().subscribe((result: ResultModel<DepartmentUnitModel[]>) => {
        this.unitsTreeNode = result.data || [];
        resolve(true);
      }, (error) => {
        reject(error);
      });
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
      arr = event.map(item => {
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
   * 隐藏列
   */
  private hiddenColumn(): void {
    let type = '';
    if (this.isFault) {
      type = 'refAlarm';
    } else {
      type = 'troubleName';
    }
    this.formColumn.forEach((item, i) => {
      if (item.key === type) {
        item.hidden = true;
        this.formColumn.splice(i, 1);
      }
    });
    this.formColumn.forEach(v => {
      v.labelWidth = WorkOrderFormLabelWidth;
    });
  }

  /**
   * 责任单位选择结果
   * param event
   */
  public selectUnitDataChange(event: DepartmentUnitModel[]): void {
    let code = null;
    let name = '';
    let data = [];
    if (event && event.length > 0) {
      name = event[0].deptName;
      code = event[0].deptCode;
      data = [event[0].id];
      this.isUnitsVisible = false;
    }
    this.selectDepartName = name;
    this.selectDeptCode = code;
    FacilityForCommonUtil.setTreeNodesStatus(this.alarmUnitNode, data);
    this.formStatus.resetControlData('accountabilityDept', code);
    this.isUnitsVisible = false;
  }

  /**
   * 获取清除状态
   */
  public getAlarmCleanStatusName(cleanId: string): string {
    return <string>WorkOrderBusinessCommonUtil.getAlarmCleanStatusName(this.$nzI18n, cleanId);
  }

  /**
   * 获取确认状态
   */
  public getAlarmConfirmStatusName(confirmId: string): string {
    return this.workOrderLanguage[WorkOrderBusinessCommonUtil.getAlarmConfirmStatus(confirmId)];
  }

  /**
   * 设备名称
   */
  public onSelectEquipment(event: EquipmentListModel[]): void {
    this.selectEquipments = event;
    this.selectEquipName = '';
    this.checkEquipmentObject = {
      ids: event.map(v => v.equipmentId) || [],
      name: event.map(v => v.equipmentName).join(',') || '',
      type: ''
    };
    this.equipmentFilterValue.filterValue = this.checkEquipmentObject.ids;
  }

  /**
   * 获取告警单位
   */
  private getUnitDataList(areaCode: string): void {
    const params = new AreaDeviceParamModel();
    params.areaCodes = [areaCode];
    params.userId = WorkOrderBusinessCommonUtil.getUserId();
    this.alarmUnitNode = [];
    this.$facilityForCommonService.listDepartmentByAreaAndUserId(params).subscribe((result: ResultModel<NzTreeNode[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.alarmUnitNode = result.data || [];
      }
    });
  }

  /**
   * 重置查询
   */
  private restQuery(): void {
    this.restTableComponent.tableConfig.showSearch = false;
    this.restTableComponent.handleRest();
    this._dataSet = [];
    this.restTableComponent.queryTerm = null;
    this.restTableComponent.tableQueryTermStoreService.clearQueryTerm();
  }
}
