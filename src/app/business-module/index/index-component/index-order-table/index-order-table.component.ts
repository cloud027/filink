import {AfterContentInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {IndexWorkOrderService} from '../../../../core-module/api-service/index/index-work-order';
import {FilterCondition, PageCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {PageModel} from '../../../../shared-module/model/page.model';
import {ClearWorkOrderModel, InspectionWorkOrderModel} from '../../shared/model/work-order-condition.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {WorkOrderStatusClassEnum} from '../../../../core-module/enum/work-order/work-order-status-class.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {PageSizeEnum} from '../../../../shared-module/enum/page-size.enum';
import {IndexWorkOrderStateEnum, IndexWorkOrderTypeEnum} from '../../../../core-module/enum/work-order/work-order.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import * as _ from 'lodash';
import {WorkOrderLanguageInterface} from '../../../../../assets/i18n/work-order/work-order.language.interface';
import {IndexApiService} from '../../service/index/index-api.service';
import {AreaModel} from '../../shared/model/area.model';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {RemoveWorkOrderModel} from '../../../../core-module/model/work-order/remove-work-order.model';
import {WorkOrderStatusUtil} from '../../../../core-module/business-util/work-order/work-order-for-common.util';
import {AlarmConfirmWorkOrderModel} from '../../../../core-module/model/work-order/alarm-confirm.model';
import {InstallWorkOrderModel} from '../../../../core-module/model/work-order/install-work-order.model';

/**
 * ????????????
 */
@Component({
  selector: 'app-index-order-table',
  templateUrl: './index-order-table.component.html',
  styleUrls: ['./index-order-table.component.scss']
})
export class IndexOrderTableComponent implements OnInit, OnChanges, AfterContentInit {
  // ????????????
  @Input() areaData: string[];
  // ????????????????????????
  @Input() orderTypeData;
  // ????????????????????????
  @Input() orderStateData: string[];
  // ?????????????????????
  @Input() defaultShowTable = true;
  // ????????????
  @Input() titleName: string;
  // ???????????????????????????
  @Input() selectedWorkOrderType: string;
  // ????????????????????????
  @Output() selectWorkOrderTypeChange = new EventEmitter<any>();
  // ??????????????????
  @ViewChild('statusTemp') statusTemp: TemplateRef<HTMLDocument>;
  // ????????????
  @ViewChild('progressSpeed') progressSpeed: TemplateRef<HTMLDocument>;
  // ????????????
  public selectOption: any[] = [];
  // ?????????
  public indexLanguage: IndexLanguageInterface;
  // ?????????
  public commonLanguage: CommonLanguageInterface;
  // ?????????
  public workOrderLanguage: WorkOrderLanguageInterface;
  // ????????????????????????
  public workOrderInspectionTableConfig: TableConfigModel;
  // ?????????????????????
  public workOrderInspectionDataSet: InspectionWorkOrderModel[] = [];
  // ??????????????????
  public workOrderInspectionPageBean: PageModel = new PageModel(PageSizeEnum.sizeFive);
  // ??????????????????????????????
  public queryInspectionCondition: QueryConditionModel = new QueryConditionModel();
  // ????????????????????????
  public workOrderClearTableConfig: TableConfigModel;
  public workOrderRemoveTableConfig: TableConfigModel;
  // ?????????????????????
  public workOrderClearDataSet: ClearWorkOrderModel[] = [];
  public workOrderRemoveDataSet: RemoveWorkOrderModel[] = [];
  // ??????????????????
  public workOrderClearPageBean: PageModel = new PageModel(PageSizeEnum.sizeFive);
  public workOrderRemovePageBean: PageModel = new PageModel(PageSizeEnum.sizeFive);
  // ??????????????????????????????
  public queryClearCondition: QueryConditionModel = new QueryConditionModel();
  public queryRemoveCondition: QueryConditionModel = new QueryConditionModel();
  // ??????????????????
  public workOrderStatusEnum = IndexWorkOrderStateEnum;
  // ?????????????????????????????????????????????
  public areaAllData: string[] = [];
  // ?????????????????????
  public selectWorkOrderType: string = '';
  // ??????????????????????????????
  public workOrderConfirmDataSet: AlarmConfirmWorkOrderModel[] = [];
  public workOrderConfirmPageBean: PageModel = new PageModel(PageSizeEnum.sizeFive);
  public workOrderConfirmTableConfig: TableConfigModel;
  public queryConfirmCondition: QueryConditionModel = new QueryConditionModel();
  // ????????????????????????
  public workOrderInstallDataSet: InstallWorkOrderModel[] = [];
  public workOrderInstallPageBean: PageModel = new PageModel(PageSizeEnum.sizeFive);
  public workOrderInstallTableConfig: TableConfigModel;
  public queryInstallCondition: QueryConditionModel = new QueryConditionModel();
  // ????????????????????????
  private searchInspectionCondition: boolean = true;
  // ????????????????????????
  private searchClearCondition: boolean = true;
  private searchConfirmCondition: boolean = true;
  private searchInstallCondition: boolean = true;
  private searchRemoveCondition: boolean = true;
  private showInspection: boolean = true;
  private showClear: boolean = false;
  private showRemove: boolean = false;
  // ??????????????????
  public indexWorkOrderTypeEnum = IndexWorkOrderTypeEnum;
  // ??????????????????
  public orderData: any[] = [];
  // ??????????????????
  private procRoles: any[] = [];

  public constructor(
    private $router: Router,
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $indexWorkOlder: IndexWorkOrderService,
    private $indexApiService: IndexApiService
  ) {
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.workOrderLanguage = this.$nzI18n.getLocaleData(LanguageEnum.workOrder);
    // ?????????????????????????????????????????? ??????????????????????????????
    this.procRoles = WorkOrderStatusUtil.checkProcAuthority(this.$nzI18n);
  }

  public ngOnInit(): void {
    // ?????????????????????
    this.titleName = this.indexLanguage.inspectionWorkOrder;
    Object.keys(this.workOrderStatusEnum).forEach(item => {
      this.selectOption.push({value: item, label: this.indexLanguage[item]});
    });
    // ??????????????????????????????
    this.queryInspectionCondition.pageCondition.pageSize = PageSizeEnum.sizeFive;
    // ??????????????????????????????
    this.queryClearCondition.pageCondition.pageSize = PageSizeEnum.sizeFive;
    this.queryRemoveCondition.pageCondition.pageSize = PageSizeEnum.sizeFive;
    const selectOrderList = [];
    // ????????????????????????????????????
    if (SessionUtil.checkHasTenantRole('1-1-3-4')) {
      // this.selectWorkOrderType = this.indexWorkOrderTypeEnum.inspection;
      selectOrderList.push({value: this.indexWorkOrderTypeEnum.inspection, label: this.indexLanguage.inspectionWorkOrder});
    }
    // ????????????????????????????????????
    if (SessionUtil.checkHasTenantRole('1-1-3-5')) {
      if (this.selectWorkOrderType !== this.indexWorkOrderTypeEnum.inspection || !this.selectWorkOrderType) {
        // this.selectWorkOrderType = this.indexWorkOrderTypeEnum.clearFailure;
        this.orderTypeData = IndexWorkOrderTypeEnum.clearFailure;
        this.defaultShowTable = true;
      }
      selectOrderList.push({value: this.indexWorkOrderTypeEnum.clearFailure, label: this.indexLanguage.clearBarrierWorkOrder});
    }
    // ???????????? ????????????????????????
    if (SessionUtil.checkHasTenantRole('1-1-3-8')) {
      /*if (
        this.selectWorkOrderType !== this.indexWorkOrderTypeEnum.inspection ||
        !this.selectWorkOrderType
      ) {
        this.selectWorkOrderType = this.indexWorkOrderTypeEnum.remove;
      }*/
      selectOrderList.push({
        value: this.indexWorkOrderTypeEnum.remove,
        label: this.indexLanguage.removeWorkOrder,
      });
    }
    if (SessionUtil.checkHasTenantRole('1-1-3-6')) {
      selectOrderList.push({
        value: this.indexWorkOrderTypeEnum.install,
        label: this.indexLanguage.installWorkOrder
      });
    }
    if (SessionUtil.checkHasTenantRole('1-1-3-7')) {
      selectOrderList.push({
        value: this.indexWorkOrderTypeEnum.confirm,
        label: this.indexLanguage.alarmAffirmWorkOrder
      });
    }
    if (this.procRoles.length) {
      // ??????????????????????????????
      const result = [];
      this.procRoles.forEach(item => {
        if (selectOrderList.find(v => v.value === item.value)) {
          result.push(item);
        }
      });
      this.orderData = result;
      if (result.length) {
        this.selectWorkOrderType = result[0].value;
      }
    } else {
      this.orderData = [];
    }
  }

  public ngAfterContentInit(): void {
    // ????????????????????????
    this.initInspectionWorkOrderTable();
    this.workOrderInspectionTableConfig.isLoading = false;
    // ????????????????????????
    this.initClearWorkOrderTable();
    this.workOrderClearTableConfig.isLoading = false;
    // ??????????????????????????????
    this.initConfirmWorkOrderTable();
    this.workOrderConfirmTableConfig.isLoading = false;
    // ????????????????????????
    this.initInstallWorkOrderTable();
    this.workOrderInstallTableConfig.isLoading = false;
    // ????????????????????????
    this.initRemoveWorkOrderTable();
    this.workOrderRemoveTableConfig.isLoading = false;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.selectedWorkOrderType) {
      this.selectWorkOrderType = this.selectedWorkOrderType;
    }
    if (this.areaData && this.orderStateData) {
      // ??????????????????
      if (this.selectWorkOrderType === IndexWorkOrderTypeEnum.inspection) {
        this.initInspectionWorkOrderTable();
        // ??????????????????????????????
        this.getAllAreaList(this.areaData).then((data) => {
          this.getInspectionWorkOrderTable(true);
        });
      }
      // ????????????
      if (this.selectWorkOrderType === IndexWorkOrderTypeEnum.clearFailure) {
        this.initClearWorkOrderTable();
        // ??????????????????????????????
        this.getAllAreaList(this.areaData).then((data) => {
          this.getClearWorkOrderTable(true);
        });
      }
      // ??????????????????
      if (this.selectWorkOrderType === IndexWorkOrderTypeEnum.confirm) {
        this.initConfirmWorkOrderTable();
        // ??????????????????????????????
        this.getAllAreaList(this.areaData).then((data) => {
          this.getConfirmWorkOrderTable(true);
        });
      }
      // ????????????
      if (this.selectWorkOrderType === IndexWorkOrderTypeEnum.install) {
        this.initInstallWorkOrderTable();
        // ??????????????????????????????
        this.getAllAreaList(this.areaData).then((data) => {
          this.getInstallWorkOrderTable(true);
        });
      }
      // ??????????????????
      if (this.selectWorkOrderType === IndexWorkOrderTypeEnum.remove) {
        this.initRemoveWorkOrderTable();
        // ??????????????????????????????
        this.getAllAreaList(this.areaData).then((data) => {
          this.getRemoveWorkOrderTable(true);
        });
      }
    }
  }

  /**
   * ????????????????????????????????????????????????
   * param areaData
   */
  public getAllAreaList(areaData: string[]): Promise<string> {
    this.areaAllData = [];
    return new Promise((resolve, reject) => {
      this.$indexApiService.listAreaByAreaCodeList(areaData).subscribe((result: ResultModel<AreaModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.areaAllData = [];
          result.data.forEach(item => {
            this.areaAllData.push(item.areaCode);
          });
          if (!result.data) {
            this.areaAllData = ['noData'];
          }
          resolve();
        } else {
          reject();
        }
      });
    });
  }

  /**
   * ?????????????????????
   */
  public goToWorkOrderPage(): void {
    if (this.selectWorkOrderType === IndexWorkOrderTypeEnum.clearFailure) {
      // ????????????
      this.$router.navigate([`/business/work-order/clear-barrier/unfinished-list`]).then();
    } else if (this.selectWorkOrderType === IndexWorkOrderTypeEnum.inspection) {
      // ????????????
      this.$router.navigate([`/business/work-order/inspection/unfinished-list`]).then();
    } else if (this.selectWorkOrderType === IndexWorkOrderTypeEnum.remove) {
      // ????????????
      this.$router.navigate([`/business/work-order/dismantle-barrier/unfinished-list`]).then();
    } else if (this.selectWorkOrderType === IndexWorkOrderTypeEnum.install) {
      // ??????????????????
      this.$router.navigate([`/business/work-order/installation/unfinished-list`]).then();
    } else if (this.selectWorkOrderType === IndexWorkOrderTypeEnum.confirm) {
      // ??????????????????
      this.$router.navigate([`/business/work-order/alarm-confirm/unfinished-list`]).then();
    }
  }

  /**
   * ????????????????????????
   */
  public pageWorkOrderInspection(event: PageModel): void {
    this.queryInspectionCondition.pageCondition.pageNum = event.pageIndex;
    this.queryInspectionCondition.pageCondition.pageSize = event.pageSize;
    this.queryInspectionListForHome();
  }

  /**
   * ????????????????????????
   */
  public pageWorkOrderClear(event: PageModel): void {
    this.queryClearCondition.pageCondition.pageNum = event.pageIndex;
    this.queryClearCondition.pageCondition.pageSize = event.pageSize;
    this.queryClearListForHome();
  }
  /**
   * ??????????????????????????????
   */
  public pageWorkOrderConfirm(event: PageModel): void {
    this.queryConfirmCondition.pageCondition.pageNum = event.pageIndex;
    this.queryConfirmCondition.pageCondition.pageSize = event.pageSize;
    this.queryConfirmListForHome();
  }
  /**
   * ????????????????????????
   */
  public pageWorkOrderInstall(event: PageModel): void {
    this.queryInstallCondition.pageCondition.pageNum = event.pageIndex;
    this.queryInstallCondition.pageCondition.pageSize = event.pageSize;
    this.queryInstallListForHome();
  }
  /**
   * ????????????????????????
   */
  public pageWorkOrderRemove(event: PageModel): void {
    this.queryRemoveCondition.pageCondition.pageNum = event.pageIndex;
    this.queryRemoveCondition.pageCondition.pageSize = event.pageSize;
    this.queryRemoveListForHome();
  }

  /**
   * ??????????????????????????????
   */
  public workOrderChange(workOrderType): void {
    this.defaultShowTable = true;
    this.selectWorkOrderType = workOrderType;
    this.selectedWorkOrderType = workOrderType;
    this.selectWorkOrderTypeChange.emit(this.selectWorkOrderType);
    /**
    // ????????????
    if (workOrderType === IndexWorkOrderTypeEnum.inspection) {
      this.defaultShowTable = false;
      this.showInspection = true;
      this.showClear = false;
      this.showRemove = false;
      this.selectWorkOrderTypeChange.emit(this.selectWorkOrderType);
    }
    // ????????????
    if (workOrderType === IndexWorkOrderTypeEnum.clearFailure) {
      this.defaultShowTable = true;
      this.showInspection = false;
      this.showClear = true;
      this.showRemove = false;
      this.selectWorkOrderTypeChange.emit(this.selectWorkOrderType);
    }
    // ??????????????????
    if (workOrderType === IndexWorkOrderTypeEnum.confirm) {
      this.selectWorkOrderTypeChange.emit(this.selectWorkOrderType);
    }
    // ????????????
    if (workOrderType === IndexWorkOrderTypeEnum.install) {
      this.selectWorkOrderTypeChange.emit(this.selectWorkOrderType);
    }
    // ????????????
    if (workOrderType === IndexWorkOrderTypeEnum.remove) {
      this.defaultShowTable = true;
      this.showInspection = false;
      this.showClear = false;
      this.showRemove = true;
      this.selectWorkOrderTypeChange.emit(this.selectWorkOrderType);
    }
    */

    if (this.areaData && this.orderStateData) {
      // ??????????????????
      if (this.selectWorkOrderType === IndexWorkOrderTypeEnum.inspection) {
        this.initInspectionWorkOrderTable();
        // ??????????????????????????????
        this.getAllAreaList(this.areaData).then((data) => {
          this.getInspectionWorkOrderTable(true);
        });
      }
      // ????????????
      if (this.selectWorkOrderType === IndexWorkOrderTypeEnum.clearFailure) {
        this.initClearWorkOrderTable();
        // ??????????????????????????????
        this.getAllAreaList(this.areaData).then((data) => {
          this.getClearWorkOrderTable(true);
        });
      }
      // ??????????????????
      if (this.selectWorkOrderType === IndexWorkOrderTypeEnum.confirm) {
        this.initConfirmWorkOrderTable();
        // ??????????????????????????????
        this.getAllAreaList(this.areaData).then((data) => {
          this.getConfirmWorkOrderTable(true);
        });
      }
      // ????????????
      if (this.selectWorkOrderType === IndexWorkOrderTypeEnum.install) {
        this.initInstallWorkOrderTable();
        // ??????????????????????????????
        this.getAllAreaList(this.areaData).then((data) => {
          this.getInstallWorkOrderTable(true);
        });
      }
      // ????????????
      if (this.selectWorkOrderType === IndexWorkOrderTypeEnum.remove) {
        this.initRemoveWorkOrderTable();
        // ??????????????????????????????
        this.getAllAreaList(this.areaData).then((data) => {
          this.getRemoveWorkOrderTable(true);
        });
      }
    }
  }

  /**
   * ??????????????????????????????
   */
  private getInspectionWorkOrderTable(param?: boolean): void {
    if (param) {
      this.queryInspectionCondition.filterConditions = [];
      this.queryInspectionCondition.pageCondition = new PageCondition(1, 5);
    }
    // ????????????
    if (this.areaData && this.areaData.length > 0) {
      this.queryInspectionCondition.filterConditions.push(new FilterCondition('deviceAreaCode', OperatorEnum.in, this.areaAllData));
    }
    // ??????????????????
    if (this.orderStateData && this.orderStateData.length > 0 && this.searchInspectionCondition) {
      this.queryInspectionCondition.filterConditions.push(new FilterCondition('status', OperatorEnum.in, this.orderStateData));
    }
    this.queryInspectionListForHome();
  }

  /**
   * ??????????????????????????????
   */
  private getClearWorkOrderTable(param?: boolean): void {
    if (param) {
      this.queryClearCondition.filterConditions = [];
      this.queryClearCondition.pageCondition = new PageCondition(1, 5);
    }
    // ????????????
    if (this.areaData && this.areaData.length > 0) {
      this.queryClearCondition.filterConditions.push(new FilterCondition('deviceAreaCode', OperatorEnum.in, this.areaAllData));
    }
    // ??????????????????
    if (this.orderStateData && this.orderStateData.length > 0 && this.searchClearCondition) {
      this.queryClearCondition.filterConditions.push(new FilterCondition('status', OperatorEnum.in, this.orderStateData));
    }
    this.queryClearListForHome();
  }
  /**
   * ????????????????????????????????????
   */
  private getConfirmWorkOrderTable(param?: boolean): void {
    if (param) {
      this.queryConfirmCondition.filterConditions = [];
      this.queryConfirmCondition.pageCondition = new PageCondition(1, 5);
    }
    // ????????????
    if (this.areaData && this.areaData.length > 0) {
      this.queryConfirmCondition.filterConditions.push(new FilterCondition('deviceAreaCode', OperatorEnum.in, this.areaAllData));
    }
    // ??????????????????
    if (this.orderStateData && this.orderStateData.length > 0 && this.searchConfirmCondition) {
      this.queryConfirmCondition.filterConditions.push(new FilterCondition('status', OperatorEnum.in, this.orderStateData));
    }
    this.queryConfirmListForHome();
  }
  /**
   * ??????????????????????????????
   */
  private getInstallWorkOrderTable(param?: boolean): void {
    if (param) {
      this.queryInstallCondition.filterConditions = [];
      this.queryInstallCondition.pageCondition = new PageCondition(1, 5);
    }
    // ????????????
    if (this.areaData && this.areaData.length > 0) {
      this.queryInstallCondition.filterConditions.push(new FilterCondition('deviceAreaCode', OperatorEnum.in, this.areaAllData));
    }
    // ??????????????????
    if (this.orderStateData && this.orderStateData.length > 0 && this.searchInstallCondition) {
      this.queryInstallCondition.filterConditions.push(new FilterCondition('status', OperatorEnum.in, this.orderStateData));
    }
    this.queryInstallListForHome();
  }
  /**
   * ??????????????????????????????
   */
  private getRemoveWorkOrderTable(param?: boolean): void {
    if (param) {
      this.queryRemoveCondition.filterConditions = [];
    }
    // ????????????
    if (this.areaData && this.areaData.length > 0) {
      this.queryRemoveCondition.filterConditions.push(new FilterCondition('deviceAreaCode', OperatorEnum.in, this.areaAllData));
    }
    // ??????????????????
    if (this.orderStateData && this.orderStateData.length > 0 && this.searchClearCondition) {
      this.queryRemoveCondition.filterConditions.push(new FilterCondition('status', OperatorEnum.in, this.orderStateData));
    }
    this.queryRemoveListForHome();
  }

  /**
   * ????????????????????????
   */
  private queryInspectionListForHome(): void {
    if (!this.orderData || this.orderData.length === 0) {
      return;
    }
    this.workOrderInspectionTableConfig.isLoading = true;
    // ??????????????????????????????
    this.$indexWorkOlder.queryInspectionListForHome(this.queryInspectionCondition)
      .subscribe((result: ResultModel<InspectionWorkOrderModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.workOrderInspectionPageBean.Total = result.totalCount;
          this.workOrderInspectionPageBean.pageIndex = result.pageNum;
          this.workOrderInspectionPageBean.pageSize = result.size;
          this.workOrderInspectionDataSet = result.data || [];
          // ??????????????????
          this.workOrderInspectionDataSet.forEach(item => {
            item.statusClass = this.getStatusClass(item.status);
            item.statusName = this.getStatusName(item.status);
          });
        } else {
          this.$message.error(result.msg);
        }
        this.searchInspectionCondition = true;
        this.workOrderInspectionTableConfig.isLoading = false;
      }, () => {
        this.workOrderInspectionTableConfig.isLoading = false;
      });
  }

  /**
   * ????????????????????????
   */
  private queryClearListForHome(): void {
    if (!this.orderData || this.orderData.length === 0) {
      return;
    }
    this.workOrderClearTableConfig.isLoading = true;
    // ????????????????????????
    this.$indexWorkOlder.queryClearListForHome(this.queryClearCondition).subscribe((result: ResultModel<ClearWorkOrderModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.workOrderClearPageBean.Total = result.totalCount;
        this.workOrderClearPageBean.pageIndex = result.pageNum;
        this.workOrderClearPageBean.pageSize = result.size;
        this.workOrderClearDataSet = result.data || [];
        // ??????????????????
        this.workOrderClearDataSet.forEach(item => {
          item.statusClass = this.getStatusClass(item.status);
          item.statusName = this.getStatusName(item.status);
          // ?????????????????????????????????
          if (item.refAlarmCode && item.refAlarmName) {
            item.refAlarmFaultName = `${this.workOrderLanguage.alarm}???${item.refAlarmName}`;
          } else if (item.troubleId && item.troubleName) {
            item.refAlarmFaultName = `${this.workOrderLanguage.fault}???${item.troubleName}`;
          }
        });
      } else {
        this.$message.error(result.msg);
      }
      this.searchClearCondition = true;
      this.workOrderClearTableConfig.isLoading = false;
    }, () => {
      this.workOrderClearTableConfig.isLoading = false;
    });
  }

  /**
   * ????????????????????????
   */
  private queryConfirmListForHome(): void {
    this.workOrderConfirmTableConfig.isLoading = true;
    if (!this.orderData || this.orderData.length === 0) {
      return;
    }
    this.queryConfirmCondition.filterConditions.forEach(item => {
      if (item.filterField === 'lastDays') {
        item.operator = OperatorEnum.lte;
      }
    });
    this.$indexWorkOlder.queryConfirmListForHome(this.queryConfirmCondition).subscribe((result: ResultModel<AlarmConfirmWorkOrderModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.workOrderConfirmPageBean.Total = result.totalCount;
        this.workOrderConfirmPageBean.pageIndex = result.pageNum;
        this.workOrderConfirmPageBean.pageSize = result.size;
        const list = result.data || [];
        list.forEach(item => {
          item.statusClass = this.getStatusClass(item.status);
          item.statusName = this.getStatusName(item.status);
          if (item.equipment) {
            item.equipmentName = item.equipment[0].equipmentName;
          }
        });
        this.workOrderConfirmDataSet = list;
      } else {
        this.$message.error(result.msg);
      }
      this.workOrderConfirmTableConfig.isLoading = false;
    }, () => this.workOrderConfirmTableConfig.isLoading = false);
  }

  /**
   * ??????????????????
   */
  private queryInstallListForHome(): void {
    this.workOrderInstallTableConfig.isLoading = true;
    if (!this.orderData || this.orderData.length === 0) {
      return;
    }
    this.queryInstallCondition.filterConditions.forEach(item => {
      if (item.filterField === 'lastDays') {
        item.operator = OperatorEnum.lte;
      }
    });
    this.$indexWorkOlder.queryInstallListForHome(this.queryInstallCondition).subscribe((result: ResultModel<InstallWorkOrderModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.workOrderInstallPageBean.Total = result.totalCount;
        this.workOrderInstallPageBean.pageIndex = result.pageNum;
        this.workOrderInstallPageBean.pageSize = result.size;
        const list = result.data || [];
        list.forEach(item => {
          item.statusClass = this.getStatusClass(item.status);
          item.statusName = this.getStatusName(item.status);
          if (item.equipment) {
            item.equipmentName = item.equipment[0].equipmentName;
          }
        });
        this.workOrderInstallDataSet = list;
      } else {
        this.$message.error(result.msg);
      }
      this.workOrderInstallTableConfig.isLoading = false;
    }, () => this.workOrderInstallTableConfig.isLoading = false);
  }

  /**
   * ????????????????????????
   */
  private initInspectionWorkOrderTable(): void {
    const inspectionTable = _.concat(this.intiColumnConfigData());
    inspectionTable.push(
      {
        // ??????
        title: this.indexLanguage.schedule, key: 'progressSpeed', width: 100,
        configurable: false,
        isShowSort: true,
        searchable: false,
        type: 'render',
        renderTemplate: this.progressSpeed,
        searchConfig: {type: 'input'},
        fixedStyle: null
      },
      {
        title: this.indexLanguage.operation, key: '', width: 80,
        configurable: false,
        isShowSort: false,
        searchable: true,
        searchConfig: {type: 'operate'},
        fixedStyle: {fixedRight: true, style: {right: '0px'}}
      }
    );
    this.workOrderInspectionTableConfig = {
      isDraggable: true,
      isLoading: true,
      simplePageTotalShow: true,
      notShowPrint: true,
      showSearchSwitch: false,
      showRowSelection: false,
      showSizeChanger: true,
      showSearchExport: false,
      searchReturnType: 'object',
      scroll: {x: '900px', y: '600px'},
      showPagination: true,
      simplePage: true,
      bordered: false,
      showSearch: false,
      noIndex: true,
      columnConfig: inspectionTable,
      sort: (event: SortCondition) => {
        // ??????
        this.queryInspectionCondition.sortCondition.sortField = event.sortField;
        this.queryInspectionCondition.sortCondition.sortRule = event.sortRule;
        this.queryInspectionListForHome();
      },
      handleSearch: (event: FilterCondition) => {
        // ????????????
        this.queryInspectionCondition.filterConditions = [];
        this.queryInspectionCondition.pageCondition.pageNum = 1;
        // ????????????
        for (const item in event) {
          if (event[item]) {
            // ??????????????????????????????
            if (item === 'status' && event[item].length > 0) {
              this.searchInspectionCondition = false;
              if (!event[item].length) {
                this.queryInspectionCondition.filterConditions.push(new FilterCondition(item, OperatorEnum.in, this.orderStateData));
              } else {
                this.queryInspectionCondition.filterConditions.push(new FilterCondition(item, OperatorEnum.in, event[item]));
              }
            } else if (['title', 'accountabilityDeptName', 'assignName'].includes(item)) {
              // ?????????????????????????????????????????????????????????
              this.queryInspectionCondition.filterConditions.push(new FilterCondition(item, OperatorEnum.like, event[item]));
            }
          }
        }
        this.getInspectionWorkOrderTable(false);
      },
    };
  }
  /**
   * ????????????????????????
   */
  private queryRemoveListForHome(): void {
    if (!this.orderData || this.orderData.length === 0) {
      return;
    }
    this.workOrderRemoveTableConfig.isLoading = true;
    // ????????????????????????
    this.$indexWorkOlder.queryRemoveListForHome(this.queryRemoveCondition).subscribe((result: ResultModel<RemoveWorkOrderModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.workOrderRemovePageBean.Total = result.totalCount;
        this.workOrderRemovePageBean.pageIndex = result.pageNum;
        this.workOrderRemovePageBean.pageSize = result.size;
        this.workOrderRemoveDataSet = result.data || [];
        // ??????????????????
        this.workOrderRemoveDataSet.forEach(item => {
          item.statusClass = this.getStatusClass(item.status);
          item.statusName = this.getStatusName(item.status);
          // ?????????????????????????????????
          if (item.refAlarmCode && item.refAlarmName) {
            item.refAlarmFaultName = `${this.workOrderLanguage.alarm}???${item.refAlarmName}`;
          } else if (item.troubleId && item.troubleName) {
            item.refAlarmFaultName = `${this.workOrderLanguage.fault}???${item.troubleName}`;
          }
        });
      } else {
        this.$message.error(result.msg);
      }
      this.searchRemoveCondition = true;
      this.workOrderRemoveTableConfig.isLoading = false;
    }, () => {
      this.workOrderRemoveTableConfig.isLoading = false;
    });
  }

  /**
   * ??????????????????
   */
  private initClearWorkOrderTable(): void {
    const clearTable = _.concat(this.intiColumnConfigData());
    clearTable.push(
      {
        // ????????????
        title: this.indexLanguage.remainingDays, key: 'lastDays', width: 100,
        configurable: false,
        isShowSort: true,
        searchable: false,
        searchKey: 'lastDays',
        searchConfig: {type: 'input'}
      },
      {
        // ???????????? ??????
        title: this.workOrderLanguage.relevance + this.workOrderLanguage.alarm + '/' + this.workOrderLanguage.fault,
        key: 'refAlarmFaultName', width: 140,
        configurable: false,
        isShowSort: true,
        searchable: false,
        searchKey: 'refAlarmFaultName',
        searchConfig: {type: 'input'}
      },
      {
        title: this.indexLanguage.operation, key: '', width: 80,
        configurable: false,
        searchable: true,
        searchConfig: {type: 'operate'},
        fixedStyle: {fixedRight: true, style: {right: '0px'}}
      }
    );
    this.workOrderClearTableConfig = {
      isDraggable: true,
      isLoading: true,
      simplePageTotalShow: true,
      notShowPrint: true,
      showSearchSwitch: false,
      showRowSelection: false,
      showSizeChanger: true,
      showSearchExport: false,
      searchReturnType: 'object',
      scroll: {x: '600', y: '400px'},
      showPagination: true,
      simplePage: true,
      bordered: false,
      showSearch: false,
      noIndex: true,
      columnConfig: clearTable,
      sort: (event: SortCondition) => {
        this.queryClearCondition.sortCondition.sortField = event.sortField;
        this.queryClearCondition.sortCondition.sortRule = event.sortRule;
        if (event.sortField === 'lastDays') {
          this.queryClearCondition.sortCondition.sortField = 'expectedCompletedTime';
        }
        this.queryClearListForHome();
      },
      handleSearch: (event: FilterCondition) => {
        this.queryClearCondition.filterConditions = [];
        this.queryClearCondition.pageCondition.pageNum = 1;
        // ????????????????????????
        for (const item in event) {
          if (event[item]) {
            // ??????????????????????????????
            if (item === 'status' && event[item].length > 0) {
              this.searchClearCondition = false;
              if (!event[item].length) {
                this.queryClearCondition.filterConditions.push(new FilterCondition(item, OperatorEnum.in, this.orderStateData));
              } else {
                this.queryClearCondition.filterConditions.push(new FilterCondition(item, OperatorEnum.in, event[item]));
              }
            } else if (['title', 'accountabilityDeptName', 'assignName', 'troubleName'].includes(item)) {
              // ????????????????????????????????????????????????????????????????????????
              this.queryClearCondition.filterConditions.push(new FilterCondition(item, OperatorEnum.like, event[item]));
            }
          }
        }
        this.getClearWorkOrderTable(false);
      },
    };
  }

  /**
   * ????????????????????????
   */
  private initConfirmWorkOrderTable(): void {
    const table = _.concat(this.intiColumnConfigData());
    table.push(
      { // ????????????
        title: this.indexLanguage.remainingDays, key: 'lastDays', width: 100,
        configurable: false,
        isShowSort: true,
        searchable: false,
        searchConfig: {type: 'input'}
      },
      { // ????????????
        title: this.workOrderLanguage.relevance + this.workOrderLanguage.alarm,
        key: 'refAlarmName', width: 140,
        configurable: false,
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      {
        title: this.indexLanguage.operation, key: '', width: 80,
        configurable: false,
        isShowSort: false,
        searchable: true,
        searchConfig: {type: 'operate'},
        fixedStyle: {fixedRight: true, style: {right: '0px'}}
      });
    this.workOrderConfirmTableConfig = {
      isDraggable: true,
      isLoading: true,
      simplePageTotalShow: true,
      notShowPrint: true,
      showSearchSwitch: false,
      showRowSelection: false,
      showSizeChanger: true,
      showSearchExport: false,
      searchReturnType: 'array',
      scroll: {x: '600', y: '400px'},
      showPagination: true,
      simplePage: true,
      bordered: false,
      showSearch: false,
      noIndex: true,
      columnConfig: table,
      sort: (event: SortCondition) => {
        this.queryConfirmCondition.sortCondition.sortRule = event.sortRule;
        if (event.sortField === 'lastDays') {
          this.queryConfirmCondition.sortCondition.sortField = 'expectedCompletedTime';
        }
        this.queryConfirmListForHome();
      },
      handleSearch: (event: FilterCondition[]) => {
        this.queryConfirmCondition.pageCondition.pageNum = 1;
        const obj = event.find(v => v.filterField === 'status');
        this.searchConfirmCondition = !obj;
        this.queryConfirmCondition.filterConditions = event;
        this.getConfirmWorkOrderTable(false);
      }
    };
  }

  /**
   * ??????????????????
   */
  private initInstallWorkOrderTable(): void {
    const table = _.concat(this.intiColumnConfigData());
    table.push(
      { // ????????????
        title: this.indexLanguage.remainingDays, key: 'lastDays', width: 100,
        configurable: false,
        isShowSort: true,
        searchable: false,
        searchConfig: {type: 'input'}
      },
      { // ????????????
        title: this.workOrderLanguage.deviceName,
        key: 'deviceName', width: 140,
        configurable: false,
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      { // ????????????
        title: this.workOrderLanguage.equipmentName,
        key: 'equipmentName', width: 140,
        configurable: false,
        isShowSort: true,
        searchable: true,
        searchKey: 'equipment.equipmentName',
        searchConfig: {type: 'input'}
      },
      {
        title: this.indexLanguage.operation, key: '', width: 80,
        configurable: false,
        isShowSort: false,
        searchable: true,
        searchConfig: {type: 'operate'},
        fixedStyle: {fixedRight: true, style: {right: '0px'}}
      });
    this.workOrderInstallTableConfig = {
      isDraggable: true,
      isLoading: true,
      simplePageTotalShow: true,
      notShowPrint: true,
      showSearchSwitch: false,
      showRowSelection: false,
      showSizeChanger: false,
      showSearchExport: false,
      searchReturnType: 'array',
      scroll: {x: '600', y: '400px'},
      showPagination: true,
      simplePage: true,
      bordered: false,
      showSearch: false,
      noIndex: true,
      columnConfig: table,
      operation: [],
      sort: (event: SortCondition) => {
        this.queryInstallCondition.sortCondition.sortRule = event.sortRule;
        if (event.sortField === 'lastDays') {
          this.queryInstallCondition.sortCondition.sortField = 'planCompletedTime';
        }
        this.queryInstallListForHome();
      },
      handleSearch: (event: FilterCondition[]) => {
        this.queryInstallCondition.pageCondition.pageNum = 1;
        // ????????????
        const obj = event.find(v => v.filterField === 'status');
        this.searchInstallCondition = !obj;
        this.queryInstallCondition.filterConditions = event;
        this.getInstallWorkOrderTable(false);
      }
    };
  }
  /**
   * ??????????????????
   */
  private initRemoveWorkOrderTable(): void {
    const removeTable = _.concat(this.intiColumnConfigData());
    removeTable.push(
      {
        // ????????????
        title: this.indexLanguage.remainingDays, key: 'lastDays', width: 100,
        configurable: false,
        isShowSort: true,
        searchable: false,
        searchKey: 'lastDays',
        searchConfig: {type: 'input'}
      },
      {
        // ????????????/??????
        title: this.workOrderLanguage.facilitiesEquipment,
        key: 'removeObject', width: 140,
        configurable: false,
        isShowSort: true,
        searchable: false,
        searchKey: 'removeObject',
        searchConfig: {type: 'input'}
      },
      {
        title: this.indexLanguage.operation, key: '', width: 80,
        configurable: false,
        searchable: true,
        searchConfig: {type: 'operate'},
        fixedStyle: {fixedRight: true, style: {right: '0px'}}
      }
    );
    this.workOrderRemoveTableConfig = {
      isDraggable: true,
      isLoading: true,
      simplePageTotalShow: true,
      notShowPrint: true,
      showSearchSwitch: false,
      showRowSelection: false,
      showSizeChanger: true,
      showSearchExport: false,
      searchReturnType: 'object',
      scroll: {x: '600', y: '400px'},
      showPagination: true,
      simplePage: true,
      bordered: false,
      showSearch: false,
      noIndex: true,
      columnConfig: removeTable,
      sort: (event: SortCondition) => {
        this.queryRemoveCondition.sortCondition.sortField = event.sortField;
        this.queryRemoveCondition.sortCondition.sortRule = event.sortRule;
        this.queryRemoveListForHome();
      },
      handleSearch: (event: FilterCondition) => {
        this.queryRemoveCondition.filterConditions = [];
        this.queryRemoveCondition.pageCondition.pageNum = 1;
        // ????????????????????????
        for (const item in event) {
          if (event[item]) {
            // ??????????????????????????????
            if (item === 'status' && event[item].length > 0) {
              this.searchRemoveCondition = false;
              if (!event[item].length) {
                this.queryRemoveCondition.filterConditions.push(new FilterCondition(item, OperatorEnum.in, this.orderStateData));
              } else {
                this.queryRemoveCondition.filterConditions.push(new FilterCondition(item, OperatorEnum.in, event[item]));
              }
            } else if (['title', 'accountabilityDeptName', 'assignName', 'troubleName'].includes(item)) {
              // ????????????????????????????????????????????????????????????????????????
              this.queryRemoveCondition.filterConditions.push(new FilterCondition(item, OperatorEnum.like, event[item]));
            }
          }
        }
        this.getRemoveWorkOrderTable(false);
      },
    };
  }

  /**
   * ????????????????????????
   *
   */
  private getStatusClass(status: string): string {
    return `iconfont icon-fiLink ${WorkOrderStatusClassEnum[status]}`;
  }

  /**
   * ????????????????????????
   *
   */
  private getStatusName(status: string): string {
    return this.indexLanguage[IndexWorkOrderStateEnum[status]] || '';
  }

  /**
   * ?????????????????????
   */
  private intiColumnConfigData(): object {
    const columnConfigs = [
      {
        // ??????ID
        title: '', key: 'procId', width: 100,
        hidden: true
      },
      {
        // ??????
        title: this.indexLanguage.workOrderName, key: 'title', width: 100,
        configurable: false,
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      {
        // ????????????
        title: this.indexLanguage.workOrderStatus, key: 'status', width: 130,
        configurable: false,
        isShowSort: true,
        searchable: true,
        searchKey: 'status',
        type: 'render',
        searchConfig: {type: 'select', selectType: 'multiple', selectInfo: this.selectOption},
        renderTemplate: this.statusTemp,
      },
      {
        // ????????????
        title: this.indexLanguage.responsibilityUnit, key: 'accountabilityDeptName', width: 100,
        configurable: false,
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
      {
        // ?????????
        title: this.indexLanguage.responsibilityPerson, key: 'assignName', width: 100,
        configurable: false,
        isShowSort: true,
        searchable: true,
        searchConfig: {type: 'input'}
      },
    ];
    return columnConfigs;
  }

  /**
   * ??????????????????
   */
  public showSearch(): void {
    this.workOrderInspectionTableConfig.showSearch = !this.workOrderInspectionTableConfig.showSearch;
    this.workOrderClearTableConfig.showSearch = !this.workOrderClearTableConfig.showSearch;
    this.workOrderConfirmTableConfig.showSearch = !this.workOrderConfirmTableConfig.showSearch;
    this.workOrderInstallTableConfig.showSearch = !this.workOrderInstallTableConfig.showSearch;
    this.workOrderRemoveTableConfig.showSearch = !this.workOrderRemoveTableConfig.showSearch;

  }
}
