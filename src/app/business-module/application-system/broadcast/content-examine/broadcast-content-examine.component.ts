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
import {RoleUnitModel} from '../../../../core-module/model/work-order/role-unit.model';
import {CheckUserModel} from '../../share/model/check.user.model';
import {ListExportModel} from '../../../../core-module/model/list-export.model';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {IS_TRANSLATION_CONST} from '../../../../core-module/const/common.const';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {WorkOrderTypeEnum} from '../../share/enum/program.enum';

/**
 * 审核列表页面
 */
@Component({
  selector: 'app-broadcast-content-examine',
  templateUrl: './broadcast-content-examine.component.html',
  styleUrls: ['./broadcast-content-examine.component.scss']
})
export class BroadcastContentExamineComponent implements OnInit, OnDestroy {
  /**
   * 工单状态
   */
  @ViewChild('workOrderStatusTemp') workOrderStatusTemp: TemplateRef<HTMLDocument>;
  /**
   * 转派原因causeReasonTable
   */
  @ViewChild('transferReasonTable') transferReasonTable: TemplateRef<HTMLDocument>;
  /**
   * 退单原因
   */
  @ViewChild('causeReasonTable') causeReasonTable: TemplateRef<HTMLDocument>;
  /**
   * 审核意见
   */
  @ViewChild('auditOpinionTable') auditOpinionTable: TemplateRef<HTMLDocument>;
  /**
   * 备注
   */
  @ViewChild('remarkTable') remarkTable: TemplateRef<HTMLDocument>;
  /**
   * 责任人自定义
   */
  @ViewChild('roleTemp') roleTemp: TemplateRef<any>;
  /**
   * 列表数据
   */
  public dataSet: ContentExamineModel[] = [];
  /**
   * 分页初始设置
   */
  public pageBean: PageModel = new PageModel();
  /**
   * 列表配置
   */
  public tableConfig: TableConfigModel;
  /**
   * 国际化
   */
  public language: ApplicationInterface;
  /**
   * 列表查询参数
   */
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  /**
   * 审核人搜索列表
   */
  private reviewedSearchList: RoleUnitModel[] = [];


  /**
   *
   * @param $nzI18n  国际化服务
   * @param $router  路由跳转服务
   * @param $userService  操作用户后台接口服务
   * @param $message  提示信息服务
   * @param $applicationService  应用系统后台接口服务
   */
  constructor(
    private $nzI18n: NzI18nService,
    private $router: Router,
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
   * 分页事件
   * @param event 分页对象
   */
  public pageChange(event): void {
    this.queryCondition.pageCondition.pageNum = event._pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 初始化表格配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      // primaryKey: '09-2-5',
      primaryKey: '09-6-5',
      showSizeChanger: true,
      notShowPrint: false,
      showSearchExport: true,
      scroll: {x: '1600px', y: '600px'},
      noIndex: true,
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        // 序号
        {
          type: 'serial-number', width: 62, title: this.language.frequentlyUsed.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        // 工单名称
        {
          title: this.language.auditContent.workOrderName, key: 'workOrderName', width: 150, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        // 责任人
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
        // 工单状态
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
        // 期望完工时间
        {
          title: this.language.auditContent.expectedCompletionTime, key: 'expectCompTime', width: 150, isShowSort: true, pipe: 'date',
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'}
        },
        // 实际完工时间
        {
          title: this.language.auditContent.actualCompletionTime, key: 'actualCompTime', width: 180, isShowSort: true, pipe: 'date',
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'}
        },
        // 创建时间
        {
          title: this.language.auditContent.creationTime, key: 'createTime', width: 150, isShowSort: true, pipe: 'date',
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'}
        },
        // 审核意见
        {
          title: this.language.auditContent.examineOpinion, key: 'examineAdvise', width: 150, isShowSort: true,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.auditOpinionTable,
          searchConfig: {type: 'input'}
        },
        // 审核内容
        {
          title: this.language.auditContent.examineContent, key: 'programName', width: 150,
          configurable: true,
          searchConfig: {type: 'input'},
        },
        // 转派原因
        {
          title: this.language.auditContent.reasonsForTransfer, key: 'transferReason', width: 200, isShowSort: true,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.transferReasonTable,
          searchConfig: {type: 'input'}
        },
        // 退单原因
        {
          title: this.language.auditContent.chargebackReason, key: 'causeReason', width: 200, isShowSort: true,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.causeReasonTable,
          searchConfig: {type: 'input'}
        },
        // 备注
        {
          title: this.language.frequentlyUsed.remarks, key: 'remark', width: 200, isShowSort: true,
          configurable: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.remarkTable,
          searchConfig: {type: 'input'}
        },
        // 操作
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
        // 删除
        {
          text: this.language.frequentlyUsed.delete,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          permissionCode: '09-6-5-2',
          needConfirm: true,
          canDisabled: true,
          // 确认删除
          confirmContent: `${this.language.frequentlyUsed.confirmDelete}?`,
          handle: (data: ContentExamineModel[]) => {
            this.workOrderApproval(data);
          }
        }
      ],
      operation: [
        // 查看详情
        {
          text: this.language.frequentlyUsed.viewDetails,
          className: 'fiLink-view-detail',
          permissionCode: '09-6-5-1',
          handle: (data: ContentExamineModel) => {
            this.workOrderDetails(data.workOrderId);
          },
        },
        // 删除
        {
          text: this.language.frequentlyUsed.delete,
          className: 'fiLink-delete red-icon',
          needConfirm: true,
          permissionCode: '09-6-5-2',
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
      //  导出数据
      handleExport: (event: ListExportModel<ContentExamineModel[]>) => {
        this.handelExportWorkOrderList(event);
      },
    };
  }


  /**
   * 刷新表格数据
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    const workOrderTypeIsExist = this.queryCondition.filterConditions.find(item => item.filterField === 'workOrderType');
    if (!workOrderTypeIsExist) {
      this.queryCondition.filterConditions.push({
        filterValue: WorkOrderTypeEnum.broadcast,
        filterField: 'workOrderType',
        operator: 'eq'
      });
    }
    this.$applicationService.getReleaseProgramWorkList(this.queryCondition)
      .subscribe((result: ResultModel<ContentExamineModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.tableConfig.isLoading = false;
          this.dataSet = result.data;
          this.pageBean.Total = result.totalCount;
          this.pageBean.pageIndex = result.pageNum;
          this.pageBean.pageSize = result.size;
          // 对数据进行格式转换
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
   * 列表删除方法
   * @param workOrderList 工单数组
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
    // 遍历data 将data中的programId push到集合中
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
          // 删除跳第一页
          this.queryCondition.pageCondition.pageNum = 1;
          this.refreshData();
        } else {
          this.$message.error(result.msg);
        }
      });
  }


  /**
   * 用户列表查询
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
   * 跳转到详情页面
   * @param workOrderId 工单ID
   */
  private workOrderDetails(workOrderId: string): void {
    this.$router.navigate(['business/application/broadcast/broadcast-content-examine/policy-details'], {
      queryParams: {workOrderId: workOrderId}
    }).then();
  }

  /**
   * 导出数据
   */
  private handelExportWorkOrderList(event: ListExportModel<ContentExamineModel[]>): void {
    // 处理参数
    const exportBody = new ExportRequestModel(event.columnInfoList, event.excelType);
    exportBody.columnInfoList.forEach(item => {
      if (['workOrderStatus', 'expectCompTime', 'actualCompTime', 'createTime'].includes(item.propertyName)) {
        // 后台处理字段标示
        item.isTranslation = IS_TRANSLATION_CONST;
      }
    });
    // 处理选择的数据
    if (event && !_.isEmpty(event.selectItem)) {
      const ids = event.selectItem.map(item => item.workOrderId);
      const filter = new FilterCondition('workOrderId', OperatorEnum.in, ids);
      exportBody.queryCondition.filterConditions.push(filter);
    } else {
      // 处理查询条件
      exportBody.queryCondition.filterConditions = event.queryTerm;
    }
    const workOrderTypeFilter = new FilterCondition('workOrderType', OperatorEnum.eq, WorkOrderTypeEnum.broadcast);
    exportBody.queryCondition.filterConditions.push(workOrderTypeFilter);
    // 调用后台接口
    this.$applicationService.exportWorkOrderData(exportBody).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(result.msg);
      } else {
        this.$message.error(result.msg);
      }
    });
  }
}
