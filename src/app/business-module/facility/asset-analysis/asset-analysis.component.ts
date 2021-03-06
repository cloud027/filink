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
 * ??????????????????
 */
@Component({
    selector: 'app-asset-analysis',
    templateUrl: './asset-analysis.component.html',
    styleUrls: ['./asset-analysis.component.scss']
})
export class AssetAnalysisComponent implements OnInit {
    // ??????????????????
    @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<HTMLDocument>;
    // ?????????
    public commonLanguage: CommonLanguageInterface;
    // ???????????????
    public language: FacilityLanguageInterface;
    public selectedIndex: number = 0;
    // ????????????????????????
    public tableConfig: TableConfigModel = new TableConfigModel();
    // ???????????????????????????
    public growthRateTableConfig: TableConfigModel = new TableConfigModel();
    // ??????????????????????????????
    public failureDistributionTableConfig: TableConfigModel = new TableConfigModel();
    // ???????????????????????????
    public assetRatioEchartsDataset;
    // ??????????????????????????????
    public assetGrowthRateEchartsDataset;
    // ?????????????????????????????????
    public failureDistributionEchartsDataset;
    // ????????????????????????????????????????????????????????????????????????
    public assetTypeSelectData: any = [];
    // ???????????????????????????????????????????????????????????????????????????
    public assetGrowthSelectData: any = [];
    // ??????????????????????????????????????????????????????????????????????????????
    public assetFailureSelectData: any = [];
    // ??????????????????????????????
    public pageBean: PageModel = new PageModel(5, 1);
    // ?????????????????????????????????
    public growthPageBean: PageModel = new PageModel(5, 1);
    // ????????????????????????????????????
    public failurePageBean: PageModel = new PageModel(5, 1);
    // ?????????????????????????????????????????????
    public isShowTable: boolean = true;
    // ??????????????????????????????????????????
    public isShowFailureTable: boolean = true;
    // ????????????????????????????????????
    public isShowStatisticsPart: boolean = false;
    // ???????????????????????????????????????
    public isShowGrowthStatisticsPart: boolean = false;
    // ??????????????????????????????????????????
    public isShowFailureStatisticsPart: boolean = false;
    // ??????????????????????????????
    public isNoGrowthData: boolean = false;
    // ?????????????????????????????????
    public isNoFailureData: boolean = false;
    // ???????????????????????????
    public isNoData: boolean = false;
    // ???????????????
    private statisticsData: any = [];
    // ?????????????????????????????????????????????
    private dataSet: any = [];
    // ????????????????????????????????????????????????
    private growthDataSet: any = [];
    // ?????????????????????????????????????????????
    private failureDataSet: AssetFailureModel[] = [];
    // ??????????????????
    private queryCondition = new QueryConditionModel();
    // ????????????????????????
    private queryConditions = new QueryConditionModel();
    // ???????????????????????????
    private growthQueryConditions = new QueryConditionModel();
    // ??????????????????????????????
    private failureQueryConditions = new QueryConditionModel();
    // ??????????????????????????????????????????key???
    private assetType: string = 'deviceType';
    // ??????????????????????????????????????????key???
    private assetsNumber: string = 'deviceNum';
    // ???????????????????????????????????????key???
    private percentage: string = 'devicePercentage';
    // ????????????????????????????????????????????????
    private statisticalDimension: string = AssetAnalysisStatisticalDimensionEnum.area;
    // ?????????title
    private title: string;
    // ??????????????????x?????????
    private xGrowthData = [];
    // ???????????????x?????????
    private xFailureData = [];
    private assetGrowthKeys = {
        GrowthAssetType: 'deviceType',
        GrowthAssetsNumber: 'deviceNum',
        GrowthRate: 'deviceTypeGrowthRate'
    };
    private growthStatic = [];
    private failureStatic = [];
    // ?????????????????????????????????
    private assetTypeData: SelectModel[] = [];
    // ????????????????????????????????????
    private assetGrowthData: SelectModel[] = [];
    // ?????????????????????????????????
    private assetFailureData: SelectModel[] = [];
    // ????????????????????????????????????????????????????????????
    private isDeviceOrEquipment: string = AssetAnalysisAssetDimensionEnum.facility;
    // ??????????????????
    private exportData = {
        assetTypeData: [],
        assetGrowthData: [],
        assetFailureData: []
    };
    // ??????????????????
    private assetsNumberArr: number[] = [];

    constructor(
        public $nzI18n: NzI18nService,
        public $assetAnalysisApiService: AssetAnalysisApiService,
        public $message: FiLinkModalService,
        // ????????????
        private $active: ActivatedRoute,
    ) {
    }

  /**
   * ?????????
   */
  public ngOnInit(): void {
        // ?????????
        this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
        this.assetTypeData = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
        this.assetGrowthData = FacilityForCommonUtil.getRoleFacility(this.$nzI18n).filter(item =>
            [DeviceTypeEnum.wisdom, DeviceTypeEnum.distributionPanel, DeviceTypeEnum.opticalBox, DeviceTypeEnum.well, DeviceTypeEnum.outdoorCabinet].includes(item.code as DeviceTypeEnum));
        this.assetFailureData = FacilityForCommonUtil.getRoleFacility(this.$nzI18n).filter(item => [DeviceTypeEnum.wisdom, DeviceTypeEnum.distributionPanel].includes(item.code as DeviceTypeEnum));
        this.$active.queryParams.subscribe(params => {
          // ???????????????????????????????????????tabIndex????????????2
            if (params.tabIndex === '2') {
                this.selectedIndex = 2;
            }
        });
        this.initTable();
        this.initGrowthRateTable();
        this.initFailureDistributionTable();
    }

    /**
     * ???????????????????????????
     * param event
     */
    public assetRatioFilterConditionEmit(event): void {
        this.queryCondition.filterConditions = event.emitCondition;
        this.queryCondition.sortCondition = new SortCondition();
        // ???????????????????????????????????????key???
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
     * ??????????????????????????????
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
     * ?????????????????????????????????
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
     * ????????????
     */
    public changeGraph(): void {
        if (this.selectedIndex === 1) {
            this.isShowTable = !this.isShowTable;
        } else {
            this.isShowFailureTable = !this.isShowFailureTable;
        }
    }

    /**
     * ????????????
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
     * ??????????????????????????????????????????
     */
    private analysis(assetType): Promise<any> {
        this.isShowStatisticsPart = true;
        this.queryConditions = new QueryConditionModel();
        this.pageBean.pageSize = 5;
        this.pageBean.pageIndex = 1;
        return new Promise((resolve, reject) => {
            // ???????????????????????????????????????????????????
            if (assetType === AssetAnalysisAssetDimensionEnum.facility) {
                this.assetTypeData = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
                this.$assetAnalysisApiService.queryDeviceTypeCountByCondition(this.queryCondition).subscribe((result: ResultModel<AssetTypeDeviceModel[]>) => {
                    if (result.code === ResultCodeEnum.success) {
                        this.dataSet = result.data || [];
                        this.assetsNumberArr = this.dataSet.map(item => item.deviceNum);
                      this.dataSet.forEach((item, index) => {
                        item.iconClass = CommonUtil.getFacilityIConClass(item.deviceType);
                        item.deviceType = CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n, item.deviceType, 'facility.config');
                        // ???????????????????????????html???????????????????????????
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
                // ?????????????????????????????????????????????????????????
                this.$assetAnalysisApiService.queryEquipmentTypeCountByCondition(this.queryCondition).subscribe((result: ResultModel<AssetTypeOrGrowthEquipmentModel[]>) => {
                    if (result.code === ResultCodeEnum.success) {
                        this.dataSet = result.data || [];
                        this.assetsNumberArr = this.dataSet.map(item => item.equipmentNum);
                        this.dataSet.forEach((item, index) => {
                            item.iconClass = CommonUtil.getEquipmentIconClassName(item.equipmentType);
                            item.equipmentType = CommonUtil.codeTranslate(EquipmentTypeEnum, this.$nzI18n, item.equipmentType, 'facility');
                            // ???????????????????????????html???????????????????????????
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
   * ??????????????????????????????
   * @param valueList ??????????????????
   * @param idx ?????????
   * @param precision ???????????????
   */
    private getPercentValue(valueList, idx, precision) {
      // ??????????????????
      if (!valueList[idx]) {
        return 0;
      }
      // ??????
      const sum = valueList.reduce(function (acc, val) {
        return acc + (isNaN(val) ? 0 : val);
      }, 0);
      if (sum === 0) {
        return 0;
      }
      // 10???2?????????100????????????????????????
      const digits = Math.pow(10, precision);
      // ????????????100???
      const votesPerQuota = valueList.map(function (val) {
        return (isNaN(val) ? 0 : val) / sum * digits * 100;
      });
      // ?????????????????????????????????????????????
      const targetSeats = digits * 100;
      // ??????????????????????????????
      const seats = votesPerQuota.map(function (votes) {
        return Math.floor(votes);
      });
      // ??????????????????????????????????????????????????????????????????????????????100%
      let currentSum = seats.reduce(function (acc, val) {
        return acc + val;
      }, 0);
      // ?????????????????????????????????????????????????????????????????????????????????????????????
      const remainder = votesPerQuota.map(function (votes, i) {
        return votes - seats[i];
      });
      // ???????????????????????????1???????????????100%???
      while (currentSum < targetSeats) {
        //  ??????????????????????????????????????????1
        let max = Number.NEGATIVE_INFINITY;
        let maxId = null;
        for (let i = 0, len = remainder.length; i < len; ++i) {
          if (remainder[i] > max) {
            max = remainder[i];
            maxId = i;
          }
        }
        // ?????????????????????1
        ++seats[maxId];
        // ???????????????????????????1???????????????????????????????????????????????????????????????
        remainder[maxId] = 0;
        // ???????????????1?????????????????????????????????????????????????????????
        ++currentSum;
      }
      // ????????????seats?????????????????????100%
      return seats[idx] / digits;
    }
    /**
     * ???????????????????????????????????????????????????????????????
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
                            // ???????????????????????????html???????????????????????????
                            item.typeName = item.deviceType;
                            // ???????????????????????????
                            item.number = item.deviceNum;
                            item.numSearchKey = String(item.deviceNum);
                            item.createTime = item.createTimeStamp;
                            // ?????????????????????????????????????????????????????????0???????????????
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
                            // ???????????????????????????
                            item.number = item.equipmentNum;
                            item.numSearchKey = String(item.equipmentNum);
                            item.createTime = item.createTimeStamp;
                            // ?????????????????????????????????????????????????????????0???????????????
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
     * ????????????????????????????????????????????????
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
     * ???????????????????????????????????????
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
                { // ??????
                    type: 'serial-number',
                    width: 62,
                    title: this.language.serialNumber,
                    fixedStyle: {fixedLeft: true, style: {left: '0px'}},
                },
                { // ????????????
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
                { // ????????????
                    title: this.language.assetAnalysis.assetsNumber, key: this.assetsNumber, width: 150,
                    isShowSort: true,
                    searchable: true,
                    searchKey: 'numSearchKey',
                    searchConfig: {type: 'input'}
                },
                { // ?????????
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
            // ??????
            sort: (event: SortCondition) => {
                this.queryConditions.sortCondition = event;
                this.filter(this.selectedIndex, this.dataSet, this.queryConditions, this.pageBean);
            },
            // ??????
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
            // ??????
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
                // ????????????
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
     * ??????????????????????????????????????????
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
                { // ??????
                    type: 'serial-number',
                    width: 62,
                    title: this.language.serialNumber,
                    fixedStyle: {fixedLeft: true, style: {left: '0px'}},
                },
                { // ??????
                    title: this.language.time, key: 'createTime', width: 150,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: {type: 'input'},
                },
                { // ????????????
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
                { // ????????????
                    title: this.language.assetAnalysis.assetsNumber, key: this.assetGrowthKeys.GrowthAssetsNumber, width: 150,
                    isShowSort: true,
                    searchable: true,
                    searchKey: 'numSearchKey',
                    searchConfig: {type: 'input'}
                },
                { // ?????????
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
                    // ??????????????????
                    text: this.language.assetAnalysis.chartSwitching,
                    iconClassName: 'fiLink-analysis',
                    handle: () => {
                        this.changeGraph();
                    }
                }
            ],
            // ??????
            sort: (event: SortCondition) => {
                this.growthQueryConditions.sortCondition = event;
                if ((event.sortField === this.assetGrowthKeys.GrowthAssetType && event.sortRule === TableSortConfig.DESC) || event.sortField === 'growthRateSortKey') {
                    this.handleSort(event, this.growthQueryConditions);
                } else {
                    this.filter(this.selectedIndex, this.growthDataSet, this.growthQueryConditions, this.growthPageBean);
                }
            },
            // ??????
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
            // ??????
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
                // ????????????????????????
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
     * ?????????????????????????????????????????????
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
                { // ??????
                    type: 'serial-number',
                    width: 62,
                    title: this.language.serialNumber,
                    fixedStyle: {fixedLeft: true, style: {left: '0px'}},
                },
                { // ??????id?????????????????????????????????????????????????????????????????????
                    title: '', key: 'productId', width: 150,
                    isShowSort: true,
                    searchable: true,
                    hidden: true,
                    searchConfig: {type: 'input'}
                },
                { // ??????
                    title: this.language.time, key: 'createTime', width: 150,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: {type: 'input'},
                    fixedStyle: {fixedLeft: true, style: {left: '62px'}},
                },
                { // ????????????
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
                { // ????????????
                    title: this.language.assetAnalysis.productModel, key: 'productModel', width: 150,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: {type: 'input'}
                },
                { // ?????????
                    title: this.language.assetAnalysis.supplier, key: 'supplierName', width: 150,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: {type: 'input'}
                },
                { // ????????????
                    title: this.language.assetAnalysis.softwareVersion, key: 'softwareVersion', width: 150,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: {type: 'input'}
                },
                { // ????????????
                    title: this.language.assetAnalysis.hardwareVersion, key: 'hardwareVersion', width: 150,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: {type: 'input'}
                },
                { // ?????????
                    title: this.language.assetAnalysis.failuresNumber, key: 'troubleNum', width: 150,
                    isShowSort: true,
                    searchable: true,
                    searchKey: 'numSearchKey',
                    searchConfig: {type: 'input'}
                },
                { // ???????????????
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
                    // ??????????????????
                    text: this.language.assetAnalysis.chartSwitching,
                    iconClassName: 'fiLink-analysis',
                    handle: () => {
                        this.changeGraph();
                    }
                }
            ],
            // ??????
            sort: (event: SortCondition) => {
                this.failureQueryConditions.sortCondition = event;
                if ((event.sortField === 'typeName' && event.sortRule === TableSortConfig.DESC) || event.sortField === 'failureRateSortKey') {
                    this.handleSort(event, this.failureQueryConditions);
                } else {
                    this.filter(this.selectedIndex, this.failureDataSet, this.failureQueryConditions, this.failurePageBean);
                }
            },
            // // ??????
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
            // ??????
            handleExport: (event) => {
                let failureTableData: any[];
                let requestUrl;
                failureTableData = this.exportData.assetFailureData.map(item => {
                    const {createTime, typeName, productModel, supplierName, softwareVersion, hardwareVersion, troubleNum, troubleGrowthRate} = item;
                    return {
                        createTime, typeName, productModel, supplierName, softwareVersion, hardwareVersion, troubleNum, troubleGrowthRate
                    };
                });
                // ????????????????????????
                const body = this.handleExportData(event, failureTableData);
                requestUrl = this.$assetAnalysisApiService.exportProductTroubleGrowthRate(body);
                this.exportInterface(requestUrl);
            }
        };
    }

    private filter(index, data, filterCondition, pageBean): any {
        // ????????????
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
        // ????????????
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
     * ??????????????????????????????????????????????????????
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
     * ????????????????????????????????????????????????????????????
     */
    private handleTime(growthType, dataSet): any[] {
        switch (growthType) {
            case AssetAnalysisGrowthRateEnum.monthlyGrowth :
                dataSet.forEach(data => {
                    if (JSON.parse(localStorage.getItem('localLanguage')) === 'EN') {
                        // ????????????????????? ????????????yyyy-MM
                        data.createTime = (CommonUtil.dateFmt(`yyyy-MM`, new Date(data.createTime)));
                    } else {
                        data.createTime = (CommonUtil.dateFmt('yyyy???MM???', new Date(data.createTime)));
                    }
                });
                break;
            case AssetAnalysisGrowthRateEnum.annualGrowth :
                dataSet.forEach(data => {
                    if (JSON.parse(localStorage.getItem('localLanguage')) === 'EN') {
                        // ????????????????????? ????????????yyyy
                        data.createTime = (CommonUtil.dateFmt(`yyyy`, new Date(data.createTime)));
                    } else {
                        data.createTime = (CommonUtil.dateFmt('yyyy???', new Date(data.createTime)));
                    }
                });
                break;
            case AssetAnalysisGrowthRateEnum.dailyGrowth :
                dataSet.forEach(data => {
                    if (JSON.parse(localStorage.getItem('localLanguage')) === 'EN') {
                        // ????????????????????? ????????????yyyy-MM-dd
                        data.createTime = (CommonUtil.dateFmt(`yyyy-MM-dd`, new Date(data.createTime)));
                    } else {
                        data.createTime = (CommonUtil.dateFmt('yyyy???MM???dd???', new Date(data.createTime)));
                    }
                });
                break;
        }
        return dataSet;
    }

    /**
     * ????????????????????????????????????
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
     * ??????????????????????????????????????????
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
     * ?????????????????????
     */
    private handleExportData(event, data): any {
        const body = {
            queryCondition: new QueryConditionModel(),
            // ?????????
            columnInfoList: event.columnInfoList,
            // ??????????????????
            excelType: event.excelType,
            // ??????????????????
            objectList: data
        };
        return body;
    }

    /**
     * ????????????????????????
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
     * ??????????????????????????????????????????????????????????????????
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
