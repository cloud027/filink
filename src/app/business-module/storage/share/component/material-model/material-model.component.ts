import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {FilterCondition, PageCondition, QueryConditionModel, SortCondition} from '../../../../../shared-module/model/query-condition.model';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {ProductLanguageInterface} from '../../../../../../assets/i18n/product/product.language.interface';
import {EquipmentTypeEnum} from '../../../../../core-module/enum/equipment/equipment.enum';
import {ProductTypeEnum, ProductUnitEnum} from '../../../../../core-module/enum/product/product.enum';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {ProductInfoModel} from '../../../../../core-module/model/product/product-info.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {DeviceTypeEnum} from '../../../../../core-module/enum/facility/facility.enum';
import {ProductForCommonService} from '../../../../../core-module/api-service/product/product-for-common.service';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import { TableComponent } from 'src/app/shared-module/component/table/table.component';
import { StorageLanguageInterface } from 'src/assets/i18n/storage/storage.language.interface';
import {PageSizeEnum} from '../../../../../shared-module/enum/page-size.enum';

/**
 * 规格型号 物料型号弹窗组件
 */
@Component({
  selector: 'app-material-model',
  templateUrl: './material-model.component.html',
  styleUrls: ['./material-model.component.scss']
})
export class MaterialModelComponent implements OnInit, OnDestroy {
  // 是否展示物料型号弹窗
  @Input() isVisible: boolean = false;
  // 产品类型过滤条件的数据源
  @Input() productTypeDataSource;
  // 选中的物料型号id，用于单选的回显
  @Input() selectRadioId: string = '';
  // 选中的物料型号信息 用于复选的回显
  @Input() selectModelList: ProductInfoModel[] = [];
  // 判断弹框的数据选择是否为单选，默认为多选
  @Input() isRadio: boolean = false;
  // 是否需要限制选择的数量  总览统计图需限制
  @Input() isNeedLimitNum: boolean = false;
  // 判断只查询设施还是设备的数据
  @Input() filterConditionSource: FilterCondition;
  // 选中的物料型号确定事件
  @Output() handleOkEvent: EventEmitter<ProductInfoModel[]> = new EventEmitter<ProductInfoModel[]>();
  // 弹框显示隐藏事件
  @Output() isVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  //  产品类型模版
  @ViewChild('productTypeTemplate') public productTypeTemplate: TemplateRef<HTMLDocument>;
  // 产品计量单位枚举
  @ViewChild('unitTemplate') public unitTemplate: TemplateRef<HTMLDocument>;
  // 列表单选模板
  @ViewChild('radioTemp') private radioTemp: TemplateRef<HTMLDocument>;
  // 表格组件
  @ViewChild('tableTpl') private tableTpl: TableComponent;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 产品管理国际化
  public productLanguage: ProductLanguageInterface;
  // 库存管理国际化
  public storageLanguage: StorageLanguageInterface;
  // 列表分页
  public pageBean: PageModel = new PageModel();
  // 班组成员列表配置
  public tableConfig: TableConfigModel = new TableConfigModel();
  // 列表查询参数
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 物料型号表格数据
  public modelDataSet: ProductInfoModel[] = [];
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 产品类型枚举
  public productTypeEnum = ProductTypeEnum;
  // 产品计量单位枚举
  public productUnitEnum = ProductUnitEnum;
  // 设施国际化
  public languageEnum = LanguageEnum;
  // 设施类型枚举
  public deviceTypeEnum = DeviceTypeEnum;
  // 单选数据
  private selectModelData: ProductInfoModel[] = [];

  constructor(private $nzI18n: NzI18nService,
              private $productCommonService: ProductForCommonService,
              public $message: FiLinkModalService) { }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.productLanguage = this.$nzI18n.getLocaleData(LanguageEnum.product);
    this.storageLanguage = this.$nzI18n.getLocaleData(LanguageEnum.storage);
    this.queryCondition.pageCondition = new PageCondition(1, PageSizeEnum.sizeTen);
    // 初始化表格
    this.initTableConfig();
    this.queryMaterialModelList();
  }

  public ngOnDestroy(): void {
    this.tableTpl = null;
  }

  /**
   * 物料型号列表选择器确定事件
   */
  public handleOk(): void {
    const selectData = this.isRadio ? this.selectModelData : this.tableTpl.getDataChecked();
    // 如果是单选且编辑时未选择新数据则直接关闭弹窗
    if (this.isRadio && !this.selectModelData.length) {
      this.isVisibleChange.emit(false);
      return;
    }
    if (this.isNeedLimitNum && selectData.length > 15) {
      this.$message.info(this.storageLanguage.selectMaterialModelTip);
    } else {
      this.handleOkEvent.emit(selectData);
    }
  }

  /**
   * 物料型号列表选择器清空事件
   */
  public cleanUpModel(): void {
    if (!this.isRadio) {
      this.selectModelList = [];
      this.tableTpl.keepSelectedData.clear();
      this.tableTpl.updateSelectedData();
      this.tableTpl.checkStatus();
    } else {
      this.selectRadioId = '';
    }
  }

  /**
   * 型号列表选择器分页
   * param event PageModel
   */
  public modelPageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryMaterialModelList();
  }

  /**
   * 单选框变化
   */
  public onRadioChange(event: string, data: ProductInfoModel): void {
    this.selectRadioId = event;
    this.selectModelData = [data];
  }

  /**
   * 查询物料型号（产品信息）接口
   */
  private queryMaterialModelList(): void {
    this.tableConfig.isLoading = true;
    // 筛选产品类型为设备的列表
    if (this.filterConditionSource) {
      // 在只选择物料维度筛选规格型号时，避免型号搜索时多次添加typeFlag筛选条件
      this.queryCondition.filterConditions = this.queryCondition.filterConditions.filter(item => item.filterField !== 'typeFlag');
      // 在筛选条件为空或者筛选条件中不包含typeCode条件时需要添加filterConditionSource条件
      if (this.queryCondition.filterConditions.some(item => item.filterField !== 'typeCode') || !this.queryCondition.filterConditions.length) {
        this.queryCondition.filterConditions.push(this.filterConditionSource);
      }
    }
    this.$productCommonService.queryProductList(this.queryCondition).subscribe((res) => {
      this.tableConfig.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        this.modelDataSet = res.data || [];
        this.pageBean.pageIndex = res.pageNum;
        this.pageBean.Total = res.totalCount;
        this.pageBean.pageSize = res.size;
        // 获取设备和设施的图标
        if (!_.isEmpty(this.modelDataSet)) {
          this.modelDataSet.forEach(item => {
            if (String(item.typeFlag) === String(ProductTypeEnum.facility)) {
              item.iconClass = CommonUtil.getFacilityIConClass(item.typeCode);
            } else if (String(item.typeFlag) === String(ProductTypeEnum.equipment)) {
              item.iconClass = CommonUtil.getEquipmentTypeIcon(item as any);
            } else {
              item.iconClass = CommonUtil.getFacilityIConClass('D000');
            }
          });
        }
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 初始化表格配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: true,
      scroll: {x: '1200px', y: '600px'},
      noIndex: true,
      notShowPrint: true,
      showSizeChanger: true,
      showSearchSwitch: true,
      showPagination: true,
      keepSelected: true,
      selectedIdKey: 'productId',
      pageSizeOptions: [10, 20, 30, 40],
      columnConfig: [
        // 选择
        this.isRadio ?
          {
            type: 'render', key: 'productId', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 60,
            title: '',
            renderTemplate: this.radioTemp} :
          {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 60},
        { // 序号
          type: 'serial-number',
          width: 62,
          title: this.productLanguage.serialNum,
          fixedStyle: {fixedLeft: true, style: {left: '60px'}}
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
            selectInfo: this.productTypeDataSource,
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
        { // 产品功能
          title: this.productLanguage.productFeatures, key: 'description', width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 安装数量
          title: this.productLanguage.quantity, key: 'quantity', width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 计量单位
          title: this.productLanguage.unit, key: 'unit', width: 100,
          isShowSort: true,
          searchable: true,
          type: 'render',
          renderTemplate: this.unitTemplate,
          searchConfig: {
            type: 'select',
            selectInfo: CommonUtil.codeTranslate(ProductUnitEnum, this.$nzI18n, null, LanguageEnum.product),
            label: 'label',
            value: 'code'
          }
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
        { // 操作
          title: this.commonLanguage.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 150,
          fixedStyle: {fixedRight: false, style: {right: '0px'}}
        }
      ],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition = event;
        this.queryMaterialModelList();
      },
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        // 将单价和报废年限的查询操作符改成eq
        this.queryCondition.filterConditions.forEach(item => {
          if (['price', 'scrapTime', 'quantity'].includes(item.filterField)) {
            item.operator = OperatorEnum.eq;
          }
        });
        this.queryMaterialModelList();
      }
    };
  }
}
