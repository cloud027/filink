import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NzI18nService, NzModalService, NzNotificationService, UploadFile } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { ProductForCommonService } from '../../../../core-module/api-service/product/product-for-common.service';
import { ProductApiService } from '../../share/service/product-api.service';
import { FiLinkModalService } from '../../../../shared-module/service/filink-modal/filink-modal.service';
import { PageModel } from '../../../../shared-module/model/page.model';
import { TableConfigModel } from '../../../../shared-module/model/table-config.model';
import { ProductLanguageInterface } from '../../../../../assets/i18n/product/product.language.interface';
import { LanguageEnum } from '../../../../shared-module/enum/language.enum';
import { Download } from '../../../../shared-module/util/download';
import { FilterCondition, QueryConditionModel, SortCondition } from '../../../../shared-module/model/query-condition.model';
import { ExportRequestModel } from '../../../../shared-module/model/export-request.model';
import { IS_TRANSLATION_CONST } from '../../../../core-module/const/common.const';
import { OperatorEnum } from '../../../../shared-module/enum/operator.enum';
import { ResultModel } from '../../../../shared-module/model/result.model';
import { ResultCodeEnum } from '../../../../shared-module/enum/result-code.enum';
import { ProductInfoModel } from '../../../../core-module/model/product/product-info.model';
import { ListExportModel } from '../../../../core-module/model/list-export.model';
import { EquipmentTypeEnum } from '../../../../core-module/enum/equipment/equipment.enum';
import { DeviceTypeEnum } from '../../../../core-module/enum/facility/facility.enum';
import { CommonUtil } from '../../../../shared-module/util/common-util';
import { FacilityForCommonUtil } from '../../../../core-module/business-util/facility/facility-for-common.util';
import { SelectModel } from '../../../../shared-module/model/select.model';
import { CommonLanguageInterface } from '../../../../../assets/i18n/common/common.language.interface';
import {
    CloudPlatformTypeEnum,
    ProductFileTypeEnum,
    ProductTypeEnum,
    ProductUnitEnum,
    TemplateEnum
} from '../../../../core-module/enum/product/product.enum';
import { ProductRequestUrlConst } from '../../../../core-module/api-service/product/product-request-url';
import { PRODUCT_DEVICE_TYPE_CONST, PRODUCT_EQUIPMENT_TYPE_CONST } from '../../../../core-module/const/product/product-common.const';
import { ProductPermissionEnum } from '../../share/enum/product.enum';
import { OperateTypeEnum } from '../../../../shared-module/enum/page-operate-type.enum';
import { TRANSLATION_ITEM } from '../../share/const/product.const';
import { ImportMissionService } from '../../../../core-module/mission/import.mission.service';
import { UploadBusinessModulesEnum } from '../../../../shared-module/enum/upload-business-modules.enum';
import { SupportFileType, WebUploaderModel } from '../../../../shared-module/model/web-uploader.model';
import { PRODUCT_SERVER } from '../../../../core-module/api-service/api-common.config';
import { WebUploadComponent } from '../../../../shared-module/component/business-component/web-upload/web-upload.component';
import { NativeWebsocketImplService } from '../../../../core-module/websocket/native-websocket-impl.service';
import { SessionUtil } from '../../../../shared-module/util/session-util';
import { NoticeMusicService } from '../../../../shared-module/util/notice-music.service';
import { ListUnitSelector } from '../../../../shared-module/component/business-component/list-unit-selector/list-unit-selector';
import { UserForCommonService } from '../../../../core-module/api-service/user';
import { UserRoleModel } from '../../../../core-module/model/user/user-role.model';
import { WorkOrderClearInspectUtil } from '../../../work-order/share/util/work-order-clear-inspect.util';
import { FilterValueModel } from '../../../../core-module/model/work-order/filter-value.model';
import { SupplierDataModel } from '../../../../core-module/model/supplier/supplier-data.model';
import { SupplierForCommonUtil } from '../../../../core-module/business-util/supplier/supplier-for-common.util';
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

/**
 * 产品列表组件
 */
@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent extends ListUnitSelector implements OnInit, OnDestroy {
    //  产品类型模版
    @ViewChild('productTypeTemplate') public productTypeTemplate: TemplateRef<HTMLDocument>;
    // 产品计量单位枚举
    @ViewChild('unitTemplate') public unitTemplate: TemplateRef<HTMLDocument>;
    // 云平台模版
    @ViewChild('cloudPlatformTemp') public cloudPlatformTemp: TemplateRef<HTMLDocument>;
    // 批量
    @ViewChild('importProductTemp') public importProductTemp: TemplateRef<HTMLDocument>;
    // 文件上传
    @ViewChild('webUploader') public webUploader: WebUploadComponent;
    // 责任单位选择模板
    @ViewChild('UnitNameSearch') UnitNameSearch: TemplateRef<any>;
    // 用户筛选
    @ViewChild('userSearchTemp') public userSearchTemp: TemplateRef<any>;
    // 供应商选择模板
    @ViewChild('supplierTemp') public supplierTemp: TemplateRef<any>;
   // 启用状态
    @ViewChild('policyStatus') policyStatus: TemplateRef<any>;
    // 产品列表数据集
    public productList: ProductInfoModel[] = [];
    // 分页参数
    public pageBean: PageModel = new PageModel();
    // 列表配置
    public tableConfig: TableConfigModel = new TableConfigModel();
    // 产品管理国际化词条
    public productLanguage: ProductLanguageInterface;
    // 公共国际化词条
    public commonLanguage: CommonLanguageInterface;
    // 查询参数对象集
    public queryCondition: QueryConditionModel = new QueryConditionModel();
    // 设备类型枚举
    public equipmentTypeEnum = EquipmentTypeEnum;
    // 设施类型枚举
    public deviceTypeEnum = DeviceTypeEnum;
    // 产品类型枚举
    public productTypeEnum = ProductTypeEnum;
    // 设施国际化
    public languageEnum = LanguageEnum;
    // 批量上传杆型图或网关图弹框是否显示
    public batchUploadVisible: boolean = false;
    public isShowWisdomUpload: boolean = false;
    // 上传文件类型
    public uploadType: ProductFileTypeEnum;
    // 文件类型枚举
    public uploadFileEnum = ProductFileTypeEnum;
    // 产品计量单位枚举
    public productUnitEnum = ProductUnitEnum;
    // 文件集合
    public productFileList: UploadFile[] = [];
    // 文件数组缓存
    public fileArray: UploadFile[] = [];
    // 文件类型
    public productFileType: string;
    // 云平台枚举类型
    public cloudPlatformEnum = CloudPlatformTypeEnum;
    // 上传业务id
    public productUploadEnum = UploadBusinessModulesEnum;
    // 文件类型
    public defaultAccepts: SupportFileType = {
        title: '',
        extensions: 'zip',
        mimeTypes: 'application/x-zip-compressed'
    };
    public callBakUrl: string;
    public isShowUserTemp: boolean = false;
    // 勾选用户
    public checkUserObject: FilterValueModel = new FilterValueModel();
    // 存放用户数据
    public selectUserList: UserRoleModel[] = [];

    // 勾选供应商
    public selectSupplierObject: FilterValueModel = new FilterValueModel();
    // 显示供应商选择
    public isShowSupplier: boolean = false;
    // 存放选择的供应商数据
    public selectSupplierList: SupplierDataModel[] = [];
    // 供应商筛选条件
    private supplierFilterValue: FilterCondition;
    // 用户显示
    private userFilterValue: FilterCondition;
    // 推送服务
    private webSocketInstance;

  // 编码设置弹框是否显示
  public isShowEncodingSetting: boolean = false;
  // 编码设置弹出框列表 启用按钮状态
  public encodingSwitchStatus: boolean = true;
  // 编码设置列表配置
  public EncodingTableConfig: TableConfigModel = new TableConfigModel();
  // 编码设置列表数据集
  public EncodingList: any = {materialRuleBeanList:[]};
  // 编码设置列表查询
  public EncodingGetUrl: string;
  // 物料编码更新参数
  public setEncodingListData
  // 用户状态模板
  @ViewChild(' EncodingStatusTemp') private EncodingStatusTemp: TemplateRef<any>;

  // 编码示例
  public encodingExample:string;
  /**
   * 编码状态枚举
   */
  public EncodingStatusEnum: any = {
    /**
     * 启用
     */
    enable: '1',
    /**
     * 停用
     */
    disable: '0'
  }

  public presentLanguage:string;   // 当前语言
    /**
     * 构造器
     */
    constructor(
        public $userService: UserForCommonService,
        public $message: FiLinkModalService,
        public $nzI18n: NzI18nService,
        private $router: Router,
        private $productService: ProductApiService,
        private $modalService: NzModalService,
        private $refresh: ImportMissionService,
        private $productCommonService: ProductForCommonService,
        private $wsService: NativeWebsocketImplService,
        private $noticeMusicService: NoticeMusicService,
        private $nzNotificationService: NzNotificationService,
        private $download: Download) {
        super($userService, $nzI18n, $message);
    }





    /**
     * 组件初始化
     */
    public ngOnInit(): void {
        const userInfo = SessionUtil.getUserInfo();
        this.presentLanguage = SessionUtil.getLanguage();
      // 先获取当前用户权限下的设备
        const equipmentList = userInfo.role.roleDeviceTypeDto.equipmentTypes;
        const deviceList = userInfo.role.roleDeviceTypeDto.deviceTypes;
        // 获取词条信息
        this.productLanguage = this.$nzI18n.getLocaleData(LanguageEnum.product);
        this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
        // 初始化表格参数
        this.initTableConfig();
        if (equipmentList.includes('E001')) {
            this.tableConfig.moreButtons.push({
                // 批量上传网关图
                text: this.productLanguage.batchUploadGatewayImg,
                iconClassName: 'fiLink-upload-gateway',
                permissionCode: ProductPermissionEnum.batchUploadGatewayImg,
                canDisabled: false,
                handle: () => {
                    // this.batchUploadVisible = true;
                    this.isShowWisdomUpload = true;
                    this.uploadType = ProductFileTypeEnum.gateway;
                    this.callBakUrl = `http://${PRODUCT_SERVER}/productImage/batchUploadGatewayImage`;
                }
            });
        }
        if (deviceList.includes('D002')) {
            this.tableConfig.moreButtons.push(
                {
                    // 批量上传杆型图
                    text: this.productLanguage.batchUploadWisdomImg,
                    iconClassName: 'fiLink-upload-pole',
                    permissionCode: ProductPermissionEnum.batchUploadPoleImg,
                    canDisabled: false,
                    handle: () => {
                        this.isShowWisdomUpload = true;
                        this.uploadType = ProductFileTypeEnum.pole;
                        this.callBakUrl = `http://${PRODUCT_SERVER}/productImage/batchUploadPoleImage`;
                    }
                }
            );
        }
        this.tableConfig.moreButtons.push(
                {
                    // 编码设置
                    text: this.productLanguage.EncodingSetting,  // 名字
                    iconClassName: 'fiLink-batch-coding-icon',  // 图标
                    permissionCode: ProductPermissionEnum.EncodingSetting,  // 权限枚举
                    canDisabled: false,
                    handle: () => {
                      this.getMaterialRule()
                      this.isShowEncodingSetting = true;
                        // 初始化编码设置表格参数
                       // this.initEncodingSettingTableConfig()
                        // 发送请求拿表格数据
                    }
                });
        this.queryProductList();
        this.initTreeSelectorConfig();
        // 查询列表数据
        this.$refresh.refreshChangeHook.subscribe(() => {
            this.queryProductList();
        });
        // 文件上传后，产品服务发送websocket刷新列表
        this.getWebsocketMsg();
    }

    /**
     * 销毁
     */
    public ngOnDestroy(): void {
        this.webUploader = null;
        this.webSocketInstance.unsubscribe();
    }

    /**
     * 页面页码大小切换
     */
    public pageChange(event: PageModel): void {
        this.queryCondition.pageCondition.pageSize = event.pageSize;
        this.queryCondition.pageCondition.pageNum = event.pageIndex;
        this.queryProductList();
    }

    /**
     * 用户名称选择
     */
    public openUserSelector(filterValue: FilterCondition): void {
        this.isShowUserTemp = true;
        this.userFilterValue = filterValue;
        this.userFilterValue.operator = OperatorEnum.in;
    }

    /**
     * 用户名称
     */
    public onSelectUser(event: UserRoleModel[]): void {
        this.selectUserList = event;
        WorkOrderClearInspectUtil.selectUser(event, this);
    }

    /**
     * 打开供应商选择器
     */
    public openSupplierSelector(filterValue: FilterCondition): void {
        if (!filterValue.filterValue) {
            this.selectSupplierList = [];
            this.selectSupplierObject.ids = [];
            this.selectSupplierObject.name = '';
        }
        this.isShowSupplier = true;
        this.supplierFilterValue = filterValue;
        this.supplierFilterValue.operator = OperatorEnum.in;
    }

    /**
     * 供应商选择改变事件
     */
    public onSelectSupplier(event: SupplierDataModel[]): void {
        this.selectSupplierList = event;
        SupplierForCommonUtil.selectSupplier(event, this);
    }

    /**
     * 模版下载
     */
    public downTemplate(): void {
        let requestUrl = '';
        if (this.uploadType === ProductFileTypeEnum.gateway) {
            requestUrl = TemplateEnum.gatewayConfigTemplate;
        } else if (this.uploadType === ProductFileTypeEnum.pole) {
            requestUrl = TemplateEnum.polePointConfigTemplate;
        }
        this.$download.downloadFileNew(`${ProductRequestUrlConst.downloadTemplate}/${requestUrl}`);
    }

    /**
     * 将文件上传设置成自定义上传
     */
    public onBeforeUpload = (file: UploadFile) => {
        return false;
    }

    /**
     * 确定上传文件
     */
    public onConfirmUploadFile(): void {
    }

    /**
     * 上传成功后刷新列表
     */
    public getFilesMsg(event: WebUploaderModel): void {
        if (event && event.isUploadFinished) {
            this.isShowWisdomUpload = false;
            this.webUploader.handleCancel();
            this.$message.success(this.productLanguage.filesUploadSuccess);
        }
    }

    /**
     * 批量导入之前，，设置成自定义上传
     */
    beforeUploadProduct = (file: UploadFile): boolean => {
        if (!file.name.endsWith('xls') && !file.name.endsWith('xlsx')) {
            this.$message.info(this.productLanguage.fileErrorMsg);
        } else {
            this.fileArray = this.fileArray.concat(file);
            if (!_.isEmpty(this.fileArray) && this.fileArray.length > 1) {
                this.fileArray = [this.fileArray[0]];
            }
            this.productFileList = this.fileArray;
            const name = this.productFileList[0].name;
            const index = name.lastIndexOf('\.');
            this.productFileType = name.substring(index + 1, name.length);
        }
        return false;
    }

    /**
     * websocket消息推送
     *  channelKey    pole - 杆  gateway - 网关
     */
    private getWebsocketMsg(): void {
        this.webSocketInstance = this.$wsService.subscibeMessage.subscribe(res => {
            if (res && res.data && JSON.parse(res.data)) {
                const data = JSON.parse(res.data);
                if (data.channelKey === 'pole' || data.channelKey === 'gateway') {
                    // 右下角消息提示
                    if (SessionUtil.isMessageNotification()) {
                        if (data.msg) {
                            this.$noticeMusicService.noticeMusic();
                            this.$nzNotificationService.config({
                                nzPlacement: 'bottomRight',
                                nzDuration: SessionUtil.getMsgSetting().retentionTime * 1000
                            });
                            this.$nzNotificationService.blank(this.commonLanguage.systemMsg, data.msg);
                        }
                    }
                    // 刷新列表
                    this.queryProductList();
                }
            }
        });
    }

    /**
     * 初始化列表参数
     */
    private initTableConfig(): void {
        this.tableConfig = {
            isDraggable: true,
            isLoading: true,
            primaryKey: ProductPermissionEnum.productList,
            closeCacheQueryConditions: true,
            outHeight: 108,
            showSizeChanger: true,
            showSearchSwitch: true,
            showPagination: true,
            scroll: { x: '1804px', y: '340px' },
            noIndex: true,
            showSearchExport: true,
            columnConfig: [
                { // 选择
                    title: this.productLanguage.select,
                    type: 'select',
                    fixedStyle: { fixedLeft: true, style: { left: '0px' } },
                    width: 62
                },
                { // 序号
                    type: 'serial-number',
                    width: 62,
                    title: this.productLanguage.serialNum,
                    fixedStyle: { fixedLeft: true, style: { left: '62px' } }
                },
                { // 规格型号
                    title: this.productLanguage.productModel, key: 'productModel', width: 150,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: { type: 'input' }
                },
                { // 类型
                    title: this.productLanguage.model, key: 'typeCode', width: 150,
                    type: 'render',
                    renderTemplate: this.productTypeTemplate,
                    configurable: true,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: {
                        type: 'select',
                        selectType: 'multiple',
                        selectInfo: this.getProductTypeSelect(),
                        label: 'label',
                        value: 'code'
                    }
                },
                { // 软件版本
                    title: this.productLanguage.softVersion, key: 'softwareVersion', width: 150,
                    configurable: true,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: { type: 'input' }
                },
                { // 硬件版本
                    title: this.productLanguage.hardWareVersion, key: 'hardwareVersion', width: 150,
                    configurable: true,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: { type: 'input' }
                },
                { // 供应商
                    title: this.productLanguage.supplier, key: 'supplierName', width: 150,
                    configurable: true,
                    isShowSort: true,
                    sortKey: 'supplierId',
                    searchKey: 'supplierId',
                    searchable: true,
                    searchConfig: { type: 'render', renderTemplate: this.supplierTemp }
                },
                { // 云平台类型
                    title: this.productLanguage.platformType, key: 'platformType', width: 150,
                    configurable: true,
                    isShowSort: true,
                    type: 'render',
                    renderTemplate: this.cloudPlatformTemp,
                    searchable: true,
                    searchConfig: {
                        type: 'select',
                        selectInfo: CommonUtil.codeTranslate(CloudPlatformTypeEnum, this.$nzI18n, null, LanguageEnum.product),
                        label: 'label',
                        value: 'code'
                    }
                },
                { // 云平台产品
                    title: this.productLanguage.platformProduct, key: 'appName', width: 150,
                    configurable: true,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: { type: 'input' }
                },
                { // 通信模式
                    title: this.productLanguage.communicateType, key: 'communicateType', width: 150,
                    configurable: true,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: { type: 'input' }
                },
                { // 产品功能
                    title: this.productLanguage.productFeatures, key: 'description', width: 150,
                    configurable: true,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: { type: 'input' }
                },
                { // 计量单位
                    title: this.productLanguage.unit, key: 'unit', width: 100,
                    configurable: true,
                    type: 'render',
                    renderTemplate: this.unitTemplate,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: {
                        type: 'select',
                        selectInfo: CommonUtil.codeTranslate(ProductUnitEnum, this.$nzI18n, null, LanguageEnum.product),
                        label: 'label',
                        value: 'code'
                    }
                },
                { // 单价（元）
                    title: this.productLanguage.price, key: 'price', width: 150,
                    configurable: true,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: { type: 'input' }
                },
                { // 报废年限
                    title: this.productLanguage.scrapTime, key: 'scrapTime', width: 100,
                    configurable: true,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: { type: 'input' }
                },
                { // 创建人
                    title: this.productLanguage.createUser, key: 'createUserName', width: 120,
                    configurable: true,
                    isShowSort: true,
                    sortKey: 'createUser',
                    searchKey: 'createUser',
                    searchable: true,
                    searchConfig: { type: 'render', renderTemplate: this.userSearchTemp },
                },
                { // 创建时间
                    title: this.productLanguage.createTime, key: 'createTime', width: 150,
                    isShowSort: true,
                    pipe: 'date',
                    pipeParam: 'yyyy-MM-dd hh:mm:ss',
                    configurable: true,
                    searchable: true,
                    searchConfig: { type: 'dateRang' }
                },
                { // 更新时间
                    title: this.productLanguage.updateTime, key: 'updateTime', width: 150,
                    pipe: 'date',
                    pipeParam: 'yyyy-MM-dd hh:mm:ss',
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'dateRang' }
                },
                {
                    // 责任单位
                    title: this.productLanguage.deptName, key: 'deptName', width: 180, isShowSort: true,
                    searchKey: 'deptCode',
                    sortKey: 'deptCode',
                    configurable: true,
                    searchable: true,
                    searchConfig: { type: 'render', renderTemplate: this.UnitNameSearch }
                },
                { // 备注
                    title: this.productLanguage.remarks, key: 'remark', width: 150,
                    configurable: true,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: { type: 'input' }
                },
                { // 操作列
                    title: this.productLanguage.operate,
                    searchable: true,
                    searchConfig: { type: 'operate' },
                    key: '', width: 180,
                    fixedStyle: { fixedRight: true, style: { right: '0px' } }
                },
            ],
            topButtons: [
                { // 新增
                    text: this.productLanguage.add,
                    iconClassName: 'fiLink-add-no-circle',
                    permissionCode: ProductPermissionEnum.addProduct,
                    handle: () => {
                        this.$router.navigate(['/business/product/product-detail/add']).then();
                    }
                },
                { // 批量删除
                    text: this.productLanguage.delete,
                    btnType: 'danger',
                    className: 'table-top-delete-btn',
                    iconClassName: 'fiLink-delete',
                    permissionCode: ProductPermissionEnum.deleteProduct,
                    canDisabled: true,
                    needConfirm: false,
                    handle: (data: ProductInfoModel[]) => {
                        this.handelDeleteProduct(data);
                    }
                },
            ],
            operation: [
                { // 详情
                    text: this.productLanguage.productDetail,
                    className: 'fiLink-view-detail',
                    permissionCode: ProductPermissionEnum.productDetail,
                    handle: (data: ProductInfoModel) => {
                        this.$router.navigate(['/business/product/product-view-detail'], {
                            queryParams: {
                                productId: data.productId,
                                typeFlag: data.typeFlag
                            }
                        }).then();
                    }
                },
                { // 编辑
                    permissionCode: ProductPermissionEnum.updateProduct,
                    text: this.productLanguage.edit, className: 'fiLink-edit', handle: (data: ProductInfoModel) => {
                        this.$router.navigate(['/business/product/product-detail/update'], { queryParams: { productId: data.productId } }).then();
                    },
                },
                { // 配置模版
                    permissionCode: ProductPermissionEnum.configTemplate,
                    key: 'showConfigTemplate',
                    text: this.productLanguage.configTemplate, className: 'fiLink-config-template', handle: (data: ProductInfoModel) => {
                        // 查询配置模版 信息
                        this.$productService.queryConfigTemplateByProductId(data).subscribe(res => {
                            if (res.code === ResultCodeEnum.success) {
                                if (_.isEmpty(res.data)) {
                                    this.$message.info(this.productLanguage.noConfiguration);
                                    return;
                                } else {
                                    this.$router.navigate(['/business/product/product-template'],
                                        {
                                            queryParams: {
                                                productId: data.productId,
                                                productModel: data.productModel,
                                                softwareVersion: data.softwareVersion,
                                                hardwareVersion: data.hardwareVersion,
                                                supplier: data.supplier,
                                                typeCode: data.typeCode
                                            }
                                        }).then();
                                }
                            } else {
                                this.$message.info(res.msg);
                            }
                        });
                    },
                },
                { // 上传网关图
                    text: this.productLanguage.uploadGatewayImage,
                    key: 'showGatewayUpload',
                    className: 'fiLink-upload-gateway',
                    permissionCode: ProductPermissionEnum.uploadGatewayImg,
                    handle: (data: ProductInfoModel) => {
                        this.$router.navigate(['/business/product/product-gateway/add'], {
                            queryParams: {
                                productId: data.productId,
                                operateType: OperateTypeEnum.add
                            }
                        }).then();
                    },
                },
                { // 编辑网关图
                    text: this.productLanguage.updateGatewayImg,
                    className: 'fiLink-edit-gateway',
                    key: 'showGatewayUpdate',
                    permissionCode: ProductPermissionEnum.editGatewayImg,
                    handle: (data: ProductInfoModel) => {
                        this.$router.navigate(['/business/product/product-gateway/update'],
                            { queryParams: { productId: data.productId, operateType: OperateTypeEnum.update }, preserveFragment: true }).then();
                    },
                },
                { // 上传杆型图
                    text: this.productLanguage.uploadWisdomImg,
                    key: 'showPoleUpload',
                    className: 'fiLink-upload-pole',
                    permissionCode: ProductPermissionEnum.uploadPoleImg,
                    handle: (data: ProductInfoModel) => {
                        this.$router.navigate(['/business/product/product-wisdom/add'],
                            { queryParams: { productId: data.productId, operateType: OperateTypeEnum.add } }).then();
                    },
                },
                { // 编辑杆型图
                    text: this.productLanguage.updateWisdomImg,
                    key: 'showPoleUpdate',
                    className: 'fiLink-edit-pole',
                    permissionCode: ProductPermissionEnum.editPoleImg,
                    handle: (data: ProductInfoModel) => {
                        this.$router.navigate(['/business/product/product-wisdom/update'],
                            { queryParams: { productId: data.productId, operateType: OperateTypeEnum.update } }).then();
                    },
                },
                { // 删除产品
                    text: this.productLanguage.delete,
                    className: 'fiLink-delete red-icon',
                    permissionCode: ProductPermissionEnum.deleteProduct,
                    btnType: 'danger',
                    iconClassName: 'fiLink-delete',
                    needConfirm: false,
                    canDisabled: true,
                    handle: (data: ProductInfoModel) => {
                        this.handelDeleteProduct([data]);
                    }
                },
            ],
            rightTopButtons: [
                {// 批量导入产品基本信息
                    text: this.productLanguage.batchImport, iconClassName: 'fiLink-import',
                    permissionCode: ProductPermissionEnum.importProduct,
                    handle: () => {
                        const modal = this.$modalService.create({
                            nzTitle: this.productLanguage.selectImport,
                            nzClassName: 'custom-create-modal',
                            nzContent: this.importProductTemp,
                            nzOkType: 'danger',
                            nzFooter: [
                                {
                                    label: this.commonLanguage.okText,
                                    onClick: () => {
                                        if (this.productFileList && this.productFileList.length) {
                                            this.handelImportProduct().then(() => {
                                                modal.destroy();
                                            });
                                        } else {
                                            this.$message.error(this.productLanguage.selectImportMsg);
                                        }
                                    }
                                },
                                {
                                    label: this.commonLanguage.cancelText,
                                    type: 'danger',
                                    onClick: () => {
                                        this.fileArray = [];
                                        this.productFileList = [];
                                        this.productFileType = null;
                                        modal.destroy();
                                    }
                                },
                            ]
                        });
                    },
                },
                {// 模版下载
                    text: this.productLanguage.templateDownload, iconClassName: 'fiLink-download-file',
                    permissionCode: '03-1-19',
                    handle: () => {
                        this.$download.downloadFileNew(`${ProductRequestUrlConst.downloadTemplate}/${TemplateEnum.productImportTemplate}`);
                    },
                }
            ],
            moreButtons: [],
            handleExport: (e: ListExportModel<ProductInfoModel[]>) => {
                this.handelExport(e);
            },
            sort: (event: SortCondition) => {
                this.queryCondition.sortCondition = event;
                this.queryProductList();
            },
            handleSearch: (event: FilterCondition[]) => {
                this.queryCondition.pageCondition.pageNum = 1;
                this.queryCondition.filterConditions = event;
                // 将单价的查询操作符改成eq
                const price = this.queryCondition.filterConditions.find(item => item.filterField === 'price');
                if (price) {
                    price.operator = OperatorEnum.eq;
                }
                // 将报废年限的查询操作符改成eq
                const scrapTime = this.queryCondition.filterConditions.find(item => item.filterField === 'scrapTime');
                if (scrapTime) {
                    scrapTime.operator = OperatorEnum.eq;
                }
                if (!event.length) {
                    this.selectUnitName = '';
                    FacilityForCommonUtil.setTreeNodesStatus(this.treeNodes || [], []);
                    this.selectUserList = [];
                }
                if (event.length === 0) {
                    this.selectSupplierList = [];
                    this.selectSupplierObject.ids = [];
                    this.selectSupplierObject.name = '';
                }
                this.queryProductList();
            }
        };
    }

    /**
     * 执行导入产品
     */
    private handelImportProduct(): Promise<void> {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            this.productFileList.forEach((file: any) => {
                formData.append('file', file);
            });
            if (this.productFileList.length === 1) {
                this.$productService.importProductInfo(formData).subscribe((result: ResultModel<string>) => {
                    this.productFileList = [];
                    this.productFileType = null;
                    this.$message.success(this.productLanguage.importTaskSent);
                    this.fileArray = [];
                    resolve();
                });
            }
        });
    }

    /**
     * 查询产品列表
     */
    private queryProductList(): void {
        this.tableConfig.isLoading = true;
        this.$productCommonService.queryProductList(this.queryCondition).subscribe((res: ResultModel<ProductInfoModel[]>) => {
            if (res.code === ResultCodeEnum.success) {
                this.productList = res.data || [];
                this.pageBean.pageIndex = res.pageNum;
                this.pageBean.Total = res.totalCount;
                this.pageBean.pageSize = res.size;
                this.tableConfig.isLoading = false;
                // 获取设备和设施的图标
                if (!_.isEmpty(this.productList)) {
                    this.productList.forEach(item => {
                        if (String(item.typeFlag) === String(ProductTypeEnum.facility)) {
                            item.iconClass = CommonUtil.getFacilityIConClass(item.typeCode);
                        } else if (String(item.typeFlag) === String(ProductTypeEnum.equipment)) {
                            item.iconClass = CommonUtil.getEquipmentTypeIcon(item as any);
                        } else {
                            item.iconClass = CommonUtil.getFacilityIConClass('D000');
                        }
                        // 判断智慧杆编辑和上传的按钮是否显示
                        item.showPoleUpdate = item.fileExist && item.typeCode === DeviceTypeEnum.wisdom;
                        item.showPoleUpload = !item.fileExist && item.typeCode === DeviceTypeEnum.wisdom;
                        // 判断网关的上传和编辑按钮是否显示
                        item.showGatewayUpdate = item.fileExist && item.typeCode === EquipmentTypeEnum.gateway;
                        item.showGatewayUpload = !item.fileExist && item.typeCode === EquipmentTypeEnum.gateway;
                        // 判断是否显示配置模版 按钮
                        item.showConfigTemplate = item.typeFlag === ProductTypeEnum.equipment;
                    });
                }
            } else {
                this.$message.error(res.msg);
                this.tableConfig.isLoading = false;
            }
        }, () => {
            this.tableConfig.isLoading = false;
        });
    }

    /**
     * 删除产品数据
     */
    private handelDeleteProduct(data: ProductInfoModel[]): void {
        this.$modalService.confirm({
            nzTitle: this.productLanguage.deleteConfirmTitle1,
            nzOkType: 'danger',
            nzContent: `<span>${this.productLanguage.deleteConfirmContent1}</span>`,
            nzOkText: this.commonLanguage.cancel,
            nzMaskClosable: false,
            nzOnOk: () => {
            },
            nzCancelText: this.commonLanguage.confirm,
            nzOnCancel: () => {
                // 做第二遍确认
                this.handelConfirmSecond(data);
            }
        });
    }

    /**
     * 删除产品二次确认
     */
    private handelConfirmSecond(data: ProductInfoModel[]): void {
        this.$modalService.confirm({
            nzTitle: this.productLanguage.deleteConfirmTitle2,
            nzOkType: 'danger',
            nzContent: `<span>${this.productLanguage.deleteWill}${data.length}${this.productLanguage.deleteNum}，${this.productLanguage.pleaseConfirmAgain}</span>`,
            nzOkText: this.commonLanguage.cancel,
            nzMaskClosable: false,
            nzOnOk: () => {
            },
            nzCancelText: this.commonLanguage.confirm,
            nzOnCancel: () => {
                // 正式删除
                const ids = data.map(item => item.productId);
                this.$productService.deleteProduct(ids).subscribe((res: ResultModel<string>) => {
                    if (res.code === ResultCodeEnum.success) {
                        this.$message.success(this.productLanguage.deleteProductSuccess);
                        this.queryCondition.pageCondition.pageNum = 1;
                        this.queryProductList();
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            }
        });
    }

    /**
     * 处理导出数据
     */
    private handelExport(e: ListExportModel<ProductInfoModel[]>): void {
        // 获取导出的数据和文件格式
        const exportData = new ExportRequestModel(e.columnInfoList, e.excelType);
        // 遍历字段设置后台需要特殊处理的标示
        exportData.columnInfoList.forEach(item => {
            if (TRANSLATION_ITEM.includes(item.propertyName)) {
                item.isTranslation = IS_TRANSLATION_CONST;
            }
        });
        //  处理选中的数据
        if (e && !_.isEmpty(e.selectItem)) {
            const productIds = e.selectItem.map(item => item.productId);
            exportData.queryCondition.filterConditions = exportData.queryCondition.filterConditions.concat([new FilterCondition('productId', OperatorEnum.in, productIds)]);
        } else {
            exportData.queryCondition.filterConditions = e.queryTerm;
        }
        // 调用后台的服务接口
        this.$productService.exportProduct(exportData).subscribe((res: ResultModel<string>) => {
            if (res.code === ResultCodeEnum.success) {
                this.$message.success(this.productLanguage.exportProductSuccess);
            } else {
                this.$message.error(res.msg);
            }
        });
    }

    /**
     * 获取产品类型下拉选
     */
    private getProductTypeSelect(): SelectModel[] {
        let selectData = FacilityForCommonUtil.getRoleFacility(this.$nzI18n).filter(item => PRODUCT_DEVICE_TYPE_CONST.includes(item.code as DeviceTypeEnum)) || [];
        selectData = selectData.concat(FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n).filter(item => PRODUCT_EQUIPMENT_TYPE_CONST.includes(item.code as EquipmentTypeEnum))) || [];
        selectData.push({ label: this.productLanguage.other, code: 'other' });
        return selectData;
    }

    /**
     * 确定编码设置
     */
    public onConfirmCodeSetting(): void {
      this.EncodingList.materialRuleBeanList.forEach(i=>{
        delete(i.text)
      })
      this.SetMaterialRule(this.EncodingList)
    }

    /**
     * 查询编码列表
     */
    private getMaterialRule(): void {
        this.EncodingTableConfig.isLoading = true;
        this.$productCommonService.getMaterialRule().subscribe((res: any) => {
            if (res.code === ResultCodeEnum.success) {
               // this.EncodingList = res.data.materialRuleBeanList
               // this.setEncodingListData = res.data
              res.data.materialRuleBeanList.forEach(i=>{
                switch (i.enName) {
                  case 'mainType':
                     i['text'] = 'S'
                    break;
                  case 'subType':
                    i['text'] = '01'
                    break;
                  case 'pattern':
                    i['text'] = '1'
                    break;
                  case 'stuff':
                    i['text'] = '1'
                    break;
                    case 'application':
                    i['text'] = '1'
                    break;
                  case 'supplierNo':
                    i['text'] = '0001'
                    break;
                  case 'version1':
                    i['text'] = '02'
                    break;
                  case 'version2':
                    i['text'] = '02'
                    break;
                  case 'serial':
                    i['text'] = '000001'
                    break;
                }
              })
              this.codeExamples(res.data.materialRuleBeanList)
              this.EncodingList = res.data
                this.EncodingTableConfig.isLoading = false;
            } else {
                this.$message.error(res.msg);
                this.EncodingTableConfig.isLoading = false;
            }
        }, () => {
            this.EncodingTableConfig.isLoading = false;
        });
    }
    /**
    * 更新编码列表
    */
    private SetMaterialRule(body): void {
        this.EncodingTableConfig.isLoading = true;
        this.$productCommonService.setMaterialRule(body).subscribe((res: any) => {
            if (res.code === ResultCodeEnum.success) {
                this.EncodingTableConfig.isLoading = false;
                this.isShowEncodingSetting = false
            } else {
                this.$message.error(res.msg);
                this.EncodingTableConfig.isLoading = false;
            }
        }, () => {
            this.EncodingTableConfig.isLoading = false;
        });
    }

     /**
     * 初始化编码列表参数
     */
   /* private initEncodingSettingTableConfig(): void {
        this.EncodingTableConfig = {
            isDraggable: false,    // 是否拖拽 没有拖拽的时候会自动适配列宽
            isLoading: true,  // 表格是否显示加载状态
            outHeight: 108,   // 表格外界的高度 用来做表格高度自适应
            notShowPrint:false,
            scroll: { x: '1600px', y: '340px' },
            noIndex: true,   // 表格是否需要序号
            rowClick: () => {
            },
            columnConfig: [
                { // 序号
                    title: 'this.productLanguage.serialNum',  // 每列标题
                    type: 'serial-number',  // 类型
                    width: 50,
                },
                { // 物料编码名称
                    title: this.productLanguage.materialCodeName,
                    key: 'zhName',
                    searchConfig: { type: 'input' },  // 搜索配置
                },
                { // 字符长度
                    title:this.productLanguage.materialCodeLength,
                    key: 'length',
                    searchConfig: { type: 'input' }
                },
                { // 是否启用
                    title: this.productLanguage.materialCodeStatus,    // 每列的标题
                    key: 'isUsed',
                    searchable: true,   // 是否可搜索
                    type: 'render',  // 类型
                    renderTemplate: this.policyStatus,  // 当为 类型为render的模板
                    searchConfig: {
                        type: 'select',
                        selectType: 'multiple',
                        selectInfo: this.strategyStatusData(this.EncodingStatusEnum),
                        label: 'label',
                        value: 'code'
                    }
                },
            ]
        };
    }*/
   /*    public strategyStatusData(languageTable) {
          return [
            {label: 'open', code: '1'},
            {label: 'close', code: '0'},
          ];
    }*/

   /**
   * 状态开关
   * */
  /*public switchChange(data): void {
     if (data.isUsed === '0') {
       data.isUsed = '1'
     } else if (data.isUsed === '1'){
       data.isUsed = '0'
     }
     this.setEncodingListData.materialRuleBeanList.forEach(i=>{
       if(i.code ===  data.code)  i.isUsed = data.isUsed
     })
   }*/

  /**
   * 编码状态操作
   */
  private clickSwitch(data: any, i: any): void {
    if (data.isUsed === '0') {
      this.EncodingList.materialRuleBeanList[i].isUsed = '1'
    } else {
      this.EncodingList.materialRuleBeanList[i].isUsed = '0'
    }
    this.codeExamples(this.EncodingList.materialRuleBeanList)
  }

  /**
   * 表格拖拽排序
   * param event
   */
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.EncodingList.materialRuleBeanList, event.previousIndex, event.currentIndex);
    this.codeExamples(this.EncodingList.materialRuleBeanList)
  }

  codeExamples(data:any) {
    const res = []
    data.forEach(i => {
      if (i.isUsed === '1') {
        res.push(i.text)
      }
    })
    this.encodingExample = res.join('-')
  }
}
