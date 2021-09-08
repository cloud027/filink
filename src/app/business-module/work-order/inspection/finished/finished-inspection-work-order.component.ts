import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {WorkOrderInitTreeUtil} from '../../share/util/work-order-init-tree.util';
import {NzI18nService} from 'ng-zorro-antd';
import {PageModel} from '../../../../shared-module/model/page.model';
import {ActivatedRoute, Router} from '@angular/router';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {InspectionWorkOrderService} from '../../share/service/inspection';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {WorkOrderLanguageInterface} from '../../../../../assets/i18n/work-order/work-order.language.interface';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {FilterValueModel} from '../../../../core-module/model/work-order/filter-value.model';
import {WorkOrderPageTypeEnum} from '../../share/enum/work-order-page-type.enum';
import {DepartmentUnitModel} from '../../../../core-module/model/work-order/department-unit.model';
import {AreaFormModel} from '../../share/model/area-form.model';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {RoleUnitModel} from '../../../../core-module/model/work-order/role-unit.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {InspectionWorkOrderModel} from '../../../../core-module/model/work-order/inspection-work-order.model';
import {ChartUtil} from '../../../../shared-module/util/chart-util';
import {OrderUserModel} from '../../../../core-module/model/work-order/order-user.model';
import {ChartTypeEnum, ClearBarrierOrInspectEnum, IsSelectAllEnum} from '../../share/enum/clear-barrier-work-order.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {WorkOrderCommonServiceUtil} from '../../share/util/work-order-common-service.util';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {UserForCommonService} from '../../../../core-module/api-service/user';
import {WorkOrderStatusEnum} from '../../../../core-module/enum/work-order/work-order-status.enum';
import {WorkOrderStatusUtil} from '../../../../core-module/business-util/work-order/work-order-for-common.util';
import {WorkOrderBusinessCommonUtil} from '../../share/util/work-order-business-common.util';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {InspectionTaskModel} from '../../share/model/inspection-model/inspection-task.model';
import {WorkOrderStatisticalModel} from '../../share/model/clear-barrier-model/work-order-statistical.model';
import {WorkOrderClearInspectUtil} from '../../share/util/work-order-clear-inspect.util';
import {StatisticalPercentageColor} from '../../share/const/work-order-chart-color';
import {UserRoleModel} from '../../../../core-module/model/user/user-role.model';

/**
 * 完工巡检记录
 */
@Component({
  selector: 'app-finished-inspection-work-order',
  templateUrl: './finished-inspection-work-order.component.html',
  styleUrls: ['./finished-inspection-work-order.component.scss']
})
export class FinishedInspectionWorkOrderComponent implements OnInit {
  // 表格模板
  @ViewChild('orderTableComponent') orderTableComponent: TableComponent;
  // 状态模板
  @ViewChild('statusTemp') statusTemp: TemplateRef<any>;
  // 单位选择模板
  @ViewChild('UnitNameSearch') UnitNameSearch: TemplateRef<any>;
  // 角色选择模板
  @ViewChild('roleTemp') roleTemp: TemplateRef<any>;
  // 区域选择
  @ViewChild('AreaSearch') areaSearch: TemplateRef<any>;
  // 设施图标
  @ViewChild('deviceTemps') deviceTemp: TemplateRef<any>;
  // 设备类型
  @ViewChild('equipmentTemp') equipmentTemp: TemplateRef<any>;
  // 用户筛选
  @ViewChild('userSearchTemp') userSearchTemp: TemplateRef<any>;
  // 关联工单用户选择
  @ViewChild('refUserSearchTemp') refUserSearchTemp: TemplateRef<any>;
  // 已完成巡检信息列表
  public isCompleteVisible: boolean = false;
  // 责任单位
  public responsibleUnitIsVisible = false;
  // title已完成巡检信息
  public title: string;
  // 完工记录列表数据存放
  public tableDataSet: InspectionWorkOrderModel[] = [];
  // 已完成列表数据存放
  public seeDataSet: InspectionTaskModel[] = [];
  // 分页
  public pageBean: PageModel = new PageModel(); // 分页
  public seePageBean: PageModel = new PageModel(); // 分页
  // 完工记录列表
  public tableConfig: TableConfigModel;
  // 已完成列表
  public seeTableConfig: TableConfigModel;
  // 已完成巡检信息ID
  public completedWorkOrderID: string;
  // 国际化
  public InspectionLanguage: InspectionLanguageInterface;
  // 树配置
  public treeSelectorConfig: TreeSelectorConfigModel;
  // 单位过滤
  public departFilterValue: FilterCondition = {
    filterField: '',
    operator: '',
    filterValue: '',
    filterName: ''
  };
  // 单位名称
  public selectUnitName: string;
  // 巡检数量input值
  public deviceCountSelectValue = OperatorEnum.eq;
  // 区域选择器配置
  public areaSelectorConfig: TreeSelectorConfigModel = new TreeSelectorConfigModel();
  // 区域过滤
  public areaFilterValue: FilterCondition = {
    filterField: '',
    operator: '',
    filterValue: '',
    filterName: ''
  };
  // 控制区域显示隐藏
  public areaSelectVisible: boolean = false;
  // 弹框过滤条件
  public filterObj: FilterValueModel = {
    areaName: '',
    areaId: '',
  };
  // 销账工单国际化
  public  workOrderLanguage: WorkOrderLanguageInterface;
  // 设施类型统计报表显示的类型  chart 图表   text 文字
  public deviceTypeStatisticsChartType: string = ChartTypeEnum.text;
  // 工单状态统计报表显示的类型  chart 图表   text 文字
  public statusChartType: string = ChartTypeEnum.text;
  // 统计图类型
  public chartType = ChartTypeEnum;
  // 柱状图配置
  public barChartOption;
  // 环形图配置，无法使用模型定义类型
  public completedChartOption: any;
  public singleBackChartOption: any;
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
  // 是否重置
  private isReset: boolean = false;
  // 去重复
  private deduplication: boolean = false;
  // 查询参数模型
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  private scheduleQueryCondition: QueryConditionModel = new QueryConditionModel();
  // 导出
  private exportParams: ExportRequestModel = new ExportRequestModel();
  // 获取责任人数据
  private roleArray: RoleUnitModel[] = [];
  // 跳转页面工单id
  private orderId: string;
  // 巡检数量input值
  private deviceCountInputValue: string;
  // 区域code
  private areaCode: string;
  // 树节点数据
  private unitTreeNodes: DepartmentUnitModel[] = [];
  // 选择区域code
  private selectAreaCode: string;
  // 组件过滤参数
  private filterValue: FilterCondition;
  // 区域树数据
  private areaNodes: AreaFormModel[] = [];
  // 已勾选数据
  private selectDataId: string[] = [];

  constructor(private $nzI18n: NzI18nService,
              private $router: Router,
              public $message: FiLinkModalService,
              private $activatedRoute: ActivatedRoute,
              private $userService: UserForCommonService,
              private $workOrderCommonUtil: WorkOrderCommonServiceUtil,
              private $inspectionWorkOrderService: InspectionWorkOrderService,
  ) {}

  public ngOnInit(): void {
    this.InspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.workOrderLanguage = this.$nzI18n.getLocaleData(LanguageEnum.workOrder);
    this.initTableConfig();
    this.refreshData();
    this.seeInitTableConfig();
    // 初始化单位树
    WorkOrderInitTreeUtil.initTreeSelectorConfig(this);
    // 初始化区域树
    WorkOrderInitTreeUtil.initAreaSelectorConfig(this);
    this.getDeviceTypeStatistics();
    this.getStatusStatistics();
    // id变化
    this.$activatedRoute.queryParams.subscribe(param => {
      if (param.id) {
        const arr = this.queryCondition.filterConditions.find(item => {
          return item.filterField === '_id';
        });
        this.orderId = param.id;
        if (!arr) {
          this.queryCondition.filterConditions.push({
            filterField: '_id',
            filterValue: param.id,
            operator: OperatorEnum.eq
          });
        }
        this.isCompleteVisible = false;
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshData();
      }
    });
  }

  /**
   * 用户名称选择
   */
  public openUserSelector(filterValue: FilterCondition,  flag?: boolean): void {
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
        userIds: event.map(v => v.id) || [],
        userName: event.map(v => v.userName).join(',') || '',
      };
      this.deduplication = true;
      this.refUserFilterValue.filterValue = this.refCheckUserObject.userIds.length > 0 ? this.refCheckUserObject.userIds : null;
      this.refUserFilterValue.filterName = this.refCheckUserObject.userName;
    } else {
      this.selectUserList = event;
      WorkOrderClearInspectUtil.selectUser(event, this);
    }
  }
  /**
   * 显示巡检完工记录列表数据
   */
  private refreshData(): void {
    // 别的页面跳转过来参数拼接
    this.tableConfig.isLoading = true;
    this.queryCondition.filterConditions.forEach(v => {
      if (v.filterField === 'accountabilityDept' || v.filterField === 'assign') {
        v.operator = OperatorEnum.in;
      }
      this.deduplication = true;
      if (v.filterField === 'equipmentType') {
        v.filterField = 'procRelatedEquipment.equipmentType';
        v.operator = OperatorEnum.all;
      }
      if (v.filterField === 'deviceType') {
        v.operator = OperatorEnum.in;
        v.filterField = 'procRelatedDevices.deviceType';
      }
    });
    // 是否重置
    if (!this.isReset) {
      // 其它页面跳转工单 工单id
      const id = this.$activatedRoute.snapshot.queryParams.id;
      if (id) {
        const arr = this.queryCondition.filterConditions.find(item => {
          return item.filterField === '_id';
        });
        if (!arr) {
          this.queryCondition.filterConditions.push({
            filterField: '_id',
            filterValue: id,
            operator: OperatorEnum.eq
          });
        }
      }
    }
    this.$inspectionWorkOrderService.getFinishedList(this.queryCondition).subscribe((result: ResultModel<InspectionWorkOrderModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.pageBean.Total = result.totalPage * result.size;
        this.pageBean.pageIndex = result.pageNum;
        this.pageBean.pageSize = result.size;
        const data = result.data;
        this.tableConfig.showEsPagination = data.length > 0;
        data.forEach(item => {
          if (item.status === WorkOrderStatusEnum.singleBack) {
            item.isShowTurnBackConfirmIcon = true;
          }
          // 获取设施名称及class
          if (item.deviceType) {
            item.deviceTypeName = WorkOrderBusinessCommonUtil.deviceTypeNames(this.$nzI18n, item.deviceType);
            if (item.deviceTypeName) {
              item.deviceClass = CommonUtil.getFacilityIconClassName(item.deviceType);
            } else {
              item.deviceClass = '';
            }
          }
          // 工单状态
          item.statusClass = WorkOrderStatusUtil.getWorkOrderIconClassName(item.status);
          item.statusName = WorkOrderStatusUtil.getWorkOrderStatus(this.$nzI18n, item.status);
          item.equipmentTypeList = [];
          item.equipmentTypeName = '';
          // 获取设备类型名称及图标class
          if (item.equipmentType) {
            const equip = WorkOrderClearInspectUtil.handleMultiEquipment(item.equipmentType, this.$nzI18n);
            item.equipmentTypeList = equip.equipList;
            item.equipmentTypeName = equip.names.join(',');
          }
        });
        this.tableDataSet = result.data;
      }
      this.tableConfig.isLoading = false;
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 显示已完成工单列表数据
   */
  public refreshCompleteData(id?: string): void {
    this.seeTableConfig.isLoading = true;
    this.scheduleQueryCondition.sortCondition = new SortCondition();
    const param = this.scheduleQueryCondition.filterConditions.find(item => {
      return item.filterField === 'procId';
    });
    if (!param) {
      this.scheduleQueryCondition.filterConditions.push({
        filterField: 'procId',
        filterValue: id,
        operator: OperatorEnum.eq
      });
    } else {
      this.scheduleQueryCondition.filterConditions.forEach(v => {
        if (v.filterField === 'procId') {
          v.filterValue = id;
        }
      });
    }
    this.scheduleQueryCondition.filterConditions.forEach(v => {
      if (v.filterField === 'procRelatedDevices.assign') {
        v.operator = OperatorEnum.in;
      }
    });
    this.$inspectionWorkOrderService.getUnfinishedCompleteList(this.scheduleQueryCondition).subscribe((result: ResultModel<InspectionTaskModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        const list = result.data || [];
        list.forEach(v => {
          if (v.result === IsSelectAllEnum.deny) {
            v.result = this.InspectionLanguage.normal;
          } else if (v.result === IsSelectAllEnum.right) {
            v.result = this.InspectionLanguage.abnormal;
          }
        });
        this.seePageBean.Total = result.totalCount;
        this.seePageBean.pageIndex = result.pageNum;
        this.seePageBean.pageSize = result.size;
        this.seeTableConfig.isLoading = false;
        this.seeDataSet = list;
      }
    }, () => {
      this.seeTableConfig.isLoading = false;
    });
  }

  /**
   * 初始化表格配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      primaryKey: '06-1-3',
      showSearchSwitch: true,
      showRowSelection: false,
      showSizeChanger: true,
      showSearchExport: true,
      scroll: {x: '1600px', y: '600px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {// 工单名称
          title: this.InspectionLanguage.workOrderName, key: 'title', width: 150,
          fixedStyle: {fixedLeft: true, style: {left: '124px'}},
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {// 工单状态
          title: this.InspectionLanguage.workOrderStatus, key: 'status', width: 150,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'status',
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              {label: this.InspectionLanguage.completed, value: WorkOrderStatusEnum.completed},
              {label: this.InspectionLanguage.singleBack, value: WorkOrderStatusEnum.singleBack},
            ]
          },
          type: 'render',
          renderTemplate: this.statusTemp,
        },
        {// 实际完成时间
          title: this.InspectionLanguage.actualTime, key: 'realityCompletedTime', width: 180,
          pipe: 'date',
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'realityCompletedTime',
          searchConfig: {type: 'dateRang'}
        },
        {// 巡检区域
          title: this.InspectionLanguage.inspectionArea, key: 'inspectionAreaName', width: 150,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'deviceAreaCode',
          searchConfig: {type: 'render', renderTemplate: this.areaSearch},
        },
        {// 设施类型
          title: this.InspectionLanguage.facilityType, key: 'deviceType', width: 150,
          configurable: true,
          searchable: true, isShowSort: true,
          searchKey: 'deviceType',
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleFacility(this.$nzI18n),
            label: 'label', value: 'code'
          },
          type: 'render',
          renderTemplate: this.deviceTemp,
        },
        {// 设备类型
          title: this.InspectionLanguage.equipmentType, key: 'equipmentType', width: 150,
          configurable: true,
          searchable: true, isShowSort: true,
          searchKey: 'equipmentType',
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n),
            label: 'label', value: 'code'
          },
          type: 'render',
          renderTemplate: this.equipmentTemp,
        },
        {// 责任单位
          title: this.InspectionLanguage.responsibleUnit, key: 'accountabilityDeptName', width: 150,
          configurable: true,
          searchable: true, isShowSort: true,
          searchKey: 'accountabilityDept',
          searchConfig: {type: 'render', renderTemplate: this.UnitNameSearch}
        },
        {// 责任人
          title: this.InspectionLanguage.responsible, key: 'assignName', width: 190,
          configurable: true,
          searchable: true, isShowSort: true,
          searchKey: 'assign',
          searchConfig: {type: 'render', renderTemplate: this.userSearchTemp},
        },
        {// 操作
          title: this.InspectionLanguage.operate, searchable: true, configurable: false,
          searchConfig: {type: 'operate'}, key: '', width: 180, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: false,
      showEsPagination: false,
      bordered: false,
      showSearch: false,
      operation: [
        {
          // 查看已完成信息
          text: this.InspectionLanguage.viewDetail,
          permissionCode: '06-1-3-2',
          className: 'fiLink-ref-order bold-icon',
          handle: (currentIndex: InspectionWorkOrderModel) => {
            this.title = this.InspectionLanguage.completeInspectionInformation;
            this.completedWorkOrderID = currentIndex.procId;
            const id = currentIndex.procId;
            this.isCompleteVisible = true;
            this.refreshCompleteData(id);
          }
        },
        { // 查看巡检报告
          text: this.InspectionLanguage.inspectReport,
          permissionCode: '06-1-3-1',
          className: 'fiLink-reports bold-icon',
          handle: (currentIndex: InspectionWorkOrderModel) => {
            const id = currentIndex.procId;
            this.$router.navigate([`/business/work-order/inspection/finished-detail/finished-inspectReport`],
              {queryParams: {procId: id, status: WorkOrderPageTypeEnum.checkList}}).then();
          }
        },
        { // 详情
          text: this.InspectionLanguage.inspectionDetail,
          permissionCode: '06-1-3-3',
          className: 'fiLink-view-detail bold-icon',
          handle: (currentIndex: InspectionWorkOrderModel) => {
            const id = currentIndex.procId;
            this.$router.navigate([`/business/work-order/inspection/unfinished-detail/finishedView`],
              {queryParams: {procId: id, status: WorkOrderPageTypeEnum.finished}});
          }
        },
        { // 重新生成
          text: this.InspectionLanguage.regenerate,
          permissionCode: '06-1-3-4',
          className: 'fiLink-rebuild-order bold-icon',
          key: 'isShowTurnBackConfirmIcon',
          confirmContent: this.InspectionLanguage.isItRegenerated,
          handle: (currentIndex: InspectionWorkOrderModel) => {
            const id = currentIndex.procId;
            this.$workOrderCommonUtil.queryDataRole(currentIndex.procId, ClearBarrierOrInspectEnum.inspection).then(flag => {
              if (flag) {
                this.$router.navigate([`/business/work-order/inspection/unfinished-detail/restUpdate`],
                  {queryParams: {procId: id, type: WorkOrderPageTypeEnum.restUpdate, status: WorkOrderStatusEnum.assigned, route: WorkOrderPageTypeEnum.finished}}).then();
              }
            });
          }
        }
      ],
      sort: (event: SortCondition) => {
        if (event.sortField === 'equipmentType') {
          event.sortField = 'procRelatedEquipment.equipmentType';
        }
        if (event.sortField === 'deviceType') {
          event.sortField = 'procRelatedDevices.deviceType';
        }
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        if (event && event.length === 0) {
          this.isReset = true;
          this.filterObj.areaName = '';
          FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes || [], null);
          this.selectUnitName = '';
          FacilityForCommonUtil.setTreeNodesStatus(this.unitTreeNodes, []);
          this.deviceCountInputValue = '';
          this.deviceCountSelectValue = OperatorEnum.eq;
          this.selectUserList = [];
        }
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
      handleSelect: (event) => {
        this.selectDataId = event.map(v => v.procId);
      },
      handleExport: (event) => {
        this.exportParams.columnInfoList = event.columnInfoList;
        this.exportParams.columnInfoList.forEach(item => {
          if (item.propertyName === 'status' || item.propertyName === 'realityCompletedTime' || item.propertyName === 'deviceType' || item.propertyName === 'equipmentType') {
            item.isTranslation = 1;
          }
        });
        // 生成导出条件
        this.exportParams.queryCondition = this.queryCondition;
        this.exportParams.excelType = event.excelType;
        const index = this.exportParams.queryCondition.filterConditions.findIndex(v => v.filterField === '_id');
        if (this.selectDataId.length) {
          if (index > -1) {
            this.exportParams.queryCondition.filterConditions[index].filterValue = this.selectDataId;
            this.exportParams.queryCondition.filterConditions[index].operator = OperatorEnum.in;
          } else {
            this.exportParams.queryCondition.filterConditions.push({filterField: '_id', filterValue: this.selectDataId, operator: OperatorEnum.in});
          }
        } else {
          const i = this.queryCondition.filterConditions.findIndex(v => v.filterField === '_id');
          if (i > -1) {
            this.queryCondition.filterConditions.splice(i, 1);
            this.exportParams.queryCondition = this.queryCondition;
          }
        }
        // 调用导出接口
        this.$inspectionWorkOrderService.completionRecordExport(this.exportParams).subscribe((result: ResultModel<string>) => {
          if (result.code === ResultCodeEnum.success) {
            this.$message.success(this.InspectionLanguage.operateMsg.exportSuccess);
          } else {
            this.$message.error(result.msg);
          }
        });
      }
    };
  }

  /**
   * 初始化已完成巡检信息列表配置
   */
  private seeInitTableConfig(): void {
    this.seeTableConfig = {
      isDraggable: false,
      primaryKey: '06-1-3-1',
      isLoading: false,
      showSearchSwitch: true,
      showRowSelection: false,
      showSizeChanger: true,
      showSearchExport: false,
      notShowPrint: true,
      scroll: {x: '1600px', y: '600px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {// 巡检设施
          title: this.InspectionLanguage.inspectionFacility, key: 'deviceName', width: 200,
          isShowSort: true, configurable: true, searchable: true,
          searchKey: 'procRelatedDevices.deviceName',
          searchConfig: {type: 'input'}
        },
        {// 巡检结果
          title: this.InspectionLanguage.inspectionResults, key: 'result', width: 200,
          searchable: true, configurable: true, isShowSort: true,
          searchKey: 'procRelatedDevices.result',
          searchConfig: {
            type: 'select',
            selectInfo: [
              {label: this.InspectionLanguage.normal, value: IsSelectAllEnum.deny},  // 正常
              {label: this.InspectionLanguage.abnormal, value: IsSelectAllEnum.right},   // 异常
            ]
          },
        },
        {// 异常详情
          title: this.InspectionLanguage.exceptionallyDetailed, key: 'remark', width: 200,
          searchable: true, configurable: true, isShowSort: true,
          searchKey: 'procRelatedDevices.remark',
          searchConfig: {type: 'input'}
        },
        {// 巡检时间
          title: this.InspectionLanguage.inspectionTime, key: 'inspectionTime', width: 200,
          pipe: 'date',
          searchable: true, configurable: true, isShowSort: true,
          searchKey: 'procRelatedDevices.inspectionTime',
          searchConfig: {type: 'dateRang'}
        },
        {// 责任人
          title: this.InspectionLanguage.responsible, key: 'assignName', width: 200,
          configurable: true, searchable: true,
          searchKey: 'procRelatedDevices.assign',
          searchConfig: {type: 'render', renderTemplate: this.refUserSearchTemp},
        },
        {// 资源匹配情况
          title: this.InspectionLanguage.matchingOfResources, key: 'resourceMatching', width: 200,
          searchable: true, configurable: true,
          searchConfig: {type: 'input'}
        },
        {// 关联图片
          title: this.InspectionLanguage.relatedPictures, searchable: true,
          searchConfig: {type: 'operate'}, width: 200, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      operation: [
        {
          text: this.InspectionLanguage.viewDetail,
          className: 'fiLink-view-photo',
          handle: (currentIndex) => {
            this.$workOrderCommonUtil.queryImageForView(currentIndex.deviceId, currentIndex.procId);
          }
        },
      ],
      sort: (event: SortCondition) => {
        if (event.sortField !== 'resourceMatching') {
          this.scheduleQueryCondition.sortCondition.sortField = `procRelatedDevices.${event.sortField}`;
        } else {
          this.scheduleQueryCondition.sortCondition.sortField = event.sortField;
        }
        this.scheduleQueryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshCompleteData(this.completedWorkOrderID);
      },
      handleSearch: (event: FilterCondition[]) => {
        this.scheduleQueryCondition.pageCondition.pageNum = 1;
        this.scheduleQueryCondition.filterConditions = event;
        if (event.length === 0) {
          this.selectRefUserList = [];
        }
        this.refreshCompleteData(this.completedWorkOrderID);
      },
    };
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
   * 已完工分页
   */
  public seePageChange(event: PageModel): void {
    this.scheduleQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.scheduleQueryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshCompleteData(this.completedWorkOrderID);
  }

  /**
   * 隐藏弹框
   */
  public closeModal(): void {
    this.isCompleteVisible = false;
    this.seePageBean = new PageModel();
    this.scheduleQueryCondition = new QueryConditionModel();
    this.orderTableComponent.handleRest();
    this.seeDataSet = [];
    this.seeTableConfig.showSearch = false;
    this.selectRefUserList = [];
  }

  /**
   * 打开责任单位选择器
   */
  public showModal(filterValue: FilterCondition): void {
    this.departFilterValue = filterValue;
    if (this.unitTreeNodes.length === 0) {
      this.queryDeptList().then((bool) => {
        if (bool) {
          this.filterValue = filterValue;
          if (!this.filterValue.filterValue) {
            this.filterValue.filterValue = null;
          }
          this.treeSelectorConfig.treeNodes = this.unitTreeNodes;
          this.responsibleUnitIsVisible = true;
        }
      });
    } else {
      this.responsibleUnitIsVisible = true;
    }
  }

  /**
   * 责任单位选择结果
   * param event
   */
  public selectDataChange(event: DepartmentUnitModel[]): void {
    this.selectUnitName = '';
    if (event && event.length > 0) {
      this.selectUnitName = event[0].deptName;
      this.filterValue.filterValue = [event[0].deptCode];
      this.departFilterValue.filterName = this.selectUnitName;
      FacilityForCommonUtil.setTreeNodesStatus(this.unitTreeNodes, [event[0].id]);
    }
  }

  /**
   * 查询单位
   */
  private queryDeptList(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.$userService.queryAllDepartment().subscribe((result: ResultModel<DepartmentUnitModel[]>) => {
        this.unitTreeNodes = result.data || [];
        resolve(true);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * 获得所有的责任人
   */
  public getAllUser(event: boolean): void {
    if (!event || this.roleArray.length > 0) {
      return;
    }
    this.$inspectionWorkOrderService.getDepartUserList().subscribe((result: ResultModel<OrderUserModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        const list = result.data || [];
        list.forEach(item => {
          this.roleArray.push({'label': item.userName, 'value': item.id});
        });
      }
    });
  }


  /**
   * 设施区域弹框
   */
  public showArea(filterValue: FilterCondition): void {
    this.areaFilterValue = filterValue;
    // 当区域数据不为空的时候
    if (this.areaNodes.length > 0) {
      this.areaSelectorConfig.treeNodes = this.areaNodes;
      this.areaSelectVisible = true;
    } else {
      // 查询区域列表
      this.$workOrderCommonUtil.getRoleAreaList().then((data: any[]) => {
        this.areaNodes = data;
        this.areaCode = '';
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
  public areaSelectChange(item: AreaFormModel): void {
    if (item && item[0]) {
      this.areaFilterValue.filterValue = item[0].areaCode;
      this.selectAreaCode = item[0].areaCode;
      this.areaFilterValue.filterName = item[0].areaName;
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, item[0].areaId, item[0].areaId);
    } else {
      this.areaFilterValue.filterValue = null;
      this.areaFilterValue.filterName = '';
    }
  }

  /**
   * 设施统计
   */
  private getDeviceTypeStatistics(): void {
    this.$inspectionWorkOrderService.inspectDeviceTypes({}).subscribe((result: ResultModel<WorkOrderStatisticalModel[]>) => {
      this.deviceTypeStatisticsChartType = ChartTypeEnum.chart;
      if (result.code === ResultCodeEnum.success) {
        WorkOrderClearInspectUtil.orderDeviceChart(this, this.$nzI18n, result.data);
      } else {
        this.$message.error(result.msg);
        WorkOrderClearInspectUtil.orderDeviceChart(this, this.$nzI18n, []);
      }
    }, () => {
      this.deviceTypeStatisticsChartType = ChartTypeEnum.chart;
      WorkOrderClearInspectUtil.orderDeviceChart(this, this.$nzI18n, []);
    });
  }

  /**
   * 获取工单状态统计
   */
  private getStatusStatistics(): void {
    this.$inspectionWorkOrderService.inspectStatusStatistic({}).subscribe((result: ResultModel<WorkOrderStatisticalModel[]>) => {
      if (result.code === ResultCodeEnum.success && result.data) {
        this.statusChartType = ChartTypeEnum.chart;
        result.data.forEach(v => {
          if (v.orderStatus === WorkOrderStatusEnum.completed) {
            this.completedChartOption = ChartUtil.initCirclesChart(v.percentage, this.workOrderLanguage[v.orderStatus], StatisticalPercentageColor.completedChart);
          } else {
            this.singleBackChartOption = ChartUtil.initCirclesChart(v.percentage, this.workOrderLanguage[v.orderStatus], StatisticalPercentageColor.singleBackChart);
          }
        });
      } else {
        this.statusChartType = ChartTypeEnum.chart;
        this.defaultStyle();
      }
    }, () => {
      this.statusChartType = ChartTypeEnum.chart;
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
