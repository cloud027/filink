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
 * ????????? ???????????? ??????
 */
@Component({
  selector: 'app-unfinished-dismantle-barrier-work-order-table',
  templateUrl: './unfinished-dismantle-barrier-work-order-table.component.html',
  styleUrls: ['./unfinished-dismantle-barrier-work-order-table.component.scss'],
})
export class UnfinishedDismantleBarrierWorkOrderTableComponent
  implements OnInit, OnChanges, OnDestroy {
  // ??????????????????
  @Input() slideShowChangeData;
  // ??????
  @Output() workOrderEvent = new EventEmitter();
  // ??????????????????
  @ViewChild('statusTemp') public statusTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('deviceTemp') public deviceTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('footerTemp') public footerTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('UnitNameSearch') public UnitNameSearch: TemplateRef<any>;
  // ????????????
  @ViewChild('refAlarmTemp') public refAlarmTemp: TemplateRef<any>;
  // ??????
  @ViewChild('singleBackTemp') public singleBackTemp: TemplateRef<any>;
  // ??????
  @ViewChild('tableComponent') public tableComponent: TableComponent;
  // ????????????
  @ViewChild('AreaSearch') public areaSearch: TemplateRef<any>;
  // ??????????????????
  @ViewChild('DeviceNameSearch') public deviceNameSearch: TemplateRef<any>;
  // ????????????
  @ViewChild('equipmentSearch') public equipmentSearch: TemplateRef<any>;
  // ????????????
  @ViewChild('equipTemps') public equipTemps: TemplateRef<any>;
  // ????????????
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<HTMLDocument>;
  // ????????????
  @ViewChild('userSearchTemp') userSearchTemp: TemplateRef<any>;
  // ?????????
  public InspectionLanguage: InspectionLanguageInterface;
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
  public alarmData;
  // ??????????????????
  public faultData;
  // ????????????
  public alarmLanguage;
  // ????????????????????????
  public areaSelectVisible: boolean = false;
  // ?????????????????????
  public areaSelectorConfig: TreeSelectorConfigModel;
  // ?????????????????????
  public deviceObjectConfig: AlarmSelectorConfigModel;
  // ?????????????????????
  public checkDeviceObject: FilterValueModel = new FilterValueModel();
  // ????????????????????????
  public isPresence: boolean;
  // ????????????
  public tempSelectVisible: boolean = false;
  // ???????????????
  public modalParams: RoleUnitModel[];
  // ????????????????????????
  public isRebuild: boolean;
  // ????????????
  public filterObj: FilterValueModel = new FilterValueModel();
  // ????????????
  public _dataSet: DismantleBarrierWorkOrderModel[] = [];
  // ????????????
  public tableConfig: TableConfigModel;
  // ??????
  public pageBean: PageModel = new PageModel();
  // ??????????????????
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // ??????
  private exportParams: ExportRequestModel = new ExportRequestModel();
  // ???????????????
  public alarmTitle: string;
  // ?????????????????????
  public equipmentVisible: boolean = false;
  // ???????????????
  public checkEquipmentObject: SelectOrderEquipmentModel = new SelectOrderEquipmentModel();
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
  // ??????????????????id
  private selectedWorkOrderId: string;
  // ?????????????????????/?????????
  private orderPageType: string;
  // ????????????modal
  private singleBackConfirmModal;
  /** ???????????? */
  private filterValue: FilterValueModel;
  // ????????????
  private areaFilterValue: FilterValueModel;
  // ??????????????????
  private areaNodes: AreaFormModel[] = [];
  // ?????????????????????
  private equipmentFilterValue: FilterCondition;
  // ?????????
  private assignTreeNode: NzTreeNode[] = [];
  // ?????????
  private unitTreeNodes: DepartmentUnitModel[] = [];
  // ????????????
  private isReset: boolean = false;
  // ????????????
  private webSocketInstance;

  // ????????????id
  private selectedAccountabilityUnitIdList = [];
  /** ?????????????????? */
  dismantleTypeEnum = DismantleTypeEnum;

  // ????????????
  public checkUserObject: FilterValueModel = new FilterValueModel();
  public refCheckUserObject: FilterValueModel = new FilterValueModel();
  // ??????????????????
  public selectUserList: UserRoleModel[] = [];
  public selectRefUserList: UserRoleModel[] = [];

  // ??????????????????
  public isShowUserTemp: boolean = false;
  public isShowRefUserTemp: boolean = false;
  // ????????????
  private userFilterValue: FilterCondition;
  private refUserFilterValue: FilterCondition;

  // ?????????????????????
  public facilityVisible: boolean = false;
  // ????????????????????????
  public filterDeviceName: string = '';
  /** ????????????????????? */
  public selectFacility: FacilityListModel[] = [];

  /** ??????????????? */
  trunBackData: DismantleBarrierWorkOrderModel;
  languageEnum = LanguageEnum;
  // ?????????????????????
  public workOrderLanguage: WorkOrderLanguageInterface;
  // ?????????????????????
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
    // ???????????????
    WorkOrderInitTreeUtil.initTreeSelectorConfig(this);
    // ???????????????
    WorkOrderInitTreeUtil.initAreaSelectorConfig(this);
    this.setSelectOption();
    UnfinishedTable.initUnfinishedTable(this);
    this.refreshData();
    this.initDeviceObjectConfig();
    // ?????????????????????
    WorkOrderInitTreeUtil.initAssignTreeConfig(this);
    // ????????????(????????????)
    this.initAlarmEquipment();
  }
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
    this.webSocketInstance = this.$websocketService.subscibeMessage.subscribe((res) => {
      if (res && res.data && JSON.parse(res.data)) {
        const data: WebsocketMessageModel = JSON.parse(res.data);
        if (data.channelKey === ChannelCode.workflowBusiness) {
          // ??????????????????
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
              // ????????????????????????
              if (item.lastDays && item.lastDays > 3) {
                // ????????????????????????
              } else if (item.lastDays <= 0) {
                item.rowStyle = { color: LastDayColorEnum.overdueTime };
                // ??????????????????3???
              } else if (item.lastDays && item.lastDays <= 3 && item.lastDays > 0) {
                item.rowStyle = { color: LastDayColorEnum.estimatedTime };
              } else {
                item.lastDaysClass = '';
              }
              // ???????????????????????????class
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
              // ???????????????????????????class
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
   * ??????????????????
   */
  private getPageParam(): void {
    const procId = this.$activatedRoute.snapshot.queryParams.id;
    // ????????????
    if (!this.isReset) {
      // ???????????????????????? ??????id
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
      // ?????????????????? ??????id???name
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
      // ?????????????????? ??????id???name
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
   * ??????????????????????????????
   * param item
   */
  private setIconStatus(item: DismantleBarrierWorkOrderModel): void {
    // ?????????????????????
    item.isShowDeleteIcon = item.status === WorkOrderStatusEnum.assigned;
    // ?????????????????????
    item.isShowEditIcon = item.status !== WorkOrderStatusEnum.singleBack;
    // ?????????????????????;
    item.isShowRevertIcon = item.status === WorkOrderStatusEnum.pending;
    // ?????????????????????
    item.isShowAssignIcon = item.status === WorkOrderStatusEnum.assigned;
    // ????????????????????????????????????   isCheckSingleBack = 0 ?????????  1?????????
    item.isShowTurnBackConfirmIcon =
      item.status === WorkOrderStatusEnum.singleBack && item.isCheckSingleBack !== 1;
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
    this.selectOption = WorkOrderStatusUtil.getWorkOrderStatusList(this.$nzI18n).filter((item) => {
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
    let equipmentIdList = [];
    // ????????????
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
   * ????????????
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
   * ??????
   */
  public handleExport(event): void {
    if (event && !_.isEmpty(event.selectItem)) {
        const ids = event.selectItem.map(item => item.procId);
        const filter = new FilterCondition('_id', OperatorEnum.in, ids);
        this.exportParams.queryCondition.filterConditions.push(filter);
    } else {
        // ??????????????????
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
   * ??????????????????modal
   */
  public showRefAlarmModal(data: DismantleBarrierWorkOrderModel): void {
    // ????????????
    if (data.refType === DismantleWarnTroubleEnum.trouble) {
      this.faultData = data.refId;
      this.isShowRefFault = true;
      return;
    }
    // ????????????
    this.$alarmService
      .queryCurrentAlarmInfoById(data.refId)
      .subscribe((result: ResultModel<AlarmListModel>) => {
        if (result.code === 0 && result.data) {
          this.alarmData = result.data;
          // ??????????????????
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
          // ????????????
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
   * ????????????
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
   * ??????????????????
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
   * ????????????????????????
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
   * ???????????????
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
   * ??????????????????
   */
  public showArea(filterValue: FilterValueModel): void {
    this.areaFilterValue = filterValue;
    // ?????????????????????????????????
    if (this.areaNodes && this.areaNodes.length > 0) {
      this.areaSelectorConfig.treeNodes = this.areaNodes;
      this.areaSelectVisible = true;
    } else {
      // ??????????????????
      this.$workOrderCommonUtil.getRoleAreaList().then((data: any[]) => {
        this.areaNodes = data;
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
   * ???????????????
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
   * ??????????????????????????????
   */
  private initAlarmEquipment(): void {}

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
   */
  public handleCancel(): void {
    this.xcVisible = false;
  }

  /**
   * ????????????
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
   * ????????????
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
   * ??????????????????
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
   * ??????????????????
   */
  public openEquipmentSelector(filterValue): void {
    this.equipmentVisible = true;
    this.equipmentFilterValue = filterValue;
  }

  /**
   * ??????????????????
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * ????????????
   * param ids
   * ???????????????????????????????????????
   */
  deleteWorkOrder(ids: string[], data: DismantleBarrierWorkOrderModel): void {
    const params = {
      procIdList: ids,
      procType: ClearBarrierOrInspectEnum.remove,
    };

    let equipmentIdList = [];
    // ???????????????, ????????????
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

  /** ?????????????????? */
  delteEquipmentTarget(data) {
    console.log(data, 'data');
  }

  /**
   * ????????????
   * param ids
   * ???????????????????????????????????????
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
      nzFooter: this.footerTemp,
    });
  }
  /**
   * ???????????????
   */
  private showAssignModal(): void {
    this.assignTreeSelectorConfig.treeNodes = this.assignTreeNode;
    this.assignVisible = true;
  }
  /**
   * ????????????????????????
   * ???????????????????????????????????????
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
   * ??????????????????
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
   * ????????????
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
   * ?????????????????????????????????
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
   * ??????????????????
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
