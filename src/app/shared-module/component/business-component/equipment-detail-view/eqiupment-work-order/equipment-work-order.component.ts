import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {Router} from '@angular/router';
import * as _ from 'lodash';
import {FiLinkModalService} from '../../../../service/filink-modal/filink-modal.service';
import {PageModel} from '../../../../model/page.model';
import {TableConfigModel} from '../../../../model/table-config.model';
import {FilterCondition, QueryConditionModel} from '../../../../model/query-condition.model';
import {WorkOrderLanguageInterface} from '../../../../../../assets/i18n/work-order/work-order.language.interface';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {ResultModel} from '../../../../model/result.model';
import {OperatorEnum} from '../../../../enum/operator.enum';
import {ResultCodeEnum} from '../../../../enum/result-code.enum';
import {LanguageEnum} from '../../../../enum/language.enum';
import {PageSizeEnum} from '../../../../enum/page-size.enum';
import {WorkOrderTypeEnum} from '../../../../../core-module/enum/work-order-type.enum';
import {WorkOrderResourceEnum, WorkOrderStatusEnum} from '../../../../../core-module/enum/work-order/work-order.enum';
import {SessionUtil} from '../../../../util/session-util';
import {WorkOrderForCommonService} from '../../../../../core-module/api-service/work-order';
import {WorkOrderStatusUtil} from '../../../../../core-module/business-util/work-order/work-order-for-common.util';
import {InspectionWorkOrderModel} from '../../../../../core-module/model/work-order/inspection-work-order.model';
import {ClearBarrierWorkOrderModel} from '../../../../../core-module/model/work-order/clear-barrier-work-order.model';
import {InspectionLanguageInterface} from "../../../../../../assets/i18n/inspection-task/inspection.language.interface";
import {InstallWorkOrderModel} from '../../../../../core-module/model/work-order/install-work-order.model';
import {AlarmConfirmWorkOrderModel} from '../../../../../core-module/model/work-order/alarm-confirm.model';
import {TroubleSourceEnum} from "../../../../../core-module/enum/trouble/trouble-common.enum";
import {RemoveWorkOrderModel} from '../../../../../core-module/model/work-order/remove-work-order.model';

/**
 * 设备工单组件
 * created by PoHe
 */
@Component({
  selector: 'app-equipment-work-order',
  templateUrl: './equipment-work-order.component.html'
})
export class EquipmentWorkOrderComponent implements OnInit {

  @Input()
  public equipmentId: string;
  // 工单状态模版实例
  @ViewChild('statusTemp') statusTemp: TemplateRef<HTMLDocument>;
  // 数据来源
  @ViewChild('dataResource') dataResource: TemplateRef<HTMLDocument>;
  // 关联告警
  @ViewChild('refAlarmTemplate') refAlarmTemplate: TemplateRef<HTMLDocument>;
  // 巡检工单列表数据集
  public dataSet: InspectionWorkOrderModel[] = [];
  // 消障工单
  public clearBarrierDataSet: ClearBarrierWorkOrderModel[] = [];
  // 安装工单
  public installDataSet: InstallWorkOrderModel[] = [];
  // 告警确认工单
  public alarmConfirmDataSet: AlarmConfirmWorkOrderModel[] = [];
  // 拆除工单
  public removeDataSet: RemoveWorkOrderModel[] = [];
  // 巡检分页参数 卡片数据只显示5条数据
  public inspectionPageBean: PageModel = new PageModel(PageSizeEnum.sizeFive, 1);
  // 消障工单列表分页
  public clearPageBean: PageModel = new PageModel(PageSizeEnum.sizeFive, 1);
  // 安装工单分页参数
  public installPageBean: PageModel = new PageModel(PageSizeEnum.sizeFive, 1);
  // 告警确认工单分页参数
  public alarmConfirmPageBean: PageModel = new PageModel(PageSizeEnum.sizeFive, 1);
  // 拆除工单分页参数
  public removePageBean: PageModel = new PageModel(PageSizeEnum.sizeFive, 1);
  // 巡检工单列表参数
  public tableConfig: TableConfigModel;
  // 消障工单列表参数
  public clearBarrierTableConfig: TableConfigModel;
  // 安装工单列表参数
  public installTableConfig: TableConfigModel;
  // 告警确认工单列表参数
  public alarmConfirmTableConfig: TableConfigModel;
  // 拆除工单列表参数
  public removeTableConfig: TableConfigModel;
  // 设备国际化
  public language: FacilityLanguageInterface;
  // 工单类型枚举
  public workOrderTypeEnum = WorkOrderTypeEnum;
  // 故障枚举
  public  troubleSourceEnum = TroubleSourceEnum;
  // 工单国际化
  public workOrderLanguage: WorkOrderLanguageInterface;
  // 国际化
  public inspectionLanguage: InspectionLanguageInterface;
  //  公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 数据来源枚举
  public dataSourceEnum = WorkOrderResourceEnum;
  // 国际化模块枚举
  public languageEnum = LanguageEnum;
  // 设备工单状态枚举值
  public equipWorkOrderStatusEnum = WorkOrderStatusEnum;
  // 巡检查询条件
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // 消障工单查询条件
  private queryClearCondition: QueryConditionModel = new QueryConditionModel();
  private queryRemoveCondition: QueryConditionModel = new QueryConditionModel();
  // 安装工单查询条件
  private queryInstallCondition: QueryConditionModel = new QueryConditionModel();
  // 告警确认工单查询条件
  private queryAlarmConfirmCondition: QueryConditionModel = new QueryConditionModel();
  // 工单类型默认巡检
  private workOrderType = WorkOrderTypeEnum.inspection;
  // 更多路由条状路径
  private moreRouter: string = 'business/work-order/inspection/unfinished-list';

  /**
   * 构造器
   */
  constructor(
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $router: Router,
    private $workOrderForCommonService: WorkOrderForCommonService
  ) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.workOrderLanguage = this.$nzI18n.getLocaleData(LanguageEnum.workOrder);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // 设置每页查询5条数据
    this.queryCondition.pageCondition.pageSize = PageSizeEnum.sizeFive;
    this.queryCondition.pageCondition.pageNum = 1;
    this.queryClearCondition.pageCondition.pageNum = 1;
    this.queryClearCondition.pageCondition.pageSize = PageSizeEnum.sizeFive;
    this.queryInstallCondition.pageCondition.pageNum = 1;
    this.queryInstallCondition.pageCondition.pageSize = PageSizeEnum.sizeFive;
    this.queryAlarmConfirmCondition.pageCondition.pageNum = 1;
    this.queryAlarmConfirmCondition.pageCondition.pageSize = PageSizeEnum.sizeFive;
    this.queryRemoveCondition.pageCondition.pageNum = 1;
    this.queryRemoveCondition.pageCondition.pageSize = PageSizeEnum.sizeFive;
    this.inspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    // 初始化表格
    this.initTableConfig();
    // 查询巡检工单
    this.refreshInspectionData();


  }

  /**
   *  点击巡检工单tab 事件
   */
  public onClickTab(type: WorkOrderTypeEnum): void {
    this.workOrderType = type;
    if (type === WorkOrderTypeEnum.inspection) {
      this.refreshInspectionData();
      this.moreRouter = 'business/work-order/inspection/unfinished-list';
    } else if (type === WorkOrderTypeEnum.clear) {
      this.refreshClearBarrier();
      this.moreRouter = 'business/work-order/clear-barrier/unfinished-list';
    } else if (type === WorkOrderTypeEnum.install) {
      this.moreRouter = 'business/work-order/installation/unfinished-list';
      // 查询安装工单
      this.refreshInstallData();
    } else if (type === WorkOrderTypeEnum.remove) {
      this.moreRouter = 'business/work-order/dismantle-barrier/unfinished-list';
      // 查询拆除工单
      this.refreshRemoveData();
    } else {
      this.refreshAlarmConfirmData();
      this.moreRouter = 'business/work-order/alarm-confirm/unfinished-list';
    }
  }

  /**
   * 判断是否有操作权限
   */
  public checkHasRole(code: string): boolean {
    return SessionUtil.checkHasRole(code);
  }

  /**
   *  显示更多工单
   */
  public onClickShowMoreWorkOrder(): void {
    const queryParams = {queryParams: {equipmentId: this.equipmentId}};
    this.$router.navigate([this.moreRouter], queryParams).then();
  }

  /**
   * 查询告警确认工单数据列表
   */
  private refreshAlarmConfirmData(): void {
    const alarmFilter = new FilterCondition('equipment.equipmentId', OperatorEnum.in, [this.equipmentId]);
    this.queryAlarmConfirmCondition.filterConditions = [alarmFilter];
    this.alarmConfirmTableConfig.isLoading = true;
    this.$workOrderForCommonService.queryConfirmListForHome(this.queryAlarmConfirmCondition).subscribe((res: ResultModel<AlarmConfirmWorkOrderModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        this.alarmConfirmTableConfig.isLoading = false;
        this.alarmConfirmDataSet = res.data || [];
        if (!_.isEmpty(this.alarmConfirmDataSet)) {
          this.alarmConfirmDataSet.forEach(item => {
            // 设置工单状态的图标样式
            item.statusClass = WorkOrderStatusUtil.getWorkOrderIconClassName(item.status);
          });
        }
      } else {
        this.alarmConfirmTableConfig.isLoading = false;
      }
    }, () => this.alarmConfirmTableConfig.isLoading = false);
  }

  /**
   * 查询安装工单数据
   */
  private refreshInstallData(): void {
    const filterTemp = new FilterCondition(
      'equipment.equipmentId', OperatorEnum.in, [this.equipmentId]);
    this.queryInstallCondition.filterConditions = [filterTemp];
    this.installTableConfig.isLoading = true;
    this.$workOrderForCommonService.queryInstallListForHome(this.queryInstallCondition).subscribe((res: ResultModel<InstallWorkOrderModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        this.installDataSet = res.data || [];
        this.installTableConfig.isLoading = false;
        if (!_.isEmpty(this.installDataSet)) {
          this.installDataSet.forEach(item => {
            // 设置工单状态的图标样式
            item.statusClass = WorkOrderStatusUtil.getWorkOrderIconClassName(item.status);
          });
        }
      } else {
        this.installTableConfig.isLoading = false;
      }
    }, () => this.installTableConfig.isLoading = false);
  }

  /**
   *  查询巡检工单列表数据
   */
  private refreshInspectionData(): void {
    // 测试数据 CfkI8qzczAfowshsYIQ
    const filterTemp = new FilterCondition(
      'procRelatedEquipment.equipmentId', OperatorEnum.eq, this.equipmentId);
    // 如果条件集中不存在设备ID的过滤条件就添加进去
    const index = this.queryCondition.filterConditions.findIndex(
      item => item.filterField === 'procRelatedEquipment.equipmentId');
    if (index < 0) {
      this.queryCondition.filterConditions =
        this.queryCondition.filterConditions.concat([filterTemp]);
    }
    this.tableConfig.isLoading = true;
    this.$workOrderForCommonService.queryInspectionList(this.queryCondition).subscribe(
      (result: ResultModel<InspectionWorkOrderModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.dataSet = result.data || [];
          this.inspectionPageBean.Total = result.totalCount;
          this.inspectionPageBean.pageIndex = result.pageNum;
          this.inspectionPageBean.pageSize = result.size;
          this.tableConfig.isLoading = false;
          if (!_.isEmpty(this.dataSet)) {
            this.dataSet.forEach(item => {
              // 设置工单状态的图标样式
              item.statusClass = WorkOrderStatusUtil.getWorkOrderIconClassName(item.status);
            });
          }
        } else {
          this.tableConfig.isLoading = false;
        }
      }, () => {
        this.tableConfig.isLoading = false;
      });
  }

  /**
   * 查询消障工单列表
   */
  private refreshClearBarrier(): void {
    // 测试数据 0D2rfo4mm1R071bO90
    const clearFilter = new FilterCondition('equipment.equipmentId',
      OperatorEnum.eq, this.equipmentId);
    // 如果条件中不存在设备ID的过滤条件就添加进去
    const index = this.queryClearCondition.filterConditions.findIndex(
      item => item.filterField === 'equipment.equipmentId');
    if (index < 0) {
      this.queryClearCondition.filterConditions =
        this.queryClearCondition.filterConditions.concat([clearFilter]);
    }
    this.clearBarrierTableConfig.isLoading = true;
    this.$workOrderForCommonService.queryClearList(this.queryClearCondition).subscribe(
      (result: ResultModel<ClearBarrierWorkOrderModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.clearBarrierDataSet = result.data || [];
          this.clearPageBean.pageSize = result.size;
          this.clearPageBean.pageIndex = result.pageNum;
          this.clearPageBean.Total = result.totalCount;
          this.clearBarrierTableConfig.isLoading = false;
          if (!_.isEmpty(this.clearBarrierDataSet)) {
            this.clearBarrierDataSet.forEach(item => {
              // 获取状态的图标
              item.statusClass = WorkOrderStatusUtil.getWorkOrderIconClassName(item.status);
            });
          }
        } else {
          this.clearBarrierTableConfig.isLoading = false;
        }
      }, () => {
        this.clearBarrierTableConfig.isLoading = false;
      });
  }
  /**
   * 查询拆除工单列表
   */
  private refreshRemoveData(): void {
    // 测试数据 0D2rfo4mm1R071bO90
    const removeFilter = new FilterCondition('equipmentId',
      OperatorEnum.eq, this.equipmentId);
    // 如果条件中不存在设备ID的过滤条件就添加进去
    const index = this.queryRemoveCondition.filterConditions.findIndex(
      item => item.filterField === 'equipmentId');
    if (index < 0) {
      this.queryRemoveCondition.filterConditions =
        this.queryRemoveCondition.filterConditions.concat([removeFilter]);
    }
    this.clearBarrierTableConfig.isLoading = true;
    this.$workOrderForCommonService.queryEquipmentRemoveList(this.queryRemoveCondition).subscribe(
      (result: ResultModel<RemoveWorkOrderModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.removeDataSet = result.data || [];
          this.removePageBean.pageSize = result.size;
          this.removePageBean.pageIndex = result.pageNum;
          this.removePageBean.Total = result.totalCount;
          this.removeTableConfig.isLoading = false;
          if (!_.isEmpty(this.removeDataSet)) {
            this.removeDataSet.forEach(item => {
              // 获取状态的图标
              item.statusClass = WorkOrderStatusUtil.getWorkOrderIconClassName(item.status);
            });
          }
        } else {
          this.removeTableConfig.isLoading = false;
        }
      }, () => {
        this.removeTableConfig.isLoading = false;
      });
  }

  /**
   *   初始化表格参数
   */
  private initTableConfig(): void {
    // 工单公用字段
    const commonConfig = [
      //  序号
      {
        type: 'serial-number',
        title: this.language.serialNumber,
        width: 62,
        fixedStyle: {fixedLeft: true, style: {left: '0'}}
      },
      { // 工单名称
        title: this.workOrderLanguage.name,
        searchable: false,
        key: 'title', width: 250
      },
      { // 　工单状态
        title: this.workOrderLanguage.status,
        key: 'statusName',
        type: 'render',
        width: 250,
        searchable: false,
        renderTemplate: this.statusTemp,
      },
      { // 责任单位
        title: this.workOrderLanguage.accountabilityUnitName,
        key: 'accountabilityDeptName',
        width: 250,
        searchable: false,
      },
      { // 责任人
        title: this.workOrderLanguage.assignName,
        key: 'assignName',
        width: 250,
        searchable: false,
      },
      { // 期望完成时间
        title: this.workOrderLanguage.expectedCompleteTime,
        key: 'expectedCompletedTime',
        pipe: 'date',
        width: 250,
        searchable: false,
      },
      { // 剩余天数
        title: this.workOrderLanguage.lastDays,
        key: 'lastDays',
        width: 250,
        searchable: false,
      }
    ];
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      scroll: {x: '900px', y: '400px'},
      columnConfig: commonConfig,
      noIndex: true,
      topButtons: [],
      showPagination: false,
      bordered: false,
      showSearch: false,
      operation: []
    };
    const tempColumn = [
      { //  数据来源
        title: this.language.dataResourceType, width: 120,
        key: 'dataResourceType',
        type: 'render',
        renderTemplate: this.dataResource,
        searchable: false
      },
      { //  关联故障
        title: this.language.associatedFault, width: 120,
        key: 'dataResourceName',
        searchable: false
      },
      { // 操作
        title: this.commonLanguage.operate, searchable: false,
        searchConfig: {
          type: 'operate'
        },
        key: '',
        width: 150,
        fixedStyle: {fixedRight: true, style: {right: '0px'}}
      }];
    this.clearBarrierTableConfig = {
      isDraggable: true,
      isLoading: true,
      scroll: {x: '900px', y: '400px'},
      noIndex: true,
      showPagination: false,
      columnConfig: _.concat(commonConfig, tempColumn),
      topButtons: [],
      showSearch: false,
      bordered: false,
      operation: [
        { // 查看工单
          text: this.language.viewWorkOrder,
          className: 'fiLink-work-order',
          handle: (data: ClearBarrierWorkOrderModel) => {
            this.$router.navigate(['business/work-order/clear-barrier/unfinished-list'],
              {queryParams: {id: data.procId}}).then();
          }
        },
        { // 查看来源
          text: this.language.viewResource,
          className: 'fiLink-alarm-facility',
          permissionCode: '02-1',
          handle: (data: ClearBarrierWorkOrderModel) => {
            if (data.dataResourceType === WorkOrderResourceEnum.alarm) {
              // 跳转到告警
              if (!data.refAlarm) {
                this.$message.info(this.language.workOrderNotRefAlarm);
                return;
              }
              const queryParams = {
                id: data.refAlarm
              };
              // 关联告警为当前告警
              this.$router.navigate([`business/alarm/current-alarm`],
                {queryParams: queryParams}).then();
            } else {
              if (!data.troubleId) {
                this.$message.info(this.language.workOrderNotRefTrouble);
                return;
              }
              const queryParams = {
                id: data.troubleId
              };
              // 跳转到故障页面
              this.$router.navigate([`business/trouble/trouble-list`],
                {queryParams: queryParams}).then();
            }
          }
        }
      ]
    };
    const installColumn = _.cloneDeep(commonConfig).filter(item => item.key !== 'lastDays');
    installColumn.forEach(e => {
      if (e.key === 'expectedCompletedTime') {
        e.key = 'planCompletedTime'
      }
    });
    this.installTableConfig = {
      isDraggable: true,
      isLoading: false,
      scroll: {x: '900px', y: '400px'},
      columnConfig: installColumn,
      noIndex: true,
      topButtons: [],
      showPagination: false,
      bordered: false,
      showSearch: false,
      operation: []
    }
    // 初始化告警确认工单
    this.alarmConfirmTableConfig = {
      isDraggable: true,
      scroll: {x: '900px', y: '400px'},
      isLoading: false,
      columnConfig: [
        //  序号
        {
          width: 62,
          type: 'serial-number',
          title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '0'}}
        },
        { // 工单名称
          key: 'title', width: 250,
          title: this.workOrderLanguage.name,
          searchable: false
        },
        { // 　工单状态
          title: this.workOrderLanguage.status,
          key: 'statusName',
          width: 200,
          searchable: false,
          type: 'render',
          renderTemplate: this.statusTemp,
        },
        { // 期望完成时间
          key: 'expectedCompletedTime',
          title: this.workOrderLanguage.expectedCompleteTime,
          width: 150,
          pipe: 'date',
          searchable: false,
        },
        {
          // 关联告警
          title: this.workOrderLanguage.relevancyAlarm, key: 'refAlarmName',
          configurable: false, isShowSort: false,
          searchable: false, width: 150
        },
        {
          // 待确认原因
          title: this.inspectionLanguage.confirmReason, key: 'uncertainReason',
          configurable: false, width: 150,
          searchable: false, searchConfig: {type: 'input'}
        },
        {
          // 实际告警原因
          title: this.inspectionLanguage.realAlarmReason, key: 'realityAlarmReason',
          configurable: false, width: 150,
          searchable: false, searchConfig: {type: 'input'}
        },
        {
          // 责任单位
          title: this.workOrderLanguage.accountabilityUnitName, key: 'accountabilityDeptName',
          configurable: false, isShowSort: false,
          searchable: false, width: 150

        },
        {// 责任人
          title: this.workOrderLanguage.assignName, key: 'assignName', width: 140,
          configurable: false,
          searchable: false, isShowSort: false
        }
      ],
      noIndex: true,
      topButtons: [],
      showPagination: false,
      bordered: false,
      showSearch: false,
      operation: []
    }
    this.removeTableConfig = {
      isDraggable: true,
      isLoading: true,
      scroll: {x: '900px', y: '400px'},
      noIndex: true,
      showPagination: false,
      columnConfig: _.concat(commonConfig, tempColumn),
      topButtons: [],
      showSearch: false,
      bordered: false,
      operation: [
        { // 查看工单
          text: this.language.viewWorkOrder,
          className: 'fiLink-work-order',
          handle: (data: RemoveWorkOrderModel) => {
            this.$router.navigate(['business/work-order/dismantle-barrier/unfinished-list'],
              {queryParams: {id: data.procId}}).then();
          }
        },
        { // 查看来源
          text: this.language.viewResource,
          className: 'fiLink-alarm-facility',
          permissionCode: '02-1',
          handle: (data: RemoveWorkOrderModel) => {
            if (data.dataResourceType === WorkOrderResourceEnum.alarm) {
              // 跳转到告警
              if (!data.refAlarm) {
                this.$message.info(this.language.workOrderNotRefAlarm);
                return;
              }
              const queryParams = {
                id: data.refAlarm
              };
              // 关联告警为当前告警
              this.$router.navigate([`business/alarm/current-alarm`],
                {queryParams: queryParams}).then();
            } else {
              if (!data.troubleId) {
                this.$message.info(this.language.workOrderNotRefTrouble);
                return;
              }
              const queryParams = {
                id: data.troubleId
              };
              // 跳转到故障页面
              this.$router.navigate([`business/trouble/trouble-list`],
                {queryParams: queryParams}).then();
            }
          }
        }
      ]
    };
  }
}
