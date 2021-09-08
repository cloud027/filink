import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {InspectionLanguageInterface} from '../../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../../shared-module/model/query-condition.model';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {DeviceTypeEnum} from '../../../../../core-module/enum/facility/facility.enum';
import {ProductTypeEnum} from '../../../../../core-module/enum/product/product.enum';
import {EquipmentTypeEnum} from '../../../../../core-module/enum/equipment/equipment.enum';
import {ProductLanguageInterface} from '../../../../../../assets/i18n/product/product.language.interface';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {EquipmentListModel} from '../../../../../core-module/model/equipment/equipment-list.model';
import {ProductForCommonService} from '../../../../../core-module/api-service/product/product-for-common.service';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';

/**
 * 设施型号设备型号选择
 */
@Component({
  selector: 'app-select-product-model',
  templateUrl: './select-product-model.component.html',
  styleUrls: ['./select-product-model.component.scss']
})
export class SelectProductModelComponent implements OnInit {

  @Input()
  set xcVisible(params) {
    this._xcVisible = params;
    this.xcVisibleChange.emit(this._xcVisible);
  }
  get xcVisible() {
    return this._xcVisible;
  }
  // 设施型号/设备型号
  @Input() modelType: string;
  // 设施类型/设备类型
  @Input() deviceOrEquipType: string;
  // 已选型号数据
  @Input() selectModelData;
  // 显示隐藏变化
  @Output() xcVisibleChange = new EventEmitter<boolean>();
  // 选中的值变化
  @Output() selectDataChange = new EventEmitter<any>();
  // 单选
  @ViewChild('radioTemp') private radioTemp: TemplateRef<HTMLDocument>;
  //  产品类型模版
  @ViewChild('productTypeTemplate') public productTypeTemplate: TemplateRef<HTMLDocument>;
  // 国际化
  public inspectionLanguage: InspectionLanguageInterface;
  // 设施语言包
  public productLanguage: ProductLanguageInterface;
  // 表单校验
  public isFormDisabled: boolean = true;
  // 分页
  public modelPageBean: PageModel = new PageModel();
  // 查询参数对象集
  public queryModelCondition: QueryConditionModel = new QueryConditionModel();
  // 列表配置
  public modelTableConfig: TableConfigModel = new TableConfigModel();
  // 列表数据
  public modelList: any[] = [];
  // 选择设备id
  public selectedProductId: string = null;
  // 设施类型枚举
  public deviceTypeEnum = DeviceTypeEnum;
  // 产品类型枚举
  public productTypeEnum = ProductTypeEnum;
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 设施国际化
  public languageEnum = LanguageEnum;
  // 显示隐藏
  private _xcVisible: boolean = false;
  constructor(
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $productCommonService: ProductForCommonService,
  ) { }

  public ngOnInit(): void {
    this.inspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.productLanguage = this.$nzI18n.getLocaleData(LanguageEnum.product);
    // 列表配置
    this.initDeviceTableConfig();
    // 查询数据
    this.queryProductList();
    if (this.selectModelData) {
      this.isFormDisabled = false;
      this.selectedProductId = this.selectModelData.productId;
    }
  }
  /**
   * 确定
   */
  public selectData(): void {
    this.selectDataChange.emit(this.selectModelData);
    this.handleClose();
  }
  /**
   * 关闭
   */
  public handleClose(): void {
    this.xcVisible = false;
  }
  /**
   * 选择型号
   */
  public selectedProductChange(data: any): void {
    this.selectedProductId = data.productId;
    this.selectModelData = data;
    this.isFormDisabled = false;
  }
  /**
   * 页面页码大小切换
   */
  public pageChange(event: PageModel): void {
    this.queryModelCondition.pageCondition.pageSize = event.pageSize;
    this.queryModelCondition.pageCondition.pageNum = event.pageIndex;
    this.queryProductList();
  }
  /**
   * 查询产品列表
   */
  private queryProductList(): void {
    this.modelTableConfig.isLoading = true;
    const hasCode = this.queryModelCondition.filterConditions.find(item => item.filterField === 'typeCode');
    if (!hasCode) {
      this.queryModelCondition.filterConditions.push(new FilterCondition('typeCode', OperatorEnum.in, [this.deviceOrEquipType]));
    } else {
      this.queryModelCondition.filterConditions.forEach(item => {
        if (item.filterField === 'typeCode') {
          item.filterValue = [this.deviceOrEquipType];
        }
      });
    }
    // 只有设施类型为智慧杆时，才添加此条件
    if (this.deviceOrEquipType === DeviceTypeEnum.wisdom) {
      this.queryModelCondition.filterConditions.push({
        filterField: 'fileExist',
        operator: 'eq',
        filterValue: '1'
      });
    }
    // 设置查询类型
    this.queryModelCondition.filterConditions.forEach(item => {
      if (item.filterField === 'scrapTime') {
        item.operator = OperatorEnum.eq;
      }
    });
    this.$productCommonService.queryProductList(this.queryModelCondition).subscribe((res: ResultModel<any>) => {
      if (res.code === ResultCodeEnum.success) {
        this.modelList = res.data || [];
        this.modelPageBean.pageIndex = res.pageNum;
        this.modelPageBean.Total = res.totalCount;
        this.modelPageBean.pageSize = res.size;
        // 获取设备和设施的图标
        if (this.modelList && this.modelList.length > 0) {
          this.modelList.forEach(item => {
            if (String(item.typeFlag) === String(ProductTypeEnum.facility)) {
              item.iconClass = CommonUtil.getFacilityIConClass(item.typeCode);
            } else {
              item.iconClass = CommonUtil.getEquipmentTypeIcon(item as EquipmentListModel);
            }
          });
        }
      } else {
        this.$message.error(res.msg);
      }
      this.modelTableConfig.isLoading = false;
    }, () => {
      this.modelTableConfig.isLoading = false;
    });
  }
  /**
   *  设施型号
   */
  private initDeviceTableConfig(): void {
    this.modelTableConfig = {
      isDraggable: true,
      isLoading: true,
      showSizeChanger: true,
      notShowPrint: true,
      showSearchSwitch: true,
      showPagination: true,
      keepSelected: true,
      selectedIdKey: 'productId',
      scroll: {x: '1204px', y: '340px'},
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
          isShowSort: false,
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
        { // 操作列
          title: this.productLanguage.operate,
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '', width: 80,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      sort: (event: SortCondition) => {
        this.queryModelCondition.sortCondition = event;
        this.queryProductList();
      },
      handleSearch: (event: FilterCondition[]) => {
        this.queryModelCondition.filterConditions = event;
        this.queryProductList();
      }
    };
  }
}
