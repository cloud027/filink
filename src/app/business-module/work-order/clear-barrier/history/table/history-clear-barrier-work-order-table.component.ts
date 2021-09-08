import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../../shared-module/model/query-condition.model';
import {ClearBarrierWorkOrderService} from '../../../share/service/clear-barrier';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {TreeSelectorConfigModel} from '../../../../../shared-module/model/tree-selector-config.model';
import {ActivatedRoute, Router} from '@angular/router';
import {InspectionWorkOrderService} from '../../../share/service/inspection';
import {AlarmSelectorConfigModel} from '../../../../../shared-module/model/alarm-selector-config.model';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ClearBarrierWorkOrderModel} from '../../../../../core-module/model/work-order/clear-barrier-work-order.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {InspectionLanguageInterface} from '../../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {WorkOrderPageTypeEnum} from '../../../share/enum/work-order-page-type.enum';
import {FilterValueModel} from '../../../../../core-module/model/work-order/filter-value.model';
import {AreaFormModel} from '../../../share/model/area-form.model';
import {RoleUnitModel} from '../../../../../core-module/model/work-order/role-unit.model';
import {DeviceTypeModel} from '../../../share/model/device-type.model';
import {OrderUserModel} from '../../../../../core-module/model/work-order/order-user.model';
import {DepartmentUnitModel} from '../../../../../core-module/model/work-order/department-unit.model';
import {RefAlarmFaultEnum} from '../../../share/enum/refAlarm-faultt.enum';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {EquipmentListModel} from '../../../../../core-module/model/equipment/equipment-list.model';
import {SelectOrderEquipmentModel} from '../../../share/model/select-order-equipment.model';
import {ClearBarrierOrInspectEnum, SourceTypeEnum} from '../../../share/enum/clear-barrier-work-order.enum';
import {WorkOrderCommonServiceUtil} from '../../../share/util/work-order-common-service.util';
import {FacilityForCommonUtil} from '../../../../../core-module/business-util/facility/facility-for-common.util';
import {WorkOrderStatusUtil} from '../../../../../core-module/business-util/work-order/work-order-for-common.util';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {WorkOrderLanguageInterface} from '../../../../../../assets/i18n/work-order/work-order.language.interface';
import {WorkOrderBusinessCommonUtil} from '../../../share/util/work-order-business-common.util';
import {WorkOrderStatusEnum} from '../../../../../core-module/enum/work-order/work-order-status.enum';
import {UserForCommonService} from '../../../../../core-module/api-service/user';
import {AlarmForCommonService} from '../../../../../core-module/api-service/alarm';
import {ExportRequestModel} from '../../../../../shared-module/model/export-request.model';
import {AlarmListModel} from '../../../../../core-module/model/alarm/alarm-list.model';
import {WorkOrderClearInspectUtil} from '../../../share/util/work-order-clear-inspect.util';
import {ListExportModel} from '../../../../../core-module/model/list-export.model';
import {UserRoleModel} from '../../../../../core-module/model/user/user-role.model';

/**
 * 历史销账工单表格
 */
@Component({
  selector: 'app-history-clear-barrier-work-order-table',
  templateUrl: './history-clear-barrier-work-order-table.component.html',
  styleUrls: ['./history-clear-barrier-work-order-table.component.scss']
})
export class HistoryClearBarrierWorkOrderTableComponent implements OnInit {
  // 状态模板
  @ViewChild('statusTemp') public statusTemp: TemplateRef<any>;
  // 设施图标
  @ViewChild('deviceTemp') public deviceTemp: TemplateRef<any>;
  // 单位模板
  @ViewChild('unitNameSearch') public unitNameSearch: TemplateRef<any>;
  // 关联告警模板
  @ViewChild('refAlarmTemp') public refAlarmTemp: TemplateRef<any>;
  // 区域查询模板
  @ViewChild('AreaSearch') public areaSearch: TemplateRef<any>;
  // 设施总数模板
  @ViewChild('DeviceNameSearch') public deviceNameSearch: TemplateRef<any>;
  // 设备选择
  @ViewChild('equipmentSearch') public equipmentSearch: TemplateRef<any>;
  // 设备类型
  @ViewChild('equipmentTemp') public equipmentTemp: TemplateRef<any>;
  // 用户筛选
  @ViewChild('userSearchTemp') public userSearchTemp: TemplateRef<any>;
  // 销账工单国际化
  public workOrderLanguage: WorkOrderLanguageInterface;
  public inspectionLanguage: InspectionLanguageInterface;
  // 关联告警modal内容数据
  public alarmData: AlarmListModel;
  // 关联故障数据
  public faultData: string;
  // 设备选择器显示
  public equipmentVisible: boolean = false;
  // 勾选的设备
  public checkEquipmentObject: SelectOrderEquipmentModel = new SelectOrderEquipmentModel();
  // 设备勾选容器
  public selectEquipments: EquipmentListModel[] = [];
  // 弹窗显示隐藏
  public isVisible: boolean = false;
  // 树配置
  public treeSelectorConfig: TreeSelectorConfigModel;
  // 树节点数据
  public treeNodes: DepartmentUnitModel[] = [];
  // 单位名称
  public selectUnitName: string;
  // 单位过滤
  public departFilterValue: FilterCondition = {
    filterField: '',
    operator: '',
    filterValue: '',
    filterName: ''
  };
  // 列表配置
  public tableConfig: TableConfigModel;
  // 列表数据
  public historyTableData: ClearBarrierWorkOrderModel[] = [];
  // 分页
  public pageBean: PageModel = new PageModel();
  // 国际化
  public alarmLanguage: AlarmLanguageInterface;
  // 控制区域显示隐藏
  public areaSelectVisible: boolean = false;
  // 区域选择器配置
  public areaSelectorConfig: TreeSelectorConfigModel;
  // 区域过滤
  public areaFilterValue: FilterCondition = {
    filterField: '',
    operator: '',
    filterValue: '',
    filterName: ''
  };
  // 设施选择器配置
  public deviceObjectConfig: AlarmSelectorConfigModel;
  // 弹窗显示
  public tempSelectVisible: boolean = false;
  // 显示关联告警
  public isShowRefAlarm: boolean = false;
  // 显示关联故障
  public isShowRefFault: boolean = false;
  // 过滤条件
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
  // 勾选用户
  public checkUserObject: FilterValueModel = new FilterValueModel();
  // 存放用户数据
  public selectUserList: UserRoleModel[] = [];
  // 显示用户选择
  public isShowUserTemp: boolean = false;
  // 用户显示
  private userFilterValue: FilterCondition;
  // 勾选的设施对象
  private checkDeviceObject: FilterValueModel = {
    name: '',
    ids: []
  };
  // 过滤数据
  private filterValue: FilterCondition;
  // 区域节点数据
  private areaNodes: AreaFormModel[] = [];
  // 选择设备
  private selectedEquip: EquipmentListModel[] = [];
  // 模型传参数
  public modalParams: RoleUnitModel[];
  // 是否重置
  private isReset: boolean = false;
  // 设备选择器显示
  private equipmentFilterValue: FilterCondition;
  //  设施类型下拉框
  private selectOption: DeviceTypeModel[];
  // 一天的毫秒数
  private dayTimes: number;
  // 角色数据
  private roleArr: RoleUnitModel[] = [];
  // 设备名称配置
  private alarmEquipmentConfig: AlarmSelectorConfigModel;
  // 设备名称(告警对象)
  private checkAlarmEquipment: SelectOrderEquipmentModel = new SelectOrderEquipmentModel();
  // 查询参数模型
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // 导出
  private exportParams: ExportRequestModel = new ExportRequestModel();
  // 已选择工单id
  private selectDataId: string[] = [];
  constructor(
    public $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $userService: UserForCommonService,
    private $alarmService: AlarmForCommonService,
    private $router: Router,
    private $modal: NzModalService,
    private $inspectionWorkOrderService: InspectionWorkOrderService,
    private $active: ActivatedRoute,
    private $workOrderCommonUtil: WorkOrderCommonServiceUtil,
    private $clearBarrierWorkOrderService: ClearBarrierWorkOrderService,
  ) {}

  public ngOnInit(): void {
    this.getId();
    // 一天的毫秒数
    this.dayTimes = 86400000;
    this.alarmLanguage = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.inspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.workOrderLanguage = this.$nzI18n.getLocaleData(LanguageEnum.workOrder);
    this.setSelectOption();
    this.initTableConfig();
    this.refreshData();
    this.queryDeptList().then();
    this.initTreeSelectorConfig();
    this.initAreaSelectorConfig();
    this.initDeviceObjectConfig();
    this.initAlarmEquipment();
    //  监听页面变化
    this.$active.queryParams.subscribe(param => {
      if (param.id) {
        const arr = this.queryCondition.filterConditions.find(item => {
          return item.filterField === '_id';
        });
        if (!arr) {
          this.queryCondition.filterConditions.push({
            filterField: '_id',
            filterValue: param.id,
            operator: OperatorEnum.eq
          });
        }
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshData();
      }
    });
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
   * 刷新表格数据
   */
  public refreshData(): void {
    this.tableConfig.isLoading = true;
    const procId = this.$active.snapshot.queryParams.id;
    this.queryCondition.filterConditions.forEach(v => {
      if (v.filterField === 'deviceId' || v.filterField === 'assign') {
        v.operator = OperatorEnum.in;
      }
      if (v.filterField === 'equipmentName') {
        v.filterField = 'equipment.equipmentId';
        v.operator = OperatorEnum.in;
      }
      if (v.filterField === 'equipmentType') {
        v.operator = OperatorEnum.in;
        v.filterField = 'equipment.equipmentType';
      }
    });
    // 是否重置
    if (!this.isReset) {
      // 其它页面跳转工单 工单id
      if (procId) {
        const arr = this.queryCondition.filterConditions.find(item => {
          return item.filterField === '_id';
        });
        if (!arr) {
          this.queryCondition.filterConditions.push({
            filterField: '_id',
            filterValue: procId,
            operator: OperatorEnum.eq
          });
        }
      }
    }
    this.$clearBarrierWorkOrderService.getHistoryWorkOrderList(this.queryCondition).subscribe((result: ResultModel<ClearBarrierWorkOrderModel[]>) => {
      this.tableConfig.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.pageBean.Total = result.totalPage * result.size;
        this.pageBean.pageSize = result.size;
        this.pageBean.pageIndex = result.pageNum;
        const data = result.data ? result.data : [];
        this.tableConfig.showEsPagination = data.length > 0;
        data.forEach(item => {
          // 获取工单状态图标class及名称
          item.statusName = WorkOrderStatusUtil.getWorkOrderStatus(this.$nzI18n, item.status);
          item.statusClass = WorkOrderStatusUtil.getWorkOrderIconClassName(item.status);
          // 获取设施类型名称及设施类型图标
          if (item.deviceType) {
            item.deviceTypeName = WorkOrderBusinessCommonUtil.deviceTypeNames(this.$nzI18n, item.deviceType);
            if (item.deviceTypeName) {
              item.deviceClass = CommonUtil.getFacilityIconClassName(item.deviceType);
            } else {
              item.deviceClass = '';
            }
          }
          // 判断操作按钮状态
          if (item.status === WorkOrderStatusEnum.singleBack && item.dataResourceType !== SourceTypeEnum.trouble) {
            item.isShowTurnBackConfirmIcon = true;
          }
          // 判断工单来源
          if (item.dataResourceType) {
            item.dataResourceType = this.workOrderLanguage[WorkOrderBusinessCommonUtil.getEnumKey(item.dataResourceType, SourceTypeEnum)];
          }
          item.equipmentTypeList = [];
          item.equipmentTypeName = '';
          // 详情
          item.isShowWriteOffOrderDetail = true;
          // 获取设备类型名称及设备类型图标
          if (item.equipmentType) {
            const equip = WorkOrderClearInspectUtil.handleMultiEquipment(item.equipmentType, this.$nzI18n);
            item.equipmentTypeList = equip.equipList;
            item.equipmentTypeName = equip.names.join(',');
          }
        });
        this.historyTableData = data;
      } else {
        this.$message.error(result.msg);
      }
    }, err => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 获得所有的责任人
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
   * 设置工单状态类型下拉框选项
   */
  private setSelectOption(): void {
    this.selectOption = (WorkOrderStatusUtil.getWorkOrderStatusList(this.$nzI18n)).filter(item => {
      return item.value === WorkOrderStatusEnum.completed || item.value === WorkOrderStatusEnum.singleBack;
    });
  }

  /**
   * 打开关联告警modal
   */
  public showRefAlarmModal(data: ClearBarrierWorkOrderModel): void {
    // 关联故障
    if (data.troubleId && data.troubleId.length > 0) {
      this.faultData = data.troubleId;
      this.isShowRefFault = true;
      return;
    }
    // 当前告警
    this.$alarmService.queryCurrentAlarmInfoById(data.refAlarm).subscribe((result: ResultModel<AlarmListModel>) => {
      if (result.code === 0 && result.data) {
        this.alarmData = result.data;
        if (this.alarmData.alarmContinousTime) {
          this.alarmData.alarmContinousTime = `${this.alarmData.alarmContinousTime}${this.alarmLanguage.hour}`;
        } else {
          this.alarmData.alarmContinousTime = '';
        }
        this.isShowRefAlarm = true;
      } else {
        // 历史告警
        this.$alarmService.queryAlarmHistoryInfo(data.refAlarm).subscribe((resData: ResultModel<AlarmListModel>) => {
          if (resData.code === 0 && resData.data) {
            this.alarmData = resData.data;
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
   * 显示告警弹窗
   */
  public closeRefAlarm(): void {
    this.isShowRefAlarm = false;
    this.alarmData = null;
  }

  /**
   * 关闭故障弹窗
   */
  public closeRefFault(): void {
    this.isShowRefFault = false;
  }
  /**
   * 根据ID跳转
   */
  private getId(): void {
    if (this.$active.snapshot.queryParams.id) {
      const workOrderId = this.$active.snapshot.queryParams.id;
      this.queryCondition.bizCondition.procIds = [workOrderId];
    }
  }

  /**
   * 导出
   */
  public handleExport(event: ListExportModel<ClearBarrierWorkOrderModel[]>): void {
    // 生成导出条件
    this.exportParams.queryCondition = new QueryConditionModel();
    this.exportParams.queryCondition.filterConditions = this.queryCondition.filterConditions;
    this.exportParams.excelType = event.excelType;
    if (this.selectDataId.length) {
      const index = this.exportParams.queryCondition.filterConditions.findIndex(v => v.filterField === '_id');
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
    this.$clearBarrierWorkOrderService.exportHistoryWorkOrder(this.exportParams).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.inspectionLanguage.operateMsg.exportSuccess);
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 打开责任单位选择器
   */
  public showModal(filterValue: FilterCondition): void {
    this.departFilterValue = filterValue;
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
   * 初始化单位选择器配置
   */
  private initTreeSelectorConfig(): void {
    this.treeSelectorConfig = {
      title: this.workOrderLanguage.selectUnit,
      width: '400px',
      height: '300px',
      treeNodes: this.treeNodes,
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
   * 责任单位选择结果
   * param event
   */
  public selectDataChange(event: DepartmentUnitModel[]): void {
    this.selectUnitName = '';
    if (event && event.length > 0) {
      this.selectUnitName = event[0].deptName;
      this.filterValue['filterValue'] = event[0].deptCode;
      this.departFilterValue.filterName = this.selectUnitName;
      FacilityForCommonUtil.setTreeNodesStatus(this.treeNodes, [event[0].id]);
    }
  }

  /**
   * 查询单位
   */
  private queryDeptList(): Promise<boolean>  {
    return new Promise((resolve, reject) => {
      this.$userService.queryAllDepartment().subscribe((result: ResultModel<DepartmentUnitModel[]>) => {
        this.treeNodes = result.data || [];
        resolve(true);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * 初始化表格配置
   */
  public initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      primaryKey: '06-2-2',
      showSearchSwitch: true,
      showSizeChanger: true,
      showSearchExport: true,
      scroll: {x: '1800px', y: '600px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          // 工单名称
          title: this.workOrderLanguage.name, key: 'title', width: 150,
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}},
        },
        {
          // 工单状态
          title: this.workOrderLanguage.status, key: 'status', width: 120,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'status',
          minWidth: 100,
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: this.selectOption},
          type: 'render',
          renderTemplate: this.statusTemp,
        },
        {  // 实际完工时间
          title: this.workOrderLanguage.realCompleteTime, key: 'realityCompletedTime', width: 180,
          configurable: true,
          isShowSort: true,
          searchable: true,
          pipe: 'date',
          searchConfig: {type: 'dateRang'}
        },
        { // 来源
          title: this.workOrderLanguage.resourceType, key: 'dataResourceType', width: 150,
          configurable: true,
          searchable: true, isShowSort: true,
          searchKey: 'dataResourceType',
          searchConfig: {
            type: 'select',
            selectInfo: [
              {label: this.workOrderLanguage.alarm, code: '1'},
              {label: this.workOrderLanguage.fault, code: '2'}
            ],
            label: 'label', value: 'code'
          }
        },
        {
          // 关联告警
          title: `${this.workOrderLanguage.relevance}${this.workOrderLanguage.alarm}/${this.workOrderLanguage.fault}`,
          key: 'dataResourceName', width: 180,
          configurable: true,
          type: 'render',
          renderTemplate: this.refAlarmTemp,
          searchable: true,
          searchKey: 'dataResourceName',
          searchConfig: {type: 'input'}
        },
        {
          // 设施类型
          title: this.workOrderLanguage.deviceType, key: 'deviceType', width: 180,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'deviceType',
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleFacility(this.$nzI18n),
            label: 'label', value: 'code'
          },
          type: 'render',
          renderTemplate: this.deviceTemp,
        },
        {
          // 设施名称
          title: this.workOrderLanguage.deviceName, key: 'deviceName', width: 180,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'deviceId',
          searchConfig: {type: 'render', renderTemplate: this.deviceNameSearch},
        },
        {
          // 设施区域
          title: this.workOrderLanguage.deviceArea, key: 'deviceAreaName', width: 180,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'deviceAreaCode',
          searchConfig: {type: 'render', renderTemplate: this.areaSearch},
        },
        {// 设备名称
          title: this.workOrderLanguage.equipmentName, key: 'equipmentName', width: 180,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'equipmentName',
          searchConfig: {type: 'render', renderTemplate: this.equipmentSearch},
        },
        {// 设备类型
          title: this.workOrderLanguage.equipmentType, key: 'equipmentType', width: 180,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'equipmentType',
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n),
            label: 'label', value: 'code'
          },
          type: 'render',
          renderTemplate: this.equipmentTemp,
        },
        {
          // 责任单位
          title: this.workOrderLanguage.accountabilityUnitName, key: 'accountabilityDeptName', width: 180,
          configurable: true,
          searchable: true,
          searchKey: 'accountabilityDept',
          searchConfig: {type: 'render', renderTemplate: this.unitNameSearch}
        },
        {
          // 责任人
          title: this.workOrderLanguage.assignName, key: 'assignName', width: 180,
          configurable: true,
          searchable: true,
          searchKey: 'assign',
          /*searchConfig: {type: 'select', selectType: 'multiple', selectInfo: this.roleArr}*/
          searchConfig: {type: 'render', renderTemplate: this.userSearchTemp},
        },
        {
          title: this.inspectionLanguage.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 130, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: false,
      showEsPagination: false,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [
        { // 重新生成
          text: this.inspectionLanguage.regenerate,
          key: 'isShowTurnBackConfirmIcon',
          className: 'fiLink-rebuild-order',
          permissionCode: '06-2-2-3',
          /*needConfirm: true,
          confirmContent: this.workOrderLanguage.turnBackConfirmContent,*/
          handle: (currentIndex: ClearBarrierWorkOrderModel) => {
            const id = currentIndex.procId;
            let type = '';
            if (currentIndex.refAlarm) {
              type = RefAlarmFaultEnum.alarm;
            } else if (currentIndex.troubleId) {
              type = RefAlarmFaultEnum.fault;
            }
            this.$workOrderCommonUtil.queryDataRole(currentIndex.procId, ClearBarrierOrInspectEnum.clearBarrier).then(flag => {
              if (flag) {
                this.$router.navigate(['business/work-order/clear-barrier/unfinished-detail/rebuild'],
                  {queryParams: {id: id, status: WorkOrderPageTypeEnum.rebuild, type: type, route: WorkOrderPageTypeEnum.finished}}).then();
              }
            });
          }
        },
        {  // 图片
          text: this.inspectionLanguage.relatedPictures,
          className: 'fiLink-view-photo',
          permissionCode: '06-2-2-1',
          handle: (data: ClearBarrierWorkOrderModel) => {
            this.$workOrderCommonUtil.queryImageForView(data.deviceId, data.procId);
          }
        },
        {
          // 详情
          text: this.workOrderLanguage.orderDetail,
          className: 'fiLink-view-detail',
          permissionCode: '06-2-2-2',
          handle: (currentIndex: ClearBarrierWorkOrderModel) => {
            this.$router.navigate(['business/work-order/clear-barrier/finished-detail/view'],
              {queryParams: {id: currentIndex.procId, type: WorkOrderPageTypeEnum.finished}}).then();
          }
        },
      ],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        if (event && event.length === 0) {
          this.isReset = true;
          this.selectEquipments = [];
          this.checkEquipmentObject = {
            ids: [], name: '', type: ''
          };
          this.selectUnitName = '';
          FacilityForCommonUtil.setTreeNodesStatus(this.treeNodes, []);
          this.filterObj.areaName = '';
          FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes || [], null);
          this.filterObj.deviceName = '';
          this.filterObj.deviceIds = [];
          this.initDeviceObjectConfig();
          this.selectUserList = [];
        }
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
      handleSelect: (event) => {
        this.selectDataId = event.map(v => v.procId);
      },
      handleExport: (event: ListExportModel<ClearBarrierWorkOrderModel[]>) => {
        this.exportParams.columnInfoList = event.columnInfoList;
        const params = ['status', 'dataResourceType', 'equipmentType', 'realityCompletedTime', 'deviceType'];
        this.exportParams.columnInfoList.forEach(item => {
          if (params.indexOf(item.propertyName) > -1) {
            item.isTranslation = 1;
          }
        });
        this.handleExport(event);
      }
    };
  }

  /**
   * 区域展示
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
      this.areaFilterValue.filterValue = null;
      this.areaFilterValue.filterName = item[0].areaName;
    }
  }

  /**
   * 初始化选择区域配置
   * param nodes
   */
  private initAreaSelectorConfig(): void {
    this.areaSelectorConfig = {
      width: '400px',
      height: '300px',
      title: `${this.inspectionLanguage.selected}${this.inspectionLanguage.area}`,
      treeSetting: {
        check: { enable: true, chkStyle: 'radio', radioType: 'all' },
        data: {
          simpleData: { enable: true, idKey: 'areaId', },
          key: { name: 'areaName' },
        },
        view: { showIcon: false, showLine: false }
      },
      treeNodes: this.areaNodes || []
    };
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
   * 设备名称（告警对象）
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

  /**
   * 告警对象过滤
   */
  public onSelectEquipment(event: EquipmentListModel[]): void {
    this.selectEquipments = event;
    this.checkEquipmentObject = {
      ids: event.map(v => v.equipmentId) || [], type: '',
      name: event.map(v => v.equipmentName).join(',') || ''
    };
    this.selectedEquip = event;
    this.equipmentFilterValue.filterValue = this.checkEquipmentObject.ids.length === 0 ? null : this.checkEquipmentObject.ids;
    this.equipmentFilterValue.filterName = this.checkEquipmentObject.name;
  }

  /**
   * 告警对象弹框
   */
  public openEquipmentSelector(filterValue: FilterCondition): void {
    this.equipmentVisible = true;
    this.equipmentFilterValue = filterValue;
  }
  /**
   * 完工记录分页
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }
}
