import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import * as _ from 'lodash';
import * as UnfinishedTable from './unfinished-dismantle-barrier-work-order-table.util';
import { WorkOrderInitTreeUtil } from '../../../share/util/work-order-init-tree.util';
import { NzI18nService, NzModalService, NzTreeNode } from 'ng-zorro-antd';
import { Result } from '../../../../../shared-module/entity/result';
import { AlarmForCommonService } from '../../../../../core-module/api-service/alarm';
import { ActivatedRoute, Router } from '@angular/router';
import { DismantleBarrierWorkOrderService } from '../../../share/service/dismantle-barrier';
import { FiLinkModalService } from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import { CommonUtil } from '../../../../../shared-module/util/common-util';
import { TreeSelectorConfigModel } from '../../../../../shared-module/model/tree-selector-config.model';
import { UserForCommonService } from '../../../../../core-module/api-service/user';
import { WorkOrderStatusEnum } from '../../../../../core-module/enum/work-order/work-order-status.enum';
import { AlarmSelectorConfigModel } from '../../../../../shared-module/model/alarm-selector-config.model';
import { IndexMissionService } from '../../../../../core-module/mission/index.mission.service';
import { ResultModel } from '../../../../../shared-module/model/result.model';
import { ClearBarrierWorkOrderModel } from '../../../../../core-module/model/work-order/clear-barrier-work-order.model';
import { ResultCodeEnum } from '../../../../../shared-module/enum/result-code.enum';
import { OperatorEnum } from '../../../../../shared-module/enum/operator.enum';
import { FilterValueModel } from '../../../../../core-module/model/work-order/filter-value.model';
import { DeviceTypeModel } from '../../../share/model/device-type.model';
import { InspectionLanguageInterface } from '../../../../../../assets/i18n/inspection-task/inspection.language.interface';
import { LanguageEnum } from '../../../../../shared-module/enum/language.enum';
import { RoleUnitModel } from '../../../../../core-module/model/work-order/role-unit.model';
import { DepartmentUnitModel } from '../../../../../core-module/model/work-order/department-unit.model';
import { SuggestModel } from '../../../share/model/suggest.model';
import { AreaFormModel } from '../../../share/model/area-form.model';
import { ClearBarrierDepartmentModel } from '../../../share/model/clear-barrier-model/clear-barrier-department.model';
import { DismantleBarrierWorkOrderModel } from '../../../share/model/dismantle-barrier-model/dismantle-barrier-work-order.model';
import { TransferOrderParamModel } from '../../../share/model/clear-barrier-model/transfer-order-param.model';
import { AlarmWorkOrderModel } from '../../../share/model/clear-barrier-model/alarm-work-order.model';
import { EquipmentListModel } from '../../../../../core-module/model/equipment/equipment-list.model';
import { WorkOrderPageTypeEnum } from '../../../share/enum/work-order-page-type.enum';
import { SelectOrderEquipmentModel } from '../../../share/model/select-order-equipment.model';
import { AlarmForCommonUtil } from '../../../../../core-module/business-util/alarm/alarm-for-common.util';
import { AlarmListModel } from '../../../../../core-module/model/alarm/alarm-list.model';
import {
  DismantleTypeEnum,
  DismantleWarnTroubleEnum,
  InsertOrDeleteEnum,
} from '../../../share/enum/dismantle-barrier.config.enum';
import { WorkOrderBusinessCommonUtil } from '../../../share/util/work-order-business-common.util';
import {
  ClearBarrierOrInspectEnum,
  LastDayColorEnum,
  SourceTypeEnum,
} from '../../../share/enum/clear-barrier-work-order.enum';
import { WorkOrderStatusUtil } from '../../../../../core-module/business-util/work-order/work-order-for-common.util';
import { WorkOrderLanguageInterface } from '../../../../../../assets/i18n/work-order/work-order.language.interface';
import { CommonLanguageInterface } from '../../../../../../assets/i18n/common/common.language.interface';
import { WorkOrderClearInspectUtil } from '../../../share/util/work-order-clear-inspect.util';
import { NativeWebsocketImplService } from '../../../../../core-module/websocket/native-websocket-impl.service';
import { WebsocketMessageModel } from '../../../../../core-module/model/websocket-message.model';
import { ChannelCode } from '../../../../../core-module/enum/channel-code';
import { PageModel } from '../../../../../shared-module/model/page.model';
import {
  FilterCondition,
  QueryConditionModel,
} from '../../../../../shared-module/model/query-condition.model';
import { TableComponent } from '../../../../../shared-module/component/table/table.component';
import { TableConfigModel } from '../../../../../shared-module/model/table-config.model';
import { ExportRequestModel } from '../../../../../shared-module/model/export-request.model';
import { FacilityForCommonUtil } from '../../../../../core-module/business-util/facility/facility-for-common.util';
import { WorkOrderCommonServiceUtil } from '../../../share/util/work-order-common-service.util';
import { ClearBarrierWorkOrderService } from '../../../share/service/clear-barrier';

import { FacilityForCommonService } from '../../../../../core-module/api-service/facility';

import { AreaDeviceParamModel } from '../../../../../core-module/model/work-order/area-device-param.model';
import { FacilityListModel } from '../../../../../core-module/model/facility/facility-list.model';
import { UserRoleModel } from '../../../../../core-module/model/user/user-role.model';

/**
 * 未完工 拆除工单 表格
 */
@Component({
  selector: 'app-unfinished-dismantle-barrier-work-order-table',
  templateUrl: './unfinished-dismantle-barrier-work-order-table.component.html',
  styleUrls: ['./unfinished-dismantle-barrier-work-order-table.component.scss'],
})
export class UnfinishedDismantleBarrierWorkOrderTableComponent
  implements OnInit, OnChanges, OnDestroy {
  // 表格上部卡片
  @Input() slideShowChangeData;
  // 监听
  @Output() workOrderEvent = new EventEmitter();
  // 工单状态模板
  @ViewChild('statusTemp') public statusTemp: TemplateRef<any>;
  // 设施图标
  @ViewChild('deviceTemp') public deviceTemp: TemplateRef<any>;
  // 底部按钮
  @ViewChild('footerTemp') public footerTemp: TemplateRef<any>;
  // 单位模板
  @ViewChild('UnitNameSearch') public UnitNameSearch: TemplateRef<any>;
  // 关联告警
  @ViewChild('refAlarmTemp') public refAlarmTemp: TemplateRef<any>;
  // 撤回
  @ViewChild('singleBackTemp') public singleBackTemp: TemplateRef<any>;
  // 表格
  @ViewChild('tableComponent') public tableComponent: TableComponent;
  // 区域筛选
  @ViewChild('AreaSearch') public areaSearch: TemplateRef<any>;
  // 选择设施名称
  @ViewChild('DeviceNameSearch') public deviceNameSearch: TemplateRef<any>;
  // 设备选择
  @ViewChild('equipmentSearch') public equipmentSearch: TemplateRef<any>;
  // 设备类型
  @ViewChild('equipTemps') public equipTemps: TemplateRef<any>;
  // 设施状态
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<HTMLDocument>;
  // 用户筛选
  @ViewChild('userSearchTemp') userSearchTemp: TemplateRef<any>;
  // 国际化
  public InspectionLanguage: InspectionLanguageInterface;
  //  设施类型下拉框
  public selectOption: DeviceTypeModel[];
  // 全选
  public isAllChecked: boolean = false;
  // 弹窗显隐
  public isVisible: boolean = false;
  // 树选择器配置
  public treeSelectorConfig: TreeSelectorConfigModel;
  // 选中单位名称
  public selectUnitName: string;
  // 跳转过来的设施ID
  public deviceId: string;
  // 告警数据
  public alarmData;
  // 关联故障数据
  public faultData;
  // 告警语言
  public alarmLanguage;
  // 控制区域显示隐藏
  public areaSelectVisible: boolean = false;
  // 区域选择器配置
  public areaSelectorConfig: TreeSelectorConfigModel;
  // 设施选择器配置
  public deviceObjectConfig: AlarmSelectorConfigModel;
  // 勾选的设施对象
  public checkDeviceObject: FilterValueModel = new FilterValueModel();
  // 判断数据是否存在
  public isPresence: boolean;
  // 弹窗显示
  public tempSelectVisible: boolean = false;
  // 模型传参数
  public modalParams: RoleUnitModel[];
  // 是否可以重新生成
  public isRebuild: boolean;
  // 过滤条件
  public filterObj: FilterValueModel = new FilterValueModel();
  // 列表数据
  public _dataSet: DismantleBarrierWorkOrderModel[] = [];
  // 列表配置
  public tableConfig: TableConfigModel;
  // 分页
  public pageBean: PageModel = new PageModel();
  // 查询参数模型
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // 导出
  private exportParams: ExportRequestModel = new ExportRequestModel();
  // 告警或故障
  public alarmTitle: string;
  // 设备选择器显示
  public equipmentVisible: boolean = false;
  // 勾选的设备
  public checkEquipmentObject: SelectOrderEquipmentModel = new SelectOrderEquipmentModel();
  // 设备勾选容器
  public selectEquipments: EquipmentListModel[] = [];
  // 建议列表
  public suggestList: SuggestModel[] = [];
  // 运维建议
  public xcVisible: boolean = false;
  // 指派工单显隐
  public assignVisible: boolean = false;
  // 指派单位树
  public assignTreeSelectorConfig: TreeSelectorConfigModel;
  // 显示转派弹窗
  public showTransModal: boolean = false;
  // 列表数据
  public transModalData: TransferOrderParamModel;
  // 显示关联告警
  public isShowRefAlarm: boolean = false;
  // 显示关联故障
  public isShowRefFault: boolean = false;
  // 指派工单对应id
  private selectedWorkOrderId: string;
  // 工单类型（告警/故障）
  private orderPageType: string;
  // 退单确认modal
  private singleBackConfirmModal;
  /** 过滤参数 */
  private filterValue: FilterValueModel;
  // 区域过滤
  private areaFilterValue: FilterValueModel;
  // 区域节点数据
  private areaNodes: AreaFormModel[] = [];
  // 设备选择器显示
  private equipmentFilterValue: FilterCondition;
  // 树数据
  private assignTreeNode: NzTreeNode[] = [];
  // 树数据
  private unitTreeNodes: DepartmentUnitModel[] = [];
  // 是否重置
  private isReset: boolean = false;
  // 推送服务
  private webSocketInstance;

  // 选中单位id
  private selectedAccountabilityUnitIdList = [];
  /** 设施设备类型 */
  dismantleTypeEnum = DismantleTypeEnum;

  // 勾选用户
  public checkUserObject: FilterValueModel = new FilterValueModel();
  public refCheckUserObject: FilterValueModel = new FilterValueModel();
  // 存放用户数据
  public selectUserList: UserRoleModel[] = [];
  public selectRefUserList: UserRoleModel[] = [];

  // 显示用户选择
  public isShowUserTemp: boolean = false;
  public isShowRefUserTemp: boolean = false;
  // 用户显示
  private userFilterValue: FilterCondition;
  private refUserFilterValue: FilterCondition;

  // 设施过滤选择器
  public facilityVisible: boolean = false;
  // 过滤框显示设施名
  public filterDeviceName: string = '';
  /** 已选择设施数据 */
  public selectFacility: FacilityListModel[] = [];

  /** 退单的数据 */
  trunBackData: DismantleBarrierWorkOrderModel;
  languageEnum = LanguageEnum;
  // 销账工单国际化
  public workOrderLanguage: WorkOrderLanguageInterface;
  // 公共语言国际话
  public commonLanguage: CommonLanguageInterface;
  constructor(
    public $nzI18n: NzI18nService,
    private $activatedRoute: ActivatedRoute,
    private $router: Router,
    private $alarmService: AlarmForCommonService,
    private $message: FiLinkModalService,
    private $userService: UserForCommonService,
    private $dismantleBarrierWorkOrderService: DismantleBarrierWorkOrderService,
    private $websocketService: NativeWebsocketImplService,
    private $workOrderCommonUtil: WorkOrderCommonServiceUtil,
    private $clearBarrierWorkOrderService: ClearBarrierWorkOrderService,
    private $facilityForCommonService: FacilityForCommonService,

    private $modal: NzModalService,
  ) {}

  public ngOnInit(): void {
    this.alarmLanguage = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.InspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.workOrderLanguage = this.$nzI18n.getLocaleData(LanguageEnum.workOrder);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // 初始化单位
    WorkOrderInitTreeUtil.initTreeSelectorConfig(this);
    // 初始化区域
    WorkOrderInitTreeUtil.initAreaSelectorConfig(this);
    this.setSelectOption();
    UnfinishedTable.initUnfinishedTable(this);
    this.refreshData();
    this.initDeviceObjectConfig();
    // 初始化指派单位
    WorkOrderInitTreeUtil.initAssignTreeConfig(this);
    // 设备名称(告警对象)
    this.initAlarmEquipment();
  }
  public ngOnDestroy(): void {
    this.tableComponent = null;
    if (this.webSocketInstance) {
      this.webSocketInstance.unsubscribe();
    }
  }
  /**
   * 推送监听，实现实时刷新
   */
  public facilityChangeHook(): void {
    const that = this;
    this.webSocketInstance = this.$websocketService.subscibeMessage.subscribe((res) => {
      if (res && res.data && JSON.parse(res.data)) {
        const data: WebsocketMessageModel = JSON.parse(res.data);
        if (data.channelKey === ChannelCode.workflowBusiness) {
          // 销障工单监听
          if (
            typeof data.msg === 'string' &&
            JSON.parse(data.msg).procType === ClearBarrierOrInspectEnum.remove
          ) {
            const isHave = this._dataSet.filter(
              (_item) => _item.procId === JSON.parse(data.msg).procId,
            );
            if (data && isHave.length > 0) {
              that.tableComponent.handleSearch();
            }
          }
        }
      }
    });
  }

  /**
   * 刷新图表
   */
  private refreshChart(): void {
    this.workOrderEvent.emit(true);
  }

  /**
   * 获取未完工工单列表
   */
  public refreshData(): void {
    this.tableConfig.isLoading = true;
    this.queryCondition.filterConditions.forEach((v) => {
      if (
        v.filterField === 'equipmentId' ||
        v.filterField === 'deviceId' ||
        v.filterField === 'deviceAreaId' ||
        v.filterField === 'accountabilityDept' ||
        v.filterField === 'equipmentType'
      ) {
        v.operator = OperatorEnum.in;
      }
    });
    this.getPageParam();
    this.queryCondition.bizCondition = {};
    this.$dismantleBarrierWorkOrderService
      .queryDismantleBarrierList_API(this.queryCondition)
      .subscribe(
        (result: ResultModel<DismantleBarrierWorkOrderModel[]>) => {
          this.tableConfig.isLoading = false;
          if (result.code === ResultCodeEnum.success) {
            this.pageBean.Total = result.totalCount;
            const data = result.data || [];
            data.forEach((item) => {
              item.statusName = WorkOrderStatusUtil.getWorkOrderStatus(this.$nzI18n, item.status);
              item.statusClass = WorkOrderStatusUtil.getWorkOrderIconClassName(item.status);
              // 剩余天数大于三天
              if (item.lastDays && item.lastDays > 3) {
                // 超过期望完工时间
              } else if (item.lastDays <= 0) {
                item.rowStyle = { color: LastDayColorEnum.overdueTime };
                // 剩余天数小于3天
              } else if (item.lastDays && item.lastDays <= 3 && item.lastDays > 0) {
                item.rowStyle = { color: LastDayColorEnum.estimatedTime };
              } else {
                item.lastDaysClass = '';
              }
              // 设施类型名称及图标class
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
              item.equipmentTypeList = [];
              item.equipmentTypeName = '';
              if (item.dataResourceType) {
                item.dataResourceType = this.workOrderLanguage[
                  WorkOrderBusinessCommonUtil.getEnumKey(item.dataResourceType, SourceTypeEnum)
                ];
              }
              // 设备类型名称及图标class
              if (item.equipmentType) {
                const equip = WorkOrderClearInspectUtil.handleMultiEquipment(
                  item.equipmentType,
                  this.$nzI18n,
                );
                item.equipmentTypeList = equip.equipList;
                item.equipmentTypeName = equip.names.join(',');
              }
              this.setIconStatus(item);
            });
            this._dataSet = data;
            this.facilityChangeHook();
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
   * 页面跳转参数
   */
  private getPageParam(): void {
    const procId = this.$activatedRoute.snapshot.queryParams.id;
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
      // 首页跳转工单 设施id及name
      const deviceId = this.$activatedRoute.snapshot.queryParams.deviceId;
      if (deviceId) {
        const obj = this.queryCondition.filterConditions.find((item) => {
          return item.filterField === 'deviceId';
        });
        if (obj) {
          if (obj.filterValue.indexOf(deviceId) === -1) {
            obj.filterValue.push(deviceId);
          }
        } else {
          this.queryCondition.filterConditions.push({
            filterField: 'deviceId',
            filterValue: [deviceId],
            operator: OperatorEnum.in,
          });
        }
      }
      // 首页跳转工单 设备id及name
      const equipmentId = this.$activatedRoute.snapshot.queryParams.equipmentId;
      if (equipmentId) {
        const obj = this.queryCondition.filterConditions.find((item) => {
          return item.filterField === 'equipmentId';
        });
        if (obj) {
          if (obj.filterValue.indexOf(equipmentId) === -1) {
            obj.filterValue.push(equipmentId);
          }
        } else {
          this.queryCondition.filterConditions.push({
            filterField: 'equipmentId',
            filterValue: [equipmentId],
            operator: OperatorEnum.in,
          });
        }
      }
    }
  }
  /**
   * 设置表格操作图标样式
   * param item
   */
  private setIconStatus(item: DismantleBarrierWorkOrderModel): void {
    // 只有待指派能删
    item.isShowDeleteIcon = item.status === WorkOrderStatusEnum.assigned;
    // 已退单不可编辑
    item.isShowEditIcon = item.status !== WorkOrderStatusEnum.singleBack;
    // 待处理可以撤回;
    item.isShowRevertIcon = item.status === WorkOrderStatusEnum.pending;
    // 待指派可以指派
    item.isShowAssignIcon = item.status === WorkOrderStatusEnum.assigned;
    // 工单状态为已退单且未确认   isCheckSingleBack = 0 未确认  1已确认
    item.isShowTurnBackConfirmIcon =
      item.status === WorkOrderStatusEnum.singleBack && item.isCheckSingleBack !== 1;
    // 处理中的可以转派
    item.isShowTransfer = item.status === WorkOrderStatusEnum.processing;
    // 详情
    item.isShowWriteOffOrderDetail = true;
  }

  /**
   * 跳转
   * param url
   */
  private navigateToDetail(url: string, extras = {}): void {
    this.$router.navigate([url], extras).then();
  }

  /**
   * 设置设施类型下拉款选项
   */
  private setSelectOption(): void {
    this.selectOption = WorkOrderStatusUtil.getWorkOrderStatusList(this.$nzI18n).filter((item) => {
      // 未确认的已退单的工单也会出现在未完工列表
      return item.value !== WorkOrderStatusEnum.completed;
    });
  }

  /**
   * 工单类型过滤
   * param status
   */
  public filterByStatus(status: string): void {
    this.isReset = true;
    if (status && status !== 'all') {
      this.tableComponent.tableService.resetFilterConditions(this.tableComponent.queryTerm);
      this.tableComponent.handleSetControlData('status', [status]);
      this.tableComponent.handleSearch();
    } else if (status === 'all') {
      this.queryCondition.bizCondition = {};
      this.queryCondition.filterConditions = [];
      this.tableComponent.handleSetControlData('status', null);
    }
    this.refreshData();
  }

  /**
   * 关闭退单确认modal
   */
  public closeSingleBackConfirmModal(): void {
    this.singleBackConfirmModal.destroy();
  }

  /**
   * 退单确认
   * param ids
   */
  public singleBackConfirm(): void {
    let equipmentIdList = [];
    // 拆除设备
    if (this.trunBackData.removeType === DismantleTypeEnum.equipment) {
      equipmentIdList = [this.trunBackData.equipmentId];
    } else if (this.trunBackData.removeType === DismantleTypeEnum.device) {
      equipmentIdList = this.trunBackData.equipmentInfoList.map((item) => item.equipmentId);
    }
    const targetParams = {
      equipmentIdList,
      type: InsertOrDeleteEnum.delete,
    };


    this.$dismantleBarrierWorkOrderService
      .checkDismantleSingleBack_API(this.selectedWorkOrderId)
      .subscribe((result: Result) => {
        if (result.code === ResultCodeEnum.success) {
          this.closeSingleBackConfirmModal();
          this.refreshData();
          this.refreshChart();
        } else {
          this.$message.error(result.msg);
        }
      });

      this.$dismantleBarrierWorkOrderService
      .setSelectedEquipment_API(targetParams)
      .subscribe((result: Result) => {
        console.log(result, 'result');
      });
  }

  /**
   * 重新编辑
   */
  public rebuild(): void {
    this.closeSingleBackConfirmModal();
    this.navigateToDetail('business/work-order/dismantle-barrier/unfinished-detail/rebuild', {
      queryParams: {
        id: this.selectedWorkOrderId,
        status: WorkOrderPageTypeEnum.rebuild,
        type: this.orderPageType,
      },
    });
  }

  /**
   * 导出
   */
  public handleExport(event): void {
    if (event && !_.isEmpty(event.selectItem)) {
        const ids = event.selectItem.map(item => item.procId);
        const filter = new FilterCondition('_id', OperatorEnum.in, ids);
        this.exportParams.queryCondition.filterConditions.push(filter);
    } else {
        // 处理查询条件
        this.exportParams.queryCondition.filterConditions = event.queryTerm;
    }
    // this.exportParams.queryCondition = this.queryCondition;
    this.exportParams.excelType = event.excelType;
    this.$dismantleBarrierWorkOrderService
      .exportDismantleWorkOrder_API(this.exportParams)
      .subscribe((result: Result) => {
        if (result.code === ResultCodeEnum.success) {
          this.$message.success(this.InspectionLanguage.operateMsg.exportSuccess);
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * 打开关联告警modal
   */
  public showRefAlarmModal(data: DismantleBarrierWorkOrderModel): void {
    // 关联故障
    if (data.refType === DismantleWarnTroubleEnum.trouble) {
      this.faultData = data.refId;
      this.isShowRefFault = true;
      return;
    }
    // 当前告警
    this.$alarmService
      .queryCurrentAlarmInfoById(data.refId)
      .subscribe((result: ResultModel<AlarmListModel>) => {
        if (result.code === 0 && result.data) {
          this.alarmData = result.data;
          // 告警持续时间
          this.alarmData.alarmContinousTime = CommonUtil.setAlarmContinousTime(
            this.alarmData.alarmBeginTime,
            this.alarmData.alarmCleanTime,
            {
              month: this.alarmLanguage.month,
              day: this.alarmLanguage.day,
              hour: this.alarmLanguage.hour,
            },
          );
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
                this.$message.error(this.InspectionLanguage.noData);
              }
            });
        }
      });
  }
  /**
   * 告警弹窗
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
   * 打开责任单位选择器
   */
  public showModal(filterValue: FilterValueModel): void {
    if (this.treeSelectorConfig.treeNodes.length === 0) {
      this.queryDeptList().then((bool) => {
        if (bool) {
          this.filterValue = filterValue;
          if (!this.filterValue.filterValue) {
            this.filterValue.filterValue = null;
          }
          this.treeSelectorConfig.treeNodes = this.unitTreeNodes;
          WorkOrderInitTreeUtil.initTreeSelectorConfig(this);
          this.isVisible = true;
        }
      });
    } else {
      this.isVisible = true;
    }
  }

  /**
   * 选择指派单位
   */
  public selectAssignDataChange(event: DepartmentUnitModel[]): void {
    FacilityForCommonUtil.setTreeNodesStatus(this.assignTreeNode, []);
    if (event && event.length > 0) {
      const param = new ClearBarrierDepartmentModel();
      param.procId = this.selectedWorkOrderId;
      param.accountabilityDept = event[0].deptCode;
      param.accountabilityDeptName = event[0].deptName;
      param.accountabilityDeptId = event[0].id;
      this.$dismantleBarrierWorkOrderService
        .assignDismantleBarrier_API(param)
        .subscribe((result: Result) => {
          if (result.code === ResultCodeEnum.success) {
            this.$message.success(this.InspectionLanguage.operateMsg.assignSuccess);
            this.refreshData();
          } else {
            this.$message.error(result.msg);
            this.refreshData();
          }
          this.refreshChart();
        });
    } else {
      this.$message.error(this.InspectionLanguage.pleaseSelectUnit);
    }
  }

  /**
   * 责任单位选择结果
   * param event
   */
  public selectDataChange(event: DepartmentUnitModel[]): void {
    this.selectUnitName = '';
    if (event.length > 0) {
      this.selectUnitName = event[0].deptName;
      this.filterValue.filterValue = [event[0].deptCode];
      FacilityForCommonUtil.setTreeNodesStatus(this.unitTreeNodes, [event[0].id]);
    }
  }

  /**
   * 查询所单位
   */
  private queryDeptList(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.$userService.queryAllDepartment().subscribe(
        (result: Result) => {
          this.unitTreeNodes = [];
          this.unitTreeNodes = result.data || [];
          resolve(true);
        },
        (error) => {
          reject(error);
        },
      );
    });
  }

  /**
   * 设施区域弹框
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
   * 设施选择器
   */
  private initDeviceObjectConfig(): void {
    this.deviceObjectConfig = {
      clear: !this.filterObj.deviceIds.length,
      handledCheckedFun: (event) => {
        this.checkDeviceObject = event;
        this.filterObj.deviceIds = event.ids;
        this.filterObj.deviceName = event.name;
      },
    };
  }
  /**
   * 设备名称（告警对象）
   */
  private initAlarmEquipment(): void {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.tableConfig) {
      this.slideShowChange(this.slideShowChangeData);
    }
  }

  /**
   * 滑块变化
   * param event
   */
  private slideShowChange(event): void {
    if (event) {
      this.tableConfig.outHeight = 108;
    } else {
      this.tableConfig.outHeight = 8;
    }
    this.tableComponent.calcTableHeight();
  }

  /**
   * 关闭弹窗
   */
  public handleCancel(): void {
    this.xcVisible = false;
  }

  /**
   * 打开转派
   */
  public showTransForm(param): void {
    const data = new TransferOrderParamModel();
    data.type = ClearBarrierOrInspectEnum.remove;
    data.procId = param.procId;
    data.accountabilityDept = param.accountabilityDept;
    this.transModalData = data;
    this.showTransModal = true;
  }
  /**
   * 转派提交
   */
  public transferOrders(event): void {
    if (event) {
      this.$dismantleBarrierWorkOrderService
        .transferRemoveOrder(event)
        .subscribe((result: Result) => {
          if (result.code === ResultCodeEnum.success) {
            this.$message.success(this.InspectionLanguage.operateMsg.turnProgress);
            this.showTransModal = false;
            this.refreshData();
            this.refreshChart();
          } else {
            this.$message.error(result.msg);
          }
        });
    } else {
      this.showTransModal = false;
    }
  }
  /**
   * 设备名称过滤
   */
  public onSelectEquipment(event: EquipmentListModel[]): void {
    this.selectEquipments = event;
    this.checkEquipmentObject = {
      ids: event.map((v) => v.equipmentId) || [],
      name: event.map((v) => v.equipmentName).join(',') || '',
      type: '',
    };
    this.equipmentFilterValue.filterValue =
      this.checkEquipmentObject.ids.length === 0 ? null : this.checkEquipmentObject.ids;
  }

  /**
   * 设备名称弹框
   */
  public openEquipmentSelector(filterValue): void {
    this.equipmentVisible = true;
    this.equipmentFilterValue = filterValue;
  }

  /**
   * 完工记录分页
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 删除工单
   * param ids
   * 列表配置调用，灰显勿删！！
   */
  deleteWorkOrder(ids: string[], data: DismantleBarrierWorkOrderModel): void {
    const params = {
      procIdList: ids,
      procType: ClearBarrierOrInspectEnum.remove,
    };

    let equipmentIdList = [];
    // 说明是数组, 全选删除
    if (Array.isArray(data)) {
      data.forEach((dataItem) => {
        if (dataItem.removeType === DismantleTypeEnum.equipment) {
          equipmentIdList.push(dataItem.equipmentId);
        } else if (dataItem.removeType === DismantleTypeEnum.device) {
          const getIds = dataItem.equipmentInfoList
            ? dataItem.equipmentInfoList.map((item) => item.equipmentId)
            : [];
          equipmentIdList.push(...getIds);
        }
      });
    } else {
      if (data.removeType === DismantleTypeEnum.equipment) {
        equipmentIdList = [data.equipmentId];
      } else if (data.removeType === DismantleTypeEnum.device) {
        equipmentIdList = data.equipmentInfoList
          ? data.equipmentInfoList.map((item) => item.equipmentId)
          : [];
      }
    }
    const targetParams = {
      equipmentIdList,
      type: InsertOrDeleteEnum.delete,
    };
    
    this.$dismantleBarrierWorkOrderService
      .deleteDismantleWorkOrder_API(params)
      .subscribe((result: Result) => {
        if (result.code === ResultCodeEnum.success) {
          this.$message.success(this.InspectionLanguage.operateMsg.deleteSuccess);
          this.queryCondition.pageCondition.pageNum = 1;
          this.$dismantleBarrierWorkOrderService.setSelectedEquipment_API(targetParams)
            .subscribe((result: Result) => {
                console.log(result, 'result');
            });
          this.refreshData();
          this.refreshChart();
          
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /** 删除设备标记 */
  delteEquipmentTarget(data) {
    console.log(data, 'data');
  }

  /**
   * 撤回工单
   * param ids
   * 列表配置调用，灰显勿删！！
   */
  private revokeWorkOrder(id: string): void {
    this.$dismantleBarrierWorkOrderService
      .revokeDismatleBarrier_API(id)
      .subscribe((result: Result) => {
        if (result.code === ResultCodeEnum.success) {
          this.isAllChecked = false;
          this.selectedAccountabilityUnitIdList = [];
          this.$message.success(this.InspectionLanguage.operateMsg.turnBack);
          this.refreshData();
          this.refreshChart();
        } else {
          this.$message.error(result.msg);
          this.refreshData();
          this.refreshChart();
        }
      });
  }

  /**
   * 打开退单确认modal
   * 列表配置调用，灰显勿删！！
   */
  private openSingleBackConfirmModal(): void {
    this.singleBackConfirmModal = this.$modal.create({
      nzTitle: this.workOrderLanguage.singleBackConfirm,
      nzContent: this.singleBackTemp,
      nzOkType: 'danger',
      nzClassName: 'custom-create-modal',
      nzMaskClosable: false,
      nzFooter: this.footerTemp,
    });
  }
  /**
   * 打开指派树
   */
  private showAssignModal(): void {
    this.assignTreeSelectorConfig.treeNodes = this.assignTreeNode;
    this.assignVisible = true;
  }
  /**
   * 获取指派单位数据
   * 列表配置调用，灰显勿删！！
   */
  private getAssignDataList(areaCode: string): void {
    const param = new AreaDeviceParamModel();
    param.userId = WorkOrderBusinessCommonUtil.getUserId();
    param.areaCodes = [areaCode];
    this.$facilityForCommonService
      .listDepartmentByAreaAndUserId(param)
      .subscribe((result: ResultModel<NzTreeNode[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.assignTreeNode = [];
          this.assignTreeNode = result.data;
          WorkOrderInitTreeUtil.initAssignTreeConfig(this);
          this.showAssignModal();
        } else {
          this.showAssignModal();
        }
      });
  }

  /**
   * 用户名称选择
   */
  public openUserSelector(filterValue: FilterCondition, flag?: boolean): void {
    if (flag) {
      this.isShowRefUserTemp = true;
      this.refUserFilterValue = filterValue;
    } else {
      this.isShowUserTemp = true;
      this.userFilterValue = filterValue;
    }
  }

  /**
   * 用户名称
   */
  public onSelectUser(event: UserRoleModel[], flag?: boolean): void {
    if (flag) {
      this.selectRefUserList = event;
      this.refCheckUserObject = {
        userIds: event.map((v) => v.id) || [],
        userName: event.map((v) => v.userName).join(',') || '',
      };
      this.refUserFilterValue.filterValue =
        this.refCheckUserObject.userIds.length > 0 ? this.refCheckUserObject.userIds : null;
      this.refUserFilterValue.filterName = this.refCheckUserObject.userName;
    } else {
      this.selectUserList = event;
      WorkOrderClearInspectUtil.selectUser(event, this);
    }
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
