import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {WorkOrderLanguageInterface} from '../../../../../assets/i18n/work-order/work-order.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {WorkOrderStatusUtil} from '../../../../core-module/business-util/work-order/work-order-for-common.util';
import {WorkOrderBusinessCommonUtil} from '../../share/util/work-order-business-common.util';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {WorkOrderClearInspectUtil} from '../../share/util/work-order-clear-inspect.util';
import {FinishedAlarmConfirmTable} from './finished-alarm-confirm-table';
import {AlarmSelectorConfigModel} from '../../../../shared-module/model/alarm-selector-config.model';
import {FilterValueModel} from '../../../../core-module/model/work-order/filter-value.model';
import {SelectOrderEquipmentModel} from '../../share/model/select-order-equipment.model';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';
import {SelectModel} from '../../../../shared-module/model/select.model';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {AreaFormModel} from '../../share/model/area-form.model';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {WorkOrderCommonServiceUtil} from '../../share/util/work-order-common-service.util';
import {WorkOrderInitTreeUtil} from '../../share/util/work-order-init-tree.util';
import {ActivatedRoute, Router} from '@angular/router';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {AlarmConfirmWorkOrderModel} from '../../../../core-module/model/work-order/alarm-confirm.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {AlarmConfirmWorkOrderService} from '../../share/service/alarm-confirm';
import {AlarmListModel} from '../../../../core-module/model/alarm/alarm-list.model';
import {AlarmForCommonService} from '../../../../core-module/api-service/alarm';
import {AlarmLanguageInterface} from '../../../../../assets/i18n/alarm/alarm-language.interface';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {DepartmentUnitModel} from '../../../../core-module/model/work-order/department-unit.model';
import {UserRoleModel} from '../../../../core-module/model/user/user-role.model';
import {WorkOrderStatusEnum} from '../../../../core-module/enum/work-order/work-order-status.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {ChartTypeEnum} from '../../share/enum/clear-barrier-work-order.enum';
import {AlarmStoreService} from '../../../../core-module/store/alarm.store.service';
import {AlarmForCommonUtil} from '../../../../core-module/business-util/alarm/alarm-for-common.util';
import {WorkOrderStatisticalModel} from '../../share/model/clear-barrier-model/work-order-statistical.model';
import {ChartUtil} from '../../../../shared-module/util/chart-util';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {StatisticalPercentageColor} from '../../share/const/work-order-chart-color';

/**
 * ????????????????????????
 */
@Component({
  selector: 'app-finished-alarm-confirm',
  templateUrl: './finished-alarm-confirm.component.html',
  styleUrls: ['./finished-alarm-confirm.component.scss']
})
export class FinishedAlarmConfirmComponent implements OnInit {
  // ??????????????????
  @ViewChild('statusTemp') public statusTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('deviceTemp') deviceTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('equipTemp') equipTemp: TemplateRef<any>;
  // ??????????????????
  @ViewChild('DeviceNameSearch') public deviceNameSearch: TemplateRef<any>;
  // ????????????
  @ViewChild('equipmentSearch') public equipmentSearch: TemplateRef<any>;
  // ????????????
  @ViewChild('AreaSearch') public areaSearch: TemplateRef<any>;
  // ????????????
  @ViewChild('refAlarmTemp') public refAlarmTemp: TemplateRef<any>;
  // ??????????????????
  @ViewChild('unitNameSearch') unitNameSearch: TemplateRef<any>;
  // ????????????
  @ViewChild('userSearchTemp') userSearchTemp: TemplateRef<any>;
  // ?????????
  public inspectionLanguage: InspectionLanguageInterface;
  public workOrderLanguage: WorkOrderLanguageInterface;
  // ????????????
  public alarmLanguage: AlarmLanguageInterface;
  // ???????????????????????????????????????  chart ??????   text ??????
  public alarmChartType: string = ChartTypeEnum.text;
  // ???????????????????????????????????????  chart ??????   text ??????
  public equipmentTypeChartType: string = ChartTypeEnum.text;
  // ???????????????????????????????????????  chart ??????   text ??????
  public statusStatisticsChartType: string = ChartTypeEnum.text;
  // ?????????????????????????????????????????????
  public ringChartOption: any;
  // ???????????????
  public barChartOption;
  // ???????????????
  public chartType = ChartTypeEnum;
  // ????????????????????????????????????????????????
  public completedChartOption: any;
  public singleBackChartOption: any;
  // ????????????????????????????????????
  public tableDataSet: AlarmConfirmWorkOrderModel[] = [];
  // ????????????
  public pageBean: PageModel = new PageModel();
  // ??????????????????
  public tableConfig: TableConfigModel;
  // ?????????????????????
  public deviceObjectConfig: AlarmSelectorConfigModel;
  // ????????????
  public filterObj: FilterValueModel = new FilterValueModel();
  // ?????????????????????
  public areaSelectorConfig: TreeSelectorConfigModel;
  // ????????????????????????
  public areaSelectVisible: boolean = false;
  // ?????????????????????
  public equipmentVisible: boolean = false;
  // ???????????????
  public checkEquipmentObject: SelectOrderEquipmentModel = new SelectOrderEquipmentModel();
  // ??????????????????
  public selectEquipments: EquipmentListModel[] = [];
  // ??????????????????
  public workOrderList: SelectModel[] = [];
  // ????????????
  public areaFilterValue: FilterCondition = {
    filterField: '',
    operator: '',
    filterValue: '',
    filterName: ''
  };
  // ??????????????????
  public isShowRefAlarm: boolean = false;
  // ????????????
  public alarmData: AlarmListModel;
  // ???????????????
  public treeSelectorConfig: TreeSelectorConfigModel;
  // ????????????
  public departFilterValue: FilterCondition = {
    filterField: '',
    operator: '',
    filterValue: '',
    filterName: ''
  };
  // ?????????????????????
  public responsibleUnitIsVisible: boolean = false;
  // ??????????????????
  public isShowUserTemp: boolean = false;
  // ??????????????????
  public selectUserList: UserRoleModel[] = [];
  // ????????????
  public checkUserObject: FilterValueModel = new FilterValueModel();
  // ????????????
  private userFilterValue: FilterCondition;
  // ??????????????????
  private areaNodes: AreaFormModel[] = [];
  // ??????
  private historyDeduplication: boolean = false;
  // ????????????
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // ?????? ?????????????????????????????????????????????
  private exportParams: ExportRequestModel = new ExportRequestModel();
  // ?????????????????????
  private checkDeviceObject: FilterValueModel = new FilterValueModel();
  // ?????????????????????
  private equipmentFilterValue: FilterCondition;
  // ?????????
  private unitTreeNodes: DepartmentUnitModel[] = [];
  // ????????????
  private isReset: boolean = false;

  constructor(
    private $nzI18n: NzI18nService,
    private $router: Router,
    public $message: FiLinkModalService,
    private $activatedRoute: ActivatedRoute,
    private $workOrderCommonUtil: WorkOrderCommonServiceUtil,
    private $alarmWorkOrderService: AlarmConfirmWorkOrderService,
    private $alarmForCommonService: AlarmForCommonService,
    public $alarmStoreService: AlarmStoreService,
  ) {}

  public ngOnInit(): void {
    this.workOrderLanguage = this.$nzI18n.getLocaleData(LanguageEnum.workOrder);
    this.inspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.alarmLanguage = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    // ?????????
    WorkOrderInitTreeUtil.initTreeSelectorConfig(this);
    // ???????????????
    WorkOrderInitTreeUtil.initAreaSelectorConfig(this);
    // ???????????????
    FinishedAlarmConfirmTable.initHistoryAlarmConfig(this);
    // ???????????????
    this.getChartData();
    // ????????????
    this.refreshData();
    // ????????????
    this.initDeviceObjectConfig();
    // id??????
    this.$activatedRoute.queryParams.subscribe(param => {
      if (param.id) {
        const index = this.queryCondition.filterConditions.findIndex(v => v.filterField === '_id');
        if (index > -1) {
          this.queryCondition.filterConditions[index].filterValue = [param.id];
          this.queryCondition.filterConditions[index].operator = OperatorEnum.in;
        } else {
          this.queryCondition.filterConditions.push({
            filterField: '_id',
            filterValue: [param.id],
            operator: OperatorEnum.in
          });
        }
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshData();
      }
    });
  }

  /**
   * ????????????
   * @param event ????????????
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }
  /**
   * ????????????????????????
   */
  public showRefAlarmModal(data: AlarmConfirmWorkOrderModel) {
    // ????????????
    this.$alarmForCommonService.queryCurrentAlarmInfoById(data.refAlarmId).subscribe((result: ResultModel<AlarmListModel>) => {
      if (result.code === 0 && result.data) {
        this.alarmData = result.data;
        // ??????????????????
        this.alarmData.alarmContinousTime = CommonUtil.setAlarmContinousTime(this.alarmData.alarmBeginTime, this.alarmData.alarmCleanTime,
          {month: this.alarmLanguage.month, day: this.alarmLanguage.day, hour: this.alarmLanguage.hour});
        this.isShowRefAlarm = true;
      } else {
        // ????????????
        this.$alarmForCommonService.queryAlarmHistoryInfo(data.refAlarmId).subscribe((res: ResultModel<AlarmListModel>) => {
          if (res.code === 0 && res.data) {
            this.alarmData = res.data;
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
   * ???????????????????????????
   * @param filterValue ????????????
   */
  public showDeptModal(filterValue: FilterCondition): void {
    this.departFilterValue = filterValue;
    if (this.unitTreeNodes.length === 0) {
      this.historyDeduplication = false;
      this.$workOrderCommonUtil.queryAllDeptList().then((data: DepartmentUnitModel[]) => {
        if (data.length) {
          this.unitTreeNodes = data;
          this.treeSelectorConfig.treeNodes = data;
          this.responsibleUnitIsVisible = true;
        }
      });
    } else {
      this.responsibleUnitIsVisible = true;
    }
  }
  /**
   * ????????????????????????
   * @param event ????????????????????????
   */
  public departmentSelectDataChange(event: DepartmentUnitModel[]): void {
    if (event && event.length > 0) {
      this.departFilterValue.filterName = event[0].deptName;
      this.departFilterValue.filterValue = event[0].deptCode;
      FacilityForCommonUtil.setTreeNodesStatus(this.unitTreeNodes, [event[0].id]);
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
  public showArea(filterValue: FilterCondition): void {
    this.areaFilterValue = filterValue;
    // ?????????????????????????????????
    if (this.areaNodes && this.areaNodes.length > 0) {
      this.areaSelectorConfig.treeNodes = this.areaNodes;
      this.areaSelectVisible = true;
    } else {
      // ??????????????????
      this.$workOrderCommonUtil.getRoleAreaList().then((data: any[]) => {
        this.historyDeduplication = true;
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
      this.areaFilterValue.filterValue = item[0].areaCode;
      this.areaFilterValue.filterName = item[0].areaName;
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, item[0].areaId, item[0].areaId);
    } else {
      this.historyDeduplication = true;
      this.areaFilterValue.filterValue = null;
      this.areaFilterValue.filterName = '';
    }
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
  public onSelectUser(event: UserRoleModel[]): void {
    this.selectUserList = event;
    WorkOrderClearInspectUtil.selectUser(event, this);
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
   * ??????????????????
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    const params = ['deviceId', 'equipment.equipmentId', 'assign'];
    this.queryCondition.filterConditions.forEach(v => {
      if (params.includes(v.filterField)) {
        v.operator = OperatorEnum.in;
      }
    });
    // ????????????
    if (!this.isReset) {
      // ???????????????????????? ??????id
      const id = this.$activatedRoute.snapshot.queryParams.id;
      if (id) {
        const index = this.queryCondition.filterConditions.findIndex(v => v.filterField === '_id');
        if (index > -1) {
          this.queryCondition.filterConditions[index].filterValue = [id];
          this.queryCondition.filterConditions[index].operator = OperatorEnum.in;
        } else {
          this.queryCondition.filterConditions.push({
            filterField: '_id',
            filterValue: [id],
            operator: OperatorEnum.in
          });
        }
      }
    }
    this.$alarmWorkOrderService.finishedAlarmConfirm(this.queryCondition).subscribe((result: ResultModel<AlarmConfirmWorkOrderModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.pageBean.Total = result.totalPage * result.size;
        this.pageBean.pageSize = result.size;
        this.pageBean.pageIndex = result.pageNum;
        const list = result.data || [];
        this.tableConfig.showEsPagination = list.length > 0;
        list.forEach(item => {
          // ????????????
          if (item.status) {
            item.statusClass = WorkOrderStatusUtil.getWorkOrderIconClassName(item.status);
            item.statusName = WorkOrderStatusUtil.getWorkOrderStatus(this.$nzI18n, item.status);
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
          item.isShowTurnBackConfirmIcon = item.status === WorkOrderStatusEnum.singleBack;
          // ???????????????????????????class
          item.equipmentTypeList = [];
          item.equipmentTypeName = '';
          if (item.equipmentType) {
            this.historyDeduplication = true;
            const equip = WorkOrderClearInspectUtil.handleMultiEquipment(item.equipmentType, this.$nzI18n);
            item.equipmentTypeList = equip.equipList;
            item.equipmentTypeName = equip.names.join(',');
          }
        });
        this.tableDataSet = list;
      }
      this.tableConfig.isLoading = false;
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * ???????????????
   */
  private getChartData(): void {
    // ????????????
    this.$alarmWorkOrderService.alarmEquipmentTypes().subscribe((res: ResultModel<WorkOrderStatisticalModel[]>) => {
      this.equipmentTypeChartType = ChartTypeEnum.chart;
      if (res.code === ResultCodeEnum.success) {
        WorkOrderClearInspectUtil.orderEquipmentChart(this, this.$nzI18n, res.data);
      } else {
        this.historyDeduplication = false;
        WorkOrderClearInspectUtil.orderEquipmentChart(this, this.$nzI18n, []);
      }
    }, () => {
      this.equipmentTypeChartType = ChartTypeEnum.chart;
      WorkOrderClearInspectUtil.orderEquipmentChart(this, this.$nzI18n, []);
    });
    // ????????????????????????
    AlarmForCommonUtil.getAlarmTypeList(this.$alarmForCommonService).then((res: SelectModel[]) => {
      if (res && res.length > 0) {
        this.$alarmWorkOrderService.historyAlarmOrder().subscribe((result: ResultModel<any>) => {
          if (result.code === ResultCodeEnum.success && result.data) {
            const list = [];
            result.data.sort((a, b) => a.alarmClassification - b.alarmClassification);
            result.data.forEach(item => {
              res.forEach(v => {
                if (item.alarmClassification === v.value && item.alarmClassification !== '7') {
                  list.push({label: v.label, count: item.count});
                }
              });
            });
            FinishedAlarmConfirmTable.getStatisticsByAlarmType(this, list);
          }
        }, () => {
          FinishedAlarmConfirmTable.getStatisticsByAlarmType(this, []);
        });
      }
    }, () => {
      FinishedAlarmConfirmTable.getStatisticsByAlarmType(this, []);
    });
    // ????????????
    this.$alarmWorkOrderService.historyOrderStatus().subscribe((result: ResultModel<WorkOrderStatisticalModel[]>) => {
      this.statusStatisticsChartType = ChartTypeEnum.chart;
      if (result.code === ResultCodeEnum.success && result.data) {
        result.data.forEach(v => {
          if (v.orderStatus === WorkOrderStatusEnum.completed) {
            this.completedChartOption = ChartUtil.initCirclesChart(v.percentage, this.workOrderLanguage[v.orderStatus], StatisticalPercentageColor.completedChart, true);
          } else {
            this.singleBackChartOption = ChartUtil.initCirclesChart(v.percentage, this.workOrderLanguage[v.orderStatus], StatisticalPercentageColor.singleBackChart, true);
          }
        });
      } else {
        this.defaultStyle();
      }
    }, () => {
      this.statusStatisticsChartType = ChartTypeEnum.chart;
      this.defaultStyle();
    });
  }

  /**
   * ????????????
   */
  private defaultStyle(): void {
    this.completedChartOption = ChartUtil.initCirclesChart(0, this.workOrderLanguage.completed, StatisticalPercentageColor.completedChart);
    this.singleBackChartOption = ChartUtil.initCirclesChart(0, this.workOrderLanguage.singleBack, StatisticalPercentageColor.singleBackChart);
  }
}
