import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {StorageLanguageInterface} from '../../../../../assets/i18n/storage/storage.language.interface';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {StorageTotalNumModel} from '../../share/model/storage-total-num.model';
import {Router} from '@angular/router';
import * as _ from 'lodash';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {MaterialTypeEnum} from '../../share/enum/material-type.enum';
import {StorageApiService} from '../../share/service/storage-api.service';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {StorageListModel} from '../../share/model/storage-list.model';
import {ListExportModel} from '../../../../core-module/model/list-export.model';
import {IS_TRANSLATION_CONST} from '../../../../core-module/const/common.const';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {SupplierDataModel} from '../../../../core-module/model/supplier/supplier-data.model';
import {StorageUtil} from '../../share/util/storage.util';
import {ProductInfoModel} from '../../../../core-module/model/product/product-info.model';
import {FilterValueModel} from '../../../../core-module/model/work-order/filter-value.model';
import {StorageSynopsisChartComponent} from '../../share/component/storage-synopsis-chart/storage-synopsis-chart.component';
import {SupplierForCommonUtil} from '../../../../core-module/business-util/supplier/supplier-for-common.util';

/**
 * 库存总览
 */
@Component({
  selector: 'app-storage-synopsis',
  templateUrl: './storage-synopsis.component.html',
  styleUrls: ['./storage-synopsis.component.scss']
})
export class StorageSynopsisComponent implements OnInit {
  // 物料类型模版
  @ViewChild('materialType') public materialTypeTemplate: TemplateRef<HTMLDocument>;
  // 供应商选择模板
  @ViewChild('supplierTemp') public supplierTemp: TemplateRef<any>;
  // 规格型号选择
  @ViewChild('materialModelTemp') public materialModelTemp: TemplateRef<any>;
  // 物料单价模板
  @ViewChild('unitPriceTemp') public unitPriceTemp: TemplateRef<any>;
  // 库存总览统计图
  @ViewChild('storageChart') public storageChart: StorageSynopsisChartComponent;
  // 国际化
  public storageLanguage: StorageLanguageInterface;
  public commonLanguage: CommonLanguageInterface;
  // 列表数据
  public dataSet: StorageListModel[] = [];
  // 列表分页
  public pageBean: PageModel = new PageModel();
  // 列表配置
  public tableConfig: TableConfigModel = new TableConfigModel();
  // 列表查询参数
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 库存管理中各总数
  public storageTotalNumModel: StorageTotalNumModel = new StorageTotalNumModel();
  // 设施类型枚举
  public deviceTypeEnum = DeviceTypeEnum;
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 国际化枚举
  public languageEnum = LanguageEnum;
  // 物料分类枚举
  public materialTypeEnum = MaterialTypeEnum;
  // 是否展示统计图
  public isShowCharts: boolean = false;
  // 勾选供应商
  public selectSupplierObject: FilterValueModel = new FilterValueModel();
  // 显示供应商选择
  public isShowSupplier: boolean = false;
  // 存放选择的供应商数据
  public selectSupplierList: SupplierDataModel[] = [];
  // 显示规格型号选择
  public isShowModel: boolean = false;
  // 规格型号列表中的产品类型信息源
  public productTypeDataSource = [];
  // 选中的物料型号信息 用于回显
  public selectModelList: ProductInfoModel[] = [];
  // 选择的型号名称
  public selectModelObject: FilterValueModel = new FilterValueModel();
  // 供应商筛选条件
  private supplierFilterValue: FilterCondition;
  // 规格型号筛选条件
  private modelFilterValue: FilterCondition;
  constructor(public $nzI18n: NzI18nService,
              public $router: Router,
              public $storageApiService: StorageApiService,
              public $message: FiLinkModalService) { }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 初始国际化
    this.storageLanguage = this.$nzI18n.getLocaleData(LanguageEnum.storage);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // 初始化表格
    this.initTableConfig();
    this.queryStorageList();
    // 获取总数
    this.queryTotalNum();
  }

  /**
   * 分页
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryStorageList();
  }
  /**
   * 打开供应商选择器
   */
  public openSupplierSelector(filterValue: FilterCondition): void {
    this.isShowSupplier = true;
    this.supplierFilterValue = filterValue;
    this.supplierFilterValue.operator = OperatorEnum.in;
  }
  /**
   * 供应商选择改变事件
   */
  public onSelectSupplier(event: SupplierDataModel[]): void {
    this.selectSupplierList = event;
    SupplierForCommonUtil.selectSupplier(event, this);
  }

  /**
   * 打开规格型号选择器
   */

  public openMaterialModel(filterValue: FilterCondition): void {
    this.isShowModel = true;
    this.productTypeDataSource = FacilityForCommonUtil.getRoleFacility(this.$nzI18n).concat(
      FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n)
    );
    this.productTypeDataSource.push({label: this.storageLanguage.otherTotal, code: 'other'});
    this.modelFilterValue = filterValue;
    this.modelFilterValue.operator = OperatorEnum.in;
  }

  /**
   * 选择规格型号的确定事件
   */
  public handleModelOk(event: ProductInfoModel[]): void {
    this.selectModelList = event;
    StorageUtil.selectModel(event, this);
    this.isShowModel = false;
  }
  /**
   * 查询列表信息
   */
  private queryStorageList(): void {
    this.tableConfig.isLoading = true;
    this.$storageApiService.queryStorageList(this.queryCondition).subscribe((res: ResultModel<StorageListModel[]>) => {
      this.tableConfig.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        this.dataSet = res.data || [];
        this.pageBean.Total = res.totalCount;
        this.pageBean.pageIndex = res.pageNum;
        this.pageBean.pageSize = res.size;
        // 获取设备和设施的图标
        StorageUtil.handleListData(this.dataSet, '');
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 初始化表格
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
      primaryKey: '19-1',
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
          // 物料名称
          title: this.storageLanguage.materialName,
          key: 'materialName',
          width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 物料编号
          title: this.storageLanguage.materialSerial,
          key: 'materialNumber',
          width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 物料分类
          title: this.storageLanguage.materialType,
          key: 'materialCode',
          width: 150,
          type: 'render',
          renderTemplate: this.materialTypeTemplate,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchConfig: {
            type: 'select',
            selectType: 'multiple',
            selectInfo: StorageUtil.getMaterialTypeSelect(this.$nzI18n, this.storageLanguage),
            label: 'label',
            value: 'code'
          }
        },
        {
          // 规格型号
          title: this.storageLanguage.productModel,
          key: 'materialModelName',
          width: 150,
          isShowSort: true,
          sortKey: 'materialModel',
          searchKey: 'materialModel',
          searchable: true,
          configurable: true,
          searchConfig: {type: 'render', renderTemplate: this.materialModelTemp}
        },
        {
          // 入库编号
          title: this.storageLanguage.warehousingCode,
          key: 'warehousingId',
          width: 200,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 软件版本号
          title: this.storageLanguage.softwareVersion,
          key: 'softwareVersion',
          width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 硬件版本号
          title: this.storageLanguage.hardwareVersion,
          key: 'hardwareVersion',
          width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 物料数量(剩余物料数量 已入库-已出库)
          title: this.storageLanguage.materialNum,
          key: 'remainingNum',
          width: 150,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 物料单价
          title: this.storageLanguage.materialUnitPrice,
          key: 'materialUnitPrice',
          width: 150,
          type: 'render',
          renderTemplate: this.unitPriceTemp,
          isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          // 供应商
          title: this.storageLanguage.supplier,
          key: 'supplierName',
          width: 150,
          isShowSort: true,
          sortKey: 'supplierId',
          searchKey: 'supplierId',
          searchable: true,
          configurable: true,
          searchConfig: {type: 'render', renderTemplate: this.supplierTemp}
        },
        {
          // 入库时间
          title: this.storageLanguage.storageTime,
          key: 'warehousingDate',
          width: 150,
          isShowSort: true,
          pipe: 'date',
          pipeParam: 'yyyy-MM-dd hh:mm:ss',
          configurable: true,
          searchable: true,
          searchConfig: {type: 'dateRang'}
        },
        // 备注
        {
          title: this.storageLanguage.remark, key: 'remark', width: 150, isShowSort: true,
          searchable: true, configurable: true,
          searchConfig: {type: 'input'}
        },
        { // 操作列
          title: this.commonLanguage.operate,
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '', width: 100,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      bordered: false,
      showSearch: false,
      rightTopButtons: [
        {
          // 统计图
          text: this.storageLanguage.summaryGraph,
          iconClassName: 'fiLink-analysis',
          permissionCode: '19-1-2',
          handle: () => {
            this.isShowCharts = true;
            this.storageChart.handleSearch();
          },
        }
      ],
      // 排序
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.queryStorageList();
      },
      // 搜索
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        // 没有值的时候重置已选数据
        if (!event.length) {
          this.selectSupplierList = [];
          this.selectModelList = [];
          this.selectSupplierObject = new FilterValueModel();
          this.selectModelObject = new FilterValueModel();
        }
        this.queryStorageList();
      },
      // 导出
      handleExport: (event: ListExportModel<StorageListModel[]>) => {
        this.handleExport(event);
      },
    };
  }

  /**
   * 获取物料、设备、设施及其他总数
   */
  private queryTotalNum(): void {
    this.$storageApiService.queryMaterialTotal().subscribe((res: ResultModel<StorageTotalNumModel>) => {
      if (res.code === ResultCodeEnum.success) {
        if (res.data) {
          this.storageTotalNumModel.materialTotal = res.data.materialTotal;
          this.storageTotalNumModel.deviceTotal = res.data.deviceTotal;
          this.storageTotalNumModel.equipmentTotal = res.data.equipmentTotal;
          this.storageTotalNumModel.otherTotal = res.data.otherTotal;
        }
      } else {
        this.$message.error(res.msg);
      }
    });
  }


  /**
   * 导出
   */
  private handleExport(event: ListExportModel<StorageListModel[]>): void {
    // 处理参数
    const exportBody = new ExportRequestModel(event.columnInfoList, event.excelType);
    // 遍历字段设置后台需要特殊处理的标示
    const param = ['materialCode', 'materialType', 'warehousingDate'];
    exportBody.columnInfoList.forEach(item => {
      if (param.includes(item.propertyName)) {
        item.isTranslation = IS_TRANSLATION_CONST;
      }
    });
    // 处理选择的数据
    if (event && !_.isEmpty(event.selectItem)) {
      const ids = event.selectItem.map(item => item.storageId);
      const filter = new FilterCondition('storageId', OperatorEnum.in, ids);
      exportBody.queryCondition.filterConditions.push(filter);
    } else {
      // 处理查询条件
      exportBody.queryCondition.filterConditions = event.queryTerm;
    }
    this.$storageApiService.exportInventoryList(exportBody).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(this.storageLanguage.exportStorageSuccess);
      } else {
        this.$message.error(res.msg);
      }
    });
  }
}
