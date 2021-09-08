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
    // 已有设备模板
    @ViewChild('existingEquipmentTmp') private existingEquipmentTmp: TemplateRef<HTMLDocument>;
    existingEquipmentValue;

    // 所属设施 表单显示模版
    @ViewChild('facilitiesSelector') private facilitiesSelector: TemplateRef<HTMLDocument>;
    // 挂载位置
    @ViewChild('positionByDeviceTemplate')
    private positionByDeviceTemplate: TemplateRef<HTMLDocument>;
    // 采集设施 选择器
    @ViewChild('collectionFacSelector') private collectionFacSelector: TemplateRef<HTMLDocument>;

    // 采集设备 选择器
    @ViewChild('collectionEquipmentSelector')
    private collectionEquipmentSelector: TemplateRef<HTMLDocument>;
    // 采集回路 选择器
    @ViewChild('collectionLoopSelector') private collectionLoopSelector: TemplateRef<HTMLDocument>;
    // 通信设备
    @ViewChild('communicationEquipmentor') private communicationEquipmentor: TemplateRef<HTMLDocument>;
    // 类型选择
    @ViewChild('modelByTypeTemplate') private modelByTypeTemplate: TemplateRef<HTMLDocument>;
    @ViewChild('radioTemp') private radioTemp: TemplateRef<HTMLDocument>;

    // 区域选择器
    @ViewChild('areaSelector') private areaSelector: TemplateRef<HTMLDocument>;
    // 网关端口下拉选
    @ViewChild('gatewayPortTemp') private gatewayPortTemp: TemplateRef<HTMLDocument>;
    @ViewChild('tableCom') public tableCom: TableComponent;
    //  产品类型模版
    @ViewChild('productTypeTemplate') public productTypeTemplate: TemplateRef<HTMLDocument>;
    @ViewChild('productTemp') public productTemp: TemplateRef<HTMLDocument>;

    // 设备类型选择
    @ViewChild('equipmentSelect') private equipmentSelect: TemplateRef<HTMLDocument>;

    // 项目选择器
    @ViewChild('projectSelector') private projectSelector: TemplateRef<HTMLDocument>;

    // 新增参数
    @Output() public getExtraRequest = new EventEmitter<EnergyNodesAddInfoModel>();
    // 表单是否可以提交
    @Output() public getFormDisabled = new EventEmitter<boolean>();
    // 获取表单实例
    @Output() public getFormStatus = new EventEmitter<FormOperate>();
    // 网关配置新增操作
    @Input() public isAddOperate: boolean = false;

    // 语言
    public language: EnergyLanguageInterface;
    public facilityLanguage: FacilityLanguageInterface;
    // 表单语言包
    public formLanguage: FormLanguageInterface;

    public formColumn: FormItem[] = [];
    // 项目
    public project: string = '';
    // 通信设备
    communicationEquipmentValue;
    // 设备弹框展示
    public equipmentedVisible: boolean = false;
    // 采集设备选择器显示
    public collectionEquipmentVisible: boolean = false;
    /** 采集设备的 过滤条件 */
    collectionEquipmentFilterData: FilterCondition[] = [];
    /** 采集回路的过滤条件 */
    loopFilterConditions: FilterCondition[] = [];
    /** 采集设施 采集设备 采集回路 的类型枚举 */
    EnergyInsertCollectionType = EnergyInsertCollectionTypeEnum;
    // 拼接采集设施的名称
    splitCollectEquipmentName: string;
    // 选择的设备
    public selectCollectionEquipment: EquipmentListModel[] = [];

    /** 所属设施选择器是否显示 */
    public mapVisible: boolean = false;

    // 采集设施 弹出框
    public conlectionSSVisible: boolean = false;
    // 关联设施名称拼接
    splitDeviceName: string;

    // 回路 弹出框
    public collectionHLVisible: boolean = false;
    // 拼接采集回路名称
    splitCollectLoopName: string;

    // 是否从已有设备选择
    isSelectExistDevice = true;
    // 设备id
    public equipmentIds;
    // 页面是否加载
    public pageLoading = false;
    // 页面标题
    public pageTitle: string;
    // 是否加载
    public isLoading = false;
    // 表单校验
    public isDisabled: boolean = true;

    // 选中关联设施id集合
    public selectLinkDeviceIds: FacilityListModel[] = [];
    // 选中采集回路 id 集合
    selectLinkLoopIds: any = [];
    // 设备类型下拉线数据
    private equipmentTypeList: SelectModel[] = [];
    /**  页面操作类型，新增或编辑 */
    public operateType: string = OperateTypeEnum.add;
    //  型号下拉选
    public modelChangeValue: EquipmentModelModel[] = [];
    // 新增或修改设备信息数据模型
    public saveEquipmentModel: EnergyNodesAddInfoModel = new EnergyNodesAddInfoModel();
    // 区域选择器弹框是否展示
    public areaSelectVisible: boolean = false;
    // 区域选择节点
    private areaNodes: NzTreeNode[] = [];
    // 选择区域对象
    private areaInfo: AreaModel = new AreaModel();
    /** 选中的 区域名字 */
    selectedAreaName: string;
    // 区域选择器配置
    public areaSelectorConfig: TreeSelectorConfigModel = new TreeSelectorConfigModel();
    // 选择设备类型值设施选择器的过滤条件
    public facilityFilter: FilterCondition[] = [];
    /** 采集设施 过滤的 biz */
    energyBizParams;
    /** 采集设备 过滤的 biz */
    energyEquipmentBizParams;
    public existingEquipmentFilter: FilterCondition[] = [];
    // 已有设备 通信设备
    equipmentModalType: number;

    EnergyOpearEquipmentTX = EnergyOpearEquipmentTXEnum;
    /** 已有设备 通信设备 的回显数组 */
    selectedEquipmentId: any = [];
    /** 已有设备 通信设备 弹出框的标题 */
    tableTitle: string;
    /** 已有设备选中 */
    selectedYY: any = [];
    /** 通信设备选中 */
    selectedTX: any = [];
    // 网关查询条件
    public gatewayFilter: FilterCondition[] = [];
    // 网关端口下拉选
    public gatewayPortList: string[] = [];
    //  挂载位置下拉选
    public positionSelectList: string[] = [];
    // 表单操作
    formStatus: FormOperate;
    /** 编辑时型号不可修改 */
    public productTempDisabled: boolean = true;
    /** 告警 */
    public productName: string = '';

    public productDisable = true;
    // 列表数据
    public _dataSet = [];
    // 分页
    public pageBean: PageModel = new PageModel();
    // 查询参数对象集
    public queryCondition: QueryConditionModel = new QueryConditionModel();
    // 列表配置
    public tableConfig: TableConfigModel = new TableConfigModel();
    // 复制已选择告警
    public _selectedProduct;
    // 选择设备id
    public selectedProductId: string = null;
    // 产品类型枚举
    public productTypeEnum = ProductTypeEnum;
    // 设施类型枚举
    public deviceTypeEnum = DeviceTypeEnum;
    // 设备类型枚举
    public equipmentTypeEnum = EquipmentTypeEnum;
    // 设施国际化
    public languageEnum = LanguageEnum;

    // 产品管理国际化词条
    public productLanguage: ProductLanguageInterface;
    // 公共国际化
    public commonLanguage: CommonLanguageInterface;

    // 项目选择器
    public projectSelectVisible: boolean = false;
    // 选择的项目
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
            // 根据页面的操作 设置新增编辑的标题
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
     * 跳转到页面之后进行新增或者编辑的路由参数
     */
    private handelInit(params): void {
        const isEdit = this.operateType === OperateTypeEnum.update ? true : false;
        // 初始化区域
        this.initArea();
        // 初始化表单
        this.initColumn(isEdit, !isEdit);
        if (isEdit) {
            this.saveEquipmentModel.energyConsumptionNodeId = params.id;
            // 查询详情
            this.queryEquipmentDetailById();
        }
    }

    /**
     * 查询设备详情
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
                    // 获取 isSelectExistDevice 字段 用来判断是否是从 已有设备选择
                    this.saveEquipmentModel.isSelectExistDevice =
                        result.data.energyConsumptionNode.isSelectExistDevice;
                    this.productName = result.data.equipmentInfo.equipmentModel;
                    // 从已有设备选择
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
                            // 查询设施下面的挂载位置
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

                    // 名称
                    this.formStatus.resetControlData('equipmentName', getResult.equipmentName);
                    // 类型
                    this.formStatus.resetControlData('equipmentType', getResult.equipmentType);
                    this.saveEquipmentModel.equipmentInfo.equipmentType = getResult.equipmentType;
                    // 型号
                    this.saveEquipmentModel.equipmentInfo.equipmentModel = getResult.equipmentModel;
                    // 项目
                    this.selectSelectProject.projectId = result.data.energyConsumptionNode.project
                    this.selectSelectProject.projectName = result.data.energyConsumptionNode.projectName
                    // 区域
                    this.selectedAreaName = result.data.areaInfo.areaName;
                    this.saveEquipmentModel.equipmentInfo.areaId = getResult.areaId;
                    this.saveEquipmentModel.equipmentInfo.areaCode = result.data.areaInfo.areaCode;
                    // 采集设施
                    this.splitDeviceName = result.data.energyConsumptionNodeDeviceInfoList
                        .map((item) => item.deviceInfo.deviceName)
                        .join(',');
                    this.saveEquipmentModel.deviceIds = result.data.energyConsumptionNodeDeviceInfoList.map(
                        (item) => item.deviceId,
                    );
                    this.selectLinkDeviceIds = result.data.energyConsumptionNodeDeviceInfoList.map(
                        (item) => item.deviceInfo,
                    );
                    // 采集设备
                    this.splitCollectEquipmentName = result.data.energyConsumptionNodeEquipmentInfoList
                        .map((item) => item.equipmentInfo.equipmentName)
                        .join(',');
                    this.saveEquipmentModel.equipmentIds = result.data.energyConsumptionNodeEquipmentInfoList.map(
                        (item) => item.equipmentId,
                    );
                    this.selectCollectionEquipment = result.data.energyConsumptionNodeEquipmentInfoList.map(
                        (item) => item.equipmentInfo,
                    );
                    // 采集回路
                    this.splitCollectLoopName = result.data.energyConsumptionNodeLoopInfoList
                        .map((item) => item.loopInfo.loopName)
                        .join(',');
                    this.saveEquipmentModel.loopIds = result.data.energyConsumptionNodeLoopInfoList.map(
                        (item) => item.loopId,
                    );
                    this.selectLinkLoopIds = result.data.energyConsumptionNodeLoopInfoList.map(
                        (item) => item.loopInfo,
                    );
                    // 通信设施
                    this.selectedTX = getResult.gatewayId;
                    this.saveEquipmentModel.equipmentInfo.gatewayId = getResult.gatewayId;
                    this.saveEquipmentModel.equipmentInfo.gatewayName = getResult.gatewayName;
                } else {
                    this.$message.error(result.msg);
                }
            });
    }

    // 已有设备 显示隐藏
    private setColumnHidden(key: string, value: boolean): void {
        const formColumn = this.formColumn.find((item) => item.key === key);
        if (formColumn) {
            formColumn.hidden = value;
        }
    }
    // 名称 类型 型号 禁用 开启
    private setColumnDisplay(key: string, value: boolean) {
        const formColumn = this.formColumn.find((item) => item.key === key);
        if (formColumn) {
            if (value) { this.formStatus.group.controls[key].disable(); } else { this.formStatus.group.controls[key].enable(); }
        }
    }

    // 获取设备类型
    public getEquipmentType() {
        // 设备列表新增设备类型获取有权限的设备
        this.equipmentTypeList = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n);
        // if (this.isAddOperate) {
        //     // 用户有权限的设备类型和网关端口能连设备类型交集
        //     this.equipmentTypeList =
        //         this.equipmentTypeList.filter((item) =>
        //             this.gatewayPortTypeList.includes(item.code)
        //         ) || []
        // }
    }
    /**
     *  设备类型下拉选修改事件
     */
    private handelTypeChange(typeCode: EquipmentTypeEnum): void {
        if (
            this.saveEquipmentModel.equipmentInfo.equipmentType &&
            typeCode !== this.saveEquipmentModel.equipmentInfo.equipmentType
        ) {
            this.resetData();
        }
        this.saveEquipmentModel.equipmentInfo.equipmentType = typeCode;
        // 触发挂载位置
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
     * 根据网关查询网关端口
     */
    private queryGatewayPort(type: QueryGatewayPortEnum): void {
        //  查询网关端口
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
     * 选择设备类型时需要重置部分字段
     */
    private resetData(): void {
        this.formStatus.resetControlData('equipmentModel', null);
    }

    // 切换是否从已有设备选择 时 需要重置部分参数 flag === true 说明从已有设备选择 flag === false 手动填写
    changeExistDeviceReastValue(flag) {
        this.formStatus.resetControlData('existingEquipment', null); // 已有设备
        this.formStatus.resetControlData('equipmentName', null); //  名称
        this.formStatus.resetControlData('equipmentType', null); // 类型
        this.formStatus.resetControlData('equipmentModel', null); // 型号
        this.formStatus.resetControlData('scrapTime', null); // 报废年限
        this.formStatus.resetControlData('equipmentCode', null); // 资产编码

        this.formStatus.resetControlData('supplier', null); // 供应商
        this.formStatus.resetControlData('softwareVersion', null); // 软件版本号
        this.formStatus.resetControlData('hardwareVersion', null); // 硬件版本号
        this.formStatus.resetControlData('energyConsumptionTarget', null); // 能耗目标值
        this.formStatus.resetControlData('sequenceId', null); // 设备ID
        this.formStatus.resetControlData('project', null); // 项目

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

        // 所属设施
        this.setColumnHidden('facilities', flag);
        // 隐藏 网关端口
        this.setColumnHidden('portNo', true);

        this.setColumnHidden('existingEquipment', !flag);
        // 名称
        this.setColumnDisplay('equipmentName', flag);
        // 类型
        this.setColumnDisplay('equipmentType', flag);
        // 型号
        this.setColumnDisplay('equipmentModel', flag);
        // 区域
        this.setColumnDisplay('areaId', flag);
        // 通信设备
        this.setColumnDisplay('gatewayName', flag);
        // 详细地址
        this.setColumnDisplay('address', flag);
        // 资产编码
        this.setColumnDisplay('equipmentCode', flag);

        // 软件版本
        // this.setColumnDisplay('softwareVersion', flag)
        // 硬件版本
        // this.setColumnDisplay('hardwareVersion', flag)
        this.setColumnDisplay('sequenceId', flag);

        this.formStatus.group.updateValueAndValidity();
    }

    // 初始化表单配置
    private initColumn(hidden: boolean, disabled: boolean): void {
        this.formColumn = [
            // 已有设备
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
            // 名称
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
            // 类型
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
            // 型号
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
            // 供应商
            {
                label: this.language.supplier,
                key: 'supplier',
                type: 'input',
                disabled: true,
                require: true,
                rule: [{ required: true }],
                asyncRules: [],
            },
            // 报废年限
            {
                label: this.facilityLanguage.scrapTime,
                key: 'scrapTime',
                type: 'input',
                disabled: true,
                col: 24,
                require: false,
                rule: [],
            },
            // 资产编码
            {
                label: this.facilityLanguage.deviceCode,
                key: 'equipmentCode',
                type: 'input',
                col: 24,
                disabled:true,
                require: false,
                rule: [],
                asyncRules: [
                    // 校验设施编码是否重复
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
            // 软件版本号
            {
                label: this.language.softwareVersionNumber,
                key: 'softwareVersion',
                type: 'input',
                disabled: true,
                rule: [],
                asyncRules: [],
            },
            // 硬件版本号
            {
                label: this.language.hardwareVersionNumber,
                key: 'hardwareVersion',
                type: 'input',
                disabled: true,
                rule: [],
                asyncRules: [],
            },
            // 设备id
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
                // 通信设备
                label: this.language.communicationEquipment,
                key: 'gatewayName',
                type: 'input',
                rule: [],
                disabled: true,
                asyncRules: [],
            },
            // 项目
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
            { // 所属项目
                label: this.language.projectId,
                key: 'projectId',
                type: 'custom',
                template: this.projectSelector,
                rule: [],
                asyncRules: []
            },
            // 所属设施
            {
                label: this.language.nodesDetails.facilities,
                key: 'facilities',
                type: 'custom',
                hidden: true,
                template: this.facilitiesSelector,
                require: true,
                rule: [{ required: true }],
            },
            // 挂载位置
            {
                label: this.language.mountPosition,
                key: 'mountPosition',
                type: 'custom',
                hidden: true,
                template: this.positionByDeviceTemplate,
                rule: [],
            },
            // 区域
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
            // 采集设施
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
                // 采集回路
                label: this.language.collectLoopId,
                key: 'loopName',
                template: this.collectionLoopSelector,
                type: 'custom',
                rule: [],
                asyncRules: [],
            },
            {
                // 能耗目标值
                label: this.language.energyConsumptionTarget,
                key: 'energyConsumptionTarget',
                type: 'input',
                rule: [this.$ruleUtil.getEnergyNodesTargetValue()],
                asyncRules: [],
            },
            {
                // 详细地址
                label: this.language.detailedAddress,
                key: 'address',
                type: 'input',
                disabled,
                require: true,
                rule: [{ required: true }, this.$ruleUtil.getRemarkMaxLengthRule()],
            },
            {
                // 备注
                label: this.language.remarks,
                key: 'remarks',
                type: 'textarea',
                col: 24,
                rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
                customRules: [this.$ruleUtil.getNameCustomRule()],
            },
        ];
    }


    // 获取表单实例
    public formInstance(event: { instance: FormOperate }): void {
        this.formStatus = event.instance;
        const projectIdCol: FormItem = this.formStatus.getColumn('project').item;
        // 获取所属项目
        // this.$facilityApiService.getProjectList().subscribe((result: ResultModel<Array<Project>>) => {
        //     if (result.code === ResultCodeEnum.success) {
        //         projectIdCol.selectInfo.data = result.data || [];
        //     } else {
        //         this.$modalService.error(result.msg);
        //     }
        // });
        // 校验表单
        event.instance.group.statusChanges.subscribe(() => {
            this.isDisabled = !event.instance.getRealValid();
            this.getFormDisabled.emit(this.isDisabled);
        });
        this.getFormStatus.emit(this.formStatus);
    }

    /** 已有设备 通信设备 模板弹出框 开启 */
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
    // 已有设备type ===1 采集设备 type === 2 通信设备 type === 3 模板弹出框 确认
    onExistEquipmentDataChange(event) {
      // 切换项目前清空
      const key = Object.keys(this.formStatus.group.getRawValue());
      key.forEach( d =>{
        this.formStatus.resetControlData(d, null);
      })
      this.selectSelectProject = {};
      this.saveEquipmentModel.resultData();
      this.splitCollectEquipmentName = '';
      this.splitDeviceName = '';
      this.splitCollectLoopName = '';
      // 清空选择的设施
      this.selectLinkDeviceIds = [];
      // 清空选择的回路
      this.selectLinkLoopIds = [];
      // 清空选择的设备
      this.selectCollectionEquipment = [];
      const { data, type } = event;
        // 已有设备
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
            // 清空网关端口
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

            // 选择的是网关
            if (data[0].equipmentType === 'E001') {
                // 根据网关查询网关端口
                this.queryGatewayPort(QueryGatewayPortEnum.gateway);
                this.setColumnHidden('portNo', false);
            } else {
                this.setColumnHidden('portNo', true);
            }
            this.formStatus.group.updateValueAndValidity();
        }
    }
    /**
     * 设备选择modal
     */
    public showProductSelectorModal(): void {
        if (!this.saveEquipmentModel.equipmentInfo.equipmentType) {
            this.$message.info('请先选择设备类型');
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
     * 查询产品列表
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
                    // 获取设备和设施的图标
                    if (!_.isEmpty(this._dataSet)) {
                        this._dataSet.forEach((item) => {
                            if (String(item.typeFlag) === String(ProductTypeEnum.facility)) {
                                item.iconClass = CommonUtil.getFacilityIConClass(item.typeCode);
                            } else {
                                item.iconClass = CommonUtil.getEquipmentTypeIcon(item as EquipmentListModel);
                            }
                            // 判断智慧杆编辑和上传的按钮是否显示
                            item.showPoleUpdate = item.fileExist && item.typeCode === DeviceTypeEnum.wisdom;
                            item.showPoleUpload = !item.fileExist && item.typeCode === DeviceTypeEnum.wisdom;
                            // 判断网关的上传和编辑按钮是否显示
                            item.showGatewayUpdate = item.fileExist && item.typeCode === EquipmentTypeEnum.gateway;
                            item.showGatewayUpload =
                                !item.fileExist && item.typeCode === EquipmentTypeEnum.gateway;
                            // 判断是否显示配置模版 按钮
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
     * 选择设备     只能选单条
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
            this.formStatus.resetControlData('equipmentModel', true); // 型号
            if (this.saveEquipmentModel.isSelectExistDevice === EnergySelectedType.no) {
                this.formStatus.resetControlData('softwareVersion', this._selectedProduct.softwareVersion);
                this.formStatus.resetControlData('hardwareVersion', this._selectedProduct.hardwareVersion);
                this.saveEquipmentModel.equipmentInfo.supplierId = this._selectedProduct.supplier;
            }
            // }
            // this.getExtraRequest.emit(this.saveEquipmentModel);
            modal.destroy();
        } else {
            this.$message.warning('请先选择产品');
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
                    // 序号
                    type: 'serial-number',
                    width: 62,
                    title: this.productLanguage.serialNum,
                    fixedStyle: { fixedLeft: true, style: { left: '42px' } },
                },
                {
                    // 规格型号
                    title: this.productLanguage.productModel,
                    key: 'productModel',
                    width: 150,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // 类型
                    title: this.productLanguage.model,
                    key: 'typeCode',
                    width: 150,
                    type: 'render',
                    renderTemplate: this.productTypeTemplate,
                    isShowSort: true,
                },
                {
                    // 供应商
                    title: this.productLanguage.supplier,
                    key: 'supplierName',
                    width: 150,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // 报废年限
                    title: this.productLanguage.scrapTime,
                    key: 'scrapTime',
                    width: 100,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // 软件版本
                    title: this.productLanguage.softVersion,
                    key: 'softwareVersion',
                    width: 150,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // 硬件版本
                    title: this.productLanguage.hardWareVersion,
                    key: 'hardwareVersion',
                    width: 150,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: { type: 'input' },
                },
                {
                    // 操作列
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
     * 选择告警
     * param event
     * param data
     */
    public selectedProductChange(event: boolean, data: any): void {
        this._selectedProduct = data;
    }

    /**
     * 页面页码大小切换
     */
    public pageChange(event: PageModel): void {
        this.queryCondition.pageCondition.pageSize = event.pageSize;
        this.queryCondition.pageCondition.pageNum = event.pageIndex;
        this.queryProductList();
    }

    // 采集设施 采集设备 采集回路 弹出框 开启
    modelShowClick(type: EnergyInsertCollectionTypeEnum) {
        let flag: boolean;
        let id: string;
        // 新增的时候 是否是 选择的已有设备 true 从已有设备选择 false 不是已有设备
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
            // 采集设备 过滤条件
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
            // 采集回路 过滤条件
            this.loopFilterConditions.push({
                filterField: 'centralizedControlId',
                filterValue: flag ? id : '.',
                operator: OperatorEnum.like,
            });
        }
    }




    /**
     *  所属设施 弹出框显示确认
     */
    public facilitieSelectDataChange(event: FacilityListModel): void {
        if (!_.isEmpty(event)) {
            // 此处出现选择第一个 是因为可能是单选或多选，事件以数组形式抛出
            const tempData = event[0];
            console.log(tempData, 'tempData');
            this.saveEquipmentModel.equipmentInfo.deviceName = tempData.deviceName;
            this.saveEquipmentModel.equipmentInfo.deviceId = tempData.deviceId;
            this.saveEquipmentModel.equipmentInfo.deviceType = tempData.deviceType;
            this.saveEquipmentModel.equipmentInfo.address = tempData.address;
            this.saveEquipmentModel.equipmentInfo.areaId = tempData.areaInfo.areaId;
            this.saveEquipmentModel.equipmentInfo.areaCode = tempData.areaInfo.areaCode;
            // 选择设施之后，所属区域默认为设施所属区域
            this.areaInfo = tempData.areaInfo;

            this.selectedAreaName = tempData.areaInfo.areaName;
            this.formStatus.resetControlData('facilities', tempData.deviceId);
            this.formStatus.resetControlData('address', tempData.address);
            this.formStatus.resetControlData('areaId', tempData.areaInfo.areaId);

            // this.selectDeviceInfo = tempData
            // 清空挂载位置
            this.formStatus.resetControlData('mountPosition', null, { emitEvent: true });
            // 查询设施下面的挂载位置
            this.findMountPositionById();
            // 设置区域
            FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, this.areaInfo.areaId);
            // 如果是智慧杆 就显示 挂载位置
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
     * 打开挂载位置下拉选
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
     * 根据设备设施id查询设施下面的挂载位置
     */
    private findMountPositionById(): void {
        const deviceId = this.saveEquipmentModel.equipmentInfo.deviceId;
        const queryBody = {
            equipmentId: this.saveEquipmentModel.equipmentId,
            deviceId: deviceId,
            mountPosition: this.saveEquipmentModel.equipmentInfo.mountPosition,
            equipmentType: this.saveEquipmentModel.equipmentInfo.equipmentType,
        };
        // 查询挂载位置
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
     * 展示区域选择
     */
    public onClickShowArea(): void {
        if (this.saveEquipmentModel.isSelectExistDevice) { return; }
        this.initArea();
        this.areaSelectVisible = true;
    }
    /**
     * 初始化区域
     */
    private initArea(): void {
        const queryBody = { bizCondition: { level: '' } };
        this.$equipmentAipService
            .queryAreaListForPageSelection(queryBody)
            .subscribe((result: ResultModel<NzTreeNode[]>) => {
                this.areaNodes = result.data;
                // 递归设置区域的选择情况
                FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, this.areaInfo.areaId);
                this.initAreaConfig(result.data);
            });
    }
    /**
     *  初始化区域
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
     * 选择区域
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
    * 打开项目选择器
    */
    public showProjectSelectorModal(): void {
        this.projectSelectVisible = true;
    }
    // 项目选择器结果  模板弹出框 确认
    public projectSelectChange(event): void {
        if (!_.isEmpty(event)) {
            this.selectSelectProject = event[0];
        }
    }

    // 采集设施  模板弹出框 确认
    onCollectionDataChange(event: FacilityListModel[]) {
        console.log(event, 'event');
        // 每次选择先清空之前的
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

    // 采集设备弹出框确认按钮
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

    // 回路 模板弹出框 确认
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

    // 新增 编辑 设施
    public addFacility(): void {
        const { deviceIds, equipmentIds, loopIds } = this.saveEquipmentModel;
        // 已有设备选择 需要检验 采集设施 采集设备 采集回路三选一填写
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
        // 新增
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

    // 返回
    public goBack(): void {
        this.$router.navigateByUrl(`business/energy/energy-nodes`).then();
    }
}
