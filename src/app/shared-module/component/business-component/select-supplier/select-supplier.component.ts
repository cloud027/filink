import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import { NzI18nService } from 'ng-zorro-antd';
import {LanguageEnum} from '../../../enum/language.enum';
import {PageModel} from '../../../model/page.model';
import {TableConfigModel} from '../../../model/table-config.model';
import {PageCondition, QueryConditionModel, SortCondition} from '../../../model/query-condition.model';
import {SupplierLanguageInterface} from '../../../../../assets/i18n/supplier/supplier.language.interface';
import {ResultModel} from '../../../model/result.model';
import {ResultCodeEnum} from '../../../enum/result-code.enum';
import {SupplierAptitudesEnum} from '../../../../core-module/enum/supplier/supplier-aptitudes.enum';
import {SupplierForCommonService} from '../../../../core-module/api-service/supplier/supplier-for-common.service';
import {SupplierDataModel} from '../../../../core-module/model/supplier/supplier-data.model';
import {TableComponent} from '../../table/table.component';
import {CommonUtil} from '../../../util/common-util';
import {PageSizeEnum} from '../../../enum/page-size.enum';

/**
 * 供应商选择组件
 */
@Component({
  selector: 'app-select-supplier',
  templateUrl: './select-supplier.component.html',
  styleUrls: ['./select-supplier.component.scss']
})
export class SelectSupplierComponent implements OnInit, OnDestroy {
  // 所选数据
  @Input() selectSupplierList: SupplierDataModel[] = [];
  // 多选或单选
  @Input() multiple: boolean = true;
  // 显示隐藏
  @Input() public isVisible: boolean = false;
  // 选中的值变化
  @Output() selectDataChange = new EventEmitter<any>();
  // 显示隐藏变化
  @Output() isVisibleChange = new EventEmitter<boolean>();
  // 单选按钮
  @ViewChild('radioTemp') radioTemp: TemplateRef<HTMLDocument>;
  // 供应商资质
  @ViewChild('supplierAptitudesTemp') supplierAptitudesTemp: TemplateRef<any>;
  // 表格实例
  @ViewChild('tableComponent') private tableComponent: TableComponent;
  // 供应商资质枚举
  public supplierAptitudesEnum = SupplierAptitudesEnum;
  // 国际化枚举
  public languageEnum = LanguageEnum;
  // 国际化
  public commonLanguage: CommonLanguageInterface;
  // 供应商国际化
  public supplierLanguage: SupplierLanguageInterface;
  // 列表数据
  public tableDataSet = [];
  // 分页
  public pageBean: PageModel = new PageModel();
  // 列表配置
  public tableConfig: TableConfigModel;
  // 表格参数模型
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 供应商id
  public supplierId: string;
  constructor(private $nzI18n: NzI18nService,
              private $supplierForCommonService: SupplierForCommonService) { }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.supplierLanguage = this.$nzI18n.getLocaleData(LanguageEnum.supplier);
    this.queryCondition.pageCondition = new PageCondition(1, PageSizeEnum.sizeFive);
    this.initTableConfig();
    // 单选回显
    if (!this.multiple && this.selectSupplierList.length === 1) {
      this.supplierId = this.selectSupplierList[0].supplierId;
    }
    this.refreshData();
  }
  /**
   * 关闭
   */
  public handleClose(): void {
    // 如果选择清空后点击取消按钮，则需要记录之前所选数据的选中状态，下次进行回显
    this.tableDataSet.forEach(item => {
      item.checked = this.selectSupplierList.some(selectItem => selectItem.supplierId === item.supplierId);
    });
    this.isVisibleChange.emit();
  }
  /**
   * 列表分页
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }
  /**
   * 确定
   */
  public selectData(): void {
    this.selectDataChange.emit(this.selectSupplierList);
    this.isVisibleChange.emit();
  }
  /**
   * 单选
   */
  public onSupplierChange(event: string, data: SupplierDataModel): void {
    this.supplierId = event;
    this.selectSupplierList = [data];
  }

  /**
   * 清空
   */
  public clearSelectData(): void {
    this.tableComponent.keepSelectedData.clear();
    this.tableComponent.checkAll(false);
  }
  /**
   * 查询列表
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$supplierForCommonService.querySupplierList(this.queryCondition).subscribe((res: ResultModel<SupplierDataModel[]>) => {
      this.tableConfig.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        this.tableDataSet = res.data || [];
        this.pageBean.pageIndex = res.pageNum;
        this.pageBean.Total = res.totalCount;
        this.pageBean.pageSize = res.size;
        const ids = this.selectSupplierList.map(v => v.supplierId);
        this.tableDataSet.forEach(item => {
          if (ids.includes(item.supplierId)) {
            item.checked = true;
          }
        });
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }
  /**
   * 销毁
   */
  public ngOnDestroy(): void {
    this.tableComponent = null;
  }
  /**
   * 初始化列表数据
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      noIndex: true,
      showSearchSwitch: true,
      showRowSelection: false,
      showSizeChanger: true,
      showPagination: true,
      pageSizeOptions: [5, 10, 20, 30, 40],
      notShowPrint: true,
      keepSelected: true,
      selectedIdKey: 'supplierId',
      scroll: {x: '1000px', y: '600px'},
      columnConfig: [
        // 选择
        {
          type: this.multiple ? 'select' : 'render',
          title: '',
          renderTemplate: this.multiple ? null : this.radioTemp,
          fixedStyle: {fixedLeft: true, style: {left: '0'}}, width: 62
        },
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
          searchConfig: {type: 'input'}
        },
        {
          // 供应商编号
          title: this.supplierLanguage.supplierNum,
          key: 'supplierNum',
          width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 供应商基础信息
          title: this.supplierLanguage.supplierBasicInformation,
          key: 'supplierBasicInformation',
          width: 150,
          isShowSort: true,
          searchable: true,
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
          searchConfig: {type: 'input'}
        },
        {
          // 联系人
          title: this.supplierLanguage.attn,
          key: 'attn',
          width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 联系电话
          title: this.supplierLanguage.attnPhone,
          key: 'attnPhone',
          width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 备注
          title: this.supplierLanguage.remarks, key: 'remark', width: 150,
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
      topButtons: [],
      operation: [],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
      handleSelect: (event: SupplierDataModel[]) => {
        this.selectSupplierList = [];
        if (event && event.length > 0) {
          this.selectSupplierList = event;
        }
      }
    };
  }
}
