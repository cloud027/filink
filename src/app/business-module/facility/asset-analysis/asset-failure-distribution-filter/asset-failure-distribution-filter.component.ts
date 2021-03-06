import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {DeviceSortEnum, DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {AssetAnalysisStatisticalDimensionEnum} from '../../share/enum/asset-analysis-statistical-dimension.enum';
import {AssetAnalysisGrowthRateEnum} from '../../share/enum/asset-analysis-growth-rate.enum';
import {TimerSelectorService} from '../../../../shared-module/service/time-selector/timer-selector.service';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {AreaModel} from '../../../../core-module/model/facility/area.model';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {ProductTypeEnum, ProductUnitEnum} from '../../../../core-module/enum/product/product.enum';
import {ProductForCommonService} from '../../../../core-module/api-service/product/product-for-common.service';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {ProductLanguageInterface} from '../../../../../assets/i18n/product/product.language.interface';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {PageModel} from '../../../../shared-module/model/page.model';
import * as _ from 'lodash';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {PlanProjectLanguageInterface} from '../../../../../assets/i18n/plan-project/plan-project.language.interface';
import {AssetAnalysisAssetDimensionEnum} from '../../share/enum/asset-analysis-asset-dimension.enum';
import {differenceInCalendarDays} from 'date-fns';
import {AssetAnalysisConfig} from '../../share/config/asset-analysis-config';
import {ProductInfoModel} from '../../../../core-module/model/product/product-info.model';
import {SelectModel} from '../../../../shared-module/model/select.model';
import {AssetAnalysisUtil} from '../../share/util/asset-analysis.util';

/**
 * ????????????-????????????????????????
 */
@Component({
    selector: 'app-asset-failure-distribution-filter',
    templateUrl: './asset-failure-distribution-filter.component.html',
    styleUrls: ['./asset-failure-distribution-filter.component.scss']
})
export class AssetFailureDistributionFilterComponent implements OnInit, OnChanges {
    // ????????????tab???
    @Input() public selectedIndex = 0;
    // ??????????????????????????????
    @Output() public assetFailureDistributionFilterConditionEmit = new EventEmitter<any>();
    // ????????????????????????
    @ViewChild('selectAssetType') public selectAssetType: TemplateRef<HTMLDocument>;
    // ??????????????????
    @ViewChild('AreaSelectRef') public AreaSelectRef: TemplateRef<HTMLDocument>;
    // ??????????????????
    @ViewChild('ProjectSelectRef') public ProjectSelectRef: TemplateRef<HTMLDocument>;
    // ??????????????????
    @ViewChild('chooseTypeRef') public chooseTypeRef: TemplateRef<HTMLDocument>;
    // ??????????????????????????????
    @ViewChild('SelectTime') public SelectTime: TemplateRef<HTMLDocument>;
    // ??????????????????????????????
    @ViewChild('dailySelectTime') public dailySelectTime: TemplateRef<HTMLDocument>;
    // ??????????????????????????????
    @ViewChild('yearSelectTime') public yearSelectTime: TemplateRef<HTMLDocument>;
    // ????????????
    @ViewChild('buttonTemplate') public buttonTemplate: TemplateRef<HTMLDocument>;
    //  ??????????????????
    @ViewChild('productTypeTemplate') public productTypeTemplate: TemplateRef<HTMLDocument>;
    // ??????????????????
    @ViewChild('productListTable') public productListTable: TableComponent;
    // ????????????????????????
    @ViewChild('unitTemplate') public unitTemplate: TemplateRef<HTMLDocument>;
    // ???????????????
    public language: FacilityLanguageInterface;
    // ????????????????????????
    public commonLanguage: CommonLanguageInterface;
    // ?????????????????????
    public projectLanguage: PlanProjectLanguageInterface;
    // ???????????????
    public languageEnum = LanguageEnum;
    public productLanguage: ProductLanguageInterface;
    // ?????????????????????????????????
    public assetTypeData: SelectModel[] = [];
    // ????????????????????????????????????
    public assetTypeSelectData: string[] = [];
    // ?????????????????????????????????code?????????
    public assetTypeCodeList: any[] = [];
    // ??????????????????
    public deviceTypeEnum = DeviceTypeEnum;
    // ??????????????????
    public productTypeEnum = ProductTypeEnum;
    // ????????????????????????
    public productUnitEnum = ProductUnitEnum;
    // ??????????????????
    public equipmentTypeEnum = EquipmentTypeEnum;
    // form????????????
    public formColumn: FormItem[] = [];
    // ???????????????
    public treeSelectorConfig: TreeSelectorConfigModel;
    // ????????????????????????
    public tableConfig: TableConfigModel = new TableConfigModel();
    // ???????????????
    public treeNodes: AreaModel[] = [];
    // ????????????
    public areaName: string = '';
    // ??????id??????
    public selectProductIds: string[] = [];
    // ????????????
    public productName: string = '';
    // ???????????????????????????
    public isVisible: boolean = false;
    // ??????id??????
    public selectAreaIds: string[] = [];
    // ????????????????????????
    public isShowProjectList: boolean = false;
    // ????????????id??????
    public selectProjectIds: string[] = [];
    // ???????????????????????????
    public projectName: string = '';
    // ????????????????????????
    public selectData: any[] = [];
    // ????????????????????????
    public formStatus: FormOperate;
    // ??????????????????????????????
    public isClick: boolean = false;
    // ????????????????????????
    public queryCondition: QueryConditionModel = new QueryConditionModel();
    // ??????
    public pageBean: PageModel = new PageModel(5, 1, 1);
    // ?????????????????????
    public filterCondition: any;
    // ???????????????????????????
    public date: Date[] = [];
    // ????????????????????????
    public isShow: boolean = false;
    public _dataSet: ProductInfoModel[] = [];
    public selectProductInformation: ProductInfoModel[] = [];
    // ????????????????????????
    private projectNameList: string[] = [];
    // ???????????????????????????tab???
    private isFirstClick: boolean = true;
    // ????????????????????????
    private formDefaultValue = {
        // ???????????????????????????
        assetDimension: AssetAnalysisAssetDimensionEnum.facility,
        // ??????????????????????????????
        assetType: [],
        // ???????????????????????????
        statisticalDimension: AssetAnalysisStatisticalDimensionEnum.area,
        selectAreaOrProject: [],
        // ???????????????????????????
        growthRate: AssetAnalysisGrowthRateEnum.monthlyGrowth,
    };
    // ????????????????????????
    private allAreaIdList = [];
    // ??????????????????????????????
    private allAreaName: string;
    // ???????????????????????????5?????????id
    private defaultProductIds: string[] = [];
    // ???????????????????????????5????????????????????????
    private defaultProductName: string;
    private productParameterName: string;
    private statisticalDimensionParamName: string;
    private assetDimensionParamName: string;

    constructor(
        public $nzI18n: NzI18nService,
        // ??????????????????
        public $facilityCommonService: FacilityForCommonService,
        private $message: FiLinkModalService,
        private $timerSelectorService: TimerSelectorService,
        private $productCommonService: ProductForCommonService,
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        // ??????????????????????????????tab?????????????????????????????????????????????????????????
        if (changes.selectedIndex.currentValue === 2 && this.isFirstClick) {
            this.isFirstClick = false;
            this.assetTypeData = FacilityForCommonUtil.getRoleFacility(this.$nzI18n).filter(item => [DeviceTypeEnum.wisdom, DeviceTypeEnum.distributionPanel].includes(item.code as DeviceTypeEnum));
            this.assetTypeCodeList = this.assetTypeData.map(item => {
                return item.code;
            });
            if (this.assetTypeCodeList.length) {
                if (this.assetTypeCodeList.includes(DeviceSortEnum.pole)) {
                    this.assetTypeSelectData = [DeviceSortEnum.pole];
                } else {
                    this.assetTypeSelectData = [this.assetTypeCodeList[0]];
                }
                this.queryCondition.pageCondition.pageSize = 5;
                Promise.all([this.getAreaTreeData(), this.queryProductList(true)]).then(() => {
                    this.initColumn();
                }).catch(() => {
                    this.initColumn();
                });
            } else {
                this.getAreaTreeData().then(() => {
                    this.initColumn();
                }, () => {
                    this.initColumn();
                }).catch(() => {
                    this.initColumn();
                });
            }
            this.initTableConfig();
        }
    }

    ngOnInit() {
        // ?????????
        this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
        this.productLanguage = this.$nzI18n.getLocaleData(LanguageEnum.product);
        this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
        this.projectLanguage = this.$nzI18n.getLocaleData(LanguageEnum.planProject);
        AssetAnalysisUtil.initTreeSelectorConfig(this);
        this.initTableConfig();
    }

    /**
     * ????????????????????????
     */
    public getAreaTreeData(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.$facilityCommonService.queryAreaList().subscribe((result: ResultModel<AreaModel[]>) => {
                if (result.code === ResultCodeEnum.success) {
                    AssetAnalysisUtil.selectAllArea(result.data, this);
                    this.treeNodes = result.data || [];
                    // ?????????????????????????????????
                    this.setAreaSelectAll(this.treeNodes);
                    AssetAnalysisUtil.addName(this.treeNodes);
                    this.treeSelectorConfig.treeNodes = this.treeNodes;
                    resolve();
                } else {
                    this.$message.error(result.msg);
                    reject();
                }
            }, () => {
                reject();
            });
        });

    }

    /**
     * ????????????modal
     */
    public showProductSelectorModal(): void {
        this.isShow = true;
        if (this.assetTypeSelectData.length) {
            this.productListTable.keepSelectedData.clear();
            this.selectProductInformation.forEach(item => {
                this.productListTable.keepSelectedData.set(item[this.tableConfig.selectedIdKey], item);
            });
            this.queryProductList().then();
        }
    }


    /**
     * ??????????????????
     * param event
     */
    public formInstance(event: { instance: FormOperate }): void {
        if (!this.formColumn.length) {
            return;
        }
        this.formStatus = event.instance;
        this.formStatus.group.statusChanges.subscribe(() => {
            this.isClick = !this.formStatus.getValid();
        });
        this.formStatus.resetData(this.formDefaultValue);
        this.formStatus.resetControlData('assetType', this.assetTypeSelectData);
        this.formStatus.resetControlData('chooseType', this.defaultProductIds);
        this.formStatus.resetControlData('selectAreaOrProject', this.allAreaIdList);
        this.formStatus.resetControlData('selectTime', this.date);
        this.formStatus.resetControlData('operation', 'button');
        // ????????????????????????????????????????????????
        if (this.formStatus.getValid()) {
            this.assetFailureDistributionAnalysis();
        }
    }

    /**
     * ????????????????????????
     */
    public showAreaSelect(): void {
        this.isVisible = true;
    }

    /**
     * ??????????????????????????????
     */
    public showProjectSelect(): void {
        this.isShowProjectList = true;
    }

    /**
     * ???????????????????????????
     */
    public selectDataChange(event) {
        this.selectAreaIds = [];
        const arr = [];
        if (event.length > 0) {
            event.forEach(item => {
                this.selectAreaIds.push(item.areaId);
                arr.push(item.areaName);
            });
            this.formStatus.resetControlData('selectAreaOrProject', this.selectAreaIds);
        } else {
            this.selectAreaIds = arr;
            this.formStatus.resetControlData('selectAreaOrProject', null);
        }
        FacilityForCommonUtil.setAreaNodesMultiStatus(this.treeNodes, this.selectAreaIds);
        this.areaName = arr.toString();
    }

    /**
     * ?????????????????????
     * param data
     */
    public projectSelectChange(data): void {
        this.selectProjectIds = [];
        this.projectNameList = [];
        this.selectData = data;
        data.forEach(item => {
            this.projectNameList.push(item.projectName);
            this.selectProjectIds.push(item.projectId);
        });
        this.projectName = this.projectNameList.toString();
        this.formStatus.resetControlData('selectAreaOrProject', this.selectProjectIds);
    }

    public assetFailureDistributionAnalysis(): void {
        const data = this.formStatus.getData();
        if (data.assetDimension === AssetAnalysisAssetDimensionEnum.facility) {
            this.assetDimensionParamName = data.assetDimension;
            this.productParameterName = 'deviceProductId';
            if (data.statisticalDimension === AssetAnalysisStatisticalDimensionEnum.area) {
                this.statisticalDimensionParamName = 'deviceAreaId';
            } else {
                this.statisticalDimensionParamName = 'deviceProjectId';
            }
        } else {
            this.assetDimensionParamName = 'equipment.equipmentType';
            this.productParameterName = 'equipment.equipmentProductId';
            this.statisticalDimensionParamName = 'equipment.equipmentAreaId';
        }
        const queryConditions = new QueryConditionModel();
        queryConditions.filterConditions = [{
            filterField: this.assetDimensionParamName,
            operator: 'in',
            filterValue: data.assetType
        },
            {
                filterField: 'createTime',
                operator: 'gte',
                filterValue: data.selectTime[0].getTime()
            },
            {
                filterField: 'createTime',
                operator: 'lte',
                filterValue: data.selectTime[1].getTime()
            },
            {
                filterField: this.statisticalDimensionParamName,
                operator: 'in',
                filterValue: data.selectAreaOrProject
            },
            {
                filterField: this.productParameterName,
                operator: 'in',
                filterValue: data.chooseType
            }];
        queryConditions.bizCondition = {
            growthRateDimension: data.growthRate
        };
        this.filterCondition = {
            assetType: data.assetDimension,
            GrowthEmitCondition: queryConditions,
            selectProductInformation: this.selectProductInformation,
        };
        this.assetFailureDistributionFilterConditionEmit.emit(this.filterCondition);
    }

    /**
     * ?????????????????????????????????
     */
    public reset(): void {
        this.formStatus.resetData(this.formDefaultValue);
        this.assetTypeSelectData = [];
        if (this.assetTypeCodeList.length) {
            if (this.assetTypeCodeList.includes(DeviceSortEnum.pole)) {
                this.assetTypeSelectData = [DeviceSortEnum.pole];
            } else {
                this.assetTypeSelectData = [this.assetTypeCodeList[0]];
            }
        }
        this.formStatus.resetControlData('assetType', this.assetTypeSelectData);
        this.productListTable.keepSelectedData.clear();
        this.initTableConfig();
        this.queryCondition = new QueryConditionModel();
        this.queryCondition.pageCondition.pageSize = 5;
        this.selectProductIds = [];
        this.queryProductList(true).then();
        this.selectAreaIds = this.allAreaIdList;
        this.setAreaSelectAll(this.treeNodes);
        const date = this.$timerSelectorService.getYearRange();
        this.date = [new Date(_.first(date)), new Date()];
        this.formStatus.resetControlData('chooseType', this.defaultProductIds);
        this.formStatus.resetControlData('selectAreaOrProject', this.allAreaIdList);
        this.formStatus.resetControlData('selectTime', this.date);
        this.formStatus.resetControlData('operation', 'button');
        this.areaName = this.allAreaName;
        this.productName = this.defaultProductName;
        if (this.formStatus.getValid()) {
            this.assetFailureDistributionAnalysis();
        }
    }

    /**
     * ????????????????????????????????????????????????
     * param nodes
     */
    public setAreaSelectAll(nodes: AreaModel[]): void {
        nodes.forEach(item => {
            item.checked = true;
            if (item.children && item.children.length) {
                this.setAreaSelectAll(item.children);
            }
        });
    }

    /**
     * ???????????????????????????????????????
     */
    public onChangeAssetType(event: string[]): void {
        if (event.length > 5) {
            this.$message.info(this.language.assetAnalysis.selectAssetTypeNumTip);
            event = event.slice(0, 5);
        }
        setTimeout(() => {
            this.assetTypeSelectData = event;
            this.selectProductIds = [];
            this.selectProductInformation = [];
            this.productName = '';
            this.formStatus.resetControlData('chooseType', this.selectProductIds);
            this.productListTable.keepSelectedData.clear();
            // ???????????????????????????????????????????????????
            this.queryCondition.filterConditions = [{
                filterValue: this.assetTypeSelectData,
                filterField: 'typeCode',
                operator: 'in'
            }];
            this.queryCondition.pageCondition.pageNum = 1;
            this.initTableConfig();
        });
        if (event.length) {
            this.formStatus.resetControlData('assetType', event);
        } else {
            this._dataSet = [];
            this.formStatus.resetControlData('assetType', null);
        }
    }

    /**
     * ???????????????????????????
     */
    public onChange(event): void {
        // ????????????????????????????????????????????????????????????????????????????????????????????????
        if (event && this.date[0] && this.date[1] && this.date[0].getTime() < this.date[1].getTime()) {
            // ?????????????????????????????????????????????0???0???0????????????????????????????????????23???59???59???
            this.date[1] = new Date(CommonUtil.dateFmt('yyyy/MM/dd 23:59:59', this.date[1]));
            this.formStatus.resetControlData('selectTime', this.date);
        } else {
            this.formStatus.resetControlData('selectTime', []);
        }
    }

    /**
     * ????????????????????????????????????
     */
    public handleCancel(): void {
        this.isShow = false;
    }

    /**
     *????????????????????????????????????
     */
    public handleOk(): void {
        this.isShow = false;
        this.selectProductInformation = this.productListTable.getDataChecked();
        this.productName = this.selectProductInformation.map(item => item.productModel).join(',');
        this.selectProductIds = this.selectProductInformation.map(item => item.productId);
        if (this.formStatus) {
            this.formStatus.resetControlData('chooseType', this.selectProductIds);
        }
    }

    /**
     * ????????????????????????
     */
    public clearAll(): void {
        this.selectProductIds = [];
        this.productListTable.keepSelectedData.clear();
        this._dataSet.forEach(item => {
            item.checked = false;
        });
        this.productListTable.checkStatus();
    }

    /**
     * ????????????????????????
     * @param event PageModel
     */
    public productPageChange(event: PageModel): void {
        this.queryCondition.pageCondition.pageNum = event.pageIndex;
        this.queryCondition.pageCondition.pageSize = event.pageSize;
        this.queryProductList().then();
    }

    /**
     * ????????????
     * param {Date} current
     * returns {boolean}
     */
    public disabledEndDate = (current: Date): boolean => {
        const nowTime = new Date();
        return differenceInCalendarDays(current, nowTime) > 0;
    }

    /**
     * ????????????
     */
    private initColumn(): void {
        this.formColumn = [
            // ????????????
            {
                label: this.language.assetAnalysis.assetDimension,
                key: 'assetDimension',
                type: 'select',
                col: 8,
                require: true,
                disabled: false,
                rule: [{required: true}],
                initialValue: AssetAnalysisAssetDimensionEnum.facility,
                selectInfo: {
                    data: CommonUtil.codeTranslate(AssetAnalysisAssetDimensionEnum, this.$nzI18n, null, `${LanguageEnum.facility}.assetAnalysis`),
                    label: 'label',
                    value: 'code'
                },
                modelChange: (controls, $event) => {
                    const assetTypeColumn = this.formColumn.find(item => item.key === 'assetType');
                    const statisticalDimensionColumn = this.formColumn.find(item => item.key === 'statisticalDimension');
                    if ($event === AssetAnalysisAssetDimensionEnum.facility) {
                        if (assetTypeColumn && statisticalDimensionColumn) {
                            this.formStatus.resetControlData('assetType', null);
                            this.assetTypeData = FacilityForCommonUtil.getRoleFacility(this.$nzI18n).filter(item =>
                            [DeviceTypeEnum.wisdom, DeviceTypeEnum.distributionPanel].includes(item.code as DeviceTypeEnum));
                            this.assetTypeSelectData = [];
                            statisticalDimensionColumn.selectInfo.data = CommonUtil.codeTranslate(AssetAnalysisStatisticalDimensionEnum, this.$nzI18n, null, `${LanguageEnum.facility}.assetAnalysis`);
                        }
                    } else {
                        if (assetTypeColumn && statisticalDimensionColumn) {
                            this.formStatus.resetControlData('assetType', null);
                            this.formStatus.resetControlData('statisticalDimension', AssetAnalysisStatisticalDimensionEnum.area);
                            this.assetTypeData = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n).filter(item => item.label !== this.language.intelligentEntranceGuardLock);
                            this.assetTypeSelectData = [];
                            statisticalDimensionColumn.selectInfo.data.splice(1, 1);
                        }
                    }
                }
            },
            // ????????????
            {
                label: this.language.assetAnalysis.assetCategory,
                key: 'assetType',
                type: 'custom',
                col: 8,
                require: true,
                disabled: false,
                rule: [{required: true}],
                template: this.selectAssetType,
            },
            // ????????????
            {
                label: this.language.assetAnalysis.chooseType,
                key: 'chooseType',
                type: 'custom',
                col: 8,
                require: true,
                disabled: false,
                rule: [{required: true}],
                template: this.chooseTypeRef,
            },
            // ????????????
            {
                label: this.language.assetAnalysis.statisticalDimension,
                key: 'statisticalDimension',
                type: 'select',
                col: 8,
                require: true,
                disabled: false,
                rule: [{required: true}],
                initialValue: AssetAnalysisStatisticalDimensionEnum.area,
                selectInfo: {
                    data: CommonUtil.codeTranslate(AssetAnalysisStatisticalDimensionEnum, this.$nzI18n, null, `${LanguageEnum.facility}.assetAnalysis`),
                    label: 'label',
                    value: 'code'
                },
                modelChange: (controls, $event) => {
                    const selectAreaOrProjectColumn = this.formColumn.find(item => item.key === 'selectAreaOrProject');
                    if (selectAreaOrProjectColumn) {
                        if ($event === AssetAnalysisStatisticalDimensionEnum.area) {
                            selectAreaOrProjectColumn.label = this.language.assetAnalysis.selectArea;
                            selectAreaOrProjectColumn.template = this.AreaSelectRef;
                            this.formStatus.resetControlData('selectAreaOrProject', this.selectAreaIds);
                        } else {
                            selectAreaOrProjectColumn.label = this.language.assetAnalysis.selectProject;
                            selectAreaOrProjectColumn.template = this.ProjectSelectRef;
                            this.formStatus.resetControlData('selectAreaOrProject', this.selectProjectIds);
                        }
                    }
                }
            },
            // ????????????
            {
                label: this.language.assetAnalysis.selectArea,
                key: 'selectAreaOrProject',
                type: 'custom',
                col: 8,
                require: true,
                disabled: false,
                rule: [{required: true}],
                template: this.AreaSelectRef,
            },
            // ???????????????
            {
                label: this.language.assetAnalysis.growthRate,
                key: 'growthRate',
                type: 'select',
                col: 8,
                require: true,
                disabled: false,
                rule: [{required: true}],
                initialValue: AssetAnalysisGrowthRateEnum.monthlyGrowth,
                selectInfo: {
                    data: CommonUtil.codeTranslate(AssetAnalysisGrowthRateEnum, this.$nzI18n, null, `${LanguageEnum.facility}.assetAnalysis`),
                    label: 'label',
                    value: 'code'
                },
                modelChange: (controls, $event) => {
                    const selectTimeColumn = this.formColumn.find(item => item.key === 'selectTime');
                    if (selectTimeColumn) {
                        if ($event === AssetAnalysisGrowthRateEnum.dailyGrowth) {
                            selectTimeColumn.template = this.dailySelectTime;
                            const dates = this.$timerSelectorService.getMonthRange();
                            this.date = [new Date(_.first(dates)), new Date()];
                            this.formStatus.resetControlData('selectTime', this.date);
                        } else if ($event === AssetAnalysisGrowthRateEnum.monthlyGrowth) {
                            selectTimeColumn.template = this.SelectTime;
                            const dates = this.$timerSelectorService.getYearRange();
                            this.date = [new Date(_.first(dates)), new Date()];
                            this.formStatus.resetControlData('selectTime', this.date);
                        } else {
                            selectTimeColumn.template = this.yearSelectTime;
                            this.date = [];
                        }
                        this.formStatus.resetControlData('selectTime', this.date);
                    }
                }

            },
            // ????????????
            {
                label: this.language.assetAnalysis.selectTime,
                key: 'selectTime',
                type: 'custom',
                col: 8,
                require: true,
                disabled: false,
                rule: [{required: true}],
                template: this.SelectTime,
            },
            // ?????????????????????
            {
                label: '',
                key: 'operation',
                type: 'custom',
                col: 8,
                require: false,
                disabled: false,
                rule: [{required: true}],
                template: this.buttonTemplate,
            }
        ];
        // ???????????????
        const date = this.$timerSelectorService.getYearRange();
        this.date = [new Date(_.first(date)), new Date()];
    }

    private initTableConfig(): void {
        if (!_.isEmpty(this.selectProductIds)) {
            this.productListTable.checkAll(false);
        }
        this.tableConfig = {
            isDraggable: true,
            isLoading: false,
            outHeight: 108,
            showRowSelection: false,
            pageSizeOptions: [5, 10, 20, 30, 40],
            keepSelected: true,
            selectedIdKey: 'productId',
            showSizeChanger: true,
            notShowPrint: true,
            showSearchSwitch: true,
            showPagination: true,
            scroll: {x: '800px', y: '340px'},
            noIndex: true,
            columnConfig: AssetAnalysisConfig.productTableConfig(this.productLanguage, this.productTypeTemplate, this.unitTemplate, this.assetTypeSelectData, this.assetTypeData, this.$nzI18n),
            sort: (event: SortCondition) => {
                this.queryCondition.sortCondition = event;
                this.queryProductList().then();
            },
            handleSearch: (event: FilterCondition[]) => {
                event.forEach(item => {
                    if (item.filterField === 'scrapTime') {
                        item.operator = 'eq';
                    }
                });
                this.queryCondition.filterConditions = event;
                this.queryCondition.pageCondition.pageNum = 1;
                this.queryProductList().then();
            },
            handleSelect: (event: any[], data) => {
                if (!event.length) {
                    return;
                }
                // ??????????????????5?????????
                if (event.length > 5) {
                    this.$message.info(this.language.assetAnalysis.selectProductNumTip);
                    setTimeout(() => {
                        if (data) {
                            data.checked = false;
                            this.productListTable.collectSelectedId(data.checked, data);
                            this.productListTable.updateSelectedData();
                        } else {
                            event.forEach((item, index) => {
                                if (index > 4) {
                                    item.checked = false;
                                    this.productListTable.collectSelectedId(item.checked, item);
                                    this.productListTable.updateSelectedData();
                                }
                            });
                        }
                        this.productListTable.checkStatus();
                    });

                }
            }
        };
    }

    /**
     * ??????????????????
     */
    private queryProductList(isTypeChange?: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            this.tableConfig.isLoading = true;
            if (!this.queryCondition.filterConditions.some(item => item.filterField === 'typeCode')) {
                this.queryCondition.filterConditions.push({
                    filterValue: this.assetTypeSelectData,
                    filterField: 'typeCode',
                    operator: 'in'
                });
            }
            this.$productCommonService.queryProductList(this.queryCondition).subscribe((res: ResultModel<ProductInfoModel[]>) => {
                if (res.code === ResultCodeEnum.success) {
                    this._dataSet = res.data || [];
                    this.pageBean.pageIndex = res.pageNum;
                    this.pageBean.Total = res.totalCount;
                    this.pageBean.pageSize = res.size;
                    this.tableConfig.isLoading = false;
                    // ??????????????????????????????
                    if (!_.isEmpty(this._dataSet)) {
                        // ?????????????????????5????????????????????????
                        const defaultProductNameList = [];
                        this._dataSet.forEach((item, index) => {
                            // ?????????????????????5?????????
                            if (!this.selectProductIds.length && index < 5 && isTypeChange) {
                                item.checked = true;
                                this.productListTable.collectSelectedId(item.checked, item);
                                this.productListTable.updateSelectedData();
                                defaultProductNameList.push(item.productModel);
                                this.defaultProductIds.push(item.productId);
                                this.defaultProductName = defaultProductNameList.toString();
                                this.productName = defaultProductNameList.toString();
                                this.selectProductInformation.push(item);
                            }
                            if (String(item.typeFlag) === String(ProductTypeEnum.facility)) {
                                item.iconClass = CommonUtil.getFacilityIConClass(item.typeCode);
                            } else {
                                item.iconClass = CommonUtil.getEquipmentTypeIcon(item as any);
                            }
                        });
                    }
                    resolve();
                } else {
                    this.tableConfig.isLoading = false;
                    reject();
                }
            }, () => {
                this.tableConfig.isLoading = false;
                reject();
            });
        });
    }
}
