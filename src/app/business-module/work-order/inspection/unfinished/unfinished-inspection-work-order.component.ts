import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {WorkOrderInitTreeUtil} from '../../share/util/work-order-init-tree.util';
import {UnfinishedInspectionTableUtil} from './unfinished-inspection-table.util';
import {NzI18nService, NzModalService, NzTreeNode} from 'ng-zorro-antd';
import {PageModel} from '../../../../shared-module/model/page.model';
import {ActivatedRoute, Router} from '@angular/router';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {InspectionWorkOrderService} from '../../share/service/inspection';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {IndexMissionService} from '../../../../core-module/mission/index.mission.service';
import {WorkOrderLanguageInterface} from '../../../../../assets/i18n/work-order/work-order.language.interface';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {InspectionWorkOrderModel} from '../../../../core-module/model/work-order/inspection-work-order.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {FilterValueModel} from '../../../../core-module/model/work-order/filter-value.model';
import {ClearBarrierOrInspectEnum, IsSelectAllEnum, LastDayColorEnum, WorkOrderNormalAndAbnormalEnum} from '../../share/enum/clear-barrier-work-order.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {WorkOrderPageTypeEnum} from '../../share/enum/work-order-page-type.enum';
import {DepartmentUnitModel} from '../../../../core-module/model/work-order/department-unit.model';
import {RoleUnitModel} from '../../../../core-module/model/work-order/role-unit.model';
import {InspectionTaskModel} from '../../share/model/inspection-model/inspection-task.model';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {AreaFormModel} from '../../share/model/area-form.model';
import {AssignDepartmentModel} from '../../share/model/assign-department.model';
import {AreaDeviceParamModel} from '../../../../core-module/model/work-order/area-device-param.model';
import {TransferOrderParamModel} from '../../share/model/clear-barrier-model/transfer-order-param.model';
import {OrderUserModel} from '../../../../core-module/model/work-order/order-user.model';
import {WorkOrderBusinessCommonUtil} from '../../share/util/work-order-business-common.util';
import {WorkOrderCommonServiceUtil} from '../../share/util/work-order-common-service.util';
import {WorkOrderStatusUtil} from '../../../../core-module/business-util/work-order/work-order-for-common.util';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {UserForCommonService} from '../../../../core-module/api-service/user';
import {WorkOrderStatusEnum} from '../../../../core-module/enum/work-order/work-order-status.enum';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {RepairOrderStatusCountModel} from '../../share/model/clear-barrier-model/repair-order-status-count.model';
import {SliderCardConfigModel} from '../../share/model/slider-card-config-model';
import {SelectModel} from '../../../../shared-module/model/select.model';
import {WorkOrderClearInspectUtil} from '../../share/util/work-order-clear-inspect.util';
import {ClearBarrierWorkOrderModel} from '../../../../core-module/model/work-order/clear-barrier-work-order.model';
import {WebsocketMessageModel} from '../../../../core-module/model/websocket-message.model';
import {ChannelCode} from '../../../../core-module/enum/channel-code';
import {NativeWebsocketImplService} from '../../../../core-module/websocket/native-websocket-impl.service';
import {UserRoleModel} from '../../../../core-module/model/user/user-role.model';

/**
 * 未完工巡检工单
 */
@Component({
  selector: 'app-unfinished-inspection-work-order',
  templateUrl: './unfinished-inspection-work-order.component.html',
  styleUrls: ['./unfinished-inspection-work-order.component.scss']
})
export class UnfinishedInspectionWorkOrderComponent implements OnInit, OnDestroy {
  // 进度表格
  @ViewChild('scheduleTable') scheduleTable: TableComponent;
  // 状态模板
  @ViewChild('statusTemp') statusTemp: TemplateRef<any>;
  // 进度
  @ViewChild('schedule') schedule: TemplateRef<any>;
  // 单位名称选择
  @ViewChild('UnitNameSearch') UnitNameSearch: TemplateRef<any>;
  // 退单重新生成底部
  @ViewChild('footerTemp') footerTemp: TemplateRef<any>;
  // 工单模板
  @ViewChild('workTable') workTable: TableComponent;
  // 责任人
  @ViewChild('roleTemp') roleTemp: TemplateRef<any>;
  // 退单modal
  @ViewChild('SingleBackTemp') SingleBackTemp: TemplateRef<any>;
  // 区域查询
  @ViewChild('AreaSearch') areaSearch: TemplateRef<any>;
  // 设施表格
  @ViewChild('deviceTable') deviceTable: TemplateRef<any>;
  // 设施图标
  @ViewChild('deviceTemp') deviceTemp: TemplateRef<any>;
  // 设备类型
  @ViewChild('equipTemp') equipTemp: TemplateRef<any>;
  // 用户筛选
  @ViewChild('userSearchTemp') userSearchTemp: TemplateRef<any>;
  // 关联工单用户选择
  @ViewChild('refUserSearchTemp') refUserSearchTemp: TemplateRef<any>;
  // 已完成巡检信息列表
  public isVisible: boolean = false;
  // title已完成巡检信息
  public title: string;
  // 显示表格
  public isShowTable: boolean = false;
  // 未完工列表数据存放
  public tableDataSet: InspectionWorkOrderModel[] = [];
  // 进度列表数据存放
  public schedule_dataSet: InspectionTaskModel[] = [];
  // 未完工列表分页
  public pageBean: PageModel = new PageModel();
  // 进度列表分页
  public schedulePageBean: PageModel = new PageModel();
  // 未完工列表表单配置
  public tableConfig: TableConfigModel;
  // 已完成列表表单配置
  public scheduleTableConfig: TableConfigModel;
  // 国际化
  public InspectionLanguage: InspectionLanguageInterface;
  // 责任人单位
  public isUnitVisible: boolean = false;
  public treeSelectorConfig: TreeSelectorConfigModel;
  // 单位过滤
  public departFilterValue: FilterCondition = {
    filterField: '',
    operator: '',
    filterValue: '',
    filterName: ''
  };
  // 退单ID
  public returnID: string;
  // 单位选择器筛选
  public responsibleUnitIsVisible: boolean = false;
  // 单位名称
  public selectUnitName: string;
  // 进度弹框
  public scheduleIsVisible: boolean;
  // 区域选择器配置
  public areaSelectorConfig: TreeSelectorConfigModel;
  // 控制区域显示隐藏
  public areaSelectVisible: boolean = false;
  // 区域过滤
  public areaFilterValue: FilterCondition = {
    filterField: '',
    operator: '',
    filterValue: '',
    filterName: ''
  };
  // 弹框过滤条件
  public filterObj: FilterValueModel = {
    areaName: '',
    areaId: '',
  };
  public  workOrderLanguage: WorkOrderLanguageInterface;
  // 树参数
  public searchValue: string = '';
  // 全部未完成工单数目
  public totalCount: number;
  // 指派单位显示隐藏
  public assignVisible: boolean = false;
  // 卡片配置
  public sliderConfig: SliderCardConfigModel[] = [];
  // 显示转派弹窗
  public isShowTransModal: boolean = false;
  // 列表数据
  public transModalData: TransferOrderParamModel;
  // 单位树配置
  public assignTreeSelectorConfig: TreeSelectorConfigModel;
  // 工单状态列表
  public workOrderList: SelectModel[] = [];
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
  // 区分分页
  private pagesChange: string;
  // 查询条件
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // 弹窗查询条件
  private finishQueryCondition: QueryConditionModel = new QueryConditionModel();
  // 退单确认modal (弹窗组件暂无模型)
  private singleBackConfirmModal;
  // 卡片切换时数据 （卡片暂无模型）
  private slideShowChangeData;
  // 今日新增
  private increaseAddCount: number = 0;
  // 有无数据
  private isNoData: boolean = false;
  // 过滤参数
  private filterValue: FilterCondition;
  // 区域数据
  private areaNodes: AreaFormModel[] = [];
  // 获取责任人数据
  private roleArray: RoleUnitModel[] = [];
  // 撤回ID
  private withdrawID: string;
  // 导出 （配置文件调用，灰显勿删！！）
  private exportParams: ExportRequestModel = new ExportRequestModel();
  // 树节点
  private unitTreeNodes: DepartmentUnitModel[] = [];
  // 工单类型
  private status: string;
  // 区域ID
  private procId: string;
  // 已完成工单ID （配置文件调用，灰显勿删！！）
  private completedWorkOrderID: string;
  // 指派单位数据
  private assignTreeNode: NzTreeNode[] = [];
  // 推送服务
  private webSocketInstance;

  constructor(
    private $nzI18n: NzI18nService,
    private $router: Router,
    public $message: FiLinkModalService,
    private $activatedRoute: ActivatedRoute,
    private $indexMissionService: IndexMissionService,
    private $modal: NzModalService,
    private $userService: UserForCommonService,
    private $workOrderCommonUtil: WorkOrderCommonServiceUtil,
    private $inspectionWorkOrderService: InspectionWorkOrderService,
    private $facilityForCommonService: FacilityForCommonService,
    private $wsService: NativeWebsocketImplService
  ) { }
  public ngOnInit(): void {
    this.workOrderLanguage = this.$nzI18n.getLocaleData(LanguageEnum.workOrder);
    this.InspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    // 过滤已完工状态
    (WorkOrderStatusUtil.getWorkOrderStatusList(this.$nzI18n)).forEach(v => {
      if (v.value !== WorkOrderStatusEnum.completed) {
        this.workOrderList.push(v);
      }
    });
    // 未完工列表
    UnfinishedInspectionTableUtil.initUnfinishedTable(this);
    // 单位树
    WorkOrderInitTreeUtil.initTreeSelectorConfig(this);
    // 进度已完工列表
    UnfinishedInspectionTableUtil.scheduleInitTableConfig(this);
    this.refreshData();
    // 区域树
    WorkOrderInitTreeUtil.initAreaSelectorConfig(this);
    // 指派单位树
    WorkOrderInitTreeUtil.initAssignTreeConfig(this);
    // 获取卡片数据
    this.getCardStatistics();

    // id变化
    this.$activatedRoute.queryParams.subscribe(res => {
      if (res.id) {
        const arr = this.queryCondition.filterConditions.find(item => {
          return item.filterField === '_id';
        });
        if (!arr) {
          this.queryCondition.filterConditions.push({
            filterField: '_id',
            filterValue: res.id,
            operator: OperatorEnum.eq
          });
        }
        this.scheduleIsVisible = false;
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshData();
      }
    });
  }

  /**
   * 销毁组件
   */
  public ngOnDestroy(): void {
    this.scheduleTable = null;
    this.workTable = null;
    if (this.webSocketInstance) {
      this.webSocketInstance.unsubscribe();
    }
  }
  /**
   * 推送监听，实现实时刷新
   */
  public facilityChangeHook(): void {
    const that = this;
    this.webSocketInstance = this.$wsService.subscibeMessage.subscribe(res => {
      if (res && res.data && JSON.parse(res.data)) {
        const data: WebsocketMessageModel = JSON.parse(res.data);
        if (data.channelKey === ChannelCode.workflowBusiness) {
          // 巡检工单监听
          if (typeof data.msg === 'string' && JSON.parse(data.msg).procType === ClearBarrierOrInspectEnum.inspection) {
            const isHave = this.tableDataSet.filter(_item => _item.procId === JSON.parse(data.msg).procId);
            if (data && isHave.length > 0) {
              that.workTable.handleSearch();
            }
          }
        }
      }
    });
  }

  /**
   * 责任单位选择结果
   * @param event 选中单位数据
   */
  public selectDataChange(event: DepartmentUnitModel[]): void {
    const departmentList = [];
    for (let i = 0; i < event.length; i++) {
      departmentList.push({accountabilityDept: event[i].id});
    }
    this.assignWorkOrder(this.procId, departmentList);
  }

  /**
   * 部门筛选选择结果
   * @param event 当前选中单位数据
   */
  public departmentSelectDataChange(event: DepartmentUnitModel[]): void {
    this.selectUnitName = '';
    if (event && event.length > 0) {
      this.selectUnitName = event[0].deptName;
      this.filterValue.filterValue = [event[0].deptCode];
      this.departFilterValue.filterName = this.selectUnitName;
      FacilityForCommonUtil.setTreeNodesStatus(this.unitTreeNodes, [event[0].id]);
    }
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
      this.refUserFilterValue.filterValue = this.refCheckUserObject.userIds.length > 0 ? this.refCheckUserObject.userIds : null;
      this.refUserFilterValue.filterName = this.refCheckUserObject.userName;
    } else {
      this.selectUserList = event;
      WorkOrderClearInspectUtil.selectUser(event, this);
    }
  }

  /**
   * 显示未完成工单列表数据
   */
  public refreshData(): void {
    this.tableConfig.isLoading = true;
    // 显示未完工列表页数据
    this.queryCondition.filterConditions.forEach(v => {
      if (v.filterField === 'accountabilityDept' || v.filterField === 'assign') {
        v.operator = OperatorEnum.in;
      }
      if (v.filterField === 'equipmentType') {
        v.filterField = 'procRelatedEquipment.equipmentType';
        v.operator = OperatorEnum.all;
      }
      if (v.filterField === 'deviceType') {
        v.operator = OperatorEnum.in;
        v.filterField = 'procRelatedDevices.deviceType';
      }
    });
    this.turnPageParams();
    this.queryCondition.bizCondition = {};
    this.$inspectionWorkOrderService.getUnfinishedList(this.queryCondition).subscribe((result: ResultModel<InspectionWorkOrderModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        const data = result.data || [];
        this.tableConfig.showEsPagination = data.length > 0;
        this.pageBean.Total = result.totalPage * result.size;
        this.pageBean.pageSize = result.size;
        this.pageBean.pageIndex = result.pageNum;
        data.forEach(item => {
          item.statusClass = WorkOrderStatusUtil.getWorkOrderIconClassName(item.status);
          item.statusName = WorkOrderStatusUtil.getWorkOrderStatus(this.$nzI18n, item.status);
          // 判断剩余天数，标记行颜色
          if (item.lastDays <= 0) {
            item.rowStyle = {color: LastDayColorEnum.overdueTime};
          } else if (item.lastDays <= 3 && item.lastDays > 0) {
            item.rowStyle = {color: LastDayColorEnum.estimatedTime};
          } else {
            item.lastDaysClass = '';
          }
          this.setIconStatus(item);
          // 设施类型名称及图表class
          if (item.deviceType) {
            item.deviceTypeName = WorkOrderBusinessCommonUtil.deviceTypeNames(this.$nzI18n, item.deviceType);
            if (item.deviceTypeName) {
              item.deviceClass = CommonUtil.getFacilityIconClassName(item.deviceType);
            } else {
              item.deviceClass = '';
            }
          }
          // 设备类型名称及图表class
          item.equipmentTypeList = [];
          item.equipmentTypeName = '';
          if (item.equipmentType) {
            const equip = WorkOrderClearInspectUtil.handleMultiEquipment(item.equipmentType, this.$nzI18n);
            item.equipmentTypeList = equip.equipList;
            item.equipmentTypeName = equip.names.join(',');
          }
        });
        this.tableDataSet = result.data;
        this.facilityChangeHook();
      }
      this.tableConfig.isLoading = false;
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 页面跳转参数
   */
  private turnPageParams(): void {
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
      // 首页跳转工单 设施id及name
      const deviceId = this.$activatedRoute.snapshot.queryParams.deviceId;
      if (deviceId) {
        const obj = this.queryCondition.filterConditions.find(item => {
          return item.filterField === 'procRelatedDevices.deviceId';
        });
        if (obj) {
          if (obj.filterValue.indexOf(deviceId) === -1) {
            obj.filterValue.push(deviceId);
          }
        } else {
          this.queryCondition.filterConditions.push({
            filterField: 'procRelatedDevices.deviceId',
            filterValue: deviceId,
            operator: OperatorEnum.eq
          });
        }
      }
      // 首页跳转工单 设备id及name
      const equipmentId = this.$activatedRoute.snapshot.queryParams.equipmentId;
      if (equipmentId) {
        const obj = this.queryCondition.filterConditions.find(item => {
          return item.filterField === 'procRelatedEquipment.equipmentId';
        });
        if (obj) {
          if (obj.filterValue.indexOf(equipmentId) === -1) {
            obj.filterValue.push(equipmentId);
          }
        } else {
          this.queryCondition.filterConditions.push({
            filterField: 'procRelatedEquipment.equipmentId',
            filterValue: equipmentId,
            operator: OperatorEnum.eq
          });
        }
      }
    }
  }

  /**
   * 是否可操作(按钮显灰)
   */
  private setIconStatus(item: InspectionWorkOrderModel): void {
    // 只有待指派能删
    item.isShowDeleteIcon = item.status === WorkOrderStatusEnum.assigned;
    // 已退单不可编辑
    item.isShowEditIcon = item.status !== WorkOrderStatusEnum.singleBack;
    // 转派
    item.isShowTransfer = item.status === WorkOrderStatusEnum.processing;
    // 待处理可以撤回
    item.isShowRevertIcon = item.status === WorkOrderStatusEnum.pending;
    // 待指派可以指派
    item.isShowAssignIcon = item.status === WorkOrderStatusEnum.assigned;
    // 退单确认状态为已退单   isCheckSingleBack = 0 未确认  1未确认
    item.isShowTurnBackConfirmIcon = (item.status === WorkOrderStatusEnum.singleBack);
  }

  /**
   * 显示关联工单已完成工单列表数据
   * @param id 工单id
   */
  private refreshCompleteData(): void {
    this.scheduleTableConfig.isLoading = true;
    this.finishQueryCondition.filterConditions = this.setCondition(this.finishQueryCondition.filterConditions);
    this.$inspectionWorkOrderService.getUnfinishedCompleteList(this.finishQueryCondition).subscribe((result: ResultModel<InspectionTaskModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.schedulePageBean.Total = result.totalCount;
        this.schedulePageBean.pageSize = result.size;
        this.schedulePageBean.pageIndex = result.pageNum;
        const list = result.data;
        // 根据返回值处理展示结果
        for (let i = 0; i < list.length; i++) {
          if (list[i].result === IsSelectAllEnum.deny) {
            list[i].result = this.InspectionLanguage[WorkOrderNormalAndAbnormalEnum.normal];
          } else if (list[i].result === IsSelectAllEnum.right) {
            list[i].result = this.InspectionLanguage[WorkOrderNormalAndAbnormalEnum.abnormal];
          }
        }
        this.schedule_dataSet = list;
      }
      this.scheduleTableConfig.isLoading = false;
    }, () => {
      this.scheduleTableConfig.isLoading = false;
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
   * 分页显示
   *  @param event 分页参数
   */
  public schedulePageChange(event: PageModel): void {
    this.pagesChange = IsSelectAllEnum.right;
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshCompleteData();
  }

  /**
   * 打开责任单位选择器
   * @param filterValue 过滤参数
   */
  public showModal(filterValue: FilterCondition): void {
    this.departFilterValue = filterValue;
    if (this.unitTreeNodes.length === 0) {
      this.queryAllDeptList().then((bool) => {
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
   * 打开退单确认modal
   * (外部表格配置调用，灰显勿删！！)
   */
  private openSingleBackConfirmModal(): void {
    this.singleBackConfirmModal = this.$modal.create({
      nzTitle: this.InspectionLanguage.turnBackConfirm,
      nzContent: this.SingleBackTemp,
      nzOkType: 'danger',
      nzClassName: 'custom-create-modal',
      nzMaskClosable: false,
      nzFooter: this.footerTemp,
    });
  }

  /**
   * 退单确认
   * param ids
   */
  public singleBackConfirm(): void {
    this.$inspectionWorkOrderService.singleBackToConfirm(this.returnID).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.queryCondition.pageCondition.pageNum = 1;
        this.closeSingleBackConfirmModal();
        this.refreshData();
        this.getCardStatistics();
        this.$message.success(this.InspectionLanguage.operateMsg.successful);
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 关闭退单确认modal
   */
  public closeSingleBackConfirmModal(): void {
    this.singleBackConfirmModal.destroy();
  }

  /**
   * 重新生成
   */
  public regenerate(): void {
    this.closeSingleBackConfirmModal();
    this.$router.navigate([`/business/work-order/inspection/unfinished-detail/restUpdate`],
      {queryParams: {procId: this.returnID, type: WorkOrderPageTypeEnum.restUpdate, status: 'assigned'}}).then();
  }

  /**
   * 指派工单
   * param ids
   */
  private assignWorkOrder(id: string, modal: DepartmentUnitModel[]): void {
    const data = {
      procId: id,
      departmentList: modal
    };
    this.$inspectionWorkOrderService.assignedUnfinished(data).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.InspectionLanguage.operateMsg.assignSuccess);
        this.refreshData();
      }
    });
  }

  /**
   * 未完工工单撤回
   * (外部表格配置调用，灰显勿删！！)
   */
  private withdrawWorkOrder(): void {
    const pid = new ClearBarrierWorkOrderModel();
    delete pid.deviceObject;
    pid.procId = this.withdrawID;
    this.$inspectionWorkOrderService.unfinishedWorkOrderWithdrawal(pid).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshData();
        this.getCardStatistics();
        this.$message.success(this.InspectionLanguage.operateMsg.turnBack);
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 设置查询参数
   */
  private setCondition(event: FilterCondition[]): FilterCondition[] {
    const param = [];
    param.push({
      filterValue: this.completedWorkOrderID,
      filterField: 'procId',
      operator: OperatorEnum.eq,
    });
    if (event && event.length > 0) {
      event.forEach(v => {
        if (v.filterField === 'resourceMatching') {
          param.push(v);
        } else {
          if (v.filterField === 'assign') {
            v.operator = OperatorEnum.in;
          }
          v.filterField = `procRelatedDevices.${v.filterField}`;
          param.push(v);
        }
      });
    }
    return param;
  }
  /**
   * 关联图片
   * @param procId =工单id
   * (外部表格配置调用，灰显勿删！！)
   */
  private getPicUrlByAlarmIdAndDeviceId(data: InspectionTaskModel): void {
    this.$workOrderCommonUtil.queryImageForView(data.deviceId, data.procId);
  }

  /**
   * 隐藏弹框
   */
  public closeModal(): void {
    this.scheduleIsVisible = false;
    // 重置查询条件
    this.schedulePageBean = new PageModel();
    this.scheduleTable.handleRest();
    this.schedule_dataSet = [];
    this.scheduleTableConfig.showSearch = false;
    this.selectRefUserList = [];
  }

  /**
   * 查询所有的单位
   */
  private queryAllDeptList(): Promise<boolean> {
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
   * 进度显示已完工列表
   * @param data 行数据
   */
  public showCompleted(data: InspectionWorkOrderModel): void {
    this.finishQueryCondition = new QueryConditionModel();
    this.completedWorkOrderID = data.procId;
    this.refreshCompleteData();
    this.title = this.InspectionLanguage.completeInspectionInformation;
    this.scheduleIsVisible = true;
  }

  /**
   * 获得所有的责任人
   * (外部表格配置调用，灰显勿删！！)
   */
  private getAllUser(): void {
    if (this.roleArray.length > 0) {
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
        this.areaSelectorConfig.treeNodes = this.areaNodes;
        FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, null);
        this.areaSelectVisible = true;
      });
    }
  }

  /**
   * 区域选择监听
   * @param item 选中行数据
   */
  public areaSelectChange(item: AreaFormModel): void {
    if (item && item[0]) {
      this.areaFilterValue.filterValue = item[0].areaCode;
      this.areaFilterValue.filterName = item[0].areaName;
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, item[0].areaId, item[0].areaId);
    } else {
      this.areaFilterValue.filterValue = null;
      this.areaFilterValue.filterName = '';
    }
  }

  /**
   * 获取指派单位数据
   * (外部表格配置调用，灰显勿删！！)
   */
  private getAssignData(areaCode: string): void {
    const data = new AreaDeviceParamModel();
    data.areaCodes = [areaCode];
    data.userId = WorkOrderBusinessCommonUtil.getUserId();
    this.$facilityForCommonService.listDepartmentByAreaAndUserId(data).subscribe((result: ResultModel<NzTreeNode[]>) => {
      if (result.code === ResultCodeEnum.success && result.data.length > 0) {
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
   * 打开指派树
   */
  private showAssignModal(): void {
    this.assignTreeSelectorConfig.treeNodes = this.assignTreeNode;
    this.assignVisible = true;
  }

  /**
   * 选择指派单位
   */
  public selectAssignDataChange(event: DepartmentUnitModel[]): void {
    FacilityForCommonUtil.setTreeNodesStatus(this.assignTreeNode, []);
    if (event && event.length > 0) {
      const param = new AssignDepartmentModel();
      param.procId = this.procId;  // 工单id
      param.accountabilityDept = event[0].deptCode;  // 责任单位
      param.accountabilityDeptName = event[0].deptName;  // 责任单位名称
      this.$inspectionWorkOrderService.assignedUnfinished(param).subscribe((result: ResultModel<string>) => {
        if (result.code === ResultCodeEnum.success) {
          this.$message.success(this.InspectionLanguage.operateMsg.assignSuccess);
          this.refreshData();
          this.getCardStatistics();
        } else {
          this.$message.error(result.msg);
        }
      });
    } else {
      this.$message.error(this.InspectionLanguage.pleaseSelectUnit);
    }
  }
  /**
   * 选中卡片查询相应的类型
   * param event
   */
  public sliderChange(event): void {
    if (this.isNoData) {
      return;
    }
    if (event.code) {
      this.isReset = true;
      if (event.code && event.code !== 'all') {
        this.workTable.tableService.resetFilterConditions(this.workTable.queryTerm);
        this.workTable.handleSetControlData('status', [event.code]);
        this.workTable.handleSearch();
      } else if (event.code === 'all') {
        this.queryCondition.bizCondition = {};
        this.queryCondition.filterConditions = [];
        this.workTable.handleSetControlData('status', null);
      }
      this.refreshData();
    }
  }
  /**
   * 滑块变化
   * param event
   */
  public slideShowChange(event): void {
    this.slideShowChangeData = event;
  }

  /**
   * 获取卡片数据
   */
  private getCardStatistics(): void {
    this.getIncreaseAddCount().then((bool) => {
      if (bool) {
        this.getInspectProcessingCount();
        this.isNoData = false;
      } else {
        this.isNoData = true;
        WorkOrderClearInspectUtil.initStatisticsList(this, WorkOrderClearInspectUtil.defaultCardList(), 0);
      }
    });
  }

  /**
   * 今日新增
   */
  private getIncreaseAddCount(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.$inspectionWorkOrderService.inspectTodayAdd({}).subscribe((result: ResultModel<number>) => {
        if (result.code === ResultCodeEnum.success) {
          this.increaseAddCount = result.data;
          resolve(true);
        } else {
          this.$message.error(result.msg);
          resolve(false);
        }
      }, (error) => {
        WorkOrderClearInspectUtil.initStatisticsList(this, WorkOrderClearInspectUtil.defaultCardList(), 0);
      });
    });
  }

  /**
   * 状态统计
   */
  private getInspectProcessingCount(): void {
    this.sliderConfig = [];
    this.$inspectionWorkOrderService.inspectCardStatistic({}).subscribe((result: ResultModel<RepairOrderStatusCountModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        let dataList = [];
        const isStatus = ['assigned', 'processing', 'pending', 'singleBack', 'turnProcess'];
        if (result.data.length > 0) {
          result.data.forEach(item => {
            if (isStatus.indexOf(item.status) > -1) {
              dataList.push({
                orderCount: item.count,
                status: item.status,
                statusName: this.workOrderLanguage[item.status],
                orderPercent: 0.0
              });
            }
          });
        } else {
          dataList = WorkOrderClearInspectUtil.defaultCardList();
        }
        WorkOrderClearInspectUtil.initStatisticsList(this, dataList, this.increaseAddCount);
      }
    });
  }

  /**
   * 打开转派
   * (外部表格配置调用，灰显勿删！！)
   */
  private showInspectTransForm(params: InspectionWorkOrderModel): void {
    const data = new TransferOrderParamModel();
    data.type = ClearBarrierOrInspectEnum.inspection;
    data.procId = params.procId;
    data.accountabilityDept = params.accountabilityDept;
    this.transModalData = data;
    this.isShowTransModal = true;
  }
  /**
   * 转派提交
   */
  public transferInspectOrders(event: TransferOrderParamModel): void {
    if (event) {
      this.$inspectionWorkOrderService.transInspectOrder(event).subscribe((result: ResultModel<string>) => {
        if (result.code === ResultCodeEnum.success) {
          this.$message.success(this.InspectionLanguage.operateMsg.turnProgress);
          this.isShowTransModal = false;
          this.refreshData();
          this.getCardStatistics();
        } else {
          this.$message.error(result.msg);
        }
      });
    } else {
      this.isShowTransModal = false;
    }
  }
}

