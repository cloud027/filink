import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import * as _ from 'lodash';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {ActivatedRoute, Router} from '@angular/router';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {ProductApiService} from '../../share/service/product-api.service';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {ProductForCommonService} from '../../../../core-module/api-service/product/product-for-common.service';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {OperateTypeEnum} from '../../../../shared-module/enum/page-operate-type.enum';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {ProductLanguageInterface} from '../../../../../assets/i18n/product/product.language.interface';
import {SelectModel} from '../../../../shared-module/model/select.model';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {ProductUtil} from '../../share/util/product.util';
import {CameraTypeEnum, EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {PageModel} from '../../../../shared-module/model/page.model';
import {PortInfoModel} from '../../../../core-module/model/product/port-info.model';
import {PageSizeEnum} from '../../../../shared-module/enum/page-size.enum';
import {CallTypeEnum, CloudPlatformTypeEnum, LockTypeEnum, ProductTypeEnum, ProductUnitEnum} from '../../../../core-module/enum/product/product.enum';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {ProductInfoModel} from '../../../../core-module/model/product/product-info.model';
import {EQUIPMENT_SP_COLUMN, MAX_PORT_NUM} from '../../share/const/product.const';
import {ProductCloudPlatformModel} from '../../share/model/product-cloud-platform.model';
import {PRODUCT_DEVICE_TYPE_CONST, PRODUCT_EQUIPMENT_TYPE_CONST} from '../../../../core-module/const/product/product-common.const';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {BINARY_SYSTEM_CONST, IMG_SIZE_CONST} from '../../../facility/share/const/facility-common.const';
import {CompressUtil} from '../../../../shared-module/util/compress-util';
import {FormControl} from '@angular/forms';
import {SupplierDataModel} from '../../../../core-module/model/supplier/supplier-data.model';

/**
 * 新增和编辑产品组件
 */
@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  // 产品类型选中模版
  @ViewChild('productTypeRef') public productTypeRef: TemplateRef<HTMLDocument>;
  // 上传图片模版
  @ViewChild('uploadImgTemp') public uploadImgTemp: TemplateRef<HTMLDocument>;
  // 添加端口字段模版
  @ViewChild('portInfoTemp') public portInfoTemp: TemplateRef<HTMLDocument>;
  // 供应商下拉选
  @ViewChild('supplierTemp') public supplierTemplate: TemplateRef<HTMLDocument>;
  // 端口标示模版
  @ViewChild('portTypeRef') public portTypeRef: TemplateRef<HTMLDocument>;
  // 云平台产品
  @ViewChild('platformProd') public platformProd: TemplateRef<HTMLDocument>;
  // 端口列表
  @ViewChild('portTable') public portTable: TableComponent;
  // 页面加载状态
  public pageLoading: boolean = false;
  // 按钮加载状态
  public isLoading: boolean = false;
  // 页面标题
  public pageTitle: string = '';
  // 表单参数
  public formColumn: FormItem[] = [];
  // 设备表单
  public equipmentFormColumn: FormItem[] = [];
  // 确定保存按钮是否可点击
  public isDisabled: boolean = true;
  // 保存按钮是否不可点击
  public saveBtnDisabled: boolean = true;
  // 是否展示设备表单
  public showEquipmentForm: boolean = false;
  // 是否显示上一步
  public showLastStep: boolean = false;
  // 是否显示下一步
  public showNextStep: boolean = false;
  // 类型无法确定
  public equipmentOrDeviceType: EquipmentTypeEnum | DeviceTypeEnum;
  // 公共语言国际化
  public commonLanguage: CommonLanguageInterface;
  // 产品管理国际化
  public productLanguage: ProductLanguageInterface;
  // 表单实例
  public formInstance: FormOperate;
  // 设备表单
  public equipmentFormInstance: FormOperate;
  // 页面操作类型
  public pageType: OperateTypeEnum = OperateTypeEnum.add;
  // 产品类型枚举
  public productTypeEnum = ProductTypeEnum;
  // 页面操作类型枚举
  public pageOperateEnum = OperateTypeEnum;
  // 产品类型下拉选数据
  public productTypeSelect: SelectModel[] = [];
  // 设备货设施下拉选
  public productTypeModelSelect: SelectModel[] = [];
  // 产品类型
  public productType: ProductTypeEnum;
  // 端口表格参数
  public portInfoList: PortInfoModel[] = [];
  // 端口列表配置参数
  public tableConfig: TableConfigModel = new TableConfigModel();
  // 端口分页内容
  public portPageInfo: PageModel = new PageModel(PageSizeEnum.sizeFive, 1);
  // 是否展示添加端口的内容
  public showAddPort: boolean = false;
  // 端口表单参数
  public portFormConfig: FormItem[] = [];
  // 表单实例
  public portFormInstance: FormOperate;
  // 端口保存按钮是否可操作
  public savePortBtn: boolean = true;
  // 端口列表数据
  public portDataSet: PortInfoModel[] = [];
  // 产品的图片路径
  public productImgUrl: string;
  // 端口标示
  public portFlag: string;
  // 云平台产品
  public appIdList: ProductCloudPlatformModel[] = [];
  // 产品详情
  public productDetail: ProductInfoModel = new ProductInfoModel();

  // 显示供应商选择
  public isShowSupplier: boolean = false;
  // 存放选择的供应商数据
  public selectSupplierList: SupplierDataModel[] = [];
  // 当前选择的供应商
  public selectSupplier: SupplierDataModel = new SupplierDataModel();
  // 产品上传的图片
  private imageList: File[] = [];
  // 设备数据设备多样性，字段都不一样，无法建模型
  private equipmentData: any;


  /**
   * 构造器实例化
   */
  constructor(private $nzI18n: NzI18nService,
              private $ruleUtil: RuleUtil,
              private $modalService: NzModalService,
              private $message: FiLinkModalService,
              private $productForCommonService: ProductForCommonService,
              private $productApiService: ProductApiService,
              private $router: Router,
              private $active: ActivatedRoute) {
  }

  /**
   * 组件初始化
   */
  public ngOnInit(): void {
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.productLanguage = this.$nzI18n.getLocaleData(LanguageEnum.product);
    // 获取页面操作类型及标题
    this.pageType = this.$active.snapshot.params.type;
    this.pageTitle = this.pageType === OperateTypeEnum.update ? this.productLanguage.updateProduct : this.productLanguage.addProduct;
    if (this.pageType === OperateTypeEnum.update) {
      this.$active.queryParams.subscribe(params => {
        this.productDetail.productId = params.productId;
      });
    }
    // 初始化表单数据
    this.initFormColumn();
    // 初始化端口列表
    this.initPortInfoTable();
    // 产品类型下拉选
    this.productTypeSelect = CommonUtil.codeTranslate(ProductTypeEnum, this.$nzI18n, null, LanguageEnum.product) as SelectModel[];
    this.portFlag = this.productLanguage.powerPort;
    // 如果是修改功能需要根据产品id查询产品信息
    if (this.pageType === OperateTypeEnum.update) {
      this.queryProductById();
    }
  }

  /**
   * 组件销毁
   */
  public ngOnDestroy(): void {
    this.portTable = null;
  }

  /**
   * 基础 单实例化校验
   */
  public formCheck(event: { instance: FormOperate }): void {
    this.formInstance = event.instance;
    // 校验表单
    event.instance.group.statusChanges.subscribe(() => {
      if (this.productType === ProductTypeEnum.facility || this.productType === ProductTypeEnum.other) {
        this.saveBtnDisabled = !(event.instance.getRealValid() && this.productType && this.equipmentOrDeviceType);
      } else {
        if (this.equipmentOrDeviceType === EquipmentTypeEnum.intelligentEntranceGuardLock) {
          this.saveBtnDisabled = !(event.instance.getRealValid() && this.productType && this.equipmentOrDeviceType);
        } else {
          this.isDisabled = !(event.instance.getRealValid() && this.productType && this.equipmentOrDeviceType);
          const baseFormDisabled = !(event.instance.getRealValid() && this.productType && this.equipmentOrDeviceType);
          // 判断如果没有点击下一步就不让点击保存按钮
          let equipmentFormDisabled: boolean;
          if (this.equipmentFormInstance && !_.isEmpty(this.equipmentFormInstance.column)) {
            equipmentFormDisabled = !this.equipmentFormInstance.getRealValid();
          } else {
            equipmentFormDisabled = true;
          }
          this.saveBtnDisabled = baseFormDisabled || equipmentFormDisabled;
        }

      }
    });
  }

  /**
   * 端口新增内容栏目是否显示
   */
  public onClickAddPort(): void {
    this.showAddPort = true;
    // 初始化端口表单
    this.initPortForm();
  }

  /**
   * 点击保存端口
   */
  public onClickSavePort(): void {
    // 最多只能增加99个接口
    if (this.portInfoList.length === MAX_PORT_NUM) {
      this.$message.info(this.productLanguage.addPortNum);
      return;
    }
    if (this.savePortBtn) {
      this.$message.info(this.productLanguage.errorPortInfo);
      return;
    }
    // 如果端口的表单校验通过了就保存单口信息
    const portData = this.portFormInstance.group.getRawValue();
    const index = this.portInfoList.findIndex(item => item.portNumber === portData.portNumber && item.portType === portData.portType);
    if (index >= 0) {
      this.$message.info(this.productLanguage.portRepeat);
      return;
    }
    portData.portFlag = this.portFlag;
    this.portInfoList.unshift(portData);
    this.portPageInfo.pageIndex = 1;
    this.portPageInfo.pageSize = PageSizeEnum.sizeFive;
    this.refreshPortInfoList();
    this.portFormInstance.resetData();
  }

  /**
   * 获取产品上传的图片
   */
  public getFile(file: File[]): void {
    this.imageList = file;
  }

  /**
   * 点击关闭新增端口内容
   */
  public onClickClosePort(): void {
    this.portFormInstance.resetData();
    this.showAddPort = false;
  }

  /**
   * 切换端口页面的大小，前端进行分页
   */
  public onPortPageChange(pageInfo: PageModel): void {
    // 清除列表的勾选项
    this.portTable.keepSelectedData.clear();
    this.portTable.updateSelectedData();
    this.portPageInfo.pageIndex = pageInfo.pageIndex;
    this.portPageInfo.pageSize = pageInfo.pageSize;
    this.refreshPortInfoList();
  }

  /**
   *   点击下一步操作
   */
  public onClickNext(): void {
    this.showEquipmentForm = true;
    this.showNextStep = false;
    this.showLastStep = true;
  }

  /**
   * 点击上一步
   */
  public onClickLast(): void {
    this.showEquipmentForm = false;
    this.showNextStep = true;
    this.showLastStep = false;
  }

  /**
   * 取消编辑或者新增回到列表页面
   */
  public onCancel(): void {
    this.$router.navigate(['business/product/product-list']).then();
  }

  /**
   * 修改产品类型
   */
  public onChangeProductType(event: ProductTypeEnum): void {
    if (this.pageType === OperateTypeEnum.add) {
      this.equipmentOrDeviceType = null;
    }
    //  清空端口数组
    this.portInfoList = [];
    this.refreshPortInfoList();
    this.productType = event;
    // 如果式设备就需要显示下一步操作按钮
    // this.showNextStep = event === ProductTypeEnum.equipment;
    // 如果是设施就获取权限下面的设施下拉选数据
    if (event === ProductTypeEnum.facility) {
      //  获取设施数据下拉选
      this.productTypeModelSelect = FacilityForCommonUtil.getRoleFacility(this.$nzI18n).filter(
        item => PRODUCT_DEVICE_TYPE_CONST.includes(item.code as DeviceTypeEnum));
    } else if (event === ProductTypeEnum.equipment) {
      // 过滤特定的设备类型
      this.productTypeModelSelect = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n).filter(
        item => PRODUCT_EQUIPMENT_TYPE_CONST.includes(item.code as EquipmentTypeEnum));
    } else {
      // 其它类型
      this.productTypeModelSelect = [{label: this.productLanguage.other, code: 'other'}];
    }
    // 控制数据容量是否展示
    this.formColumn.forEach(item => {
      if (EQUIPMENT_SP_COLUMN.includes(item.key)) {
        item.hidden = this.productType === ProductTypeEnum.facility;
      }
      // 修改图片的label
      if (item.key === 'image') {
        item.label = this.productType === ProductTypeEnum.equipment ? this.productLanguage.equipmentImg : this.productLanguage.facilityImg;
      }
      if (item.key === 'pattern' && this.productType === ProductTypeEnum.facility) {
        item.hidden = true;
      }
    });
    this.formInstance.group.updateValueAndValidity();
  }

  /**
   * 端口表单校验
   */
  public portFormCheck(event: { instance: FormOperate }): void {
    this.portFormInstance = event.instance;
    event.instance.group.statusChanges.subscribe(() => {
      this.savePortBtn = !(event.instance.getRealValid() && this.portFlag);
    });
  }

  /**
   * 设备表单校验
   */
  public equipmentFormCheck(event: { instance: FormOperate }): void {
    this.equipmentFormInstance = event.instance;
    event.instance.group.statusChanges.subscribe(() => {
      this.saveBtnDisabled = !event.instance.getRealValid();
    });
    // 当为智能门禁锁时没有下一步的设备信息
    if (!_.isEmpty(this.equipmentData) && this.pageType === OperateTypeEnum.update
      && this.productDetail.typeFlag === ProductTypeEnum.equipment
      && this.productDetail.typeCode !== EquipmentTypeEnum.intelligentEntranceGuardLock) {
      this.equipmentFormInstance.resetData(this.equipmentData);
    }
  }

  /**
   * 保存产品
   */
  public onClickSaveProduct(): void {
    this.isLoading = true;
    // 获取表单真实数据
    const formData: ProductInfoModel = this.formInstance.getRealData();
    // 产品类型
    formData.typeFlag = this.productType;
    // 设备或者设施的具体类型
    formData.typeCode = this.equipmentOrDeviceType;
    // 增加供应商名称
    formData.supplierName = this.selectSupplier.supplierName;
    formData.supplier = this.selectSupplier.supplierId;
    formData.supplierNo = this.selectSupplier.supplierNum;
    // 设置产品id
    formData.productId = this.productDetail.productId;
    // 如果是新增设备接口，就需要将端口的list和设备的特殊字段加进去
    if (this.productType === ProductTypeEnum.equipment) {
      formData.productPortList = this.portInfoList;
      formData.equipmentInfo = JSON.stringify(_.cloneDeep(this.equipmentFormInstance.group.getRawValue()));
    }
    // 如果选择了云平台产品--需要传云平台产品的名称
    if (formData.appId) {
      const productCloud = this.appIdList.find(item => item.appId === formData.appId);
      if (productCloud) {
        formData.appName = productCloud.appName;
      }
    }
    // 如果有部门code 加上部门code
    if (this.productDetail.deptCode) {
      formData.deptCode = this.productDetail.deptCode;
    }
    // 如果是新增设备调用新增的接口
    let productRequest: Observable<ResultModel<string>>;
    if (this.pageType === OperateTypeEnum.add) {
      productRequest = this.$productApiService.addProduct(formData);
    } else {
      productRequest = this.$productApiService.updateProduct(formData);
    }
    // step1先调用产品的插入接口
    productRequest.subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        if (this.pageType === OperateTypeEnum.add) {
          // 调用上传图片的接口
          if (_.isEmpty(this.imageList) || !this.imageList[0].name) {
            this.isLoading = false;
            // 路由跳转
            this.confirmUploadPoleAndGateway(res.data);
          } else {
            // step2再调用产品图片的插入接口
            this.handelImageUpload(res.data);
          }
        } else {
          // 有一种情况 不调更新图片接口 当图片第一次回显，没有文件上传文件直接点击保存
          if (!_.isEmpty(this.imageList) && !this.imageList[0].name) {
            this.isLoading = false;
            // 路由跳转
            this.confirmUploadPoleAndGateway(res.data);
            return;
          }
          // 如果当前是修改页面 没有上传文件也必须调用更新产品图片接口（删除图片）
          this.handelImageUpload(res.data);
        }
      } else {
        this.$message.error(res.msg);
        this.isLoading = false;
      }
    }, () => this.isLoading = false);
  }

  /**
   * 设备或设施类型切换
   */
  public onChangeType(event: EquipmentTypeEnum | DeviceTypeEnum): void {
    // 如果式设备就需要显示下一步操作按钮
    this.showNextStep = this.productType === ProductTypeEnum.equipment && event !== EquipmentTypeEnum.intelligentEntranceGuardLock;
    // 切换类型时将端口清除
    this.portInfoList = [];
    this.refreshPortInfoList();
    // 如果是设备类型下面的非网关类型则需要展示端口字段
    this.formColumn.forEach(item => {
      if (item.key === 'portList') {
        item.hidden = !(this.productType === ProductTypeEnum.equipment && event !== EquipmentTypeEnum.gateway);
      }
      // 摄像头形态字段是否隐藏
      if (item.key === 'pattern') {
        item.hidden = (event !== EquipmentTypeEnum.camera && event !== EquipmentTypeEnum.intelligentEntranceGuardLock
          && event !== EquipmentTypeEnum.oneTouchCalling );
        if (event === EquipmentTypeEnum.camera) {
          item.label = this.productLanguage.cameraType;
          item.radioInfo.data = CommonUtil.codeTranslate(CameraTypeEnum, this.$nzI18n, null, LanguageEnum.product);
          this.formInstance.resetControlData(item.key, null);
        }
        if (event === EquipmentTypeEnum.intelligentEntranceGuardLock) {
          item.label = this.productLanguage.lockType;
          item.radioInfo.data = CommonUtil.codeTranslate(LockTypeEnum, this.$nzI18n, null, LanguageEnum.product);
          this.formInstance.resetControlData(item.key, null);
        }
        if (event === EquipmentTypeEnum.oneTouchCalling) {
          item.label = this.productLanguage.callType;
          item.radioInfo.data = CommonUtil.codeTranslate(CallTypeEnum, this.$nzI18n, null, LanguageEnum.product);
          this.formInstance.resetControlData(item.key, null);
        }
      }
    });
    // 更新表单的校验
    this.formInstance.group.updateValueAndValidity();
    // 先根据设备类型获取到设备类型的表单额外的参数信息
    this.equipmentFormColumn = ProductUtil.getEquipmentColumns(
      this.equipmentOrDeviceType as EquipmentTypeEnum, this.productLanguage, this.$ruleUtil);
  }

  /**
   * 切换云平台类型
   */
  public onChangePlatformType(data: CloudPlatformTypeEnum): void {
    this.formColumn.forEach(item => {
      if (item.key === 'appId') {
        item.hidden = (data === CloudPlatformTypeEnum.privateCloud || !data);
      }
    });
    if (data && data !== CloudPlatformTypeEnum.privateCloud) {
      // 先清空产品类型的数据
      this.formInstance.resetControlData('appId', null);
      // 如果平台类型是非私有云就查询云平台的产品数据
      this.$productApiService.queryPlatformProduct(data).subscribe((res: Map<string, any>) => {
        if (res) {
          const tempProduct = _.map(res, (item) => {
            return item;
          }) || [];
          this.appIdList = _.cloneDeep(tempProduct);
        } else {
          this.appIdList = [];
        }
        if (this.productDetail.appId && this.appIdList.find(item => item.appId === this.productDetail.appId)) {
          this.formInstance.resetControlData('appId', this.productDetail.appId);
        } else {
          this.formInstance.group.controls['appId'].setValue('');
        }
        Promise.resolve().then(() => {
          this.formInstance.group.updateValueAndValidity();
        });
      });
    }
    this.formInstance.group.updateValueAndValidity();
  }

  /**
   * 供应商选择改变事件
   */
  public onSelectSupplier(event: SupplierDataModel[]): void {
    this.selectSupplierList = event;
    if (event && event.length) {
      this.selectSupplier = event[0];
      this.formInstance.resetControlData('supplier', this.selectSupplier.supplierId);
    }
  }

  /**
   * 刷新端口列表数据
   */
  private refreshPortInfoList(): void {
    this.portPageInfo.Total = this.portInfoList.length;
    this.portDataSet = this.portInfoList.slice(this.portPageInfo.pageSize * (
      this.portPageInfo.pageIndex - 1), this.portPageInfo.pageIndex * this.portPageInfo.pageSize);
  }

  /**
   * 初始化表单字段
   */
  private initFormColumn(): void {
    this.formColumn = [
      { // 规格型号
        label: this.productLanguage.productModel,
        key: 'productModel',
        type: 'input',
        col: 24,
        require: true,
        disabled: this.pageType === OperateTypeEnum.update,
        rule: [{required: true}, RuleUtil.getNameMaxLengthRule(255)],
        customRules: [],
      },
      { // 产品类型
        label: this.productLanguage.model,
        key: 'typeFlag',
        type: 'custom',
        disabled: this.pageType === OperateTypeEnum.update,
        template: this.productTypeRef,
        col: 24,
        require: true,
        rule: [],
        customRules: [],
      },
      { // 摄像头形态
        label: this.productLanguage.cameraType,
        key: 'pattern',
        type: 'radio',
        col: 24,
        disabled: this.pageType === OperateTypeEnum.update,
        require: true,
        hidden: true,
        rule: [{required: true}],
        modelChange: (controls: FormControl, $event, key: string) => {
          if (this.equipmentOrDeviceType === EquipmentTypeEnum.intelligentEntranceGuardLock) {
            this.formInstance.setColumnHidden(['softwareVersion', 'hardwareVersion', 'platformType', 'appId', 'communicateType', 'portList'],
              $event === LockTypeEnum.passiveLock);
          }
          // 当为无缘锁时候清空 云平台类型 云平台产品
          if ($event === LockTypeEnum.passiveLock) {
            this.formInstance.resetControlData('platformType', null);
            this.formInstance.resetControlData('appId', null);
          }
          // 云平台产品的值根据云平台类型的是否有值显示,为私有云也不用显示
          const platformTypeValue = this.formInstance.getData('platformType');
          this.formInstance.setColumnHidden(['appId'], !Boolean(platformTypeValue) || platformTypeValue === CloudPlatformTypeEnum.privateCloud);
        },
        customRules: [],
        radioInfo: {
          data: CommonUtil.codeTranslate(CameraTypeEnum, this.$nzI18n, null, LanguageEnum.product),
          label: 'label',
          value: 'code'
        }
      },
      { // 软件版本
        label: this.productLanguage.softVersion,
        key: 'softwareVersion',
        type: 'input',
        col: 24,
        hidden: true,
        disabled: this.pageType === OperateTypeEnum.update,
        require: true,
        rule: [{required: true}, RuleUtil.getNameMaxLengthRule(255)],
        customRules: [],
      },
      { // 硬件版本
        label: this.productLanguage.hardWareVersion,
        key: 'hardwareVersion',
        type: 'input',
        col: 24,
        hidden: true,
        disabled: this.pageType === OperateTypeEnum.update,
        require: true,
        rule: [{required: true}, RuleUtil.getNameMaxLengthRule(255)],
        customRules: [],
      },
      { // 供应商
        label: this.productLanguage.supplier,
        key: 'supplier',
        type: 'custom',
        template: this.supplierTemplate,
        col: 24,
        require: true,
        rule: [{required: true}],
        customRules: [],
      },
      {  // 云平台类型
        label: this.productLanguage.platformType,
        key: 'platformType',
        type: 'select',
        col: 24,
        hidden: true,
        require: false,
        rule: [],
        customRules: [],
        allowClear: true,
        selectInfo: {
          data: CommonUtil.codeTranslate(CloudPlatformTypeEnum, this.$nzI18n, null, LanguageEnum.product),
          label: 'label',
          value: 'code'
        },
        modelChange: (group, value) => {
          this.onChangePlatformType(value);
        }
      },
      { // 云平台产品
        label: this.productLanguage.platformProduct,
        key: 'appId',
        type: 'custom',
        template: this.platformProd,
        col: 24,
        hidden: true,
        require: true,
        rule: [{required: true}],
        customRules: [],
      },
      { // 通信模式
        label: this.productLanguage.communicateType,
        key: 'communicateType',
        type: 'input',
        col: 24,
        hidden: true,
        require: false,
        rule: [RuleUtil.getNameMaxLengthRule(255)],
        customRules: [],
      },
      { // 计量单位
        label: this.productLanguage.unit,
        key: 'unit',
        type: 'select',
        col: 24,
        require: true,
        rule: [{required: true}],
        customRules: [],
        selectInfo: {
          data: CommonUtil.codeTranslate(ProductUnitEnum, this.$nzI18n, null, LanguageEnum.product),
          label: 'label',
          value: 'code'
        }
      },
      { // 单价
        label: this.productLanguage.price,
        key: 'price',
        type: 'input',
        col: 24,
        require: true,
        rule: [{required: true}, this.$ruleUtil.getPriceRule()],
        customRules: [],
      },
      { // 端口
        label: this.productLanguage.port,
        key: 'portList',
        type: 'custom',
        hidden: true,
        template: this.portInfoTemp,
        require: false,
        rule: [],
        customRules: [],
      },
      { // 数据容量(条)产品类型是设备时才显示
        label: this.productLanguage.amount,
        key: 'dataCapacity',
        type: 'input',
        col: 24,
        hidden: true,
        require: false,
        rule: [this.$ruleUtil.getDataCapacityRule()],
        customRules: [],
      },

      { // 产品功能
        label: this.productLanguage.productFeatures,
        key: 'description',
        type: 'input',
        col: 24,
        require: false,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule()],
        customRules: [],
      },
      { // 报废年限
        label: this.productLanguage.scrapTime,
        key: 'scrapTime',
        type: 'number',
        col: 24,
        require: false,
        rule: [this.$ruleUtil.scrapTimeRule()],
        customRules: [],
      },
      { // 设备实景图
        label: this.productLanguage.facilityImg,
        key: 'image',
        type: 'custom',
        col: 24,
        rule: [],
        template: this.uploadImgTemp
      },
      { // 备注
        label: this.productLanguage.remarks, key: 'remark',
        type: 'textarea',
        col: 24,
        placeholder: this.productLanguage.pleaseEnter,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule()]
      },
    ];
  }

  /**
   * 初始化端口表格
   */
  private initPortInfoTable(): void {
    this.tableConfig = {
      isDraggable: false,
      isLoading: false,
      outHeight: 108,
      showSizeChanger: true,
      showSearchSwitch: false,
      showPagination: true,
      scroll: {x: '1804px', y: '340px'},
      noIndex: true,
      showSearchExport: false,
      notShowPrint: true,
      simplePage: true,
      simplePageTotalShow: true,
      columnConfig: [
        { // 选择
          title: this.productLanguage.select,
          type: 'select',
          width: 62
        },
        { // 序号
          type: 'serial-number',
          title: this.productLanguage.serialNum,
          width: 62
        },
        { // 端口类型
          title: this.productLanguage.portFlag, key: 'portFlag',
          width: 80
        },
        { // 端口类型
          title: this.productLanguage.portType, key: 'portType',
          width: 80
        },
        { // 端口编号
          title: this.productLanguage.portNo, key: 'portNumber',
          width: 80
        },
        { // 操作列
          title: this.productLanguage.operate,
          key: '', width: 80,
        },
      ],
      operation: [
        { // 删除产品
          text: this.productLanguage.delete,
          className: 'fiLink-delete red-icon',
          btnType: 'danger',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          canDisabled: false,
          confirmContent: this.productLanguage.confirmDeleteData,
          handle: (data: PortInfoModel) => {
            this.handelDeletePort([data]);
          }
        },
      ],
      topButtons: [
        { // 批量删除
          text: this.productLanguage.delete,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          permissionCode: '03-1-4',
          canDisabled: true,
          needConfirm: true,
          confirmContent: this.productLanguage.confirmDeleteData,
          handle: (data: PortInfoModel[]) => {
            this.handelDeletePort(data);
          }
        },
      ]
    };
  }

  /**
   * 处理端口列表删除逻辑
   */
  private handelDeletePort(ports: PortInfoModel[]): void {
    this.portInfoList = _.differenceWith(this.portInfoList, ports);
    this.portPageInfo.pageIndex = 1;
    this.portPageInfo.pageSize = PageSizeEnum.sizeFive;
    this.refreshPortInfoList();
  }

  /**
   * 初始化端口的表单
   */
  private initPortForm(): void {
    this.portFormConfig = [
      { // 端口标识
        label: this.productLanguage.portFlag,
        key: 'portFlag',
        type: 'custom',
        template: this.portTypeRef,
        col: 24,
        require: true,
        rule: [],
        customRules: [],
      },
      { // 端口类型
        label: this.productLanguage.portType,
        key: 'portType',
        type: 'select',
        col: 24,
        require: true,
        rule: [{required: true}],
        customRules: [],
        selectInfo: {
          // 电路端口固定的三个下拉选
          data: [{label: '12V', code: '12V'}, {label: '24V', code: '24V'}, {label: '220V', code: '220V'}],
          label: 'label',
          value: 'code'
        }
      },
      { // 端口编号
        label: this.productLanguage.portNo,
        key: 'portNumber',
        type: 'input',
        col: 24,
        require: true,
        rule: [{required: true}, this.$ruleUtil.scrapTimeRule(), RuleUtil.getNameMaxLengthRule(2)],
        customRules: [],
      },
    ];
  }

  /**
   * 是否跳转到网关图和杆型图的上传
   */
  private confirmUploadPoleAndGateway(productId: string): void {
    // 不是网关或智慧杆就直接跳转到列表
    if (![DeviceTypeEnum.wisdom, EquipmentTypeEnum.gateway].includes(this.equipmentOrDeviceType)) {
      this.$message.success(this.pageType === OperateTypeEnum.add ?
        this.productLanguage.addProductSuccess : this.productLanguage.updateProductSuccess);
      this.onCancel();
    } else {
      //  如果是网关或者是智慧杆需要确定是否上传网关图或者智慧杆图
      let url = '';
      let msg = '';
      let pageType = '';
      if (this.equipmentOrDeviceType === DeviceTypeEnum.wisdom) {
        // 判断是需要新增杆型图还是需要编辑杆型图
        url = this.productDetail.fileExist ? 'business/product/product-wisdom/update' : 'business/product/product-wisdom/add';
        pageType = this.productDetail.fileExist ? OperateTypeEnum.update : OperateTypeEnum.add;
        msg = this.productDetail.fileExist ? this.productLanguage.confirmUpdatePole : this.productLanguage.confirmUploadPole;
      } else if (this.equipmentOrDeviceType === EquipmentTypeEnum.gateway) {
        // 判断是需要新增网关图还是需要编辑网关图
        url = this.productDetail.fileExist ? 'business/product/product-gateway/update' : 'business/product/product-gateway/add';
        pageType = this.productDetail.fileExist ? OperateTypeEnum.update : OperateTypeEnum.add;
        msg = this.productDetail.fileExist ? this.productLanguage.confirmUpdateGateway : this.productLanguage.confirmUploadGateway;
      }
      this.$modalService.confirm({
        nzTitle: msg,
        nzOkType: 'danger',
        nzContent: '',
        nzOkText: this.commonLanguage.cancel,
        nzMaskClosable: false,
        nzOnOk: () => {
          this.onCancel();
        },
        nzCancelText: this.commonLanguage.confirm,
        nzOnCancel: () => {
          this.$router.navigate([url], {queryParams: {productId: productId, operateType: pageType}}).then();
        }
      });
    }
  }

  /**
   *  处理图片上传
   */
  private handelImageUpload(productId: string): void {
    this.handelImageSize(this.imageList).then(file => {
      const formData = new FormData();
      formData.append('productId', productId);
      if (file) {
        formData.append('files', file, file.name);
      } else {
        formData.append('files', null);
      }
      this.isLoading = true;
      // 调用后台的接口
      this.$productApiService.insertBatchPictures(formData).subscribe((res: ResultModel<string>) => {
        if (res.code === ResultCodeEnum.success) {
          this.isLoading = false;
          this.confirmUploadPoleAndGateway(productId);
        } else {
          this.$message.error(res.msg);
          this.isLoading = false;
        }
      }, () => this.isLoading = false);
    });
  }

  /**
   * 处理图片的大小
   * param imageList
   */
  private handelImageSize(imageList: File[]): Promise<File> {
    return new Promise((resolve, reject) => {
      if (!imageList.length) {
        resolve(null);
      }
      imageList.forEach(item => {
        if (item.size / (BINARY_SYSTEM_CONST) > IMG_SIZE_CONST) {
          CompressUtil.compressImg(item).then((res: File) => {
            resolve(res);
          });
        } else {
          resolve(item);
        }
      });
    });
  }

  /**
   * 根据产品id查询产品详情
   */
  private queryProductById(): void {
    this.$productForCommonService.getProductInfoById(this.productDetail.productId).subscribe((res: ResultModel<ProductInfoModel>) => {
      if (res.code === ResultCodeEnum.success) {
        this.productDetail = res.data;
        this.selectSupplier.supplierId = this.productDetail.supplier;
        this.selectSupplier.supplierName = this.productDetail.supplierName;
        this.productType = this.productDetail.typeFlag;
        this.equipmentOrDeviceType = this.productDetail.typeCode;
        // 基础表单进行字段回显
        this.formInstance.resetData(this.productDetail);
        // 获取端口信息
        this.portInfoList = this.productDetail.productPortList;
        // 设置端口分页参数
        this.portPageInfo.Total = this.portInfoList.length;
        // 触发类型的切换事件
        this.onChangeProductType(this.productType);
        // 触发是选择设备还是选择设施
        this.onChangeType(this.productDetail.typeCode);
        // 设备专有字段进行回显
        if (this.productDetail.typeFlag === ProductTypeEnum.equipment && this.productDetail.equipmentInfo) {
          this.equipmentData = JSON.parse(this.productDetail.equipmentInfo);
        }
        this.productImgUrl = this.productDetail.fileFullPath;
        // 形态回显
        this.formInstance.resetControlData('pattern', this.productDetail.pattern);
        // 端口回显
        if (!_.isEmpty(this.productDetail.productPortList)) {
          this.portInfoList = this.productDetail.productPortList;
          this.refreshPortInfoList();
        }
      } else {
        this.$message.error(res.msg);
      }
    });
  }
}
