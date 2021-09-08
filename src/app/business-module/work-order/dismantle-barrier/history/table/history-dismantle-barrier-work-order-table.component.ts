import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Result } from '../../../../../shared-module/entity/result';
import * as _ from 'lodash';
import { FiLinkModalService } from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import { NzI18nService } from 'ng-zorro-antd';
import { CommonUtil } from '../../../../../shared-module/util/common-util';
import { TreeSelectorConfigModel } from '../../../../../shared-module/model/tree-selector-config.model';
import { UserForCommonService } from '../../../../../core-module/api-service/user';
import { AlarmForCommonService } from '../../../../../core-module/api-service/alarm';
import { ActivatedRoute, Router } from '@angular/router';
import { InspectionWorkOrderService } from '../../../share/service/inspection';
import { WorkOrderStatusEnum } from '../../../../../core-module/enum/work-order/work-order-status.enum';
import { AlarmSelectorConfigModel } from '../../../../../shared-module/model/alarm-selector-config.model';
import { ResultModel } from '../../../../../shared-module/model/result.model';
import { ResultCodeEnum } from '../../../../../shared-module/enum/result-code.enum';
import { InspectionLanguageInterface } from '../../../../../../assets/i18n/inspection-task/inspection.language.interface';
import { LanguageEnum } from '../../../../../shared-module/enum/language.enum';
import { OperatorEnum } from '../../../../../shared-module/enum/operator.enum';
import { WorkOrderPageTypeEnum } from '../../../share/enum/work-order-page-type.enum';
import { FilterValueModel } from '../../../../../core-module/model/work-order/filter-value.model';
import { AreaFormModel } from '../../../share/model/area-form.model';
import { RoleUnitModel } from '../../../../../core-module/model/work-order/role-unit.model';
import { DeviceTypeModel } from '../../../share/model/device-type.model';
import { OrderUserModel } from '../../../../../core-module/model/work-order/order-user.model';
import { DepartmentUnitModel } from '../../../../../core-module/model/work-order/department-unit.model';
import { FacilityForCommonUtil } from '../../../../../core-module/business-util/facility/facility-for-common.util';
import { RefAlarmFaultEnum } from '../../../share/enum/refAlarm-faultt.enum';
import { AlarmWorkOrderModel } from '../../../share/model/clear-barrier-model/alarm-work-order.model';
import { AlarmLanguageInterface } from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import { EquipmentListModel } from '../../../../../core-module/model/equipment/equipment-list.model';
import { SelectOrderEquipmentModel } from '../../../share/model/select-order-equipment.model';
import { SourceTypeEnum } from '../../../share/enum/clear-barrier-work-order.enum';
import { AlarmListModel } from '../../../../../core-module/model/alarm/alarm-list.model';
import { DismantleBarrierWorkOrderModel } from '../../../share/model/dismantle-barrier-model/dismantle-barrier-work-order.model';
import { DismantleBarrierWorkOrderService } from '../../../share/service/dismantle-barrier';

import {
  DismantleTypeEnum,
  QueryImgResource,
  QueryImgType,
} from '../../../share/enum/dismantle-barrier.config.enum';
import { WorkOrderClearInspectUtil } from '../../../share/util/work-order-clear-inspect.util';
import {
  FilterCondition,
  QueryConditionModel,
  SortCondition,
} from '../../../../../shared-module/model/query-condition.model';
import { ExportRequestModel } from '../../../../../shared-module/model/export-request.model';
import { PageModel } from '../../../../../shared-module/model/page.model';
import { TableConfigModel } from '../../../../../shared-module/model/table-config.model';
import { WorkOrderStatusUtil } from '../../../../../core-module/business-util/work-order/work-order-for-common.util';
import { WorkOrderBusinessCommonUtil } from '../../../share/util/work-order-business-common.util';
import { WorkOrderLanguageInterface } from '../../../../../../assets/i18n/work-order/work-order.language.interface';
import { WorkOrderCommonServiceUtil } from '../../../share/util/work-order-common-service.util';
import { FacilityLanguageInterface } from '../../../../../../assets/i18n/facility/facility.language.interface';
import { CommonLanguageInterface } from '../../../../../../assets/i18n/common/common.language.interface';
import { ClearBarrierImagesModel } from '../../../share/model/clear-barrier-model/clear-barrier-images.model';

import { ImageViewService } from '../../../../../shared-module/service/picture-view/image-view.service';
import {FacilityListModel} from "../../../../../core-module/model/facility/facility-list.model";
/**
 * 历史拆除工单表格
 */
@Component({
  selector: 'app-history-dismantle-barrier-work-order-table',
  templateUrl: './history-dismantle-barrier-work-order-table.component.html',
  styleUrls: ['./history-dismantle-barrier-work-order-table.component.scss'],
})
export class HistoryDismantleBarrierWorkOrderTableComponent implements OnInit {
  // 状态模板
  @ViewChild('statusTemp') public statusTemp: TemplateRef<any>;
  // 设施图标
  @ViewChild('deviceTemp') public deviceTemp: TemplateRef<any>;
  // 单位模板
  @ViewChild('unitNameSearch') public unitNameSearch: TemplateRef<any>;
  // 关联告警模板
  @ViewChild('refAlarmTemp') public refAlarmTemp: TemplateRef<any>;
  // 区域查询模板
  @ViewChild('AreaSearch') public areaSearch: TemplateRef<any>;
  // 设施总数模板
  @ViewChild('DeviceNameSearch') public deviceNameSearch: TemplateRef<any>;
  // 设备选择
  @ViewChild('equipmentSearch') public equipmentSearch: TemplateRef<any>;
  // 设备类型
  @ViewChild('equipmentTemp') public equipmentTemp: TemplateRef<any>;
  // 设施状态
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<HTMLDocument>;
  // 单位模板
  @ViewChild('UnitNameSearch') public UnitNameSearch: TemplateRef<any>;
  public inspectionLanguage: InspectionLanguageInterface;
  // 关联告警modal内容数据
  public alarmData;
  // 关联故障数据
  public faultData;
  // 设备选择器显示
  public equipmentVisible: boolean = false;
  // 勾选的设备
  public checkEquipmentObject: SelectOrderEquipmentModel = new SelectOrderEquipmentModel();
  // 设备勾选容器
  public selectEquipments: EquipmentListModel[] = [];
  // 弹窗显示隐藏
  public isVisible: boolean = false;
  // 树配置
  public treeSelectorConfig: TreeSelectorConfigModel;
  // 树节点数据
  public treeNodes: DepartmentUnitModel[] = [];
  // 单位名称
  public selectUnitName: string;
  // 列表数据
  public historyTableData: DismantleBarrierWorkOrderModel[] = [];
  // 国际化
  public alarmLanguage: AlarmLanguageInterface;
  // 控制区域显示隐藏
  public areaSelectVisible: boolean = false;
  // 区域选择器配置
  public areaSelectorConfig: TreeSelectorConfigModel;
  // 设施选择器配置
  public deviceObjectConfig: AlarmSelectorConfigModel;
  // 弹窗显示
  public tempSelectVisible: boolean = false;
  // 显示关联告警
  public isShowRefAlarm: boolean = false;
  // 显示关联故障
  public isShowRefFault: boolean = false;
  // 过滤条件
  public filterObj: FilterValueModel = {
    picName: '',
    deviceName: '',
    deviceCode: '',
    areaName: '',
    resource: null,
    areaId: '',
    deviceIds: [],
    deviceTypes: [],
    equipmentIds: [],
    equipmentName: '',
    filterValue: null,
  };
  // 过滤数据
  private filterValue: FilterValueModel;
  // 区域筛选值
  private areaFilterValue: FilterValueModel;
  // 区域节点数据
  private areaNodes: AreaFormModel[] = [];
  // 模型传参数
  public modalParams: RoleUnitModel[];
  // 是否重置
  private isReset: boolean = false;
  // 设备选择器显示
  private equipmentFilterValue: FilterCondition;
  //  设施类型下拉框
  private selectOption: DeviceTypeModel[];
  // 角色数据
  private roleArr: RoleUnitModel[] = [];

  // 查询参数模型
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // 导出
  private exportParams: ExportRequestModel = new ExportRequestModel();
  // 列表配置
  public tableConfig: TableConfigModel;
  // 分页
  public pageBean: PageModel = new PageModel();
  /** 设施设备类型 */
  dismantleTypeEnum = DismantleTypeEnum;

  // 设施过滤选择器
  public facilityVisible: boolean = false;
  /** 已选择设施数据 */
  public selectFacility: FacilityListModel[] = [];
  // 过滤框显示设施名
  public filterDeviceName: string = '';

  

  languageEnum = LanguageEnum;
  public workOrderLanguage: WorkOrderLanguageInterface;
  facilityLanguage: FacilityLanguageInterface;
  commonLanguage: CommonLanguageInterface;
  constructor(
    public $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $userService: UserForCommonService,
    private $alarmService: AlarmForCommonService,
    private $router: Router,
    private $inspectionWorkOrderService: InspectionWorkOrderService,
    private $active: ActivatedRoute,
    private $dismantleBarrierWorkOrderService: DismantleBarrierWorkOrderService,
    private $workOrderCommonUtil: WorkOrderCommonServiceUtil,
    private $imageViewService: ImageViewService,
  ) {}

  public ngOnInit(): void {
    this.getId();
    this.alarmLanguage = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.inspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.workOrderLanguage = this.$nzI18n.getLocaleData(LanguageEnum.workOrder);
    this.facilityLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.setSelectOption();
    this.initTableConfig();
    this.refreshData();
    this.queryDeptList().then();
    this.initTreeSelectorConfig();
    this.initAreaSelectorConfig();
    this.initDeviceObjectConfig();
    this.initAlarmEquipment();
    //  && !this.isReset
    this.$active.queryParams.subscribe((param) => {
      if (param.id) {
        const arr = this.queryCondition.filterConditions.find((item) => {
          return item.filterField === '_id';
        });
        if (!arr) {
          this.queryCondition.filterConditions.push({
            filterField: '_id',
            filterValue: param.id,
            operator: OperatorEnum.eq,
          });
        }
        this.refreshData();
      }
    });
  }

  /**
   * 刷新表格数据
   */
  public refreshData(): void {
    this.tableConfig.isLoading = true;
    const procId = this.$active.snapshot.queryParams.id;
    this.queryCondition.filterConditions.forEach((v) => {
      if (v.filterField === 'deviceId') {
        v.operator = OperatorEnum.in;
      }
      if (v.filterField === 'equipmentName') {
        v.filterField = 'equipmentId';
        v.operator = OperatorEnum.in;
      }
      if (v.filterField === 'equipmentType') {
        v.operator = OperatorEnum.in;
        v.filterField = 'equipmentType';
      }
      if (v.filterField === 'equipmentId') {
        v.operator = OperatorEnum.in;
        v.filterField = 'equipmentId';
      }
    });
    // 是否重置
    if (!this.isReset) {
      // 其它页面跳转工单 工单id
      if (procId) {
        const arr = this.queryCondition.filterConditions.find((item) => {
          return item.filterField === '_id';
        });
        if (!arr) {
          this.queryCondition.filterConditions.push({
            filterField: '_id',
            filterValue: procId,
            operator: OperatorEnum.eq,
          });
        }
      }
    }
    this.$dismantleBarrierWorkOrderService
      .removeHistoryWorkOrderList_API(this.queryCondition)
      .subscribe(
        (result: ResultModel<DismantleBarrierWorkOrderModel[]>) => {
          this.tableConfig.isLoading = false;
          if (result.code === ResultCodeEnum.success) {
            this.pageBean.Total = result.totalPage * result.size;
            this.pageBean.pageSize = result.size;
            this.pageBean.pageIndex = result.pageNum;
            const data = result.data ? result.data : [];
            data.forEach((item) => {
              // 获取工单状态图标class及名称
              item.statusName = WorkOrderStatusUtil.getWorkOrderStatus(this.$nzI18n, item.status);
              item.statusClass = WorkOrderStatusUtil.getWorkOrderIconClassName(item.status);
              // 获取设施类型名称及设施类型图标
              if (item.deviceType) {
                item.deviceTypeName = WorkOrderBusinessCommonUtil.deviceTypeNames(
                  this.$nzI18n,
                  item.deviceType,
                );
                if (item.deviceTypeName) {
                  item.deviceClass = CommonUtil.getFacilityIconClassName(item.deviceType);
                } else {
                  item.deviceClass = '';
                }
              }
              // 判断操作按钮状态
              if (
                item.status === WorkOrderStatusEnum.singleBack &&
                item.dataResourceType !== SourceTypeEnum.trouble
              ) {
                item.isShowTurnBackConfirmIcon = true;
              }
              // 判断工单来源
              if (item.dataResourceType) {
                item.dataResourceType = this.workOrderLanguage[
                  WorkOrderBusinessCommonUtil.getEnumKey(item.dataResourceType, SourceTypeEnum)
                ];
              }
              item.equipmentTypeList = [];
              item.equipmentTypeName = '';
              // 详情
              item.isShowWriteOffOrderDetail = true;
              // 获取设备类型名称及设备类型图标
              if (item.equipmentType) {
                const equip = WorkOrderClearInspectUtil.handleMultiEquipment(
                  item.equipmentType,
                  this.$nzI18n,
                );
                item.equipmentTypeList = equip.equipList;
                item.equipmentTypeName = equip.names.join(',');
              }
            });
            this.historyTableData = data;
          } else {
            this.$message.error(result.msg);
          }
        },
        () => {
          this.tableConfig.isLoading = false;
        },
      );
  }

  /**
   * 获得所有的责任人
   */
  private getAllUser(): void {
    this.$inspectionWorkOrderService
      .getDepartUserList()
      .subscribe((result: ResultModel<OrderUserModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          const list = result.data || [];
          list.forEach((item) => {
            this.roleArr.push({ label: item.userName, value: item.id });
          });
        }
      });
  }

  /**
   * 设置设施类型下拉款选项
   */
  private setSelectOption(): void {
    this.selectOption = WorkOrderStatusUtil.getWorkOrderStatusList(this.$nzI18n).filter((item) => {
      return (
        item.value === WorkOrderStatusEnum.completed ||
        item.value === WorkOrderStatusEnum.singleBack
      );
    });
  }

  /**
   * 打开关联告警modal
   */
  public showRefAlarmModal(data): void {
    // 关联故障
    if (data.troubleId && data.troubleId.length > 0) {
      this.faultData = data.troubleId;
      this.isShowRefFault = true;
      return;
    }
    // 当前告警
    this.$alarmService
      .queryCurrentAlarmInfoById(data.refAlarm)
      .subscribe((result: ResultModel<AlarmListModel>) => {
        if (result.code === 0 && result.data) {
          this.alarmData = result.data;
          if (this.alarmData.alarmContinousTime) {
            this.alarmData.alarmContinousTime = `${this.alarmData.alarmContinousTime}${this.alarmLanguage.hour}`;
          } else {
            this.alarmData.alarmContinousTime = '';
          }
          this.isShowRefAlarm = true;
        } else {
          // 历史告警
          // tslint:disable-next-line:no-shadowed-variable
          this.$alarmService
            .queryAlarmHistoryInfo(data.refAlarm)
            // tslint:disable-next-line: no-shadowed-variable
            .subscribe((result: ResultModel<AlarmListModel>) => {
              if (result.code === 0 && result.data) {
                this.alarmData = result.data;
                if (this.alarmData.alarmContinousTime) {
                  this.alarmData.alarmContinousTime = `${this.alarmData.alarmContinousTime}${this.alarmLanguage.hour}`;
                } else {
                  this.alarmData.alarmContinousTime = '';
                }
                this.isShowRefAlarm = true;
              } else {
                this.$message.error(this.inspectionLanguage.noData);
              }
            });
        }
      });
  }

  /**
   * 显示告警弹窗
   */
  public closeRefAlarm(): void {
    this.isShowRefAlarm = false;
    this.alarmData = null;
  }

  /**
   * 关闭故障弹窗
   */
  public closeRefFault(): void {
    this.isShowRefFault = false;
  }
  /**
   * 根据ID跳转
   */
  private getId(): void {
    if (this.$active.snapshot.queryParams.id) {
      const workOrderId = this.$active.snapshot.queryParams.id;
      this.queryCondition.bizCondition.procIds = [workOrderId];
    }
  }

  /**
   * 导出
   */
  public handleExport(event): void {
    this.createExportParams(event);
    this.$dismantleBarrierWorkOrderService
      .exportDismantleHistoryWorkOrder_API(this.exportParams)
      .subscribe((result: Result) => {
        if (result.code === ResultCodeEnum.success) {
          this.$message.success(result.msg);
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * 生成导出条件
   */
  private createExportParams(event): void {
    if (event && !_.isEmpty(event.selectItem)) {
        const ids = event.selectItem.map(item => item.procId);
        const filter = new FilterCondition('_id', OperatorEnum.in, ids);
        this.exportParams.queryCondition.filterConditions.push(filter);
    } else {
        // 处理查询条件
        this.exportParams.queryCondition.filterConditions = event.queryTerm;
    }
    // this.exportParams.queryCondition = new QueryConditionModel();
    // this.exportParams.queryCondition.filterConditions = this.queryCondition.filterConditions;
    this.exportParams.excelType = event.excelType;
  }

  /**
   * 打开责任单位选择器
   */
  public showModal(filterValue: FilterValueModel): void {
    if (this.treeSelectorConfig.treeNodes.length === 0) {
      this.queryDeptList().then((bool) => {
        if (bool === true) {
          this.filterValue = filterValue;
          if (!this.filterValue['filterValue']) {
            this.filterValue['filterValue'] = null;
          }
          this.treeSelectorConfig.treeNodes = this.treeNodes;
          this.isVisible = true;
        }
      });
    } else {
      this.isVisible = true;
    }
  }

  /**
   * 初始化单位选择器配置
   */
  private initTreeSelectorConfig(): void {
    this.treeSelectorConfig = {
      title: `${this.facilityLanguage.selectUnit}`,
      width: '400px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting: {
        check: { enable: true, chkStyle: 'radio', radioType: 'all' },
        data: {
          simpleData: {
            enable: true,
            idKey: 'id',
            pIdKey: 'deptFatherId',
            rootPid: null,
          },
          key: { name: 'deptName', children: 'childDepartmentList' },
        },
        view: { showIcon: false, showLine: false },
      },
      onlyLeaves: false,
      selectedColumn: [],
    };
  }

  /**
   * 责任单位选择结果
   * param event
   */
  public selectDataChange(event: DepartmentUnitModel[]): void {
    this.selectUnitName = '';
    if (event && event.length > 0) {
      this.selectUnitName = event[0].deptName;
      this.filterValue['filterValue'] = event[0].deptCode;
      FacilityForCommonUtil.setTreeNodesStatus(this.treeNodes, [event[0].id]);
    }
  }

  /**
   * 查询所有的区域
   */
  private queryDeptList(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.$userService.queryAllDepartment().subscribe(
        (result: Result) => {
          this.treeNodes = result.data || [];
          resolve(true);
        },
        (error) => {
          reject(error);
        },
      );
    });
  }

  /**
   * 初始化表格配置
   */
  public initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      primaryKey: '06-6-2',
      showSearchSwitch: true,
      showSizeChanger: true,
      showSearchExport: true,
      scroll: { x: '1800px', y: '600px' },
      columnConfig: [
        {
          type: 'select',
          fixedStyle: { fixedLeft: true, style: { left: '0px' } },
          width: 62,
        },
        {
          // 工单名称
          title: this.workOrderLanguage.name,
          key: 'title',
          width: 150,
          configurable: false,
          searchable: true,
          isShowSort: true,
          fixedStyle: { fixedLeft: true, style: { left: '124px' } },
          searchConfig: { type: 'input' },
        },
        // 任务描述
        {
          title: this.workOrderLanguage.taskDescription,
          key: 'taskDescribe',
          width: 150,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        // 工单状态
        {
          title: this.workOrderLanguage.status,
          key: 'status',
          width: 150,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'status',
          minWidth: 100,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.selectOption,
          },
          type: 'render',
          renderTemplate: this.statusTemp,
        },
        // 拆除设施/设备
        {
          title: this.workOrderLanguage.facilitiesEquipment,
          key: 'removeType',
          width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          type: 'render',
          renderTemplate: this.deviceTypeTemp,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: CommonUtil.codeTranslate(
              DismantleTypeEnum,
              this.$nzI18n,
              null,
              this.languageEnum.workOrder,
            ),
            label: 'label',
            value: 'code',
          },
        },
        // 设施名称
        {
          title: this.workOrderLanguage.deviceName,
          key: 'deviceName',
          width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchKey: 'deviceId',
          searchConfig: { type: 'render', renderTemplate: this.deviceNameSearch },
        },
        // 设施类型
        {
          title: this.workOrderLanguage.deviceType,
          key: 'deviceType',
          width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchKey: 'deviceType',
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleFacility(this.$nzI18n),
            label: 'label',
            value: 'code',
          },
          type: 'render',
          renderTemplate: this.deviceTemp,
        },
        // 设施型号
        {
          title: this.workOrderLanguage.facilityModel,
          key: 'deviceModel',
          width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        // 拆除点位
        {
          title: this.workOrderLanguage.removePosition,
          key: 'removePosition',
          width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        // 设备名称
        {
          title: this.workOrderLanguage.equipmentName,
          key: 'equipmentName',
          width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchKey: 'equipmentId',
          searchConfig: { type: 'render', renderTemplate: this.equipmentSearch },
        },
        // 设备类型
        {
          title: this.workOrderLanguage.equipmentType,
          key: 'equipmentType',
          width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchKey: 'equipmentType',
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n),
            label: 'label',
            value: 'code',
          },
          type: 'render',
          renderTemplate: this.equipmentTemp,
        },
        // 设施区域
        {
          title: this.workOrderLanguage.deviceArea,
          key: 'deviceAreaName',
          width: 150,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'deviceAreaCode',
          searchConfig: { type: 'render', renderTemplate: this.areaSearch },
        },
        {
          // 关联告警 故障
          title: `${this.workOrderLanguage.relevance}${this.workOrderLanguage.alarm}/${this.workOrderLanguage.fault}`,
          key: 'refName',
          width: 180,
          configurable: true,
          type: 'render',
          searchable: true,
          renderTemplate: this.refAlarmTemp,
          searchKey: 'refName',
          searchConfig: { type: 'input' },
        },
        {
          // 责任单位
          title: this.workOrderLanguage.accountabilityUnitName,
          key: 'accountabilityDeptName',
          width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchKey: 'accountabilityDept',
          searchConfig: { type: 'render', renderTemplate: this.UnitNameSearch },
        },
        {
          // 责任人
          title: this.workOrderLanguage.assignName,
          key: 'assignName',
          width: 140,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchKey: 'assign',
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.roleArr,
          },
        },
        {
          // 实际完工时间
          title: this.workOrderLanguage.realCompleteTime,
          key: 'realityCompletedTime',
          configurable: true,
          width: 200,
          isShowSort: true,
          searchable: true,
          pipe: 'date',
          searchConfig: { type: 'dateRang' },
        },
        {
          // 操作
          title: this.commonLanguage.operate,
          searchable: true,
          searchConfig: { type: 'operate' },
          key: '',
          width: 180,
          fixedStyle: { fixedRight: true, style: { right: '0px' } },
        },
      ],
      showPagination: false,
      showEsPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [
        {
          // 重新生成
          text: this.commonLanguage.rebuild,
          key: 'isShowTurnBackConfirmIcon',
          className: 'fiLink-rebuild-order',
          permissionCode: '06-6-2-3',
          /*needConfirm: true,
                    confirmContent: this.workOrderLanguage.turnBackConfirmContent,*/
          handle: (currentIndex) => {
            const id = currentIndex.procId;
            let type = '';
            if (currentIndex.refAlarm) {
              type = RefAlarmFaultEnum.alarm;
            } else if (currentIndex.troubleId) {
              type = RefAlarmFaultEnum.fault;
            }
            this.$router
              .navigate(['business/work-order/dismantle-barrier/unfinished-detail/rebuild'], {
                queryParams: {
                  id: id,
                  status: WorkOrderPageTypeEnum.rebuild,
                  type: type,
                  route: WorkOrderPageTypeEnum.finished,
                },
              })
              .then();
          },
        },
        {
          // 图片
          text: this.commonLanguage.viewPhoto,
          className: 'fiLink-view-photo',
          permissionCode: '06-6-2-1',
          handle: (data) => {
            this.getPicUrlByAlarmIdAndDeviceId(data);
          },
        },
        {
          // 详情
          text: this.commonLanguage.writeOffOrderDetail,
          className: 'fiLink-view-detail',
          permissionCode: '06-6-2-2',
          handle: (currentIndex) => {
            this.$router
              .navigate(['business/work-order/dismantle-barrier/finished-detail/view'], {
                queryParams: {
                  id: currentIndex.procId,
                  type: WorkOrderPageTypeEnum.finished,
                },
              })
              .then();
          },
        },
      ],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      openTableSearch: () => {
        if (this.roleArr.length === 0) {
          this.getAllUser();
        }
      },
      handleSearch: (event) => {
        if (event && event.length === 0) {
          this.isReset = true;
          this.selectEquipments = [];
          this.checkEquipmentObject = {
            ids: [],
            name: '',
            type: '',
          };
          this.selectUnitName = '';
          FacilityForCommonUtil.setTreeNodesStatus(this.treeNodes, []);
          this.filterObj.areaName = '';
          FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes || [], null);
          this.filterObj.deviceName = '';
          this.filterObj.deviceIds = [];
          this.initDeviceObjectConfig();
        }
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
      handleExport: (event) => {
        this.exportParams.columnInfoList = event.columnInfoList;
        const params = [
          'status',
          'equipmentType',
          'realityCompletedTime',
          'deviceType',
          'removeType',
        ];
        this.exportParams.columnInfoList.forEach((item) => {
          if (params.indexOf(item.propertyName) > -1) {
            item.isTranslation = 1;
          }
        });
        this.handleExport(event);
      },
    };
  }

  /**
   * 查看图片
   * param ids
   */
  private getPicUrlByAlarmIdAndDeviceId(data: DismantleBarrierWorkOrderModel): void {
    const param = new ClearBarrierImagesModel();
    param.objectId = data.removeType === DismantleTypeEnum.device ? data.deviceId : data.equipmentId;
    param.objectType =
      data.removeType === DismantleTypeEnum.device ? QueryImgType.device : QueryImgType.equipment;
    param.resource = QueryImgResource.order;
    param.resourceId = data.procId;
    this.$dismantleBarrierWorkOrderService.queryImages([param]).subscribe((result: Result) => {
      if (result.code === ResultCodeEnum.success) {
        if (result.data.length === 0) {
          this.$message.warning(this.inspectionLanguage.noPicture);
        } else {
          this.$imageViewService.showPictureView(result.data);
        }
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 区域展示
   */
  public showArea(filterValue: FilterValueModel): void {
    this.areaFilterValue = filterValue;
    // 当区域数据不为空的时候
    if (this.areaNodes && this.areaNodes.length > 0) {
      this.areaSelectorConfig.treeNodes = this.areaNodes;
      this.areaSelectVisible = true;
    } else {
      // 查询区域列表
      this.$workOrderCommonUtil.getRoleAreaList().then((data: any[]) => {
        this.areaNodes = data;
        this.areaSelectorConfig.treeNodes = this.areaNodes;
        FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, null);
        this.areaSelectVisible = true;
      });
    }
  }

  /**
   * 区域选择监听
   * param item
   */
  public areaSelectChange(item: AreaFormModel[]): void {
    if (item && item[0]) {
      this.filterObj.areaId = item[0].areaCode;
      this.filterObj.areaName = item[0].areaName;
      this.areaFilterValue.filterValue = item[0].areaCode;
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, item[0].areaId, item[0].areaId);
    } else {
      this.filterObj.areaId = '';
      this.filterObj.areaName = '';
      this.areaFilterValue.filterValue = null;
    }
  }

  /**
   * 初始化选择区域配置
   * param nodes
   */
  private initAreaSelectorConfig(): void {
    this.areaSelectorConfig = {
      width: '500px',
      height: '300px',
      title: `${this.facilityLanguage.select}${this.inspectionLanguage.area}`,
      treeSetting: {
        check: { enable: true, chkStyle: 'radio', radioType: 'all' },
        data: {
          simpleData: { enable: true, idKey: 'areaId' },
          key: { name: 'areaName' },
        },
        view: { showIcon: false, showLine: false },
      },
      treeNodes: this.areaNodes || [],
    };
  }

  /**
   * 设施选择器
   */
  private initDeviceObjectConfig(): void {
    this.deviceObjectConfig = {
      clear: !this.filterObj.deviceIds.length,
      handledCheckedFun: (event) => {
        this.filterObj.deviceIds = event.ids;
        this.filterObj.deviceName = event.name;
      },
    };
  }
  /**
   * 设备名称（告警对象）
   */
  private initAlarmEquipment(): void {}

  /**
   * 告警对象过滤
   */
  public onSelectEquipment(event: EquipmentListModel[]): void {
    this.selectEquipments = event;
    this.checkEquipmentObject = {
      ids: event.map((v) => v.equipmentId) || [],
      type: '',
      name: event.map((v) => v.equipmentName).join(',') || '',
    };
    this.equipmentFilterValue.filterValue =
      this.checkEquipmentObject.ids.length === 0 ? null : this.checkEquipmentObject.ids;
  }

  /**
   * 告警对象弹框
   */
  public openEquipmentSelector(filterValue): void {
    this.equipmentVisible = true;
    this.equipmentFilterValue = filterValue;
  }
  /*
   * 完工记录分页
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 点击输入框弹出设施选择
   */
  public onShowFacility(filterValue: FilterCondition): void {
    this.filterValue = filterValue;
    this.facilityVisible = true;
    if (!this.filterValue.filterValue) {
      this.filterValue.filterValue = [];
    } else {
      const deviceNameArr = this.filterValue.filterName.split(',');
      this.selectFacility = this.filterValue.filterValue.map((item, index) => {
        return { deviceId: item, deviceName: deviceNameArr[index] };
      });
    }
  }

  /**
   * 选择设施数据
   */
  public onFacilityChange(event: FacilityListModel[]): void {
    this.selectFacility = event || [];
    if (!_.isEmpty(event)) {
      this.filterDeviceName = event
        .map((item) => {
          return item.deviceName;
        })
        .join(',');
      this.filterValue.filterValue =
        event.map((item) => {
          return item.deviceId;
        }) || [];
    } else {
      this.filterDeviceName = '';
      this.filterValue.filterValue = null;
    }
    this.filterValue.filterName = this.filterDeviceName;
    console.log(this.filterValue, event);
  }
}
