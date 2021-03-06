import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NzI18nService, NzMessageService } from 'ng-zorro-antd';

import { TableConfigModel } from '../../../../shared-module/model/table-config.model';
import { PageModel } from '../../../../shared-module/model/page.model';

import { EnergyLanguageInterface } from '../../../../../assets/i18n/energy/energy.language.interface';
import { LanguageEnum } from '../../../../shared-module/enum/language.enum';
import { ApplicationInterface } from '../../../../../assets/i18n/application/application.interface';
import { CommonLanguageInterface } from '../../../../../assets/i18n/common/common.language.interface';

import {
  FilterCondition,
  QueryConditionModel,
  SortCondition,
} from '../../../../shared-module/model/query-condition.model';

import { ExportRequestModel } from '../../../../shared-module/model/export-request.model';
import { OperatorEnum } from '../../../../shared-module/enum/operator.enum';
import { ExecStatusEnum } from '../../../application-system/share/enum/policy.enum';
import {
  EnableOrDisableModel,
  PolicyControlModel,
} from '../../../application-system/share/model/policy.control.model';
import { SelectDataConfig } from '../../../application-system/share/config/select.data.config';
import { ResultModel } from '../../../../shared-module/model/result.model';
import { ResultCodeEnum } from '../../../../shared-module/enum/result-code.enum';
import { EnergyApiService } from '../../share/service/energy/energy-api.service';
import { EnergyDataCollectionTaskList } from '../../share/model/energy-dataCollection-task-list.model';
import { CommonUtil } from '../../../../shared-module/util/common-util';
import {
  dataCollectionTaskStatusEnum,
  collectionTaskCycleEnum,
} from '../../share/enum/energy-config.enum';

import { FiLinkModalService } from '../../../../shared-module/service/filink-modal/filink-modal.service';
@Component({
  selector: 'app-date-task',
  templateUrl: './data-task.component.html',
  styleUrls: ['./data-task.component.scss'],
})
export class DataTaskComponent implements OnInit {
  // ????????????
  @ViewChild('acquisitionCycleTemp') acquisitionCycleTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('policyStatus') policyStatus: TemplateRef<any>;
  // ????????????
  @ViewChild('taskStatusTemp') taskStatusTemp: TemplateRef<any>;

  dataCollectionTaskStatus = dataCollectionTaskStatusEnum;
  // ??????????????????
  collectionTaskCycle = collectionTaskCycleEnum;

  // ????????????
  public dataSet = [];

  // ????????????
  public tableConfig: TableConfigModel;
  // ??????????????????
  public pageBean: PageModel = new PageModel();

  // ??????????????????
  public queryCondition: QueryConditionModel = new QueryConditionModel();

  public language: EnergyLanguageInterface;

  // ?????????????????????
  public languageTable: ApplicationInterface;
  languageCommon: CommonLanguageInterface;
  // ?????????????????????
  public languageEnum = LanguageEnum;
  constructor(
    private $nzI18n: NzI18nService,
    private $message: NzMessageService,
    private $fiLinkMessage: FiLinkModalService,
    private router: Router,
    private $energyApiService: EnergyApiService,
  ) {}

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.energy);
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.languageCommon = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.initTableConfig();
    this.refreshData();
  }

  // ?????????????????????
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      outHeight: 108,
      showSizeChanger: true,
      showSearchSwitch: true,
      primaryKey: '26-4',
      scroll: { x: '1804px', y: '340px' },
      noIndex: true,
      showSearchExport: true,
      columnConfig: [
        {
          type: 'select',
          fixedStyle: { fixedLeft: true, style: { left: '0px' } },
          width: 62,
        },
        {
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber,
          fixedStyle: { fixedLeft: true, style: { left: '62px' } },
        },
        {
          // ????????????
          title: this.language.taskName,
          key: 'strategyName',
          width: 200,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
          fixedStyle: { fixedLeft: true, style: { left: '124px' } },
        },
        // ????????????
        {
          title: this.languageTable.strategyList.effectivePeriodStart,
          key: 'effectivePeriodStart',
          width: 200,
          isShowSort: true,
          pipe: 'dateDay',
          configurable: true,
          searchable: true,
          searchConfig: { type: 'date' },
        },
        // ????????????
        {
          title: this.languageTable.strategyList.effectivePeriodEnd,
          key: 'effectivePeriodEnd',
          width: 200,
          isShowSort: true,
          configurable: true,
          pipe: 'dateDay',
          searchable: true,
          searchConfig: { type: 'date' },
        },
        // ????????????
        {
          title: this.language.acquisitionCycle,
          key: 'execType',
          width: 120,
          configurable: true,
          searchable: true,
          isShowSort: true,
          type: 'render',
          renderTemplate: this.acquisitionCycleTemp,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: CommonUtil.codeTranslate(
              collectionTaskCycleEnum,
              this.$nzI18n,
              null,
              'energy',
            ),
            label: 'label',
            value: 'code',
          },
        },
        // ????????????
        {
          title: this.language.collectionTime,
          key: 'execTime',
          configurable: true,
          width: 250,
          searchable: true,
          isShowSort: true,
          pipe: 'date',
          searchConfig: { type: 'dateRang' },
        },
        // ??????
        {
          title: this.language.status,
          key: 'collectStatus',
          width: 120,
          type: 'render',
          renderTemplate: this.taskStatusTemp,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: CommonUtil.codeTranslate(
              dataCollectionTaskStatusEnum,
              this.$nzI18n,
              null,
              'energy.collectionTaskStatusType',
            ),
            label: 'label',
            value: 'code',
          },
        },
        // ???????????? 0/1 ??????/??????
        {
          title: this.language.enableStatus,
          key: 'strategyStatus',
          width: 100,
          isShowSort: true,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.policyStatus,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: SelectDataConfig.strategyStatusData(this.languageTable),
            label: 'label',
            value: 'code',
          },
        },
        {
          // ?????????
          title: this.language.founder,
          key: 'createUser',
          width: 120,
          configurable: true,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'input' },
        },
        {
          // ????????????
          title: this.language.creationTime,
          key: 'createTime',
          pipe: 'date',
          configurable: true,
          width: 250,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'dateRang' },
        },
        {
          // ????????????
          title: this.language.updateTime,
          key: 'updateTime',
          pipe: 'date',
          configurable: true,
          width: 250,
          searchable: true,
          isShowSort: true,
          searchConfig: { type: 'dateRang' },
        },
        {
          // ??????
          title: this.language.remarks,
          key: 'remark',
          configurable: true,
          searchable: true,
          isShowSort: true,
          width: 150,
          searchConfig: { type: 'input' },
        },
        {
          title: this.language.operate,
          searchable: true,
          searchConfig: { type: 'operate' },
          key: '',
          width: 120,
          fixedStyle: { fixedRight: true, style: { right: '0px' } },
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [
        {
          text: this.language.add,
          btnType: 'primary',
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: '26-3-2',
          handle: () => {
            this.router.navigateByUrl('/business/energy/energy-collect/task-insert');
          },
        },
        {
          text: this.language.deleteHandle,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          permissionCode: '26-3-5',
          needConfirm: true,
          canDisabled: true,
          confirmContent: this.language.deleteFacilityMsg,
          handle: (data) => {
            const ids = data.map((item) => {
              return item.strategyId;
            });
            this.deleteDeviceByIds(ids);
          },
        },
      ],
      moreButtons: [
        // ??????
        {
          text: this.language.Enable,
          iconClassName: 'fiLink-enable',
          needConfirm: true,
          canDisabled: true,
          permissionCode: '26-3-6',
          confirmContent: `${this.languageTable.strategyList.confirmEnable}?`,
          handle: (data) => {
            this.lightingEnableStrategy(data);
          },
        },
        // ??????
        {
          text: this.language.Disable,
          iconClassName: 'fiLink-disable-o',
          needConfirm: true,
          canDisabled: true,
          permissionCode: '26-3-7',
          confirmContent: `${this.languageTable.strategyList.confirmDeactivation}?`,
          handle: (data) => {
            this.lightingDisableStrategy(data);
          },
        },
      ],
      operation: [
        // ??????
        {
          text: this.language.detailHandle,
          className: 'fiLink-view-detail',
          permissionCode: '26-3-4',
          handle: (currentIndex) => {
            this.router.navigate(['business/energy/energy-collect/task-info'], {
              queryParams: { id: currentIndex.strategyId },
            });
          },
        },
        // ??????
        {
          text: this.language.updateHandle,
          permissionCode: '26-3-3',
          key: 'isShowEditIcon',
          className: 'fiLink-edit',
          handle: (currentIndex) => {
            this.router.navigate(['business/energy/energy-collect/task-update'], {
              queryParams: { id: currentIndex.strategyId },
            });
          },
        },
        {
          // ????????????
          text: this.language.deleteHandle,
          className: 'fiLink-delete red-icon',
          permissionCode: '26-3-5',
          btnType: 'danger',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          canDisabled: false,
          confirmContent: this.language.deleteFacilityMsg,
          handle: (currentIndex) => {
            this.deleteDeviceByIds([currentIndex.strategyId]);
          },
        },
      ],
      rightTopButtons: [],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
      handleExport: (event) => {
        // ????????????
        const body = new ExportRequestModel(
          event.columnInfoList,
          event.excelType,
          new QueryConditionModel(),
        );
        body.columnInfoList = event.columnInfoList;
        const params = [
          'effectivePeriodStart',
          'effectivePeriodEnd',
          'execType',
          'execTime',
          'collectStatus',
          'strategyStatus',
          'createTime',
          'updateTime',
        ];
        body.columnInfoList.forEach((item) => {
          if (params.indexOf(item.propertyName) > -1) {
            item.isTranslation = 1;
          }
        });
        // ?????????????????????
        if (event.selectItem.length > 0) {
          const ids = event.selectItem.map((item) => item.strategyId);
          const filter = new FilterCondition('strategyId', OperatorEnum.in, ids);
          body.queryCondition.filterConditions.push(filter);
        } else {
          // ??????????????????
          body.queryCondition.filterConditions = event.queryTerm;
        }
        this.$energyApiService.dataCollectionExport_API(body).subscribe((res) => {
          if (res.code === ResultCodeEnum.success) {
            this.$message.success(this.language.config.exportSuccess);
          } else {
            this.$message.error(res.msg);
          }
        });
      },
    };
  }

  // ??????????????????
  private refreshData() {
    this.tableConfig.isLoading = true;
    this.$energyApiService.dataCollectionTaskList_API(this.queryCondition).subscribe(
      (result: ResultModel<EnergyDataCollectionTaskList[]>) => {
        this.tableConfig.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          console.log(result.data, 'result.data');
          this.pageBean.Total = result.totalCount;
          this.pageBean.pageIndex = result.pageNum;
          this.pageBean.pageSize = result.size;
          result.data.forEach((item) => {
            item.strategyStatus = item.strategyStatus === ExecStatusEnum.implement;
            item.isShowEditIcon = true;
          });
          this.dataSet = result.data || [];
        } else {
          this.$message.error(result.msg);
        }
      },
      () => {
        this.tableConfig.isLoading = false;
      },
    );
  }

  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  // ?????????????????????
  private deleteDeviceByIds(ids: string[]): void {
    this.tableConfig.isLoading = true;
    this.$energyApiService.dataCollectionTaskDelete_API(ids).subscribe(
      (result: ResultModel<string>) => {
        if (result.code === ResultCodeEnum.success) {
          this.$message.success(this.languageCommon.deleteSuccess);
          // ??????????????????
          this.queryCondition.pageCondition.pageNum = 1;
          this.refreshData();
        } else {
          this.tableConfig.isLoading = false;
          this.$fiLinkMessage.error(result.msg);
        }
      },
      () => {
        this.tableConfig.isLoading = false;
      },
    );
  }

  /**
   * ????????????
   * @ param data
   */
  public lightingEnableStrategy(data: PolicyControlModel[]): void {
    const isEnable = data.some((item) => item.strategyStatus as boolean);
    if (isEnable) {
      this.$fiLinkMessage.error(`${this.language.hasEnableData}!`);
    } else {
      const params = [];
      data.forEach((item) => {
        params.push({
          strategyType: item.strategyType,
          operation: ExecStatusEnum.implement,
          strategyId: item.strategyId,
        });
      });
      this.enableOrDisableStrategy(params, true);
    }
  }

  /**
   * ????????????
   * @ param data
   */
  public lightingDisableStrategy(data: PolicyControlModel[]): void {
    const isDisable = data.some((item) => !item.strategyStatus);
    if (isDisable) {
      this.$fiLinkMessage.error(`${this.language.hasDisableData}!`);
    } else {
      const params = [];
      data.forEach((item) => {
        params.push({
          strategyType: item.strategyType,
          operation: ExecStatusEnum.free,
          strategyId: item.strategyId,
        });
      });
      this.enableOrDisableStrategy(params, false);
    }
  }

  /**
   * ??????switch????????????
   * @ param event
   */
  public switchChange(data): void {
    console.log(data, 'data');
    const params = {
      strategyType: data.strategyType,
      operation: !!data.strategyStatus ? ExecStatusEnum.free : ExecStatusEnum.implement,
      strategyId: data.strategyId,
    };
    // if (data.strategyStatus) {
    //     if (!SessionUtil.checkHasRole('03-1-1')) {
    //         this.$message.warning('????????????????????????')
    //         return
    //     }
    // } else {
    //     if (!SessionUtil.checkHasRole('03-1-1')) {
    //         this.$message.warning('????????????????????????')
    //         return
    //     }
    // }
    // ????????????switch????????????????????????????????????????????????????????????????????????????????????????????????switch??????????????????????????????
    this.enableOrDisableStrategy([params], !data.strategyStatus);
  }

  // ????????????
  public enableOrDisableStrategy(params: EnableOrDisableModel[], status: boolean): void {
    this.enableOrDisableStrategyStatus(params, true);
    this.$energyApiService.enableOrDisableStrategy_API(params).subscribe(
      (result: ResultModel<string>) => {
        if (result.code !== ResultCodeEnum.success) {
          this.$message.error(result.msg);
          this.enableOrDisableStrategyStatus(params, false);
        } else {
          this.enableOrDisableStrategyStatus(params, false, status);
        }
      },
      () => this.enableOrDisableStrategyStatus(params, false),
    );
  }
  /**
   * ??????????????????loading??????
   * @ param data
   * @ param flag
   */
  public enableOrDisableStrategyStatus(data, loadingFlag: boolean, status?: boolean) {
    data.forEach((value) => {
      this.dataSet.forEach((item) => {
        if (value.strategyId === item.strategyId) {
          item.switchLoading = loadingFlag;
          if (typeof status === 'boolean') {
            item.strategyStatus = status;
          }
        }
      });
    });
  }
}
