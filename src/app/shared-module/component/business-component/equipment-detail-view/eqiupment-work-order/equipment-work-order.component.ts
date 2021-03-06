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
 * ??????????????????
 * created by PoHe
 */
@Component({
  selector: 'app-equipment-work-order',
  templateUrl: './equipment-work-order.component.html'
})
export class EquipmentWorkOrderComponent implements OnInit {

  @Input()
  public equipmentId: string;
  // ????????????????????????
  @ViewChild('statusTemp') statusTemp: TemplateRef<HTMLDocument>;
  // ????????????
  @ViewChild('dataResource') dataResource: TemplateRef<HTMLDocument>;
  // ????????????
  @ViewChild('refAlarmTemplate') refAlarmTemplate: TemplateRef<HTMLDocument>;
  // ???????????????????????????
  public dataSet: InspectionWorkOrderModel[] = [];
  // ????????????
  public clearBarrierDataSet: ClearBarrierWorkOrderModel[] = [];
  // ????????????
  public installDataSet: InstallWorkOrderModel[] = [];
  // ??????????????????
  public alarmConfirmDataSet: AlarmConfirmWorkOrderModel[] = [];
  // ????????????
  public removeDataSet: RemoveWorkOrderModel[] = [];
  // ?????????????????? ?????????????????????5?????????
  public inspectionPageBean: PageModel = new PageModel(PageSizeEnum.sizeFive, 1);
  // ????????????????????????
  public clearPageBean: PageModel = new PageModel(PageSizeEnum.sizeFive, 1);
  // ????????????????????????
  public installPageBean: PageModel = new PageModel(PageSizeEnum.sizeFive, 1);
  // ??????????????????????????????
  public alarmConfirmPageBean: PageModel = new PageModel(PageSizeEnum.sizeFive, 1);
  // ????????????????????????
  public removePageBean: PageModel = new PageModel(PageSizeEnum.sizeFive, 1);
  // ????????????????????????
  public tableConfig: TableConfigModel;
  // ????????????????????????
  public clearBarrierTableConfig: TableConfigModel;
  // ????????????????????????
  public installTableConfig: TableConfigModel;
  // ??????????????????????????????
  public alarmConfirmTableConfig: TableConfigModel;
  // ????????????????????????
  public removeTableConfig: TableConfigModel;
  // ???????????????
  public language: FacilityLanguageInterface;
  // ??????????????????
  public workOrderTypeEnum = WorkOrderTypeEnum;
  // ????????????
  public  troubleSourceEnum = TroubleSourceEnum;
  // ???????????????
  public workOrderLanguage: WorkOrderLanguageInterface;
  // ?????????
  public inspectionLanguage: InspectionLanguageInterface;
  //  ???????????????
  public commonLanguage: CommonLanguageInterface;
  // ??????????????????
  public dataSourceEnum = WorkOrderResourceEnum;
  // ?????????????????????
  public languageEnum = LanguageEnum;
  // ???????????????????????????
  public equipWorkOrderStatusEnum = WorkOrderStatusEnum;
  // ??????????????????
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // ????????????????????????
  private queryClearCondition: QueryConditionModel = new QueryConditionModel();
  private queryRemoveCondition: QueryConditionModel = new QueryConditionModel();
  // ????????????????????????
  private queryInstallCondition: QueryConditionModel = new QueryConditionModel();
  // ??????????????????????????????
  private queryAlarmConfirmCondition: QueryConditionModel = new QueryConditionModel();
  // ????????????????????????
  private workOrderType = WorkOrderTypeEnum.inspection;
  // ????????????????????????
  private moreRouter: string = 'business/work-order/inspection/unfinished-list';

  /**
   * ?????????
   */
  constructor(
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $router: Router,
    private $workOrderForCommonService: WorkOrderForCommonService
  ) {
  }

  /**
   * ???????????????
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.workOrderLanguage = this.$nzI18n.getLocaleData(LanguageEnum.workOrder);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // ??????????????????5?????????
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
    // ???????????????
    this.initTableConfig();
    // ??????????????????
    this.refreshInspectionData();


  }

  /**
   *  ??????????????????tab ??????
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
      // ??????????????????
      this.refreshInstallData();
    } else if (type === WorkOrderTypeEnum.remove) {
      this.moreRouter = 'business/work-order/dismantle-barrier/unfinished-list';
      // ??????????????????
      this.refreshRemoveData();
    } else {
      this.refreshAlarmConfirmData();
      this.moreRouter = 'business/work-order/alarm-confirm/unfinished-list';
    }
  }

  /**
   * ???????????????????????????
   */
  public checkHasRole(code: string): boolean {
    return SessionUtil.checkHasRole(code);
  }

  /**
   *  ??????????????????
   */
  public onClickShowMoreWorkOrder(): void {
    const queryParams = {queryParams: {equipmentId: this.equipmentId}};
    this.$router.navigate([this.moreRouter], queryParams).then();
  }

  /**
   * ????????????????????????????????????
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
            // ?????????????????????????????????
            item.statusClass = WorkOrderStatusUtil.getWorkOrderIconClassName(item.status);
          });
        }
      } else {
        this.alarmConfirmTableConfig.isLoading = false;
      }
    }, () => this.alarmConfirmTableConfig.isLoading = false);
  }

  /**
   * ????????????????????????
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
            // ?????????????????????????????????
            item.statusClass = WorkOrderStatusUtil.getWorkOrderIconClassName(item.status);
          });
        }
      } else {
        this.installTableConfig.isLoading = false;
      }
    }, () => this.installTableConfig.isLoading = false);
  }

  /**
   *  ??????????????????????????????
   */
  private refreshInspectionData(): void {
    // ???????????? CfkI8qzczAfowshsYIQ
    const filterTemp = new FilterCondition(
      'procRelatedEquipment.equipmentId', OperatorEnum.eq, this.equipmentId);
    // ?????????????????????????????????ID??????????????????????????????
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
              // ?????????????????????????????????
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
   * ????????????????????????
   */
  private refreshClearBarrier(): void {
    // ???????????? 0D2rfo4mm1R071bO90
    const clearFilter = new FilterCondition('equipment.equipmentId',
      OperatorEnum.eq, this.equipmentId);
    // ??????????????????????????????ID??????????????????????????????
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
              // ?????????????????????
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
   * ????????????????????????
   */
  private refreshRemoveData(): void {
    // ???????????? 0D2rfo4mm1R071bO90
    const removeFilter = new FilterCondition('equipmentId',
      OperatorEnum.eq, this.equipmentId);
    // ??????????????????????????????ID??????????????????????????????
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
              // ?????????????????????
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
   *   ?????????????????????
   */
  private initTableConfig(): void {
    // ??????????????????
    const commonConfig = [
      //  ??????
      {
        type: 'serial-number',
        title: this.language.serialNumber,
        width: 62,
        fixedStyle: {fixedLeft: true, style: {left: '0'}}
      },
      { // ????????????
        title: this.workOrderLanguage.name,
        searchable: false,
        key: 'title', width: 250
      },
      { // ???????????????
        title: this.workOrderLanguage.status,
        key: 'statusName',
        type: 'render',
        width: 250,
        searchable: false,
        renderTemplate: this.statusTemp,
      },
      { // ????????????
        title: this.workOrderLanguage.accountabilityUnitName,
        key: 'accountabilityDeptName',
        width: 250,
        searchable: false,
      },
      { // ?????????
        title: this.workOrderLanguage.assignName,
        key: 'assignName',
        width: 250,
        searchable: false,
      },
      { // ??????????????????
        title: this.workOrderLanguage.expectedCompleteTime,
        key: 'expectedCompletedTime',
        pipe: 'date',
        width: 250,
        searchable: false,
      },
      { // ????????????
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
      { //  ????????????
        title: this.language.dataResourceType, width: 120,
        key: 'dataResourceType',
        type: 'render',
        renderTemplate: this.dataResource,
        searchable: false
      },
      { //  ????????????
        title: this.language.associatedFault, width: 120,
        key: 'dataResourceName',
        searchable: false
      },
      { // ??????
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
        { // ????????????
          text: this.language.viewWorkOrder,
          className: 'fiLink-work-order',
          handle: (data: ClearBarrierWorkOrderModel) => {
            this.$router.navigate(['business/work-order/clear-barrier/unfinished-list'],
              {queryParams: {id: data.procId}}).then();
          }
        },
        { // ????????????
          text: this.language.viewResource,
          className: 'fiLink-alarm-facility',
          permissionCode: '02-1',
          handle: (data: ClearBarrierWorkOrderModel) => {
            if (data.dataResourceType === WorkOrderResourceEnum.alarm) {
              // ???????????????
              if (!data.refAlarm) {
                this.$message.info(this.language.workOrderNotRefAlarm);
                return;
              }
              const queryParams = {
                id: data.refAlarm
              };
              // ???????????????????????????
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
              // ?????????????????????
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
    // ???????????????????????????
    this.alarmConfirmTableConfig = {
      isDraggable: true,
      scroll: {x: '900px', y: '400px'},
      isLoading: false,
      columnConfig: [
        //  ??????
        {
          width: 62,
          type: 'serial-number',
          title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '0'}}
        },
        { // ????????????
          key: 'title', width: 250,
          title: this.workOrderLanguage.name,
          searchable: false
        },
        { // ???????????????
          title: this.workOrderLanguage.status,
          key: 'statusName',
          width: 200,
          searchable: false,
          type: 'render',
          renderTemplate: this.statusTemp,
        },
        { // ??????????????????
          key: 'expectedCompletedTime',
          title: this.workOrderLanguage.expectedCompleteTime,
          width: 150,
          pipe: 'date',
          searchable: false,
        },
        {
          // ????????????
          title: this.workOrderLanguage.relevancyAlarm, key: 'refAlarmName',
          configurable: false, isShowSort: false,
          searchable: false, width: 150
        },
        {
          // ???????????????
          title: this.inspectionLanguage.confirmReason, key: 'uncertainReason',
          configurable: false, width: 150,
          searchable: false, searchConfig: {type: 'input'}
        },
        {
          // ??????????????????
          title: this.inspectionLanguage.realAlarmReason, key: 'realityAlarmReason',
          configurable: false, width: 150,
          searchable: false, searchConfig: {type: 'input'}
        },
        {
          // ????????????
          title: this.workOrderLanguage.accountabilityUnitName, key: 'accountabilityDeptName',
          configurable: false, isShowSort: false,
          searchable: false, width: 150

        },
        {// ?????????
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
        { // ????????????
          text: this.language.viewWorkOrder,
          className: 'fiLink-work-order',
          handle: (data: RemoveWorkOrderModel) => {
            this.$router.navigate(['business/work-order/dismantle-barrier/unfinished-list'],
              {queryParams: {id: data.procId}}).then();
          }
        },
        { // ????????????
          text: this.language.viewResource,
          className: 'fiLink-alarm-facility',
          permissionCode: '02-1',
          handle: (data: RemoveWorkOrderModel) => {
            if (data.dataResourceType === WorkOrderResourceEnum.alarm) {
              // ???????????????
              if (!data.refAlarm) {
                this.$message.info(this.language.workOrderNotRefAlarm);
                return;
              }
              const queryParams = {
                id: data.refAlarm
              };
              // ???????????????????????????
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
              // ?????????????????????
              this.$router.navigate([`business/trouble/trouble-list`],
                {queryParams: queryParams}).then();
            }
          }
        }
      ]
    };
  }
}
