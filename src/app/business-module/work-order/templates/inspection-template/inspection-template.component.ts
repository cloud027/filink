import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {PageModel} from '../../../../shared-module/model/page.model';
import {Router} from '@angular/router';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {InspectionTemplateModel} from '../../share/model/template/inspection-template.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {OperateTypeEnum} from '../../../../shared-module/enum/page-operate-type.enum';
import {RoleUnitModel} from '../../../../core-module/model/work-order/role-unit.model';
import {OrderUserModel} from '../../../../core-module/model/work-order/order-user.model';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {InspectionWorkOrderService} from '../../share/service/inspection';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {UserRoleModel} from '../../../../core-module/model/user/user-role.model';
import {FilterValueModel} from '../../../../core-module/model/work-order/filter-value.model';
import {WorkOrderClearInspectUtil} from '../../share/util/work-order-clear-inspect.util';

declare const $: any;

/**
 * 巡检模板
 */
@Component({
  selector: 'app-inspection-template',
  templateUrl: './inspection-template.component.html',
  styleUrls: ['./inspection-template.component.scss']
})
export class InspectionTemplateComponent implements OnInit {
  // 责任人
  @ViewChild('userSearchTemp') userSearchTemp: TemplateRef<any>;
  // 设施总数模板
  @ViewChild('deviceCountTemp') deviceCountTemp: TemplateRef<any>;
  // 模板数据
  public tableDataSet: InspectionTemplateModel[] = [];
  // 分页
  public pageBean: PageModel = new PageModel();
  // 列表配置
  public tableConfig: TableConfigModel;
  // 导出
  public exportParams: ExportRequestModel = new ExportRequestModel();
  // 巡检模块国际化
  public InspectionLanguage: InspectionLanguageInterface;
  // 表格参数模型
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 勾选用户
  public checkUserObject: FilterValueModel = new FilterValueModel();
  // 存放用户数据
  public selectUserList: UserRoleModel[] = [];
  // 显示用户选择
  public isShowUserTemp: boolean = false;
  // 用户显示
  private userFilterValue: FilterCondition;
  // 获取责任人数据
  private roleArray: RoleUnitModel[] = [];
  // 去重
  private templateDuplication: boolean = false;
  // 已选择模板id
  private selectDataId: string[] = [];

  constructor(
    private $nzI18n: NzI18nService,
    private $router: Router,
    public $message: FiLinkModalService,
    private $inspectionWorkOrderService: InspectionWorkOrderService,
  ) { }

  public ngOnInit(): void {
    this.InspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.initTableConfig();
    this.refreshData();
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
   * 显示巡检完工记录列表数据
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    this.queryCondition.filterConditions.forEach(v => {
      if (v.filterField === 'inspectionItemSize') {
        v.operator = OperatorEnum.lte;
        v.filterValue = Math.floor(v.filterValue);
      }
      if (v.filterField === 'createUser') {
        v.operator = OperatorEnum.in;
      }
    });
    this.$inspectionWorkOrderService.queryInspectionTemplateList(this.queryCondition).subscribe((result: ResultModel<InspectionTemplateModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.pageBean.Total = result.totalCount;
        this.pageBean.pageIndex = result.pageNum;
        this.pageBean.pageSize = result.size;
        this.tableDataSet = result.data ? result.data : [];
      }
      this.tableConfig.isLoading = false;
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }
  /**
   * 完工记录分页
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }
  /**
   * 初始化表格
   */
  private initTableConfig(): void {
    const width = ($('.template-warp').width() - 300) / 4;
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      primaryKey: '06-3-1',
      showSearchSwitch: true,
      showRowSelection: false,
      showSizeChanger: true,
      showSearchExport: true,
      scroll: {x: '1200px', y: '600px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {// 模板名称
          title: this.InspectionLanguage.templateName, key: 'templateName',
          configurable: true, width: width,
          isShowSort: true,
          searchable: true,
          searchKey: 'templateName',
          searchConfig: {type: 'input'}
        },
        {// 巡检项数量
          title: this.InspectionLanguage.inspectNum, key: 'inspectionItemSize',
          configurable: true, width: width,
          isShowSort: true,
          searchable: true,
          searchKey: 'inspectionItemSize',
          searchConfig: {
            type: 'render',
            renderTemplate: this.deviceCountTemp,
          }
        },
        {// 完成时间
          title: this.InspectionLanguage.creationTime, key: 'createTime',
          pipe: 'date', width: width,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'createTime',
          searchConfig: {type: 'dateRang'}
        },
        {// 责任人
          title: this.InspectionLanguage.creatUser, key: 'createUserName',
          configurable: true, width: width,
          searchable: true,
          searchKey: 'createUser',
          searchConfig: {type: 'render', renderTemplate: this.userSearchTemp},
        },
        {// 操作
          title: this.InspectionLanguage.operate, searchable: true, configurable: false,
          searchConfig: {type: 'operate'}, key: '', width: 100, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      topButtons: [
        {
          text: '+  ' + this.InspectionLanguage.addArea,
          permissionCode: '06-3-4',
          handle: () => {
            this.$router.navigate([`/business/work-order/inspection-template/template-detail/${OperateTypeEnum.add}`],
              {queryParams: {status:  OperateTypeEnum.add}}).then();
          }
        },
        {
          text: this.InspectionLanguage.delete,
          permissionCode: '06-3-3',
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          canDisabled: true,
          needConfirm: true,
          handle: (currentIndex: InspectionTemplateModel[]) => {
            const arr = [];
            currentIndex.forEach(item => {
              arr.push(item.templateId);
            });
            this.deleteTemplate(arr);
          }
        },
      ],
      operation: [
        {
          // 编辑
          text: this.InspectionLanguage.edit,
          permissionCode: '06-3-2',
          className: 'fiLink-edit',
          handle: (currentIndex) => {
            this.$router.navigate([`/business/work-order/inspection-template/template-detail/${OperateTypeEnum.update}`],
              {queryParams: {procId: currentIndex.templateId, status: OperateTypeEnum.update}}).then();
          }
        },
        {  // 删除
          text: this.InspectionLanguage.delete,
          permissionCode: '06-3-3',
          btnType: 'danger',
          canDisabled: true,
          needConfirm: true,
          className: 'fiLink-delete red-icon',
          confirmContent: this.InspectionLanguage.isDeleteTemplate,
          handle: (currentIndex: InspectionTemplateModel) => {
            this.deleteTemplate([currentIndex.templateId]);
          }
        }
      ],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        if (event.length === 0) {
          this.selectUserList = [];
        }
        this.refreshData();
      },
      handleSelect: (event) => {
        this.selectDataId = event.map(v => v.templateId);
      },
      handleExport: (event) => {
        this.exportParams.columnInfoList = event.columnInfoList;
        this.exportParams.columnInfoList.forEach(item => {
          if (item.propertyName === 'createTime') {
            item.isTranslation = 1;
          }
        });
        this.exportParams.queryCondition = this.queryCondition;
        this.exportParams.excelType = event.excelType;
        const index = this.exportParams.queryCondition.filterConditions.findIndex(v => v.filterField === '_id');
        if (this.selectDataId.length) {
          if (index > -1) {
            this.exportParams.queryCondition.filterConditions[index].filterValue = this.selectDataId;
            this.exportParams.queryCondition.filterConditions[index].operator = OperatorEnum.in;
            this.templateDuplication = true;
          } else {
            this.exportParams.queryCondition.filterConditions.push({filterField: '_id', filterValue: this.selectDataId, operator: OperatorEnum.in});
          }
        }  else {
          const i = this.queryCondition.filterConditions.findIndex(v => v.filterField === '_id');
          if (i > -1) {
            this.queryCondition.filterConditions.splice(i, 1);
            this.exportParams.queryCondition = this.queryCondition;
          }
        }
        this.$inspectionWorkOrderService.exportInspectTemplate(this.exportParams).subscribe((result: ResultModel<string>) => {
          if (result.code === ResultCodeEnum.success) {
            this.$message.success(this.InspectionLanguage.operateMsg.exportSuccess);
          } else {
            this.$message.error(result.msg);
          }
        });
      }
    };
  }

  /**
   * 删除模板
   * @param arr 模板id数组
   */
  private deleteTemplate(arr: string[]): void {
    this.$inspectionWorkOrderService.deleteTemplate({'inspectionTemplateIdList': arr}).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.InspectionLanguage.operateMsg.deleteSuccess);
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshData();
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 获得所有的责任人
   */
  private getAllUser(): void {
    this.$inspectionWorkOrderService.getDepartUserList().subscribe((result: ResultModel<OrderUserModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        const roleArr = result.data;
        if (roleArr) {
          roleArr.forEach(item => {
            this.roleArray.push({'label': item.userName, 'value': item.id});
          });
        }
      }
    });
  }
}
