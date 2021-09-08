import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {ProductLanguageInterface} from '../../../../../assets/i18n/product/product.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {PlanProjectLanguageInterface} from '../../../../../assets/i18n/plan-project/plan-project.language.interface';
import {PageModel} from '../../../../shared-module/model/page.model';
import {PageSizeEnum} from '../../../../shared-module/enum/page-size.enum';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {num} from '../../../../core-module/const/index/index.const';
import {ProductForCommonService} from '../../../../core-module/api-service/product/product-for-common.service';
import {FilterCondition, PageCondition, QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {WisdomPointInfoModel} from '../../../../core-module/model/plan/wisdom-point-info.model';
import {ProductInfoModel} from '../../../../core-module/model/product/product-info.model';
import {ResultModel} from '../../../../shared-module/model/result.model';

/**
 * 批量修改智慧杆型号的弹窗组件
 */
@Component({
  selector: 'app-change-point-model',
  templateUrl: './change-point-model.component.html',
  styleUrls: ['./change-point-model.component.scss']
})
export class ChangePointModelComponent implements OnInit, OnDestroy {

  // 智慧杆列表全部数据
  @Input() facilityAllData = [];
  // 弹窗显示
  @Input() isVisible: boolean;
  // 弹框显示隐藏事件
  @Output() isVisibleChange: EventEmitter<boolean> = new EventEmitter();
  // 向父组件发射修改完的数据
  @Output() modelChange = new EventEmitter<any>();
  // 列表单选
  @ViewChild('radioTemp') private radioTemp: TemplateRef<HTMLDocument>;
  // 产品语言包
  public productLanguage: ProductLanguageInterface;
  // 公共语言包国际化
  public commonLanguage: CommonLanguageInterface;
  // 规划项目语言包
  public language: PlanProjectLanguageInterface;
  // 步骤
  public stepIndex = num.zero;
  // 选择的设施智慧杆
  public selectWisdom: WisdomPointInfoModel[] = [];

  // 智慧杆列表数据集
  public dataSet: WisdomPointInfoModel[] = [];
  // 表格配置
  public tableConfig: TableConfigModel;
  // 选择设施列表查询条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 表格分页
  public pageBean: PageModel = new PageModel(PageSizeEnum.sizeFive);

  // 是否显示智慧杆列表
  public showWisdomTable: boolean = true;

  // 规格型号列表数据集
  public productDataSet: ProductInfoModel[] = [];
  // 规格型号表格配置
  public productTableConfig: TableConfigModel;
  // 规格型号表格分页
  public productPageBean: PageModel = new PageModel(PageSizeEnum.sizeFive);
  // 规格型号查询条件
  public queryProductCondition: QueryConditionModel = new QueryConditionModel();
  // 确定按钮loading
  public isLoading: boolean = false;
  // 当前步骤
  public stepNum = num;
  // 选中规划型号产品id
  public selectedProductId: string;
  // 选中规划型号产品数据
  public selectedProductData: any = {};

  constructor(
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $productForCommonService: ProductForCommonService,
  ) {
  }

  ngOnInit(): void {
    // 语言包初始化
    this.productLanguage = this.$nzI18n.getLocaleData(LanguageEnum.product);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.planProject);
    this.queryProductCondition.pageCondition = new PageCondition(1, 5);
    // 只筛选出智慧杆的规格型号
    this.queryProductCondition.filterConditions.push(new FilterCondition('typeCode', OperatorEnum.in, [DeviceTypeEnum.wisdom]));
    // 初始化智慧杆列表
    this.initTableConfig();
    this.facilityAllData.forEach(item => {
      item.checked = false;
    });
    this.dataSet = this.facilityAllData.slice(this.pageBean.pageSize * (this.pageBean.pageIndex - 1),
      this.pageBean.pageIndex * this.pageBean.pageSize);
    this.pageBean.Total = this.facilityAllData.length;
    this.initProductTableConfig();
    this.queryProductList();
  }

  public ngOnDestroy(): void {
    this.facilityAllData = [];
  }
  /**
   * 确定
   */
  public handleOk(): void {
    this.isLoading = true;
    const pointIds = this.selectWisdom.map(item => item.pointId);
    const data = {
      productData: this.selectedProductData,
      pointIds: pointIds,
    };
    this.modelChange.emit(data);
    this.isVisible = false;
    this.isVisibleChange.emit(false);
  }

  /**
   * 下一步
   */
  public handleNext(): void {
    this.selectWisdom = [];
    this.facilityAllData.forEach(item => {
      if (item.checked && item.checked === true) {
        this.selectWisdom.push(item);
      }
    });
    if (!this.selectWisdom.length) {
      this.$message.error(this.language.noneData);
      return;
    }
    this.stepIndex = num.one;
    this.showWisdomTable = false;
  }

  /**
   * 返回
   */
  public handleBack(): void {
    // 步骤一
    this.stepIndex = num.zero;
    this.showWisdomTable = true;
    // 两个xc-table组件的tableConfig指向了同一段地址，第一个列表的配置实际被修改掉了，重新初始化选择设施列表配置
    this.initTableConfig();
  }

  /**
   * 分页
   */
  public pageChange(event): void {
    this.pageBean.pageIndex = event.pageIndex;
    this.pageBean.pageSize = event.pageSize;
    this.dataSet = this.facilityAllData.slice(this.pageBean.pageSize * (this.pageBean.pageIndex - 1),
      this.pageBean.pageIndex * this.pageBean.pageSize);
  }

  /**
   * 规格型号列表分页
   * @param event 分页数据
   */
  public productPageChange(event): void {
    this.queryProductCondition.pageCondition.pageNum = event.pageIndex;
    this.queryProductCondition.pageCondition.pageSize = event.pageSize;
    this.queryProductList();
  }

  /**
   * 取消
   */
  public handleCancel(): void {
    this.isVisibleChange.emit(false);
    this.dataSet = [];
    this.productDataSet = [];
  }

  /**
   * 选中产品型号事件
   * @param event 产品id
   * @param data 选中产品所有数据
   */
  public selectedProductChange(event: string, data: ProductInfoModel[]) {
    this.selectedProductData = data;
    this.selectedProductId = event;
  }

  /**
   * table表格全选事件
   * @param e 全部勾选/全部去除勾选
   */
  public checkAllClickEvent(e: boolean): void {
    this.facilityAllData.forEach(item => {
      item.checked = e;
    });
  }

  /**
   * 初始化智慧杆列表表格配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      selectedIdKey: 'pointId',
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: false,
      showSizeChanger: true,
      showPagination: true,
      pageSizeOptions: [5, 10, 20, 30, 40],
      scroll: {x: '1000px', y: '600px'},
      noIndex: false,
      notShowPrint: true,
      columnConfig: [
        { // 选择
          type: 'select',
          fixedStyle: {fixedLeft: true, style: {left: '0px'}},
          width: 62
        },
        { // 设施名称
          title: this.language.facilityName, key: 'pointName', width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 详细地址
          title: this.language.address, key: 'address', width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 所属区域
          title: this.language.BelongsAreaName, key: 'areaName', width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
      ],
      sort: (event) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.dataSet = CommonUtil.frontEndQuery(this.facilityAllData, this.queryCondition, this.pageBean);
      }
    };
  }

  /**
   * 初始化 规格型号表格
   */
  private initProductTableConfig() {
    this.productTableConfig = {
      selectedIdKey: 'pointId',
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: false,
      showSizeChanger: true,
      showPagination: true,
      pageSizeOptions: [5, 10, 20, 30, 40],
      scroll: {x: '1000px', y: '600px'},
      noIndex: true,
      notShowPrint: true,
      columnConfig: [
        {
          // 选择
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
      ],
      // 排序
      sort: (event) => {
        this.queryProductCondition.sortCondition.sortField = event.sortField;
        this.queryProductCondition.sortCondition.sortRule = event.sortRule;
        this.queryProductList();
      }
    };
  }

  /**
   * 查询产品列表
   */
  private queryProductList() {
    this.$productForCommonService.queryProductList(this.queryProductCondition).subscribe((res: ResultModel<ProductInfoModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        this.productDataSet = res.data || [];
        this.productPageBean.pageIndex = res.pageNum;
        this.productPageBean.Total = res.totalCount;
        this.productPageBean.pageSize = res.size;
        this.productTableConfig.isLoading = false;
      }
    });
  }
}
