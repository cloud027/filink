import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
    TemplateRef,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NzI18nService, NzTreeNode, NzModalService } from 'ng-zorro-antd';
import * as _ from 'lodash';

import { FormItem } from '../../../../shared-module/component/form/form-config';
import { EnergyLanguageInterface } from '../../../../../assets/i18n/energy/energy.language.interface';

import { RuleUtil } from '../../../../shared-module/util/rule-util';
import { FacilityForCommonUtil } from '../../../../core-module/business-util/facility/facility-for-common.util';
import { FormOperate } from '../../../../shared-module/component/form/form-operate.service';
import { LanguageEnum } from '../../../../shared-module/enum/language.enum';
import { FormLanguageInterface } from '../../../../../assets/i18n/form/form.language.interface';
import { SelectModel } from '../../../../shared-module/model/select.model';
import { OperateTypeEnum } from '../../../../shared-module/enum/page-operate-type.enum';
import { EnergyNodesAddInfoModel } from '../../share/model/energy-nodes-add-info.model';
import { EquipmentTypeEnum } from '../../../../core-module/enum/equipment/equipment.enum';
import { EquipmentApiService } from '../../../facility/share/service/equipment/equipment-api.service';
import { TYPE_OBJECT_CONST } from '../../../facility/share/const/facility-common.const';
import { ResultCodeEnum } from '../../../../shared-module/enum/result-code.enum';
import { ResultModel } from '../../../../shared-module/model/result.model';
import { FacilityApiService } from '../../../facility/share/service/facility/facility-api.service';
import { FiLinkModalService } from '../../../../shared-module/service/filink-modal/filink-modal.service';
import { AreaModel } from '../../../../core-module/model/facility/area.model';
import { TreeSelectorConfigModel } from '../../../../shared-module/model/tree-selector-config.model';
import { Project } from '../../share/model/project';
import { FacilityListModel } from '../../../../core-module/model/facility/facility-list.model';
import { EquipmentModelModel } from '../../../facility/share/model/equipment-model.model';
import { EnergyApiService } from '../../share/service/energy/energy-api.service';
import { OperatorEnum } from '../../../../shared-module/enum/operator.enum';
import { QueryGatewayPortEnum } from '../../../facility/share/enum/equipment.enum';
import { DeviceTypeEnum } from '../../../../core-module/enum/facility/facility.enum';
import { EquipmentListModel } from '../../../../core-module/model/equipment/equipment-list.model';
import { LoopListModel } from '../../../../core-module/model/loop/loop-list.model';
import {
    EnergySelectedType,
    EnergyOpearEquipmentTXEnum,
    EnergyInsertCollectionTypeEnum,
} from '../../share/enum/energy-config.enum';

import { FacilityLanguageInterface } from '../../../../../assets/i18n/facility/facility.language.interface';

import { PageModel } from '../../../../shared-module/model/page.model';
import { TableConfigModel } from '../../../../shared-module/model/table-config.model';
import {
    FilterCondition,
    QueryConditionModel,
    SortCondition,
} from '../../../../shared-module/model/query-condition.model';
import { ProductLanguageInterface } from '../../../../../assets/i18n/product/product.language.interface';
import { CommonLanguageInterface } from '../../../../../assets/i18n/common/common.language.interface';
import { TableComponent } from '../../../../shared-module/component/table/table.component';
import { ProductTypeEnum } from '../../../../core-module/enum/product/product.enum';
import { ProductForCommonService } from '../../../../core-module/api-service/product/product-for-common.service';
import { CommonUtil } from '../../../../shared-module/util/common-util';
import { log } from 'console';
@Component({
    selector: 'app-insert-nodes',
    templateUrl: './insert-nodes.component.html',
    styleUrls: ['./insert-nodes.component.scss'],
})
export class InsertNodesComponent implements OnInit, OnDestroy {
    // ??????????????????
    @ViewChild('existingEquipmentTmp') private existingEquipmentTmp: TemplateRef<HTMLDocument>;
    existingEquipmentValue;

    // ???????????? ??????????????????
    @ViewChild('facilitiesSelector') private facilitiesSelector: TemplateRef<HTMLDocument>;
    // ????????????
    @ViewChild('positionByDeviceTemplate')
    private positionByDeviceTemplate: TemplateRef<HTMLDocument>;
    // ???????????? ?????????
    @ViewChild('collectionFacSelector') private collectionFacSelector: TemplateRef<HTMLDocument>;

    // ???????????? ?????????
    @ViewChild('collectionEquipmentSelector')
    private collectionEquipmentSelector: TemplateRef<HTMLDocument>;
    // ???????????? ?????????
    @ViewChild('collectionLoopSelector') private collectionLoopSelector: TemplateRef<HTMLDocument>;
    // ????????????
    @ViewChild('communicationEquipmentor') private communicationEquipmentor: TemplateRef<HTMLDocument>;
    // ????????????
    @ViewChild('modelByTypeTemplate') private modelByTypeTemplate: TemplateRef<HTMLDocument>;
    @ViewChild('radioTemp') private radioTemp: TemplateRef<HTMLDocument>;

    // ???????????????
    @ViewChild('areaSelector') private areaSelector: TemplateRef<HTMLDocument>;
    // ?????????????????????
    @ViewChild('gatewayPortTemp') private gatewayPortTemp: TemplateRef<HTMLDocument>;
    @ViewChild('tableCom') public tableCom: TableComponent;
    //  ??????????????????
    @ViewChild('productTypeTemplate') public productTypeTemplate: TemplateRef<HTMLDocument>;
    @ViewChild('productTemp') public productTemp: TemplateRef<HTMLDocument>;

    // ??????????????????
    @ViewChild('equipmentSelect') private equipmentSelect: TemplateRef<HTMLDocument>;

    // ???????????????
    @ViewChild('projectSelector') private projectSelector: TemplateRef<HTMLDocument>;

    // ????????????
    @Output() public getExtraRequest = new EventEmitter<EnergyNodesAddInfoModel>();
    // ????????????????????????
    @Output() public getFormDisabled = new EventEmitter<boolean>();
    // ??????????????????
    @Output() public getFormStatus = new EventEmitter<FormOperate>();
    // ????????????????????????
    @Input() public isAddOperate: boolean = false;

    // ??????
    public language: EnergyLanguageInterface;
    public facilityLanguage: FacilityLanguageInterface;
    // ???????????????
    public formLanguage: FormLanguageInterface;

    public formColumn: FormItem[] = [];
    // ??????
    public project: string = '';
    // ????????????
    communicationEquipmentValue;
    // ??????????????????
    public equipmentedVisible: boolean = false;
    // ???????????????????????????
    public collectionEquipmentVisible: boolean = false;
    /** ??????????????? ???????????? */
    collectionEquipmentFilterData: FilterCondition[] = [];
    /** ??????????????????????????? */
    loopFilterConditions: FilterCondition[] = [];
    /** ???????????? ???????????? ???????????? ??????????????? */
    EnergyInsertCollectionType = EnergyInsertCollectionTypeEnum;
    // ???????????????????????????
    splitCollectEquipmentName: string;
    // ???????????????
    public selectCollectionEquipment: EquipmentListModel[] = [];

    /** ????????????????????????????????? */
    public mapVisible: boolean = false;

    // ???????????? ?????????
    public conlectionSSVisible: boolean = false;
    // ????????????????????????
    splitDeviceName: string;

    // ?????? ?????????
    public collectionHLVisible: boolean = false;
    // ????????????????????????
    splitCollectLoopName: string;

    // ???????????????????????????
    isSelectExistDevice = true;
    // ??????id
    public equipmentIds;
    // ??????????????????
    public pageLoading = false;
    // ????????????
    public pageTitle: string;
    // ????????????
    public isLoading = false;
    // ????????????
    public isDisabled: boolean = true;

    // ??????????????????id??????
    public selectLinkDeviceIds: FacilityListModel[] = [];
    // ?????????????????? id ??????
    selectLinkLoopIds: any = [];
    // ???????????????????????????
    private equipmentTypeList: SelectModel[] = [];
    /**  ???????????????????????????????????? */
    public operateType: string = OperateTypeEnum.add;
    //  ???????????????
    public modelChangeValue: EquipmentModelModel[] = [];
    // ???????????????????????????????????????
    public saveEquipmentModel: EnergyNodesAddInfoModel = new EnergyNodesAddInfoModel();
    // ?????????????????????????????????
    public areaSelectVisible: boolean = false;
    // ??????????????????
    private areaNodes: NzTreeNode[] = [];
    // ??????????????????
    private areaInfo: AreaModel = new AreaModel();
    /** ????????? ???????????? */
    selectedAreaName: string;
    // ?????????????????????
    public areaSelectorConfig: TreeSelectorConfigModel = new TreeSelectorConfigModel();
    // ???????????????????????????????????????????????????
    public facilityFilter: FilterCondition[] = [];
    /** ???????????? ????????? biz */
    energyBizParams;
    /** ???????????? ????????? biz */
    energyEquipmentBizParams;
    public existingEquipmentFilter: FilterCondition[] = [];
    // ???????????? ????????????
    equipmentModalType: number;

    EnergyOpearEquipmentTX = EnergyOpearEquipmentTXEnum;
    /** ???????????? ???????????? ??????????????? */
    selectedEquipmentId: any = [];
    /** ???????????? ???????????? ?????????????????? */
    tableTitle: string;
    /** ?????????????????? */
    selectedYY: any = [];
    /** ?????????????????? */
    selectedTX: any = [];
    // ??????????????????
    public gatewayFilter: FilterCondition[] = [];
    // ?????????????????????
    public gatewayPortList: string[] = [];
    //  ?????????????????????
    public positionSelectList: string[] = [];
    // ????????????
    formStatus: FormOperate;
    /** ??????????????????????????? */
    public productTempDisabled: boolean = true;
    /** ?????? */
    public productName: string = '';

    public productDisable = true;
    // ????????????
    public _dataSet = [];
    // ??????
    public pageBean: PageModel = new PageModel();
    // ?????????????????????
    public queryCondition: QueryConditionModel = new QueryConditionModel();
    // ????????????
    public tableConfig: TableConfigModel = new TableConfigModel();
    // ?????????????????????
    public _selectedProduct;
    // ????????????id
    public selectedProductId: string = null;
    // ??????????????????
    public productTypeEnum = ProductTypeEnum;
    // ??????????????????
    public deviceTypeEnum = DeviceTypeEnum;
    // ??????????????????
    public equipmentTypeEnum = EquipmentTypeEnum;
    // ???????????????
    public languageEnum = LanguageEnum;

    // ???????????????????????????
    public productLanguage: ProductLanguageInterface;
    // ???????????????
    public commonLanguage: CommonLanguageInterface;

    // ???????????????
    public projectSelectVisible: boolean = false;
    // ???????????????
    public selectSelectProject: any = {};

    constructor(
        private $ruleUtil: RuleUtil,
        private $nzI18n: NzI18nService,
        private $router: Router,
        private $equipmentAipService: EquipmentApiService,
        private $facilityApiService: FacilityApiService,
        private $modalService: FiLinkModalService,
        private $energyApiService: EnergyApiService,
        private $message: FiLinkModalService,
        private $active: ActivatedRoute,
        private $productCommonService: ProductForCommonService,
        private $tempModal: NzModalService,
    ) { }
    ngOnInit() {
        this.language = this.$nzI18n.getLocaleData(LanguageEnum.energy);
        this.facilityLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
        this.formLanguage = this.$nzI18n.getLocaleData(LanguageEnum.form);
        this.productLanguage = this.$nzI18n.getLocaleData(LanguageEnum.product);
        this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
        this.$active.queryParams.subscribe((params) => {
            this.operateType = params.id ? OperateTypeEnum.update : OperateTypeEnum.add;
            // ????????????????????? ???????????????????????????
            this.pageTitle = params.id ? this.language.editEnergyNodes : this.language.insertEnergyNodes;

            this.getEquipmentType();
            this.handelInit(params);
        });
    }
    ngOnDestroy() {
        this.facilitiesSelector = null;
        this.positionByDeviceTemplate = null;
        this.existingEquipmentTmp = null;
        this.collectionFacSelector = null;
        this.collectionEquipmentSelector = null;
        this.collectionLoopSelector = null;
        this.communicationEquipmentor = null;
        this.modelByTypeTemplate = null;
        this.areaSelector = null;
        this.gatewayPortTemp = null;
    }

    /**
     * ????????????????????????????????????????????????????????????
     */
    private handelInit(params): void {
        const isEdit = this.operateType === OperateTypeEnum.update ? true : false;
        // ???????????????
        this.initArea();
        // ???????????????
        this.initColumn(isEdit, !isEdit);
        if (isEdit) {
            this.saveEquipmentModel.energyConsumptionNodeId = params.id;
            // ????????????
            this.queryEquipmentDetailById();
        }
    }

    /**
     * ??????????????????
     */
    private queryEquipmentDetailById(): void {
        this.pageLoading = true;
        this.$energyApiService
            .energyNodesQueryById_API({
                energyConsumptionNodeId: this.saveEquipmentModel.energyConsumptionNodeId,
            })
            .subscribe((result: any) => {
                this.pageLoading = false;
                if (result.code === ResultCodeEnum.success) {
                    console.log(result, 'result');
                    const getResult = result.data.equipmentInfo;
                    getResult.project = result.data.energyConsumptionNode.project;
                    getResult.remarks = result.data.energyConsumptionNode.remarks;
                    getResult.energyConsumptionTarget =
                        result.data.energyConsumptionNode.energyConsumptionTarget;
                    getResult.energyConsumptionNodeId =
                        result.data.energyConsumptionNode.energyConsumptionNodeId;
                    this.formStatus.resetData(getResult);
                    this.saveEquipmentModel.equipmentId = getResult.equipmentId;
                    this.saveEquipmentModel.relationEquipmentId = getResult.equipmentId;
                    this.saveEquipmentModel.equipmentInfo.supplierId = getResult.supplierId;
                    // ?????? isSelectExistDevice ?????? ???????????????????????? ??????????????????
                    this.saveEquipmentModel.isSelectExistDevice =
                        result.data.energyConsumptionNode.isSelectExistDevice;
                    this.productName = result.data.equipmentInfo.equipmentModel;
                    // ?????????????????????
                    if (result.data.energyConsumptionNode.isSelectExistDevice === EnergySelectedType.yes) {
                        this.setColumnDisplay('equipmentName', true);
                        this.setColumnDisplay('equipmentType', true);
                        this.setColumnDisplay('equipmentModel', true);
                        // this.setColumnDisplay('softwareVersion', true)
                        // this.setColumnDisplay('hardwareVersion', true)
                        this.setColumnDisplay('sequenceId', true);
                    } else {
                        this.setColumnHidden('facilities', false);
                        this.formStatus.resetControlData('facilities', true);
                        if (result.data.equipmentInfo.mountPosition) {
                            this.setColumnHidden('mountPosition', false);
                            // ?????????????????????????????????
                            this.findMountPositionById();
                            this.formStatus.resetControlData(
                                'mountPosition',
                                +result.data.equipmentInfo.mountPosition,
                            );
                            this.saveEquipmentModel.equipmentInfo.mountPosition = +result.data.equipmentInfo
                                .mountPosition;
                        }
                    }

                    this.saveEquipmentModel.equipmentInfo.deviceId = result.data.equipmentInfo.deviceId;
                    this.saveEquipmentModel.equipmentInfo.deviceType = result.data.equipmentInfo.deviceType;
                    this.saveEquipmentModel.equipmentInfo.deviceName = result.data.equipmentInfo.deviceName;

                    // ??????
                    this.formStatus.resetControlData('equipmentName', getResult.equipmentName);
                    // ??????
                    this.formStatus.resetControlData('equipmentType', getResult.equipmentType);
                    this.saveEquipmentModel.equipmentInfo.equipmentType = getResult.equipmentType;
                    // ??????
                    this.saveEquipmentModel.equipmentInfo.equipmentModel = getResult.equipmentModel;
                    // ??????
                    this.selectSelectProject.projectId = result.data.energyConsumptionNode.project
                    this.selectSelectProject.projectName = result.data.energyConsumptionNode.projectName
                    // ??????
                    this.selectedAreaName = result.data.areaInfo.areaName;
                    this.saveEquipmentModel.equipmentInfo.areaId = getResult.areaId;
                    this.saveEquipmentModel.equipmentInfo.areaCode = result.data.areaInfo.areaCode;
                    // ????????????
                    this.splitDeviceName = result.data.energyConsumptionNodeDeviceInfoList
                        .map((item) => item.deviceInfo.deviceName)
                        .join(',');
                    this.saveEquipmentModel.deviceIds = result.data.energyConsumptionNodeDeviceInfoList.map(
                        (item) => item.deviceId,
                    );
                    this.selectLinkDeviceIds = result.data.energyConsumptionNodeDeviceInfoList.map(
                        (item) => item.deviceInfo,
                    );
                    // ????????????
                    this.splitCollectEquipmentName = result.data.energyConsumptionNodeEquipmentInfoList
                        .map((item) => item.equipmentInfo.equipmentName)
                        .join(',');
                    this.saveEquipmentModel.equipmentIds = result.data.energyConsumptionNodeEquipmentInfoList.map(
                        (item) => item.equipmentId,
                    );
                    this.selectCollectionEquipment = result.data.energyConsumptionNodeEquipmentInfoList.map(
                        (item) => item.equipmentInfo,
                    );
                    // ????????????
                    this.splitCollectLoopName = result.data.energyConsumptionNodeLoopInfoList
                        .map((item) => item.loopInfo.loopName)
                        .join(',');
                    this.saveEquipmentModel.loopIds = result.data.energyConsumptionNodeLoopInfoList.map(
                        (item) => item.loopId,
                    );
                    this.selectLinkLoopIds = result.data.energyConsumptionNodeLoopInfoList.map(
                        (item) => item.loopInfo,
                    );
                    // ????????????
                    this.selectedTX = getResult.gatewayId;
                    this.saveEquipmentModel.equipmentInfo.gatewayId = getResult.gatewayId;
                    this.saveEquipmentModel.equipmentInfo.gatewayName = getResult.gatewayName;
                } else {
                    this.$message.error(result.msg);
                }
            });
    }

    // ???????????? ????????????
    private setColumnHidden(key: string, value: boolean): void {
        const formColumn = this.formColumn.find((item) => item.key === key);
        if (formColumn) {
            formColumn.hidden = value;
        }
    }
    // ?????? ?????? ?????? ?????? ??????
    private setColumnDisplay(key: string, value: boolean) {
        const formColumn = this.formColumn.find((item) => item.key === key);
        if (formColumn) {
            if (value) { this.formStatus.group.controls[key].disable(); } else { this.formStatus.group.controls[key].enable(); }
        }
    }

    // ??????????????????
    public getEquipmentType() {
        // ??????????????????????????????????????????????????????
        this.equipmentTypeList = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n);
        // if (this.isAddOperate) {
        //     // ?????????????????????????????????????????????????????????????????????
        //     this.equipmentTypeList =
        //         this.equipmentTypeList.filter((item) =>
        //             this.gatewayPortTypeList.includes(item.code)
        //         ) || []
        // }
    }
    /**
     *  ?????????????????????????????????
     */
    private handelTypeChange(typeCode: EquipmentTypeEnum): void {
        if (
            this.saveEquipmentModel.equipmentInfo.equipmentType &&
            typeCode !== this.saveEquipmentModel.equipmentInfo.equipmentType
        ) {
            this.resetData();
        }
        this.saveEquipmentModel.equipmentInfo.equipmentType = typeCode;
        // ??????????????????
        this.findMountPositionById();
        if (!typeCode) { return; }
        this.$equipmentAipService
            .getDeviceModelByType({ type: typeCode, typeObject: TYPE_OBJECT_CONST })
            .subscribe((result: ResultModel<EquipmentModelModel[]>) => {
                if (result.code === ResultCodeEnum.success) {
                    this.modelChangeValue = result.data;
                }
            });
    }
    /**
     * ??????????????????????????????
     */
    private queryGatewayPort(type: QueryGatewayPortEnum): void {
        //  ??????????????????
        this.$energyApiService
            .queryGatewayPort_API({
                gatewayId: this.saveEquipmentModel.equipmentInfo.gatewayId,
            })
            .subscribe((result: ResultModel<string[]>) => {
                if (result.code === ResultCodeEnum.success) {
                    if (type === QueryGatewayPortEnum.gateway) {
                        this.gatewayPortList = result.data || [];
                    }
                } else {
                    this.$message.error(result.msg);
                }
            });
    }

    /**
     * ?????????????????????????????????????????????
     */
    private resetData(): void {
        this.formStatus.resetControlData('equipmentModel', null);
    }

    // ????????????????????????????????? ??? ???????????????????????? flag === true ??????????????????????????? flag === false ????????????
    changeExistDeviceReastValue(flag) {
        this.formStatus.resetControlData('existingEquipment', null); // ????????????
        this.formStatus.resetControlData('equipmentName', null); //  ??????
        this.formStatus.resetControlData('equipmentType', null); // ??????
        this.formStatus.resetControlData('equipmentModel', null); // ??????
        this.formStatus.resetControlData('scrapTime', null); // ????????????
        this.formStatus.resetControlData('equipmentCode', null); // ????????????

        this.formStatus.resetControlData('supplier', null); // ?????????
        this.formStatus.resetControlData('softwareVersion', null); // ???????????????
        this.formStatus.resetControlData('hardwareVersion', null); // ???????????????
        this.formStatus.resetControlData('energyConsumptionTarget', null); // ???????????????
        this.formStatus.resetControlData('sequenceId', null); // ??????ID
        this.formStatus.resetControlData('project', null); // ??????

        this.formStatus.resetControlData('address', null);
        this.formStatus.resetControlData('areaId', null);
        this.formStatus.resetControlData('portNo', null);
        this.saveEquipmentModel.resultData();
        this.saveEquipmentModel.isSelectExistDevice = flag ? 1 : 0;
        this.splitCollectEquipmentName = '';
        this.splitCollectLoopName = '';
        this.splitDeviceName = '';
        this.selectedAreaName = '';
        this.selectLinkDeviceIds = [];
        this.selectLinkLoopIds = [];
        this.selectCollectionEquipment = [];
        this.selectedTX = null;
        this.selectedYY = null;
        this.existingEquipmentValue = null;
        this.productName = null;
        this.productTempDisabled = flag;

        // ????????????
        this.setColumnHidden('facilities', flag);
        // ?????? ????????????
        this.setColumnHidden('portNo', true);

        this.setColumnHidden('existingEquipment', !flag);
        // ??????
        this.setColumnDisplay('equipmentName', flag);
        // ??????
        this.setColumnDisplay('equipmentType', flag);
        // ??????
        this.setColumnDisplay('equipmentModel', flag);
        // ??????
        this.setColumnDisplay('areaId', flag);
        // ????????????
        this.setColumnDisplay('gatewayName', flag);
        // ????????????
        this.setColumnDisplay('address', flag);
        // ????????????
        this.setColumnDisplay('equipmentCode', flag);

        // ????????????
        // this.setColumnDisplay('softwareVersion', flag)
        // ????????????
        // this.setColumnDisplay('hardwareVersion', flag)
        this.setColumnDisplay('sequenceId', flag);

        this.formStatus.group.updateValueAndValidity();
    }

    // ?????????????????????
    private initColumn(hidden: boolean, disabled: boolean): void {
        this.formColumn = [
            // ????????????
            {
                label: this.language.existingEquipment,
                key: 'existingEquipment',
                type: 'custom',
                hidden,
                template: this.existingEquipmentTmp,
                require: !hidden,
                rule: [
                    { required: !hidden },
                    RuleUtil.getNameMaxLengthRule(),
                    this.$ruleUtil.getNameRule(),
                ],
                customRules: [this.$ruleUtil.getNameCustomRule()],
                asyncRules: [],
            },
            // ??????
            {
                label: this.language.energyConsumptionName,
                key: 'equipmentName',
                type: 'input',
                require: true,
                disabled,
                rule: [{ required: true }, RuleUtil.getNameMaxLengthRule(), this.$ruleUtil.getNameRule()],
                customRules: [this.$ruleUtil.getNameCustomRule()],
                asyncRules: [
                    this.$ruleUtil.getNameAsyncRule(
                        (value) =>
                            this.$energyApiService.queryEnergyNodesNameIsExist_API({
                                equipmentId: this.saveEquipmentModel.equipmentId,
                                equipmentName: value,
                            }),
                        (res) => res.data,
                    ),
                ],
            },
            // ??????
            {
                label: this.language.productTypeId,
                key: 'equipmentType',
                type: 'select',
                disabled,
                selectInfo: {
                    data: FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n).filter(
                        (item) => item.code === EquipmentTypeEnum.centralController,
                    ),
                    label: 'label',
                    value: 'code',
                },
                require: true,
                rule: [{ required: true }],
                asyncRules: [],
                modelChange: (controls, $event) => {
                    this.handelTypeChange($event);
                    this._selectedProduct = null;
                    this.selectedProductId = null;
                },
            },
            // ??????
            {
                label: this.language.productModel,
                key: 'equipmentModel',
                type: 'custom',
                require: true,
                disabled,
                template: this.modelByTypeTemplate,
                rule: [{ required: true }],
                asyncRules: [],
            },
            // ?????????
            {
                label: this.language.supplier,
                key: 'supplier',
                type: 'input',
                disabled: true,
                require: true,
                rule: [{ required: true }],
                asyncRules: [],
            },
            // ????????????
            {
                label: this.facilityLanguage.scrapTime,
                key: 'scrapTime',
                type: 'input',
                disabled: true,
                col: 24,
                require: false,
                rule: [],
            },
            // ????????????
            {
                label: this.facilityLanguage.deviceCode,
                key: 'equipmentCode',
                type: 'input',
                col: 24,
                disabled:true,
                require: false,
                rule: [],
                asyncRules: [
                    // ??????????????????????????????
                    this.$ruleUtil.getNameAsyncRule(
                        (value) =>
                            this.$equipmentAipService.queryEquipmentCodeIsExist({
                                equipmentCode: value,
                                equipmentId: this.saveEquipmentModel.equipmentId,
                            }),
                        (res) => res.data,
                        this.language.equipmentCodeExist,
                    ),
                ],
            },
            // ???????????????
            {
                label: this.language.softwareVersionNumber,
                key: 'softwareVersion',
                type: 'input',
                disabled: true,
                rule: [],
                asyncRules: [],
            },
            // ???????????????
            {
                label: this.language.hardwareVersionNumber,
                key: 'hardwareVersion',
                type: 'input',
                disabled: true,
                rule: [],
                asyncRules: [],
            },
            // ??????id
            {
                label: this.language.equipmentId,
                key: 'sequenceId',
                type: 'input',
                disabled,
                rule: [this.$ruleUtil.getRemarkMaxLengthRule()],
                asyncRules: [
                    this.$ruleUtil.getNameAsyncRule(
                        (value) =>
                            this.$equipmentAipService.querySequenceIdIsExist({
                                equipmentId: this.saveEquipmentModel.equipmentId,
                                sequenceId: value,
                            }),
                        (res) => res.data,
                        this.facilityLanguage.sequenceIdExist,
                    ),
                ],
            },
            {
                // ????????????
                label: this.language.communicationEquipment,
                key: 'gatewayName',
                type: 'input',
                rule: [],
                disabled: true,
                asyncRules: [],
            },
            // ??????
            //   {
            //     label: this.language.projectId,
            //     key: 'project',
            //     type: 'select',
            //     selectInfo: {
            //       data: [],
            //       label: 'projectName',
            //       value: 'projectId',
            //     },
            //     rule: [],
            //     asyncRules: [],
            //   },
            { // ????????????
                label: this.language.projectId,
                key: 'projectId',
                type: 'custom',
                template: this.projectSelector,
                rule: [],
                asyncRules: []
            },
            // ????????????
            {
                label: this.language.nodesDetails.facilities,
                key: 'facilities',
                type: 'custom',
                hidden: true,
                template: this.facilitiesSelector,
                require: true,
                rule: [{ required: true }],
            },
            // ????????????
            {
                label: this.language.mountPosition,
                key: 'mountPosition',
                type: 'custom',
                hidden: true,
                template: this.positionByDeviceTemplate,
                rule: [],
            },
            // ??????
            {
                label: this.language.areaId,
                key: 'areaId',
                type: 'custom',
                template: this.areaSelector,
                require: true,
                disabled,
                rule: [{ required: true }],
                asyncRules: [],
            },
            // ????????????
            {
                label: this.language.collectDeviceId,
                key: 'collectDeviceName',
                type: 'custom',
                template: this.collectionFacSelector,
                rule: [],
                asyncRules: [],
            },
            {
                label: this.language.collectEquipmentId,
                key: 'collectEquipmentType',
                type: 'custom',
                template: this.collectionEquipmentSelector,
                rule: [],
                asyncRules: [],
            },
            {
                // ????????????
                label: this.language.collectLoopId,
                key: 'loopName',
                template: this.collectionLoopSelector,
                type: 'custom',
                rule: [],
                asyncRules: [],
            },
            {
                // ???????????????
                label: this.language.energyConsumptionTarget,
                key: 'energyConsumptionTarget',
                type: 'input',
                rule: [this.$ruleUtil.getEnergyNodesTargetValue()],
                asyncRules: [],
            },
            {
                // ????????????
                label: this.language.detailedAddress,
                key: 'address',
                type: 'input',
                disabled,
                require: true,
                rule: [{ required: true }, this.$ruleUtil.getRemarkMaxLengthRule()],
            },
            {
                // ??????
                label: this.language.remarks,
                key: 'remarks',
                type: 'textarea',
                col: 24,
                rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
                customRules: [this.$ruleUtil.getNameCustomRule()],
            },
        ];
    }


    // ??????????????????
    public formInstance(event: { instance: FormOperate }): void {
        this.formStatus = event.instance;
        const projectIdCol: FormItem = this.formStatus.getColumn('project').item;
        // ??????????????????
        // this.$facilityApiService.getProjectList().subscribe((result: ResultModel<Array<Project>>) => {
        //     if (result.code === ResultCodeEnum.success) {
        //         projectIdCol.selectInfo.data = result.data || [];
        //     } else {
        //         this.$modalService.error(result.msg);
        //     }
        // });
        // ????????????
        event.instance.group.statusChanges.subscribe(() => {
            this.isDisabled = !event.instance.getRealValid();
            this.getFormDisabled.emit(this.isDisabled);
        });
        this.getFormStatus.emit(this.formStatus);
    }

    /** ???????????? ???????????? ??????????????? ?????? */
    equmentModalClick(type) {
        this.equipmentModalType = type;
        if (type === EnergyOpearEquipmentTXEnum.equipment) {
            this.equipmentedVisible = true;
            this.selectedEquipmentId = this.selectedYY;
            this.tableTitle = this.language.existingEquipment;
        }
        if (type === EnergyOpearEquipmentTXEnum.communication) {
            if (this.saveEquipmentModel.isSelectExistDevice) { return; }
            this.equipmentedVisible = true;
            this.gatewayFilter = [
                new FilterCondition('equipmentType', OperatorEnum.in, [
                    EquipmentTypeEnum.gateway,
                    EquipmentTypeEnum.centralController,
                ]),
            ];
            this.selectedEquipmentId = this.selectedTX;
            this.tableTitle = this.language.communicationEquipment;
        }
    }
    // ????????????type ===1 ???????????? type === 2 ???????????? type === 3 ??????????????? ??????
    onExistEquipmentDataChange(event) {
      // ?????????????????????
      const key = Object.keys(this.formStatus.group.getRawValue());
      key.forEach( d =>{
        this.formStatus.resetControlData(d, null);
      })
      this.selectSelectProject = {};
      this.saveEquipmentModel.resultData();
      this.splitCollectEquipmentName = '';
      this.splitDeviceName = '';
      this.splitCollectLoopName = '';
      // ?????????????????????
      this.selectLinkDeviceIds = [];
      // ?????????????????????
      this.selectLinkLoopIds = [];
      // ?????????????????????
      this.selectCollectionEquipment = [];
      const { data, type } = event;
        // ????????????
        if (type === EnergyOpearEquipmentTXEnum.equipment) {
            if (data.length === 0) {
                this.selectedYY = null;
                this.existingEquipmentValue = null;
                this.formStatus.resetControlData('existingEquipment', null);
                this.formStatus.resetControlData('equipmentName', null);
                this.formStatus.resetControlData('equipmentType', null);
                this.formStatus.resetControlData('equipmentModel', null);
                this.formStatus.resetControlData('equipmentCode', null);
                this.formStatus.resetControlData('scrapTime', null);
                this.formStatus.resetControlData('address', null);
                this.formStatus.resetControlData('areaId', null);
                this.formStatus.resetControlData('sequenceId', null);
                this.formStatus.resetControlData('supplier', null);
                this.formStatus.resetControlData('softwareVersion', null);
                this.formStatus.resetControlData('hardwareVersion', null);
                this.formStatus.resetControlData('gatewayName', null);
                this.selectedAreaName = null;
                this.productName = null;
                this.saveEquipmentModel.relationEquipmentId = null;

                this.saveEquipmentModel.equipmentInfo.equipmentModel = null;
                this.saveEquipmentModel.equipmentInfo.equipmentType = null;
                this.saveEquipmentModel.equipmentInfo.gatewayName = null;

                this.saveEquipmentModel.equipmentInfo.address = null;
                this.saveEquipmentModel.equipmentInfo.areaId = null;
                this.saveEquipmentModel.equipmentInfo.areaCode = null;
                return;
            }
            this.selectedYY = data[0].equipmentId;
            this.existingEquipmentValue = data[0].equipmentName;
            this.formStatus.resetControlData('existingEquipment', data[0].equipmentName);
            this.formStatus.resetControlData('equipmentName', data[0].equipmentName);
            this.formStatus.resetControlData('equipmentType', data[0].equipmentType);
            this.formStatus.resetControlData('equipmentModel', data[0].equipmentModel);
            this.formStatus.resetControlData('equipmentCode', data[0].equipmentCode);
            this.formStatus.resetControlData('scrapTime', data[0].scrapTime);
            this.formStatus.resetControlData('address', data[0].address);
            this.formStatus.resetControlData('areaId', data[0].areaId);
            this.formStatus.resetControlData('sequenceId', data[0].sequenceId);
            this.formStatus.resetControlData('supplier', data[0].supplier);
            this.formStatus.resetControlData('softwareVersion', data[0].softwareVersion);
            this.formStatus.resetControlData('hardwareVersion', data[0].hardwareVersion);
            this.formStatus.resetControlData('gatewayName', data[0].gatewayName);
            this.selectedAreaName = data[0].areaInfo.areaName;
            this.productName = data[0].equipmentModel;
            this.saveEquipmentModel.relationEquipmentId = data[0].equipmentId;

            this.saveEquipmentModel.equipmentInfo.equipmentModel = data[0].equipmentModel;
            this.saveEquipmentModel.equipmentInfo.equipmentType = data[0].equipmentType;
            this.saveEquipmentModel.equipmentInfo.gatewayName = data[0].gatewayName;
            this.saveEquipmentModel.equipmentInfo.supplierId = data[0].supplierId;
            this.saveEquipmentModel.equipmentInfo.address = data[0].address;
            this.saveEquipmentModel.equipmentInfo.areaId = data[0].areaInfo.areaId;
            this.saveEquipmentModel.equipmentInfo.areaCode = data[0].areaInfo.areaCode;
            this.saveEquipmentModel.equipmentInfo.deviceId = data[0].deviceId;
            this.saveEquipmentModel.equipmentInfo.deviceType = data[0].deviceType;

        } else if (type === EnergyOpearEquipmentTXEnum.communication) {
            // ??????????????????
            this.formStatus.resetControlData('portNo', null);
            if (data.length === 0) {
                this.saveEquipmentModel.equipmentInfo.gatewayName = null;
                this.saveEquipmentModel.equipmentInfo.gatewayId = null;
                this.saveEquipmentModel.equipmentInfo.equipmentControlType = null;
                this.selectedTX = null;
                this.setColumnHidden('portNo', true);
                return;
            }
            this.selectedTX = data[0].equipmentId;
            this.saveEquipmentModel.equipmentInfo.gatewayName = data[0].equipmentName;
            this.saveEquipmentModel.equipmentInfo.gatewayId = data[0].equipmentId;
            this.saveEquipmentModel.equipmentInfo.equipmentControlType = data[0].equipmentType;

            // ??????????????????
            if (data[0].equipmentType === 'E001') {
                // ??????????????????????????????
                this.queryGatewayPort(QueryGatewayPortEnum.gateway);
                this.setColumnHidden('portNo', false);
            } else {
                this.setColumnHidden('portNo', true);
            }
            this.formStatus.group.updateValueAndValidity();
        }
    }
    /**
     * ????????????modal
     */
    public showProductSelectorModal(): void {
        if (!this.saveEquipmentModel.equipmentInfo.equipmentType) {
            this.$message.info('????????????????????????');
            return;
        }
        this.initTableConfig();
        this.queryCondition.filterConditions = [];
        const modal = this.$tempModal.create({
            nzTitle: this.productLanguage.select + this.productLanguage.productModel,
            nzContent: this.equipmentSelect,
            nzOkType: 'danger',
            nzClassName: 'custom-create-modal',
            nzMaskClosable: false,
            nzWidth: 1000,
            nzFooter: [
                {
                    label: this.commonLanguage.confirm,
                    onClick: () => {
                        this.selectAlarm(modal);
                    },
                },
                {
                    label: this.commonLanguage.cancel,
                    type: 'danger',
                    onClick: () => {
                        this._dataSet = [];
                        modal.destroy();
                    },
                },
            ],
        });
        modal.afterOpen.subscribe(() => {
            this.queryProductList();
        });
        modal.afterClose.subscribe(() => {
            this.tableCom.queryTerm = null;
        });
    }
    /**
     * ??????????????????
     */
    private queryProductList(): void {
        this.tableConfig.isLoading = true;
        const hasCode = this.queryCondition.filterConditions.filter(
            (item) => item.filterField === 'typeCode',
        );
        if (hasCode.length === 0) {
            this.queryCondition.filterConditions.push(
                new FilterCondition('typeCode', OperatorEnum.in, [
                    this.saveEquipmentModel.equipmentInfo.equipmentType,
                ]),
            );
        } else {
            this.queryCondition.filterConditions.forEach((item) => {
                if (item.filterField === 'typeCode') {
                    item.filterValue = [this.saveEquipmentModel.equipmentInfo.equipmentType];
                }
            });
        }
        this.$productCommonService.queryProductList(this.queryCondition).subscribe(
            (res: ResultModel<any>) => {
                if (res.code === ResultCodeEnum.success) {
                    this._dataSet = res.data || [];
                    this.pageBean.pageIndex = res.pageNum;
                    this.pageBean.Total = res.totalCount;
                    this.pageBean.pageSize = res.size;
                    this.tableConfig.isLoading = false;
                    // ??????????????????????????????
                    if (!_.isEmpty(this._dataSet)) {
                        this._dataSet.forEach((item) => {
                            if (String(item.typeFlag) === String(ProductTypeEnum.facility)) {
                                item.iconClass = CommonUtil.getFacilityIConClass(item.typeCode);
                            } else {
                                item.iconClass = CommonUtil.getEquipmentTypeIcon(item as EquipmentListModel);
                            }
                            // ???????????????????????????????????????????????????
                            item.showPoleUpdate = item.fileExist && item.typeCode === DeviceTypeEnum.wisdom;
                            item.showPoleUpload = !item.fileExist && item.typeCode === DeviceTypeEnum.wisdom;
                            // ????????????????????????????????????????????????
                            item.showGatewayUpdate = item.fileExist && item.typeCode === EquipmentTypeEnum.gateway;
                            item.showGatewayUpload =
                                !item.fileExist && item.typeCode === EquipmentTypeEnum.gateway;
                            // ?????????????????????????????? ??????
                            item.showConfigTemplate = item.typeFlag === ProductTypeEnum.equipment;
                        });
                    }
                } else {
                    this.$message.error(res.msg);
                    this.tableConfig.isLoading = false;
                }
            },
            () => {
                this.tableConfig.isLoading = false;
            },
        );
    }

    /**
     * ????????????     ???????????????
     * param modal
     */
    private selectAlarm(modal): void {
        if (this._selectedProduct) {
            console.log(this._selectedProduct);
            this.productName = this._selectedProduct.productModel;
            // const tempModel = this.modelChangeValue.find(item => item.model === event);
            // if (tempModel) {
            // this.saveEquipmentModel.equipmentModel = event;
            this.saveEquipmentModel.equipmentInfo.equipmentModel = this._selectedProduct.productModel;
            this.formStatus.resetControlData('supplier', this._selectedProduct.supplierName);
            this.formStatus.resetControlData('scrapTime', this._selectedProduct.scrapTime);
            this.formStatus.resetControlData('equipmentModel', true); // ??????
            if (this.saveEquipmentModel.isSelectExistDevice === EnergySelectedType.no) {
                this.formStatus.resetControlData('softwareVersion', this._selectedProduct.softwareVersion);
                this.formStatus.resetControlData('hardwareVersion', this._selectedProduct.hardwareVersion);
                this.saveEquipmentModel.equipmentInfo.supplierId = this._selectedProduct.supplier;
            }
            // }
            // this.getExtraRequest.emit(this.saveEquipmentModel);
            modal.destroy();
        } else {
            this.$message.warning('??????????????????');
        }
    }

    private initTableConfig(): void {
        this.tableConfig = {
            isDraggable: true,
            isLoading: true,
            outHeight: 108,
            showSizeChanger: true,
            notShowPrint: true,
            showSearchSwitch: true,
            showPagination: true,
            scroll: { x: '1804px', y: '340px' },
            noIndex: true,
            columnConfig: [
                {
                    title: '',
                    type: 'render',
                    key: 'selectedProductId',
                    renderTemplate: this.radioTemp,
                    fixedStyle: { fixedLeft: true, style: { left: '0px' } },
                    width: 42,
                },
                {
                    // ??????
                    type: 'serial-number',
                    width: 62,
                    title: this.productLanguage.serialNum,
                    fixedStyle: { fixedLeft: true, style: { left: '42px' } },
                },
                {
                    // ????????????
                    title: this.productLanguage.productModel,
                    key: 'productModel',
                    width: 150,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // ??????
                    title: this.productLanguage.model,
                    key: 'typeCode',
                    width: 150,
                    type: 'render',
                    renderTemplate: this.productTypeTemplate,
                    isShowSort: true,
                },
                {
                    // ?????????
                    title: this.productLanguage.supplier,
                    key: 'supplierName',
                    width: 150,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // ????????????
                    title: this.productLanguage.scrapTime,
                    key: 'scrapTime',
                    width: 100,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // ????????????
                    title: this.productLanguage.softVersion,
                    key: 'softwareVersion',
                    width: 150,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // ????????????
                    title: this.productLanguage.hardWareVersion,
                    key: 'hardwareVersion',
                    width: 150,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // ?????????
                    title: this.productLanguage.operate,
                    searchable: true,
                    searchConfig: { type: 'operate' },
                    key: '',
                    width: 180,
                    fixedStyle: { fixedRight: true, style: { right: '0px' } },
                },
            ],
            sort: (event: SortCondition) => {
                this.queryCondition.sortCondition = event;
                this.queryProductList();
            },
            handleSearch: (event: FilterCondition[]) => {
                event.forEach((item) => {
                    if (item.filterField === 'scrapTime') {
                        item.operator = 'eq';
                    }
                });
                this.queryCondition.filterConditions = event;
                this.queryProductList();
            },
        };
    }
    /**
     * ????????????
     * param event
     * param data
     */
    public selectedProductChange(event: boolean, data: any): void {
        this._selectedProduct = data;
    }

    /**
     * ????????????????????????
     */
    public pageChange(event: PageModel): void {
        this.queryCondition.pageCondition.pageSize = event.pageSize;
        this.queryCondition.pageCondition.pageNum = event.pageIndex;
        this.queryProductList();
    }

    // ???????????? ???????????? ???????????? ????????? ??????
    modelShowClick(type: EnergyInsertCollectionTypeEnum) {
        let flag: boolean;
        let id: string;
        // ??????????????? ????????? ????????????????????? true ????????????????????? false ??????????????????
        if (this.operateType === OperateTypeEnum.add) {
            flag = this.saveEquipmentModel.isSelectExistDevice === EnergySelectedType.yes;
            id = this.saveEquipmentModel.relationEquipmentId;
        } else if (this.operateType === OperateTypeEnum.update) {
            flag = true;
            id = this.saveEquipmentModel.equipmentId;
        }
        if (
            !this.saveEquipmentModel.relationEquipmentId &&
            flag &&
            this.operateType === OperateTypeEnum.add
        ) {
            return this.$message.warning(this.language.picInfo.pleaceChooseSelected);
        }
        if (type === EnergyInsertCollectionTypeEnum.device) {
            this.conlectionSSVisible = true;
            this.energyBizParams = {};
            this.energyBizParams = {
                gatewayId: flag ? id : '.',
            };
        } else if (type === EnergyInsertCollectionTypeEnum.equipment) {
            this.collectionEquipmentVisible = true;
            this.energyEquipmentBizParams = {};
            if (flag) {
                this.energyEquipmentBizParams = {
                    relationEquipmentId: id,
                    gatewayId: id,
                };
            } else {
                this.energyEquipmentBizParams = {
                    relationEquipmentId: 'none',
                };
            }

            this.collectionEquipmentFilterData = [];
            // ???????????? ????????????
            this.collectionEquipmentFilterData.push({
                filterField: 'equipmentType',
                filterValue: [EquipmentTypeEnum.singleLightController, EquipmentTypeEnum.centralController],
                operator: OperatorEnum.in,
            });
            this.collectionEquipmentFilterData.push({
                filterField: 'gatewayId',
                filterValue: flag ? id : '.',
                operator: OperatorEnum.like,
            });
            // this.collectionEquipmentFilterData.push({
            //     filterField: 'equipmentModels',
            //     filterValue: ['ZC_Single_light', 'ZCPLC', 'FDPLC'],
            //     operator: OperatorEnum.in
            // })
        } else if (type === EnergyInsertCollectionTypeEnum.loop) {
            this.collectionHLVisible = true;
            this.loopFilterConditions = [];
            // ???????????? ????????????
            this.loopFilterConditions.push({
                filterField: 'centralizedControlId',
                filterValue: flag ? id : '.',
                operator: OperatorEnum.like,
            });
        }
    }




    /**
     *  ???????????? ?????????????????????
     */
    public facilitieSelectDataChange(event: FacilityListModel): void {
        if (!_.isEmpty(event)) {
            // ??????????????????????????? ???????????????????????????????????????????????????????????????
            const tempData = event[0];
            console.log(tempData, 'tempData');
            this.saveEquipmentModel.equipmentInfo.deviceName = tempData.deviceName;
            this.saveEquipmentModel.equipmentInfo.deviceId = tempData.deviceId;
            this.saveEquipmentModel.equipmentInfo.deviceType = tempData.deviceType;
            this.saveEquipmentModel.equipmentInfo.address = tempData.address;
            this.saveEquipmentModel.equipmentInfo.areaId = tempData.areaInfo.areaId;
            this.saveEquipmentModel.equipmentInfo.areaCode = tempData.areaInfo.areaCode;
            // ????????????????????????????????????????????????????????????
            this.areaInfo = tempData.areaInfo;

            this.selectedAreaName = tempData.areaInfo.areaName;
            this.formStatus.resetControlData('facilities', tempData.deviceId);
            this.formStatus.resetControlData('address', tempData.address);
            this.formStatus.resetControlData('areaId', tempData.areaInfo.areaId);

            // this.selectDeviceInfo = tempData
            // ??????????????????
            this.formStatus.resetControlData('mountPosition', null, { emitEvent: true });
            // ?????????????????????????????????
            this.findMountPositionById();
            // ????????????
            FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, this.areaInfo.areaId);
            // ?????????????????? ????????? ????????????
            if (tempData.deviceType === DeviceTypeEnum.wisdom) {
                this.setColumnHidden('mountPosition', false);
            } else if (tempData.deviceType === DeviceTypeEnum.distributionPanel) {
                this.setColumnHidden('mountPosition', true);
            }
            this.formStatus.group.updateValueAndValidity();
        }
        this.getExtraRequest.emit(this.saveEquipmentModel);
    }
    /**
     * ???????????????????????????
     */
    public openPosition(): void {
        if (
            !this.saveEquipmentModel.equipmentInfo.deviceId ||
            !this.saveEquipmentModel.equipmentInfo.equipmentType
        ) {
            this.$message.info(this.language.picInfo.pleaseChooseEquipmentType);
            return;
        }
    }
    /**
     * ??????????????????id?????????????????????????????????
     */
    private findMountPositionById(): void {
        const deviceId = this.saveEquipmentModel.equipmentInfo.deviceId;
        const queryBody = {
            equipmentId: this.saveEquipmentModel.equipmentId,
            deviceId: deviceId,
            mountPosition: this.saveEquipmentModel.equipmentInfo.mountPosition,
            equipmentType: this.saveEquipmentModel.equipmentInfo.equipmentType,
        };
        // ??????????????????
        this.$equipmentAipService
            .findMountPositionById(queryBody)
            .subscribe((result: ResultModel<string[]>) => {
                if (result.code === ResultCodeEnum.success) {
                    this.positionSelectList = result.data || [];
                } else {
                    this.$message.error(result.msg);
                }
            });
    }
    /**
     * ??????????????????
     */
    public onClickShowArea(): void {
        if (this.saveEquipmentModel.isSelectExistDevice) { return; }
        this.initArea();
        this.areaSelectVisible = true;
    }
    /**
     * ???????????????
     */
    private initArea(): void {
        const queryBody = { bizCondition: { level: '' } };
        this.$equipmentAipService
            .queryAreaListForPageSelection(queryBody)
            .subscribe((result: ResultModel<NzTreeNode[]>) => {
                this.areaNodes = result.data;
                // ?????????????????????????????????
                FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, this.areaInfo.areaId);
                this.initAreaConfig(result.data);
            });
    }
    /**
     *  ???????????????
     */
    private initAreaConfig(nodes: NzTreeNode[]): void {
        this.areaSelectorConfig = {
            width: '500px',
            title: this.language.selectArea,
            height: '300px',
            treeSetting: {
                check: {
                    enable: true,
                    chkStyle: 'checkbox',
                    chkboxType: { Y: '', N: '' },
                },
                data: {
                    simpleData: { enable: true, idKey: 'areaId' },
                    key: { name: 'areaName' },
                },
                view: { showIcon: false, showLine: false },
            },
            treeNodes: nodes,
        };
    }
    /**
     * ????????????
     */
    public areaSelectChange(event: AreaModel[]): void {
        console.log(event, 'event');
        if (!_.isEmpty(event)) {
            this.areaInfo = event[0];
            FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, this.areaInfo.areaId);
            this.selectedAreaName = this.areaInfo.areaName;
            this.saveEquipmentModel.equipmentInfo.areaId = this.areaInfo.areaId;
            this.saveEquipmentModel.equipmentInfo.areaCode = this.areaInfo.areaCode;
            this.formStatus.resetControlData('areaId', this.areaInfo.areaId);
        } else {
            this.areaInfo = null;
            FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, null);
            this.selectedAreaName = '';
            this.saveEquipmentModel.equipmentInfo.areaId = null;
            this.saveEquipmentModel.equipmentInfo.address = null;
            this.saveEquipmentModel.equipmentInfo.areaCode = null;
            this.formStatus.resetControlData('areaId', null);
        }
        this.getExtraRequest.emit(this.saveEquipmentModel);
    }

    /**
    * ?????????????????????
    */
    public showProjectSelectorModal(): void {
        this.projectSelectVisible = true;
    }
    // ?????????????????????  ??????????????? ??????
    public projectSelectChange(event): void {
        if (!_.isEmpty(event)) {
            this.selectSelectProject = event[0];
        }
    }

    // ????????????  ??????????????? ??????
    onCollectionDataChange(event: FacilityListModel[]) {
        console.log(event, 'event');
        // ??????????????????????????????
        this.splitDeviceName = '';
        this.selectLinkDeviceIds = event;
        const deviceIds = [];
        const selectLinkDeviceName = [];
        if (!_.isEmpty(event)) {
            event.forEach((item) => {
                selectLinkDeviceName.push(item.deviceName);
                deviceIds.push(item.deviceId);
            });
            this.splitDeviceName = selectLinkDeviceName.join(',');
        } else { this.splitDeviceName = null; }
        this.saveEquipmentModel.deviceIds = deviceIds;
    }

    // ?????????????????????????????????
    onSelectEquipment(event: EquipmentListModel[]) {
        this.selectCollectionEquipment = event;
        console.log(event, 'event');
        const deviceIds = [];
        const selectLinkName = [];
        if (!_.isEmpty(event)) {
            event.forEach((item) => {
                selectLinkName.push(item.equipmentName);
                deviceIds.push(item.equipmentId);
            });
            this.splitCollectEquipmentName = selectLinkName.join(',');
        } else { this.splitCollectEquipmentName = null; }
        this.saveEquipmentModel.equipmentIds = deviceIds;
    }

    // ?????? ??????????????? ??????
    onCollectionHLDataChange(event: LoopListModel[]) {
        console.log(event, 'event');
        this.selectLinkLoopIds = event;
        const deviceIds = [];
        const selectLinkName = [];
        if (!_.isEmpty(event)) {
            event.forEach((item) => {
                selectLinkName.push(item.loopName);
                deviceIds.push(item.loopId);
            });
            this.splitCollectLoopName = selectLinkName.join(',');
        } else { this.splitCollectLoopName = null; }
        this.saveEquipmentModel.loopIds = deviceIds;
    }

    // ?????? ?????? ??????
    public addFacility(): void {
        const { deviceIds, equipmentIds, loopIds } = this.saveEquipmentModel;
        // ?????????????????? ???????????? ???????????? ???????????? ???????????????????????????
        if (
            deviceIds.length === 0 &&
            equipmentIds.length === 0 &&
            loopIds.length === 0 &&
            this.saveEquipmentModel.isSelectExistDevice === EnergySelectedType.yes
        ) {
            return this.$message.error(this.language.picInfo.mustChooseOne);
        }
        const formValue = _.cloneDeep(this.formStatus.group.getRawValue());

        const inputValue: EnergyNodesAddInfoModel = _.cloneDeep(this.saveEquipmentModel);

        inputValue.project =  this.selectSelectProject.projectId;
        inputValue.projectName = this.selectSelectProject.projectName;
        inputValue.energyConsumptionTarget = formValue.energyConsumptionTarget;
        inputValue.remarks = formValue.remarks;
        inputValue.equipmentName = formValue.equipmentName;

        inputValue.equipmentInfo.sequenceId = formValue.sequenceId;
        inputValue.equipmentInfo.equipmentCode = formValue.equipmentCode;
        inputValue.equipmentInfo.scrapTime = formValue.scrapTime;
        inputValue.equipmentInfo.supplier = formValue.supplier;
        inputValue.equipmentInfo.softwareVersion = formValue.softwareVersion;
        inputValue.equipmentInfo.hardwareVersion = formValue.hardwareVersion;
        inputValue.equipmentInfo.portNo = formValue.portNo;
        inputValue.equipmentInfo.address = formValue.address;
        inputValue.equipmentInfo.mountPosition = formValue.mountPosition;
        console.log(inputValue,"inputValue");
        this.pageLoading = true;
        // return
        // ??????
        if (this.operateType === OperateTypeEnum.add) {
            this.$energyApiService.energyNodesInsert_API(inputValue).subscribe(
                (result: ResultModel<string>) => {
                    console.log(result, 'result');
                    if (result.code === ResultCodeEnum.success) {
                        this.$message.success(this.language.insertEnergyNodesSuccess);
                        this.goBack();
                    } else {
                        this.pageLoading = false;
                        this.$message.error(result.msg);
                    }
                },
                () => (this.pageLoading = false),
            );
        } else if (this.operateType === OperateTypeEnum.update) {
            this.$energyApiService.energyNodesUpdate_API(inputValue).subscribe(
                (result: ResultModel<string>) => {
                    console.log(result, 'result');
                    if (result.code === ResultCodeEnum.success) {
                        this.$message.success(this.language.updateEnergyNodesSuccess);
                        this.goBack();
                    } else {
                        this.pageLoading = false;
                        this.$message.error(result.msg);
                    }
                },
                () => (this.pageLoading = false),
            );
            this.pageLoading = false;
        }
    }

    // ??????
    public goBack(): void {
        this.$router.navigateByUrl(`business/energy/energy-nodes`).then();
    }
}
