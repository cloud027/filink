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
    // 表格组件引用
    @ViewChild('table') table: TableComponent;
    // 文件导入
    @ViewChild('importFacilityTemp') importFacilityTemp: TemplateRef<HTMLDocument>;
    // 设施类型模板
    @ViewChild('equipmentTypeTemplate') equipmentTypeTemp: TemplateRef<HTMLDocument>;
    // 设施状态
    @ViewChild('deviceStatusTemp') deviceStatusTemp: TemplateRef<HTMLDocument>;
    // 项目
    @ViewChild('projectFilterTemp') projectFilterTemp: TemplateRef<any>;
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

    TableLoading: boolean = false;
    // 表格数据
    public dataSet: EnergyModel[] = [];
    // 设备状态枚举
    public equipmentStatusEnum = EquipmentStatusEnum;

    // 表格查看弹出框
    tableCheckVisible: boolean = false;
    visible: boolean = false;
    // 标题
    tableCheckModalTitle: string = '';
    // 传递给组件的 type 选择的表格类型 设施 devive 设备 equipment 回路 loop
    tableType: string;
    // 传递个 组件的 表格数据
    tranCheckTableData: any = [];
    // 节点id
    energyConsumptionNodeId: string;
    // 判断是哪个页面调用查看组件
    switchPage = switchPageEnum;

    // 表格弹出框选择的项目
    tableSearchProjectValue;

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

    // 表格翻页对象
    public pageBean: PageModel = new PageModel();
    // 表格配置
    public tableConfig: TableConfigModel;
    // 国际化组件
    public language: EnergyLanguageInterface;
    // 通用的提示语句 国际化组件
    private commonLanguage: CommonLanguageInterface;

    // 登录有权限设施类型
    private deviceRoleTypes: SelectModel[];
    // 默认查询设施类型
    private defaultFilterCondition: FilterCondition;

    // 查询条件
    private queryCondition: QueryConditionModel = new QueryConditionModel();

    // 文件集合
    public fileList: UploadFile[] = [];
    // 文件数组
    public fileArray: UploadFile[] = [];
    // 文件类型
    public fileType: string;
    // 设备类型枚举
    public equipmentTypeEnum = EquipmentTypeEnum;
    // 国际化前缀枚举
    public languageEnum = LanguageEnum;
    // 项目的下拉框选择数组
    projectSelectList = [];
    // 项目类型枚举
    projectTypeEnum = ProjectTypeEnmu;

    // -------------------------------------设备配置*---------------------------
    /** 设备配置型号 */
    public equipmentModel: string;
    /** 设备配置类型 */
    public equipmentConfigType: EquipmentTypeEnum;
    /** 设备配置id */
    public equipmentConfigId: string;

    /** 设备配置内容 此处为any是因为表单配置内容是不确定的 */
    public equipmentConfigContent: any;
    /** 设备配置提交是否可以操作 */
    public configOkDisabled: boolean = true;
    /** 设备配置详情参数 */
    public configValueParam: ConfigDetailRequestModel = new ConfigDetailRequestModel();
    /** 配置设备id */
    public configEquipmentId: string;
    /** 设备配置弹框是否显示 */
    public equipmentDeployShow: boolean = false;
    // -------------------------------------设备配置*---------------------------

    // 项目选择器
    public projectSelectVisible: boolean = false;
    // 选择的项目
    public selectProjectName: any = {};
    public checkProject: ProjectSelectorConfigModel = new ProjectSelectorConfigModel;
    // 项目传值
    public projectFilterValue: FilterCondition;
    // 资产管理语言包
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
        // 设置默认过滤条件
        this.getDefaultFilterCondition();
        // 表格配置初始化
        EnergyList.initTableConfig(this);
        this.refreshData();
        // this.init_projectData();
    }

    /**
     * 将实例化模版进行销毁
     */
    public ngOnDestroy(): void {
        this.equipmentTypeTemp = null;
        this.table = null;
    }
    /**
     * 设置默认过滤条件
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

    // 初始化表格数据
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
                    // 处理各种状态的显示情况
                    this.dataSet.forEach((item) => {
                        // 设置状态样式
                        const iconStyle = CommonUtil.getEquipmentStatusIconClass(item.gatewayStatus, 'list');
                        item.statusIconClass = iconStyle.iconClass;
                        item.statusColorClass = iconStyle.colorClass;
                        // 获取设备类型的图标
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
    // 路由跳转
    public navigateToDetail(url, extras = {}) {
        this.$router.navigate([url], extras).then();
    }
    // 文件上传之前处理
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
    // 分页查询
    public pageChange(event: PageModel): void {
        this.queryCondition.pageCondition.pageNum = event.pageIndex;
        this.queryCondition.pageCondition.pageSize = event.pageSize;
        this.refreshData();
    }
    // 删除
    public deleteDeviceByIds(data: EnergyModel[]): void {
        this.tableConfig.isLoading = true;
        const ids = data.map((item) => item.energyConsumptionNodeId);
        console.log(ids, 'ids');
        this.$energyApiService.energyNodesDelete_API(ids).subscribe(
            (result: ResultModel<string>) => {
                if (result.code === ResultCodeEnum.success) {
                    this.$message.success(this.language.deleteEnergyNodesSuccess);
                    // 删除跳第一页
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

    // 表格导出
    handelExportEquipment(event) {
        // 处理参数
        const exportBody = new ExportRequestModel(event.columnInfoList, event.excelType);
        exportBody.columnInfoList = event.columnInfoList;
        const params = ['equipmentType', 'gatewayStatus', 'project'];
        exportBody.columnInfoList.forEach((item) => {
            if (params.indexOf(item.propertyName) > -1) {
                item.isTranslation = 1;
            }
        });
        // 处理选择的数据
        if (event && !_.isEmpty(event.selectItem)) {
            const ids = event.selectItem.map((item) => item.energyConsumptionNodeId);
            const filter = new FilterCondition('energyConsumptionNodeId', OperatorEnum.in, ids);
            exportBody.queryCondition.filterConditions.push(filter);
        } else {
            // 处理查询条件
            exportBody.queryCondition.filterConditions = event.queryTerm;
        }
        // 调用后台接口
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

    // 采集设施 value === 1  采集设备 value === 2 采集回路 value === 3   modal
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
    // 点击输入框弹出 设施选择 value === 1 设备选择 value === 2 回路选择 value === 3
    public onShowFacility(filterValue: FilterCondition, value): void {
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
    /**
     * 获取参数配置项内容
     * 返回结果是any是因为配置项具有不确定性
     */
    public getPramsConfig(equipmentModel: { equipmentModel: string }): void {
        this.$equipmentAipService
            .getEquipmentConfigByModel(equipmentModel)
            .subscribe((result: ResultModel<any>) => {
                if (result.code === ResultCodeEnum.success) {
                    this.equipmentConfigContent = result.data || [];
                    // 判断是否有配置项 为空提示无配置项
                    if (!_.isEmpty(this.equipmentConfigContent)) {
                        this.configOkDisabled = true;
                        // 打开设备配置弹框
                        this.equipmentDeployShow = true;
                        this.configEquipmentId = this.equipmentConfigId;
                        this.configValueParam.equipmentId = this.equipmentConfigId;
                        this.configValueParam.equipmentType = this.equipmentConfigType;
                    } else {
                        this.$message.info(this.assetsLanguage.noEquipmentConfigTip);
                    }
                } else {
                    // 关闭设备配置弹框
                    this.equipmentDeployShow = false;
                    this.$message.error(result.msg);
                }
            });
    }
    /** 节点导入 */
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
        // 选择对象 checkAlarmEquipment
        this.checkProject =  new ProjectSelectorConfigModel(
          event.map(v => v.projectName).join(',') || '', event.map(v => v.projectId) || []
        );
        this.projectFilterValue.filterValue = this.checkProject.ids;
        this.projectFilterValue.filterName = this.checkProject.projectName;
        this.projectFilterValue.operator ='in'
    }
}
