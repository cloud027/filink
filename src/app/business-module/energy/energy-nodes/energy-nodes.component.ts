import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { NzI18nService, NzMessageService, NzModalService, UploadFile } from 'ng-zorro-antd';

import { DeviceTypeEnum } from '../../../core-module/enum/facility/facility.enum';

import { TableComponent } from '../../../shared-module/component/table/table.component';
import * as EnergyList from './energy-list-util';
import { PageModel } from '../../../shared-module/model/page.model';
import { TableConfigModel } from '../../../shared-module/model/table-config.model';
import { ResultModel } from '../../../shared-module/model/result.model';
import { EnergyLanguageInterface } from '../../../../assets/i18n/energy/energy.language.interface';
import { CommonLanguageInterface } from '../../../../assets/i18n/common/common.language.interface';
import { LanguageEnum } from '../../../shared-module/enum/language.enum';
import { FiLinkModalService } from '../../../shared-module/service/filink-modal/filink-modal.service';
import { ResultCodeEnum } from '../../../shared-module/enum/result-code.enum';
import { AlarmStoreService } from '../../../core-module/store/alarm.store.service';
import { FacilityForCommonUtil } from '../../../core-module/business-util/facility/facility-for-common.util';
import { SelectModel } from '../../../shared-module/model/select.model';
import { CommonUtil } from '../../../shared-module/util/common-util';

import {
    FilterCondition,
    QueryConditionModel,
} from '../../../shared-module/model/query-condition.model';

import { EnergyModel } from '../share/model/energy.model';
import { Download } from '../../../shared-module/util/download';

import { EnergyApiService } from '../share/service/energy/energy-api.service';
import { OperatorEnum } from '../../../shared-module/enum/operator.enum';
import { ExportRequestModel } from '../../../shared-module/model/export-request.model';
import {
    EquipmentStatusEnum,
    EquipmentTypeEnum,
} from '../../../core-module/enum/equipment/equipment.enum';
import { EnergyUtilService } from '../share/service/energy/energy-util.service';
import { FacilityApiService } from '../../facility/share/service/facility/facility-api.service';
import { ProjectTypeEnmu } from '../share/enum/project.enum';
import { FacilityListModel } from '../../../core-module/model/facility/facility-list.model';
import { EquipmentListModel } from '../../../core-module/model/equipment/equipment-list.model';
import { LoopListModel } from '../../../core-module/model/loop/loop-list.model';
import { switchPageEnum } from '../share/enum/energy-config.enum';
import { EquipmentApiService } from '../../facility/share/service/equipment/equipment-api.service';
import { ConfigDetailRequestModel } from '../../../core-module/model/equipment/config-detail-request.model';
import { AssetManagementLanguageInterface } from '../../../../assets/i18n/asset-manage/asset-management.language.interface';
import {AlarmSelectorInitialValueModel} from '../../../shared-module/model/alarm-selector-config.model';
import {FilterValueModel} from '../../../core-module/model/work-order/filter-value.model';
import {ProjectSelectorConfigModel} from '../../../shared-module/model/project-selector-config.model';

@Component({
    selector: 'app-energy-nodes',
    templateUrl: './energy-nodes.component.html',
    styleUrls: ['./energy-nodes.component.scss'],
})
export class EnergyNodesComponent implements OnInit, OnDestroy {
    // ??????????????????
    @ViewChild('table') table: TableComponent;
    // ????????????
    @ViewChild('importFacilityTemp') importFacilityTemp: TemplateRef<HTMLDocument>;
    // ??????????????????
    @ViewChild('equipmentTypeTemplate') equipmentTypeTemp: TemplateRef<HTMLDocument>;
    // ????????????
    @ViewChild('deviceStatusTemp') deviceStatusTemp: TemplateRef<HTMLDocument>;
    // ??????
    @ViewChild('projectFilterTemp') projectFilterTemp: TemplateRef<any>;
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

    TableLoading: boolean = false;
    // ????????????
    public dataSet: EnergyModel[] = [];
    // ??????????????????
    public equipmentStatusEnum = EquipmentStatusEnum;

    // ?????????????????????
    tableCheckVisible: boolean = false;
    visible: boolean = false;
    // ??????
    tableCheckModalTitle: string = '';
    // ?????????????????? type ????????????????????? ?????? devive ?????? equipment ?????? loop
    tableType: string;
    // ????????? ????????? ????????????
    tranCheckTableData: any = [];
    // ??????id
    energyConsumptionNodeId: string;
    // ???????????????????????????????????????
    switchPage = switchPageEnum;

    // ??????????????????????????????
    tableSearchProjectValue;

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

    // ??????????????????
    public pageBean: PageModel = new PageModel();
    // ????????????
    public tableConfig: TableConfigModel;
    // ???????????????
    public language: EnergyLanguageInterface;
    // ????????????????????? ???????????????
    private commonLanguage: CommonLanguageInterface;

    // ???????????????????????????
    private deviceRoleTypes: SelectModel[];
    // ????????????????????????
    private defaultFilterCondition: FilterCondition;

    // ????????????
    private queryCondition: QueryConditionModel = new QueryConditionModel();

    // ????????????
    public fileList: UploadFile[] = [];
    // ????????????
    public fileArray: UploadFile[] = [];
    // ????????????
    public fileType: string;
    // ??????????????????
    public equipmentTypeEnum = EquipmentTypeEnum;
    // ?????????????????????
    public languageEnum = LanguageEnum;
    // ??????????????????????????????
    projectSelectList = [];
    // ??????????????????
    projectTypeEnum = ProjectTypeEnmu;

    // -------------------------------------????????????*---------------------------
    /** ?????????????????? */
    public equipmentModel: string;
    /** ?????????????????? */
    public equipmentConfigType: EquipmentTypeEnum;
    /** ????????????id */
    public equipmentConfigId: string;

    /** ?????????????????? ?????????any?????????????????????????????????????????? */
    public equipmentConfigContent: any;
    /** ???????????????????????????????????? */
    public configOkDisabled: boolean = true;
    /** ???????????????????????? */
    public configValueParam: ConfigDetailRequestModel = new ConfigDetailRequestModel();
    /** ????????????id */
    public configEquipmentId: string;
    /** ?????????????????????????????? */
    public equipmentDeployShow: boolean = false;
    // -------------------------------------????????????*---------------------------

    // ???????????????
    public projectSelectVisible: boolean = false;
    // ???????????????
    public selectProjectName: any = {};
    public checkProject: ProjectSelectorConfigModel = new ProjectSelectorConfigModel;
    // ????????????
    public projectFilterValue: FilterCondition;
    // ?????????????????????
    public assetsLanguage: AssetManagementLanguageInterface;
    constructor(
        public $router: Router,
        public $nzI18n: NzI18nService,
        public $message: FiLinkModalService,
        public $active: ActivatedRoute,
        public $alarmStoreService: AlarmStoreService,
        private $modal: NzModalService,
        private $download: Download,
        private $energyApiService: EnergyApiService,
        private $energyUtilService: EnergyUtilService,
        private $facilityApiService: FacilityApiService,
        private $equipmentAipService: EquipmentApiService,
        public $nzMessage: NzMessageService,
    ) { }

    ngOnInit() {
        this.language = this.$nzI18n.getLocaleData(LanguageEnum.energy);
        this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
        this.assetsLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
        this.deviceRoleTypes = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n);
        // ????????????????????????
        this.getDefaultFilterCondition();
        // ?????????????????????
        EnergyList.initTableConfig(this);
        this.refreshData();
        // this.init_projectData();
    }

    /**
     * ??????????????????????????????
     */
    public ngOnDestroy(): void {
        this.equipmentTypeTemp = null;
        this.table = null;
    }
    /**
     * ????????????????????????
     */
    private getDefaultFilterCondition(): void {
        if (!_.isEmpty(this.deviceRoleTypes)) {
            const labelValue = [];
            this.deviceRoleTypes.forEach((item) => {
                labelValue.push(item.code);
            });
            this.defaultFilterCondition = new FilterCondition('deviceType', OperatorEnum.in, labelValue);
        }
    }

    // ?????????????????????
    public refreshData() {
        this.tableConfig.isLoading = true;
        this.$energyApiService.energyNodesListData_API(this.queryCondition).subscribe(
            (result: ResultModel<EnergyModel[]>) => {
                this.tableConfig.isLoading = false;
                if (result.code === ResultCodeEnum.success) {
                    this.pageBean.Total = result.totalCount;
                    this.pageBean.pageIndex = result.pageNum;
                    this.pageBean.pageSize = result.size;
                    this.dataSet = result.data || [];
                    // ?????????????????????????????????
                    this.dataSet.forEach((item) => {
                        // ??????????????????
                        const iconStyle = CommonUtil.getEquipmentStatusIconClass(item.gatewayStatus, 'list');
                        item.statusIconClass = iconStyle.iconClass;
                        item.statusColorClass = iconStyle.colorClass;
                        // ???????????????????????????
                        item.iconClass = this.$energyUtilService.getEquipmentTypeIcon(item);
                    });
                } else {
                    this.$message.error(result.msg);
                }
            },
            () => {
                this.tableConfig.isLoading = false;
            },
        );
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
    // ????????????
    public navigateToDetail(url, extras = {}) {
        this.$router.navigate([url], extras).then();
    }
    // ????????????????????????
    beforeUpload = (file: UploadFile): boolean => {
        this.fileArray = this.fileArray.concat(file);
        if (this.fileArray.length > 1) {
            this.fileArray.splice(0, 1);
        }
        this.fileList = this.fileArray;
        const fileName = this.fileList[0].name;
        const index = fileName.lastIndexOf('.');
        this.fileType = fileName.substring(index + 1, fileName.length);
        return false;
    }
    // ????????????
    public pageChange(event: PageModel): void {
        this.queryCondition.pageCondition.pageNum = event.pageIndex;
        this.queryCondition.pageCondition.pageSize = event.pageSize;
        this.refreshData();
    }
    // ??????
    public deleteDeviceByIds(data: EnergyModel[]): void {
        this.tableConfig.isLoading = true;
        const ids = data.map((item) => item.energyConsumptionNodeId);
        console.log(ids, 'ids');
        this.$energyApiService.energyNodesDelete_API(ids).subscribe(
            (result: ResultModel<string>) => {
                if (result.code === ResultCodeEnum.success) {
                    this.$message.success(this.language.deleteEnergyNodesSuccess);
                    // ??????????????????
                    this.queryCondition.pageCondition.pageNum = 1;
                    this.refreshData();
                } else {
                    this.tableConfig.isLoading = false;
                    this.$message.error(result.msg);
                }
            },
            () => {
                this.tableConfig.isLoading = false;
            },
        );
    }

    // ????????????
    handelExportEquipment(event) {
        // ????????????
        const exportBody = new ExportRequestModel(event.columnInfoList, event.excelType);
        exportBody.columnInfoList = event.columnInfoList;
        const params = ['equipmentType', 'gatewayStatus', 'project'];
        exportBody.columnInfoList.forEach((item) => {
            if (params.indexOf(item.propertyName) > -1) {
                item.isTranslation = 1;
            }
        });
        // ?????????????????????
        if (event && !_.isEmpty(event.selectItem)) {
            const ids = event.selectItem.map((item) => item.energyConsumptionNodeId);
            const filter = new FilterCondition('energyConsumptionNodeId', OperatorEnum.in, ids);
            exportBody.queryCondition.filterConditions.push(filter);
        } else {
            // ??????????????????
            exportBody.queryCondition.filterConditions = event.queryTerm;
        }
        // ??????????????????
        this.$energyApiService
            .energyNodesListExport_API(exportBody)
            .subscribe((result: ResultModel<string>) => {
                if (result.code === ResultCodeEnum.success) {
                    this.$nzMessage.success(this.language.exportEnergyNodesSuccess);
                } else {
                    this.$message.error(result.msg);
                }
            });
    }

    // ???????????? value === 1  ???????????? value === 2 ???????????? value === 3   modal
    public showCollectionModal(data, value): void {
        this.visible = true;
        const { energyConsumptionNodeId } = data;
        this.energyConsumptionNodeId = energyConsumptionNodeId;
        if (value === 1) {
            this.tableType = 'device';
        } else if (value === 2) {
            this.tableType = 'equipment';
        } else if (value === 3) {
            this.tableType = 'loop';
        }
    }
    tableSearchProjectChange(value, filterValue) {
        this.tableSearchProjectValue = value;
        console.log(value, filterValue,"tableSearchProjectChange");
    }
    // ????????????????????? ???????????? value === 1 ???????????? value === 2 ???????????? value === 3
    public onShowFacility(filterValue: FilterCondition, value): void {
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
    /**
     * ???????????????????????????
     * ???????????????any????????????????????????????????????
     */
    public getPramsConfig(equipmentModel: { equipmentModel: string }): void {
        this.$equipmentAipService
            .getEquipmentConfigByModel(equipmentModel)
            .subscribe((result: ResultModel<any>) => {
                if (result.code === ResultCodeEnum.success) {
                    this.equipmentConfigContent = result.data || [];
                    // ???????????????????????? ????????????????????????
                    if (!_.isEmpty(this.equipmentConfigContent)) {
                        this.configOkDisabled = true;
                        // ????????????????????????
                        this.equipmentDeployShow = true;
                        this.configEquipmentId = this.equipmentConfigId;
                        this.configValueParam.equipmentId = this.equipmentConfigId;
                        this.configValueParam.equipmentType = this.equipmentConfigType;
                    } else {
                        this.$message.info(this.assetsLanguage.noEquipmentConfigTip);
                    }
                } else {
                    // ????????????????????????
                    this.equipmentDeployShow = false;
                    this.$message.error(result.msg);
                }
            });
    }
    /** ???????????? */
    handleImport() {
        const formData = new FormData();
        this.fileList.forEach((file: any) => {
            formData.append('file', file);
        });
        if (this.fileList.length === 1) {
            if (this.fileType === 'xls' || this.fileType === 'xlsx') {
                this.$energyApiService
                    .energyNodesListImport_API(formData)
                    .subscribe((result: ResultModel<string>) => {
                        this.fileList = [];
                        this.fileType = null;
                        if (result.code === ResultCodeEnum.success) {
                            this.$message.success(this.language.picInfo.importTask);
                            this.fileArray = [];
                        } else {
                            this.$message.error(result.msg);
                        }
                    });
            } else {
                this.$message.info(this.language.fileTypeTips);
            }
        } else {
            this.$message.info(this.language.selectFileTips);
        }
    }
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
        // ???????????? checkAlarmEquipment
        this.checkProject =  new ProjectSelectorConfigModel(
          event.map(v => v.projectName).join(',') || '', event.map(v => v.projectId) || []
        );
        this.projectFilterValue.filterValue = this.checkProject.ids;
        this.projectFilterValue.filterName = this.checkProject.projectName;
        this.projectFilterValue.operator ='in'
    }
}
