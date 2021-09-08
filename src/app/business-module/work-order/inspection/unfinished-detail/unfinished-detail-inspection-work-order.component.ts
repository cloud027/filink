import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {InspectionOrderDetailUtil} from './inspection-order-detail.util';
import {ActivatedRoute} from '@angular/router';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {NzFormatEmitEvent, NzI18nService} from 'ng-zorro-antd';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {PageModel} from '../../../../shared-module/model/page.model';
import {FilterCondition, QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {InspectionWorkOrderService} from '../../share/service/inspection';
import {InspectionTaskModel} from '../../share/model/inspection-model/inspection-task.model';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {InspectionWorkOrderDetailModel} from '../../share/model/inspection-model/inspection-work-order-detail.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {WorkOrderPageTypeEnum} from '../../share/enum/work-order-page-type.enum';
import {ScrollPageConst} from '../../share/const/work-order.const';
import {RoleUnitModel} from '../../../../core-module/model/work-order/role-unit.model';
import {
  EnableStatusEnum,
  InspectionTaskStatusEnum,
  IsSelectAllEnum,
  ItemIsPassEnum,
  LastDaysIconClassEnum,
  MultiWorkOrder,
  TaskStatusIconEnum,
  WorkOrderNormalAndAbnormalEnum
} from '../../share/enum/clear-barrier-work-order.enum';
import {InspectionReportModel} from '../../share/model/inspection-report.model';
import {FilterValueModel} from '../../../../core-module/model/work-order/filter-value.model';
import {DepartmentUnitModel} from '../../../../core-module/model/work-order/department-unit.model';
import {EquipmentFormModel} from '../../../../core-module/model/work-order/equipment-form.model';
import {WorkOrderBusinessCommonUtil} from '../../share/util/work-order-business-common.util';
import {OrderUserModel} from '../../../../core-module/model/work-order/order-user.model';
import {InspectionReportParamModel} from '../../share/model/inspection-report-param.model';
import {WorkOrderCommonServiceUtil} from '../../share/util/work-order-common-service.util';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {WorkOrderStatusUtil} from '../../../../core-module/business-util/work-order/work-order-for-common.util';
import {UserForCommonService} from '../../../../core-module/api-service/user';
import {WorkOrderStatusEnum} from '../../../../core-module/enum/work-order/work-order-status.enum';
import {WorkOrderStatusClassEnum} from '../../../../core-module/enum/work-order/work-order-status-class.enum';
import {WorkOrderClearInspectUtil} from '../../share/util/work-order-clear-inspect.util';
import {InspectionReportEquipmentModel} from '../../share/model/inspection-model/inspection-report-equipment.model';
import {InspectionReportDeviceModel} from '../../share/model/inspection-model/inspection-report-device.model';
import {InspectionReportItemModel} from '../../share/model/inspection-model/inspection-report-item.model';
import {UserRoleModel} from '../../../../core-module/model/user/user-role.model';

declare const $: any;

/**
 * 巡检工单详情/巡检任务详情/巡检报告
 */
@Component({
  selector: 'app-unfinished-detail',
  templateUrl: './unfinished-detail-inspection-work-order.component.html',
  styleUrls: ['./unfinished-detail-inspection-work-order.component.scss']
})
export class UnfinishedDetailInspectionWorkOrderComponent implements OnInit, OnDestroy {
  // 进度
  @ViewChild('schedule') schedule: TemplateRef<any>;
  // 状态模板
  @ViewChild('statusTemp') statusTemp: TemplateRef<any>;
  // 单位名称选择
  @ViewChild('UnitNameSearch') UnitNameSearch: TemplateRef<any>;
  // 责任人
  @ViewChild('roleTemp') roleTemp: TemplateRef<any>;
  // 是否通过
  @ViewChild('resultTemp') resultTemp: TemplateRef<any>;
  // 设备类型
  @ViewChild('equipTemp') equipTemp: TemplateRef<any>;
  @ViewChild('equipTaskTemp') equipTaskTemp: TemplateRef<any>;
  // 设备类型
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<any>;
  // 用户筛选
  @ViewChild('userSearchTemp') public userSearchTemp: TemplateRef<any>;
  // 国际化
  public InspectionLanguage: InspectionLanguageInterface;
  // 页面title
  public pageTitle: string;
  // 结果集
  public resultData: InspectionWorkOrderDetailModel = new InspectionWorkOrderDetailModel();
  // 巡检项列表
  public device_dataSet: InspectionTaskModel[] = [];
  // 任务列表表单配置
  public deviceTableConfig: TableConfigModel;
  // 任务列表分页
  public devicePageBean: PageModel = new PageModel();
  // 工单列表
  public order_dataSet: InspectionTaskModel[] = [];
  // 工单表单配置
  public orderTableConfig: TableConfigModel;
  // 工单列表分页
  public orderPageBean: PageModel = new PageModel();
  // 页面类型
  public pageType: string;
  // 树组件
  public unitTreeConfig: TreeSelectorConfigModel;
  // 单位选择器筛选
  public responsibleUnitIsVisible: boolean = false;
  // 单位名称
  public selectUnitName: string;
  // 工单表格
  public orderTable: boolean = false;
  // 巡检表格
  public inspectTable: boolean = false;
  // 巡检报告
  public showReport: boolean = false;
  // 报告筛选
  public searchValue: string = '';
  // loading
  public isSpinning: boolean = true;
  // 筛选结果
  public resultOptions: InspectionReportDeviceModel[] = [];
  // 报告树数据
  public reportNodes: InspectionReportDeviceModel[] = [];
  // 表格配置
  public reportTableConfig: TableConfigModel;
  public reportDataSet: InspectionReportItemModel[] = [];
  public reportPageBean: PageModel = new PageModel();
  // 表格title
  public tableTitle: string = '';
  // 设施列表显示
  public deviceVisible: boolean = false;
  // 设施列表数据
  public inspectDeviceDataSet: InspectionReportItemModel[] = [];
  // 设施列表分页
  public inspectDevicePageBean: PageModel = new PageModel();
  // 设施表格配置
  public inspectDeviceTableConfig: TableConfigModel;
  // 设备列表显示
  public equipVisible: boolean = false;
  // 设备列表数据
  public equipDataSet: EquipmentFormModel[] = [];
  // 设备表格配置
  public equipTableConfig: TableConfigModel;
  // 设备模块高度
  public equipHeight: string = '';
  // 工单详情第三列模块高度
  public modalHeight = {
    timeHeight: '110px',
    remarkHeight: '140px'
  };
  // 默认展开节点
  public isExpand: boolean = false;
  // 页面来源类型
  public pageTypeDetail = WorkOrderPageTypeEnum;
  // 勾选用户
  public checkUserObject: FilterValueModel = new FilterValueModel();
  // 存放用户数据
  public selectUserList: UserRoleModel[] = [];
  // 显示用户选择
  public isShowUserTemp: boolean = false;
  // 用户显示
  private userFilterValue: FilterCondition;
  // 查询条件
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // 任务id
  private inspectionTaskId: string;
  // 点击次数
  private clickNum: number = 0;
  // 按钮名称
  private btnName: string;
  // 树节点
  private unitsTreeNodes: DepartmentUnitModel[] = [];
  // 过滤条件
  private filterValue: FilterValueModel;
  // 获取责任人数据
  private roleArray: RoleUnitModel[] = [];
  // 滚动加载页码
  private scrollIndex: number = ScrollPageConst.index;
  // 滚动加载每页大小
  private scrollSize: number = ScrollPageConst.size;
  // 查询条件
  private deviceQueryCondition: QueryConditionModel = new QueryConditionModel();
  constructor(
    private $activatedRoute: ActivatedRoute,
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $userForCommonService: UserForCommonService,
    private $workOrderCommonUtil: WorkOrderCommonServiceUtil,
    private $inspectionWorkOrderService: InspectionWorkOrderService,
  ) { }

  public ngOnInit(): void {
    this.InspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.btnName = this.InspectionLanguage.handleCancel;
    // 初始化设施表格
    InspectionOrderDetailUtil.initInspectDeviceTable(this);
    // 初始化设备表格
    InspectionOrderDetailUtil.initEquipmentTable(this);
    this.judgePageJump();
    this.treeSelectConfigLoad();
  }
  public ngOnDestroy(): void {
    // 移除容器滚动事件
    $('#tree-warp').off('scroll');
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
   * 判断页面跳转
   */
  private judgePageJump(): void {
    this.$activatedRoute.queryParams.subscribe(params => {
      this.pageType = params.status;
      this.inspectionTaskId = params.inspectionTaskId;
      if (this.pageType === WorkOrderPageTypeEnum.taskView) {
        // 巡检任务
        this.inspectTable = true;
        this.pageTitle = this.InspectionLanguage.inspectionInfo;
        this.tableTitle = this.InspectionLanguage.patrolInspectionSheet;
        // 初始化任务工单表格
        InspectionOrderDetailUtil.initTaskOrderTable(this);
        this.getTaskFormData(params.inspectionTaskId);
        this.refreshData();
      } else if (this.pageType === WorkOrderPageTypeEnum.unfinishedView) {
        // 未完成巡检工单
        this.inspectionTaskId = params.procId;
        this.equipHeight = '118px';
        this.orderTable = true;
        this.modalHeight = { timeHeight: '110px', remarkHeight: '140px' };
        this.pageTitle = `${this.InspectionLanguage.inspection}${this.InspectionLanguage.inspectionDetail}`;
        this.tableTitle = this.InspectionLanguage.completeInspectionInformation;
        // 初始化表格
        InspectionOrderDetailUtil.initOrderTable(this);
        this.getUnfinishedData(params.procId);
        this.refreshOrderData();
      } else if (this.pageType === WorkOrderPageTypeEnum.finished) {
        // 已完成工单详情
        this.equipHeight = '82px';
        this.orderTable = true;
        this.modalHeight = { timeHeight: '140px', remarkHeight: '110px' };
        this.inspectionTaskId = params.procId;
        this.pageTitle = `${this.InspectionLanguage.inspection}${this.InspectionLanguage.inspectionDetail}`;
        this.tableTitle = this.InspectionLanguage.completeInspectionInformation;
        // 初始化表格
        InspectionOrderDetailUtil.initOrderTable(this);
        this.getFinishedOrderData(params.procId);
        this.refreshOrderData();
      } else if (this.pageType === WorkOrderPageTypeEnum.checkList) {
        // 巡检报告
        this.showReport = true;
        this.inspectionTaskId = params.procId;
        this.pageTitle = this.InspectionLanguage.inspectReport;
        InspectionOrderDetailUtil.initReportTable(this);
        this.getReportDeviceList();
      }
    });
  }

  /**
   * 获取任务详情表单数据
   */
  private getTaskFormData(id: string): void {
    this.$inspectionWorkOrderService.getInspectionDetail(id).subscribe((result: ResultModel<InspectionWorkOrderDetailModel>) => {
      if (result.code === ResultCodeEnum.success) {
        const data = result.data;
        // 启用/禁用
        data.openStatus = this.InspectionLanguage[WorkOrderBusinessCommonUtil.getEnumKey(data.opened, EnableStatusEnum)];
        data.createTime = WorkOrderBusinessCommonUtil.formatterDate(data.createDate);
        data.taskStartTime = WorkOrderBusinessCommonUtil.formatterDate(data.startTime);
        data.taskEndTime = WorkOrderBusinessCommonUtil.formatterDate(data.endTime);
        data.assignName = '';
        // 多工单
        data.multiWorkOrder = this.InspectionLanguage[WorkOrderBusinessCommonUtil.getEnumKey(data.isMultipleOrder, IsSelectAllEnum)];
        data.multiClass = MultiWorkOrder[WorkOrderBusinessCommonUtil.getEnumKey(data.isMultipleOrder, IsSelectAllEnum)];
        data.lastDays = Math.floor(data.procPlanDate ? data.procPlanDate : 0);
        this.checkLastDay(data);
        for (const k in InspectionTaskStatusEnum) {
          if (k && InspectionTaskStatusEnum[k] === data.inspectionTaskStatus) {
            data.statusName = this.InspectionLanguage[k];
            data.statusClass = TaskStatusIconEnum[k];
            break;
          }
        }
        data.title = data.inspectionTaskName;
        data.inspectionTaskType = this.InspectionLanguage.routineInspection;
        this.resultData = data;
        if (data.equipmentList && data.equipmentList.length > 0) {
          const list = [];
          const equipList = [];
          data.equipmentList.forEach(v => {
            if (list.indexOf(v.equipmentType) === -1) {
              list.push(v.equipmentType);
              equipList.push({
                equipmentTypeName: WorkOrderBusinessCommonUtil.equipTypeNames(this.$nzI18n, v.equipmentType),
                equipIcon: CommonUtil.getEquipmentIconClassName(v.equipmentType)
              });
            }
          });
          this.equipDataSet = equipList;
        }
      }
    });
  }

  /**
   * 获取未完成工单详情表单数据
   */
  private getUnfinishedData(id: string): void {
    this.$inspectionWorkOrderService.getUnfinishedDetail(id).subscribe((result: ResultModel<InspectionWorkOrderDetailModel>) => {
      if (result.code === ResultCodeEnum.success) {
        const data = result.data;
        data.createTime = WorkOrderBusinessCommonUtil.formatterDate(data.createTime);
        data.orderStartTime = WorkOrderBusinessCommonUtil.formatterDate(data.inspectionStartTime);
        data.orderEndTime = WorkOrderBusinessCommonUtil.formatterDate(data.expectedCompletedTime);
        data.statusName = this.InspectionLanguage[WorkOrderStatusEnum[data.status]];
        data.statusClass = WorkOrderStatusClassEnum[data.status];
        if (data.lastDays || data.lastDays === 0) {
          data.lastDays = Number(data.lastDays ? data.lastDays : 0);
        } else {
          data.lastDays = 0;
        }
        this.checkLastDay(data);
        data.equipmentDetailList = [];
        if (data.equipmentType) {
          const list = data.equipmentType.split(',');
          for (let i = 0; i < list.length; i++) {
            const item = {
              name: WorkOrderBusinessCommonUtil.equipTypeNames(this.$nzI18n, list[i]),
              iconClass: CommonUtil.getEquipmentIconClassName(list[i]),
            };
            data.equipmentDetailList.push(item);
          }
        }
        if (data.deviceType) {
          data.deviceName = WorkOrderBusinessCommonUtil.deviceTypeNames(this.$nzI18n, data.deviceType);
          data.deviceIcon = CommonUtil.getFacilityIconClassName(data.deviceType);
        }
        this.resultData = result.data;
      }
    });
  }

  /**
   * 已完工详情
   */
  private getFinishedOrderData(id: string): void {
    this.$inspectionWorkOrderService.getFinishedDetail(id).subscribe((result: ResultModel<InspectionWorkOrderDetailModel>) => {
      if (result.code === ResultCodeEnum.success) {
        const data = result.data;
        data.createTime = WorkOrderBusinessCommonUtil.formatterDate(data.createTime);
        data.orderStartTime = WorkOrderBusinessCommonUtil.formatterDate(data.inspectionStartTime);
        data.orderEndTime = WorkOrderBusinessCommonUtil.formatterDate(data.expectedCompletedTime);
        data.realityCompletedTime = WorkOrderBusinessCommonUtil.formatterDate(data.realityCompletedTime);
        data.statusClass = WorkOrderStatusClassEnum[data.status];
        data.statusName = this.InspectionLanguage[WorkOrderStatusEnum[data.status]];
        data.equipmentDetailList = [];
        if (data.equipmentType) {
          const equip = WorkOrderClearInspectUtil.handleMultiEquipment(data.equipmentType, this.$nzI18n);
          data.equipmentDetailList = equip.equipList;
        }
        if (data.deviceType) {
          data.deviceName = WorkOrderBusinessCommonUtil.deviceTypeNames(this.$nzI18n, data.deviceType);
          data.deviceIcon = CommonUtil.getFacilityIconClassName(data.deviceType);
        }
        this.resultData = result.data;
      }
    });
  }

  /**
   * 判断剩余天数
   * @param data 结果集
   */
  private checkLastDay(data: InspectionWorkOrderDetailModel): void {
    if (data.lastDays >= 1 && data.lastDays <= 3) {
      data.latsDayClass = LastDaysIconClassEnum.lastDay_1;
    } else if (data.lastDays > 3) {
      data.latsDayClass = LastDaysIconClassEnum.lastDay_2;
    } else {
      data.latsDayClass = LastDaysIconClassEnum.lastDay_3;
    }
  }
  /**
   * 返回
   */
  public goBack(): void {
    window.history.back();
  }

  /***
   *  分页显示
   *  @param event 分页参数
   */
  public devicePageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 刷新及初始化任务详情工单表格数据
   */
  private refreshData(): void {
    this.deviceTableConfig.isLoading = true;
    this.filterRequestParam();
    this.$inspectionWorkOrderService.getDetailList(this.queryCondition).subscribe((result: ResultModel<InspectionTaskModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        const data = result.data || [];
        this.devicePageBean.Total = result.totalCount;
        this.devicePageBean.pageIndex = result.pageNum;
        this.devicePageBean.pageSize = result.size;
        this.deviceTableConfig.isLoading = false;
        data.forEach(item => {
          // 设施类型
          if (item.deviceType) {
            item.deviceTypeName = WorkOrderBusinessCommonUtil.deviceTypeNames(this.$nzI18n, item.deviceType);
            if (item.deviceTypeName) {
              item.deviceIcon = CommonUtil.getFacilityIconClassName(item.deviceType);
            } else {
              item.deviceIcon = '';
            }
          }
          item.statusName = WorkOrderStatusUtil.getWorkOrderStatus(this.$nzI18n, item.status);
          item.statusClass = WorkOrderStatusUtil.getWorkOrderIconClassName(item.status);
          // 设备类型
          item.equipmentTypeList = [];
          item.equipmentTypeName = '';
          if (item.equipmentType) {
            const equip = WorkOrderClearInspectUtil.handleMultiEquipment(item.equipmentType, this.$nzI18n);
            item.equipmentTypeList = equip.equipList;
            item.equipmentTypeName = equip.names.join(',');
          }
        });
        this.device_dataSet = data;
      }
    }, () => {
      this.deviceTableConfig.isLoading = false;
    });
  }

  /**
   * 参数过滤
   */
  private filterRequestParam(): void {
    const arr = this.queryCondition.filterConditions.find(item => {
      return item.filterField === 'inspectionTaskId';
    });
    this.queryCondition.filterConditions.forEach(v => {
      if (v.filterField === 'progressSpeed') {
        v.operator = OperatorEnum.lte;
      }
      if (v.filterField === 'assign') {
        v.operator = OperatorEnum.in;
      }
      if (v.filterField === 'equipmentType') {
        v.operator = OperatorEnum.all;
        v.filterField = 'procRelatedEquipment.equipmentType';
      }
      if (v.filterField === 'deviceType') {
        v.operator = OperatorEnum.in;
        v.filterField = 'procRelatedDevices.deviceType';
      }
    });
    if (!arr) {
      this.queryCondition.filterConditions.push({
        filterValue: this.inspectionTaskId,
        filterField: 'inspectionTaskId',
        operator: OperatorEnum.eq,
      });
    } else {
      this.queryCondition.filterConditions.forEach(v => {
        if (v.filterField === 'inspectionTaskId') {
          v.filterValue = this.inspectionTaskId;
        }
      });
    }
  }


  /**
  * 查看关联图片
  * @param procId 工单id
   * （外部列表配置调用，灰显勿删！！）
  */
  private getPicUrlByAlarmIdAndDeviceId(data: InspectionTaskModel): void {
    this.$workOrderCommonUtil.queryImageForView(data.deviceId, data.procId);
  }

  /**
   * 工单列表数据
   */
  private refreshOrderData(): void {
    this.orderTableConfig.isLoading = true;
    const arr = this.queryCondition.filterConditions.find(v => {
      return v.filterField === 'procId';
    });
    if (!arr) {
      this.queryCondition.filterConditions.push({
        filterField: 'procId',
        operator: OperatorEnum.eq,
        filterValue: this.inspectionTaskId
      });
    }
    this.queryCondition.filterConditions.forEach(v => {
      if (v.filterField === 'procRelatedDevices.assign') {
        v.operator = OperatorEnum.in;
      }
    });
    this.$inspectionWorkOrderService.getUnfinishedCompleteList(this.queryCondition).subscribe((result: ResultModel<InspectionTaskModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.orderPageBean.Total = result.totalCount;
        this.orderPageBean.pageSize = result.size;
        this.orderPageBean.pageIndex = result.pageNum;
        result.data.forEach(item => {
          if (item.result === IsSelectAllEnum.deny) {
            item.result = this.InspectionLanguage[WorkOrderNormalAndAbnormalEnum.normal];
          } else if (item.result === IsSelectAllEnum.right) {
            item.result = this.InspectionLanguage[WorkOrderNormalAndAbnormalEnum.abnormal];
          }
        });
        this.order_dataSet = result.data;
        this.orderTableConfig.isLoading = false;
      }
    }, () => {
      this.orderTableConfig.isLoading = false;
    });
  }

  /**
   * 工单表格分页
   * @param event 分页参数
   */
  public orderPageChange(event: PageModel) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshOrderData();
  }

  /**
   * 打开责任单位选择器
   */
  public showModal(filterValue: FilterValueModel): void {
    if (this.unitsTreeNodes.length === 0) {
      this.$userForCommonService.queryAllDepartment().subscribe((result: ResultModel<DepartmentUnitModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.unitsTreeNodes = result.data || [];
          this.filterValue = filterValue;
          if (!this.filterValue['filterValue']) {
            this.filterValue['filterValue'] = [];
          }
          this.unitTreeConfig.treeNodes = result.data;
          this.responsibleUnitIsVisible = true;
        }
      });
    } else {
      this.responsibleUnitIsVisible = true;
    }
  }
  /**
   * 初始化单位选择器配置
   */
  private treeSelectConfigLoad(): void {
    this.unitTreeConfig = {
      title: '',
      width: '400px',
      height: '300px',
      treeNodes: this.unitsTreeNodes,
      treeSetting: {
        check: { enable: true, chkStyle: 'radio', radioType: 'all' },
        data: {
          simpleData: { enable: true, idKey: 'id', pIdKey: 'deptFatherId', rootPid: null },
          key: { name: 'deptName', children: 'childDepartmentList' },
        },
        view: { showIcon: false, showLine: false }
      },
      onlyLeaves: false,
      selectedColumn: []
    };
  }
  /**
   * 部门筛选选择结果
   * @param event 选择行数据
   */
  public departmentSelectDataChange(event: DepartmentUnitModel[]): void {
    this.selectUnitName = '';
    if (event && event.length > 0) {
      this.selectUnitName = event[0].deptName;
      this.filterValue.filterValue = event[0].deptCode;
      this.filterValue.areaName = event[0].deptName;
      this.filterValue.areaId = event[0].deptCode;
      FacilityForCommonUtil.setTreeNodesStatus(this.unitsTreeNodes, [event[0].id]);
    }
  }
  /**
   * 获得所有的责任人
   * 外部列表配置调用，（灰显勿删！！！）
   */
  private getAllUnitUser(): void {
    this.$inspectionWorkOrderService.getDepartUserList().subscribe((result: ResultModel<OrderUserModel[]>) => {
      const roleArr = result.data;
      if (roleArr) {
        roleArr.forEach(item => {
          this.roleArray.push({'label': item.userName, 'value': item.id});
        });
      }
    });
  }

  /**
   * 报告筛选
   */
  public onInputValue(event: string): void {
    const value = CommonUtil.trim(event);
    if (value) {
      this.resultOptions = [];
      this.reportNodes.forEach(v => {
        if (v.title.indexOf(value) > -1) {
          this.resultOptions.push(v);
        }
        if (v.children) {
          v.children.forEach(item => {
            if (item.title.indexOf(value) > -1) {
              this.resultOptions.push(item);
            }
          });
        }
      });
    } else {
      return;
    }
  }

  /**
   * 筛选结果
   * @param data 行数据
   */
  public changeResult(data: InspectionReportEquipmentModel): void {
    this.searchValue = data.title;
    // 刷新表格查询设备
    const param = new InspectionReportParamModel();
    param.procId = this.inspectionTaskId;
    param.deviceId = data.deviceId;
    param.equipmentId = data.equipmentId;
    this.refreshReportData(param);
  }
  /**
   * 打开checklist
   */
  private getReportDeviceList(): void {
    const param = new InspectionReportParamModel();
    param.procId = this.inspectionTaskId;
    param.deviceName = this.searchValue;
    param.pageNum = this.scrollIndex;
    param.pageSize = this.scrollSize;
    this.$inspectionWorkOrderService.getDeviceList(param).subscribe((result: ResultModel<InspectionReportModel>) => {
      if (result.code === ResultCodeEnum.success) {
        const res = result.data.procRelatedDevices;
        // 返回结果为空的时候
        if (res && res.length === 0 && this.scrollIndex > 1) {
          this.scrollIndex--;
        }
        const list = res || [];
        list.forEach((v, i) => {
          v.key = v.deviceId;
          v.title = v.deviceName;
          if (v.equipment && v.equipment.length > 0) {
            v.equipment.forEach((item, j) => {
              item.key = item.equipmentId;
              item.title = item.equipmentName;
              item.deviceId = v.deviceId;
              item.isLeaf = true;
            });
          }
          v.children = v.equipment;
        });
        this.reportNodes = this.reportNodes.concat(list);
        // 页码为第一页时，给容器绑定滚动事件
        /*if (this.scrollIndex === 1) {
          this.initScrollLoad();
        }*/
        this.initScrollLoad();
        this.isSpinning = false;
      }
    }, error => {
      this.isSpinning = false;
    });
    $('.ant-table-scroll').height(410);
  }
  /**
   * 初始化滚动加载
   */
  private initScrollLoad(): void {
    const that = this;
    let flag = true;
    $('#tree-warp').off('scroll').on('scroll', function(e) {
      const timer = setTimeout(function() {
        const event = e;
        const domHeight = $(event.target)[0].clientHeight;
        const topHeight = event.target.scrollTop;
        const scrollHeight = event.target.scrollHeight;
        // 判断触发条件页码+1，滚动高度大于容器高度，且已滚动上部高度加上容器高度等于容器滚动高度
        if (flag && scrollHeight > domHeight && (topHeight + domHeight === scrollHeight)) {
          flag = false;
          that.scrollIndex++;
          that.getReportDeviceList();
        }
        clearTimeout(timer);
      }, 1000);
    });
  }
  /**
   * 节点选择
   */
  public clickNodes(event: NzFormatEmitEvent): void {
    const data = event.node.origin;
    this.searchValue = '';
    this.resultOptions = [];
    if (this.clickNum === 0) {
      this.clickNum = 1;
    } else {
      this.isExpand = true;
    }
    if (data) {
      if (data.equipmentId) {
        const param = new InspectionReportParamModel();
        param.procId = this.inspectionTaskId;
        param.deviceId = data.deviceId;
        param.equipmentId = data.equipmentId;
        this.refreshReportData(param);
      } else {
        const param = new InspectionReportParamModel();
        param.procId = this.inspectionTaskId;
        param.deviceId = data.deviceId;
        this.refreshReportData(param);
      }
    }
  }
  /**
   * 报告表格分页
   * @param event 分页参数
   */
  public reportPageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshReportData();
  }

  /**
   * 获取报告表格数据
   */
  private refreshReportData(data?: InspectionReportParamModel): void {
    this.reportTableConfig.isLoading = true;
    this.$inspectionWorkOrderService.getEquipmentList(data).subscribe((result: ResultModel<InspectionReportItemModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        const list = result.data || [];
        list.forEach(v => {
          if (v.inspectionValue === ItemIsPassEnum.pass) {
            v.statusName = this.InspectionLanguage.passed;
            v.statusClass = 'iconfont icon-fiLink fiLink-success';
          } else if (v.inspectionValue === ItemIsPassEnum.unPass) {
            v.statusName = this.InspectionLanguage.notPass;
            v.statusClass = 'iconfont icon-fiLink fiLink-fail';
          } else {
            v.statusName = '';
            v.statusClass = '';
          }
        });
        this.reportDataSet = list;
        this.reportTableConfig.isLoading = false;
      }
    }, () => {
      this.reportTableConfig.isLoading = false;
    });
  }

  /**
   * 显示设施弹窗表格
   */
  public showDeviceTable(): void {
    this.deviceVisible = true;
    this.getDeviceTabListData();
  }

  /**
   * 获取设施列表数据
   */
  private getDeviceTabListData(): void {
    this.inspectDeviceDataSet = [];
    this.inspectDeviceTableConfig.isLoading = true;
    const obj = this.deviceQueryCondition.filterConditions.find(v => {
        return v.filterField === 'inspectionTaskId';
    });
    if (!obj) {
      this.deviceQueryCondition.filterConditions.push({
        filterField: 'inspectionTaskId',
        operator: OperatorEnum.eq,
        filterValue: this.inspectionTaskId
      });
    }
    this.$inspectionWorkOrderService.queryInspectionDeviceList(this.deviceQueryCondition).subscribe((result: ResultModel<InspectionReportItemModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.inspectDevicePageBean.Total = result.totalCount;
        this.inspectDevicePageBean.pageIndex = result.pageNum;
        this.inspectDevicePageBean.pageSize = result.size;
        const list = result.data || [];
        this.inspectDeviceDataSet = list;
        this.inspectDeviceTableConfig.isLoading = false;
      }
    }, () => {
      this.inspectDeviceTableConfig.isLoading = false;
    });
  }
  /**
   * 关闭弹窗
   */
  public handleCancel(type: number): void {
    if (type === 1) {
      this.deviceVisible = false;
    } else if (type === 2) {
      this.equipVisible = false;
    }
  }

  /**
   * 表格分页
   * @param event 分页参数
   */
  public inspectDevicePageChange(event: PageModel): void {
    this.deviceQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.deviceQueryCondition.pageCondition.pageSize = event.pageSize;
    this.getDeviceTabListData();
  }
  /**
   * 显示设备弹窗表格
   */
  public showEquipmentTable(): void {
    this.equipVisible = true;
  }
}
