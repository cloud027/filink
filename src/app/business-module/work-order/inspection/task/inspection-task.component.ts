import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {WorkOrderInitTreeUtil} from '../../share/util/work-order-init-tree.util';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {ActivatedRoute, Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {InspectionTaskOrder} from './inspection-ref-order-table.util';
import {InspectionWorkOrderService} from '../../share/service/inspection';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {InspectionTaskModel} from '../../share/model/inspection-model/inspection-task.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {DeleteInspectionTaskModel} from '../../share/model/inspection-model/delete-inspection-task.model';
import {DepartmentUnitModel} from '../../../../core-module/model/work-order/department-unit.model';
import {FilterValueModel} from '../../../../core-module/model/work-order/filter-value.model';
import {AreaFormModel} from '../../share/model/area-form.model';
import {RoleUnitModel} from '../../../../core-module/model/work-order/role-unit.model';
import {OrderUserModel} from '../../../../core-module/model/work-order/order-user.model';
import {WorkOrderCommonServiceUtil} from '../../share/util/work-order-common-service.util';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {WorkOrderBusinessCommonUtil} from '../../share/util/work-order-business-common.util';
import {EnablePermissionEnum, EnableStatusEnum, InspectionTaskStatusEnum} from '../../share/enum/clear-barrier-work-order.enum';
import {WorkOrderStatusUtil} from '../../../../core-module/business-util/work-order/work-order-for-common.util';
import {UserForCommonService} from '../../../../core-module/api-service/user';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {DeviceFormModel} from '../../../../core-module/model/work-order/device-form.model';
import {WorkOrderClearInspectUtil} from '../../share/util/work-order-clear-inspect.util';
import {ListExportModel} from '../../../../core-module/model/list-export.model';
import {UserRoleModel} from '../../../../core-module/model/user/user-role.model';

/**
 * 巡检任务页面组件
 */
@Component({
  selector: 'app-inspection-task',
  templateUrl: './inspection-task.component.html',
  styleUrls: ['./inspection-task.component.scss'],
})

export class InspectionTaskComponent implements OnInit, OnDestroy {
  // 区域查询
  @ViewChild('areaSearch') areaSearch: TemplateRef<any>;
  // 表格组件
  @ViewChild('tableComponent') tableComponent: TableComponent;
  // 启用状态
  @ViewChild('templateStatus') templateStatusTemp: TemplateRef<any>;
  // 关联工单列中工单状态
  @ViewChild('statusTemp') statusTemp: TemplateRef<any>;
  // 责任单位
  @ViewChild('unitNameSearch') unitNameSearch: TemplateRef<any>;
  // orderUnitNameSearch
  @ViewChild('orderUnitNameSearch') orderUnitNameSearch: TemplateRef<any>;
  // 进度
  @ViewChild('schedule') schedule: TemplateRef<any>;
  // 责任人
  @ViewChild('roleTemp') roleTemp: TemplateRef<any>;
  // 巡检周期
  @ViewChild('taskPeriodPeTemp') taskPeriodPeTemp: TemplateRef<any>;
  // 期待完工用时
  @ViewChild('procPlanDateTemp') procPlanDateTemp: TemplateRef<any>;
  // 设施总数
  @ViewChild('deviceCountTemp') deviceCountTemp: TemplateRef<any>;
  // 设备类型
  @ViewChild('equipTemp') equipTemp: TemplateRef<any>;
  // 设备类型
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<any>;
  // 用户筛选
  @ViewChild('userSearchTemp') public userSearchTemp: TemplateRef<any>;
  // 引入巡检模块国际化
  public language: InspectionLanguageInterface;
  // 巡检工单国际化
  public InspectionLanguage: InspectionLanguageInterface;
  // 区域配置
  public areaSelectorConfig: TreeSelectorConfigModel;
  // 区域过滤
  public areaFilterValue: FilterCondition = {
    filterField: '',
    operator: '',
    filterValue: '',
    filterName: ''
  };
  // 责任单位选中器配置id
  public treeSelectorConfig: TreeSelectorConfigModel;
  // 单位过滤
  public departFilterValue: FilterCondition = {
    filterField: '',
    operator: '',
    filterValue: '',
    filterName: ''
  };
  // 巡检任务列表配置
  public tableConfig: TableConfigModel;
  // 巡检任务列表分页
  public pageBean: PageModel = new PageModel(10, 1, 1);
  // 巡检任务列表分页条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 关联工单列表配置
  public associatedWorkOrderTableConfig: TableConfigModel;
  // 关联工单列表分页
  public associatedWorkOrderPageBean: PageModel = new PageModel(10, 1, 1);
  // 导出参数
  public exportParams: ExportRequestModel = new ExportRequestModel();
  // 巡检任务列表数据
  public tsakDataList: InspectionTaskModel[] = [];
  // 区域名称
  public areaName: string = '';
  // 区域弹框
  public areaSelectVisible: boolean = false;
  public filterValue: FilterCondition;
  // 检验是否有这条数据
  public hasData;
  // 关联工单弹框显示隐藏
  public isAssociatedWorkOrderVisible: boolean = false;
  // 关联工单标题
  public inspectionTaskTitle: string;
  // 关联工单列表数据
  public associatedWorkOrder_dataSet: InspectionTaskModel[] = [];
  // 关联工单单位
  public orderFilterValue: FilterValueModel;
  public selectOrderUnitName: string = '';
  // 关联工单对应的巡检任务id
  public id: string;
  // 关联工单id
  public procId: string;
  // 责任单位的显示隐藏
  public isVisible: boolean = false;
  public isOrderVisible: boolean = false;
  // 选中责任单位名称
  public selectUnitName: string = '';
  // title已完成巡检信息
  public title: string;
  // 责任人存放数组
  public roleArray: RoleUnitModel[] = [];
  // 区域
  public areaList: FilterValueModel = {
    ids: [],
    name: ''
  };
  // 启用枚举
  public Status;
  // 启用code枚举
  public Permission;
  // 巡检对象弹显示隐藏
  public inspectionObjectVisible: boolean = false;
  // 巡检对象参数id
  public inspectObjectId: string = '';
  // 弹框过滤条件
  public filterObj: FilterValueModel = {
    areaName: '',
    areaId: '',
  };
  // 显示隐藏按钮
  public isShowSwitch: boolean = false;
  // 勾选用户
  public checkUserObject: FilterValueModel = new FilterValueModel();
  // 存放用户数据
  public selectUserList: UserRoleModel[] = [];
  // 显示用户选择
  public isShowUserTemp: boolean = false;
  // 用户显示
  private userFilterValue: FilterCondition;
  // 禁用启用
  private disabledOrEnable: string;
  // 选择单位code
  private selectUnitCode: string;
  // 区域数据存放
  private areaNodes: AreaFormModel[] = [];
  // 关联工单分页条件
  private associatedWorkOrderQueryCondition: QueryConditionModel = new QueryConditionModel();
  // 责任单位
  private unitTreeNodes: DepartmentUnitModel[] = [];
  // 巡检周期筛选输入值
  private taskPeriodInputValue: number;
  // 巡检周期筛选默认等于
  private taskPeriodSelectedValue = OperatorEnum.lte;
  // 期待完工用时筛选输入值
  private procPlanDateInputValue: number;
  // 期待完工用时筛选默认等于
  private procPlanDateSelectedValue = OperatorEnum.lte;
  // 设施总数筛选输入值
  private deviceCountInputValue: number;
  // 设施总数筛选默认等于
  private deviceCountSelectedValue = OperatorEnum.lte;
  constructor(public $nzI18n: NzI18nService,
              private $activatedRoute: ActivatedRoute,
              private $router: Router,
              private $message: FiLinkModalService,
              private $userService: UserForCommonService,
              private $workOrderCommonUtil: WorkOrderCommonServiceUtil,
              private $inspectionWorkOrderService: InspectionWorkOrderService,
  ) { }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.InspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    // 初始化任务列表
    InspectionTaskOrder.initTableConfig(this);
    // 初始化关联工单列表
    InspectionTaskOrder.initTableConfigAssociatedWorkOrder(this);
    this.Status = EnableStatusEnum;
    this.Permission = EnablePermissionEnum;
    this.refreshData();
    // 初始化单位树
    WorkOrderInitTreeUtil.initTreeSelectorConfig(this);
    // 初始化区域树
    WorkOrderInitTreeUtil.initAreaSelectorConfig(this);
  }
  public ngOnDestroy(): void {
    this.tableComponent = null;
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
   *获取巡检任务列表
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    // 别的页面跳转过来id拼接
    if ('id' in this.$activatedRoute.snapshot.queryParams) {
      if (!this.queryCondition.filterConditions.some(item => item.filterField === 'optObjId')) {
        this.queryCondition.bizCondition.inspectionTaskIds = [this.$activatedRoute.snapshot.queryParams.id];
      }
    } else {
      this.queryCondition.filterConditions = this.queryCondition.filterConditions.filter(item => item.filterField !== 'optObjId');
    }
    this.$inspectionWorkOrderService.getWorkOrderList(this.queryCondition).subscribe((result: ResultModel<InspectionTaskModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.pageBean.Total = result.totalCount;
        this.pageBean.pageIndex = result.pageNum;
        this.pageBean.pageSize = result.size;
        this.tableConfig.isLoading = false;
        const data = result.data ? result.data : [];
        data.forEach(item => {
          item.inspectionTaskStatus = WorkOrderBusinessCommonUtil.taskStatus(this.$nzI18n, item.inspectionTaskStatus);
          item.inspectionTaskType = WorkOrderBusinessCommonUtil.taskType(this.$nzI18n, item.inspectionTaskType);
          item.isShowEditIcon = item.inspectionTaskStatus !== InspectionTaskStatusEnum.completed;
        });
        this.tsakDataList = result.data;
      } else {
        this.tableConfig.isLoading = false;
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }
  /**
   *巡检任务分页
   * @param event 分页参数
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }
  /**
   * 巡检任务列表筛选
   * 配置文件调用，（灰显勿删！！！）
   */
  private handleSearch(event: InspectionTaskModel): void {
    this.queryCondition.bizCondition = this.setBizCondition(event);
    // 周期
    if (this.taskPeriodInputValue || this.taskPeriodSelectedValue) {
      this.queryCondition.bizCondition.taskPeriod = this.taskPeriodInputValue;
      this.queryCondition.bizCondition.taskPeriodOperate = this.taskPeriodSelectedValue;
    }
    // 期望用时
    if (this.procPlanDateInputValue || this.procPlanDateSelectedValue) {
      this.queryCondition.bizCondition.procPlanDate = this.procPlanDateInputValue;
      this.queryCondition.bizCondition.procPlanDateOperate = this.procPlanDateSelectedValue;
    }
    // 设施总数
    if (this.deviceCountInputValue || this.deviceCountSelectedValue) {
      this.queryCondition.bizCondition.inspectionDeviceCount = this.deviceCountInputValue;
      this.queryCondition.bizCondition.inspectionDeviceCountOperate = this.deviceCountSelectedValue;
    }
    this.queryCondition.pageCondition.pageNum = 1;
  }

  /**
   * 筛选巡检任务列表下拉
   */
  private setBizCondition(event: InspectionTaskModel): InspectionTaskModel {
    const _bizCondition = CommonUtil.deepClone(event);
    if (_bizCondition.inspectionTaskStatus) {
      _bizCondition.inspectionTaskStatusList = CommonUtil.deepClone(_bizCondition.inspectionTaskStatus);
      delete _bizCondition.inspectionTaskStatus;
    }
    if (_bizCondition.startTime) {
      _bizCondition.startTimes = CommonUtil.deepClone(_bizCondition.startTime).map(item => {
        return CommonUtil.getSeconds(item);
      });
      delete _bizCondition.startTime;
    }
    if (_bizCondition.endTime) {
      _bizCondition.endTimes = CommonUtil.deepClone(_bizCondition.endTime).map(item => {
        return CommonUtil.getSeconds(item);
      });
      delete _bizCondition.endTime;
    }
    if (_bizCondition.inspectionTaskType) {
      _bizCondition.inspectionTaskTypes = CommonUtil.deepClone(_bizCondition.inspectionTaskType);
      delete _bizCondition.inspectionTaskType;
    }
    return _bizCondition;
  }
  /**
   * 启用状态点击
   */
  public clickSwitch(data: InspectionTaskModel): void {
    this.isShowSwitch = true;
    const id = [];
    id.push(data.inspectionTaskId);
    this.checkData(id).then((bool) => {
      if (bool === true) {
        const inspectionTaskId = {
          inspectionTaskIds: [data.inspectionTaskId]
        };
        data.clicked = false;
        data.opened === '0' ? this.enableStatus(inspectionTaskId) : this.disableStatus(inspectionTaskId);
        data.clicked = true;
      } else {
        this.$message.error(`${this.language.theInspectionTaskNoLongerExistsTip}`);
        this.refreshData();
      }
    });
  }
  /**
   * 启用状态操作模板
   */
  private enableStatus(id: {inspectionTaskIds: string[]}): void {
    this.$inspectionWorkOrderService.enableInspectionTask(id).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.disabledOrEnable = EnableStatusEnum.enable;
        this.$message.success(this.language.operateMsg.successful);
        this.isShowSwitch = false;
        this.refreshData();
      } else {
        this.isShowSwitch = false;
        this.$message.error(result.msg);
        this.refreshData();
      }
    }, error => {
      this.isShowSwitch = false;
    });
  }
  /**
   * 禁用状态操作模板
   */
  private disableStatus(id: {inspectionTaskIds: string[]}): void {
    this.$inspectionWorkOrderService.disableInspectionTask(id).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.language.operateMsg.successful);
        this.isShowSwitch = false;
        this.refreshData();
      } else {
        this.isShowSwitch = false;
        this.$message.error(result.msg);
        this.refreshData();
      }
    }, error => {
      this.isShowSwitch = false;
    });
  }
  /**
   * 巡检任务删除模板
   * 配置文件调用，（灰显勿删！！！）
   */
  private deleteTemplate(inspectionTask: DeleteInspectionTaskModel): void {
    this.$inspectionWorkOrderService.deleteWorkOrderByIds(inspectionTask).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.language.operateMsg.deleteSuccess);
        // 删除之后返回到第一页
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshData();
      } else {
        this.$message.error(result.msg);
      }
    });
  }
  /**
   *巡检任务 新增、修改跳转
   * 配置文件调用，（灰显勿删！！！）
   */
  private inspectionTaskDetail(type: string, inspectionTaskId?: string, opened?: string, status?: string) {
    return this.$router.navigate([`/business/work-order/inspection/task-detail/${type}`],
      {queryParams: {inspectionTaskId: inspectionTaskId, opened: opened, status: status}});
  }

  /**
   * 巡检任务列表排序
   * 配置文件调用，（灰显勿删！！！）
   */
  private handleSort(event: SortCondition): void {
    this.queryCondition.sortCondition.sortField = event.sortField;
    this.queryCondition.sortCondition.sortRule = event.sortRule;
  }

  /**
   * 巡检任务列表导出
   * 配置文件调用，（灰显勿删！！！）
   */
  private handleExport(event: ListExportModel<InspectionTaskModel[]>): void {
    // 列表生成导出条件
    this.exportParams.queryCondition = this.queryCondition;
    if (event.selectItem.length > 0) {
      this.exportParams.queryCondition.bizCondition.inspectionTaskIds = event.selectItem.map(item => item.inspectionTaskId);
    }
    this.exportParams.excelType = event.excelType;
    // 启用接口导出
    this.$inspectionWorkOrderService.exportInspectionTask(this.exportParams).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.language.operateMsg.exportSuccess);
      } else {
        this.$message.error(result.msg);
      }
    });
  }
  /**
   *关联工单分页
   */
  public pageChangeAssociatedWorkOrder(event: PageModel) {
    this.associatedWorkOrderQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.associatedWorkOrderQueryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshAssociatedWorkOrderData();
  }

  /**
   * 显示关联工单列表数据
   */
  private refreshAssociatedWorkOrderData(): void {
    this.associatedWorkOrderTableConfig.isLoading = true;
    const arr = this.associatedWorkOrderQueryCondition.filterConditions.find(v => {
      return v.filterField === 'inspectionTaskId';
    });
    // 打开弹窗是判断查询条件是否存在id
    if (!arr) {
      // 不存在直接添加id
      this.associatedWorkOrderQueryCondition.filterConditions.push({
        filterValue: this.id,
        filterField: 'inspectionTaskId',
        operator: OperatorEnum.eq,
      });
    } else {
      // 已存在将id替换为当前id
      this.associatedWorkOrderQueryCondition.filterConditions.forEach(v => {
        if (v.filterField === 'inspectionTaskId') {
          v.filterValue = this.id;
        }
      });
    }
    // 判断设施类型和设备类型，替换filterField的值
    this.associatedWorkOrderQueryCondition.filterConditions.forEach(v => {
      if (v.filterField === 'equipmentType') {
        v.operator = OperatorEnum.all;
        v.filterField = 'procRelatedEquipment.equipmentType';
      }
      if (v.filterField === 'deviceType') {
        v.operator = OperatorEnum.in;
        v.filterField = 'procRelatedDevices.deviceType';
      }
      if (v.filterField === 'assign') {
        v.operator = OperatorEnum.in;
      }
    });
    const param = this.associatedWorkOrderQueryCondition;
    this.$inspectionWorkOrderService.getDetailList(param).subscribe((result: ResultModel<InspectionTaskModel[]>) => {
      this.associatedWorkOrderTableConfig.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.associatedWorkOrderPageBean.Total = result.totalCount;
        this.associatedWorkOrderPageBean.pageIndex = result.pageNum;
        this.associatedWorkOrderPageBean.pageSize = result.size;
        this.associatedWorkOrderTableConfig.isLoading = false;
        const data = result.data || [];
        data.forEach(item => {
          item.equipmentTypeList = [];
          item.equipmentTypeName = '';
          // 工单状态
          item.statusName = WorkOrderStatusUtil.getWorkOrderStatus(this.$nzI18n, item.status);
          item.statusClass = WorkOrderStatusUtil.getWorkOrderIconClassName(item.status);
          // 设施名称及class
          if (item.deviceType) {
            item.deviceTypeName = WorkOrderBusinessCommonUtil.deviceTypeNames(this.$nzI18n, item.deviceType);
            item.deviceIcon = CommonUtil.getFacilityIconClassName(item.deviceType);
          }
          // 设备名称及图标class
          if (item.equipmentType) {
            const equip = WorkOrderClearInspectUtil.handleMultiEquipment(item.equipmentType, this.$nzI18n);
            item.equipmentTypeList = equip.equipList;
            item.equipmentTypeName = equip.names.join(',');
          }
        });
        this.associatedWorkOrder_dataSet = result.data;
      }
    }, () => {
      this.associatedWorkOrderTableConfig.isLoading = false;
    });
  }

  /**
   * 隐藏关联工单弹框
   */
  public close(): void {
    this.isAssociatedWorkOrderVisible = false;
    this.associatedWorkOrderPageBean = new PageModel(10, 1, 1);
    this.tableComponent.handleRest();
    this.associatedWorkOrder_dataSet = [];
    this.selectOrderUnitName = '';
    this.associatedWorkOrderTableConfig.showSearch = false;
    this.selectUserList = [];
  }
  /**
   * 区域选择结果
   */
  public areaSelectChange(event: AreaFormModel[]): void {
    if (event && event.length > 0) {
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, event[0].areaId);
      this.areaName = event[0].areaName;
      this.areaFilterValue.filterValue = [event[0].areaId];
      this.areaFilterValue.filterName = event[0].areaName;
    } else {
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, null);
      this.areaName = '';
      this.areaFilterValue.filterValue = null;
      this.areaFilterValue.filterName = '';
    }
  }
  /**
   * 列表设施区域弹框
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
        this.areaNodes = [];
        this.areaNodes = data;
        this.areaSelectorConfig.treeNodes = data;
        FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, null);
        this.areaSelectVisible = true;
      });
    }
  }
  /**
   * 检验数据是否存在
   */
  private checkData(id: string[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.$inspectionWorkOrderService.getWorkOrderList(this.queryCondition).subscribe((result: ResultModel<any>) => {
        for (let j = 0; j < id.length; j++) {
          for (let i = 0; i < result.data.length; i++) {
            if (id[j] === result.data[i].inspectionTaskId) {
              this.hasData = true;
              break;
            } else {
              this.hasData = false;
            }
          }
        }
        resolve(this.hasData);
      }, (error) => {
        reject(error);
      });
    });
  }
  /**
   * 打开区域选择器
   */
  public showAreaSelectorModal(filterValue: FilterCondition): void {
    this.areaFilterValue = filterValue;
    if (!this.filterValue.filterValue) {
      this.filterValue.filterValue = [];
    }
    this.treeSelectorConfig.treeNodes = this.areaNodes;
    this.areaSelectVisible = true;
  }
  /**
   * 打开责任单位选择器
   */
  public showModal(filterValue: FilterCondition): void {
    this.departFilterValue = filterValue;
    if (this.unitTreeNodes.length === 0) {
      this.queryDeptList().then(bool => {
        if (bool) {
          this.filterValue = filterValue;
          if (!this.filterValue.filterValue) {
            this.filterValue.filterValue = [];
          }
          this.treeSelectorConfig.treeNodes = this.unitTreeNodes;
          this.isVisible = true;
        }
      });
    } else {
      this.isVisible = true;
    }
  }
  /**
   * 关联工单责任单位
   */
  public showOrderModal(filterValue: FilterValueModel): void {
    if (this.unitTreeNodes.length > 0) {
      this.isOrderVisible = true;
      this.orderFilterValue = filterValue;
    } else {
      this.queryDeptList().then(bool => {
        if (bool) {
          this.orderFilterValue = filterValue;
          this.treeSelectorConfig.treeNodes = this.unitTreeNodes;
          this.isOrderVisible = true;
        }
      });
    }
  }
  /**
   * 责任单位选择结果
   * @param event 当前单位
   */
  public selectDataChange(event: DepartmentUnitModel[]): void {
    this.selectUnitName = '';
    if (event && event.length > 0) {
      this.selectUnitName = event[0].deptName;
      this.departFilterValue.filterValue = [event[0].deptCode];
      this.selectUnitCode = event[0].deptCode;
      this.departFilterValue.filterName = this.selectUnitName;
      FacilityForCommonUtil.setTreeNodesStatus(this.unitTreeNodes, [event[0].id]);
    }
  }
  /**
   * 关联工单责任单位
   */
  public selectOrderDataChange(event: DepartmentUnitModel[]): void {
    if (event && event.length > 0) {
      this.orderFilterValue.filterValue = event[0].deptCode;
      this.selectOrderUnitName = event[0].deptName;
      FacilityForCommonUtil.setTreeNodesStatus(this.unitTreeNodes, [event[0].id]);
    }
  }
  /**
   * 获得所有的责任单位
   */
  public queryDeptList(): Promise<boolean> {
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
   * (外部列表配置调用，灰显勿删！！)
   */
  private getAllUser(): void {
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
   * 校验数据权限
   * (外部列表配置调用，灰显勿删！！)
   */
  private checkDataRole(id: string): Promise<boolean> {
    const taskIdData = new DeviceFormModel();
    taskIdData.inspectionTaskId = id;
    return new Promise((resolve, reject) => {
      this.$inspectionWorkOrderService.checkTaskData(taskIdData).subscribe((result: ResultModel<string>) => {
        if (result.code === ResultCodeEnum.success) {
          resolve(true);
        } else {
          this.$message.error(result.msg);
          resolve(false);
        }
      }, error => {
        reject(error);
      });
    });
  }
}
