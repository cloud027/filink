import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FilterCondition, QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {PageModel} from '../../../../shared-module/model/page.model';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {NzI18nService, NzTreeNode} from 'ng-zorro-antd';
import {WorkOrderLanguageInterface} from '../../../../../assets/i18n/work-order/work-order.language.interface';
import {SliderCardConfigModel} from '../../share/model/slider-card-config-model';
import {UnfinishedAlarmConfirmTable} from './unfinished-alarm-confirm-table';
import {WorkOrderStatusUtil} from '../../../../core-module/business-util/work-order/work-order-for-common.util';
import {WorkOrderBusinessCommonUtil} from '../../share/util/work-order-business-common.util';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {WorkOrderClearInspectUtil} from '../../share/util/work-order-clear-inspect.util';
import {WorkOrderStatusEnum} from '../../../../core-module/enum/work-order/work-order-status.enum';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {SelectModel} from '../../../../shared-module/model/select.model';
import {AlarmSelectorConfigModel} from '../../../../shared-module/model/alarm-selector-config.model';
import {FilterValueModel} from '../../../../core-module/model/work-order/filter-value.model';
import {SelectOrderEquipmentModel} from '../../share/model/select-order-equipment.model';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';
import {ActivatedRoute, Router} from '@angular/router';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {AlarmConfirmWorkOrderService} from '../../share/service/alarm-confirm';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {AlarmConfirmWorkOrderModel} from '../../../../core-module/model/work-order/alarm-confirm.model';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {WorkOrderInitTreeUtil} from '../../share/util/work-order-init-tree.util';
import {DepartmentUnitModel} from '../../../../core-module/model/work-order/department-unit.model';
import {WorkOrderCommonServiceUtil} from '../../share/util/work-order-common-service.util';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {AreaFormModel} from '../../share/model/area-form.model';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {AssignDepartmentModel} from '../../share/model/assign-department.model';
import {AreaDeviceParamModel} from '../../../../core-module/model/work-order/area-device-param.model';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {TransferOrderParamModel} from '../../share/model/clear-barrier-model/transfer-order-param.model';
import {ClearBarrierOrInspectEnum, LastDayColorEnum} from '../../share/enum/clear-barrier-work-order.enum';
import {WorkOrderPageTypeEnum} from '../../share/enum/work-order-page-type.enum';
import {AlarmListModel} from '../../../../core-module/model/alarm/alarm-list.model';
import {AlarmForCommonService} from '../../../../core-module/api-service/alarm';
import {AlarmLanguageInterface} from '../../../../../assets/i18n/alarm/alarm-language.interface';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {UserRoleModel} from '../../../../core-module/model/user/user-role.model';
import {AlarmForCommonUtil} from '../../../../core-module/business-util/alarm/alarm-for-common.util';

/**
 * 未完工告警确认工单
 */
@Component({
  selector: 'app-unfinished-alarm-confirm',
  templateUrl: './unfinished-alarm-confirm.component.html',
  styleUrls: ['./unfinished-alarm-confirm.component.scss']
})
export class UnfinishedAlarmConfirmComponent implements OnInit {
  // 工单状态模板
  @ViewChild('statusTemp') public statusTemp: TemplateRef<any>;
  // 设施类型
  @ViewChild('deviceTemp') deviceTemp: TemplateRef<any>;
  // 设备类型
  @ViewChild('equipTemp') equipTemp: TemplateRef<any>;
  // 未完工告警确认工单表格
  @ViewChild('unfinishedAlarm') unfinishedAlarm: TableComponent;
  // 选择设施名称
  @ViewChild('DeviceNameSearch') public deviceNameSearch: TemplateRef<any>;
  // 设备选择
  @ViewChild('equipmentSearch') public equipmentSearch: TemplateRef<any>;
  // 单位名称选择
  @ViewChild('unitNameSearch') unitNameSearch: TemplateRef<any>;
  // 区域查询
  @ViewChild('areaSearch') areaSearch: TemplateRef<any>;
  // 关联告警
  @ViewChild('refAlarmTemp') public refAlarmTemp: TemplateRef<any>;
  // 用户筛选
  @ViewChild('userSearchTemp') userSearchTemp: TemplateRef<any>;
  // 国际化
  public inspectionLanguage: InspectionLanguageInterface;
  public workOrderLanguage: WorkOrderLanguageInterface;
  // 告警语言
  public alarmLanguage: AlarmLanguageInterface;
  // 列表分页
  public pageBean: PageModel = new PageModel();
  // 列表表单配置
  public alarmTableConfig: TableConfigModel;
  // 卡片配置
  public sliderConfig: SliderCardConfigModel[] = [];
  // 设施选择器配置
  public deviceObjectConfig: AlarmSelectorConfigModel;
  // 过滤条件
  public filterObj: FilterValueModel = new FilterValueModel();
  // 勾选的设施对象
  private checkDeviceObject: FilterValueModel = new FilterValueModel();
  // 设备选择器显示
  public equipmentVisible: boolean = false;
  // 勾选的设备
  public checkEquipmentObject: SelectOrderEquipmentModel = new SelectOrderEquipmentModel();
  // 设备勾选容器
  public selectEquipments: EquipmentListModel[] = [];
  // 未完工列表数据存放
  public tableDataSet: AlarmConfirmWorkOrderModel[] = [];
  // 工单状态列表
  public workOrderList: SelectModel[] = [];
  // 单位树配置
  public treeSelectorConfig: TreeSelectorConfigModel;
  // 区域选择器配置
  public areaSelectorConfig: TreeSelectorConfigModel;
  // 单位过滤
  public departFilterValue: FilterCondition = {
    filterField: '',
    operator: '',
    filterValue: '',
    filterName: ''
  };
  // 单位选择器筛选
  public responsibleUnitIsVisible: boolean = false;
  // 控制区域显示隐藏
  public areaSelectVisible: boolean = false;
  // 区域过滤
  public areaFilterValue: FilterCondition = {
    filterField: '',
    operator: '',
    filterValue: '',
    filterName: ''
  };
  // 指派单位显示隐藏
  public assignVisible: boolean = false;
  // 单位树配置
  public assignTreeSelectorConfig: TreeSelectorConfigModel;
  // 显示转派弹窗
  public isShowTransModal: boolean = false;
  // 列表数据
  public transModalData: TransferOrderParamModel;
  // 显示退单确认
  public isChargeback: boolean = false;
  // 显示关联告警
  public isShowRefAlarm: boolean = false;
  // 告警数据
  public alarmData: AlarmListModel;
  // 显示用户选择
  public isShowUserTemp: boolean = false;
  // 存放用户数据
  public selectUserList: UserRoleModel[] = [];
  // 勾选用户
  public checkUserObject: FilterValueModel = new FilterValueModel();
  // 用户显示
  private userFilterValue: FilterCondition;
  // 指派单位数据
  private assignTreeNode: NzTreeNode[] = [];
  // 卡片切换时数据 （外部组件暂无模型）
  private slideShowChangeData;
  // 设备选择器显示
  private equipmentFilterValue: FilterCondition;
  // 查询条件
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // 导出 （配置文件调用，灰显勿删！！）
  private exportParams: ExportRequestModel = new ExportRequestModel();
  // 去重
  private alarmConfirmDeduplication: boolean = false;
  // 树节点
  private unitTreeNodes: DepartmentUnitModel[] = [];
  // 区域数据
  private areaNodes: AreaFormModel[] = [];
  // 当前工单id
  private currentProcId: string;
  // 是否重置
  private isResetParam: boolean = false;

  constructor(
    private $nzI18n: NzI18nService,
    private $activatedRoute: ActivatedRoute,
    private $router: Router,
    public $message: FiLinkModalService,
    private $alarmWorkOrderService: AlarmConfirmWorkOrderService,
    private $alarmForCommonService: AlarmForCommonService,
    private $workOrderCommonUtil: WorkOrderCommonServiceUtil,
    private $facilityForCommonService: FacilityForCommonService,
    ) {}

  public ngOnInit(): void {
    this.workOrderLanguage = this.$nzI18n.getLocaleData(LanguageEnum.workOrder);
    this.inspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.alarmLanguage = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    // 过滤已完工状态
    (WorkOrderStatusUtil.getWorkOrderStatusList(this.$nzI18n)).forEach(v => {
      if (v.value !== WorkOrderStatusEnum.completed) {
        this.workOrderList.push(v);
      }
    });
    // 初始化列表
    UnfinishedAlarmConfirmTable.initUnfinishedAlarmConfig(this);
    // 单位树
    WorkOrderInitTreeUtil.initTreeSelectorConfig(this);
    // 区域树
    WorkOrderInitTreeUtil.initAreaSelectorConfig(this);
    // 指派单位树
    WorkOrderInitTreeUtil.initAssignTreeConfig(this);
    // 请求数据
    this.refreshData();
    // 卡片统计
    this.getCardList();
    // 设施名称
    this.initDeviceObjectConfig();
  }

  /**
   * 打开责任单位选择器
   * @param filterValue 过滤参数
   */
  public showDeptModal(filterValue: FilterCondition): void {
    this.departFilterValue = filterValue;
    if (this.unitTreeNodes.length === 0) {
      this.$workOrderCommonUtil.queryAllDeptList().then((data: DepartmentUnitModel[]) => {
        if (data.length) {
          this.alarmConfirmDeduplication = true;
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
   * 设施区域弹框
   */
  public showArea(filterValue: FilterCondition): void {
    this.areaFilterValue = filterValue;
    // 当区域数据不为空的时候
    if (this.areaNodes.length > 0) {
      this.areaSelectorConfig.treeNodes = this.areaNodes;
      this.areaSelectVisible = true;
    } else {
      this.alarmConfirmDeduplication = true;
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
   * 区域选择回显
   * @param item 选中行数据
   */
  public areaSelectChange(item: AreaFormModel): void {
    if (item && item[0]) {
      this.areaFilterValue.filterValue = item[0].areaCode;
      this.areaFilterValue.filterName = item[0].areaName;
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, item[0].areaId, item[0].areaId);
      this.alarmConfirmDeduplication = false;
    } else {
      this.areaFilterValue.filterValue = null;
      this.areaFilterValue.filterName = '';
    }
  }
  /**
   * 获取列表数据
   */
  public refreshData(): void {
    this.alarmTableConfig.isLoading = true;
    // 处理传入参数
    if (!this.isResetParam) {
      this.handleParams();
    }
    const params = ['deviceId', 'refAlarmId', 'equipment.equipmentId', 'assign'];
    this.queryCondition.filterConditions.forEach(v => {
      if (params.includes(v.filterField)) {
        v.operator = OperatorEnum.in;
      }
    });
    this.$alarmWorkOrderService.getUnfinishedAlarmConfirmList(this.queryCondition).subscribe((result: ResultModel<AlarmConfirmWorkOrderModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.pageBean.Total = result.totalPage * result.size;
        this.pageBean.pageSize = result.size;
        this.pageBean.pageIndex = result.pageNum;
        const list = result.data || [];
        this.alarmTableConfig.showEsPagination = list.length > 0;
        list.forEach(item => {
          // 工单状态
          if (item.status) {
            item.statusClass = WorkOrderStatusUtil.getWorkOrderIconClassName(item.status);
            item.statusName = WorkOrderStatusUtil.getWorkOrderStatus(this.$nzI18n, item.status);
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
          // 判断剩余天数，标记行颜色
          if (item.lastDays <= 0) {
            item.rowStyle = {color: LastDayColorEnum.overdueTime};
          } else if (item.lastDays <= 3 && item.lastDays > 0) {
            item.rowStyle = {color: LastDayColorEnum.estimatedTime};
          }
          // 设备类型名称及图表class
          item.equipmentTypeList = [];
          item.equipmentTypeName = '';
          if (item.equipmentType) {
            const equip = WorkOrderClearInspectUtil.handleMultiEquipment(item.equipmentType, this.$nzI18n);
            item.equipmentTypeList = equip.equipList;
            item.equipmentTypeName = equip.names.join(',');
          }
          const name = AlarmForCommonUtil.translateAlarmNameByCode(this.$nzI18n, item.refAlarmCode);
          if (name) {
            item.refAlarmName = name;
          }
        });
        this.tableDataSet = list;
      }
      this.alarmTableConfig.isLoading = false;
    }, () => {
      this.alarmTableConfig.isLoading = false;
    });
  }
  /**
   * 处理参数
   */
  public handleParams(): void {
    // 其它页面跳转工单 设施id
    const deviceId = this.$activatedRoute.snapshot.queryParams.deviceId;
    if (deviceId) {
      const obj = this.queryCondition.filterConditions.find(item => {
        return item.filterField === 'deviceId';
      });
      this.alarmConfirmDeduplication = true;
      if (obj) {
        if (obj.filterValue.indexOf(deviceId) === -1) {
          obj.filterValue = [deviceId];
        }
      } else {
        this.queryCondition.filterConditions.push({
          filterField: 'deviceId',
          filterValue: [deviceId],
          operator: OperatorEnum.in
        });
      }
    }
    // 其它页面跳转工单 设备id
    const equipmentId = this.$activatedRoute.snapshot.queryParams.equipmentId;
    if (equipmentId) {
      const obj = this.queryCondition.filterConditions.find(item => {
        return item.filterField === 'equipment.equipmentId';
      });
      if (obj) {
        if (obj.filterValue.indexOf(equipmentId) === -1) {
          obj.filterValue = [equipmentId];
        }
        this.alarmConfirmDeduplication = false;
      } else {
        this.queryCondition.filterConditions.push({
          filterField: 'equipment.equipmentId',
          filterValue: [equipmentId],
          operator: OperatorEnum.in
        });
      }
    }
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
   * 选中卡片查询相应的类型
   * param event
   */
  public sliderChange(event): void {
    if (event.code) {
      if (event.code && event.code !== 'all') {
        this.unfinishedAlarm.tableService.resetFilterConditions(this.unfinishedAlarm.queryTerm);
        this.unfinishedAlarm.handleSetControlData('status', [event.code]);
        this.unfinishedAlarm.handleSearch();
        this.alarmConfirmDeduplication = true;
      } else if (event.code === 'all') {
        this.queryCondition.bizCondition = {};
        this.queryCondition.filterConditions = [];
        this.unfinishedAlarm.handleSetControlData('status', null);
      }
      this.refreshData();
    }
  }
  /**
   * 滑块变化
   * param event
   */
  public slideShowChange(event: boolean): void {
    this.slideShowChangeData = event;
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
    this.alarmConfirmDeduplication = false;
    this.equipmentFilterValue.filterValue = this.checkEquipmentObject.ids.length === 0 ? null : this.checkEquipmentObject.ids;
    this.equipmentFilterValue.filterName = this.checkEquipmentObject.name;
  }
  /**
   * 选择指派单位
   */
  public selectAssignDataChange(event: DepartmentUnitModel[]): void {
    FacilityForCommonUtil.setTreeNodesStatus(this.assignTreeNode, []);
    if (event && event.length > 0) {
      const param = new AssignDepartmentModel();
      param.procId = this.currentProcId;  // 工单id
      param.accountabilityDept = event[0].deptCode;  // 责任单位
      param.accountabilityDeptName = event[0].deptName;  // 责任单位名称
      this.$alarmWorkOrderService.assignAlarmOrder(param).subscribe((result: ResultModel<string>) => {
        if (result.code === ResultCodeEnum.success) {
          this.$message.success(this.inspectionLanguage.operateMsg.assignSuccess);
          this.refreshData();
          this.getCardList();
        } else {
          this.$message.error(result.msg);
        }
      });
    } else {
      this.$message.error(this.inspectionLanguage.pleaseSelectUnit);
    }
  }
  /**
   * 转派提交
   */
  public transferInspectOrders(event: TransferOrderParamModel): void {
    if (event) {
      console.log(event);
      this.$alarmWorkOrderService.transAlarmOrder(event).subscribe((result: ResultModel<string>) => {
        if (result.code === ResultCodeEnum.success) {
          this.refreshData();
          this.getCardList();
          this.isShowTransModal = false;
          this.$message.success(this.inspectionLanguage.operateMsg.turnProgress);
        } else {
          this.$message.error(result.msg);
        }
      });
    } else {
      this.isShowTransModal = false;
    }
  }

  /**
   * 退单确认 event = true
   * 重新生成 event = false
   */
  public chargebackOrder(event): void {
    if (event) {
      this.$alarmWorkOrderService.chargebackOrder(this.currentProcId).subscribe((res: ResultModel<string>) => {
        if (res.code === ResultCodeEnum.success) {
          this.isChargeback = false;
          this.$message.success(this.inspectionLanguage.operateMsg.successful);
          this.refreshData();
          this.getCardList();
        } else {
          this.$message.error(res.msg);
        }
      });
    } else {
      this.$router.navigate([`/business/work-order/alarm-confirm/unfinished-list/rebuild`],
        {queryParams: {type: WorkOrderPageTypeEnum.rebuild, procId: this.currentProcId, operateFrom: WorkOrderPageTypeEnum.unfinished}}).then();
    }
  }

  /**
   * 关联告警详情弹窗
   */
  public showRefAlarmModal(data: AlarmConfirmWorkOrderModel) {
    // 0data.refAlarmId = '6011483618879a3980f6375a';
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
              this.alarmConfirmDeduplication = false;
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
   * 用户名称选择
   */
  public openUserSelector(filterValue: FilterCondition,  flag?: boolean): void {
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
   * 是否可操作(按钮显灰)
   */
  private setIconStatus(item: AlarmConfirmWorkOrderModel): void {
    // 只有待指派能删
    item.isShowDeleteIcon = item.status === WorkOrderStatusEnum.assigned;
    // 已退单不可编辑
    item.isShowEditIcon = item.status !== WorkOrderStatusEnum.singleBack;
    // 转派
    item.isShowTransfer = item.status === WorkOrderStatusEnum.processing;
    this.alarmConfirmDeduplication = true;
    // 待处理可以撤回
    item.isShowRevertIcon = item.status === WorkOrderStatusEnum.pending;
    // 待指派可以指派
    item.isShowAssignIcon = item.status === WorkOrderStatusEnum.assigned;
    // 退单确认状态为已退单   isCheckSingleBack = 0 未确认  1未确认
    item.isShowTurnBackConfirmIcon = (item.status === WorkOrderStatusEnum.singleBack);
  }
  /**
   * 卡片数据
   */
  private getCardList(): void {
    // 先获取今日新增数量
    let toDayTotal = 0;
    const that = this;
    this.$alarmWorkOrderService.alarmCardTodayAdd().subscribe((res: ResultModel<any>) => {
      if (res.code === ResultCodeEnum.success) {
        toDayTotal = res.data;
        that.$alarmWorkOrderService.alarmStatisticCard().subscribe((result: ResultModel<any>) => {
          if (res.code === ResultCodeEnum.success) {
            const list = result.data || [];
            const dataList = [];
            const isStatus = ['assigned', 'processing', 'pending', 'singleBack', 'turnProcess'];
            list.forEach(item => {
              if (isStatus.indexOf(item.status) > -1) {
                dataList.push({
                  orderCount: item.count,
                  status: item.status,
                  statusName: that.workOrderLanguage[item.status],
                  orderPercent: 0.0
                });
              }
            });
            WorkOrderClearInspectUtil.initStatisticsList(that, dataList, toDayTotal);
          } else {
            that.defaultCardList();
          }
        }, () => {
          that.defaultCardList();
        });
      } else {
        that.defaultCardList();
      }
    }, error => {
      that.defaultCardList();
    });
  }

  /**
   * 默认卡片
   */
  private defaultCardList(): void {
    WorkOrderClearInspectUtil.initStatisticsList(this, WorkOrderClearInspectUtil.defaultCardList(), 0);
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
   * 获取指派单位数据
   * (外部表格配置调用，灰显勿删！！！)
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
        this.assignTreeSelectorConfig.treeNodes = this.assignTreeNode;
      } else {
        this.assignTreeSelectorConfig.treeNodes = [];
      }
      this.assignVisible = true;
    });
  }

  /**
   * 工单删除
   * (外部表格配置调用，灰显勿删！！！)
   */
  private deleteProc(list: AlarmConfirmWorkOrderModel[]): void {
    const param = {procIdList: [], procType: ClearBarrierOrInspectEnum.alarmConfirmOrder};
    list.forEach(v => {
      param.procIdList.push(v.procId);
    });
    this.$alarmWorkOrderService.deleteAlarmConfirm(param).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(this.inspectionLanguage.operateMsg.deleteSuccess);
        this.refreshData();
        this.getCardList();
      } else {
        this.$message.error(res.msg);
      }
    });
  }
  /**
   *  工单撤回
   *  (外部表格配置调用，灰显勿删！！！)
   */
  public backAlarmOrder(): void {
    this.$alarmWorkOrderService.workOrderWithdrawal({procId: this.currentProcId}).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.refreshData();
        this.getCardList();
        this.$message.success(this.inspectionLanguage.operateMsg.turnBack);
      } else {
        this.$message.success(res.msg);
      }
    });
  }

  /**
   * 工单转派弹窗
   * (外部表格配置调用，灰显勿删！！！)
   */
  private workOrderTransfer(params: AlarmConfirmWorkOrderModel): void {
    const data = new TransferOrderParamModel();
    data.type = ClearBarrierOrInspectEnum.alarmConfirmOrder;
    data.procId = params.procId;
    data.accountabilityDept = params.accountabilityDept;
    // data.accountabilityDept = '063';
    this.transModalData = data;
    this.isShowTransModal = true;
  }

}
