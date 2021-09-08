import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NzI18nService, NzMessageService } from 'ng-zorro-antd';
import _ from 'lodash';

import { TableConfigModel } from '../../../shared-module/model/table-config.model';
import { PageModel } from '../../../shared-module/model/page.model';

import { EnergyLanguageInterface } from '../../../../assets/i18n/energy/energy.language.interface';
import { LanguageEnum } from '../../../shared-module/enum/language.enum';

import { CommonLanguageInterface } from '../../../../assets/i18n/common/common.language.interface';


import {
    FilterCondition,
    QueryConditionModel,
    SortCondition,
} from '../../../shared-module/model/query-condition.model';

import { ExportRequestModel } from '../../../shared-module/model/export-request.model';
import { OperatorEnum } from '../../../shared-module/enum/operator.enum';
import { EquipmentTypeEnum } from '../../../core-module/enum/equipment/equipment.enum';
import { DeviceTypeEnum } from '../../../core-module/enum/facility/facility.enum';
import { FacilityListModel } from '../../../core-module/model/facility/facility-list.model';
import { EquipmentListModel } from '../../../core-module/model/equipment/equipment-list.model';
import { LoopListModel } from '../../../core-module/model/loop/loop-list.model';
import { FacilityApiService } from '../../facility/share/service/facility/facility-api.service';
import { ResultCodeEnum } from '../../../shared-module/enum/result-code.enum';
import { EnergyApiService } from '../share/service/energy/energy-api.service';
import { CommonUtil } from '../../../shared-module/util/common-util';
import { ResultModel } from '../../../shared-module/model/result.model';
import { EnergyUtilService } from '../share/service/energy/energy-util.service';
import { ProjectTypeEnmu } from '../share/enum/project.enum';
import { switchPageEnum, EnergyInsertCollectionTypeEnum } from '../share/enum/energy-config.enum';
import { FacilityForCommonUtil } from '../../../core-module/business-util/facility/facility-for-common.util';
import { ProjectSelectorConfigModel } from '../../../shared-module/model/project-selector-config.model';


@Component({
    selector: 'app-energy-timedata',
    templateUrl: './energy-timedata.component.html',
    styleUrls: ['./energy-timedata.component.scss'],
})
export class EnergyTimedataComponent implements OnInit {
    // 设施类型模板
    @ViewChild('equipmentTypeTemplate') equipmentTypeTemp: TemplateRef<HTMLDocument>;
    // 设施状态
    @ViewChild('deviceStatusTemp') deviceStatusTemp: TemplateRef<HTMLDocument>;
    // 项目
    @ViewChild('projectFilterTemp') projectFilterTemp: TemplateRef<HTMLDocument>;
    // 采集设施
    @ViewChild('collentionDeviceRenderTemplate')
    public collentionDeviceRenderTemplate: TemplateRef<any>;
    // 采集设备
    @ViewChild('collentionEquipmentRenderTemplate')
    public collentionEquipmentRenderTemplate: TemplateRef<any>;
    // 采集回路
    @ViewChild('collentionLoopRenderTemplate') public collentionLoopRenderTemplate: TemplateRef<any>;
    // 设施过滤模版
    @ViewChild('facilityTemplate') deviceFilterTemplate: TemplateRef<HTMLDocument>;
    // 设备过滤模版
    @ViewChild('equipmentTemplate') equipmentTemplate: TemplateRef<HTMLDocument>;
    // 回路过滤模版
    @ViewChild('loopTemplate') loopTemplate: TemplateRef<HTMLDocument>;

    // 采集时段
    @ViewChild('collectionPeriod') public collectionPeriodTemp: TemplateRef<HTMLDocument>;
    // 配置范围
    @ViewChild('configurationScope') public configurationScopeTemp: TemplateRef<HTMLDocument>;
    @ViewChild('changeSelect') public changeSelectTemp: TemplateRef<HTMLDocument>;

    // 通用的提示语句 国际化组件
    private commonLanguage: CommonLanguageInterface;

    // 表格数据
    public dataSet = [];

    // 表格配置
    public tableConfig: TableConfigModel;
    // 表格翻页对象
    public pageBean: PageModel = new PageModel();

    // 列表查询条件
    public queryCondition: QueryConditionModel = new QueryConditionModel();

    /** 判断是哪个采集  */
    EnergyInsertCollectionType = EnergyInsertCollectionTypeEnum;
    visible: boolean = false;
    // 节点id
    energyConsumptionNodeId: string;
    // 传递给组件的 type 选择的表格类型 设施 devive 设备 equipment 回路 loop
    tableType: string;
    // 判断是哪个页面调用查看组件
    switchPage = switchPageEnum;

    // 设施枚举
    public deviceTypeCode = DeviceTypeEnum;
    // 设施过滤选择器
    public facilityVisible: boolean = false;
    // 已选择设施数据
    public selectFacility: FacilityListModel[] = [];
    // 设施过滤
    public filterValue: FilterCondition;
    // 过滤框显示设施名
    public filterDeviceName: string = '';

    equipmentVisible: boolean = false;
    // 已选择的 设备数据
    selectFilterEquipment: EquipmentListModel[] = [];
    // 设备过滤条件
    equipmentFilterValue: FilterCondition;
    // 设备过滤显示名
    filterEquipmentName: string = '';
    selectEquipments: EquipmentListModel[] = [];

    // 回路
    loopFilterValue: FilterCondition;
    loopVisible: boolean = false;
    filterLoopName: string = '';
    selectLoops: LoopListModel[] = [];

    // 项目的下拉框选择数组
    projectSelectList = [];
    // 项目类型枚举
    projectTypeEnum = ProjectTypeEnmu;
    // 设备类型枚举
    public equipmentTypeEnum = EquipmentTypeEnum;
    // 设施类型枚举
    public deviceTypeEnum = DeviceTypeEnum;
    // 国际化前缀枚举
    public languageEnum = LanguageEnum;
    public language: EnergyLanguageInterface;

    // 项目选择器
    public projectSelectVisible: boolean = false;
    // 选择的项目
    public selectProjectName: any = {};
    public checkProject: ProjectSelectorConfigModel = new ProjectSelectorConfigModel;
    // 项目传值
    public projectFilterValue: FilterCondition;

    constructor(
        private $nzI18n: NzI18nService,
        private $message: NzMessageService,
        private $facilityApiService: FacilityApiService,
        private $energyUtilService: EnergyUtilService,
        private $energyApiService: EnergyApiService,
    ) { }

    ngOnInit() {
        this.language = this.$nzI18n.getLocaleData(LanguageEnum.energy);
        this.initTableConfig();
        this.refreshData();
        // this.init_projectData();
    }
    // 获取所属项目
    init_projectData() {
        this.$facilityApiService.getProjectList().subscribe((result) => {
            if (result.code === ResultCodeEnum.success) {
                if (result.data) {
                    result.data.forEach((item) => {
                        this.projectSelectList.push({
                            label: item.projectName,
                            value: item.projectId,
                        });
                    });
                }
            }
        });
    }

    // 初始化表格配置
    private initTableConfig(): void {
        this.tableConfig = {
            isDraggable: true,
            isLoading: false,
            outHeight: 108,
            showSizeChanger: true,
            showSearchSwitch: true,
            primaryKey: '03-1',
            scroll: { x: '2100px', y: '340px' },
            noIndex: true,
            showSearchExport: true,
            columnConfig: [
                {
                    type: 'serial-number',
                    width: 62,
                    title: this.language.serialNumber,
                    fixedStyle: { fixedLeft: true, style: { left: '0' } },
                },
                {
                    // 名称
                    title: this.language.energyConsumptionName,
                    key: 'equipmentName',
                    width: 150,
                    fixedStyle: { fixedLeft: true, style: { left: '62px' } },
                    isShowSort: true,
                    searchable: true,
                    searchConfig: { type: 'input' },
                },
                // 设备类型
                {
                    title: this.language.productTypeId,
                    key: 'equipmentType',
                    width: 160,
                    isShowSort: true,
                    configurable: true,
                    searchable: true,
                    type: 'render',
                    renderTemplate: this.equipmentTypeTemp,
                    searchConfig: {
                        type: 'select',
                        selectType: 'multiple',
                        selectInfo: FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n),
                        label: 'label',
                        value: 'code',
                    },
                },
                // {
                //     // 项目
                //     title: this.language.projectId,
                //     key: 'projectName',
                //     width: 160,
                //     isShowSort: true,
                //     configurable: true,
                //     searchable: true,
                //     searchConfig: {
                //         type: 'select',
                //         selectType: 'multiple',
                //         selectInfo: this.projectSelectList,
                //     },
                // },
                {
                    // 项目
                    title: this.language.projectId,
                    key: 'projectName',
                    searchKey: 'project',
                    width: 180,
                    isShowSort: true,
                    configurable: true,
                    searchable: true,
                    searchConfig: {
                        type: 'render', renderTemplate: this.projectFilterTemp
                    },
                },
                {
                    // 区域
                    title: this.language.areaId,
                    key: 'areaName',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                // 采集时间
                {
                    title: this.language.collectionTime,
                    key: 'reportTime',
                    width: 200,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    pipe: 'date',
                    searchConfig: { type: 'dateRang' },
                },
                {
                    // 采集设施
                    title: this.language.collectDeviceId,
                    key: 'devicesName',
                    type: 'render',
                    renderTemplate: this.collentionDeviceRenderTemplate,
                    width: 120,
                    isShowSort: true,
                    configurable: true,
                    searchable: false,
                    searchConfig: {
                        type: 'render',
                        renderTemplate: this.deviceFilterTemplate,
                    },
                },
                {
                    // 采集设备
                    title: this.language.collectEquipmentId,
                    key: 'equipmentsName',
                    type: 'render',
                    renderTemplate: this.collentionEquipmentRenderTemplate,
                    width: 120,
                    configurable: true,
                    searchable: false,
                    isShowSort: true,
                    searchConfig: {
                        type: 'render',
                        renderTemplate: this.equipmentTemplate,
                    },
                },
                {
                    // 采集回路
                    title: this.language.collectLoopId,
                    key: 'loopsName',
                    type: 'render',
                    renderTemplate: this.collentionLoopRenderTemplate,
                    width: 120,
                    isShowSort: true,
                    searchable: false,
                    configurable: true,
                    searchConfig: {
                        type: 'render',
                        renderTemplate: this.loopTemplate,
                    },
                },
                // 输入电压
                {
                    title: this.language.inputVoltage,
                    key: 'inputVoltage',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                // 输入电流
                {
                    title: this.language.inputCurrent,
                    key: 'inputCurrent',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                // 功率
                {
                    title: this.language.power,
                    key: 'power',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // A相电压
                    title: this.language.aphaseVoltage,
                    key: 'aeffectiveValueOfVoltage',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // B相电压
                    title: this.language.bphaseVoltage,
                    key: 'beffectiveValueOfVoltage',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // C相电压
                    title: this.language.cphaseVoltage,
                    key: 'ceffectiveValueOfVoltage',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // 相平均电压
                    title: this.language.avgphaseVoltage,
                    key: 'avgEffectiveValueOfVoltage',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // AB线电压
                    title: this.language.ablineVoltage,
                    key: 'ablineVoltage',
                    width: 150,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // BC线电压
                    title: this.language.bclineVoltage,
                    key: 'bclineVoltage',
                    width: 150,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // CA线电压
                    title: this.language.calineVoltage,
                    key: 'calineVoltage',
                    width: 150,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // 线平均电压
                    title: this.language.avglineVoltage,
                    key: 'avgVoltage',
                    width: 150,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // A相电流
                    title: this.language.aphaseCurrent,
                    key: 'aphaseCurrent',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // B相电流
                    title: this.language.bphaseCurrent,
                    key: 'bphaseCurrent',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // C相电流
                    title: this.language.cphaseCurrent,
                    key: 'cphaseCurrent',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // 总电流
                    title: this.language.totalCurrent,
                    key: 'totalPhaseCurrent',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // 漏电流
                    title: this.language.leakageCurrent,
                    key: 'leakageCurrent',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // A相有功功率
                    title: this.language.aphaseActivePower,
                    key: 'aactivePower',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // B相有功功率
                    title: this.language.bphaseActivePower,
                    key: 'bactivePower',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // C相有功功率
                    title: this.language.cphaseActivePower,
                    key: 'cactivePower',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // 总有功功率
                    title: this.language.totalphaseActivePower,
                    key: 'activePower',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // 总有功电能
                    title: this.language.totalactiveElectricEnergy,
                    key: 'activeElectricEnergy',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // A相无功功率
                    title: this.language.aphaseReactivePower,
                    key: 'areactivePower',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // B相无功功率
                    title: this.language.bphaseReactivePower,
                    key: 'breactivePower',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // C相无功功率
                    title: this.language.cphaseReactivePower,
                    key: 'creactivePower',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // 总无功功率
                    title: this.language.totalReactivePower,
                    key: 'reactivePower',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // 总功电能
                    title: this.language.totalReactiveEnergy,
                    key: 'reactiveEnergy',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // A相功率因数
                    title: this.language.aphasePowerFactor,
                    key: 'apowerFactor',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // B相功率因数
                    title: this.language.bphasePowerFactor,
                    key: 'bpowerFactor',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // C相功率因数
                    title: this.language.cphasePowerFactor,
                    key: 'cpowerFactor',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // 总功率因数
                    title: this.language.totalPowerFactor,
                    key: 'powerFactor',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    title: this.language.operate,
                    searchable: true,
                    searchConfig: { type: 'operate' },
                    key: '',
                    width: 210,
                    fixedStyle: { fixedRight: true, style: { right: '0px' } },
                },
            ],
            showPagination: true,
            bordered: false,
            showSearch: false,
            topButtons: [],
            operation: [],
            rightTopButtons: [],
            sort: (event: SortCondition) => {
                this.queryCondition.sortCondition.sortField = event.sortField;
                this.queryCondition.sortCondition.sortRule = event.sortRule;
                this.refreshData();
            },
            handleSearch: (event: FilterCondition[]) => {
                if (!event.length) {
                    this.selectProjectName = [];
                    this.selectProjectName = {};
                    this.checkProject = new ProjectSelectorConfigModel();
                  }
                    this.queryCondition.pageCondition.pageNum = 1;
                    this.queryCondition.filterConditions = event;
                    this.refreshData();
              
            },
            handleExport: (event) => {
                // 处理参数
                const body = new ExportRequestModel(
                    event.columnInfoList,
                    event.excelType,
                    new QueryConditionModel(),
                );

                body.columnInfoList = event.columnInfoList;
                const params = ['reportTime', 'equipmentType'];
                body.columnInfoList.forEach((item) => {
                    if (params.indexOf(item.propertyName) > -1) {
                        item.isTranslation = 1;
                    }
                });
                // 处理选择的项目
                if (event.selectItem.length > 0) {
                    const ids = event.selectItem.map((item) => item.deviceId);
                    const filter = new FilterCondition('equipmentId', OperatorEnum.in, ids);
                    body.queryCondition.filterConditions.push(filter);
                } else {
                    // 处理查询条件
                    body.queryCondition.filterConditions = event.queryTerm;
                }
                this.$energyApiService.realTimeDataExport_API(body).subscribe((res) => {
                    if (res.code === ResultCodeEnum.success) {
                        this.$message.success(this.language.config.exportSuccess);
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            },
        };
    }

    // 获取表格数据
    private refreshData() {
        this.tableConfig.isLoading = true;
        this.$energyApiService.realTimeDataList_API(this.queryCondition).subscribe(
            (result: ResultModel<any[]>) => {
                this.tableConfig.isLoading = false;
                if (result.code === ResultCodeEnum.success) {
                    console.log(result.data, 'result.data');
                    this.pageBean.Total = result.totalCount;
                    this.pageBean.pageIndex = result.pageNum;
                    this.pageBean.pageSize = result.size;
                    this.dataSet = [];
                    this.dataSet = result.data
                        ? result.data.map((item) => {
                            // 设置状态样式
                            const iconStyle = CommonUtil.getEquipmentStatusIconClass(item.gatewayStatus, 'list');
                            item.statusIconClass = iconStyle.iconClass;
                            item.statusColorClass = iconStyle.colorClass;
                            // 获取设备类型的图标
                            item.iconClass = this.$energyUtilService.getEquipmentTypeIcon(item);
                            return item;
                        })
                        : [];
                } else {
                    this.$message.error(result.msg);
                }
            },
            () => {
                this.tableConfig.isLoading = false;
            },
        );
    }
    public pageChange(event: PageModel): void {
        this.queryCondition.pageCondition.pageNum = event.pageIndex;
        this.queryCondition.pageCondition.pageSize = event.pageSize;
        this.refreshData();
    }

    // 采集设施 value === 1  采集设备 value === 2 采集回路 value === 3   modal
    public showCollectionModal(data, value: EnergyInsertCollectionTypeEnum): void {
        this.visible = true;
        const { equipmentId } = data;
        this.energyConsumptionNodeId = equipmentId;
        if (value === EnergyInsertCollectionTypeEnum.device) {
            this.tableType = 'device';
        } else if (value === EnergyInsertCollectionTypeEnum.equipment) {
            this.tableType = 'equipment';
        } else if (value === EnergyInsertCollectionTypeEnum.loop) {
            this.tableType = 'loop';
        }
    }

    // 表格搜索点击输入框弹出 设施选择 value === 1 设备选择 value === 2 回路选择 value === 3
    public onShowFacility(filterValue: FilterCondition, value): void {
        console.log(filterValue, 'filterValue');
        // 设施选择
        if (value === 1) {
            this.filterValue = filterValue;
            this.facilityVisible = true;
            if (!this.filterValue.filterValue) {
                this.filterValue.filterValue = [];
            }
        } else if (value === 2) {
            this.equipmentFilterValue = filterValue;
            this.equipmentVisible = true;
            if (!this.equipmentFilterValue.filterValue) {
                this.equipmentFilterValue.filterValue = [];
            }
        } else if (value === 3) {
            this.loopFilterValue = filterValue;
            this.loopVisible = true;
            if (!this.loopFilterValue.filterValue) {
                this.loopFilterValue.filterValue = [];
            }
        }
    }
    // 表格搜索弹出框点击确定按钮----------------------------------------
    // 选择设施数据
    public onFacilityChange(event: FacilityListModel[]): void {
        this.filterValue.filterValue =
            event.map((item) => {
                return item.deviceId;
            }) || [];
        this.selectFacility = event || [];
        if (!_.isEmpty(event)) {
            this.filterDeviceName = event
                .map((item) => {
                    return item.deviceName;
                })
                .join(',');
        } else {
            this.filterDeviceName = '';
        }
    }
    // 选择设备数据
    onSelectEquipment(event: EquipmentListModel[]) {
        this.equipmentFilterValue.filterValue =
            event.map((item) => {
                return item.deviceId;
            }) || [];
        this.selectEquipments = event || [];
        if (!_.isEmpty(event)) {
            this.filterEquipmentName = event
                .map((item) => {
                    return item.deviceName;
                })
                .join(',');
        } else {
            this.filterEquipmentName = '';
        }
    }
    // 选择回路
    onSelectLoop(event: LoopListModel[]) {
        this.loopFilterValue.filterValue =
            event.map((item) => {
                return item.loopId;
            }) || [];
        this.selectLoops = event || [];
        if (!_.isEmpty(event)) {
            this.filterLoopName = event
                .map((item) => {
                    return item.loopName;
                })
                .join(',');
        } else {
            this.filterLoopName = '';
        }
    }
    // 表格搜索弹出框点击确定按钮----------------------------------------

    /**
     * 打开项目选择器
     */
    public showProjectSelectorModal(filterValue: FilterCondition): void {
        this.projectSelectVisible = true;
        this.projectFilterValue = filterValue;
    }
    // 项目选择器结果  模板弹出框 确认
    public projectSelectChange(event): void {
        console.log(event, 'event');
        this.selectProjectName = event;
        // 选择告警对象 checkAlarmEquipment
        this.checkProject = new ProjectSelectorConfigModel(
            event.map(v => v.projectName).join(',') || '', event.map(v => v.projectId) || []
        );
        this.projectFilterValue.filterValue = this.checkProject.ids;
        this.projectFilterValue.filterName = this.checkProject.projectName;
        this.projectFilterValue.operator ='in'
    }


}
