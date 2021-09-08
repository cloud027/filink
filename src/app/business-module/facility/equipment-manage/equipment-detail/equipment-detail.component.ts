import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {NzI18nService, NzModalService, NzSelectComponent, NzTreeNode, UploadFile} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {EquipmentApiService} from '../../share/service/equipment/equipment-api.service';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {MapSelectorConfigModel} from '../../../../shared-module/model/map-selector-config.model';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {CompressUtil} from '../../../../shared-module/util/compress-util';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {AreaModel} from '../../../../core-module/model/facility/area.model';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {EXCLUDE_FIELDS, TYPE_OBJECT_CONST} from '../../share/const/facility-common.const';
import {SelectModel} from '../../../../shared-module/model/select.model';
import {EquipmentModelModel} from '../../share/model/equipment-model.model';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {OperateTypeEnum} from '../../../../shared-module/enum/page-operate-type.enum';
import {PicResourceEnum} from '../../../../core-module/enum/picture/pic-resource.enum';
import {BINARY_SYSTEM_CONST, IMG_SIZE_CONST} from '../../../../core-module/const/common.const';
import {ObjectTypeEnum} from '../../../../core-module/enum/facility/object-type.enum';
import {QueryGatewayPortEnum} from '../../share/enum/equipment.enum';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {FacilityDetailInfoModel} from '../../../../core-module/model/facility/facility-detail-info.model';
import {EquipmentAddInfoModel} from '../../../../core-module/model/equipment/equipment-add-info.model';
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {QueryRealPicModel} from '../../../../core-module/model/picture/query-real-pic.model';
import {PictureListModel} from '../../../../core-module/model/picture/picture-list.model';
import {LoopListModel} from '../../../../core-module/model/loop/loop-list.model';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';
import {PageModel} from '../../../../shared-module/model/page.model';
import {ProductTypeEnum} from '../../../../core-module/enum/product/product.enum';
import {ProductLanguageInterface} from '../../../../../assets/i18n/product/product.language.interface';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {ProductForCommonService} from '../../../../core-module/api-service/product/product-for-common.service';
import {PRODUCT_DEVICE_TYPE_CONST, PRODUCT_EQUIPMENT_TYPE_CONST} from '../../../../core-module/const/product/product-common.const';
import {TableComponent} from '../../../../shared-module/component/table/table.component';


/**
 * 新增设备或编辑设备组件
 * created by PoHe
 */
@Component({
  selector: 'app-equipment-detail',
  templateUrl: './equipment-detail.component.html',
  styleUrls: ['./equipment-detail.component.scss'],
})
export class EquipmentDetailComponent implements OnInit, OnDestroy {
  // 所属网关端口类型(设备类型)
  @Input() public gatewayPortTypeList: Array<string | number>;
  // 所属网关端口类型(电力端口或网关端口)
  @Input() public gatewayPortFlagList;
  // 网关配置新增操作
  @Input() public isAddOperate: boolean = false;
  // 是否为杆体示意图新增设备
  @Input() public isWisdomPicture: boolean = false;
  // 是否为网关配置
  @Input() public isGateway: boolean = false;
  // 设施基础信息回填
  @Input() public deviceDetail;
  // 杆体图点击点位新增设备时，对点位设备类型做限制
  @Input() public equipmentType;
  // 所属网关端口
  @Input() public gatewayPort: string;
  // 网关禁止修改
  @Input() public gatewayNameDisabled: boolean = true;
  // 是否显示表单标题
  @Input() public isHasTitle: boolean = true;
  // 是否显示表单底部按钮
  @Input() public isHasButton: boolean = true;
  // 所属网关
  @Input() public gatewayName: string;
  // 获取表单实例
  @Output() public getFormStatus = new EventEmitter<FormOperate>();
  // 表单是否可以提交
  @Output() public getFormDisabled = new EventEmitter<boolean>();
  // 新增参数
  @Output() public getExtraRequest = new EventEmitter<EquipmentAddInfoModel>();
  // 图片上传模版
  @ViewChild('uploadImgTemp') private uploadImgTemp: TemplateRef<HTMLDocument>;
  // 型号所属位置
  @ViewChild('nzSelectComponent') private nzSelectComponent: NzSelectComponent;
  // 告警名称模版
  @ViewChild('equipmentNameTemp') private equipmentNameTemp: TemplateRef<HTMLDocument>;
  // 设施表单显示模版
  @ViewChild('facilitiesSelector') private facilitiesSelector: TemplateRef<HTMLDocument>;
  // 区域选择模版
  @ViewChild('areaSelector') private areaSelectorTemp: TemplateRef<HTMLDocument>;
  // 安装时间模版
  @ViewChild('installationDateTemplate') private installationDateTemplate: TemplateRef<HTMLDocument>;
  // 挂载位置
  @ViewChild('positionByDeviceTemplate') private positionByDeviceTemplate: TemplateRef<HTMLDocument>;
  // 类型选择
  @ViewChild('modelByTypeTemplate') private modelByTypeTemplate: TemplateRef<HTMLDocument>;
  // 网关模型
  @ViewChild('gatewaySelectorTemp') private gatewaySelectorTemp: TemplateRef<HTMLDocument>;
  // 电源控制器设备
  @ViewChild('powerControlTemp') private powerControlTemp: TemplateRef<HTMLDocument>;
  // 网关端口下拉选
  @ViewChild('gatewayPortTemp') private gatewayPortTemp: TemplateRef<HTMLDocument>;
  // 回路下拉选
  @ViewChild('loopTemplate') private loopTemplate: TemplateRef<HTMLDocument>;
  // 电源控制器端口模版
  @ViewChild('powerPortTemp') private powerPortTemp: TemplateRef<HTMLDocument>;
  // 设备类型选择
  @ViewChild('equipmentSelect') private equipmentSelect: TemplateRef<HTMLDocument>;
  @ViewChild('radioTemp') private radioTemp: TemplateRef<HTMLDocument>;
  //  产品类型模版
  @ViewChild('productTypeTemplate') public productTypeTemplate: TemplateRef<HTMLDocument>;
  @ViewChild('productTemp') public productTemp: TemplateRef<HTMLDocument>;
  @ViewChild('tableCom') public tableCom: TableComponent;
  // 告警
  public productName: string = '';
  // 表单配置
  public formColumn: FormItem[] = [];
  // 表单实例
  public formStatus: FormOperate;
  public supplierId;
  // 页面标题
  public pageTitle: string;
  // 页面加载状态
  public pageLoading: boolean = false;
  // 确定按钮的状态
  public isDisabled: boolean = true;
  // 设备国际化
  public language: FacilityLanguageInterface;
  // 设施类型枚举
  public deviceTypeEnum = DeviceTypeEnum;
  // 产品类型枚举
  public productTypeEnum = ProductTypeEnum;
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 设施国际化
  public languageEnum = LanguageEnum;
  // 产品管理国际化词条
  public productLanguage: ProductLanguageInterface;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  // 设施选择器是否显示
  public mapVisible: boolean = false;
  // 设施选择器配置
  public mapSelectorConfig: MapSelectorConfigModel;
  // 区域选择器配置
  public areaSelectorConfig: TreeSelectorConfigModel = new TreeSelectorConfigModel();
  // 区域选择器弹框是否展示
  public areaSelectVisible: boolean = false;
  //  挂载位置下拉选
  public positionSelectList: string[] = [];
  // 页面操作类型，新增或编辑
  public operateTypeEnum = OperateTypeEnum;
  //  型号下拉选
  public modelChangeValue: EquipmentModelModel[] = [];
  // 新增或修改设备信息数据模型
  public saveEquipmentModel: EquipmentAddInfoModel = new EquipmentAddInfoModel();
  // 页面操作类型，新增或编辑
  public operateType: string = OperateTypeEnum.add;
  // 网关端口下拉选
  public gatewayPortList = [];
  // 电源控制器端口下拉选数据
  public powerPortList = [];
  // 设备类型是否是电子锁
  public isLock: boolean = false;
  // 图片回显路径
  public equipmentPic: string;
  // 网关选择器是否展示
  public gatewayVisible: boolean = false;
  // 传输方式是否展示
  public isShowGatewayResolverType: boolean = true;
  // 控制表单项是否能操作
  public formItemDisable: boolean = true;
  // 电源控制器设备选择是否显示
  public powerControlVisible: boolean = false;
  // 编辑时型号不可修改
  public productTempDisabled: boolean = true;
  // 网关查询条件
  public gatewayFilter: FilterCondition[] = [];
  // 电源控制设备查询条件
  public powerControlFilter: FilterCondition[] = [];
  // 选择设备类型值设施选择器的过滤条件
  public facilityFilter: FilterCondition[] = [];
  // 回路下拉线
  public loopList: LoopListModel[] = [];
  // 上传选择的文件 此处没给类型是因为图片有可能被压缩类型会有问题
  public fileList = [];
  // 关联设施所选设施
  public selectDeviceInfo: FacilityDetailInfoModel = new FacilityDetailInfoModel();
  // 设备类型下拉线数据
  private equipmentTypeList: SelectModel[] = [];
  // 区域选择节点
  private areaNodes: NzTreeNode[] = [];
  // 选择区域对象
  private areaInfo: AreaModel = new AreaModel();
  // 列表数据
  public _dataSet = [];
  // 分页
  public pageBean: PageModel = new PageModel();
  // 查询参数对象集
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 列表配置
  public tableConfig: TableConfigModel = new TableConfigModel();
  // 选择设备id
  public selectedProductId: string = null;
  // 电源控制设备端口
  public powerControlPortNo: string;
  // 复制已选择告警
  public _selectedProduct;
  public productDisable = true;
  // 所选槽位信息回填
  public WisdomPictureMountPosition;
  // 对于输入框输入完之后去除前后空格
  inputDebounce = _.debounce((event) => {
    event.target.value = event.target.value.trim();
  }, 500, {leading: false, trailing: true});
  // 电源控制设备开关
  public powerControlDataChange: boolean = false;

  /**
   * 构造器
   */
  constructor(
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $ruleUtil: RuleUtil,
    private $active: ActivatedRoute,
    private $router: Router,
    private $http: HttpClient,
    private $equipmentAipService: EquipmentApiService,
    private $facilityCommonService: FacilityForCommonService,
    private $productCommonService: ProductForCommonService,
    private $tempModal: NzModalService,
  ) {
  }

  /**
   * 初始化组件
   */
  public ngOnInit(): void {
    this.productLanguage = this.$nzI18n.getLocaleData(LanguageEnum.product);
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.operateType = this.$active.snapshot.params.type;
    this.initTableConfig();
    // 设备类型获取
    this.getEquipmentType();
    // 根据页面的操作不通获取不通的标题
    this.pageTitle = this.operateType === OperateTypeEnum.update ? this.language.editEquipment : this.language.addEquipment;
    if (this.pageTitle === this.language.addEquipment) {
      this.productTempDisabled = false;
    }
    // 根据新增或编辑进行初始化数据
    this.handelInit();
    this.formColumn.forEach(v => {
      if (v.key === 'portNo') {
        v.hidden = !this.gatewayPort;
      }
    });
    // 杆体示意图回填设施信息
    if (this.isWisdomPicture) {
      setTimeout(() => {
        this.selectDataChange([this.deviceDetail]);
        this.positionSelectList = [this.deviceDetail.mountPosition];
        this.WisdomPictureMountPosition = [this.deviceDetail.mountPosition];
        this.formStatus.resetControlData('mountPosition', this.deviceDetail.mountPosition);
        this.saveEquipmentModel.gatewayName = null;
      }, 0);
    }
    if (this.isGateway && this.gatewayPortFlagList === 'electric') {
      this.formColumn.forEach(item => {
        if (item.key === 'gatewayResolverType') {
          item.hidden = true;
          item.require = true;
          item.rule = [];
        } else if (item.key === 'portNo') {
          item.require = false;
          item.rule = [];
        }
      });
    }
  }

  /**
   * 设备选择modal
   */
  public showProductSelectorModal(): void {
    if (this.productTempDisabled) {
      return;
    }
    if (this.productDisable) {
      this.$message.info(this.language.pleaseCompleteEquipmentTypeInfo);
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
          }
        },
        {
          label: this.commonLanguage.cancel,
          type: 'danger',
          onClick: () => {
            this._dataSet = [];
            modal.destroy();
          }
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
   * 选择设备     只能选单条
   * param modal
   */
  private selectAlarm(modal): void {
    if (this._selectedProduct) {
      this.productName = this._selectedProduct.productModel;
      // const tempModel = this.modelChangeValue.find(item => item.model === event);
      // if (tempModel) {
      // this.saveEquipmentModel.equipmentModel = event;
      // this.saveEquipmentModel.equipmentModelType = tempModel.modelType;
      this.supplierId = this._selectedProduct.supplier;
      this.formStatus.resetControlData('supplier', this._selectedProduct.supplierName);
      this.formStatus.resetControlData('equipmentModel', this._selectedProduct.productModel);
      this.formStatus.resetControlData('scrapTime', this._selectedProduct.scrapTime);
      // }
      // this.getExtraRequest.emit(this.saveEquipmentModel);
      modal.destroy();
    } else {
      this.$message.warning(this.language.pleaseCompleteProductInfo);
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
      scroll: {x: '1804px', y: '340px'},
      noIndex: true,
      columnConfig: [
        {
          title: '', type: 'render',
          key: 'selectedProductId',
          renderTemplate: this.radioTemp,
          fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 42
        },
        { // 序号
          type: 'serial-number',
          width: 62,
          title: this.productLanguage.serialNum,
          fixedStyle: {fixedLeft: true, style: {left: '42px'}}
        },
        { // 规格型号
          title: this.productLanguage.productModel, key: 'productModel', width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 类型
          title: this.productLanguage.model, key: 'typeCode', width: 150,
          type: 'render',
          renderTemplate: this.productTypeTemplate,
          isShowSort: true,
        },
        { // 供应商
          title: this.productLanguage.supplier, key: 'supplierName', width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 报废年限
          title: this.productLanguage.scrapTime, key: 'scrapTime', width: 100,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 软件版本
          title: this.productLanguage.softVersion, key: 'softwareVersion', width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 硬件版本
          title: this.productLanguage.hardWareVersion, key: 'hardwareVersion', width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // 操作列
          title: this.productLanguage.operate,
          searchable: true,
          searchConfig: {type: 'operate'},
          key: '', width: 180,
          fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition = event;
        this.queryProductList();
      },
      handleSearch: (event: FilterCondition[]) => {
        event.forEach(item => {
          if (item.filterField === 'scrapTime') {
            item.operator = 'eq';
          }
        });
        this.queryCondition.filterConditions = event;
        this.queryProductList();
      }
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

  /**
   * 获取产品类型下拉选
   */
  private getProductTypeSelect(): SelectModel[] {
    let selectData = FacilityForCommonUtil.getRoleFacility(this.$nzI18n).filter(item => PRODUCT_DEVICE_TYPE_CONST.includes(item.code as DeviceTypeEnum)) || [];
    selectData = selectData.concat(FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n).filter(item => PRODUCT_EQUIPMENT_TYPE_CONST.includes(item.code as EquipmentTypeEnum))) || [];
    return selectData;
  }

  /**
   * 查询产品列表
   */
  private queryProductList(): void {
    this.tableConfig.isLoading = true;
    const hasCode = this.queryCondition.filterConditions.filter(item => item.filterField === 'typeCode');
    if (hasCode.length === 0) {
      this.queryCondition.filterConditions.push(new FilterCondition('typeCode', OperatorEnum.in, [this.saveEquipmentModel.equipmentType]));
    } else {
      this.queryCondition.filterConditions.forEach(item => {
        if (item.filterField === 'typeCode') {
          item.filterValue = [this.saveEquipmentModel.equipmentType];
        }
      });
    }
    this.$productCommonService.queryProductList(this.queryCondition).subscribe((res: ResultModel<any>) => {
      if (res.code === ResultCodeEnum.success) {
        this._dataSet = res.data || [];
        this.pageBean.pageIndex = res.pageNum;
        this.pageBean.Total = res.totalCount;
        this.pageBean.pageSize = res.size;
        this.tableConfig.isLoading = false;
        // 获取设备和设施的图标
        if (!_.isEmpty(this._dataSet)) {
          this._dataSet.forEach(item => {
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
   *  获取设备类型
   */
  public getEquipmentType() {
    // 设备列表新增设备类型获取有权限的设备
    this.equipmentTypeList = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n);
    // 排除智能门禁电子锁（新增排除，编辑不能排除。有需要回显的可能）
    if ((this.operateType === OperateTypeEnum.add) || this.isGateway) {
      this.equipmentTypeList = this.equipmentTypeList.filter(item => item.code !== EquipmentTypeEnum.intelligentEntranceGuardLock);
    }
    // 网关配置新增需要特殊处理
    if (this.isAddOperate) {
      // 用户有权限的设备类型和网关端口能连设备类型交集
      this.equipmentTypeList = this.equipmentTypeList.filter(item => item.code !== EquipmentTypeEnum.gateway);
    }
    // 杆体图点击点位新增设备时，对点位设备类型做限制
    if (this.isWisdomPicture) {
      this.equipmentTypeList = this.equipmentType.map(item => {
        return {label: item.label, code: item.value};
      });
    }
  }


  /**
   * 组件销毁
   */
  public ngOnDestroy(): void {
    this.areaSelectorTemp = null;
    this.uploadImgTemp = null;
    this.facilitiesSelector = null;
  }

  /**
   * 保存设备
   */
  public onClickSaveEquipment(): void {
    const formValue = _.cloneDeep(this.formStatus.group.getRawValue());
    this.pageLoading = true;
    // 有些特殊的字段不在表单存在需要特殊处理
    Object.keys(this.saveEquipmentModel).forEach(item => {
      if (!formValue[item] && this.saveEquipmentModel[item] && !EXCLUDE_FIELDS.includes(item)) {
        formValue[item] = _.cloneDeep(this.saveEquipmentModel[item]);
      }
    });
    // 时间需要转化成时间戳
    formValue.installationDate = formValue.installationDate ? new Date(formValue.installationDate).getTime() : null;
    formValue.supplierId = this.supplierId;
    let request;
    let successMsg;
    if (formValue.portNo) {
      formValue.portType = formValue.portNo.split(',')[0];
      formValue.portNo = formValue.portNo.split(',')[1];
    }
    if (formValue.powerControlPortNo) {
      formValue.powerControlPortType = formValue.powerControlPortNo.split(',')[0];
      formValue.powerControlPortNo = formValue.powerControlPortNo.split(',')[1];
    }
    // 新增操作
    if (this.operateType === OperateTypeEnum.add) {
      formValue.softwareVersion = this._selectedProduct.softwareVersion;
      formValue.hardwareVersion = this._selectedProduct.hardwareVersion;
      // 区分摄像头为枪型还是球型
      formValue.equipmentModelType = this._selectedProduct.pattern;
      request = this.$equipmentAipService.addEquipment(formValue);
      successMsg = this.language.addEquipmentSuccess;
      // 修改操作
    } else {
      request = this.$equipmentAipService.updateEquipmentById(formValue);
      successMsg = this.language.updateEquipmentSuccess;
    }
    request.subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        // 判断各种状态下面是否调用上传照片的接口
        if (this.operateType === OperateTypeEnum.add) {
          // 如果图片列表不为空则调用上传图片接口，否则直接给提示
          if (!_.isEmpty(this.fileList)) {
            this.uploadEquipmentPic(result.data);
          } else {
            this.$message.success(successMsg);
            this.onClickCancel();
            this.pageLoading = false;
          }
        } else if (this.operateType === OperateTypeEnum.update) {
          // 如果是修改则判断文件大小是否为0
          if (!_.isEmpty(this.fileList) && this.fileList[0].size === 0) {
            this.$message.success(successMsg);
            this.onClickCancel();
            this.pageLoading = false;
          } else {
            this.uploadEquipmentPic(result.data);
          }
        }
      } else {
        this.pageLoading = false;
        this.$message.error(result.msg);
      }
    }, () => this.pageLoading = false);
  }

  /**
   * 修改网关触发事件
   */
  public onGatewayDataChange(event: EquipmentListModel[]): void {
    if (!_.isEmpty(event)) {
      this.formColumn.forEach(item => {
        if (item.key === 'gatewayResolverType') {
          item.hidden = false;
          item.require = true;
          item.rule = [];
        }
      });
      // this.isShowGatewayResolverType = false;
      // 清空网关端口
      this.formStatus.resetControlData('portNo', null);
      this.formStatus.resetControlData('gatewayId', event[0].equipmentId);
      this.saveEquipmentModel.gatewayName = event[0].equipmentName;
      this.saveEquipmentModel.gatewayId = event[0].equipmentId;
      this.saveEquipmentModel.equipmentControlType = event[0].equipmentType;
      this.formColumn.forEach(item => {
        if (item.key === 'portNo') {
          item.hidden = event[0].equipmentType !== EquipmentTypeEnum.gateway;
          this.formStatus.group.updateValueAndValidity();
        }
      });
      // 根据网关查询网关端口
      this.queryGatewayPort(QueryGatewayPortEnum.gateway);
    } else {
      // this.isShowGatewayResolverType = true;
      this.formColumn.forEach(item => {
        if (item.key === 'gatewayResolverType') {
          item.hidden = true;
          item.require = false;
          item.rule = [];
        }
      });
      this.formStatus.resetControlData('gatewayResolverType', null);
      this.formStatus.resetControlData('portNo', null);
      this.formStatus.resetControlData('gatewayId', null);
      this.saveEquipmentModel.gatewayResolverType = null;
      this.saveEquipmentModel.gatewayName = null;
      this.saveEquipmentModel.gatewayId = null;
      this.saveEquipmentModel.portNo = null;
      this.saveEquipmentModel.equipmentControlType = null;
      this.formColumn.forEach(item => {
        if (item.key === 'portNo') {
          item.hidden = true;
          this.formStatus.group.updateValueAndValidity();
        }
      });
    }
  }

  /**
   * 选择电源控制设备触发事件
   */
  public onPowerControlDataChange(powerData: EquipmentListModel[]): void {
    this.saveEquipmentModel.powerControlPortNo = null;
    // 清除端口字段
    this.formStatus.resetControlData('powerControlPortNo', null);
    if (!_.isEmpty(powerData)) {
      this.powerControlDataChange = true;
      this.saveEquipmentModel.powerControlId = powerData[0].equipmentId;
      this.saveEquipmentModel.powerControlName = powerData[0].equipmentName;
      this.formColumn[16].require = true;
      this.formStatus.resetControlData('powerControlId', powerData[0].equipmentId);
      // 清除端口字段
      this.formStatus.resetControlData('powerControlPortNo', null);
      // 如果选择的电源控制器是网关则需要要显示电源控制器端口字段
      this.formColumn.forEach(item => {
        if (item.key === 'powerControlPortNo') {
          item.hidden = powerData[0].equipmentType !== EquipmentTypeEnum.gateway;
          // 如果没隐藏端口就查询电源控制器端口
          if (!item.hidden) {
            // 查询电源控制器端口
            this.queryGatewayPort(QueryGatewayPortEnum.powerControl, true);
          }
        }
      });
    } else {
      console.log(2);
      this.powerControlDataChange = false;
      this.formColumn[16].require = false;
      this.saveEquipmentModel.powerControlId = null;
      // this.saveEquipmentModel.powerControlName = null;
      this.saveEquipmentModel.powerControlName = powerData[0] ? powerData[0].equipmentName : null;
      this.formStatus.resetControlData('powerControlId', null);
      this.formColumn.forEach(item => {
        if (item.key === 'powerControlPortNo') {
          item.hidden = true;
        }
      });
    }
    this.getExtraRequest.emit(this.saveEquipmentModel);
  }

  /**
   * 取消编辑设备
   */
  public onClickCancel(): void {
    // 回到之前的页面
    this.$router.navigateByUrl(`business/facility/equipment-list`).then();
  }

  /**
   * 获取表单实例
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    // 校验表单
    event.instance.group.statusChanges.subscribe(() => {
      if (this.powerControlDataChange === false) {
        this.isDisabled = !event.instance.getRealValid();
      } else {
        this.isDisabled = this.formStatus.getData('powerControlPortNo') ? !event.instance.getRealValid() : true;
      }
      this.getFormDisabled.emit(this.isDisabled);
      this.formStatus['supplierId'] = this.supplierId;
      this.getFormStatus.emit(this.formStatus);
    });
    event.instance.group.controls['equipmentType'].valueChanges.subscribe(value => {
      const sequenceId = this.formStatus.getColumn('sequenceId').item;
      if (value === 'E030') {
        sequenceId.require = true;
        sequenceId.rule.push({required: true});
        this.formStatus.addValidRule(sequenceId);
        // 编辑设备时，一键呼叫设备id不可修改；
        if (this.pageTitle !== this.language.addEquipment) {
          event.instance.group.controls['sequenceId'].disable();
        }
      } else {
        sequenceId.require = false;
        this.formStatus.deleteValidRule(sequenceId);
      }
      this.formStatus.group.get('sequenceId').markAsPristine();
      this.formStatus.group.get('sequenceId').updateValueAndValidity();
    });
  }

  /**
   * 自动生成设备名称
   */
  public onClickAuto(): void {
    // 校验类型和所属区域是否选择，自动生成名称，这两个字段为必填
    if (!this.formStatus.getData('equipmentType')
      || !this.formStatus.getData('deviceId')) {
      this.$message.warning(this.language.pleaseCompleteTheInformation);
      return;
    }
    const equipmentTypeName = CommonUtil.codeTranslate(EquipmentTypeEnum, this.$nzI18n, this.formStatus.getData('equipmentType'));
    // 凭借地市和设备类型
    const temp = {equipmentName: `${this.selectDeviceInfo.cityName ? this.selectDeviceInfo.cityName : ''}${equipmentTypeName}`};
    // 调用后台自动生成名称接口
    this.$equipmentAipService.getEquipmentName(temp).subscribe(
      (result: ResultModel<string>) => {
        if (result.code === ResultCodeEnum.success) {
          this.saveEquipmentModel.equipmentName = result.data;
          // 将设备名称设置进表单
          this.formStatus.resetControlData('equipmentName', result.data);
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * 选择区域
   */
  public areaSelectChange(event: AreaModel[]): void {
    if (!_.isEmpty(event)) {
      this.areaInfo = event[0];
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, this.areaInfo.areaId);
      this.saveEquipmentModel.areaName = this.areaInfo.areaName;
      this.saveEquipmentModel.areaId = this.areaInfo.areaId;
      this.saveEquipmentModel.areaCode = this.areaInfo.areaCode;
      this.formStatus.resetControlData('areaId', this.areaInfo.areaId);
    } else {
      this.areaInfo = null;
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, null);
      this.saveEquipmentModel.areaName = '';
      this.saveEquipmentModel.areaId = null;
      this.saveEquipmentModel.areaCode = null;
      this.formStatus.resetControlData('areaId', null);
    }
    this.getExtraRequest.emit(this.saveEquipmentModel);
    this.checkCodingRule();
  }

  /**
   *  选择设施
   */
  public selectDataChange(event): void {
    if (!_.isEmpty(event)) {
      // 此处出现选择第一个 是因为可能是单选或多选，事件以数组形式抛出
      const tempData = event[0];
      this.saveEquipmentModel.deviceName = tempData.deviceName;
      this.saveEquipmentModel.deviceId = tempData.deviceId;
      this.saveEquipmentModel.address = tempData.address;
      this.saveEquipmentModel.positionBase = tempData.positionBase;
      this.saveEquipmentModel.deviceType = tempData.deviceType;
      // 选择设施之后，所属区域默认为设施所属区域
      this.areaInfo = tempData.areaInfo;
      this.saveEquipmentModel.areaName = tempData.areaName;
      this.saveEquipmentModel.areaId = tempData.areaId;
      this.checkCodingRule();
      this.formStatus.resetControlData('deviceId', tempData.deviceId);
      this.formStatus.resetControlData('areaId', this.areaInfo.areaId);
      this.saveEquipmentModel.areaCode = this.areaInfo.areaCode;
      this.selectDeviceInfo = tempData;
      this.setMountPosition(this.selectDeviceInfo.deviceType);
      // 清空挂载位置
      this.formStatus.resetControlData('mountPosition', null, {emitEvent: true});
      this.saveEquipmentModel.mountPosition = null;
      // 查询设施下面的挂载位置
      this.findMountPositionById();
      // 查询设施的回路信息
      this.queryLoopListByDeviceId();
      // 设置区域
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, this.areaInfo.areaId);
    }
    this.getExtraRequest.emit(this.saveEquipmentModel);
  }

  /**
   * 如果选择的设施是智慧杆就显示挂载位置
   */
  private setMountPosition(data: DeviceTypeEnum): void {
    this.formColumn.forEach(item => {
      // 如果类型为集中控制器就隐藏挂载位置，不是集中控制器就显示挂载位置
      if (item.key === 'mountPosition') {
        item.hidden = data !== DeviceTypeEnum.wisdom;
        item.require = false;
        item.rule = [];
      }
    });
  }

  /**
   * 获取选择的上传的图片
   */
  public getFileList(event: UploadFile[]): void {
    this.fileList = event;
  }

  /**
   * 型号选择
   */
  public onSelectedModelChange(event: string): void {
    const tempModel = this.modelChangeValue.find(item => item.model === event);
    if (tempModel) {
      this.saveEquipmentModel.equipmentModel = event;
      this.saveEquipmentModel.equipmentModelType = tempModel.modelType;
      this.formStatus.resetControlData('supplier', tempModel.supplierName);
      this.formStatus.resetControlData('scrapTime', tempModel.scrapTime);
    }
    this.getExtraRequest.emit(this.saveEquipmentModel);
  }

  /**
   * 展示区域选择
   */
  public onClickShowArea(): void {
    this.initArea();
    this.areaSelectVisible = true;
  }

  /**
   * 跳转到页面之后进行新增或者编辑的路由参数
   */
  private handelInit(): void {
    //  初始化设施选择器
    if (this.operateType !== OperateTypeEnum.add) {
      this.$active.queryParams.subscribe(params => {
        this.saveEquipmentModel.equipmentId = params.equipmentId;
      });
      //  网关配置新增设备不请求详情信息
      if (this.saveEquipmentModel.equipmentId) {
        this.pageLoading = false;
        // 查询详情
        this.queryEquipmentDetailById();
        // 需要查询设备的图片
        this.queryEquipmentImg();
      } else {
        if (this.gatewayPortFlagList !== 'electric') {
          if (this.gatewayPort && this.gatewayName) {
            // 网关配置新增设备默认带网关和网关端口
            this.saveEquipmentModel.gatewayName = this.gatewayName;
            this.gatewayPortList = [{
              portName: this.gatewayPort.split(',')[0] + this.gatewayPort.split(',')[1],
              portType: this.gatewayPort.split(',')[0],
              portNo: this.gatewayPort.split(',')[1]
            }];
            this.saveEquipmentModel.portNo = this.gatewayPort.split(',')[0] + this.gatewayPort.split(',')[1];
          }
        } else {
          if (this.gatewayPort && this.gatewayName) {
            this.saveEquipmentModel.powerControlName = this.gatewayName;
            this.powerPortList = [{
              portName: this.gatewayPort.split(',')[0] + this.gatewayPort.split(',')[1],
              portType: this.gatewayPort.split(',')[0],
              portNo: this.gatewayPort.split(',')[1]
            }];
            this.powerControlPortNo = this.gatewayPort.split(',')[0] + ',' + this.gatewayPort.split(',')[1];
          }
        }
      }
    }
    // 初始化区域
    this.initArea();
    // 初始化表单
    this.initForm();
    // 选择可用设施过滤条件
    const roleFacilityList = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
    let deviceIds = [];
    if (!_.isEmpty(roleFacilityList)) {
      deviceIds = roleFacilityList.filter(item => item.code !== DeviceTypeEnum.well && item.code !== DeviceTypeEnum.opticalBox && item.code !== DeviceTypeEnum.outdoorCabinet).map(item => item.code);
    }
    this.facilityFilter = [new FilterCondition('deviceType', OperatorEnum.in, deviceIds)];
    // 初始化网关的查询条件
    this.gatewayFilter = [new FilterCondition(
      'equipmentType', OperatorEnum.in, [EquipmentTypeEnum.gateway, EquipmentTypeEnum.centralController])];
    // 初始化电源控制器查询条件 本次只有网关类型，后续会增加智能断路器
    this.powerControlFilter = [new FilterCondition('equipmentCommunicationType', OperatorEnum.eq, 'electric')];
    // 如果设备类型是电子锁就将表单设置成disabled，智能修改名称
  }

  /**
   * 根据网关查询网关端口
   */
  private queryGatewayPort(type: QueryGatewayPortEnum, portFlag?) {
    return new Promise((resolve, reject) => {
      const body = {
        equipmentId: type === QueryGatewayPortEnum.gateway ? this.saveEquipmentModel.gatewayId : this.saveEquipmentModel.powerControlId,
        portFlag: portFlag ? 'electric' : 'communication',
        endSourceId: this.saveEquipmentModel.equipmentId
      };
      //  查询网关端口
      this.$equipmentAipService.queryGatewayPort(body).subscribe(
        (result: ResultModel<any>) => {
          if (result.code === ResultCodeEnum.success) {
            if (type === QueryGatewayPortEnum.gateway) {
              this.gatewayPortList = result.data || [];
            } else {
              this.powerPortList = result.data || [];
            }
            resolve();
          } else {
            this.$message.error(result.msg);
            reject();
          }
        });
    });
  }

  /**
   * 初始化区域
   */
  private initArea(): void {
    const queryBody = {bizCondition: {level: ''}};
    this.$equipmentAipService.queryAreaListForPageSelection(queryBody).subscribe((result: ResultModel<NzTreeNode[]>) => {
      this.areaNodes = result.data;
      // 递归设置区域的选择情况
      if (this.areaInfo) {
        FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, this.areaInfo.areaId);
      }
      this.initAreaConfig(result.data);
    });
  }

  /**
   *  初始化表单
   */
  private initForm(): void {
    this.formColumn = [
      {
        label: this.language.name,
        key: 'equipmentName',
        type: 'custom',
        template: this.equipmentNameTemp,
        placeholder: this.language.pleaseEnter,
        col: 24,
        require: true,
        rule: [
          {required: true},
          RuleUtil.getNameMaxLengthRule(),
          this.$ruleUtil.getNameRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value =>
            this.$equipmentAipService.queryEquipmentNameIsExist(
              {equipmentId: this.saveEquipmentModel.equipmentId, equipmentName: value}), res => res.data)
        ],
      },
      { // 类型
        label: this.language.type,
        key: 'equipmentType',
        type: 'select',
        col: 24,
        require: true,
        disabled: this.operateType === OperateTypeEnum.update,
        placeholder: this.language.picInfo.pleaseChoose,
        rule: [{required: true}],
        selectInfo: {
          data: this.equipmentTypeList,
          label: 'label',
          value: 'code'
        },
        modelChange: (controls, $event) => {
          this.handelTypeChange($event);
          this._selectedProduct = null;
          this.selectedProductId = null;
        },
      },
      { // 设备ID
        label: this.language.sequenceId,
        key: 'sequenceId',
        type: 'input',
        col: 24,
        placeholder: this.language.pleaseEnter,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value =>
              this.$equipmentAipService.querySequenceIdIsExist(
                {equipmentId: this.saveEquipmentModel.equipmentId, sequenceId: value}),
            res => res.data, this.language.sequenceIdExist)
        ],
      },
      { // 平台id
        label: this.language.platformId, key: 'platformId',
        type: 'input',
        col: 24,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value =>
              this.$equipmentAipService.queryEquipmentPlatformIdIsExist(
                {equipmentId: this.saveEquipmentModel.equipmentId, platformId: value}),
            res => res.data, this.language.platformIdIsExist)
        ]
      },
      { // 型号
        label: this.language.model, key: 'equipmentModel',
        type: 'custom',
        disabled: this.operateType === OperateTypeEnum.update,
        template: this.productTemp,
        col: 24,
        require: true,
        rule: [{required: true}]
      },
      { // 运营商
        label: this.language.supplierName, key: 'supplier',
        type: 'input',
        disabled: true,
        col: 24,
        require: true,
        placeholder: this.language.autoInputByModel,
        rule: [{required: true}, RuleUtil.getNameMaxLengthRule()]
      },
      { // 报废年限
        label: this.language.scrapTime, key: 'scrapTime',
        type: 'input',
        disabled: true,
        col: 24,
        placeholder: this.language.autoInputByModel,
        rule: [],
      },
      { // 所属设施
        label: this.language.affiliatedDevice, key: 'deviceId',
        type: 'custom',
        template: this.facilitiesSelector,
        col: 24,
        require: true,
        rule: [{required: true}]
      },
      { //  挂载位置
        label: this.language.mountPosition, key: 'mountPosition',
        type: 'custom',
        template: this.positionByDeviceTemplate,
        require: false,
        rule: []
      },
      { // 所属区域
        label: this.language.parentId, key: 'areaId',
        type: 'custom',
        col: 24,
        require: true,
        template: this.areaSelectorTemp,
        rule: [{required: true}],
      },
      { // 所属网关
        label: this.language.gatewayName, key: 'gatewayId',
        type: 'custom',
        template: this.gatewaySelectorTemp,
        col: 24,
        require: false,
        rule: []
      },
      { // 网关端口
        label: this.language.gatewayPort, key: 'portNo',
        type: 'custom',
        template: this.gatewayPortTemp,
        col: 24,
        hidden: true,
        placeholder: this.language.picInfo.pleaseChoose,
        require: true,
        rule: [{required: true}],
      },
      { // 传输方式
        label: this.language.transmissionMode, key: 'gatewayResolverType',
        type: 'select',
        col: 24,
        hidden: true,
        placeholder: this.language.picInfo.pleaseChoose,
        require: true,
        selectInfo: {
          data: [
            {label: this.language.unvarnishedTransmission, value: '0'},
            {label: this.language.protocolAnalysis, value: '1'}
          ],
          label: 'label',
          value: 'value'
        },
        rule: [{required: true}],
      },
      { // 回路
        label: this.language.loop, key: 'loopId',
        type: 'custom',
        template: this.loopTemplate,
        col: 24,
        require: false,
        placeholder: this.language.picInfo.pleaseChoose,
        rule: [],
      },
      { // 所属公司
        label: this.language.company, key: 'company',
        type: 'input',
        col: 24,
        placeholder: this.language.pleaseEnter,
        rule: [RuleUtil.getMaxLength20Rule()]
      },
      { // 安装时间
        label: this.language.installationDate,
        key: 'installationDate',
        type: 'custom',
        template: this.installationDateTemplate,
        col: 24,
        placeholder: this.language.pleaseEnter,
        rule: [],
        customRules: []
      },
      { // 电源控制设备
        label: this.language.powerControlEquipment, key: 'powerControlId',
        type: 'custom',
        template: this.powerControlTemp,
        col: 24,
        require: false,
        placeholder: this.language.picInfo.pleaseChoose,
        rule: [],
      },
      { //  电源控制端口
        label: this.language.powerControlEquipmentPort, key: 'powerControlPortNo',
        type: 'custom',
        template: this.powerPortTemp,
        col: 24,
        require: false,
        placeholder: this.language.picInfo.pleaseChoose,
        rule: [],
        selectInfo: {
          data: [], label: 'label', value: 'value'
        }
      },
      { // 三方编码
        label: this.language.thirdPartyCode, key: 'otherSystemNumber',
        type: 'input',
        col: 24,
        require: false,
        placeholder: this.language.pleaseEnter,
        rule: [RuleUtil.getNameMaxLengthRule()]
      },
      { // 资产编码
        label: this.language.deviceCode,
        key: 'equipmentCode',
        type: 'input',
        col: 24,
        require: false,
        // disabled: this.operateType === OperateTypeEnum.update,
        placeholder: this.language.pleaseEnter,
        rule: [RuleUtil.getMaxLength40Rule()],
        asyncRules: [
          // 校验设施编码是否重复
          this.$ruleUtil.getNameAsyncRule(value =>
              this.$equipmentAipService.queryEquipmentCodeIsExist(
                {equipmentCode: value, equipmentId: this.saveEquipmentModel.equipmentId}),
            res => res.data, this.language.equipmentCodeExist)
        ],
      },
      { // 备注
        label: this.language.remarks, key: 'remarks',
        type: 'textarea',
        col: 24,
        placeholder: this.language.pleaseEnter,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule()]
      },
      { // 设备实景图
        label: this.language.equipmentPicture,
        key: 'company',
        type: 'custom',
        col: 24,
        rule: [],
        template: this.uploadImgTemp
      },
    ];
  }

  /**
   *  设备类型下拉选修改事件
   */
  private handelTypeChange(typeCode: EquipmentTypeEnum): void {
    if (this.saveEquipmentModel.equipmentType && typeCode !== this.saveEquipmentModel.equipmentType) {
      this.resetData();
    }
    this.productDisable = false;
    this.saveEquipmentModel.equipmentType = typeCode;
    this.$equipmentAipService.getDeviceModelByType({type: typeCode, typeObject: TYPE_OBJECT_CONST}).subscribe(
      (result: ResultModel<EquipmentModelModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.modelChangeValue = result.data;
        }
      });
    this.formColumn.forEach(item => {
      if (item.key === 'portNo' && !this.isAddOperate) {
        item.hidden = true;
        this.formStatus.group.updateValueAndValidity();
      }
      // 如果设备类型是网关就隐藏网关的信息
      if (item.key === 'gatewayId') {
        item.hidden = typeCode === EquipmentTypeEnum.gateway;
      }
    });
    // 触发挂载位置
    this.findMountPositionById();
    this.checkCodingRule();
  }

  /**
   * 选择设备类型时需要重置部分字段
   */
  private resetData(): void {
    // 重置型号供应商和报废时间
    this.productName = '';
    this.formStatus.resetControlData('equipmentModel', null);
    this.formStatus.resetControlData('supplier', null, {emitEvent: true});
    this.formStatus.resetControlData('scrapTime', null, {emitEvent: true});
    this.formStatus.resetControlData('areaId', null, {emitEvent: true});
    if (!this.isAddOperate) {
      this.saveEquipmentModel.gatewayName = null;
      this.saveEquipmentModel.gatewayId = null;
      this.formStatus.resetControlData('gatewayId', null, {emitEvent: true});
      this.formStatus.resetControlData('portNo', null, {emitEvent: true});
    }
    // 重置所属设施和所属区域以及挂载点位
    if (!this.isWisdomPicture) {
      this.saveEquipmentModel.deviceName = null;
      this.saveEquipmentModel.deviceId = null;
      this.saveEquipmentModel.areaCode = null;
      this.saveEquipmentModel.areaName = null;
      this.saveEquipmentModel.areaId = null;
      this.formStatus.resetControlData('mountPosition', null);
      // 设置区域
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, null);
    }
  }

  /**
   *  初始化区域
   */
  private initAreaConfig(nodes: NzTreeNode[]): void {
    this.areaSelectorConfig = {
      width: '500px', title: this.language.selectArea, height: '300px',
      treeSetting: {
        check: {
          enable: true,
          chkStyle: 'radio',
          radioType: 'all'
        },
        data: {
          simpleData: {enable: true, idKey: 'areaId'}, key: {name: 'areaName'},
        },
        view: {showIcon: false, showLine: false}
      },
      treeNodes: nodes
    };
  }

  /**
   * 查询设备详情
   */
  private queryEquipmentDetailById(): void {
    this.$equipmentAipService.getEquipmentById(
      {equipmentId: this.saveEquipmentModel.equipmentId}).subscribe(
      (result: ResultModel<any>) => {
        this.pageLoading = false;
        if (result.code === ResultCodeEnum.success) {
          const temp = result.data.filter(item => item.equipmentId === this.saveEquipmentModel.equipmentId);
          if (!_.isEmpty(temp) && temp[0]) {
            const formData = temp[0];
            this.saveEquipmentModel = formData;
            this.saveEquipmentModel.mountPosition =
              formData.mountPosition ? Number(formData.mountPosition) : null;
            // 获取设施信息
            this.selectDeviceInfo = formData.deviceInfo;
            this.saveEquipmentModel.deviceName = this.selectDeviceInfo ? this.selectDeviceInfo.deviceName : '';
            this.areaInfo = formData.areaInfo;
            this.saveEquipmentModel.areaName = this.areaInfo ? this.areaInfo.areaName : '';
            // 设置时间
            const instDate = formData.installationDate = formData.installationDate ? String(formData.installationDate) : null;
            // 查询该设施下面的回路下拉选
            this.queryLoopListByDeviceId();
            this.productName = formData.equipmentModel;
            // 判断是否有网关端口
            if (formData.portNo && formData.gatewayId) {
              // 查询所属网关端口
              this.queryGatewayPort(QueryGatewayPortEnum.gateway).then(value => {
                if (formData.portNo) {
                  this.gatewayPortList = this.gatewayPortList.map(item => {
                    return {
                      portName: item.portName,
                      portNo: item.portNo,
                      portType: item.portType
                    };
                  });
                  this.gatewayPort = formData.portType + ',' + formData.portNo;
                  formData.portNo = formData.portType + ',' + formData.portNo;
                }
              });
            }
            // formData.supplier = formData.supplier;
            this.supplierId = formData.supplierId;
            // 设置表单数据回显
            this.formStatus.resetData(formData);
            // 时间格式特殊需要单独处理
            this.formStatus.resetControlData('installationDate', instDate ? new Date(Number(instDate)) : null);
            if (this.saveEquipmentModel.equipmentType === EquipmentTypeEnum.intelligentEntranceGuardLock) {
              this.formStatus.group.disable();
              this.formItemDisable = false;
              this.isLock = true;
              this.formStatus.group.controls['equipmentName'].enable();
            }
            this.setMountPosition(this.saveEquipmentModel.deviceType);
            // 查询挂载位置
            this.findMountPositionById();
            // 更新表单的唯一性校验
            this.formColumn.forEach(item => {
              if (item.key === 'portNo') {
                item.hidden = !(formData.portNo);
                this.formStatus.group.updateValueAndValidity();
              }
            });
            // 看是否存在电源控制器设备端口
            if (formData.powerControlId && formData.powerControlPortNo) {
              this.queryGatewayPort(QueryGatewayPortEnum.powerControl, true).then(value => {
                if (formData.powerControlPortNo) {
                  formData.powerControlPortNo = formData.powerControlPortType + ',' + formData.powerControlPortNo;
                  this.powerControlPortNo = formData.powerControlPortNo;
                }
              });
            }
            // 回显传输方式
            if (formData.gatewayResolverType || formData.gatewayId) {
              this.formColumn.forEach(item => {
                if (item.key === 'gatewayResolverType') {
                  item.hidden = false;
                  item.require = true;
                  item.rule = [];
                }
              });
              this.formStatus.resetControlData('gatewayResolverType', formData.gatewayResolverType);
            }
            this.checkCodingRule();
          }
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * 查询设备图片
   */
  private queryEquipmentImg(): void {
    const body = new QueryRealPicModel(this.saveEquipmentModel.equipmentId, ObjectTypeEnum.equipment, PicResourceEnum.realPic);
    this.$facilityCommonService.getPicDetail([body]).subscribe((res: ResultModel<PictureListModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        // 设施图片路径进行回显
        this.equipmentPic = !_.isEmpty(res.data) ? _.first(res.data).picUrlBase : '';
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * 根据设备设施id查询设施下面的挂载位置
   */
  private findMountPositionById(): void {
    // 只选择一个条件就不查询挂载位置
    if ((!this.saveEquipmentModel.equipmentType && this.saveEquipmentModel.deviceId)
      || (this.saveEquipmentModel.equipmentType && !this.saveEquipmentModel.deviceId)) {
      return;
    }
    const deviceId = this.selectDeviceInfo ? this.selectDeviceInfo.deviceId : '';
    const queryBody = {
      equipmentId: this.saveEquipmentModel.equipmentId,
      deviceId: deviceId,
      mountPosition: this.saveEquipmentModel.mountPosition,
      equipmentType: this.saveEquipmentModel.equipmentType
    };
    // 查询挂载位置
    this.$equipmentAipService.findMountPositionById(queryBody).subscribe(
      (result: ResultModel<string[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.positionSelectList = result.data || [];
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * 打开挂载位置下拉选
   */
  public openPosition(): void {
    if (!this.saveEquipmentModel.deviceId || !this.saveEquipmentModel.equipmentType) {
      this.$message.info(this.language.selectEquipmentAndDevice);
      return;
    }
  }

  /**
   * 上传设备图片
   */
  public uploadEquipmentPic(equipmentId: string) {
    const formData = new FormData();
    formData.append('objectId', equipmentId);
    formData.append('objectType', ObjectTypeEnum.equipment);
    formData.append('resource', PicResourceEnum.realPic);
    // 如果图片大于1M压缩图片
    if (!_.isEmpty(this.fileList) && this.fileList[0].size / (BINARY_SYSTEM_CONST * BINARY_SYSTEM_CONST) > IMG_SIZE_CONST) {
      CompressUtil.compressImg(this.fileList[0]).then((res: File) => {
        formData.append('pic', res, res.name);
        //  上传压缩后的文件
        this.handelUpload(formData);
      });
    } else {
      formData.append('pic', _.isEmpty(this.fileList) ? new Blob() : this.fileList[0]);
      this.handelUpload(formData);
    }
  }

  /**
   * 执行上传
   */
  private handelUpload(formData: FormData) {
    this.$equipmentAipService.uploadImg(formData).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.pageLoading = false;
        this.fileList = [];
        // 修改和新增提示语不同处理,回路不需要提示语和后退一步
        if (!this.isAddOperate) {
          this.$message.success(this.operateType === OperateTypeEnum.add ? this.language.addEquipmentSuccess : this.language.updateEquipmentSuccess);
          this.onClickCancel();
        }
      } else {
        this.pageLoading = false;
        this.$message.error(result.msg);
      }
    }, () => {
      this.pageLoading = false;
    });
  }

  /**
   * 根据设施id查询回路信息
   */
  private queryLoopListByDeviceId(): void {
    this.$equipmentAipService.loopListByDeviceIds([this.saveEquipmentModel.deviceId]).subscribe(
      (result: ResultModel<LoopListModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.loopList = result.data || [];
        } else {
          this.$message.error(result.msg);
        }
      });
  }

  /**
   * 判断表单资产编码字段是否禁用
   */
  private checkCodingRule(): void {
    const scopeId = this.saveEquipmentModel.areaId;
    const typeCode = this.saveEquipmentModel.equipmentType;
    const equipmentCodeColumn = this.formColumn.find(item => item.key === 'equipmentCode');
    const body = {
      typeCode: typeCode,
      scopeId: scopeId
    };
    if (scopeId && typeCode) {
      this.$facilityCommonService.checkCodingRule(body).subscribe((result: ResultModel<boolean>) => {
        if (result.code === ResultCodeEnum.success) {
          if (result.data) {
            this.formStatus.resetControlData('equipmentCode', null);
            this.formStatus.group.controls['equipmentCode'].disable();
            equipmentCodeColumn.placeholder = this.language.automaticallyGeneratedByTheSystem;
          } else {
            this.formStatus.group.controls['equipmentCode'].enable();
            equipmentCodeColumn.placeholder = this.language.pleaseEnter;
          }
        } else {
          this.$message.error(result.msg);
        }
      }, () => {});
    } else {
      this.formStatus.group.controls['equipmentCode'].enable();
      equipmentCodeColumn.placeholder = this.language.pleaseEnter;
    }
  }
}
