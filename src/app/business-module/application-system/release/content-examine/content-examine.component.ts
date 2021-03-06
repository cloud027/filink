import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {ApplicationService} from '../../share/service/application.service';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {workOrderStatus} from '../../share/util/application.util';
import {ApplicationInterface} from '../../../../../assets/i18n/application/application.interface';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {ContentExamineModel} from '../../share/model/content.examine.model';
import {WorkOrderStateStatusEnum} from '../../../../core-module/enum/work-order/work-order.enum';
import {InstructUtil} from '../../share/util/instruct-util';
import {ContentExamineDetailModel} from '../../share/model/content.examine.detail.model';
import {CheckUserModel} from '../../share/model/check.user.model';
import {ListExportModel} from '../../../../core-module/model/list-export.model';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {IS_TRANSLATION_CONST} from '../../../../core-module/const/common.const';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {UserForCommonService} from '../../../../core-module/api-service/user';
import {RoleUnitModel} from '../../../../core-module/model/work-order/role-unit.model';
import {WorkOrderTypeEnum} from '../../share/enum/program.enum';

/**
 * ??????????????????
 */
@Component({
  selector: 'app-content-examine',
  templateUrl: './content-examine.component.html',
  styleUrls: ['./content-examine.component.scss']
})
export class ContentExamineComponent implements OnInit, OnDestroy {
  /**
   * ????????????
   */
  @ViewChild('workOrderStatusTemp') workOrderStatusTemp: TemplateRef<HTMLDocument>;
  /**
   * ????????????causeReasonTable
   */
  @ViewChild('transferReasonTable') transferReasonTable: TemplateRef<HTMLDocument>;
  /**
   * ????????????
   */
  @ViewChild('causeReasonTable') causeReasonTable: TemplateRef<HTMLDocument>;
  /**
   * ????????????
   */
  @ViewChild('auditOpinionTable') auditOpinionTable: TemplateRef<HTMLDocument>;
  /**
   * ??????
   */
  @ViewChild('remarkTable') remarkTable: TemplateRef<HTMLDocument>;
  /**
   * ??????????????????
   */
  @ViewChild('roleTemp') roleTemp: TemplateRef<any>;
  /**
   * ????????????
   */
  public dataSet: ContentExamineModel[] = [];
  /**
   * ??????????????????
   */
  public pageBean: PageModel = new PageModel();
  /**
   * ????????????
   */
  public tableConfig: TableConfigModel;
  /**
   * ?????????
   */
  public language: ApplicationInterface;
  /**
   * ??????????????????
   */
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  /**
   * ?????????????????????
   */
  private reviewedSearchList: RoleUnitModel[] = [];


  /**
   *
   * @param $nzI18n  ???????????????
   * @param $router  ??????????????????
   * @param $userService  ??????????????????????????????
   * @param $message  ??????????????????
   * @param $applicationService  ??????????????????????????????
   */
  constructor(
    private $nzI18n: NzI18nService,
    private $router: Router,
    private $userService: UserForCommonService,
    private $message: FiLinkModalService,
    private $applicationService: ApplicationService
  ) {
  }

  ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.getCheckUsers();
    this.initTableConfig();
    this.refreshData();
  }

  ngOnDestroy(): void {
    this.workOrderStatusTemp = null;
    this.transferReasonTable = null;
    this.causeReasonTable = null;
    this.remarkTable = null;
    this.roleTemp = null;
  }

  /**
   * ????????????
   * @param event ????????????
   */
  public pageChange(event): void {
    this.queryCondition.pageCondition.pageNum = event._pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * ?????????????????????
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      primaryKey: '09-2-5',
      showSizeChanger: true,
      notShowPrint: false,
      showSearchExport: true,
      scroll: {x: '1600px', y: '600px'},
      noIndex: true,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        // ??????
        {
          type: 'serial-number', width: 62, title: this.language.frequentlyUsed.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        // ????????????
        {
          title: this.language.auditContent.workOrderName, key: 'workOrderName', width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        // ?????????
        {
          title: this.language.auditContent.personLiable, key: 'personLiableName', width: 150,
          configurable: true,
          searchKey: 'personLiable',
          searchable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: this.reviewedSearchList,
            renderTemplate: this.roleTemp,
          },
        },
        // ????????????
        {
          title: this.language.auditContent.workOrderStatus, key: 'workOrderStatus', width: 120,
          type: 'render',
          renderTemplate: this.workOrderStatusTemp,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: workOrderStatus(this.$nzI18n),
            label: 'label',
            value: 'code'
          }
        },
        // ??????????????????
        {
          title: this.language.auditContent.expectedCompletionTime, key: 'expectCompTime', width: 150, isShowSort: true, pipe: 'date',
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'}
        },
        // ??????????????????
        {
          title: this.language.auditContent.actualCompletionTime, key: 'actualCompTime', width: 180, isShowSort: true, pipe: 'date',
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'}
        },
        // ????????????
        {
          title: this.language.auditContent.creationTime, key: 'createTime', width: 150, isShowSort: true, pipe: 'date',
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'}
        },
        // ????????????
        {
          title: this.language.auditContent.examineOpinion, key: 'examineAdvise', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.auditOpinionTable,
          searchConfig: {type: 'input'}
        },
        // ????????????
        {
          title: this.language.auditContent.examineContent, key: 'programName', width: 150,
          configurable: true,
          searchConfig: {type: 'input'},
        },
        // ????????????
        {
          title: this.language.auditContent.reasonsForTransfer, key: 'transferReason', width: 200, isShowSort: true,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.transferReasonTable,
          searchConfig: {type: 'input'}
        },
        // ????????????
        {
          title: this.language.auditContent.chargebackReason, key: 'causeReason', width: 200, isShowSort: true,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.causeReasonTable,
          searchConfig: {type: 'input'}
        },
        // ??????
        {
          title: this.language.frequentlyUsed.remarks, key: 'remark', width: 200, isShowSort: true,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.remarkTable,
          searchConfig: {type: 'input'}
        },
        // ??????
        {
          title: this.language.frequentlyUsed.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 150, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      topButtons: [
        // ??????
        {
          text: this.language.frequentlyUsed.delete,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          permissionCode: '09-2-5-1',
          needConfirm: true,
          canDisabled: true,
          // ????????????
          confirmContent: `${this.language.frequentlyUsed.confirmDelete}?`,
          handle: (data: ContentExamineModel[]) => {
            this.workOrderApproval(data);
          }
        }
      ],
      operation: [
        // ????????????
        {
          text: this.language.frequentlyUsed.viewDetails,
          className: 'fiLink-view-detail',
          permissionCode: '09-2-5-2',
          handle: (data: ContentExamineModel) => {
            this.workOrderDetails(data.workOrderId);
          },
        },
        // ??????
        {
          text: this.language.frequentlyUsed.delete,
          className: 'fiLink-delete red-icon',
          needConfirm: true,
          permissionCode: '09-2-5-1',
          confirmContent: `${this.language.frequentlyUsed.confirmDelete}?`,
          handle: (data: ContentExamineModel) => {
            this.workOrderApproval([data]);
          }
        }
      ],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition = event;
        this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
      //  ????????????
      handleExport: (event: ListExportModel<ContentExamineModel[]>) => {
        this.handelExportWorkOrderList(event);
      },
    };
  }


  /**
   * ??????????????????
   */
  private refreshData(): void {
    const workOrderTypeIsExist = this.queryCondition.filterConditions.find(item => item.filterField === 'workOrderType');
    if (!workOrderTypeIsExist) {
      this.queryCondition.filterConditions.push({
        filterValue: WorkOrderTypeEnum.info,
        filterField: 'workOrderType',
        operator: 'eq'
      });
    }
    this.tableConfig.isLoading = true;
    this.$applicationService.getReleaseProgramWorkList(this.queryCondition)
      .subscribe((result: ResultModel<ContentExamineModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.tableConfig.isLoading = false;
          this.dataSet = result.data;
          this.pageBean.Total = result.totalCount;
          this.pageBean.pageIndex = result.pageNum;
          this.pageBean.pageSize = result.size;
          // ???????????????????????????
          this.dataSet.forEach(item => {
            item.statusIconClass = InstructUtil.getStatusClassName(item.workOrderStatus).iconClass;
            item.statusColorClass = InstructUtil.getStatusClassName(item.workOrderStatus).colorClass;
            item.workOrderStatus = workOrderStatus(this.$nzI18n, item.workOrderStatus) as WorkOrderStateStatusEnum;
          });
        } else {
          this.tableConfig.isLoading = false;
          this.$message.error(result.msg);
        }
      }, () => {
        this.tableConfig.isLoading = false;
      });
  }

  /**
   * ??????????????????
   * @param workOrderList ????????????
   */
  private workOrderApproval(workOrderList: ContentExamineModel[]): void {
    if (workOrderList.find(item => item.personLiable !== SessionUtil.getUserId())) {
      this.$message.warning(this.language.auditContent.deleteOthers);
      return;
    }
    if (workOrderList.find(item => item.workOrderStatus === workOrderStatus(this.$nzI18n, WorkOrderStateStatusEnum.assigned))) {
      this.$message.warning(this.language.auditContent.notDelete);
      return;
    }
    // ??????data ???data??????programId push????????????
    const workOrderIds = workOrderList.map(item => {
      return item.workOrderId;
    });
    const parameters = {
      workOrderIds: workOrderIds,
      actType: 0
    };
    this.$applicationService.releaseWorkOrder(parameters)
      .subscribe((result: ResultModel<ContentExamineDetailModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          // ??????????????????
          this.queryCondition.pageCondition.pageNum = 1;
          this.refreshData();
        } else {
          this.$message.error(result.msg);
        }
      });
  }


  /**
   * ??????????????????
   */
  private getCheckUsers(): void {
    this.$applicationService.getCheckUsers()
      .subscribe((result: ResultModel<CheckUserModel[]>) => {
          if (result.code === ResultCodeEnum.success) {
            const reviewedArray = [...result.data] || [];
            reviewedArray.forEach(item => {
              this.reviewedSearchList.push({'label': item.userName, 'value': item.id});
            });
          } else {
            this.$message.error(result.msg);
          }
        }
      );
  }

  /**
   * ?????????????????????
   * @param workOrderId ??????ID
   */
  private workOrderDetails(workOrderId: string): void {
    this.$router.navigate(['business/application/release/content-examine/policy-details'], {
      queryParams: {workOrderId: workOrderId}
    }).then();
  }

  /**
   * ????????????
   */
  private handelExportWorkOrderList(event: ListExportModel<ContentExamineModel[]>): void {
    // ????????????
    const exportBody = new ExportRequestModel(event.columnInfoList, event.excelType);
    exportBody.columnInfoList.forEach(item => {
      if (['workOrderStatus', 'expectCompTime', 'actualCompTime', 'createTime'].includes(item.propertyName)) {
        // ????????????????????????
        item.isTranslation = IS_TRANSLATION_CONST;
      }
    });
    // ?????????????????????
    if (event && !_.isEmpty(event.selectItem)) {
      const ids = event.selectItem.map(item => item.workOrderId);
      const filter = new FilterCondition('workOrderId', OperatorEnum.in, ids);
      exportBody.queryCondition.filterConditions.push(filter);
    } else {
      // ??????????????????
      exportBody.queryCondition.filterConditions = event.queryTerm;
    }
    const workOrderTypeFilter = new FilterCondition('workOrderType', OperatorEnum.eq, WorkOrderTypeEnum.info);
    exportBody.queryCondition.filterConditions.push(workOrderTypeFilter);
    // ??????????????????
    this.$applicationService.exportWorkOrderData(exportBody).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(result.msg);
      } else {
        this.$message.error(result.msg);
      }
    });
  }
}
