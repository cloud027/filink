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
 * ??????????????????
 */
@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent extends ListUnitSelector implements OnInit, OnDestroy {
    //  ??????????????????
    @ViewChild('productTypeTemplate') public productTypeTemplate: TemplateRef<HTMLDocument>;
    // ????????????????????????
    @ViewChild('unitTemplate') public unitTemplate: TemplateRef<HTMLDocument>;
    // ???????????????
    @ViewChild('cloudPlatformTemp') public cloudPlatformTemp: TemplateRef<HTMLDocument>;
    // ??????
    @ViewChild('importProductTemp') public importProductTemp: TemplateRef<HTMLDocument>;
    // ????????????
    @ViewChild('webUploader') public webUploader: WebUploadComponent;
    // ????????????????????????
    @ViewChild('UnitNameSearch') UnitNameSearch: TemplateRef<any>;
    // ????????????
    @ViewChild('userSearchTemp') public userSearchTemp: TemplateRef<any>;
    // ?????????????????????
    @ViewChild('supplierTemp') public supplierTemp: TemplateRef<any>;
   // ????????????
    @ViewChild('policyStatus') policyStatus: TemplateRef<any>;
    // ?????????????????????
    public productList: ProductInfoModel[] = [];
    // ????????????
    public pageBean: PageModel = new PageModel();
    // ????????????
    public tableConfig: TableConfigModel = new TableConfigModel();
    // ???????????????????????????
    public productLanguage: ProductLanguageInterface;
    // ?????????????????????
    public commonLanguage: CommonLanguageInterface;
    // ?????????????????????
    public queryCondition: QueryConditionModel = new QueryConditionModel();
    // ??????????????????
    public equipmentTypeEnum = EquipmentTypeEnum;
    // ??????????????????
    public deviceTypeEnum = DeviceTypeEnum;
    // ??????????????????
    public productTypeEnum = ProductTypeEnum;
    // ???????????????
    public languageEnum = LanguageEnum;
    // ???????????????????????????????????????????????????
    public batchUploadVisible: boolean = false;
    public isShowWisdomUpload: boolean = false;
    // ??????????????????
    public uploadType: ProductFileTypeEnum;
    // ??????????????????
    public uploadFileEnum = ProductFileTypeEnum;
    // ????????????????????????
    public productUnitEnum = ProductUnitEnum;
    // ????????????
    public productFileList: UploadFile[] = [];
    // ??????????????????
    public fileArray: UploadFile[] = [];
    // ????????????
    public productFileType: string;
    // ?????????????????????
    public cloudPlatformEnum = CloudPlatformTypeEnum;
    // ????????????id
    public productUploadEnum = UploadBusinessModulesEnum;
    // ????????????
    public defaultAccepts: SupportFileType = {
        title: '',
        extensions: 'zip',
        mimeTypes: 'application/x-zip-compressed'
    };
    public callBakUrl: string;
    public isShowUserTemp: boolean = false;
    // ????????????
    public checkUserObject: FilterValueModel = new FilterValueModel();
    // ??????????????????
    public selectUserList: UserRoleModel[] = [];

    // ???????????????
    public selectSupplierObject: FilterValueModel = new FilterValueModel();
    // ?????????????????????
    public isShowSupplier: boolean = false;
    // ??????????????????????????????
    public selectSupplierList: SupplierDataModel[] = [];
    // ?????????????????????
    private supplierFilterValue: FilterCondition;
    // ????????????
    private userFilterValue: FilterCondition;
    // ????????????
    private webSocketInstance;

  // ??????????????????????????????
  public isShowEncodingSetting: boolean = false;
  // ??????????????????????????? ??????????????????
  public encodingSwitchStatus: boolean = true;
  // ????????????????????????
  public EncodingTableConfig: TableConfigModel = new TableConfigModel();
  // ???????????????????????????
  public EncodingList: any = {materialRuleBeanList:[]};
  // ????????????????????????
  public EncodingGetUrl: string;
  // ????????????????????????
  public setEncodingListData
  // ??????????????????
  @ViewChild(' EncodingStatusTemp') private EncodingStatusTemp: TemplateRef<any>;

  // ????????????
  public encodingExample:string;
  /**
   * ??????????????????
   */
  public EncodingStatusEnum: any = {
    /**
     * ??????
     */
    enable: '1',
    /**
     * ??????
     */
    disable: '0'
  }

  public presentLanguage:string;   // ????????????
    /**
     * ?????????
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
     * ???????????????
     */
    public ngOnInit(): void {
        const userInfo = SessionUtil.getUserInfo();
        this.presentLanguage = SessionUtil.getLanguage();
      // ???????????????????????????????????????
        const equipmentList = userInfo.role.roleDeviceTypeDto.equipmentTypes;
        const deviceList = userInfo.role.roleDeviceTypeDto.deviceTypes;
        // ??????????????????
        this.productLanguage = this.$nzI18n.getLocaleData(LanguageEnum.product);
        this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
        // ?????????????????????
        this.initTableConfig();
        if (equipmentList.includes('E001')) {
            this.tableConfig.moreButtons.push({
                // ?????????????????????
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
                    // ?????????????????????
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
                    // ????????????
                    text: this.productLanguage.EncodingSetting,  // ??????
                    iconClassName: 'fiLink-batch-coding-icon',  // ??????
                    permissionCode: ProductPermissionEnum.EncodingSetting,  // ????????????
                    canDisabled: false,
                    handle: () => {
                      this.getMaterialRule()
                      this.isShowEncodingSetting = true;
                        // ?????????????????????????????????
                       // this.initEncodingSettingTableConfig()
                        // ???????????????????????????
                    }
                });
        this.queryProductList();
        this.initTreeSelectorConfig();
        // ??????????????????
        this.$refresh.refreshChangeHook.subscribe(() => {
            this.queryProductList();
        });
        // ????????????????????????????????????websocket????????????
        this.getWebsocketMsg();
    }

    /**
     * ??????
     */
    public ngOnDestroy(): void {
        this.webUploader = null;
        this.webSocketInstance.unsubscribe();
    }

    /**
     * ????????????????????????
     */
    public pageChange(event: PageModel): void {
        this.queryCondition.pageCondition.pageSize = event.pageSize;
        this.queryCondition.pageCondition.pageNum = event.pageIndex;
        this.queryProductList();
    }

    /**
     * ??????????????????
     */
    public openUserSelector(filterValue: FilterCondition): void {
        this.isShowUserTemp = true;
        this.userFilterValue = filterValue;
        this.userFilterValue.operator = OperatorEnum.in;
    }

    /**
     * ????????????
     */
    public onSelectUser(event: UserRoleModel[]): void {
        this.selectUserList = event;
        WorkOrderClearInspectUtil.selectUser(event, this);
    }

    /**
     * ????????????????????????
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
     * ???????????????????????????
     */
    public onSelectSupplier(event: SupplierDataModel[]): void {
        this.selectSupplierList = event;
        SupplierForCommonUtil.selectSupplier(event, this);
    }

    /**
     * ????????????
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
     * ??????????????????????????????????????? todo ???????????????????????????????????????
     */
    public onBeforeUpload = (file: UploadFile) => {
        return false;
    }

    /**
     * ?????????????????? todo ???????????????????????????????????????
     */
    public onConfirmUploadFile(): void {
    }

    /**
     * ???????????????????????????
     */
    public getFilesMsg(event: WebUploaderModel): void {
        if (event && event.isUploadFinished) {
            this.isShowWisdomUpload = false;
            this.webUploader.handleCancel();
            this.$message.success(this.productLanguage.filesUploadSuccess);
        }
    }

    /**
     * ????????????????????????????????????????????????
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
     * websocket????????????
     *  channelKey    pole - ???  gateway - ??????
     */
    private getWebsocketMsg(): void {
        this.webSocketInstance = this.$wsService.subscibeMessage.subscribe(res => {
            if (res && res.data && JSON.parse(res.data)) {
                const data = JSON.parse(res.data);
                if (data.channelKey === 'pole' || data.channelKey === 'gateway') {
                    // ?????????????????????
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
                    // ????????????
                    this.queryProductList();
                }
            }
        });
    }

    /**
     * ?????????????????????
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
                { // ??????
                    title: this.productLanguage.select,
                    type: 'select',
                    fixedStyle: { fixedLeft: true, style: { left: '0px' } },
                    width: 62
                },
                { // ??????
                    type: 'serial-number',
                    width: 62,
                    title: this.productLanguage.serialNum,
                    fixedStyle: { fixedLeft: true, style: { left: '62px' } }
                },
                { // ????????????
                    title: this.productLanguage.productModel, key: 'productModel', width: 150,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: { type: 'input' }
                },
                { // ??????
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
                { // ????????????
                    title: this.productLanguage.softVersion, key: 'softwareVersion', width: 150,
                    configurable: true,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: { type: 'input' }
                },
                { // ????????????
                    title: this.productLanguage.hardWareVersion, key: 'hardwareVersion', width: 150,
                    configurable: true,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: { type: 'input' }
                },
                { // ?????????
                    title: this.productLanguage.supplier, key: 'supplierName', width: 150,
                    configurable: true,
                    isShowSort: true,
                    sortKey: 'supplierId',
                    searchKey: 'supplierId',
                    searchable: true,
                    searchConfig: { type: 'render', renderTemplate: this.supplierTemp }
                },
                { // ???????????????
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
                { // ???????????????
                    title: this.productLanguage.platformProduct, key: 'appName', width: 150,
                    configurable: true,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: { type: 'input' }
                },
                { // ????????????
                    title: this.productLanguage.communicateType, key: 'communicateType', width: 150,
                    configurable: true,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: { type: 'input' }
                },
                { // ????????????
                    title: this.productLanguage.productFeatures, key: 'description', width: 150,
                    configurable: true,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: { type: 'input' }
                },
                { // ????????????
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
                { // ???????????????
                    title: this.productLanguage.price, key: 'price', width: 150,
                    configurable: true,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: { type: 'input' }
                },
                { // ????????????
                    title: this.productLanguage.scrapTime, key: 'scrapTime', width: 100,
                    configurable: true,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: { type: 'input' }
                },
                { // ?????????
                    title: this.productLanguage.createUser, key: 'createUserName', width: 120,
                    configurable: true,
                    isShowSort: true,
                    sortKey: 'createUser',
                    searchKey: 'createUser',
                    searchable: true,
                    searchConfig: { type: 'render', renderTemplate: this.userSearchTemp },
                },
                { // ????????????
                    title: this.productLanguage.createTime, key: 'createTime', width: 150,
                    isShowSort: true,
                    pipe: 'date',
                    pipeParam: 'yyyy-MM-dd hh:mm:ss',
                    configurable: true,
                    searchable: true,
                    searchConfig: { type: 'dateRang' }
                },
                { // ????????????
                    title: this.productLanguage.updateTime, key: 'updateTime', width: 150,
                    pipe: 'date',
                    pipeParam: 'yyyy-MM-dd hh:mm:ss',
                    configurable: true,
                    searchable: true,
                    isShowSort: true,
                    searchConfig: { type: 'dateRang' }
                },
                {
                    // ????????????
                    title: this.productLanguage.deptName, key: 'deptName', width: 180, isShowSort: true,
                    searchKey: 'deptCode',
                    sortKey: 'deptCode',
                    configurable: true,
                    searchable: true,
                    searchConfig: { type: 'render', renderTemplate: this.UnitNameSearch }
                },
                { // ??????
                    title: this.productLanguage.remarks, key: 'remark', width: 150,
                    configurable: true,
                    isShowSort: true,
                    searchable: true,
                    searchConfig: { type: 'input' }
                },
                { // ?????????
                    title: this.productLanguage.operate,
                    searchable: true,
                    searchConfig: { type: 'operate' },
                    key: '', width: 180,
                    fixedStyle: { fixedRight: true, style: { right: '0px' } }
                },
            ],
            topButtons: [
                { // ??????
                    text: this.productLanguage.add,
                    iconClassName: 'fiLink-add-no-circle',
                    permissionCode: ProductPermissionEnum.addProduct,
                    handle: () => {
                        this.$router.navigate(['/business/product/product-detail/add']).then();
                    }
                },
                { // ????????????
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
                { // ??????
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
                { // ??????
                    permissionCode: ProductPermissionEnum.updateProduct,
                    text: this.productLanguage.edit, className: 'fiLink-edit', handle: (data: ProductInfoModel) => {
                        this.$router.navigate(['/business/product/product-detail/update'], { queryParams: { productId: data.productId } }).then();
                    },
                },
                { // ????????????
                    permissionCode: ProductPermissionEnum.configTemplate,
                    key: 'showConfigTemplate',
                    text: this.productLanguage.configTemplate, className: 'fiLink-config-template', handle: (data: ProductInfoModel) => {
                        // ?????????????????? ??????
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
                { // ???????????????
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
                { // ???????????????
                    text: this.productLanguage.updateGatewayImg,
                    className: 'fiLink-edit-gateway',
                    key: 'showGatewayUpdate',
                    permissionCode: ProductPermissionEnum.editGatewayImg,
                    handle: (data: ProductInfoModel) => {
                        this.$router.navigate(['/business/product/product-gateway/update'],
                            { queryParams: { productId: data.productId, operateType: OperateTypeEnum.update }, preserveFragment: true }).then();
                    },
                },
                { // ???????????????
                    text: this.productLanguage.uploadWisdomImg,
                    key: 'showPoleUpload',
                    className: 'fiLink-upload-pole',
                    permissionCode: ProductPermissionEnum.uploadPoleImg,
                    handle: (data: ProductInfoModel) => {
                        this.$router.navigate(['/business/product/product-wisdom/add'],
                            { queryParams: { productId: data.productId, operateType: OperateTypeEnum.add } }).then();
                    },
                },
                { // ???????????????
                    text: this.productLanguage.updateWisdomImg,
                    key: 'showPoleUpdate',
                    className: 'fiLink-edit-pole',
                    permissionCode: ProductPermissionEnum.editPoleImg,
                    handle: (data: ProductInfoModel) => {
                        this.$router.navigate(['/business/product/product-wisdom/update'],
                            { queryParams: { productId: data.productId, operateType: OperateTypeEnum.update } }).then();
                    },
                },
                { // ????????????
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
                {// ??????????????????????????????
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
                {// ????????????
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
                // ?????????????????????????????????eq
                const price = this.queryCondition.filterConditions.find(item => item.filterField === 'price');
                if (price) {
                    price.operator = OperatorEnum.eq;
                }
                // ???????????????????????????????????????eq
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
     * ??????????????????
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
     * ??????????????????
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
                // ??????????????????????????????
                if (!_.isEmpty(this.productList)) {
                    this.productList.forEach(item => {
                        if (String(item.typeFlag) === String(ProductTypeEnum.facility)) {
                            item.iconClass = CommonUtil.getFacilityIConClass(item.typeCode);
                        } else if (String(item.typeFlag) === String(ProductTypeEnum.equipment)) {
                            item.iconClass = CommonUtil.getEquipmentTypeIcon(item as any);
                        } else {
                            item.iconClass = CommonUtil.getFacilityIConClass('D000');
                        }
                        // ???????????????????????????????????????????????????
                        item.showPoleUpdate = item.fileExist && item.typeCode === DeviceTypeEnum.wisdom;
                        item.showPoleUpload = !item.fileExist && item.typeCode === DeviceTypeEnum.wisdom;
                        // ????????????????????????????????????????????????
                        item.showGatewayUpdate = item.fileExist && item.typeCode === EquipmentTypeEnum.gateway;
                        item.showGatewayUpload = !item.fileExist && item.typeCode === EquipmentTypeEnum.gateway;
                        // ?????????????????????????????? ??????
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
     * ??????????????????
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
                // ??????????????????
                this.handelConfirmSecond(data);
            }
        });
    }

    /**
     * ????????????????????????
     */
    private handelConfirmSecond(data: ProductInfoModel[]): void {
        this.$modalService.confirm({
            nzTitle: this.productLanguage.deleteConfirmTitle2,
            nzOkType: 'danger',
            nzContent: `<span>${this.productLanguage.deleteWill}${data.length}${this.productLanguage.deleteNum}???${this.productLanguage.pleaseConfirmAgain}</span>`,
            nzOkText: this.commonLanguage.cancel,
            nzMaskClosable: false,
            nzOnOk: () => {
            },
            nzCancelText: this.commonLanguage.confirm,
            nzOnCancel: () => {
                // ????????????
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
     * ?????????????????? todo ???????????????
     */
    private handelExport(e: ListExportModel<ProductInfoModel[]>): void {
        // ????????????????????????????????????
        const exportData = new ExportRequestModel(e.columnInfoList, e.excelType);
        // ???????????????????????????????????????????????????
        exportData.columnInfoList.forEach(item => {
            if (TRANSLATION_ITEM.includes(item.propertyName)) {
                item.isTranslation = IS_TRANSLATION_CONST;
            }
        });
        //  ?????????????????????
        if (e && !_.isEmpty(e.selectItem)) {
            const productIds = e.selectItem.map(item => item.productId);
            exportData.queryCondition.filterConditions = exportData.queryCondition.filterConditions.concat([new FilterCondition('productId', OperatorEnum.in, productIds)]);
        } else {
            exportData.queryCondition.filterConditions = e.queryTerm;
        }
        // ???????????????????????????
        this.$productService.exportProduct(exportData).subscribe((res: ResultModel<string>) => {
            if (res.code === ResultCodeEnum.success) {
                this.$message.success(this.productLanguage.exportProductSuccess);
            } else {
                this.$message.error(res.msg);
            }
        });
    }

    /**
     * ???????????????????????????
     */
    private getProductTypeSelect(): SelectModel[] {
        let selectData = FacilityForCommonUtil.getRoleFacility(this.$nzI18n).filter(item => PRODUCT_DEVICE_TYPE_CONST.includes(item.code as DeviceTypeEnum)) || [];
        selectData = selectData.concat(FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n).filter(item => PRODUCT_EQUIPMENT_TYPE_CONST.includes(item.code as EquipmentTypeEnum))) || [];
        selectData.push({ label: this.productLanguage.other, code: 'other' });
        return selectData;
    }

    /**
     * ??????????????????
     */
    public onConfirmCodeSetting(): void {
      this.EncodingList.materialRuleBeanList.forEach(i=>{
        delete(i.text)
      })
      this.SetMaterialRule(this.EncodingList)
    }

    /**
     * ??????????????????
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
    * ??????????????????
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
     * ???????????????????????????
     */
   /* private initEncodingSettingTableConfig(): void {
        this.EncodingTableConfig = {
            isDraggable: false,    // ???????????? ??????????????????????????????????????????
            isLoading: true,  // ??????????????????????????????
            outHeight: 108,   // ????????????????????? ??????????????????????????????
            notShowPrint:false,
            scroll: { x: '1600px', y: '340px' },
            noIndex: true,   // ????????????????????????
            rowClick: () => {
            },
            columnConfig: [
                { // ??????
                    title: 'this.productLanguage.serialNum',  // ????????????
                    type: 'serial-number',  // ??????
                    width: 50,
                },
                { // ??????????????????
                    title: this.productLanguage.materialCodeName,
                    key: 'zhName',
                    searchConfig: { type: 'input' },  // ????????????
                },
                { // ????????????
                    title:this.productLanguage.materialCodeLength,
                    key: 'length',
                    searchConfig: { type: 'input' }
                },
                { // ????????????
                    title: this.productLanguage.materialCodeStatus,    // ???????????????
                    key: 'isUsed',
                    searchable: true,   // ???????????????
                    type: 'render',  // ??????
                    renderTemplate: this.policyStatus,  // ?????? ?????????render?????????
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
   * ????????????
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
   * ??????????????????
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
   * ??????????????????
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
