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
    // ??????????????????
    @ViewChild('equipmentTypeTemplate') equipmentTypeTemp: TemplateRef<HTMLDocument>;
    // ????????????
    @ViewChild('deviceStatusTemp') deviceStatusTemp: TemplateRef<HTMLDocument>;
    // ??????
    @ViewChild('projectFilterTemp') projectFilterTemp: TemplateRef<HTMLDocument>;
    // ????????????
    @ViewChild('collentionDeviceRenderTemplate')
    public collentionDeviceRenderTemplate: TemplateRef<any>;
    // ????????????
    @ViewChild('collentionEquipmentRenderTemplate')
    public collentionEquipmentRenderTemplate: TemplateRef<any>;
    // ????????????
    @ViewChild('collentionLoopRenderTemplate') public collentionLoopRenderTemplate: TemplateRef<any>;
    // ??????????????????
    @ViewChild('facilityTemplate') deviceFilterTemplate: TemplateRef<HTMLDocument>;
    // ??????????????????
    @ViewChild('equipmentTemplate') equipmentTemplate: TemplateRef<HTMLDocument>;
    // ??????????????????
    @ViewChild('loopTemplate') loopTemplate: TemplateRef<HTMLDocument>;

    // ????????????
    @ViewChild('collectionPeriod') public collectionPeriodTemp: TemplateRef<HTMLDocument>;
    // ????????????
    @ViewChild('configurationScope') public configurationScopeTemp: TemplateRef<HTMLDocument>;
    @ViewChild('changeSelect') public changeSelectTemp: TemplateRef<HTMLDocument>;

    // ????????????????????? ???????????????
    private commonLanguage: CommonLanguageInterface;

    // ????????????
    public dataSet = [];

    // ????????????
    public tableConfig: TableConfigModel;
    // ??????????????????
    public pageBean: PageModel = new PageModel();

    // ??????????????????
    public queryCondition: QueryConditionModel = new QueryConditionModel();

    /** ?????????????????????  */
    EnergyInsertCollectionType = EnergyInsertCollectionTypeEnum;
    visible: boolean = false;
    // ??????id
    energyConsumptionNodeId: string;
    // ?????????????????? type ????????????????????? ?????? devive ?????? equipment ?????? loop
    tableType: string;
    // ???????????????????????????????????????
    switchPage = switchPageEnum;

    // ????????????
    public deviceTypeCode = DeviceTypeEnum;
    // ?????????????????????
    public facilityVisible: boolean = false;
    // ?????????????????????
    public selectFacility: FacilityListModel[] = [];
    // ????????????
    public filterValue: FilterCondition;
    // ????????????????????????
    public filterDeviceName: string = '';

    equipmentVisible: boolean = false;
    // ???????????? ????????????
    selectFilterEquipment: EquipmentListModel[] = [];
    // ??????????????????
    equipmentFilterValue: FilterCondition;
    // ?????????????????????
    filterEquipmentName: string = '';
    selectEquipments: EquipmentListModel[] = [];

    // ??????
    loopFilterValue: FilterCondition;
    loopVisible: boolean = false;
    filterLoopName: string = '';
    selectLoops: LoopListModel[] = [];

    // ??????????????????????????????
    projectSelectList = [];
    // ??????????????????
    projectTypeEnum = ProjectTypeEnmu;
    // ??????????????????
    public equipmentTypeEnum = EquipmentTypeEnum;
    // ??????????????????
    public deviceTypeEnum = DeviceTypeEnum;
    // ?????????????????????
    public languageEnum = LanguageEnum;
    public language: EnergyLanguageInterface;

    // ???????????????
    public projectSelectVisible: boolean = false;
    // ???????????????
    public selectProjectName: any = {};
    public checkProject: ProjectSelectorConfigModel = new ProjectSelectorConfigModel;
    // ????????????
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
    // ??????????????????
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

    // ?????????????????????
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
                    // ??????
                    title: this.language.energyConsumptionName,
                    key: 'equipmentName',
                    width: 150,
                    fixedStyle: { fixedLeft: true, style: { left: '62px' } },
                    isShowSort: true,
                    searchable: true,
                    searchConfig: { type: 'input' },
                },
                // ????????????
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
                //     // ??????
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
                    // ??????
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
                    // ??????
                    title: this.language.areaId,
                    key: 'areaName',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                // ????????????
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
                    // ????????????
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
                    // ????????????
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
                    // ????????????
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
                // ????????????
                {
                    title: this.language.inputVoltage,
                    key: 'inputVoltage',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                // ????????????
                {
                    title: this.language.inputCurrent,
                    key: 'inputCurrent',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                // ??????
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
                    // A?????????
                    title: this.language.aphaseVoltage,
                    key: 'aeffectiveValueOfVoltage',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // B?????????
                    title: this.language.bphaseVoltage,
                    key: 'beffectiveValueOfVoltage',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // C?????????
                    title: this.language.cphaseVoltage,
                    key: 'ceffectiveValueOfVoltage',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // ???????????????
                    title: this.language.avgphaseVoltage,
                    key: 'avgEffectiveValueOfVoltage',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // AB?????????
                    title: this.language.ablineVoltage,
                    key: 'ablineVoltage',
                    width: 150,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // BC?????????
                    title: this.language.bclineVoltage,
                    key: 'bclineVoltage',
                    width: 150,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // CA?????????
                    title: this.language.calineVoltage,
                    key: 'calineVoltage',
                    width: 150,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // ???????????????
                    title: this.language.avglineVoltage,
                    key: 'avgVoltage',
                    width: 150,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // A?????????
                    title: this.language.aphaseCurrent,
                    key: 'aphaseCurrent',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // B?????????
                    title: this.language.bphaseCurrent,
                    key: 'bphaseCurrent',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // C?????????
                    title: this.language.cphaseCurrent,
                    key: 'cphaseCurrent',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // ?????????
                    title: this.language.totalCurrent,
                    key: 'totalPhaseCurrent',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // ?????????
                    title: this.language.leakageCurrent,
                    key: 'leakageCurrent',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // A???????????????
                    title: this.language.aphaseActivePower,
                    key: 'aactivePower',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // B???????????????
                    title: this.language.bphaseActivePower,
                    key: 'bactivePower',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // C???????????????
                    title: this.language.cphaseActivePower,
                    key: 'cactivePower',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // ???????????????
                    title: this.language.totalphaseActivePower,
                    key: 'activePower',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // ???????????????
                    title: this.language.totalactiveElectricEnergy,
                    key: 'activeElectricEnergy',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // A???????????????
                    title: this.language.aphaseReactivePower,
                    key: 'areactivePower',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // B???????????????
                    title: this.language.bphaseReactivePower,
                    key: 'breactivePower',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // C???????????????
                    title: this.language.cphaseReactivePower,
                    key: 'creactivePower',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // ???????????????
                    title: this.language.totalReactivePower,
                    key: 'reactivePower',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // ????????????
                    title: this.language.totalReactiveEnergy,
                    key: 'reactiveEnergy',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // A???????????????
                    title: this.language.aphasePowerFactor,
                    key: 'apowerFactor',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // B???????????????
                    title: this.language.bphasePowerFactor,
                    key: 'bpowerFactor',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // C???????????????
                    title: this.language.cphasePowerFactor,
                    key: 'cpowerFactor',
                    width: 120,
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // ???????????????
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
                // ????????????
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
                // ?????????????????????
                if (event.selectItem.length > 0) {
                    const ids = event.selectItem.map((item) => item.deviceId);
                    const filter = new FilterCondition('equipmentId', OperatorEnum.in, ids);
                    body.queryCondition.filterConditions.push(filter);
                } else {
                    // ??????????????????
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

    // ??????????????????
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
                            // ??????????????????
                            const iconStyle = CommonUtil.getEquipmentStatusIconClass(item.gatewayStatus, 'list');
                            item.statusIconClass = iconStyle.iconClass;
                            item.statusColorClass = iconStyle.colorClass;
                            // ???????????????????????????
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

    // ???????????? value === 1  ???????????? value === 2 ???????????? value === 3   modal
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

    // ????????????????????????????????? ???????????? value === 1 ???????????? value === 2 ???????????? value === 3
    public onShowFacility(filterValue: FilterCondition, value): void {
        console.log(filterValue, 'filterValue');
        // ????????????
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
    // ???????????????????????????????????????----------------------------------------
    // ??????????????????
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
    // ??????????????????
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
    // ????????????
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
    // ???????????????????????????????????????----------------------------------------

    /**
     * ?????????????????????
     */
    public showProjectSelectorModal(filterValue: FilterCondition): void {
        this.projectSelectVisible = true;
        this.projectFilterValue = filterValue;
    }
    // ?????????????????????  ??????????????? ??????
    public projectSelectChange(event): void {
        console.log(event, 'event');
        this.selectProjectName = event;
        // ?????????????????? checkAlarmEquipment
        this.checkProject = new ProjectSelectorConfigModel(
            event.map(v => v.projectName).join(',') || '', event.map(v => v.projectId) || []
        );
        this.projectFilterValue.filterValue = this.checkProject.ids;
        this.projectFilterValue.filterName = this.checkProject.projectName;
        this.projectFilterValue.operator ='in'
    }


}
