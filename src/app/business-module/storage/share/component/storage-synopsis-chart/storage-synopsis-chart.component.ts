import {Component, EventEmitter, OnInit, Output, ViewChild, Input} from '@angular/core';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../shared-module/component/form/form-operate.service';
import {MaterialTypeEnum} from '../../enum/material-type.enum';
import {FacilityForCommonUtil} from 'src/app/core-module/business-util/facility/facility-for-common.util';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {ProductInfoModel} from '../../../../../core-module/model/product/product-info.model';
import {ProductTypeEnum} from '../../../../../core-module/enum/product/product.enum';
import {FilterCondition} from '../../../../../shared-module/model/query-condition.model';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {StorageChartsConfig} from '../../config/charts-config';
import {SelectModel} from '../../../../../shared-module/model/select.model';
import { TimeDimensionEnum } from '../../enum/time-dimension.enum';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import { StorageApiService } from '../../service/storage-api.service';
import { StorageLanguageInterface } from 'src/assets/i18n/storage/storage.language.interface';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';

@Component({
  selector: 'app-storage-synopsis-chart',
  templateUrl: './storage-synopsis-chart.component.html',
  styleUrls: ['./storage-synopsis-chart.component.scss']
})
export class StorageSynopsisChartComponent implements OnInit {
  // 用于判断物料分类下拉框是否是单选
  @Input() materialCodeIsSingle: boolean = true;
  // 判断是否需要时间选择器 也用来判断是入库出库的统计图还是库存总览的统计图
  @Input() isNeedTimeSelect: boolean = true;
  // 判断是入库还是出库统计图, 默认时入库统计图
  @Input() isStockIn: boolean = true;
  // 切换成表格事件
  @Output() switchTable = new EventEmitter();
  // 物料型号弹框
  @ViewChild('materialModelTpl') materialModelTpl;
  // 物料分类弹框
  @ViewChild('materialCodeTpl') materialCodeTpl;
  // 时间维度表单模板
  @ViewChild('timeDimensionTpl') timeDimensionTpl;
  // 统计图配置项
  public statisticalChartOptions = {};
  // 是否展示统计图
  public isShowChart: boolean = false;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 库存管理国际化
  public storageLanguage: StorageLanguageInterface;
  // 是否展示物料型号弹窗
  public isShowMaterialModel: boolean = false;
  // 选中的物料型号数据
  public selectModelDataSet = [];
  // 选中物料型号信息
  public selectModelList = [];
  // 物料型号的表格中产品类型的数据源（根据选择的物料维度和物料分类来决定该数据源）
  public productTypeDataSource: SelectModel[] = [];
  // 默认过滤类型为设备
  public materialFilterCondition: FilterCondition = new FilterCondition('typeFlag', OperatorEnum.eq, ProductTypeEnum.equipment);
  // 表单配置
  public formColumn: FormItem[] = [];
  // 确定按钮禁用
  public isDisabled: boolean = true;
  // 物料分类数据源
  public materialClassifyDataSource: SelectModel[] = [];
  // 表单操作实现类
  public formStatus: FormOperate;
  // 根据选择的物料分类来决定该数据源
  public tabsetDataSource = [];
  // 时间维度枚举
  public timeDimension = TimeDimensionEnum;
  // 是否展示tab页的图表
  public isShowTabChart: boolean = false;
  // 当前激活的tab页的索引
  public selectedTabIndex: number = 0;
  // 查询条件备份
  private searchConditionBackup;

  constructor(public $nzI18n: NzI18nService,
              private $storageService: StorageApiService,
              private $message: FiLinkModalService) { }

  public ngOnInit(): void {
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.storageLanguage = this.$nzI18n.getLocaleData(LanguageEnum.storage);
    this.materialClassifyDataSource = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n);
    this.productTypeDataSource = [...this.materialClassifyDataSource];
    this.initForm();
  }

  /**
   * 点击确定按钮进行查询图表数据操作
   */
  public handleSearch(): void {
    const params = this.formStatus.getData();
    if (params.materialType !== MaterialTypeEnum.other && this.productTypeDataSource && !this.productTypeDataSource.length) {
      const msg = params.materialType === MaterialTypeEnum.equipment ? this.storageLanguage.selectDeviceMaterialTip : this.storageLanguage.selectFacilityMaterialTip;
      this.$message.info(msg);
      return;
    }
    this.searchConditionBackup = params;
    // 入库出库时才需要此字段
    if (this.isNeedTimeSelect) {
      // 物料维度分为 为 其他和不为其他 两种情况
      if (params.materialType !== MaterialTypeEnum.other) {
        this.tabsetDataSource = this.productTypeDataSource.map(item => {
          // 给每个物料分类添加选中的对应的物料型号
          const tempProduceModel = [];
          if (this.selectModelDataSet && this.selectModelDataSet.length) {
            this.selectModelDataSet.forEach(it => {
              if (item.code === it.typeCode) {
                tempProduceModel.push(it.productId);
              }
            });
          }
          return Object.assign(item, {materialModel: tempProduceModel.length ? tempProduceModel : null});
        });
      } else {
        this.tabsetDataSource = [{label: this.storageLanguage.otherTotal, code: 'other', materialModel: null}];
      }
      this.isShowChart = false;
      this.selectedTabIndex = 0;
      this.queryTrendChartData(this.tabsetDataSource[0]);
    } else {
      params.materialModel = this.selectModelList.map(item => item.productId);
      params.materialCode = params.materialType === MaterialTypeEnum.other ? 'other' : params.materialCode;
      this.$storageService.queryInventoryStatistics(params).subscribe(res => {
        if (res.code === ResultCodeEnum.success && res.data && Object.keys(res.data).length) {
          // 如果选择的物料型号则按照物料型号统计 否则则根据物料分类统计各分类下的总数
          if (this.selectModelList && this.selectModelList.length) {
            this.statisticalChartOptions = StorageChartsConfig.inventoryOverviewChart(res.data, true, this.$nzI18n, null);
          } else {
            this.statisticalChartOptions = StorageChartsConfig.inventoryOverviewChart(res.data, false, this.$nzI18n, params.materialType);
          }
          this.isShowChart = true;
        } else {
          this.isShowChart = false;
        }
      });
    }
  }

  /**
   * 点击重置按钮，重置查询条件事件
   */
  public handleReset(): void {
    // 将物料维度重置为"设备" 时间重置为当前年
    this.formStatus.resetControlData('materialType', MaterialTypeEnum.equipment);
    this.formStatus.resetControlData('timeDimension', TimeDimensionEnum.year);
    this.formStatus.resetControlData('warehousingDate', new Date());
  }

  /**
   * 打开物料型号弹窗事件
   */
  public showMaterialModelModal(): void {
    if (!this.isNeedTimeSelect && !this.formStatus.getData('materialCode')) {
      this.$message.info(this.storageLanguage.selectMaterialCodeTip);
      return;
    }
    if (this.productTypeDataSource && !this.productTypeDataSource.length) {
      const msg = this.formStatus.getData('materialType') === MaterialTypeEnum.facility
        ? this.storageLanguage.selectFacilityMaterialTip : this.storageLanguage.selectDeviceMaterialTip;
      this.$message.info(msg);
      return;
    }
    this.isShowMaterialModel = true;
  }

  /**
   * 物料型号列表选择器确定事件
   */
  public handleModelOk(selectDataList: ProductInfoModel[]): void {
    this.isShowMaterialModel = false;
    if (selectDataList.length) {
      this.formStatus.group.controls['materialModel'].reset(selectDataList.map(item => item.productModel).join(','));
      this.selectModelDataSet = selectDataList.map(item => {
        return {typeCode: item.typeCode, productId: item.productId};
      });
    } else {
      this.selectModelDataSet = [];
      this.formStatus.group.controls['materialModel'].reset('');
    }
    this.selectModelList = selectDataList;
  }

  /**
   * tab页激活时的事件
   * param material
   */
  public handleTabSelect(material): void {
    this.queryTrendChartData(material);
  }

  /**
   * 获取表单实例对象
   */
  public getFormInitObject(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isDisabled = !this.formStatus.getValid();
    });
    this.formStatus.resetControlData('materialType', MaterialTypeEnum.equipment);
  }

  /**
   * 处理物料分类下拉框改变事件
   * param value
   */
  public handleMaterialCodeChange(value: any): void {
    if (value && value.length) {
      // 根据选择的物料分类，改变物料型号弹框中的展示数据的过滤条件，已经弹框列表字段产品类型的过滤可选项
      this.materialFilterCondition = new FilterCondition('typeCode', OperatorEnum.in, value);
      this.productTypeDataSource = this.materialClassifyDataSource.filter(item => value.includes(item.code));
    } else {
      const tempFilterValue = this.formStatus.group.controls['materialType'].value === MaterialTypeEnum.equipment ? ProductTypeEnum.equipment : ProductTypeEnum.facility;
      this.materialFilterCondition = new FilterCondition('typeFlag', OperatorEnum.eq, tempFilterValue);
      this.productTypeDataSource = [...this.materialClassifyDataSource];
    }
    this.selectModelList = [];
    this.formStatus.resetControlData('materialModel', '');
  }

  /**
   * 初始化表单
   */
  private initForm(): void {
    this.formColumn = [
      {
        // 物料维度
        label: this.storageLanguage.materialDimension,
        key: 'materialType',
        type: 'select',
        rule: [{required: true}],
        width: 300,
        labelWidth: 80,
        require: true,
        selectInfo: {
          data: [
            {label: this.storageLanguage.facility, value: MaterialTypeEnum.facility},
            {label: this.storageLanguage.equipment, value: MaterialTypeEnum.equipment},
            {label: this.storageLanguage.otherTotal, value: MaterialTypeEnum.other},
          ],
          label: 'label',
          value: 'value'
        },
        modelChange: (controls, $event, key) => {
          this.handleMaterialDimensionChange($event);
        }
      },
      {
        // 物料分类
        label: this.storageLanguage.materialType,
        key: 'materialCode',
        type: this.materialCodeIsSingle ? 'select' : 'custom',
        rule: [],
        width: 300,
        labelWidth: 80,
        allowClear: true,
        template: this.materialCodeIsSingle ? null : this.materialCodeTpl,
        selectInfo: {
          data: this.materialClassifyDataSource,
          label: 'label',
          value: 'code'
        },
        modelChange: (controls, event, key) => {
          this.handleMaterialCodeChange(event ? [event] : null);
        }
      },
      {
        // 物料型号
        label: this.storageLanguage.materialModel,
        key: 'materialModel',
        type: 'custom',
        rule: [],
        width: 330,
        labelWidth: 80,
        template: this.materialModelTpl
      },
    ];
    if (this.isNeedTimeSelect) {
      this.formColumn.push({
        // 时间维度
        label: this.storageLanguage.timeDimension,
        key: 'timeDimension',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        width: 330,
        labelWidth: 80,
        template: this.timeDimensionTpl,
        initialValue: TimeDimensionEnum.year
      }, {
        // 时间维度
        label: this.storageLanguage.timeDimension,
        key: 'warehousingDate',
        type: 'custom',
        hidden: true,
        rule: [{required: true}],
        width: 330,
        labelWidth: 80,
        template: this.timeDimensionTpl,
        initialValue: new Date()
      });
    }
  }

  /**
   * 处理物料维度值变化时的事件
   * param event
   */
  private handleMaterialDimensionChange(event: string): void {
    // 每次物料维度发生变化时都重置表单值和状态
    this.selectModelList = [];
    this.formStatus.group.controls['materialCode'].reset(null);
    this.formStatus.group.controls['materialCode'].enable();
    this.formStatus.group.controls['materialModel'].reset(null);
    this.formStatus.group.controls['materialModel'].enable();
    this.materialFilterCondition = null;
    const facilityData = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
    const equipmentData = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n);
    // 选择设施时，则物料分类只展示设施的分类；选择设备时，物料分类只展示设备的分类；选择其他时，物料分类和物料型号不可选择
    if (event) {
      switch (event) {
        case MaterialTypeEnum.facility:
          this.materialFilterCondition = new FilterCondition('typeFlag', OperatorEnum.eq, ProductTypeEnum.facility);
          this.materialClassifyDataSource.splice(0, this.materialClassifyDataSource.length, ...facilityData);
          break;
        case MaterialTypeEnum.equipment:
          this.materialFilterCondition = new FilterCondition('typeFlag', OperatorEnum.eq, ProductTypeEnum.equipment);
          this.materialClassifyDataSource.splice(0, this.materialClassifyDataSource.length, ...equipmentData);
          break;
        case MaterialTypeEnum.other:
          this.formStatus.group.controls['materialCode'].disable();
          this.formStatus.group.controls['materialModel'].disable();
          break;
      }
      this.productTypeDataSource = [...this.materialClassifyDataSource];
    }
  }

  /**
   * 根据物料分类查询入库出库趋势图数据
   * param materialInfoData
   */
  private queryTrendChartData(materialInfoData: any): void {
    this.isShowTabChart = false;
    // 使用备份的查询条件，不能直接使用formStatus.getData,防止用户更改表单后，但是未点击确定按钮的操作
    const params = this.searchConditionBackup;
    // 处理选择的物料分类和物料型号的值
    params.materialModel = materialInfoData.materialModel;
    params.materialCode = materialInfoData.code;
    // 处理时间维度 选择年，则传入年份；选择月，则传入年份和月份；选择日，则传入年、月、日
    switch (params.timeDimension) {
      case TimeDimensionEnum.month:
        params.month = CommonUtil.dateFmt('MM', params.warehousingDate);
        break;
      case TimeDimensionEnum.date:
        params.month = CommonUtil.dateFmt('MM', params.warehousingDate);
        params.day = CommonUtil.dateFmt('dd', params.warehousingDate);
        break;
    }
    params.year = CommonUtil.dateFmt('yyyy', params.warehousingDate);
    const request = this.isStockIn ? this.$storageService.warehousingTrend(params) : this.$storageService.deliveryTrend(params);
    request.subscribe(res => {
      this.isShowChart = true;
      if (res.data && Object.keys(res.data).length) {
        this.statisticalChartOptions = StorageChartsConfig.stockInAndStockOutChart(res.data, params, this.$nzI18n, this.isStockIn, this.storageLanguage);
        this.isShowTabChart = true;
      } else {
        this.isShowTabChart = false;
      }
    });
  }
}
