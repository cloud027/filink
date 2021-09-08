import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import * as _ from 'lodash';
import {CommonLanguageInterface} from '../../../../assets/i18n/common/common.language.interface';
import {LanguageEnum} from '../../../shared-module/enum/language.enum';
import { NzI18nService } from 'ng-zorro-antd';
import {PageModel} from '../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../shared-module/model/query-condition.model';
import { Router } from '@angular/router';
import {SupplierLanguageInterface} from '../../../../assets/i18n/supplier/supplier.language.interface';
import {ListExportModel} from '../../../core-module/model/list-export.model';
import {ExportRequestModel} from '../../../shared-module/model/export-request.model';
import {IS_TRANSLATION_CONST} from '../../../core-module/const/common.const';
import {OperatorEnum} from '../../../shared-module/enum/operator.enum';
import {ResultModel} from '../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../shared-module/enum/result-code.enum';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import {SupplierApiService} from '../share/service/supplier-api.service';
import {UserRoleModel} from '../../../core-module/model/user/user-role.model';
import {FilterValueModel} from '../../../core-module/model/work-order/filter-value.model';
import {SupplierAptitudesEnum} from '../../../core-module/enum/supplier/supplier-aptitudes.enum';
import {SupplierForCommonService} from '../../../core-module/api-service/supplier/supplier-for-common.service';
import {SupplierDataModel} from '../../../core-module/model/supplier/supplier-data.model';
import {CommonUtil} from '../../../shared-module/util/common-util';

/**
 * 供应商管理页面
 */
@Component({
  selector: 'app-supplier-manage',
  templateUrl: './supplier-manage.component.html',
  styleUrls: ['./supplier-manage.component.scss']
})
export class SupplierManageComponent implements OnInit {
  // 创建人、更新人员
  @ViewChild('userSearchTemp') userSearchTemp: TemplateRef<any>;
  @ViewChild('updateUserSearchTemp') updateUserSearchTemp: TemplateRef<any>;
  // 供应商资质
  @ViewChild('supplierAptitudesTemp') supplierAptitudesTemp: TemplateRef<any>;
  // 国际化
  public supplierLanguage: SupplierLanguageInterface;
  public commonLanguage: CommonLanguageInterface;
  // 供应商数据
  public supplierData: SupplierDataModel[] = [];
  // 列表分页
  public pageBean: PageModel = new PageModel();
  // 列表配置
  public tableConfig: TableConfigModel = new TableConfigModel();
  // 列表查询参数
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 供应商资质枚举
  public supplierAptitudesEnum = SupplierAptitudesEnum;
  // 国际化枚举
  public languageEnum = LanguageEnum;
  // 勾选用户
  public checkUserObject: FilterValueModel = new FilterValueModel();
  // 显示用户选择
  public isShowUserTemp: boolean = false;
  public isShowUpdateUserTemp: boolean = false;
  // 存放选择的创建人数据
  public selectUserList: UserRoleModel[] = [];
  // 存放选择的更新人员数据
  public selectUpdateUserList: UserRoleModel[] = [];
  // 用户显示
  private userFilterValue: FilterCondition;
  constructor(public $nzI18n: NzI18nService,
              public $message: FiLinkModalService,
              public $supplierService: SupplierApiService,
              public $supplierForCommonService: SupplierForCommonService,
              private $router: Router) { }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 初始国际化
    this.supplierLanguage = this.$nzI18n.getLocaleData(LanguageEnum.supplier);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.initTableConfig();
    this.querySupplierList();
  }
  /**
   * 分页
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.querySupplierList();
  }
  /**
   * 用户名称
   */
  public onSelectUser(event: UserRoleModel[]): void {
    // 判断是选择的创建人还是更新人员
    if (this.userFilterValue.filterField === 'createId') {
      this.selectUserList = event;
    } else {
      this.selectUpdateUserList = event;
    }
    this.checkUserObject = {
      userIds: event.map(v => v.id) || [],
      userName: event.map(v => v.userName).join(',') || '',
    };
    this.userFilterValue.filterValue = this.checkUserObject.userIds.length > 0 ? this.checkUserObject.userIds : null;
    this.userFilterValue.filterName = this.checkUserObject.userName;
  }

  /**
   * 用户名称选择
   */
  public openUserSelector(filterValue: FilterCondition, isCreateUser: boolean): void {
    // 判断是创建人还是更新人员的选择框
    if (isCreateUser) {
      this.isShowUserTemp = true;
    } else {
      this.isShowUpdateUserTemp = true;
    }
    this.userFilterValue = filterValue;
    this.userFilterValue.operator = OperatorEnum.in;
  }
  /**
   * 查询供应商列表数据
   */
  private querySupplierList(): void {
    this.tableConfig.isLoading = true;
    this.$supplierForCommonService.querySupplierList(this.queryCondition).subscribe((res: ResultModel<SupplierDataModel[]>) => {
      this.tableConfig.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        this.supplierData = res.data || [];
        this.pageBean.pageIndex = res.pageNum;
        this.pageBean.Total = res.totalCount;
        this.pageBean.pageSize = res.size;
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }
  /**
   * 初始化列表数据
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSizeChanger: true,
      showSearchSwitch: true,
      showPagination: true,
      notShowPrint: false,
      scroll: {x: '1200px', y: '600px'},
      noIndex: true,
      showSearchExport: true,
      primaryKey: '24-1',
      columnConfig: [
        // 选择
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0'}}, width: 60},
        // 序号
        {
          type: 'serial-number',
          width: 60,
          title: this.commonLanguage.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '60px'}}
        },
        {
          // 供应商名称
          title: this.supplierLanguage.supplierName,
          key: 'supplierName',
          width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 供应商编号
          title: this.supplierLanguage.supplierNum,
          key: 'supplierNum',
          width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 供应商基础信息
          title: this.supplierLanguage.supplierBasicInformation,
          key: 'supplierBasicInformation',
          width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 供应商资质
          title: this.supplierLanguage.supplierAptitudes,
          key: 'supplierAptitudes',
          type: 'render',
          renderTemplate: this.supplierAptitudesTemp,
          width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: CommonUtil.codeTranslate(SupplierAptitudesEnum, this.$nzI18n, null, LanguageEnum.supplier),
            label: 'label',
            value: 'code'
          }
        },
        {
          // 公司地址
          title: this.supplierLanguage.address,
          key: 'address',
          width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 联系人
          title: this.supplierLanguage.attn,
          key: 'attn',
          width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 联系电话
          title: this.supplierLanguage.attnPhone,
          key: 'attnPhone',
          width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 创建人
          title: this.supplierLanguage.createUser, key: 'createUser', width: 120,
          configurable: true,
          isShowSort: true,
          sortKey: 'createId',
          searchKey: 'createId',
          searchable: true,
          hidden: true,
          searchConfig: {type: 'render', renderTemplate: this.userSearchTemp},
        },
        { // 创建时间
          title: this.supplierLanguage.createTime, key: 'createTime', width: 150,
          isShowSort: true,
          pipe: 'date',
          pipeParam: 'yyyy-MM-dd hh:mm:ss',
          configurable: true,
          searchable: true,
          hidden: true,
          searchConfig: {type: 'dateRang'}
        },
        {
          // 更新人员
          title: this.supplierLanguage.updateUser, key: 'updateUser', width: 120,
          configurable: true,
          isShowSort: true,
          sortKey: 'updateId',
          searchKey: 'updateId',
          searchable: true,
          hidden: true,
          searchConfig: {type: 'render', renderTemplate: this.updateUserSearchTemp},
        },
        { // 更新时间
          title: this.supplierLanguage.updateTime, key: 'updateTime', width: 150,
          pipe: 'date',
          pipeParam: 'yyyy-MM-dd hh:mm:ss',
          configurable: true,
          searchable: true,
          hidden: true,
          isShowSort: true,
          searchConfig: {type: 'dateRang'}
        },
        { // 备注
          title: this.supplierLanguage.remarks, key: 'remark', width: 150,
          configurable: true,
          isShowSort: true,
          searchable: true,
          hidden: true,
          searchConfig: {type: 'input'}
        },
        {
          // 操作
          title: this.commonLanguage.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 100, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        }
      ],
      bordered: false,
      showSearch: false,
      topButtons: [
        {
          // 新增
          text: this.commonLanguage.add,
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: '24-1-1',
          handle: () => {
            this.$router.navigate(['/business/supplier/supplier-manage/add']).then();
          }
        },
        {
          // 批量删除
          text: this.commonLanguage.deleteBtn,
          btnType: 'danger',
          needConfirm: true,
          canDisabled: true,
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          permissionCode: '24-1-3',
          handle: (data: SupplierDataModel[]) => {
            this.handleDeleteSupplier(data);
          }
        }
      ],
      operation: [
        {
          // 编辑
          text: this.commonLanguage.edit,
          className: 'fiLink-edit',
          permissionCode: '24-1-2',
          handle: (data: SupplierDataModel) => {
            console.log(data);
            this.$router.navigate(['/business/supplier/supplier-manage/update'],
              {queryParams: {supplierId: data.supplierId}}).then();
          },
        },
        {
          // 单个删除
          text: this.commonLanguage.deleteBtn,
          className: 'fiLink-delete red-icon',
          btnType: 'danger',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          canDisabled: true,
          permissionCode: '24-1-3',
          handle: (data: SupplierDataModel) => {
            this.handleDeleteSupplier([data]);
          }
        },
      ],
      // 筛选
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.querySupplierList();
      },
      // 搜索
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        // 没有值的时候重置已选数据
        if (!event.length) {
          this.selectUserList = [];
          this.selectUpdateUserList = [];
        }
        this.querySupplierList();
      },
      // 导出
      handleExport: (event: ListExportModel<SupplierDataModel[]>) => {
        // 处理参数
        const exportBody = new ExportRequestModel(event.columnInfoList, event.excelType);
        // 遍历字段设置后台需要特殊处理的标示
        const param = ['createTime', 'updateTime', 'supplierAptitudes'];
        exportBody.columnInfoList.forEach(item => {
          if (param.includes(item.propertyName)) {
            item.isTranslation = IS_TRANSLATION_CONST;
          }
        });
        // 处理选择的数据
        if (event && !_.isEmpty(event.selectItem)) {
          const ids = event.selectItem.map(item => item.supplierId);
          const filter = new FilterCondition('supplierId', OperatorEnum.in, ids);
          exportBody.queryCondition.filterConditions.push(filter);
        } else {
          // 处理查询条件
          exportBody.queryCondition.filterConditions = event.queryTerm;
        }
        this.$supplierService.exportSupplier(exportBody).subscribe((res: ResultModel<string>) => {
          if (res.code === ResultCodeEnum.success) {
            this.$message.success(this.supplierLanguage.exportSupplierSuccess);
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    };
  }

  /**
   * 单个或批量删除
   */
  private handleDeleteSupplier(data: SupplierDataModel[]): void {
    const supplierId = data.map(item => item.supplierId);
    this.$supplierService.batchDeleteSupplier(supplierId).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(this.supplierLanguage.deleteSuccess);
        this.queryCondition.pageCondition.pageNum = 1;
        this.querySupplierList();
      } else {
        this.$message.error(res.msg);
      }
    });
  }
}
