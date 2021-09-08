import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {TableComponent} from '../../../../../shared-module/component/table/table.component';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../../shared-module/model/query-condition.model';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {ProductLanguageInterface} from '../../../../../../assets/i18n/product/product.language.interface';
import {DeviceTypeEnum} from '../../../../../core-module/enum/facility/facility.enum';
import {EquipmentTypeEnum} from '../../../../../core-module/enum/equipment/equipment.enum';
import {FacilityForCommonUtil} from '../../../../../core-module/business-util/facility/facility-for-common.util';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {ProductTypeEnum} from '../../../../../core-module/enum/product/product.enum';
import {ProductInfoModel} from '../../../../../core-module/model/product/product-info.model';
import {ProductForCommonService} from '../../../../../core-module/api-service/product/product-for-common.service';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';

/**
 * 产品列表选择器
 */
@Component({
  selector: 'app-product-list-selector',
  templateUrl: './product-list-selector.component.html',
  styleUrls: ['./product-list-selector.component.scss']
})
export class ProductListSelectorComponent implements OnInit, OnDestroy {
  @Input()
  set productVisible(params) {
    this.isProductVisible = params;
    this.productVisibleChange.emit(this.isProductVisible);
  }
  // 获取modal框显示状态
  get productVisible() {
    return this.isProductVisible;
  }
  // 选择的产品id
  @Input() public selectProductId: string;
  // 选中的值变化
  @Output() public selectDataChange = new EventEmitter<ProductInfoModel[]>();
  // 显示隐藏变化
  @Output() private productVisibleChange = new EventEmitter<any>();
  // 表格实例
  @ViewChild('tableComponent') private tableComponent: TableComponent;
  //  产品类型模版
  @ViewChild('productTypeTemplate') public productTypeTemplate: TemplateRef<HTMLDocument>;
  // 列表单选
  @ViewChild('radioTemp') private radioTemp: TemplateRef<HTMLDocument>;
  // 产品列表数据集
  public dataSet: ProductInfoModel[] = [];
  //  已选产品数据集
  public selectedProductData: ProductInfoModel[] = [];
  // 分页参数
  public pageBean: PageModel = new PageModel();
  // 表格配置
  public tableConfig: TableConfigModel = new TableConfigModel();
  // 列表查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 是否显示
  public isProductVisible: boolean = false;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 产品管理国际化
  public productLanguage: ProductLanguageInterface;
  // 设施类型枚举
  public deviceTypeEnum = DeviceTypeEnum;
  // 国际化枚举
  public languageEnum = LanguageEnum;
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 产品类型枚举
  public productTypeEnum = ProductTypeEnum;

  constructor(private $nzI18n: NzI18nService,
              private $message: FiLinkModalService,
              private $productForCommonService: ProductForCommonService) { }

  /**
   * 初始化
    */
  public ngOnInit(): void {
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.productLanguage = this.$nzI18n.getLocaleData(LanguageEnum.product);
    // 初始化表格
    this.initTableConfig();
    //  查询列表数据
    this.queryProductList();
  }

  /**
   * 点击确认按钮
   */
  public handleConfirm(): void {
    // 如果编辑时未选择新数据，保持当前回显的数据，则直接关闭弹窗
    if(!this.selectedProductData.length && this.selectProductId) {
      this.productVisible = false;
      return;
    }
    this.selectDataChange.emit(this.selectedProductData);
    this.productVisible = false;
  }

  /**
   * 清空事件
   */
  public cleanUp(): void {
    this.selectProductId = '';
    this.selectedProductData = [];
  }

  /**
   * 页面切换
   * @param event 翻页实体
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryProductList();
  }

  /**
   * 销毁钩子 将模型设置成空
   */
  public ngOnDestroy(): void {
    this.tableComponent = null;
  }
  /**
   * 初始化表格配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showPagination: true,
      bordered: false,
      showSearch: false,
      showSearchSwitch: true,
      keepSelected: true,
      selectedIdKey: 'productId',
      showSizeChanger: true,
      notShowPrint: true,
      noAutoHeight: true,
      scroll: {x: '800px', y: '450px'},
      noIndex: true,
      showSearchExport: false,
      columnConfig: [
        { // 单选
          title: this.productLanguage.select,
          type: 'render',
          renderTemplate: this.radioTemp,
          fixedStyle: {
            fixedLeft: true,
            style: {left: '0px'}
          },
          width: 62
        },
        { // 序号
          type: 'serial-number',
          width: 62,
          title: this.productLanguage.serialNum,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // 规格型号
          title: this.productLanguage.productModel, key: 'productModel', width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 类型
          title: this.productLanguage.productType, key: 'typeCode', width: 150,
          type: 'render',
          renderTemplate: this.productTypeTemplate,
          isShowSort: true,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo:  FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n),
            label: 'label',
            value: 'code'
          }
        },
        { // 供应商
          title: this.productLanguage.supplier, key: 'supplierName', width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 软件版本
          title: this.productLanguage.softVersion, key: 'softwareVersion', width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 硬件版本
          title: this.productLanguage.hardWareVersion, key: 'hardwareVersion', width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.commonLanguage.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 150,
          fixedStyle: {fixedRight: false, style: {right: '0px'}}
        }
      ],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition = event;
        this.queryProductList();
      },
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.queryProductList();
      }
    };
  }

  /**
   * 查询产品列表
   */
  private queryProductList(): void {
    this.tableConfig.isLoading = true;
    // 筛选产品类型为设备的列表
    this.queryCondition.filterConditions.push(new FilterCondition('typeFlag', OperatorEnum.eq, ProductTypeEnum.equipment));
    this.$productForCommonService.queryProductList(this.queryCondition).subscribe((result: ResultModel<ProductInfoModel[]>) => {
      this.tableConfig.isLoading = false;
      if (result.code === ResultCodeEnum.success ) {
        this.dataSet = result.data || [];
        this.pageBean.Total = result.totalCount;
        this.pageBean.pageIndex = result.pageNum;
        this.pageBean.pageSize = result.size;
        // 获取设备图标
        if (!_.isEmpty(this.dataSet)) {
          this.dataSet.forEach(item => {
            item.iconClass = CommonUtil.getEquipmentTypeIcon(item as any);
          });
        }
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 单选设施
   */
  public productChange(event: string, data: ProductInfoModel): void {
    this.selectProductId = event || null;
    this.selectedProductData = [data] || [];
  }
}
