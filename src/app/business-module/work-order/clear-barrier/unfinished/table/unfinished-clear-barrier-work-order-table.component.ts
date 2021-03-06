import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {WorkOrderInitTreeUtil} from '../../../share/util/work-order-init-tree.util';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {FilterCondition, QueryConditionModel} from '../../../../../shared-module/model/query-condition.model';
import {TableComponent} from '../../../../../shared-module/component/table/table.component';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {NzI18nService, NzModalService, NzTreeNode} from 'ng-zorro-antd';
import {AlarmForCommonService} from '../../../../../core-module/api-service/alarm';
import {ActivatedRoute, Router} from '@angular/router';
import {ClearBarrierWorkOrderService} from '../../../share/service/clear-barrier';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {TreeSelectorConfigModel} from '../../../../../shared-module/model/tree-selector-config.model';
import {InspectionWorkOrderService} from '../../../share/service/inspection';
import {AlarmSelectorConfigModel} from '../../../../../shared-module/model/alarm-selector-config.model';
import {IndexMissionService} from '../../../../../core-module/mission/index.mission.service';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ClearBarrierWorkOrderModel} from '../../../../../core-module/model/work-order/clear-barrier-work-order.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {FilterValueModel} from '../../../../../core-module/model/work-order/filter-value.model';
import {DeviceTypeModel} from '../../../share/model/device-type.model';
import {InspectionLanguageInterface} from '../../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ClearBarrierOrInspectEnum, LastDayColorEnum, SourceTypeEnum} from '../../../share/enum/clear-barrier-work-order.enum';
import {RoleUnitModel} from '../../../../../core-module/model/work-order/role-unit.model';
import {DepartmentUnitModel} from '../../../../../core-module/model/work-order/department-unit.model';
import {SuggestModel} from '../../../share/model/suggest.model';
import {AreaFormModel} from '../../../share/model/area-form.model';
import {ClearBarrierDeleteWorkOrderModel} from '../../../share/model/clear-barrier-model/clear-barrier-delete-work-order.model';
import {ClearBarrierDepartmentModel} from '../../../share/model/clear-barrier-model/clear-barrier-department.model';
import {AreaDeviceParamModel} from '../../../../../core-module/model/work-order/area-device-param.model';
import {WorkOrderBusinessCommonUtil} from '../../../share/util/work-order-business-common.util';
import {TransferOrderParamModel} from '../../../share/model/clear-barrier-model/transfer-order-param.model';
import {OrderUserModel} from '../../../../../core-module/model/work-order/order-user.model';
import {EquipmentListModel} from '../../../../../core-module/model/equipment/equipment-list.model';
import {WorkOrderPageTypeEnum} from '../../../share/enum/work-order-page-type.enum';
import {SelectOrderEquipmentModel} from '../../../share/model/select-order-equipment.model';
import {WorkOrderCommonServiceUtil} from '../../../share/util/work-order-common-service.util';
import {FacilityForCommonUtil} from '../../../../../core-module/business-util/facility/facility-for-common.util';
import {FacilityForCommonService} from '../../../../../core-module/api-service/facility';
import {WorkOrderStatusUtil} from '../../../../../core-module/business-util/work-order/work-order-for-common.util';
import {WorkOrderLanguageInterface} from '../../../../../../assets/i18n/work-order/work-order.language.interface';
import {UserForCommonService} from '../../../../../core-module/api-service/user';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {WorkOrderStatusEnum} from '../../../../../core-module/enum/work-order/work-order-status.enum';
import {ExportRequestModel} from '../../../../../shared-module/model/export-request.model';
import {AlarmListModel} from '../../../../../core-module/model/alarm/alarm-list.model';
import {UnfinishedClearBarrierWorkOrderTableUtil} from './unfinished-clear-barrier-work-order-table.util';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {WorkOrderClearInspectUtil} from '../../../share/util/work-order-clear-inspect.util';
import {ListExportModel} from '../../../../../core-module/model/list-export.model';
import {NativeWebsocketImplService} from '../../../../../core-module/websocket/native-websocket-impl.service';
import {ChannelCode} from '../../../../../core-module/enum/channel-code';
import {WebsocketMessageModel} from '../../../../../core-module/model/websocket-message.model';
import {UserRoleModel} from '../../../../../core-module/model/user/user-role.model';
import {AlarmForCommonUtil} from '../../../../../core-module/business-util/alarm/alarm-for-common.util';

/**
 * ???????????????????????????
 */
@Component({
  selector: 'app-unfinished-clear-barrier-work-order-table',
  templateUrl: './unfinished-clear-barrier-work-order-table.component.html',
  styleUrls: ['./unfinished-clear-barrier-work-order-table.component.scss']
})
export class UnfinishedClearBarrierWorkOrderTableComponent implements OnInit, OnChanges, OnDestroy {
  // ??????????????????
  @Input() slideShowChangeData: boolean;
  // ??????
  @Output() workOrderEvent = new EventEmitter();
  // ??????????????????
  @ViewChild('statusTemp') public statusTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('deviceTemp') public deviceTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('equipTemps') public equipTemps: TemplateRef<any>;
  // ????????????
  @ViewChild('footerTemp') public footerTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('UnitNameSearch') public UnitNameSearch: TemplateRef<any>;
  // ????????????
  @ViewChild('AreaSearch') public areaSearch: TemplateRef<any>;
  // ????????????
  @ViewChild('refAlarmTemp') public refAlarmTemp: TemplateRef<any>;
  // ??????
  @ViewChild('singleBackTemp') public singleBackTemp: TemplateRef<any>;
  // ??????????????????
  @ViewChild('DeviceNameSearch') public deviceNameSearch: TemplateRef<any>;
  // ????????????
  @ViewChild('equipmentSearch') public equipmentSearch: TemplateRef<any>;
  // ????????????
  @ViewChild('userSearchTemp') public userSearchTemp: TemplateRef<any>;
  // ??????
  @ViewChild('tableComponent') public tableComponent: TableComponent;
  // ?????????
  public InspectionLanguage: InspectionLanguageInterface;
  // ?????????????????????
  public  workOrderLanguage: WorkOrderLanguageInterface;
  // ?????????????????????
  public commonLanguage: CommonLanguageInterface;
  //  ?????????????????????
  public selectOption: DeviceTypeModel[];
  // ??????
  public isAllChecked: boolean = false;
  // ????????????
  public isVisible: boolean = false;
  // ??????????????????
  public treeSelectorConfig: TreeSelectorConfigModel;
  // ??????????????????
  public selectUnitName: string;
  // ?????????????????????ID
  public deviceId: string;
  // ????????????
  public alarmData: AlarmListModel;
  // ??????????????????
  public faultData: string;
  // ????????????
  public alarmLanguage: AlarmLanguageInterface;
  // ????????????????????????
  public areaSelectVisible: boolean = false;
  // ?????????????????????
  public areaSelectorConfig: TreeSelectorConfigModel;
  // ?????????????????????
  public deviceObjectConfig: AlarmSelectorConfigModel;
  // ??????
  public userObjectConfig: AlarmSelectorConfigModel;
  // ????????????????????????
  public isRebuild: boolean;
  // ????????????
  public filterObj: FilterValueModel = new FilterValueModel();
  // ???????????????
  public alarmTitle: string;
  // ?????????????????????
  public equipmentVisible: boolean = false;
  // ???????????????
  public checkEquipmentObject: SelectOrderEquipmentModel = new SelectOrderEquipmentModel();
  // ????????????
  public checkUserObject: FilterValueModel = new FilterValueModel();
  // ??????????????????
  public selectUserList: UserRoleModel[] = [];
  // ??????????????????
  public selectEquipments: EquipmentListModel[] = [];
  // ????????????
  public suggestList: SuggestModel[] = [];
  // ????????????
  public xcVisible: boolean = false;
  // ??????????????????
  public assignVisible: boolean = false;
  // ???????????????
  public assignTreeSelectorConfig: TreeSelectorConfigModel;
  // ??????????????????
  public showTransModal: boolean = false;
  // ????????????
  public transModalData: TransferOrderParamModel;
  // ??????????????????
  public isShowRefAlarm: boolean = false;
  // ??????????????????
  public isShowRefFault: boolean = false;
  // ??????????????????
  public isShowUserTemp: boolean = false;
  // ????????????
  public tableConfig: TableConfigModel;
  // ????????????
  public _dataSet: ClearBarrierWorkOrderModel[] = [];
  // ??????
  public pageBean: PageModel = new PageModel();
  // ????????????
  public areaFilterValue: FilterCondition = {
    filterField: '',
    operator: '',
    filterValue: '',
    filterName: ''
  };
  // ????????????
  public departFilterValue: FilterCondition = {
    filterField: '',
    operator: '',
    filterValue: '',
    filterName: ''
  };
  // ??????????????????
  private dayTimes: number;
  // ????????????id (????????????)
  private selectedAlarmId: string;
  // ??????????????????id
  private selectedWorkOrderId: string;
  // ?????????????????????
  private checkDeviceObject: FilterValueModel = new FilterValueModel();
  // ?????????????????????/?????????
  private orderPageType: string;
  // ????????????
  private roleArr: RoleUnitModel[] = [];
  // ????????????id
  private selectedAccountabilityUnitIdList = [];
  // ????????????modal
  private singleBackConfirmModal;
  // ????????????
  private filterValue: FilterValueModel;
  // ??????????????????
  private areaNodes: AreaFormModel[] = [];
  private areaNodeList: AreaFormModel[] = [];
  // ?????????????????????
  private equipmentFilterValue: FilterCondition;
  // ????????????
  private userFilterValue: FilterCondition;
  // ?????????
  private assignTreeNode: NzTreeNode[] = [];
  // ??????????????????
  private alarmEquipmentConfig: AlarmSelectorConfigModel;
  // ????????????(????????????)
  private checkAlarmEquipment: SelectOrderEquipmentModel = new SelectOrderEquipmentModel();
  // ?????????
  private unitTreeNodes: DepartmentUnitModel[] = [];
  // ????????????
  private isReset: boolean = false;
  // ??????????????????
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // ??????
  private exportParams: ExportRequestModel = new ExportRequestModel();
  // ????????????
  private webSocketInstance;
  constructor(
    private $nzI18n: NzI18nService,
    private $activatedRoute: ActivatedRoute,
    private $indexMissionService: IndexMissionService,
    private $router: Router,
    private $modal: NzModalService,
    private $alarmForCommonService: AlarmForCommonService,
    private $message: FiLinkModalService,
    private $userForCommonService: UserForCommonService,
    private $inspectionWorkOrderService: InspectionWorkOrderService,
    private $workOrderCommonUtil: WorkOrderCommonServiceUtil,
    private $clearBarrierWorkOrderService: ClearBarrierWorkOrderService,
    private $facilityForCommonService: FacilityForCommonService,
    private $websocketService: NativeWebsocketImplService
  ) {}

  /**
   * ?????????
   */
  public ngOnInit(): void {
    this.dayTimes = 86400000;
    this.alarmLanguage = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.InspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.workOrderLanguage = this.$nzI18n.getLocaleData(LanguageEnum.workOrder);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // ???????????????
    WorkOrderInitTreeUtil.initTreeSelectorConfig(this);
    // ???????????????
    WorkOrderInitTreeUtil.initAreaSelectorConfig(this);
    this.setSelectOption();
    // ???????????????
    UnfinishedClearBarrierWorkOrderTableUtil.initUnfinishedTable(this);
    this.refreshData();
    this.initDeviceObjectConfig();
    // ?????????????????????
    WorkOrderInitTreeUtil.initAssignTreeConfig(this);
    // ????????????(????????????)
    this.initAlarmEquipment();
  }

  /**
   * ??????
   */
  public ngOnDestroy(): void {
    this.tableComponent = null;
    if (this.webSocketInstance) {
      this.webSocketInstance.unsubscribe();
    }
  }

  /**
   * ?????????????????????????????????
   */
  public facilityChangeHook(): void {
    const that = this;
    this.webSocketInstance = this.$websocketService.subscibeMessage.subscribe(res => {
      if (res && res.data && JSON.parse(res.data)) {
        const data: WebsocketMessageModel = JSON.parse(res.data);
        if (data.channelKey === ChannelCode.workflowBusiness) {
          // ??????????????????
          if (typeof data.msg === 'string' && JSON.parse(data.msg).procType === ClearBarrierOrInspectEnum.clearBarrier) {
            const isHave = this._dataSet.filter(_item => _item.procId === JSON.parse(data.msg).procId);
            if (data && isHave.length > 0) {
              that.tableComponent.handleSearch();
            }
          }
        }
      }
    });
  }

  /**
   * ????????????
   */
  private refreshChart(): void {
    this.workOrderEvent.emit(true);
  }

  /**
   * ???????????????????????????
   */
  public refreshData(): void {
    this.tableConfig.isLoading = true;
    this.queryCondition.filterConditions.forEach(v => {
      const arr = ['assign', 'equipment.equipmentId', 'deviceId', 'deviceAreaId', 'accountabilityDept'];
      if (arr.includes(v.filterField)) {
        v.operator = OperatorEnum.in;
      }
      if (v.filterField === 'equipment.equipmentType') {
        v.operator = OperatorEnum.in;
      }
    });
    this.getPageParam();
    this.queryCondition.bizCondition = {};
    this.$clearBarrierWorkOrderService.getUnfinishedWorkOrderList(this.queryCondition).subscribe((result: ResultModel<ClearBarrierWorkOrderModel[]>) => {
      this.tableConfig.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        const data = result.data || [];
        this.tableConfig.showEsPagination = data.length > 0;
        this.pageBean.Total = result.totalPage * result.size;
        this.pageBean.pageSize = result.size;
        this.pageBean.pageIndex = result.pageNum;
        data.forEach(item => {
          item.statusName = WorkOrderStatusUtil.getWorkOrderStatus(this.$nzI18n, item.status);
          item.statusClass = WorkOrderStatusUtil.getWorkOrderIconClassName(item.status);
          // ????????????????????????
          if (item.lastDays && item.lastDays > 3) {
            // ????????????????????????
          } else if (item.lastDays <= 0) {
            item.rowStyle = {color: LastDayColorEnum.overdueTime};
            // ??????????????????3???
          } else if (item.lastDays && item.lastDays <= 3 && item.lastDays > 0) {
            item.rowStyle = {color: LastDayColorEnum.estimatedTime};
          } else {
            item.lastDaysClass = '';
          }
          // ???????????????????????????class
          if (item.deviceType) {
            item.deviceTypeName = WorkOrderBusinessCommonUtil.deviceTypeNames(this.$nzI18n, item.deviceType);
            if (item.deviceTypeName) {
              item.deviceClass = CommonUtil.getFacilityIconClassName(item.deviceType);
            } else {
              item.deviceClass = '';
            }
          }
          item.equipmentTypeList = [];
          item.equipmentTypeName = '';
          if (item.dataResourceType) {
            item.dataResourceType = this.workOrderLanguage[WorkOrderBusinessCommonUtil.getEnumKey(item.dataResourceType, SourceTypeEnum)];
          }
          // ???????????????????????????class
          if (item.equipmentType) {
            const equip = WorkOrderClearInspectUtil.handleMultiEquipment(item.equipmentType, this.$nzI18n);
            item.equipmentTypeList = equip.equipList;
            item.equipmentTypeName = equip.names.join(',');
          }
          // ?????????????????????
          if (item.refAlarm) {
            const name = AlarmForCommonUtil.translateAlarmNameByCode(this.$nzI18n, item.refAlarmCode);
            if (name) {
              item.dataResourceName = name;
            }
          }
          this.setIconStatus(item);
        });
        this._dataSet = data;
        this.facilityChangeHook();
      } else {
        this.$message.error(result.msg);
      }
    }, err => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * ??????????????????
   */
  private getPageParam(): void {
    const procId = this.$activatedRoute.snapshot.queryParams.id;
    // ????????????
    if (!this.isReset) {
      // ???????????????????????? ??????id
      if (procId) {
        const arr = this.queryCondition.filterConditions.find(item => {
          return item.filterField === '_id';
        });
        if (!arr) {
          this.queryCondition.filterConditions.push({
            filterField: '_id', filterValue: procId, operator: OperatorEnum.eq
          });
        }
      }
      // ?????????????????? ??????id???name
      const deviceId = this.$activatedRoute.snapshot.queryParams.deviceId;
      if (deviceId) {
        const obj = this.queryCondition.filterConditions.find(item => {
          return item.filterField === 'deviceId';
        });
        if (obj) {
          if (obj.filterValue.indexOf(deviceId) === -1) {
            obj.filterValue.push(deviceId);
          }
        } else {
          this.queryCondition.filterConditions.push({
            filterField: 'deviceId', filterValue: [deviceId], operator: OperatorEnum.in
          });
        }
      }
      // ?????????????????? ??????id???name
      const equipmentId = this.$activatedRoute.snapshot.queryParams.equipmentId;
      if (equipmentId) {
        const obj = this.queryCondition.filterConditions.find(item => {
          return item.filterField === 'equipment.equipmentId';
        });
        if (obj) {
          if (obj.filterValue.indexOf(equipmentId) === -1) {
            obj.filterValue.push(equipmentId);
          }
        } else {
          this.queryCondition.filterConditions.push({
            filterField: 'equipment.equipmentId',
            filterValue: [equipmentId], operator: OperatorEnum.in
          });
        }
      }
    }
  }

  /**
   * ??????????????????????????????
   * param item
   */
  private setIconStatus(item: ClearBarrierWorkOrderModel): void {
    // ?????????????????????
    item.isShowDeleteIcon = item.status === WorkOrderStatusEnum.assigned;
    // ?????????????????????
    item.isShowEditIcon = item.status !== WorkOrderStatusEnum.singleBack;
    // ?????????????????????;
    item.isShowRevertIcon = item.status === WorkOrderStatusEnum.pending;
    // ?????????????????????
    item.isShowAssignIcon = item.status === WorkOrderStatusEnum.assigned;
    // ????????????????????????????????????   isCheckSingleBack = 0 ?????????  1?????????
    item.isShowTurnBackConfirmIcon = (item.status === WorkOrderStatusEnum.singleBack && item.isCheckSingleBack !== 1);
    // ????????????????????????
    item.isShowTransfer = item.status === WorkOrderStatusEnum.processing;
    // ??????
    item.isShowWriteOffOrderDetail = true;
  }

  /**
   * ??????
   * param url
   */
  private navigateToDetail(url: string, extras = {}): void {
    this.$router.navigate([url], extras).then();
  }

  /**
   * ?????????????????????????????????
   */
  private setSelectOption(): void {
    this.selectOption = (WorkOrderStatusUtil.getWorkOrderStatusList(this.$nzI18n)).filter(item => {
      // ????????????????????????????????????????????????????????????
      return item.value !== WorkOrderStatusEnum.completed;
    });
  }

  /**
   * ??????????????????
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
   * ????????????
   * param ids
   * ???????????????????????????????????????
   */
  private deleteWorkOrder(ids: string[]): void {
    const data = new ClearBarrierDeleteWorkOrderModel();
    data.procIdList = ids;
    data.procType = ClearBarrierOrInspectEnum.clearBarrier;
    this.$clearBarrierWorkOrderService.deleteWorkOrder(data).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.InspectionLanguage.operateMsg.deleteSuccess);
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshData();
        this.refreshChart();
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * ????????????
   * param ids
   * ???????????????????????????????????????
   */
  private revokeWorkOrder(id: string): void {
    this.$clearBarrierWorkOrderService.revokeWorkOrder(id).subscribe((result: ResultModel<string>) => {
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
   * ??????????????????modal
   * ???????????????????????????????????????
   */
  private openSingleBackConfirmModal(): void {
    this.singleBackConfirmModal = this.$modal.create({
      nzTitle: this.workOrderLanguage.singleBackConfirm,
      nzContent: this.singleBackTemp,
      nzOkType: 'danger',
      nzClassName: 'custom-create-modal',
      nzMaskClosable: false,
      nzFooter: this.footerTemp
    });
  }

  /**
   * ??????????????????modal
   */
  public closeSingleBackConfirmModal(): void {
    this.singleBackConfirmModal.destroy();
  }

  /**
   * ????????????
   * param ids
   */
  public singleBackConfirm(): void {
    this.$clearBarrierWorkOrderService.singleBackConfirm(this.selectedWorkOrderId).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.closeSingleBackConfirmModal();
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshData();
        this.refreshChart();
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * ????????????
   */
  public rebuild(): void {
    this.closeSingleBackConfirmModal();
    this.navigateToDetail('business/work-order/clear-barrier/unfinished-detail/rebuild',
      {queryParams: {id: this.selectedWorkOrderId, status: WorkOrderPageTypeEnum.rebuild, type: this.orderPageType}});
  }

  /**
   * ??????
   */
  public handleExport(event: ListExportModel<ClearBarrierWorkOrderModel[]>): void {
    this.exportParams.excelType = event.excelType;
    this.$clearBarrierWorkOrderService.exportUnfinishedWorkOrder(this.exportParams).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.InspectionLanguage.operateMsg.exportSuccess);
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * ??????????????????modal
   */
  public showRefAlarmModal(data: ClearBarrierWorkOrderModel): void {
    // ????????????
    if (data.troubleId && data.troubleId.length > 0) {
      this.faultData = data.troubleId;
      this.isShowRefFault = true;
      return;
    }
    // ????????????
    this.$alarmForCommonService.queryCurrentAlarmInfoById(data.refAlarm).subscribe((result: ResultModel<AlarmListModel>) => {
      if (result.code === 0 && result.data) {
        this.alarmData = result.data;
        // ??????????????????
        this.alarmData.alarmContinousTime = CommonUtil.setAlarmContinousTime(this.alarmData.alarmBeginTime, this.alarmData.alarmCleanTime,
          {month: this.alarmLanguage.month, day: this.alarmLanguage.day, hour: this.alarmLanguage.hour});
        this.isShowRefAlarm = true;
      } else {
        // ????????????
        this.$alarmForCommonService.queryAlarmHistoryInfo(data.refAlarm).subscribe((res: ResultModel<AlarmListModel>) => {
          if (res.code === 0 && res.data) {
            this.alarmData = res.data;
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
   * ??????????????????
   */
  public closeRefAlarm(): void {
    this.isShowRefAlarm = false;
    this.alarmData = null;
  }
  /**
   * ??????????????????
   */
  public closeRefFault(): void {
    this.isShowRefFault = false;
  }

  /**
   * ???????????????????????????
   */
  public showModal(filterValue: FilterCondition): void {
    this.departFilterValue = filterValue;
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
   * ????????????
   */
  public showTransForm(param: ClearBarrierWorkOrderModel): void {
    const data = new TransferOrderParamModel();
    data.type = ClearBarrierOrInspectEnum.clearBarrier;
    data.procId = param.procId;
    data.accountabilityDept = param.accountabilityDept;
    this.transModalData = data;
    this.showTransModal = true;
  }
  /**
   * ???????????????
   */
  private showAssignModal(): void {
    this.assignTreeSelectorConfig.treeNodes = this.assignTreeNode;
    this.assignVisible = true;
  }

  /**
   * ??????????????????
   */
  public selectAssignDataChange(event: DepartmentUnitModel[]): void {
    FacilityForCommonUtil.setTreeNodesStatus(this.assignTreeNode, []);
    if (event && event.length > 0) {
      const param = new ClearBarrierDepartmentModel();
      param.procId = this.selectedWorkOrderId;
      param.accountabilityDept = event[0].deptCode;
      param.accountabilityDeptName = event[0].deptName;
      this.$clearBarrierWorkOrderService.assignWorkOrder(param).subscribe((result: ResultModel<string>) => {
        if (result.code === ResultCodeEnum.success) {
          this.$message.success(this.InspectionLanguage.operateMsg.assignSuccess);
          this.refreshData();
        } else {
          this.$message.error(result.msg);
          this.refreshData();
        }
      });
    } else {
      this.$message.error(this.InspectionLanguage.pleaseSelectUnit);
    }
  }
  /**
   * ????????????????????????
   * ???????????????????????????????????????
   */
  private getAllUser(): void {
    this.$inspectionWorkOrderService.getDepartUserList().subscribe((result: ResultModel<OrderUserModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        const list = result.data || [];
        list.forEach(item => {
          this.roleArr.push({'label': item.userName, 'value': item.id});
        });
      }
    });
  }

  /**
   * ????????????????????????
   * param event
   */
  public selectDataChange(event: DepartmentUnitModel[]): void {
    this.selectUnitName = '';
    if (event.length > 0) {
      this.selectUnitName = event[0].deptName;
      this.filterValue.filterValue = [event[0].deptCode];
      this.departFilterValue.filterName = this.selectUnitName;
      FacilityForCommonUtil.setTreeNodesStatus(this.unitTreeNodes, [event[0].id]);
    }
  }

  /**
   * ???????????????
   */
  private queryDeptList(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.$userForCommonService.queryAllDepartment().subscribe((result: ResultModel<DepartmentUnitModel[]>) => {
        this.unitTreeNodes = [];
        this.unitTreeNodes = result.data || [];
        resolve(true);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * ??????????????????
   */
  public showArea(filterValue: FilterCondition): void {
    this.areaFilterValue = filterValue;
    // ?????????????????????????????????
    if (this.areaNodes && this.areaNodes.length > 0) {
      this.areaSelectorConfig.treeNodes = this.areaNodes;
      this.areaSelectVisible = true;
    } else {
      // ??????????????????
      this.$workOrderCommonUtil.getRoleAreaList().then((data: any[]) => {
        this.areaNodes = data;
        this.areaNodeList = data;
        this.areaSelectorConfig.treeNodes = this.areaNodes;
        FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, null);
        this.areaSelectVisible = true;
      });
    }
  }

  /**
   * ??????????????????
   * param item
   */
  public areaSelectChange(item: AreaFormModel[]): void {
    if (item && item[0]) {
      this.areaFilterValue.filterValue = item[0].areaCode;
      this.areaFilterValue.filterName = item[0].areaName;
      this.areaNodeList = item;
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, item[0].areaId, item[0].areaId);
    } else {
      this.areaFilterValue.filterValue = null;
      this.areaFilterValue.filterName = '';
    }
  }

  /**
   * ???????????????
   */
  private initDeviceObjectConfig(): void {
    this.deviceObjectConfig = {
      clear: !this.filterObj.deviceIds.length,
      handledCheckedFun: (event) => {
        this.checkDeviceObject = event;
        this.filterObj.deviceIds = event.ids;
        this.filterObj.deviceName = event.name;
      }
    };
  }
  /**
   * ??????????????????????????????
   */
  private initAlarmEquipment(): void {
    this.alarmEquipmentConfig = {
      clear: !this.filterObj.equipmentIds.length,
      handledCheckedFun: (event) => {
        this.checkAlarmEquipment = event;
        this.filterObj.equipmentIds = event.ids;
        this.filterObj.equipmentName = event.name;
      }
    };
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.tableConfig) {
      this.slideShowChange(this.slideShowChangeData);
    }
  }

  /**
   * ????????????
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
   * ????????????
   * ???????????????????????????????????????
   */
  private showSuggestInfo(): void {
    this.$alarmForCommonService.queryExperienceInfo().subscribe((result: ResultModel<any>) => {
      if (result.code === 0) {
        const list = [];
        this.alarmTitle = this.workOrderLanguage.alarmReason;
        result.data.forEach(item => {
          item.breakdownReason = AlarmForCommonUtil.translateSuggest(this.$nzI18n, item.id);
        });
        result.data.forEach(v => {
          if (v.id === '111') {
            v.planSuggest = [this.alarmLanguage.lineHandle1, this.alarmLanguage.lineHandle2];
            v.resourcesSuggest = [this.alarmLanguage.electricalEngineer, this.alarmLanguage.communicationEngineer];
          } else if (v.id === '222') {
            v.planSuggest = [this.alarmLanguage.checkPower, this.alarmLanguage.seal, this.alarmLanguage.cleanForeign];
            v.resourcesSuggest = [this.alarmLanguage.electricalEngineer, this.alarmLanguage.communicationEngineer];
          } else {
            v.planSuggest = [this.alarmLanguage.checkPower, this.alarmLanguage.dustRemoval];
            v.resourcesSuggest = [this.alarmLanguage.electricalEngineer];
          }
          list.push({
            name: `${v.breakdownReason}???${v.percentage}%???`,
            planSuggest: v.planSuggest,
            resourcesSuggest: v.resourcesSuggest
          });
        });
        this.suggestList = list;
        this.xcVisible = true;
      }
    });
  }

  /**
   * ????????????
   */
  public handleCancel(): void {
    this.xcVisible = false;
  }

  /**
   * ????????????
   */
  public transferOrders(event: TransferOrderParamModel): void {
    if (event) {
      this.$clearBarrierWorkOrderService.transferClearOrder(event).subscribe((result: ResultModel<string>) => {
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
   * ??????????????????
   */
  public openEquipmentSelector(filterValue: FilterCondition): void {
    this.equipmentVisible = true;
    this.equipmentFilterValue = filterValue;
  }

  /**
   * ??????????????????
   */
  public onSelectEquipment(event: EquipmentListModel[]): void {
    this.selectEquipments = event;
    this.checkEquipmentObject = {
      ids: event.map(v => v.equipmentId) || [],
      name: event.map(v => v.equipmentName).join(',') || '',
      type: ''
    };
    this.equipmentFilterValue.filterValue = this.checkEquipmentObject.ids.length === 0 ? null : this.checkEquipmentObject.ids;
    this.equipmentFilterValue.filterName = this.checkEquipmentObject.name;
  }
  /**
   * ??????????????????
   */
  public openUserSelector(filterValue: FilterCondition): void {
    this.isShowUserTemp = true;
    this.userFilterValue = filterValue;
  }

  /**
   * ????????????
   */
  public onSelectUser(event): void {
    this.selectUserList = event;
    WorkOrderClearInspectUtil.selectUser(event, this);
  }

  /**
   * ????????????????????????
   * ???????????????????????????????????????
   */
  private getAssignDataList(areaCode: string): void {
    const param = new AreaDeviceParamModel();
    param.userId = WorkOrderBusinessCommonUtil.getUserId();
    param.areaCodes = [areaCode];
    this.$facilityForCommonService.listDepartmentByAreaAndUserId(param).subscribe((result: ResultModel<NzTreeNode[]>) => {
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
   * ??????????????????
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }
}
