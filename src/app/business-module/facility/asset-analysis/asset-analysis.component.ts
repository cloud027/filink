import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FacilityLanguageInterface} from '../../../../assets/i18n/facility/facility.language.interface';
import {LanguageEnum} from '../../../shared-module/enum/language.enum';
import {NzI18nService} from 'ng-zorro-antd';
import {TableConfigModel} from '../../../shared-module/model/table-config.model';
import {CommonLanguageInterface} from '../../../../assets/i18n/common/common.language.interface';
import {DeviceTypeEnum} from '../../../core-module/enum/facility/facility.enum';
import {CommonUtil} from '../../../shared-module/util/common-util';
import {EquipmentTypeEnum} from '../../../core-module/enum/equipment/equipment.enum';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../shared-module/model/query-condition.model';
import {ResultCodeEnum} from '../../../shared-module/enum/result-code.enum';
import {AssetAnalysisApiService} from '../share/service/asset-analysis/asset-analysis-api.service';
import {ResultModel} from '../../../shared-module/model/result.model';
import {AssetAnalysisStatisticalDimensionEnum} from '../share/enum/asset-analysis-statistical-dimension.enum';
import {ChartsConfig} from '../share/config/charts-config';
import {PageModel} from '../../../shared-module/model/page.model';
import {OperatorEnum} from '../../../shared-module/enum/operator.enum';
import {TableSortConfig} from '../../../shared-module/enum/table-style-config.enum';
import * as _ from 'lodash';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import {AssetAnalysisAssetDimensionEnum} from '../share/enum/asset-analysis-asset-dimension.enum';
import {AssetAnalysisGrowthRateEnum} from '../share/enum/asset-analysis-growth-rate.enum';
import {FacilityForCommonUtil} from '../../../core-module/business-util/facility/facility-for-common.util';
import {SelectModel} from '../../../shared-module/model/select.model';
import {AssetFailureModel} from '../share/model/asset-analysis/asset-failure.model';
import {AssetGrowthDeviceModel} from '../share/model/asset-analysis/asset-growth-device.model';
import {AssetTypeOrGrowthEquipmentModel} from '../share/model/asset-analysis/asset-type-or-growth-equipment.model';
import {AssetTypeDeviceModel} from '../share/model/asset-analysis/asset-type-device.model';
import {ActivatedRoute} from '@angular/router';


/**
 * 资产分析组件
 */
@Component({
    selector: 'app-asset-analysis',
    templateUrl: './asset-analysis.component.html',
    styleUrls: ['./asset-analysis.component.scss']
})
export class AssetAnalysisComponent implements OnInit {
    // 设施类型模板
    @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<HTMLDocument>;
    // 国际化
    public commonLanguage: CommonLanguageInterface;
    // 设施语言包
    public language: FacilityLanguageInterface;
    public selectedIndex: number = 0;
    // 资产类别表格配置
    public tableConfig: TableConfigModel = new TableConfigModel();
    // 资产增长率表格配置
    public growthRateTableConfig: TableConfigModel = new TableConfigModel();
    // 资产故障分布表格配置
    public failureDistributionTableConfig: TableConfigModel = new TableConfigModel();
    // 资产占比统计图配置
    public assetRatioEchartsDataset;
    // 资产增长率统计图配置
    public assetGrowthRateEchartsDataset;
    // 资产故障分布统计图配置
    public failureDistributionEchartsDataset;
    // 资产类别表格筛选、排序或分页获取的当前页表格数据
    public assetTypeSelectData: any = [];
    // 资产增长率表格筛选、排序或分页获取的当前页表格数据
    public assetGrowthSelectData: any = [];
    // 资产故障分布表格筛选、排序或分页获取的当前页表格数据
    public assetFailureSelectData: any = [];
    // 资产类别表格分页配置
    public pageBean: PageModel = new PageModel(5, 1);
    // 资产增长率表格分页配置
    public growthPageBean: PageModel = new PageModel(5, 1);
    // 资产故障分布表格分页配置
    public failurePageBean: PageModel = new PageModel(5, 1);
    // 资产增长率图表切换是否显示表格
    public isShowTable: boolean = true;
    // 资产故障图表切换是否显示表格
    public isShowFailureTable: boolean = true;
    // 是否显示资产类别统计区域
    public isShowStatisticsPart: boolean = false;
    // 是否显示资产增长率统计区域
    public isShowGrowthStatisticsPart: boolean = false;
    // 是否显示资产故障分布统计区域
    public isShowFailureStatisticsPart: boolean = false;
    // 资产增长率无数据展示
    public isNoGrowthData: boolean = false;
    // 资产故障分布无数据展示
    public isNoFailureData: boolean = false;
    // 资产占比无数据展示
    public isNoData: boolean = false;
    // 统计图数据
    private statisticsData: any = [];
    // 资产类别接口返回的全部表格数据
    private dataSet: any = [];
    // 资产增长率接口返回的全部表格数据
    private growthDataSet: any = [];
    // 资产故障接口返回的全部表格数据
    private failureDataSet: AssetFailureModel[] = [];
    // 创建查询实例
    private queryCondition = new QueryConditionModel();
    // 资产类别查询实例
    private queryConditions = new QueryConditionModel();
    // 资产增长率查询实例
    private growthQueryConditions = new QueryConditionModel();
    // 资产故障分布查询实例
    private failureQueryConditions = new QueryConditionModel();
    // 根据筛选条件确定表格资产类型key值
    private assetType: string = 'deviceType';
    // 根据筛选条件确定表格资产数量key值
    private assetsNumber: string = 'deviceNum';
    // 根据筛选条件确定表格百分比key值
    private percentage: string = 'devicePercentage';
    // 保存筛选条件中的选中资产维度数据
    private statisticalDimension: string = AssetAnalysisStatisticalDimensionEnum.area;
    // 统计图title
    private title: string;
    // 增长率统计图x轴数据
    private xGrowthData = [];
    // 故障统计图x轴数据
    private xFailureData = [];
    private assetGrowthKeys = {
        GrowthAssetType: 'deviceType',
        GrowthAssetsNumber: 'deviceNum',
        GrowthRate: 'deviceTypeGrowthRate'
    };
    private growthStatic = [];
    private failureStatic = [];
    // 资产类别筛选下拉框数据
    private assetTypeData: SelectModel[] = [];
    // 资产增长率筛选下拉框数据
    private assetGrowthData: SelectModel[] = [];
    // 资产故障筛选下拉框数据
    private assetFailureData: SelectModel[] = [];
    // 故障当前列表显示的是设施故障还是设备故障
    private isDeviceOrEquipment: string = AssetAnalysisAssetDimensionEnum.facility;
    // 列表导出数据
    private exportData = {
        assetTypeData: [],
        assetGrowthData: [],
        assetFailureData: []
    };
    // 资产数量数组
    private assetsNumberArr: number[] = [];

    constructor(
        public $nzI18n: NzI18nService,
        public $assetAnalysisApiService: AssetAnalysisApiService,
        public $message: FiLinkModalService,
        // 路由传参
        private $active: ActivatedRoute,
    ) {
    }

  /**
   * 初始化
   */
  public ngOnInit(): void {
        // 国际化
        this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
        this.assetTypeData = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
        this.assetGrowthData = FacilityForCommonUtil.getRoleFacility(this.$nzI18n).filter(item =>
            [DeviceTypeEnum.wisdom, DeviceTypeEnum.distributionPanel, DeviceTypeEnum.opticalBox, DeviceTypeEnum.well, DeviceTypeEnum.outdoorCabinet].includes(item.code as DeviceTypeEnum));
        this.assetFailureData = FacilityForCommonUtil.getRoleFacility(this.$nzI18n).filter(item => [DeviceTypeEnum.wisdom, DeviceTypeEnum.distributionPanel].includes(item.code as DeviceTypeEnum));
        this.$active.queryParams.subscribe(params => {
          // 从首页跳转到资产故障分布，tabIndex直接置为2
            if (params.tabIndex === '2') {
                this.selectedIndex = 2;
            }
        });
        this.initTable();
        this.initGrowthRateTable();
        this.initFailureDistributionTable();
    }

    /**
     * 资产占比的统计条件
     * param event
     */
    public assetRatioFilterConditionEmit(event): void {
        this.queryCondition.filterConditions = event.emitCondition;
        this.queryCondition.sortCondition = new SortCondition();
        // 根据筛选条件确定表格中列的key值
        if (event.assetType === AssetAnalysisAssetDimensionEnum.facility) {
            this.title = this.language.assetAnalysis.facilityAsset;
            this.assetType = 'deviceType';
            this.assetsNumber = 'deviceNum';
            this.percentage = 'devicePercentage';
        } else {
            this.title = this.language.assetAnalysis.equipmentAsset;
            this.assetType = 'equipmentType';
            this.assetsNumber = 'equipmentNum';
            this.percentage = 'equipmentPercentage';
        }
        this.statisticalDimension = event.statisticalDimension;
        Promise.resolve().then(() => {
            this.analysis(event.assetType).then((data) => {
                this.assetRatioEchartsDataset = ChartsConfig.assetRatioStatistics(this.title, data);
                this.isNoData = Boolean(data.length);
                this.initTable();
            });
        });
    }

    /**
     * 资产增长率的统计条件
     */
    public assetGrowthRateFilterConditionEmit(event): void {
        Promise.resolve().then(() => {
            this.assetGrowthAnalysis(event).then((data) => {
                this.assetGrowthRateEchartsDataset = ChartsConfig.assetGrowthRateStatistics(this.xGrowthData, data);
                this.isNoGrowthData = Boolean(data.length);
                this.initGrowthRateTable();
            });
        });
    }

    /**
     * 资产故障分布的统计条件
     */
    public assetFailureDistributionFilterConditionEmit(event): void {
        Promise.resolve().then(() => {
            this.assetFailureAnalysis(event).then((data) => {
                this.failureDistributionEchartsDataset = ChartsConfig.assetGrowthRateStatistics(this.xFailureData, data);
                this.isNoFailureData = Boolean(data.length);
                this.initFailureDistributionTable();
            });
        });
    }

    /**
     * 图标切换
     */
    public changeGraph(): void {
        if (this.selectedIndex === 1) {
            this.isShowTable = !this.isShowTable;
        } else {
            this.isShowFailureTable = !this.isShowFailureTable;
        }
    }

    /**
     * 分页查询
     * @param event PageModel
     */
    public pageChange(event: PageModel): void {
        const pageQueryCondition = new QueryConditionModel();
        switch (this.selectedIndex) {
            case 0 :
                this.pageBean.pageIndex = event.pageIndex;
                this.pageBean.pageSize = event.pageSize;
                this.filter(this.selectedIndex, this.exportData.assetTypeData, pageQueryCondition, this.pageBean);
                break;
            case 1 :
                this.growthPageBean.pageIndex = event.pageIndex;
                this.growthPageBean.pageSize = event.pageSize;
                this.filter(this.selectedIndex, this.exportData.assetGrowthData, pageQueryCondition, this.growthPageBean);
                break;
            case 2 :
                this.failurePageBean.pageIndex = event.pageIndex;
                this.failurePageBean.pageSize = event.pageSize;
                this.filter(this.selectedIndex, this.exportData.assetFailureData, pageQueryCondition, this.failurePageBean);
                break;
        }

    }

    /**
     * 根据筛选条件查询资产占比分析
     */
    private analysis(assetType): Promise<any> {
        this.isShowStatisticsPart = true;
        this.queryConditions = new QueryConditionModel();
        this.pageBean.pageSize = 5;
        this.pageBean.pageIndex = 1;
        return new Promise((resolve, reject) => {
            // 资产统计条件为设施、区域时调用接口
            if (assetType === AssetAnalysisAssetDimensionEnum.facility) {
                this.assetTypeData = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
                this.$assetAnalysisApiService.queryDeviceTypeCountByCondition(this.queryCondition).subscribe((result: ResultModel<AssetTypeDeviceModel[]>) => {
                    if (result.code === ResultCodeEnum.success) {
                        this.dataSet = result.data || [];
                        this.assetsNumberArr = this.dataSet.map(item => item.deviceNum);
                      this.dataSet.forEach((item, index) => {
                        item.iconClass = CommonUtil.getFacilityIConClass(item.deviceType);
                        item.deviceType = CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n, item.deviceType, 'facility.config');
                        // 统一字段名，方便在html中资产类型模板显示
                        item.typeName = item.deviceType;
                        item.numSearchKey = String(item.deviceNum);
                        item.percentageSortKey = this.getPercentValue(this.assetsNumberArr, index, 2);
                        item.devicePercentage = `${item.percentageSortKey}%`;
                      });
                      this.filter(0, this.dataSet, this.queryConditions, this.pageBean);
                        this.statisticsData = result.data.map(item => {
                            return {
                                value: item.deviceNum,
                                name: item.deviceType,
                            };
                        });
                        resolve(this.statisticsData);
                    } else {
                        reject();
                    }
                }, () => {
                    reject();
                });
            } else {
                this.assetTypeData = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n);
                // 资产占比统计条件为设备、区域时调用接口
                this.$assetAnalysisApiService.queryEquipmentTypeCountByCondition(this.queryCondition).subscribe((result: ResultModel<AssetTypeOrGrowthEquipmentModel[]>) => {
                    if (result.code === ResultCodeEnum.success) {
                        this.dataSet = result.data || [];
                        this.assetsNumberArr = this.dataSet.map(item => item.equipmentNum);
                        this.dataSet.forEach((item, index) => {
                            item.iconClass = CommonUtil.getEquipmentIconClassName(item.equipmentType);
                            item.equipmentType = CommonUtil.codeTranslate(EquipmentTypeEnum, this.$nzI18n, item.equipmentType, 'facility');
                            // 统一字段名，方便在html中资产类型模板显示
                            item.typeName = item.equipmentType;
                            item.numSearchKey = String(item.equipmentNum);
                            item.percentageSortKey = this.getPercentValue(this.assetsNumberArr, index, 2);
                            item.equipmentPercentage = `${item.percentageSortKey}%`;
                        });
                        this.filter(0, this.dataSet, this.queryConditions, this.pageBean);
                        this.statisticsData = result.data.map(item => {
                            return {
                                value: item.equipmentNum,
                                name: item.equipmentType,
                            };
                        });
                        resolve(this.statisticsData);
                    } else {
                        reject();
                    }
                }, () => {
                    reject();
                });
            }
        });

    }

  /**
   * 最大余额法计算百分比
   * @param valueList 要计算的数组
   * @param idx 索引值
   * @param precision 百分比精度
   */
    private getPercentValue(valueList, idx, precision) {
      // 判断是否为空
      if (!valueList[idx]) {
        return 0;
      }
      // 求和
      const sum = valueList.reduce(function (acc, val) {
        return acc + (isNaN(val) ? 0 : val);
      }, 0);
      if (sum === 0) {
        return 0;
      }
      // 10的2次幂是100，用于计算精度。
      const digits = Math.pow(10, precision);
      // 扩大比例100，
      const votesPerQuota = valueList.map(function (val) {
        return (isNaN(val) ? 0 : val) / sum * digits * 100;
      });
      // 总数，扩大比例意味的总数要扩大
      const targetSeats = digits * 100;
      // 再向下取值，组成数组
      const seats = votesPerQuota.map(function (votes) {
        return Math.floor(votes);
      });
      // 再新计算合计，用于判断与总数量是否相同，相同则占比会100%
      let currentSum = seats.reduce(function (acc, val) {
        return acc + val;
      }, 0);
      // 余数部分的数组：原先数组减去向下取值的数组，得到余数部分的数组
      const remainder = votesPerQuota.map(function (votes, i) {
        return votes - seats[i];
      });
      // 给最大最大的余额加1，凑个占比100%；
      while (currentSum < targetSeats) {
        //  找到下一个最大的余额，给其加1
        let max = Number.NEGATIVE_INFINITY;
        let maxId = null;
        for (let i = 0, len = remainder.length; i < len; ++i) {
          if (remainder[i] > max) {
            max = remainder[i];
            maxId = i;
          }
        }
        // 对最大项余额加1
        ++seats[maxId];
        // 已经增加最大余数加1，则下次判断就可以不需要再判断这个余额数。
        remainder[maxId] = 0;
        // 总的也要加1，为了判断是否总数是否相同，跳出循环。
        ++currentSum;
      }
      // 这时候的seats就会总数占比会100%
      return seats[idx] / digits;
    }
    /**
     * 根据筛选条件查询资产增长率表格和统计图数据
     */
    private assetGrowthAnalysis(filterCondition): Promise<any> {
        this.isShowGrowthStatisticsPart = true;
        this.growthQueryConditions = new QueryConditionModel();
        this.growthPageBean.pageSize = 5;
        this.growthPageBean.pageIndex = 1;
        return new Promise((resolve, reject) => {
            if (filterCondition.assetType === AssetAnalysisAssetDimensionEnum.facility) {
                this.assetGrowthData = FacilityForCommonUtil.getRoleFacility(this.$nzI18n).filter(item =>
                    [DeviceTypeEnum.wisdom, DeviceTypeEnum.distributionPanel, DeviceTypeEnum.opticalBox, DeviceTypeEnum.well, DeviceTypeEnum.outdoorCabinet].includes(item.code as DeviceTypeEnum));
                this.assetGrowthKeys = {
                    GrowthAssetType: 'deviceType',
                    GrowthAssetsNumber: 'deviceNum',
                    GrowthRate: 'deviceTypeGrowthRate'
                };
                this.$assetAnalysisApiService.queryDeviceTypeGrowthRate(filterCondition.GrowthEmitCondition).subscribe((result: ResultModel<AssetGrowthDeviceModel[]>) => {
                    if (result.code === ResultCodeEnum.success) {
                        this.growthDataSet = result.data;
                        this.growthDataSet.forEach(item => {
                            item.iconClass = CommonUtil.getFacilityIConClass(item.deviceType);
                            item.deviceType = CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n, item.deviceType, 'facility.config');
                            // 统一字段名，方便在html中资产类型模板显示
                            item.typeName = item.deviceType;
                            // 统一统计图数值名称
                            item.number = item.deviceNum;
                            item.numSearchKey = String(item.deviceNum);
                            item.createTime = item.createTimeStamp;
                            // 如果返回的增长率值为双横线，将其赋值为0，以便排序
                            if (item.deviceTypeGrowthRate === '--') {
                                item.growthRateSortKey = 0;
                            } else {
                                item.growthRateSortKey = parseFloat(item.deviceTypeGrowthRate);
                            }
                        });
                        this.handleGrowthStatisticalData(filterCondition);
                        resolve(this.growthStatic);
                    } else {
                        reject();
                    }
                });
            } else {
                this.assetGrowthData = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n);
                this.assetGrowthKeys = {
                    GrowthAssetType: 'equipmentType',
                    GrowthAssetsNumber: 'equipmentNum',
                    GrowthRate: 'equipmentTypeGrowthRate'
                };
                this.$assetAnalysisApiService.queryEquipmentTypeGrowthRate(filterCondition.GrowthEmitCondition).subscribe((result: ResultModel<AssetTypeOrGrowthEquipmentModel[]>) => {
                    if (result.code === ResultCodeEnum.success) {
                        this.growthDataSet = result.data;
                        this.growthDataSet.forEach(item => {
                            item.iconClass = CommonUtil.getEquipmentIconClassName(item.equipmentType);
                            item.equipmentType = CommonUtil.codeTranslate(EquipmentTypeEnum, this.$nzI18n, item.equipmentType, 'facility');
                            item.typeName = item.equipmentType;
                            // 统一统计图数值名称
                            item.number = item.equipmentNum;
                            item.numSearchKey = String(item.equipmentNum);
                            item.createTime = item.createTimeStamp;
                            // 如果返回的增长率值为双横线，将其赋值为0，以便排序
                            if (item.equipmentTypeGrowthRate === '--') {
                                item.growthRateSortKey = 0;
                            } else {
                                item.growthRateSortKey = parseFloat(item.equipmentTypeGrowthRate);
                            }
                        });
                        this.handleGrowthStatisticalData(filterCondition);
                        resolve(this.growthStatic);
                    } else {
                        reject();
                    }
                });
            }
        });
    }

    /**
     * 根据筛选条件查询资产故障分布分析
     */
    private assetFailureAnalysis(filterCondition): Promise<any> {
        this.isShowFailureStatisticsPart = true;
        this.failureQueryConditions = new QueryConditionModel();
      this.failurePageBean.pageSize = 5;
      this.failurePageBean.pageIndex = 1;
        return new Promise((resolve, reject) => {
            if (filterCondition.assetType === AssetAnalysisAssetDimensionEnum.facility) {
                this.assetFailureData = FacilityForCommonUtil.getRoleFacility(this.$nzI18n).filter(item =>
                [DeviceTypeEnum.wisdom, DeviceTypeEnum.distributionPanel].includes(item.code as DeviceTypeEnum));
                this.isDeviceOrEquipment = AssetAnalysisAssetDimensionEnum.facility;
                this.$assetAnalysisApiService.deviceProductTroubleGrowthRate(filterCondition.GrowthEmitCondition).subscribe((result: ResultModel<AssetFailureModel[]>) => {
                    if (result.code === ResultCodeEnum.success) {
                        this.failureDataSet = result.data || [];
                        this.handleFailureTableData(filterCondition);
                        resolve(this.failureStatic);
                    } else {
                        reject();
                    }
                });
            } else {
                this.assetFailureData = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n).filter(item => item.label !== this.language.intelligentEntranceGuardLock);
                this.isDeviceOrEquipment = AssetAnalysisAssetDimensionEnum.equipment;
                this.$assetAnalysisApiService.equipmentProductTroubleGrowthRate(filterCondition.GrowthEmitCondition).subscribe((result: ResultModel<AssetFailureModel[]>) => {
                    if (result.code === ResultCodeEnum.success) {
                        this.failureDataSet = result.data || [];
                        this.handleFailureTableData(filterCondition);
                        resolve(this.failureStatic);
                    } else {
                        reject();
                    }
                });
            }
        });
    }

    /**
     * 资产占比初始化统计表格配置
     */
    private initTable(): void {
        this.tableConfig = {
            isDraggable: true,
            isLoading: false,
            outHeight: 108,
            showSearchSwitch: true,
            assetShowPagination: true,
            scroll: {x: '1300px', y: '340px'},
            noIndex: true,
            notShowPrint: true,
            showSearchExport: true,
            columnConfig: [
                { // 序号
                    type: 'serial-number',
                    width: 62,
                    title: this.language.serialNumber,
                    fixedStyle: {fixedLeft: true, style: {left: '0px'}},
                },
                { // 资产类型
                    title: this.language.assetAnalysis.assetCategory, key: this.assetType, width: 150,
                    type: 'render',
                    renderTemplate: this.deviceTypeTemp,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: {
                        type: 'select',
                        selectInfo: this.assetTypeData, label: 'label', value: 'code'
                    },
                },
                { // 资产数量
                    title: this.language.assetAnalysis.assetsNumber, key: this.assetsNumber, width: 150,
                    isShowSort: true,
                    searchable: true,
                    searchKey: 'numSearchKey',
                    searchConfig: {type: 'input'}
                },
                { // 百分比
                    title: this.language.assetAnalysis.percentage, key: this.percentage, width: 150,
                    isShowSort: true,
                    sortKey: 'percentageSortKey',
                    searchable: true,
                    searchConfig: {type: 'input'}
                },
                {
                    title: this.language.operate,
                    searchable: true,
                    searchConfig: {
                        type: 'operate',
                    }, key: '', width: 100, fixedStyle: {fixedRight: true, style: {right: '0px'}}
                },
            ],
            // 排序
            sort: (event: SortCondition) => {
                this.queryConditions.sortCondition = event;
                this.filter(this.selectedIndex, this.dataSet, this.queryConditions, this.pageBean);
            },
            // 筛选
            handleSearch: (event: FilterCondition[]) => {
                event.forEach(item => {
                    item.operator = OperatorEnum.like;
                    if (item.filterField === 'deviceType') {
                        item.filterValue = CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n, item.filterValue, 'facility.config');
                    } else if (item.filterField === 'equipmentType') {
                        item.filterValue = CommonUtil.codeTranslate(EquipmentTypeEnum, this.$nzI18n, item.filterValue, 'facility');
                    } else if (item.filterField === 'numSortKey') {
                        item.filterValue = String(item.filterValue);
                    }
                });
                this.queryConditions.filterConditions = event;
                this.queryConditions.pageCondition.pageNum = 1;
                this.filter(this.selectedIndex, this.dataSet, this.queryConditions, this.pageBean);
            },
            // 导出
            handleExport: (event) => {
                let tableData = [];
                let requestUrl;
                if (this.assetType === 'deviceType') {
                    tableData = this.exportData.assetTypeData.map(item => {
                        const {deviceType, deviceNum, devicePercentage} = item;
                        return {deviceType, deviceNum, devicePercentage};
                    });
                } else {
                    tableData = this.exportData.assetTypeData.map(item => {
                        const {equipmentType, equipmentNum, equipmentPercentage} = item;
                        return {equipmentType, equipmentNum, equipmentPercentage};
                    });
                }
                // 处理参数
                const body = this.handleExportData(event, tableData);
                if (this.assetType === 'deviceType') {
                    requestUrl = this.$assetAnalysisApiService.exportDeviceTypeCount(body);
                } else {
                    requestUrl = this.$assetAnalysisApiService.exportEquipmentTypeCount(body);
                }
                this.exportInterface(requestUrl);
            }
        };
    }

    /**
     * 资产增长率初始化统计表格配置
     */
    private initGrowthRateTable(): void {
        this.growthRateTableConfig = {
            isDraggable: true,
            isLoading: false,
            outHeight: 108,
            assetShowPagination: true,
            showSearchSwitch: true,
            scroll: {x: '1600px', y: '340px'},
            noIndex: true,
            notShowPrint: true,
            showSearchExport: true,
            columnConfig: [
                { // 序号
                    type: 'serial-number',
                    width: 62,
                    title: this.language.serialNumber,
                    fixedStyle: {fixedLeft: true, style: {left: '0px'}},
                },
                { // 时间
                    title: this.language.time, key: 'createTime', width: 150,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: {type: 'input'},
                },
                { // 资产类型
                    title: this.language.assetAnalysis.assetCategory, key: this.assetGrowthKeys.GrowthAssetType, width: 150,
                    type: 'render',
                    renderTemplate: this.deviceTypeTemp,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: {
                        type: 'select',
                        selectInfo: this.assetGrowthData, label: 'label', value: 'code'
                    },
                },
                { // 资产数量
                    title: this.language.assetAnalysis.assetsNumber, key: this.assetGrowthKeys.GrowthAssetsNumber, width: 150,
                    isShowSort: true,
                    searchable: true,
                    searchKey: 'numSearchKey',
                    searchConfig: {type: 'input'}
                },
                { // 增长率
                    title: this.language.assetAnalysis.growthRate, key: this.assetGrowthKeys.GrowthRate, width: 150,
                    isShowSort: true,
                    sortKey: 'growthRateSortKey',
                    searchable: true,
                    searchConfig: {type: 'input'}
                },
                {
                    title: this.language.operate,
                    searchable: true,
                    searchConfig: {
                        type: 'operate',
                    }, key: '', width: 100, fixedStyle: {fixedRight: true, style: {right: '0px'}}
                },
            ],
            rightTopButtons: [
                {
                    // 统计图表切换
                    text: this.language.assetAnalysis.chartSwitching,
                    iconClassName: 'fiLink-analysis',
                    handle: () => {
                        this.changeGraph();
                    }
                }
            ],
            // 排序
            sort: (event: SortCondition) => {
                this.growthQueryConditions.sortCondition = event;
                if ((event.sortField === this.assetGrowthKeys.GrowthAssetType && event.sortRule === TableSortConfig.DESC) || event.sortField === 'growthRateSortKey') {
                    this.handleSort(event, this.growthQueryConditions);
                } else {
                    this.filter(this.selectedIndex, this.growthDataSet, this.growthQueryConditions, this.growthPageBean);
                }
            },
            // 筛选
            handleSearch: (event: FilterCondition[]) => {
                event.forEach(item => {
                    item.operator = OperatorEnum.like;
                    if (item.filterField === 'deviceType') {
                        item.filterValue = CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n, item.filterValue, 'facility.config');
                    } else if (item.filterField === 'equipmentType') {
                        item.filterValue = CommonUtil.codeTranslate(EquipmentTypeEnum, this.$nzI18n, item.filterValue, 'facility');
                    } else if (item.filterField === 'numSortKey') {
                        item.filterValue = String(item.filterValue);
                    }
                });
                this.growthQueryConditions.filterConditions = event;
                this.growthQueryConditions.pageCondition.pageNum = 1;
                const sortCondition = this.growthQueryConditions.sortCondition;
                if ((sortCondition.sortField === this.assetGrowthKeys.GrowthAssetType && sortCondition.sortRule === TableSortConfig.DESC) || sortCondition.sortField === 'growthRateSortKey') {
                    this.handleSort(sortCondition, this.growthQueryConditions);
                } else {
                    this.filter(this.selectedIndex, this.growthDataSet, this.growthQueryConditions, this.growthPageBean);
                }
            },
            // 导出
            handleExport: (event) => {
                let tableData = [];
                let requestUrl;
                if (this.assetGrowthKeys.GrowthAssetType === 'deviceType') {
                    tableData = this.exportData.assetGrowthData.map(item => {
                        const {createTime, deviceType, deviceNum, deviceTypeGrowthRate} = item;
                        return {createTime, deviceType, deviceNum, deviceTypeGrowthRate};
                    });
                } else {
                    tableData = this.exportData.assetGrowthData.map(item => {
                        const {createTime, equipmentType, equipmentNum, equipmentTypeGrowthRate} = item;
                        return {createTime, equipmentType, equipmentNum, equipmentTypeGrowthRate};
                    });
                }
                // 获取到出接口参数
                const body = this.handleExportData(event, tableData);
                if (this.assetGrowthKeys.GrowthAssetType === 'deviceType') {
                    requestUrl = this.$assetAnalysisApiService.exportDeviceTypeGrowthRate(body);
                } else {
                    requestUrl = this.$assetAnalysisApiService.exportEquipmentTypeGrowthRate(body);
                }
                this.exportInterface(requestUrl);
            }
        };
    }

    /**
     * 资产故障分布初始化统计表格配置
     */
    private initFailureDistributionTable(): void {
        this.failureDistributionTableConfig = {
            isDraggable: true,
            isLoading: false,
            outHeight: 108,
            showSearchSwitch: true,
            scroll: {x: '1600px', y: '340px'},
            noIndex: true,
            notShowPrint: true,
            showSearchExport: true,
            assetShowPagination: true,
            columnConfig: [
                { // 序号
                    type: 'serial-number',
                    width: 62,
                    title: this.language.serialNumber,
                    fixedStyle: {fixedLeft: true, style: {left: '0px'}},
                },
                { // 产品id列隐藏，用于区分唯一产品型号，对故障增长率排序
                    title: '', key: 'productId', width: 150,
                    isShowSort: true,
                    searchable: true,
                    hidden: true,
                    searchConfig: {type: 'input'}
                },
                { // 时间
                    title: this.language.time, key: 'createTime', width: 150,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: {type: 'input'},
                    fixedStyle: {fixedLeft: true, style: {left: '62px'}},
                },
                { // 资产类型
                    title: this.language.assetAnalysis.assetCategory, key: 'typeName', width: 150,
                    type: 'render',
                    renderTemplate: this.deviceTypeTemp,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: {
                        type: 'select',
                        selectInfo: this.assetFailureData, label: 'label', value: 'code'
                    },
                },
                { // 规格型号
                    title: this.language.assetAnalysis.productModel, key: 'productModel', width: 150,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: {type: 'input'}
                },
                { // 供应商
                    title: this.language.assetAnalysis.supplier, key: 'supplierName', width: 150,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: {type: 'input'}
                },
                { // 软件版本
                    title: this.language.assetAnalysis.softwareVersion, key: 'softwareVersion', width: 150,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: {type: 'input'}
                },
                { // 硬件版本
                    title: this.language.assetAnalysis.hardwareVersion, key: 'hardwareVersion', width: 150,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: {type: 'input'}
                },
                { // 故障数
                    title: this.language.assetAnalysis.failuresNumber, key: 'troubleNum', width: 150,
                    isShowSort: true,
                    searchable: true,
                    searchKey: 'numSearchKey',
                    searchConfig: {type: 'input'}
                },
                { // 故障增长率
                    title: this.language.assetAnalysis.failureRate, key: 'troubleGrowthRate', width: 150,
                    isShowSort: true,
                    sortKey: 'failureRateSortKey',
                    searchable: true,
                    searchConfig: {type: 'input'},
                    fixedStyle: {fixedRight: true, style: {right: '0'}}
                },
                {
                    title: this.language.operate,
                    searchable: true,
                    searchConfig: {
                        type: 'operate',
                    }, key: '', width: 100, fixedStyle: {fixedRight: true, style: {right: '0px'}}
                },
            ],
            rightTopButtons: [
                {
                    // 统计图表切换
                    text: this.language.assetAnalysis.chartSwitching,
                    iconClassName: 'fiLink-analysis',
                    handle: () => {
                        this.changeGraph();
                    }
                }
            ],
            // 排序
            sort: (event: SortCondition) => {
                this.failureQueryConditions.sortCondition = event;
                if ((event.sortField === 'typeName' && event.sortRule === TableSortConfig.DESC) || event.sortField === 'failureRateSortKey') {
                    this.handleSort(event, this.failureQueryConditions);
                } else {
                    this.filter(this.selectedIndex, this.failureDataSet, this.failureQueryConditions, this.failurePageBean);
                }
            },
            // // 筛选
            handleSearch: (event: FilterCondition[]) => {
                event.forEach(item => {
                    item.operator = OperatorEnum.like;
                    if (item.filterField === 'typeName') {
                        if (this.isDeviceOrEquipment === AssetAnalysisAssetDimensionEnum.facility) {
                            item.filterValue = CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n, item.filterValue, 'facility.config');
                        } else {
                            item.filterValue = CommonUtil.codeTranslate(EquipmentTypeEnum, this.$nzI18n, item.filterValue, 'facility');
                        }
                    } else if (item.filterField === 'numSortKey') {
                        item.filterValue = String(item.filterValue);
                    }
                });
                this.failureQueryConditions.filterConditions = event;
                this.failureQueryConditions.pageCondition.pageNum = 1;
                const sortCondition = this.failureQueryConditions.sortCondition;
                if ((sortCondition.sortField === 'typeName' && sortCondition.sortRule === TableSortConfig.DESC) || sortCondition.sortField === 'failureRateSortKey') {
                    this.handleSort(sortCondition, this.failureQueryConditions);
                } else {
                    this.filter(this.selectedIndex, this.failureDataSet, this.failureQueryConditions, this.failurePageBean);
                }
            },
            // 导出
            handleExport: (event) => {
                let failureTableData: any[];
                let requestUrl;
                failureTableData = this.exportData.assetFailureData.map(item => {
                    const {createTime, typeName, productModel, supplierName, softwareVersion, hardwareVersion, troubleNum, troubleGrowthRate} = item;
                    return {
                        createTime, typeName, productModel, supplierName, softwareVersion, hardwareVersion, troubleNum, troubleGrowthRate
                    };
                });
                // 获取导出接口参数
                const body = this.handleExportData(event, failureTableData);
                requestUrl = this.$assetAnalysisApiService.exportProductTroubleGrowthRate(body);
                this.exportInterface(requestUrl);
            }
        };
    }

    private filter(index, data, filterCondition, pageBean): any {
        // 搜索逻辑
        let searchData = [];
        if (filterCondition.filterConditions.length) {
            searchData = data.filter(item => {
                return filterCondition.filterConditions.every(_item => {
                    if (item[_item.filterField]) {
                        if (_item.operator === OperatorEnum.eq) {
                            return item[_item.filterField] === _item.filterValue;
                        } else if (_item.operator === OperatorEnum.in) {
                            return _item.filterValue.includes(item[_item.filterField]);
                        } else {
                            return item[_item.filterField].includes(_item.filterValue);
                        }
                    } else {
                        return false;
                    }
                });
            });
        } else {
            searchData = data;
        }
        // 排序逻辑
        let sortDataSet = [];
        if (filterCondition.sortCondition && filterCondition.sortCondition.sortRule) {
            sortDataSet = _.sortBy(searchData, filterCondition.sortCondition.sortField);
            if (filterCondition.sortCondition.sortRule === TableSortConfig.DESC) {
                sortDataSet.reverse();
            }
        } else {
            sortDataSet = searchData;
        }
        const selectData = sortDataSet.slice(pageBean.pageSize * (pageBean.pageIndex - 1),
            pageBean.pageIndex * pageBean.pageSize);
        switch (index) {
            case 0 :
                this.assetTypeSelectData = selectData;
                this.pageBean.Total = sortDataSet.length;
                this.exportData.assetTypeData = sortDataSet;
                break;
            case 1 :
                this.assetGrowthSelectData = selectData;
                this.growthPageBean.Total = sortDataSet.length;
                this.exportData.assetGrowthData = sortDataSet;
                break;
            case 2 :
                this.assetFailureSelectData = selectData;
                this.failurePageBean.Total = sortDataSet.length;
                this.exportData.assetFailureData = sortDataSet;
                break;
        }
        return sortDataSet;
    }

    /**
     * 将接口返回的数据处理成统计图数据格式
     */
    private handleDataSet(data, size, number): any[] {
        const result = [];
        const staticData = [];
        for (let i = 0; i < data.length; i += size) {
            result.push(data.slice(i, i + size));
        }
        switch (number) {
            case 0 :
                result.forEach(item => {
                    const growthNum = [];
                    const growthRate = [];
                    item.forEach(i => {
                        growthNum.push(i.number);
                        growthRate.push(i.growthRateSortKey);
                    });
                    staticData.push({
                        name: item[0].typeName,
                        type: 'bar',
                        data: growthNum,
                        barGap: '0%',
                    });
                    staticData.push({
                        name: `${item[0].typeName}${this.language.assetAnalysis.growthRate}`,
                        type: 'line',
                        data: growthRate,
                        yAxisIndex: 1,
                    });
                });
                break;
            case 1 :
                result.forEach(item => {
                    const growthNum = [];
                    const growthRate = [];
                    item.forEach(i => {
                        growthNum.push(i.troubleNum);
                        growthRate.push(i.failureRateSortKey);
                    });
                    staticData.push({
                        name: `${item[0].productModel}${item[0].supplierName}`,
                        type: 'bar',
                        data: growthNum,
                        barGap: '0%',
                    });
                    staticData.push({
                        name: `${item[0].productModel}${item[0].supplierName}${this.language.assetAnalysis.failureRate}`,
                        type: 'line',
                        data: growthRate,
                        yAxisIndex: 1,
                    });
                });
                break;
        }
        return staticData;
    }

    /**
     * 对接口返回时间进行处理，以便统计表图展示
     */
    private handleTime(growthType, dataSet): any[] {
        switch (growthType) {
            case AssetAnalysisGrowthRateEnum.monthlyGrowth :
                dataSet.forEach(data => {
                    if (JSON.parse(localStorage.getItem('localLanguage')) === 'EN') {
                        // 如果是英文环境 时间样式yyyy-MM
                        data.createTime = (CommonUtil.dateFmt(`yyyy-MM`, new Date(data.createTime)));
                    } else {
                        data.createTime = (CommonUtil.dateFmt('yyyy年MM月', new Date(data.createTime)));
                    }
                });
                break;
            case AssetAnalysisGrowthRateEnum.annualGrowth :
                dataSet.forEach(data => {
                    if (JSON.parse(localStorage.getItem('localLanguage')) === 'EN') {
                        // 如果是英文环境 时间样式yyyy
                        data.createTime = (CommonUtil.dateFmt(`yyyy`, new Date(data.createTime)));
                    } else {
                        data.createTime = (CommonUtil.dateFmt('yyyy年', new Date(data.createTime)));
                    }
                });
                break;
            case AssetAnalysisGrowthRateEnum.dailyGrowth :
                dataSet.forEach(data => {
                    if (JSON.parse(localStorage.getItem('localLanguage')) === 'EN') {
                        // 如果是英文环境 时间样式yyyy-MM-dd
                        data.createTime = (CommonUtil.dateFmt(`yyyy-MM-dd`, new Date(data.createTime)));
                    } else {
                        data.createTime = (CommonUtil.dateFmt('yyyy年MM月dd日', new Date(data.createTime)));
                    }
                });
                break;
        }
        return dataSet;
    }

    /**
     * 资产增长率统计图数据处理
     */
    private handleGrowthStatisticalData(filterCondition): void {
        const statisticXData = [];
        this.growthDataSet = this.handleTime(filterCondition.selectGrowthRateType, this.growthDataSet);
        this.filter(1, this.growthDataSet, this.growthQueryConditions, this.growthPageBean);
        this.growthDataSet.forEach(item => {
            if (!statisticXData.includes(item.createTime)) {
                statisticXData.push(item.createTime);
            }
        });
        this.xGrowthData = statisticXData;
        this.growthStatic = this.handleDataSet(this.growthDataSet, statisticXData.length, 0);
    }

    /**
     * 资产故障列表接口返回数据处理
     */
    private handleFailureTableData(filterCondition): void {
        const statisticXData = [];
        if (filterCondition.selectProductInformation.length) {
            this.failureDataSet.forEach(item => {
                item.numSearchKey = String(item.troubleNum);
                if (item.troubleGrowthRate === '--') {
                    item.failureRateSortKey = 0;
                } else {
                    item.failureRateSortKey = parseFloat(item.troubleGrowthRate);
                }
                filterCondition.selectProductInformation.forEach(i => {
                    if (item.productId === i.productId) {
                        switch (filterCondition.assetType) {
                            case AssetAnalysisAssetDimensionEnum.facility:
                                item.iconClass = CommonUtil.getFacilityIConClass(i.typeCode);
                                item.typeName = CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n, i.typeCode, 'facility.config');
                                break;
                            case AssetAnalysisAssetDimensionEnum.equipment:
                                item.iconClass = CommonUtil.getEquipmentIconClassName(i.typeCode);
                                item.typeName = CommonUtil.codeTranslate(EquipmentTypeEnum, this.$nzI18n, i.typeCode, 'facility');
                                break;
                            default:
                                break;
                        }
                        item.productModel = i.productModel;
                        item.supplierName = i.supplierName;
                        item.softwareVersion = i.softwareVersion;
                        item.hardwareVersion = i.hardwareVersion;
                    }
                });
            });
            this.failureDataSet = this.handleTime(filterCondition.GrowthEmitCondition.bizCondition.growthRateDimension, this.failureDataSet);
        }
        this.filter(2, this.failureDataSet, this.failureQueryConditions, this.failurePageBean);
        this.failureDataSet.forEach(item => {
            if (!statisticXData.includes(item.createTime)) {
                statisticXData.push(item.createTime);
            }
        });
        this.xFailureData = statisticXData;
        this.failureStatic = this.handleDataSet(this.failureDataSet, statisticXData.length, 1);
    }

    /**
     * 导出参数的处理
     */
    private handleExportData(event, data): any {
        const body = {
            queryCondition: new QueryConditionModel(),
            // 列信息
            columnInfoList: event.columnInfoList,
            // 导出文件类型
            excelType: event.excelType,
            // 表格数据内容
            objectList: data
        };
        return body;
    }

    /**
     * 列表导出调用接口
     */
    private exportInterface(requestUrl): void {
        requestUrl.subscribe((result: ResultModel<any>) => {
            if (result.code === ResultCodeEnum.success || result.code === 0) {
                this.$message.success(this.language.assetAnalysis.exportSuccess);
            } else {
                this.$message.error(result.msg);
            }
        });
    }

    /**
     * 排序条件为资产类型或增长率的情况下的排序处理
     */
    private handleSort(sortCondition, filterCondition): void {
        let queryCondition: QueryConditionModel;
        queryCondition = CommonUtil.deepClone(filterCondition);
        switch (sortCondition.sortField) {
            case this.assetGrowthKeys.GrowthAssetType:
                queryCondition.sortCondition = {sortField: 'createTime', sortRule: TableSortConfig.DESC};
                const typeSortDataSet = this.filter(this.selectedIndex, this.growthDataSet, queryCondition, this.growthPageBean);
                queryCondition.sortCondition = sortCondition;
                this.filter(this.selectedIndex, typeSortDataSet, queryCondition, this.growthPageBean);
                break;
            case 'growthRateSortKey':
                queryCondition.sortCondition = sortCondition;
                const growthSortDataSet = this.filter(this.selectedIndex, this.growthDataSet, queryCondition, this.growthPageBean);
                queryCondition.sortCondition = {sortField: this.assetGrowthKeys.GrowthAssetType, sortRule: TableSortConfig.ASC};
                this.filter(this.selectedIndex, growthSortDataSet, queryCondition, this.growthPageBean);
                break;
            case 'typeName' :
                queryCondition.sortCondition = {sortField: 'createTime', sortRule: TableSortConfig.DESC};
                const failureTypeSortDataSet = this.filter(this.selectedIndex, this.failureDataSet, queryCondition, this.failurePageBean);
                queryCondition.sortCondition = {sortField: 'productId', sortRule: TableSortConfig.ASC};
                const sortModelDataSet = this.filter(this.selectedIndex, failureTypeSortDataSet, queryCondition, this.failurePageBean);
                queryCondition.sortCondition = sortCondition;
                this.filter(this.selectedIndex, sortModelDataSet, queryCondition, this.failurePageBean);
                break;
            case 'failureRateSortKey':
                queryCondition.sortCondition = sortCondition;
                const sortDataSet = this.filter(this.selectedIndex, this.failureDataSet, queryCondition, this.failurePageBean);
                queryCondition.sortCondition = {sortField: 'productId', sortRule: TableSortConfig.ASC};
                this.filter(this.selectedIndex, sortDataSet, queryCondition, this.failurePageBean);
                break;
            default:
                break;
        }
    }
}
