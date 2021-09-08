import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {WorkOrderLanguageInterface} from '../../../../../assets/i18n/work-order/work-order.language.interface';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {NzI18nService, NzTreeNode} from 'ng-zorro-antd';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {SelectAlarmModel} from '../../share/model/select-alarm.model';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {FilterCondition} from '../../../../shared-module/model/query-condition.model';
import {AddClearBarrierOrderUtil} from '../../clear-barrier/detail/detail-ref-alarm-table.util';
import {AlarmLanguageInterface} from '../../../../../assets/i18n/alarm/alarm-language.interface';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {WorkOrderBusinessCommonUtil} from '../../share/util/work-order-business-common.util';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {DepartmentUnitModel} from '../../../../core-module/model/work-order/department-unit.model';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {AreaDeviceParamModel} from '../../../../core-module/model/work-order/area-device-param.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {differenceInCalendarDays} from 'date-fns';
import {AlarmConfirmForm} from './alarm-confirm-form';
import {WorkOrderPageTypeEnum} from '../../share/enum/work-order-page-type.enum';
import {ClearBarrierOrInspectEnum, IsSelectAllEnum, ResourceTypeEnum} from '../../share/enum/clear-barrier-work-order.enum';
import {AlarmConfirmWorkOrderModel} from '../../../../core-module/model/work-order/alarm-confirm.model';
import {AlarmConfirmWorkOrderService} from '../../share/service/alarm-confirm';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {WorkOrderStatusEnum} from '../../../../core-module/enum/work-order/work-order-status.enum';
import {AlarmForCommonUtil} from '../../../../core-module/business-util/alarm/alarm-for-common.util';
import {SelectModel} from '../../../../shared-module/model/select.model';
import {AlarmForCommonService} from '../../../../core-module/api-service/alarm';

/**
 * 新增/编辑/重新生成告警确认工单
 */
@Component({
  selector: 'app-alarm-confirm-detail',
  templateUrl: './alarm-confirm-detail.component.html',
  styleUrls: ['./alarm-confirm-detail.component.scss']
})
export class AlarmConfirmDetailComponent implements OnInit {
  // 告警选择
  @ViewChild('alarmSelectorModalTemp') public alarmSelectorModalTemp: TemplateRef<any>;
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
  // 单位模板
  @ViewChild('accountabilityUnit') public accountabilityUnit: TemplateRef<any>;
  // 完成时间选择模板
  @ViewChild('ecTimeTemp') public ecTimeTemp: TemplateRef<any>;
  // 关联告警
  @ViewChild('relevantAlarm') public relevantAlarm: TemplateRef<any>;
  // 责任人
  @ViewChild('userSelector') public userSelector: TemplateRef<any>;
  // 自动派单
  @ViewChild('autoDispatch') public autoDispatch: TemplateRef<any>;
  // 国际化
  public InspectionLanguage: InspectionLanguageInterface;
  public workOrderLanguage: WorkOrderLanguageInterface;
  // 告警语言
  public alarmLanguage: AlarmLanguageInterface;
  // 公共语言国际话
  public commonLanguage: CommonLanguageInterface;
  // 页面标题
  public pageTitle: string;
  // 表单列
  public formColumn: FormItem[] = [];
  // 告警
  public alarmName: string = '';
  // 已选择关联告警
  public selectedAlarm: SelectAlarmModel;
  // 表单
  public formStatus: FormOperate;
  // 单位名称
  public selectDepartName: string = '';
  // 禁用单位选择
  public isSelectDept: boolean = true;
  // 单位树
  public treeUnitSelectorConfig: TreeSelectorConfigModel;
  // 显示单位弹窗
  public isUnitsVisible: boolean = false;
  // 加载中
  public isLoading: boolean = false;
  // 相关告警弹框展示
  public relevancyAlarmVisible: boolean = false;
  public selectAlarmId: string[] = [];
  // 禁用告警选择
  public isSelectAlarm: boolean = false;
  // 相关告警名称
  public relevancyAlarmName: string = '';
  // 故障设备查询条件
  public alarmFilter: FilterCondition[] = [];
  // 表单校验
  public isDisabled: boolean;
  // 责任人
  public userName: string;
  // 自动派单
  public dispatchEnum = IsSelectAllEnum;
  public dispatchValue: string = IsSelectAllEnum.deny;
  public isDispatch: boolean = false;
  // 判断当前页新增还是修改
  private pageType = WorkOrderPageTypeEnum.add;
  // 去重
  private detailOrderDeduplication: boolean = false;
  // 告警单位
  private alarmUnitNode: NzTreeNode[] = [];
  // 工单id
  private orderId: string;
  // 告警类别
  public alarmTypeList: SelectModel[] = [];

  constructor(
    private $activatedRoute: ActivatedRoute,
    private $nzI18n: NzI18nService,
    private $ruleUtil: RuleUtil,
    private $router: Router,
    private $message: FiLinkModalService,
    private $facilityForCommonService: FacilityForCommonService,
    private $alarmWorkOrderService: AlarmConfirmWorkOrderService,
    public $alarmForCommonService: AlarmForCommonService,
  ) {}

  public ngOnInit(): void {
    this.workOrderLanguage = this.$nzI18n.getLocaleData(LanguageEnum.workOrder);
    this.InspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.alarmLanguage = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    // 异步告警类别
    AlarmForCommonUtil.getAlarmTypeList(this.$alarmForCommonService).then((data: SelectModel[]) => {
      this.alarmTypeList = data;
    });
    // 加载页面
    this.initFormPage();
    // 初始化单位树
    AddClearBarrierOrderUtil.initUnitTreeConfig(this);
  }

  /**
   * 表单初始化
   */
  public formInstance(event: {instance: FormOperate}): void {
    this.formStatus = event.instance;
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isDisabled = this.formStatus.getValid();
    });
  }

  /**
   * 打开部门选择modal
   */
  public showSelectorModal(): void {
    AddClearBarrierOrderUtil.initUnitTreeConfig(this);
    this.treeUnitSelectorConfig.treeNodes = this.alarmUnitNode;
    this.isUnitsVisible = true;
  }
  /**
   * 责任单位选择结果
   * param event
   */
  public selectUnitDataChange(event: DepartmentUnitModel[]): void {
    if (event && event.length > 0) {
      this.selectDepartName = event[0].deptName;
      FacilityForCommonUtil.setTreeNodesStatus(this.alarmUnitNode, [event[0].id]);
      this.formStatus.resetControlData('accountabilityDept', event[0].deptCode);
      this.isUnitsVisible = false;
    } else {
      this.selectDepartName = '';
      FacilityForCommonUtil.setTreeNodesStatus(this.alarmUnitNode, []);
      this.formStatus.resetControlData('accountabilityDept', null);
    }
  }

  /**
   * 日期禁用
   */
  public disabledEndDate = (current: Date): boolean => {
    return differenceInCalendarDays(current, new Date()) < 0 || CommonUtil.checkTimeOver(current);
  }
  /**
   * 选择自动派单
   */
  public selectDispatch(event): void {
    this.formStatus.resetControlData('autoDispatch', event);
  }

  /**
   * 提交
   */
  public submitClearData(): void {
    const data = this.formStatus.group.getRawValue();
    if (data.expectedCompletedTime && (new Date(data.expectedCompletedTime)).getTime() < (new Date()).getTime()) {
      this.$message.error(this.InspectionLanguage.expectedCompletionTimeMustBeGreaterThanCurrentTime);
      return;
    }
    const alarm = data.refAlarm;
    const param = {
      title: data.title,
      autoDispatch: data.autoDispatch,
      procType: ClearBarrierOrInspectEnum.alarmConfirmOrder,
      procResourceType: ResourceTypeEnum.manuallyAdd,
      deviceId: alarm.alarmDeviceId,
      deviceName: alarm.alarmDeviceName,
      deviceType: alarm.alarmDeviceTypeId,
      deviceAreaId: alarm.areaId,
      deviceAreaCode: alarm.areaCode,
      deviceAreaName: alarm.areaName,
      equipment: [
        {equipmentId: alarm.alarmSource, equipmentType: alarm.alarmSourceTypeId, equipmentName: alarm.alarmObject}
      ],
      refAlarmName: alarm.alarmName,
      refAlarmId: alarm.id,
      refAlarmCode: alarm.alarmCode,
      alarmClassification: alarm.alarmClassification,
      remark: data.remark,
      uncertainReason: data.uncertainReason,
      tenantId: SessionUtil.getTenantId(),
      accountabilityDept: data.accountabilityDept,
      accountabilityDeptName: this.selectDepartName,
      expectedCompletedTime: null
    };
    if (data.expectedCompletedTime) {
      param.expectedCompletedTime = (new Date(data.expectedCompletedTime)).getTime();
    }
    this.isLoading = true;
    if (this.pageType === WorkOrderPageTypeEnum.add) {
      this.$alarmWorkOrderService.addAlarmConfirmOrder(param).subscribe((result: ResultModel<string>) => {
        if (result.code === ResultCodeEnum.success) {
          this.$message.success(this.InspectionLanguage.operateMsg.addSuccess);
          this.cancel();
        } else {
          this.$message.error(result.msg);
        }
        this.isLoading = false;
      }, () => {
        this.isLoading = false;
      });
    } else if (this.pageType === WorkOrderPageTypeEnum.update) {
      param['procId'] = this.orderId;
      this.$alarmWorkOrderService.editAlarmConfirmOrder(param).subscribe((res: ResultModel<string>) => {
        if (res.code === ResultCodeEnum.success) {
          this.$message.success(this.InspectionLanguage.operateMsg.editSuccess);
          this.cancel();
          this.detailOrderDeduplication = true;
        } else {
          this.$message.error(res.msg);
        }
        this.isLoading = false;
      }, () => {
        this.isLoading = false;
      });
    } else {
      // 重新生成
      param['regenerateId'] = this.orderId;
      this.$alarmWorkOrderService.regenerateAlarmOrder(param).subscribe((res: ResultModel<string>) => {
        if (res.code === ResultCodeEnum.success) {
          this.$message.success(this.InspectionLanguage.operateMsg.rebuildSuccess);
          this.$router.navigate(['/business/work-order/alarm-confirm/unfinished-list']).then();
        } else {
          this.$message.error(res.msg);
        }
        this.isLoading = false;
      }, () => this.isLoading = false);
    }
  }

  /**
   * 关联告警
   */
  public onRelevancyAlarmChange(event): void {
    if (event && event.length) {
      this.selectAlarmId = [event[0].id];
      this.relevancyAlarmName = event[0].alarmName;
      this.formStatus.resetControlData('refAlarm', event[0]);
      this.isSelectDept = false;
      // 情况单位及责任人
      this.formStatus.resetControlData('accountabilityDept', '');
      this.selectDepartName = '';
      this.getUnitDataList(event[0].areaCode);
    }
  }
  /**
   * 取消
   */
  public cancel(): void {
    window.history.back();
  }
  /**
   * 页面初始化
   */
  private initFormPage(): void {
    this.$activatedRoute.queryParams.subscribe(params => {
      this.pageType = params.type;
      // 初始化表单配置
      AlarmConfirmForm.initAlarmConfirmConfig(this);
      if (params.type === WorkOrderPageTypeEnum.update || params.type === WorkOrderPageTypeEnum.rebuild) {
        this.orderId = params.procId;
        if (params.operateFrom === WorkOrderPageTypeEnum.unfinished) {
          this.$alarmWorkOrderService.getOrderDetailById(params.procId).subscribe((res: ResultModel<AlarmConfirmWorkOrderModel>) => {
            if (res.code === ResultCodeEnum.success && res.data) {
              this.defaultData(res.data);
            }
          });
        } else {
          this.$alarmWorkOrderService.historyDetailById(params.procId).subscribe((res: ResultModel<AlarmConfirmWorkOrderModel>) => {
            if (res.code === ResultCodeEnum.success && res.data) {
              this.defaultData(res.data);
            }
          });
        }
      }
      this.pageTitle = this.getPageTitle(this.pageType);
    });
  }
  /**
   * 获取页面类型(add/update)
   * param type
   * returns {string}
   */
  private getPageTitle(type: string): string {
    let title;
    switch (type) {
      case WorkOrderPageTypeEnum.add:
        title = this.workOrderLanguage.addAlarmConfirmOrder;
        break;
      case WorkOrderPageTypeEnum.update:
        title = this.workOrderLanguage.updateAlarmConfirmOrder;
        break;
      case WorkOrderPageTypeEnum.rebuild:
        title = this.workOrderLanguage.rebuildAlarmConfirmOrder;
        break;
    }
    return title;
  }
  /**
   * 获取告警单位
   */
  private getUnitDataList(areaCode: string): void {
    const params = new AreaDeviceParamModel();
    params.areaCodes = [areaCode];
    params.userId = WorkOrderBusinessCommonUtil.getUserId();
    this.alarmUnitNode = [];
    this.detailOrderDeduplication = false;
    this.$facilityForCommonService.listDepartmentByAreaAndUserId(params).subscribe((result: ResultModel<NzTreeNode[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.alarmUnitNode = result.data || [];
      }
    });
  }

  /**
   * 编辑前回显数据
   */
  private defaultData(data: AlarmConfirmWorkOrderModel): void {
    this.relevancyAlarmName = data.refAlarmName;
    this.userName = data.assignName;
    this.selectDepartName = data.accountabilityDeptName;
    this.dispatchValue = data.autoDispatch ? data.autoDispatch : '0';
    const alarm = {
      alarmDeviceId: data.deviceId,
      alarmDeviceName: data.deviceName,
      alarmDeviceTypeId: data.deviceType,
      areaId: data.deviceAreaId,
      areaCode: data.deviceAreaCode,
      areaName: data.deviceAreaName,
      alarmSource: '',
      alarmSourceTypeId: '',
      alarmObject: '',
      alarmName: data.refAlarmName,
      id: data.refAlarmId,
      alarmCode: data.refAlarmCode,
      alarmClassification: data.alarmClassification
    };
    this.selectAlarmId = [data.refAlarmId];
    // 设备
    if (data.equipment && data.equipment.length) {
      alarm.alarmSource = data.equipment[0].equipmentId;
      alarm.alarmSourceTypeId = data.equipment[0].equipmentType;
      alarm.alarmObject = data.equipment[0].equipmentName;
    }
    data.autoDispatch = this.dispatchValue;
    if (data.expectedCompletedTime) {
      data.expectedCompletedTime = new Date(CommonUtil.convertTime(new Date(data.expectedCompletedTime).getTime()));
    } else {
      data.expectedCompletedTime = null;
    }
    data.procType = this.workOrderLanguage.alarmConfirmOrder;
    this.getUnitDataList(data.deviceAreaCode);
    // 工单状态不是待指派时，只能编辑备注
    if (data.status !== WorkOrderStatusEnum.assigned && this.pageType === WorkOrderPageTypeEnum.update) {
      this.isDisabled = true;
      this.isDispatch = true;
      this.isSelectAlarm = true;
      this.isSelectDept = true;
      this.formStatus.group.controls['title'].disable();
      this.formStatus.group.controls['uncertainReason'].disable();
      this.formStatus.group.controls['expectedCompletedTime'].disable();
    } else {
      // 存在告警解除单位禁用
      if (data.refAlarmId) {
        this.isSelectDept = false;
      }
    }
    this.formStatus.resetData(data);
    this.formStatus.resetControlData('refAlarm', alarm);
  }
}
