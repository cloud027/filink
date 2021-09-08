import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {NzI18nService, NzModalService, NzTreeNode} from 'ng-zorro-antd';
import {Observable} from 'rxjs';
import * as _ from 'lodash';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {FacilityForCommonService} from '../../../../core-module/api-service';
import {FacilityApiService} from '../../share/service/facility/facility-api.service';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FacilityService} from '../../../../core-module/api-service';
import {AreaModel} from '../../../../core-module/model/facility/area.model';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {FormLanguageInterface} from '../../../../../assets/i18n/form/form.language.interface';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {UploadImageComponent} from '../../../../shared-module/component/business-component/upload-img/upload-img.component';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {FacilityDetailFormModel} from '../../share/model/facility-detail-form.model';
import {OperateTypeEnum} from '../../../../shared-module/enum/page-operate-type.enum';
import {EquipmentModelModel} from '../../share/model/equipment-model.model';
import {PointModel} from '../../share/model/point.model';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {CityInfoModel} from '../../share/model/city-info';
import {PicResourceEnum} from '../../../../core-module/enum/picture/pic-resource.enum';
import {BINARY_SYSTEM_CONST, IMG_SIZE_CONST} from '../../share/const/facility-common.const';
import {CompressUtil} from '../../../../shared-module/util/compress-util';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {ObjectTypeEnum} from '../../../../core-module/enum/facility/object-type.enum';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {FacilityDetailInfoModel} from '../../../../core-module/model/facility/facility-detail-info.model';
import {QueryRealPicModel} from '../../../../core-module/model/picture/query-real-pic.model';
import {PictureListModel} from '../../../../core-module/model/picture/picture-list.model';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {PageModel} from '../../../../shared-module/model/page.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {ProductForCommonService} from '../../../../core-module/api-service/product/product-for-common.service';
import {ProductTypeEnum} from '../../../../core-module/enum/product/product.enum';
import {ProductLanguageInterface} from '../../../../../assets/i18n/product/product.language.interface';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';


/**
 * 新增（修改）设施组件
 */
@Component({
  selector: 'app-facility-detail',
  templateUrl: './facility-detail.component.html',
  styleUrls: ['./facility-detail.component.scss']
})
export class FacilityDetailComponent implements OnInit, OnDestroy {
  // 自定义模板
  @ViewChild('customTemplate') private customTemplate: TemplateRef<HTMLDocument>;
  // 位置选择模板
  @ViewChild('positionTemplate') private positionTemplate: TemplateRef<HTMLDocument>;
  // 区域选择器
  @ViewChild('areaSelector') private areaSelector: TemplateRef<HTMLDocument>;
  // 项目选择器
  @ViewChild('projectSelector') private projectSelector: TemplateRef<HTMLDocument>;
  // 自动生成名称模板
  @ViewChild('autoNameTemplate') private autoNameTemplate: TemplateRef<HTMLDocument>;
  // 型号关联类型变动模板
  @ViewChild('modelByTypeTemplate') private modelByTypeTemplate: TemplateRef<HTMLDocument>;
  // 供应商模板
  @ViewChild('supplierTemplate') private supplierTemplate: TemplateRef<HTMLDocument>;
  // 安装日期模板
  @ViewChild('installationDate') public installationDateTemp: TemplateRef<HTMLDocument>;
  // 报废年限模板
  @ViewChild('scrapTimeTemplate') public scrapTimeTemplate: TemplateRef<HTMLDocument>;
  // 上传图片模板
  @ViewChild('uploadImgTemp') public uploadImgTemp: TemplateRef<HTMLDocument>;
  // 上传图片组件
  @ViewChild(UploadImageComponent) public uploadImg: UploadImageComponent;
  // 设备类型选择
  @ViewChild('equipmentSelect') private equipmentSelect: TemplateRef<HTMLDocument>;
  @ViewChild('radioTemp') private radioTemp: TemplateRef<HTMLDocument>;
  //  产品类型模版
  @ViewChild('productTypeTemplate') public productTypeTemplate: TemplateRef<HTMLDocument>;
  @ViewChild('productTemp') public productTemp: TemplateRef<HTMLDocument>;
  @ViewChild('tableCom') public tableCom: TableComponent;
  // 表单配置
  public formColumn: FormItem[] = [];
  // 表单状态
  public formStatus: FormOperate;
  // 设施语言包
  public language: FacilityLanguageInterface;
  // 区域选择器显示隐藏
  public areaSelectVisible = false;
  // 页面类型 新增修改
  public pageType = OperateTypeEnum.add;
  public _dataSet = [];
  // 选择设备id
  public selectedProductId: string = null;
  // 分页
  public pageBean: PageModel = new PageModel();
  // 查询参数对象集
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 列表配置
  public tableConfig: TableConfigModel = new TableConfigModel();
  // 页面标题
  public pageTitle: string;
  // 城市信息
  public cityInfo: CityInfoModel = new CityInfoModel();
  // 已选择的点
  public selectPoint: PointModel = new PointModel();
  // 设施地理位置
  public facilityAddress = '';
  // 设施id
  public deviceId: string;
  // 地理位置选择器显示隐藏
  public isVisible = false;
  // 区域名称
  public areaName = '';
  // 区域code
  public areaCode: string;
  // 责任单位选择器
  public selectorData = {parentId: '', accountabilityUnit: ''};
  // 区域选择器配置信息
  public areaSelectorConfig: TreeSelectorConfigModel;
  // 区域信息
  public areaInfo: AreaModel = new AreaModel();
  // 区域选择节点
  private areaNodes: NzTreeNode[] = [];
  // 是否加载
  public isLoading = false;
  // 页面是否加载
  public pageLoading = false;
  // 区域禁用
  public areaDisabled: boolean;
  // 地理位置选择禁用
  public positionDisabled: boolean;
  // 表单语言包
  public formLanguage: FormLanguageInterface;
  // 根据类型获取的型号、供应商、报废年限信息
  public getDetailByModel: EquipmentModelModel[];
  // 表单校验
  public isDisabled: boolean;
  // 上传选择的文件 文件类型无法确定
  public fileList: File[];
  // 图片回显
  public devicePicUrl: string;
  // 页面操作类型，新增或编辑
  public operateTypeEnum = OperateTypeEnum;
  public productDisable = true;
  public productLanguage: ProductLanguageInterface;
  // 公共国际化
  public commonLanguage: CommonLanguageInterface;
  public productName = '';
  public productNameIsShow: boolean = false;
  // 复制已选择告警
  public _selectedProduct;
  // 设施类型枚举
  public deviceTypeEnum = DeviceTypeEnum;
  // 产品类型枚举
  public productTypeEnum = ProductTypeEnum;
  // 设备类型枚举
  public equipmentTypeEnum = EquipmentTypeEnum;
  // 设施国际化
  public languageEnum = LanguageEnum;
  public supplierId;
  // 对于输入框输入完之后去除前后空格
  public inputDebounce = _.debounce((event) => {
    event.target.value = event.target.value.trim();
  }, 500, {leading: false, trailing: true});

  // 项目选择器
  public projectSelectVisible: boolean = false;
  // 选择的项目
  public selectSelectProject: any = {};
  constructor(private $nzI18n: NzI18nService,
              private $active: ActivatedRoute,
              private $message: FiLinkModalService,
              private $facilityService: FacilityService,
              private $facilityApiService: FacilityApiService,
              private $facilityCommonService: FacilityForCommonService,
              private $httpClient: HttpClient,
              private $modalService: FiLinkModalService,
              private $modelService: NzModalService,
              private $ruleUtil: RuleUtil,
              private $productCommonService: ProductForCommonService,
              private $router: Router) {
  }

  public ngOnInit(): void {
    this.productLanguage = this.$nzI18n.getLocaleData(LanguageEnum.product);
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.formLanguage = this.$nzI18n.getLocaleData(LanguageEnum.form);
    // 初始化表单
    this.initColumn();
    // 新增编辑页面初始化
    this.initPage();
  }

  public ngOnDestroy(): void {
    // 区域选择器
    this.areaSelector = null;
    // 上传图片组件
    this.uploadImg = null;
  }

  /**
   * 获取表单实例
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isDisabled = this.formStatus.getValid();
    });

    // 监听型号的值变化,重置供应商,报废年限
    // this.formStatus.group.controls['deviceModel'].valueChanges.subscribe(value => {
    //   if (!_.isEmpty(this.getDetailByModel)) {
    //     this.getDetailByModel.forEach(item => {
    //       if (item.model === value) {
    //         this.formStatus.resetControlData('supplier', item.supplierName);
    //         this.formStatus.resetControlData('scrapTime', item.scrapTime);
    //       }
    //     });
    //   }
    // });

    // 订阅设施类型变化,重置供应商,报废年限,型号下拉框列表
    this.formStatus.group.controls['deviceType'].valueChanges.subscribe(value => {
      // 类型变换清空型号显示
      this.formStatus.resetControlData('supplier', '');
      this.formStatus.resetControlData('scrapTime', '');
      this.formStatus.resetControlData('deviceModel', null);
      this.productDisable = false;
      this.checkCodingRule();
    });

    // const projectIdCol: FormItem = this.formStatus.getColumn('projectId').item;
    //
    // // 获取所属项目
    // this.$facilityApiService.getProjectList().subscribe((result: ResultModel<Array<Project>>) => {
    //   if (result.code === ResultCodeEnum.success) {
    //     projectIdCol.selectInfo.data = result.data || [];
    //   } else {
    //     this.$modalService.error(result.msg);
    //   }
    // });

    // 初始化表单后设置表单是否可编辑状态
    if (this.pageType !== OperateTypeEnum.add) {
      ['deviceType', 'deviceModel', 'supplier', 'scrapTime'].forEach(item => {
        this.formStatus.group.controls[item].disable();
      });
    } else {
      ['supplier', 'scrapTime'].forEach(item => {
        this.formStatus.group.controls[item].disable();
      });
    }
  }

  /**
   * 新增设施
   */
  public addFacility(): void {
    this.isLoading = true;
    const data: FacilityDetailFormModel = this.formStatus.group.getRawValue();
    data.areaCode = this.areaCode;
    data.provinceName = this.cityInfo.province;
    data.cityName = this.cityInfo.city;
    data.districtName = this.cityInfo.district;
    data.positionBase = `${this.cityInfo.detailInfo.lng},${this.cityInfo.detailInfo.lat}`;
    data.supplierId = this.supplierId;
    data.projectId = this.selectSelectProject.projectId;
    data.projectName = this.selectSelectProject.projectName;
    data.positionGps = '12,33'; // 暂时保留等后台删除此字段后,删除该代码
    // 格式化安装时间为时间戳
    if (data.installationDate) {
      data.installationDate = new Date(data.installationDate).getTime();
    }
    // 新增編輯订阅代码共用
    let msg = '';
    let resultModelObservable: Observable<ResultModel<string>>;
    if (this.pageType === OperateTypeEnum.add) {
      // 格式化安装时间
      resultModelObservable = this.$facilityApiService.addDevice(data);
      msg = this.language.addFacilitySuccess;
    } else if (this.pageType === OperateTypeEnum.update) {
      data.deviceId = this.deviceId;
      msg = this.language.updateFacilitySuccess;
      resultModelObservable = this.$facilityApiService.updateDeviceById(data);
    }
    resultModelObservable.subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        // 上传图片
        this.uploadPicture(result.data || this.deviceId, msg);
      } else {
        this.isLoading = false;
        this.$modalService.error(result.msg);
      }
    }, () => {
      this.isLoading = false;
    });
  }

  public goBack(): void {
    this.$router.navigateByUrl(`business/facility/facility-list`).then();
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
   * 查询产品列表
   */
  private queryProductList(): void {
    this.tableConfig.isLoading = true;
    const deviceType = this.formStatus.getData('deviceType');
    const hasCode = this.queryCondition.filterConditions.filter(item => item.filterField === 'typeCode');
    if (hasCode.length === 0) {
      this.queryCondition.filterConditions.push(new FilterCondition('typeCode', OperatorEnum.in, [deviceType]));
    } else {
      this.queryCondition.filterConditions.forEach(item => {
        if (item.filterField === 'typeCode') {
          // item.filterValue = [this.saveEquipmentModel.equipmentType];
          item.filterValue = [deviceType];
        }
      });
    }
    // 只有设施类型为智慧杆时，才添加此条件
    if (deviceType === this.deviceTypeEnum.wisdom) {
      this.queryCondition.filterConditions.push(
        {
          filterField: 'fileExist',
          operator: 'eq',
          filterValue: '1'
        }
      );
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
            // 判断网关的上传和编辑按钮是否显示
            // 判断是否显示配置模版 按钮
          });
        }
      } else {
        this.$modalService.error(res.msg);
        this.tableConfig.isLoading = false;
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * 设备选择modal
   */
  public showProductSelectorModal(): void {
    if (this.productDisable) {
      this.$message.info(this.language.pleaseCompleteDeviceTypeInfo);
      return;
    }
    this.initTableConfig();
    this.queryCondition.filterConditions = [];
    const modal = this.$modelService.create({
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
      this.formStatus.resetControlData('deviceModel', this._selectedProduct.productModel);
      this.formStatus.resetControlData('scrapTime', this._selectedProduct.scrapTime);
      // }
      // this.getExtraRequest.emit(this.saveEquipmentModel);
      modal.destroy();
    } else {
      this.$modalService.warning(this.language.pleaseCompleteProductInfo);
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
   * 打开区域选择器
   */
  public showAreaSelectorModal(): void {
    if (this.areaDisabled) {
      return;
    }
    this.areaSelectorConfig.treeNodes = this.areaNodes;
    this.areaSelectVisible = true;
  }

  /**
   * 区域选中结果
   * param event
   */
  public areaSelectChange(event: AreaModel[]): void {
    if (event[0]) {
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, event[0].areaId);
      this.areaName = event[0].areaName;
      this.selectorData.parentId = event[0].areaId;
      this.areaCode = event[0].areaCode;
      // 重置区域id
      this.formStatus.resetControlData('areaId', event[0].areaId);
    } else {
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, null);
      this.areaName = '';
      this.selectorData.parentId = null;
      this.formStatus.resetControlData('areaId', null);
    }
    this.checkCodingRule();
  }

  /**
   * 地图选择器结果
   * param result 需要组件提供模型
   */
  public selectDataChange(result: any): void {
    if (result.addressComponents.province && result.addressComponents.city && result.addressComponents.district) {
      this.cityInfo = result.addressComponents;
      this.cityInfo.detailInfo = result.point;
      this.selectPoint = result.point;
      const str = `${result.addressComponents.province},${result.addressComponents.city},${result.addressComponents.district}`;
      this.facilityAddress = result.address;
      this.formStatus.resetControlData('position', str);
      this.formStatus.resetControlData('address', result.address);

    }
  }


  /**
   * 自动生成名称
   */
  public getAutoName(): void {
    const data: FacilityDetailFormModel = this.formStatus.group.getRawValue();
    const cityName = this.cityInfo.city;
    const deviceName = data.deviceType && CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n, data.deviceType);
    if (deviceName && cityName) {
      const param = {deviceName: `${cityName}${deviceName}`};
      this.$facilityApiService.getDeviceAutoName(param).subscribe((result: ResultModel<string>) => {
        this.formStatus.resetControlData('deviceName', result.data);
      });
    } else {
      this.$modalService.warning(this.language.pleaseCompleteDeviceAreaInfo);
    }

  }

  /**
   * 获取上传图片list
   */
  public getUploadList(fileList: File[]): void {
    this.fileList = fileList;
  }

  /**
   * 上传图片
   */
  public uploadPicture(deviceId: string, msg: string): void {
    let file;
    if (!_.isEmpty(this.fileList)) {
      file = _.first(this.fileList);
    }
    const formData = new FormData();
    formData.append('objectId', deviceId);
    formData.append('objectType', ObjectTypeEnum.facility);
    formData.append('resource', PicResourceEnum.realPic);
    // 如果图片大于1M压缩图片
    if (!_.isEmpty(this.fileList) && file.size / (BINARY_SYSTEM_CONST) > IMG_SIZE_CONST) {
      CompressUtil.compressImg(file).then((res: File) => {
        formData.append('pic', res, res.name);
        this.handleUpload(formData, msg);
      });
    } else {
      if (!_.isEmpty(this.fileList) && file.size === 0) {
        this.isLoading = false;
        this.$modalService.success(msg);
        this.goBack();
      } else if (file && file.uid) {
        formData.append('pic', file);
        this.handleUpload(formData, msg);
      } else {
        formData.append('pic', new Blob());
        this.handleUpload(formData, msg);
      }
    }
  }

  /**
   * 打开项目选择器
   */
  public showProjectSelectorModal(): void {
  this.projectSelectVisible = true;
  }
  /**
   * 项目选择器结果
   * param data
   */
  public projectSelectChange(data): void {
    if (data && data.length) {
      this.selectSelectProject = data[0];
    } else {
      this.selectSelectProject = {};
    }
  }
  /**
   * 初始化新增编辑页面
   */
  private initPage(): void {
    this.pageLoading = true;
    this.$active.queryParams.subscribe(params => {
      this.pageType = this.$active.snapshot.params.type;
      this.pageTitle = this.getPageTitle(this.pageType);
      if (this.pageType !== OperateTypeEnum.add) {
        this.deviceId = params.id;
        // 获取权限区域
        this.queryAreaListForPageSelection(true);
      } else {
        this.queryAreaListForPageSelection();
      }
    });
  }


  /**
   * 根据id查询设备详情
   */
  private queryDeviceById(): void {
    this.$facilityCommonService.queryDeviceById({deviceId: this.deviceId}).subscribe((result: ResultModel<Array<FacilityDetailInfoModel>>) => {
      this.pageLoading = false;
      if (result.code === ResultCodeEnum.success) {
        const facilityInfo: FacilityDetailInfoModel = result.data.pop();
        // 时间格式特殊需要单独处理
        facilityInfo.installationDate = facilityInfo.installationDate ?
          new Date(Number(facilityInfo.installationDate)) : null;
        // 表单字段赋值
        this.supplierId = facilityInfo.supplierId;
        this.productName = facilityInfo.deviceModel;
        this.formStatus.resetData(facilityInfo);
        this.facilityAddress = facilityInfo.address;
        this.formStatus.resetControlData('areaId', facilityInfo.areaInfo.areaId);
        // 回显城市信息
        if (facilityInfo.provinceName && facilityInfo.cityName && facilityInfo.districtName) {
          this.cityInfo.province = facilityInfo.provinceName;
          this.cityInfo.city = facilityInfo.cityName;
          this.cityInfo.district = facilityInfo.districtName;
          const str = `${facilityInfo.provinceName},${facilityInfo.cityName},${facilityInfo.districtName}`;
          this.formStatus.resetControlData('position', str);
        }
        this.selectSelectProject.projectId = facilityInfo.projectId;
        this.selectSelectProject.projectName = facilityInfo.projectName;
        // 地址选择器
        const position = facilityInfo.positionBase.split(',');
        this.selectPoint.lng = parseFloat(position[0]);
        this.selectPoint.lat = parseFloat(position[1]);
        this.cityInfo.detailInfo = this.selectPoint;
        // 递归设置区域的选择情况
        if (facilityInfo.areaInfo.areaName && facilityInfo.areaInfo.areaId) {
          this.areaName = facilityInfo.areaInfo.areaName;
          FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, facilityInfo.areaInfo.areaId);
        }
        // 查询图片
        this.queryDeviceImg();
        this.checkCodingRule();
      } else {
        this.$modalService.error(result.msg);
        this.goBack();
      }
    }, () => {
      this.pageLoading = false;
    });
  }

  /**
   * 查询设备图片
   */
  private queryDeviceImg(): void {
    const body: QueryRealPicModel = new QueryRealPicModel(this.deviceId, ObjectTypeEnum.facility, PicResourceEnum.realPic);
    this.$facilityCommonService.getPicDetail([body]).subscribe(
      (res: ResultModel<PictureListModel[]>) => {
        if (res.code === ResultCodeEnum.success) {
          this.devicePicUrl = !_.isEmpty(res.data) ? _.first(res.data).picUrlBase : '';
        } else {
          this.$modalService.error(res.msg);
        }
      });
  }

  /**
   * 初始化表单配置
   */
  private initColumn(): void {
    this.formColumn = [
      { // 自动生成名称
        label: this.language.deviceName,
        key: 'deviceName',
        type: 'custom',
        require: true,
        template: this.autoNameTemplate,
        rule: [
          {required: true},
          RuleUtil.getNameMaxLengthRule(),
          this.$ruleUtil.getNameRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value =>
              this.$facilityApiService.queryDeviceNameIsExist({deviceId: this.deviceId, deviceName: value}),
            res => {
              return !res.data;
            })
        ],
      },
      { // 类型
        label: this.language.deviceType, key: 'deviceType', type: 'select',
        selectInfo: {
          data: FacilityForCommonUtil.getRoleFacility(this.$nzI18n),
          label: 'label',
          value: 'code'
        },
        modelChange: () => {
          if (this.productNameIsShow) {
            this.formStatus.resetControlData('deviceModel', null);
            this.productName = null;
            this._selectedProduct = null;
            this.selectedProductId = null;
          }
          this.productNameIsShow = true;
        },
        require: true,
        rule: [{required: true}], asyncRules: [],
      },
      { // 型号
        label: this.language.deviceModel,
        key: 'deviceModel',
        type: 'custom',
        template: this.productTemp,
        require: true,
        rule: [{required: true}],
      },
      { // 供应商
        label: this.language.supplierName,
        key: 'supplier',
        type: 'input',
        require: true,
        placeholder: this.language.autoInputByModel,
        rule: [{required: true}, RuleUtil.getNameMaxLengthRule()],
        asyncRules: [],
      },
      { // 报废年限
        label: this.language.scrapTime,
        key: 'scrapTime',
        type: 'input',
        placeholder: this.language.autoInputByModel,
        rule: [RuleUtil.getNameMaxLengthRule(20), this.$ruleUtil.getLoopCode()],
        asyncRules: [],
      },
      {  // 所属区域
        label: this.language.areaId, key: 'areaId', type: 'custom',
        require: true,
        template: this.areaSelector,
        rule: [{required: true}], asyncRules: []
      },
      { // 所属项目
        label: this.language.projectName, key: 'projectId', type: 'custom',
        template: this.projectSelector,
        rule: [], asyncRules: []
      },
      { // 地理位置
        label: this.language.position,
        key: 'position',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        template: this.positionTemplate
      },
      { // 省市区
        label: this.language.region,
        key: 'managementFacilities', type: 'custom', rule: [], template: this.customTemplate
      },
      { // 详细地址
        label: this.language.address,
        key: 'address',
        type: 'input',
        disabled: true,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      { // 权属公司
        label: this.language.company,
        key: 'company',
        type: 'input',
        rule: [RuleUtil.getNameMaxLengthRule(20), RuleUtil.getNameMinLengthRule(), RuleUtil.getNamePatternRule()],
        asyncRules: []
      },
      { // 安装日期
        label: this.language.installationDate,
        key: 'installationDate',
        type: 'custom',
        initialValue: '',
        template: this.installationDateTemp,
        rule: [],
        asyncRules: []
      },
      { // 第三方编码
        label: this.language.otherSystemNumber,
        key: 'otherSystemNumber',
        type: 'input',
        rule: [],
        asyncRules: []
      },
      { // 资产编码
        label: this.language.deviceCode,
        key: 'deviceCode',
        type: 'input',
        require: false,
        rule: [ RuleUtil.getNameMaxLengthRule(40)],
        asyncRules: [
          // 校验设施编码是否重复
          this.$ruleUtil.getNameAsyncRule(value =>
              this.$facilityApiService.queryFacilityCodeIsExist(
                {deviceCode: value, deviceId: this.deviceId}),
            res => res.data, this.language.equipmentCodeExist)
        ],
      },
      { // 备注
        label: this.language.remarks, key: 'remarks',
        type: 'textarea',
        col: 24,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      { // 上传图片
        label: this.language.facilityPicture,
        key: 'facilityPicture',
        initialValue: 'pic',
        type: 'custom',
        width: 300,
        col: 24,
        rule: [],
        template: this.uploadImgTemp
      },
    ];
  }

  /**
   * 获取页面标题类型
   * param type
   * returns {string}
   */
  private getPageTitle(type: OperateTypeEnum): string {
    let title;
    switch (type) {
      case OperateTypeEnum.add:
        title = `${this.language.addArea}${this.language.device}`;
        break;
      case OperateTypeEnum.update:
        title = `${this.language.modify}${this.language.device}`;
        break;
      default:
        title = '';
        break;
    }
    return title;
  }

  /**
   * 初始化区域选择器配置
   * param nodes
   */
  private initAreaSelectorConfig(nodes: NzTreeNode[]): void {
    this.areaSelectorConfig = FacilityForCommonUtil
      .getAreaSelectorConfig(`${this.language.select}${this.language.area}`, nodes);
  }

  /**
   * 执行上传
   */
  private handleUpload(formData: FormData, msg: string): void {
    this.$facilityApiService.uploadPicture(formData).subscribe((result: ResultModel<string>) => {
        this.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.fileList = [];
          this.$modalService.success(msg);
          this.goBack();
        } else {
          this.isLoading = false;
          this.$modalService.error(result.msg);
        }
      }
      , () => {
        this.isLoading = false;
        this.$modalService.error(this.language.uploadImgFail);
      });
  }

  /**
   * 获取权限区域
   * @param isQueryDeviceById boolean
   */
  private queryAreaListForPageSelection(isQueryDeviceById?: boolean): void {
    this.$facilityCommonService.queryAreaListForPageSelection().subscribe((result: ResultModel<NzTreeNode[]>) => {
      this.pageLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.areaNodes = result.data;
        // 初始化区域配置
        this.initAreaSelectorConfig(this.areaNodes);
        // 存在queryDeviceById方法则执行
        if (isQueryDeviceById) {
          this.queryDeviceById();
        } else {
          // 递归设置区域的选择情况
          FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, null, null);
        }
      }
    }, () => this.pageLoading = false);
  }

  /**
   * 判断表单资产编码字段是否禁用
   */
   private checkCodingRule(): void {
    const scopeId = this.formStatus.getData('areaId');
    const typeCode = this.formStatus.getData('deviceType');
    const deviceCodeColumn = this.formColumn.find(item => item.key === 'deviceCode');
    const body = {
      typeCode: typeCode,
      scopeId: scopeId
    };
    if (scopeId && typeCode) {
      this.$facilityCommonService.checkCodingRule(body).subscribe((result: ResultModel<boolean>) => {
        if (result.code === ResultCodeEnum.success) {
          if (result.data) {
            this.formStatus.resetControlData('deviceCode', null);
            this.formStatus.group.controls['deviceCode'].disable();
            deviceCodeColumn.placeholder = this.language.automaticallyGeneratedByTheSystem;
          } else {
            this.formStatus.group.controls['deviceCode'].enable();
            deviceCodeColumn.placeholder = this.language.pleaseEnter;
          }
        } else {
          this.$message.error(result.msg);
        }
      }, () => {});
    } else {
      this.formStatus.group.controls['deviceCode'].enable();
      deviceCodeColumn.placeholder = this.language.pleaseEnter;
    }
    }
}
