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
 * 历史告警确认工单
 */
@Component({
  selector: 'app-finished-alarm-confirm',
  templateUrl: './finished-alarm-confirm.component.html',
  styleUrls: ['./finished-alarm-confirm.component.scss']
})
export class FinishedAlarmConfirmComponent implements OnInit {
  // 工单状态模板
  @ViewChild('statusTemp') public statusTemp: TemplateRef<any>;
  // 设施类型
  @ViewChild('deviceTemp') deviceTemp: TemplateRef<any>;
  // 设备类型
  @ViewChild('equipTemp') equipTemp: TemplateRef<any>;
  // 选择设施名称
  @ViewChild('DeviceNameSearch') public deviceNameSearch: TemplateRef<any>;
  // 设备选择
  @ViewChild('equipmentSearch') public equipmentSearch: TemplateRef<any>;
  // 区域筛选
  @ViewChild('AreaSearch') public areaSearch: TemplateRef<any>;
  // 关联告警
  @ViewChild('refAlarmTemp') public refAlarmTemp: TemplateRef<any>;
  // 单位名称选择
  @ViewChild('unitNameSearch') unitNameSearch: TemplateRef<any>;
  // 用户筛选
  @ViewChild('userSearchTemp') userSearchTemp: TemplateRef<any>;
  // 国际化
  public inspectionLanguage: InspectionLanguageInterface;
  public workOrderLanguage: WorkOrderLanguageInterface;
  // 告警语言
  public alarmLanguage: AlarmLanguageInterface;
  // 故障原因统计报表显示的类型  chart 图表   text 文字
  public alarmChartType: string = ChartTypeEnum.text;
  // 设备类型统计报表显示的类型  chart 图表   text 文字
  public equipmentTypeChartType: string = ChartTypeEnum.text;
  // 工单状态统计报表显示的类型  chart 图表   text 文字
  public statusStatisticsChartType: string = ChartTypeEnum.text;
  // 饼图配置，无法使用模型定义类型
  public ringChartOption: any;
  // 柱状图配置
  public barChartOption;
  // 统计图类型
  public chartType = ChartTypeEnum;
  // 环形图配置，无法使用模型定义类型
  public completedChartOption: any;
  public singleBackChartOption: any;
  // 历史告警确认列表数据存放
  public tableDataSet: AlarmConfirmWorkOrderModel[] = [];
  // 列表分页
  public pageBean: PageModel = new PageModel();
  // 列表表单配置
  public tableConfig: TableConfigModel;
  // 设施选择器配置
  public deviceObjectConfig: AlarmSelectorConfigModel;
  // 过滤条件
  public filterObj: FilterValueModel = new FilterValueModel();
  // 区域选择器配置
  public areaSelectorConfig: TreeSelectorConfigModel;
  // 控制区域显示隐藏
  public areaSelectVisible: boolean = false;
  // 设备选择器显示
  public equipmentVisible: boolean = false;
  // 勾选的设备
  public checkEquipmentObject: SelectOrderEquipmentModel = new SelectOrderEquipmentModel();
  // 设备勾选容器
  public selectEquipments: EquipmentListModel[] = [];
  // 工单状态列表
  public workOrderList: SelectModel[] = [];
  // 区域过滤
  public areaFilterValue: FilterCondition = {
    filterField: '',
    operator: '',
    filterValue: '',
    filterName: ''
  };
  // 显示关联告警
  public isShowRefAlarm: boolean = false;
  // 告警数据
  public alarmData: AlarmListModel;
  // 单位树配置
  public treeSelectorConfig: TreeSelectorConfigModel;
  // 单位过滤
  public departFilterValue: FilterCondition = {
    filterField: '',
    operator: '',
    filterValue: '',
    filterName: ''
  };
  // 单位选择器筛选
  public responsibleUnitIsVisible: boolean = false;
  // 显示用户选择
  public isShowUserTemp: boolean = false;
  // 存放用户数据
  public selectUserList: UserRoleModel[] = [];
  // 勾选用户
  public checkUserObject: FilterValueModel = new FilterValueModel();
  // 用户显示
  private userFilterValue: FilterCondition;
  // 区域节点数据
  private areaNodes: AreaFormModel[] = [];
  // 去重
  private historyDeduplication: boolean = false;
  // 查询条件
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // 导出 （配置文件调用，灰显勿删！！）
  private exportParams: ExportRequestModel = new ExportRequestModel();
  // 勾选的设施对象
  private checkDeviceObject: FilterValueModel = new FilterValueModel();
  // 设备选择器显示
  private equipmentFilterValue: FilterCondition;
  // 树节点
  private unitTreeNodes: DepartmentUnitModel[] = [];
  // 是否重置
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
    // 单位树
    WorkOrderInitTreeUtil.initTreeSelectorConfig(this);
    // 初始化区域
    WorkOrderInitTreeUtil.initAreaSelectorConfig(this);
    // 初始化列表
    FinishedAlarmConfirmTable.initHistoryAlarmConfig(this);
    // 统计图数据
    this.getChartData();
    // 刷新列表
    this.refreshData();
    // 设施名称
    this.initDeviceObjectConfig();
    // id变化
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
   * 分页显示
   * @param event 分页参数
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }
  /**
   * 关联告警详情弹窗
   */
  public showRefAlarmModal(data: AlarmConfirmWorkOrderModel) {
    // 当前告警
    this.$alarmForCommonService.queryCurrentAlarmInfoById(data.refAlarmId).subscribe((result: ResultModel<AlarmListModel>) => {
      if (result.code === 0 && result.data) {
        this.alarmData = result.data;
        // 告警持续时间
        this.alarmData.alarmContinousTime = CommonUtil.setAlarmContinousTime(this.alarmData.alarmBeginTime, this.alarmData.alarmCleanTime,
          {month: this.alarmLanguage.month, day: this.alarmLanguage.day, hour: this.alarmLanguage.hour});
        this.isShowRefAlarm = true;
      } else {
        // 历史告警
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
   * 关联告警弹窗
   */
  public closeRefAlarm(): void {
    this.isShowRefAlarm = false;
    this.alarmData = null;
  }
  /**
   * 打开责任单位选择器
   * @param filterValue 过滤参数
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
   * 部门筛选选择结果
   * @param event 当前选中单位数据
   */
  public departmentSelectDataChange(event: DepartmentUnitModel[]): void {
    if (event && event.length > 0) {
      this.departFilterValue.filterName = event[0].deptName;
      this.departFilterValue.filterValue = event[0].deptCode;
      FacilityForCommonUtil.setTreeNodesStatus(this.unitTreeNodes, [event[0].id]);
    }
  }
  /**
   * 设备名称弹框
   */
  public openEquipmentSelector(filterValue: FilterCondition): void {
    this.equipmentVisible = true;
    this.equipmentFilterValue = filterValue;
  }
  /**
   * 设备名称过滤
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
   * 设施区域弹框
   */
  public showArea(filterValue: FilterCondition): void {
    this.areaFilterValue = filterValue;
    // 当区域数据不为空的时候
    if (this.areaNodes && this.areaNodes.length > 0) {
      this.areaSelectorConfig.treeNodes = this.areaNodes;
      this.areaSelectVisible = true;
    } else {
      // 查询区域列表
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
   * 区域选择监听
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
   * 用户名称选择
   */
  public openUserSelector(filterValue: FilterCondition): void {
    this.isShowUserTemp = true;
    this.userFilterValue = filterValue;
  }
  /**
   * 用户名称
   */
  public onSelectUser(event: UserRoleModel[]): void {
    this.selectUserList = event;
    WorkOrderClearInspectUtil.selectUser(event, this);
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
      }
    };
  }
  /**
   * 获取列表数据
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    const params = ['deviceId', 'equipment.equipmentId', 'assign'];
    this.queryCondition.filterConditions.forEach(v => {
      if (params.includes(v.filterField)) {
        v.operator = OperatorEnum.in;
      }
    });
    // 是否重置
    if (!this.isReset) {
      // 其它页面跳转工单 工单id
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
          // 工单状态
          if (item.status) {
            item.statusClass = WorkOrderStatusUtil.getWorkOrderIconClassName(item.status);
            item.statusName = WorkOrderStatusUtil.getWorkOrderStatus(this.$nzI18n, item.status);
          }
          // 设施类型名称及图表class
          if (item.deviceType) {
            item.deviceTypeName = WorkOrderBusinessCommonUtil.deviceTypeNames(this.$nzI18n, item.deviceType);
            if (item.deviceTypeName) {
              item.deviceClass = CommonUtil.getFacilityIconClassName(item.deviceType);
            } else {
              item.deviceClass = '';
            }
          }
          item.isShowTurnBackConfirmIcon = item.status === WorkOrderStatusEnum.singleBack;
          // 设备类型名称及图表class
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
   * 统计图数据
   */
  private getChartData(): void {
    // 设备类型
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
    // 查询告警类别统计
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
    // 工单状态
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
   * 默认样式
   */
  private defaultStyle(): void {
    this.completedChartOption = ChartUtil.initCirclesChart(0, this.workOrderLanguage.completed, StatisticalPercentageColor.completedChart);
    this.singleBackChartOption = ChartUtil.initCirclesChart(0, this.workOrderLanguage.singleBack, StatisticalPercentageColor.singleBackChart);
  }
}
