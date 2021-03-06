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
 * ????????????????????????
 */
@Component({
  selector: 'app-history-dismantle-barrier-work-order-table',
  templateUrl: './history-dismantle-barrier-work-order-table.component.html',
  styleUrls: ['./history-dismantle-barrier-work-order-table.component.scss'],
})
export class HistoryDismantleBarrierWorkOrderTableComponent implements OnInit {
  // ????????????
  @ViewChild('statusTemp') public statusTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('deviceTemp') public deviceTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('unitNameSearch') public unitNameSearch: TemplateRef<any>;
  // ??????????????????
  @ViewChild('refAlarmTemp') public refAlarmTemp: TemplateRef<any>;
  // ??????????????????
  @ViewChild('AreaSearch') public areaSearch: TemplateRef<any>;
  // ??????????????????
  @ViewChild('DeviceNameSearch') public deviceNameSearch: TemplateRef<any>;
  // ????????????
  @ViewChild('equipmentSearch') public equipmentSearch: TemplateRef<any>;
  // ????????????
  @ViewChild('equipmentTemp') public equipmentTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<HTMLDocument>;
  // ????????????
  @ViewChild('UnitNameSearch') public UnitNameSearch: TemplateRef<any>;
  public inspectionLanguage: InspectionLanguageInterface;
  // ????????????modal????????????
  public alarmData;
  // ??????????????????
  public faultData;
  // ?????????????????????
  public equipmentVisible: boolean = false;
  // ???????????????
  public checkEquipmentObject: SelectOrderEquipmentModel = new SelectOrderEquipmentModel();
  // ??????????????????
  public selectEquipments: EquipmentListModel[] = [];
  // ??????????????????
  public isVisible: boolean = false;
  // ?????????
  public treeSelectorConfig: TreeSelectorConfigModel;
  // ???????????????
  public treeNodes: DepartmentUnitModel[] = [];
  // ????????????
  public selectUnitName: string;
  // ????????????
  public historyTableData: DismantleBarrierWorkOrderModel[] = [];
  // ?????????
  public alarmLanguage: AlarmLanguageInterface;
  // ????????????????????????
  public areaSelectVisible: boolean = false;
  // ?????????????????????
  public areaSelectorConfig: TreeSelectorConfigModel;
  // ?????????????????????
  public deviceObjectConfig: AlarmSelectorConfigModel;
  // ????????????
  public tempSelectVisible: boolean = false;
  // ??????????????????
  public isShowRefAlarm: boolean = false;
  // ??????????????????
  public isShowRefFault: boolean = false;
  // ????????????
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
  // ????????????
  private filterValue: FilterValueModel;
  // ???????????????
  private areaFilterValue: FilterValueModel;
  // ??????????????????
  private areaNodes: AreaFormModel[] = [];
  // ???????????????
  public modalParams: RoleUnitModel[];
  // ????????????
  private isReset: boolean = false;
  // ?????????????????????
  private equipmentFilterValue: FilterCondition;
  //  ?????????????????????
  private selectOption: DeviceTypeModel[];
  // ????????????
  private roleArr: RoleUnitModel[] = [];

  // ??????????????????
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // ??????
  private exportParams: ExportRequestModel = new ExportRequestModel();
  // ????????????
  public tableConfig: TableConfigModel;
  // ??????
  public pageBean: PageModel = new PageModel();
  /** ?????????????????? */
  dismantleTypeEnum = DismantleTypeEnum;

  // ?????????????????????
  public facilityVisible: boolean = false;
  /** ????????????????????? */
  public selectFacility: FacilityListModel[] = [];
  // ????????????????????????
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
   * ??????????????????
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
              // ????????????????????????class?????????
              item.statusName = WorkOrderStatusUtil.getWorkOrderStatus(this.$nzI18n, item.status);
              item.statusClass = WorkOrderStatusUtil.getWorkOrderIconClassName(item.status);
              // ?????????????????????????????????????????????
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
              // ????????????????????????
              if (
                item.status === WorkOrderStatusEnum.singleBack &&
                item.dataResourceType !== SourceTypeEnum.trouble
              ) {
                item.isShowTurnBackConfirmIcon = true;
              }
              // ??????????????????
              if (item.dataResourceType) {
                item.dataResourceType = this.workOrderLanguage[
                  WorkOrderBusinessCommonUtil.getEnumKey(item.dataResourceType, SourceTypeEnum)
                ];
              }
              item.equipmentTypeList = [];
              item.equipmentTypeName = '';
              // ??????
              item.isShowWriteOffOrderDetail = true;
              // ?????????????????????????????????????????????
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
   * ????????????????????????
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
   * ?????????????????????????????????
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
   * ??????????????????modal
   */
  public showRefAlarmModal(data): void {
    // ????????????
    if (data.troubleId && data.troubleId.length > 0) {
      this.faultData = data.troubleId;
      this.isShowRefFault = true;
      return;
    }
    // ????????????
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
                this.$message.error(this.inspectionLanguage.noData);
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
   * ??????ID??????
   */
  private getId(): void {
    if (this.$active.snapshot.queryParams.id) {
      const workOrderId = this.$active.snapshot.queryParams.id;
      this.queryCondition.bizCondition.procIds = [workOrderId];
    }
  }

  /**
   * ??????
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
   * ??????????????????
   */
  private createExportParams(event): void {
    if (event && !_.isEmpty(event.selectItem)) {
        const ids = event.selectItem.map(item => item.procId);
        const filter = new FilterCondition('_id', OperatorEnum.in, ids);
        this.exportParams.queryCondition.filterConditions.push(filter);
    } else {
        // ??????????????????
        this.exportParams.queryCondition.filterConditions = event.queryTerm;
    }
    // this.exportParams.queryCondition = new QueryConditionModel();
    // this.exportParams.queryCondition.filterConditions = this.queryCondition.filterConditions;
    this.exportParams.excelType = event.excelType;
  }

  /**
   * ???????????????????????????
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
   * ??????????????????????????????
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
   * ????????????????????????
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
   * ?????????????????????
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
   * ?????????????????????
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
          // ????????????
          title: this.workOrderLanguage.name,
          key: 'title',
          width: 150,
          configurable: false,
          searchable: true,
          isShowSort: true,
          fixedStyle: { fixedLeft: true, style: { left: '124px' } },
          searchConfig: { type: 'input' },
        },
        // ????????????
        {
          title: this.workOrderLanguage.taskDescription,
          key: 'taskDescribe',
          width: 150,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        // ????????????
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
        // ????????????/??????
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
        // ????????????
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
        // ????????????
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
        // ????????????
        {
          title: this.workOrderLanguage.facilityModel,
          key: 'deviceModel',
          width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        // ????????????
        {
          title: this.workOrderLanguage.removePosition,
          key: 'removePosition',
          width: 150,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        // ????????????
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
        // ????????????
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
        // ????????????
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
          // ???????????? ??????
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
          // ????????????
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
          // ?????????
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
          // ??????????????????
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
          // ??????
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
          // ????????????
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
          // ??????
          text: this.commonLanguage.viewPhoto,
          className: 'fiLink-view-photo',
          permissionCode: '06-6-2-1',
          handle: (data) => {
            this.getPicUrlByAlarmIdAndDeviceId(data);
          },
        },
        {
          // ??????
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
   * ????????????
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
   * ????????????
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
   * ???????????????????????????
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
   * ???????????????
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
   * ??????????????????????????????
   */
  private initAlarmEquipment(): void {}

  /**
   * ??????????????????
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
   * ??????????????????
   */
  public openEquipmentSelector(filterValue): void {
    this.equipmentVisible = true;
    this.equipmentFilterValue = filterValue;
  }
  /*
   * ??????????????????
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
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
