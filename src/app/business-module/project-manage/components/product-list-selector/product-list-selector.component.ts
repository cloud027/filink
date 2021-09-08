import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {FilterCondition, PageCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {ProductLanguageInterface} from '../../../../../assets/i18n/product/product.language.interface';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {ProductTypeEnum} from '../../../../core-module/enum/product/product.enum';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {PageModel} from '../../../../shared-module/model/page.model';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {ProductForCommonService} from '../../../../core-module/api-service/product/product-for-common.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';
import * as _ from 'lodash';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {ProductInfoModel} from '../../../../core-module/model/product/product-info.model';
import {PlanProjectLanguageInterface} from '../../../../../assets/i18n/plan-project/plan-project.language.interface';

/**
 * 产品列表选择器-弹窗
 */
@Component({
  selector: 'app-project-product-list-selector',
  templateUrl: './product-list-selector.component.html',
  styleUrls: ['./product-list-selector.component.scss']
})
export class ProductListSelectorComponent implements OnInit {
  // 选中的产品id
  @Input() selectedProductId;
  // 弹框显示状态
  @Input()
  set productListVisible(params) {
    this._productListVisible = params;
    this.productListVisibleChange.emit(this._productListVisible);
  }

  // 获取modal框显示状态
  get productListVisible() {
    return this._productListVisible;
  }
  // 显示隐藏变化
  @Output() public productListVisibleChange = new EventEmitter<any>();
  // 选中的值变化
  @Output() public selectDataChange = new EventEmitter<any>();
  // 列表单选
  @ViewChild('radioTemp') private radioTemp: TemplateRef<HTMLDocument>;
  //  产品类型模版
  @ViewChild('productTypeTemplate') public productTypeTemplate: TemplateRef<HTMLDocument>;
  // 显示隐藏
  public _productListVisible = false;
  // 产品语言包
  public productLanguage: ProductLanguageInterface;
  // 公共语言包国际化
  public commonLanguage: CommonLanguageInterface;
  public planLanguage: PlanProjectLanguageInterface;

  // 产品列表结果集
  public dataSet = [];
  // 分页参数
  public pageBean: PageModel = new PageModel(5, 1);
  // 列表查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 列表配置
  public tableConfig: TableConfigModel = new TableConfigModel();

  // 列表勾选产品
  public selectData: ProductInfoModel[] = [];

  // 设施类型枚举
  public deviceTypeEnum = DeviceTypeEnum;
  // 产品类型枚举
  public productTypeEnum = ProductTypeEnum;
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 设施国际化
  public languageEnum = LanguageEnum;

  constructor(
    private $nzI18n: NzI18nService,
    private $productForCommonService: ProductForCommonService,
    private $message: FiLinkModalService,
  ) {
  }

  ngOnInit() {
    // 获取语言包
    this.productLanguage = this.$nzI18n.getLocaleData(LanguageEnum.product);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.planLanguage = this.$nzI18n.getLocaleData(LanguageEnum.planProject);
    this.queryCondition.pageCondition = new PageCondition(1, 5);
    this.initTableConfig();
    this.refreshData();
    // if (this.selectedProductId) {
    //   debugger
    //   this.selectData = [this.selectedProductId];
    // }
  }

  /**
   * 选择产品变化
   */
  public selectedProductChange(event, data) {
    this.selectData = [data];
    this.selectedProductId =  event || null;
  }

  /**
   * 切换分页触发事件
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * 确定
   */
  public handleOk() {
    this.productListVisible = false;
    this.selectDataChange.emit(this.selectData);
  }

  /**
   * 取消
   */
  public handleCancel() {
    this.productListVisible = false;
  }

  /**
   * 刷新列表
   */
  private refreshData() {
    this.queryCondition.filterConditions.push(new FilterCondition('typeCode', OperatorEnum.in, ['D002']));
    this.$productForCommonService.queryProductList(this.queryCondition).subscribe((res: ResultModel<any>) => {
      if (res.code === ResultCodeEnum.success) {
        this.dataSet = res.data || [];
        this.pageBean.pageIndex = res.pageNum;
        this.pageBean.Total = res.totalCount;
        this.pageBean.pageSize = res.size;
        this.tableConfig.isLoading = false;
        // 获取设备和设施的图标
        if (!_.isEmpty(this.dataSet)) {
          this.dataSet.forEach(item => {
            if (String(item.typeFlag) === String(ProductTypeEnum.facility)) {
              item.iconClass = CommonUtil.getFacilityIConClass(item.typeCode);
            } else {
              item.iconClass = CommonUtil.getEquipmentTypeIcon(item as EquipmentListModel);
            }
            if (this.selectedProductId) {
              // 回显 选中的产品id
              if (item.productId === this.selectedProductId) {
                this.selectData = [item];
              }
            }
          });
        }
      } else {
        this.$message.error(res.msg);
        this.tableConfig.isLoading = false;
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }


  /**
   *初始化表格配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: true,
      outHeight: 108,
      showSizeChanger: true,
      notShowPrint: true,
      showSearchSwitch: true,
      showPagination: true,
      pageSizeOptions: [5, 10, 20, 30, 40],
      // selectedIdKey: 'productId',
      scroll: {x: '1804px', y: '340px'},
      noIndex: true,
      columnConfig: [
        {
          title: '', type: 'render',
          key: 'selectedProductId',
          renderTemplate: this.radioTemp,
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 42
        },
        { // 序号
          type: 'serial-number',
          width: 62,
          title: this.productLanguage.serialNum,
          fixedStyle: {fixedLeft: true, style: {left: '42px'}}
        },
        { // 规格型号
          title: this.productLanguage.productModel, key: 'productModel', width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 类型
          title: this.productLanguage.model, key: 'typeCode', width: 150,
          type: 'render',
          renderTemplate: this.productTypeTemplate,
          isShowSort: true,
        },
        { // 供应商
          title: this.productLanguage.supplier, key: 'supplierName', width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 报废年限
          title: this.productLanguage.scrapTime, key: 'scrapTime', width: 100,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        // { // 软件版本
        //   title: this.productLanguage.softVersion, key: 'softwareVersion', width: 150,
        //   isShowSort: true,
        //   searchable: true,
        //   searchConfig: {type: 'input'}
        // },
        // { // 硬件版本
        //   title: this.productLanguage.hardWareVersion, key: 'hardwareVersion', width: 150,
        //   isShowSort: true,
        //   searchable: true,
        //   searchConfig: {type: 'input'}
        // },
        { // 操作列
          title: this.productLanguage.operate,
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '', width: 180,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition = event;
        this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        event.forEach(item => {
          if (item.filterField === 'scrapTime') {
            item.operator = 'eq';
          }
        });
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
    };
  }

}
