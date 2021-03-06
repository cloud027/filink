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
 * ??????????????????????????????
 */
@Component({
  selector: 'app-facility-detail',
  templateUrl: './facility-detail.component.html',
  styleUrls: ['./facility-detail.component.scss']
})
export class FacilityDetailComponent implements OnInit, OnDestroy {
  // ???????????????
  @ViewChild('customTemplate') private customTemplate: TemplateRef<HTMLDocument>;
  // ??????????????????
  @ViewChild('positionTemplate') private positionTemplate: TemplateRef<HTMLDocument>;
  // ???????????????
  @ViewChild('areaSelector') private areaSelector: TemplateRef<HTMLDocument>;
  // ???????????????
  @ViewChild('projectSelector') private projectSelector: TemplateRef<HTMLDocument>;
  // ????????????????????????
  @ViewChild('autoNameTemplate') private autoNameTemplate: TemplateRef<HTMLDocument>;
  // ??????????????????????????????
  @ViewChild('modelByTypeTemplate') private modelByTypeTemplate: TemplateRef<HTMLDocument>;
  // ???????????????
  @ViewChild('supplierTemplate') private supplierTemplate: TemplateRef<HTMLDocument>;
  // ??????????????????
  @ViewChild('installationDate') public installationDateTemp: TemplateRef<HTMLDocument>;
  // ??????????????????
  @ViewChild('scrapTimeTemplate') public scrapTimeTemplate: TemplateRef<HTMLDocument>;
  // ??????????????????
  @ViewChild('uploadImgTemp') public uploadImgTemp: TemplateRef<HTMLDocument>;
  // ??????????????????
  @ViewChild(UploadImageComponent) public uploadImg: UploadImageComponent;
  // ??????????????????
  @ViewChild('equipmentSelect') private equipmentSelect: TemplateRef<HTMLDocument>;
  @ViewChild('radioTemp') private radioTemp: TemplateRef<HTMLDocument>;
  //  ??????????????????
  @ViewChild('productTypeTemplate') public productTypeTemplate: TemplateRef<HTMLDocument>;
  @ViewChild('productTemp') public productTemp: TemplateRef<HTMLDocument>;
  @ViewChild('tableCom') public tableCom: TableComponent;
  // ????????????
  public formColumn: FormItem[] = [];
  // ????????????
  public formStatus: FormOperate;
  // ???????????????
  public language: FacilityLanguageInterface;
  // ???????????????????????????
  public areaSelectVisible = false;
  // ???????????? ????????????
  public pageType = OperateTypeEnum.add;
  public _dataSet = [];
  // ????????????id
  public selectedProductId: string = null;
  // ??????
  public pageBean: PageModel = new PageModel();
  // ?????????????????????
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // ????????????
  public tableConfig: TableConfigModel = new TableConfigModel();
  // ????????????
  public pageTitle: string;
  // ????????????
  public cityInfo: CityInfoModel = new CityInfoModel();
  // ???????????????
  public selectPoint: PointModel = new PointModel();
  // ??????????????????
  public facilityAddress = '';
  // ??????id
  public deviceId: string;
  // ?????????????????????????????????
  public isVisible = false;
  // ????????????
  public areaName = '';
  // ??????code
  public areaCode: string;
  // ?????????????????????
  public selectorData = {parentId: '', accountabilityUnit: ''};
  // ???????????????????????????
  public areaSelectorConfig: TreeSelectorConfigModel;
  // ????????????
  public areaInfo: AreaModel = new AreaModel();
  // ??????????????????
  private areaNodes: NzTreeNode[] = [];
  // ????????????
  public isLoading = false;
  // ??????????????????
  public pageLoading = false;
  // ????????????
  public areaDisabled: boolean;
  // ????????????????????????
  public positionDisabled: boolean;
  // ???????????????
  public formLanguage: FormLanguageInterface;
  // ????????????????????????????????????????????????????????????
  public getDetailByModel: EquipmentModelModel[];
  // ????????????
  public isDisabled: boolean;
  // ????????????????????? ????????????????????????
  public fileList: File[];
  // ????????????
  public devicePicUrl: string;
  // ????????????????????????????????????
  public operateTypeEnum = OperateTypeEnum;
  public productDisable = true;
  public productLanguage: ProductLanguageInterface;
  // ???????????????
  public commonLanguage: CommonLanguageInterface;
  public productName = '';
  public productNameIsShow: boolean = false;
  // ?????????????????????
  public _selectedProduct;
  // ??????????????????
  public deviceTypeEnum = DeviceTypeEnum;
  // ??????????????????
  public productTypeEnum = ProductTypeEnum;
  // ??????????????????
  public equipmentTypeEnum = EquipmentTypeEnum;
  // ???????????????
  public languageEnum = LanguageEnum;
  public supplierId;
  // ????????????????????????????????????????????????
  public inputDebounce = _.debounce((event) => {
    event.target.value = event.target.value.trim();
  }, 500, {leading: false, trailing: true});

  // ???????????????
  public projectSelectVisible: boolean = false;
  // ???????????????
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
    // ???????????????
    this.initColumn();
    // ???????????????????????????
    this.initPage();
  }

  public ngOnDestroy(): void {
    // ???????????????
    this.areaSelector = null;
    // ??????????????????
    this.uploadImg = null;
  }

  /**
   * ??????????????????
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isDisabled = this.formStatus.getValid();
    });

    // ????????????????????????,???????????????,????????????
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

    // ????????????????????????,???????????????,????????????,?????????????????????
    this.formStatus.group.controls['deviceType'].valueChanges.subscribe(value => {
      // ??????????????????????????????
      this.formStatus.resetControlData('supplier', '');
      this.formStatus.resetControlData('scrapTime', '');
      this.formStatus.resetControlData('deviceModel', null);
      this.productDisable = false;
      this.checkCodingRule();
    });

    // const projectIdCol: FormItem = this.formStatus.getColumn('projectId').item;
    //
    // // ??????????????????
    // this.$facilityApiService.getProjectList().subscribe((result: ResultModel<Array<Project>>) => {
    //   if (result.code === ResultCodeEnum.success) {
    //     projectIdCol.selectInfo.data = result.data || [];
    //   } else {
    //     this.$modalService.error(result.msg);
    //   }
    // });

    // ???????????????????????????????????????????????????
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
   * ????????????
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
    data.positionGps = '12,33'; // ???????????????????????????????????????,???????????????
    // ?????????????????????????????????
    if (data.installationDate) {
      data.installationDate = new Date(data.installationDate).getTime();
    }
    // ??????????????????????????????
    let msg = '';
    let resultModelObservable: Observable<ResultModel<string>>;
    if (this.pageType === OperateTypeEnum.add) {
      // ?????????????????????
      resultModelObservable = this.$facilityApiService.addDevice(data);
      msg = this.language.addFacilitySuccess;
    } else if (this.pageType === OperateTypeEnum.update) {
      data.deviceId = this.deviceId;
      msg = this.language.updateFacilitySuccess;
      resultModelObservable = this.$facilityApiService.updateDeviceById(data);
    }
    resultModelObservable.subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        // ????????????
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
    // ??????????????????????????????????????????????????????
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
        // ??????????????????????????????
        if (!_.isEmpty(this._dataSet)) {
          this._dataSet.forEach(item => {
            if (String(item.typeFlag) === String(ProductTypeEnum.facility)) {
              item.iconClass = CommonUtil.getFacilityIConClass(item.typeCode);
            } else {
              item.iconClass = CommonUtil.getEquipmentTypeIcon(item as EquipmentListModel);
            }
            // ???????????????????????????????????????????????????
            // ????????????????????????????????????????????????
            // ?????????????????????????????? ??????
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
   * ????????????modal
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
   * ????????????     ???????????????
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
        { // ??????
          type: 'serial-number',
          width: 62,
          title: this.productLanguage.serialNum,
          fixedStyle: {fixedLeft: true, style: {left: '42px'}}
        },
        { // ????????????
          title: this.productLanguage.productModel, key: 'productModel', width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // ??????
          title: this.productLanguage.model, key: 'typeCode', width: 150,
          type: 'render',
          renderTemplate: this.productTypeTemplate,
          isShowSort: true,
        },
        { // ?????????
          title: this.productLanguage.supplier, key: 'supplierName', width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // ????????????
          title: this.productLanguage.scrapTime, key: 'scrapTime', width: 100,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // ????????????
          title: this.productLanguage.softVersion, key: 'softwareVersion', width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // ????????????
          title: this.productLanguage.hardWareVersion, key: 'hardwareVersion', width: 150,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        { // ?????????
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
   * ????????????
   * param event
   * param data
   */
  public selectedProductChange(event: boolean, data: any): void {
    this._selectedProduct = data;
  }

  /**
   * ?????????????????????
   */
  public showAreaSelectorModal(): void {
    if (this.areaDisabled) {
      return;
    }
    this.areaSelectorConfig.treeNodes = this.areaNodes;
    this.areaSelectVisible = true;
  }

  /**
   * ??????????????????
   * param event
   */
  public areaSelectChange(event: AreaModel[]): void {
    if (event[0]) {
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, event[0].areaId);
      this.areaName = event[0].areaName;
      this.selectorData.parentId = event[0].areaId;
      this.areaCode = event[0].areaCode;
      // ????????????id
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
   * ?????????????????????
   * param result ????????????????????????
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
   * ??????????????????
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
   * ??????????????????list
   */
  public getUploadList(fileList: File[]): void {
    this.fileList = fileList;
  }

  /**
   * ????????????
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
    // ??????????????????1M????????????
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
   * ?????????????????????
   */
  public showProjectSelectorModal(): void {
  this.projectSelectVisible = true;
  }
  /**
   * ?????????????????????
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
   * ???????????????????????????
   */
  private initPage(): void {
    this.pageLoading = true;
    this.$active.queryParams.subscribe(params => {
      this.pageType = this.$active.snapshot.params.type;
      this.pageTitle = this.getPageTitle(this.pageType);
      if (this.pageType !== OperateTypeEnum.add) {
        this.deviceId = params.id;
        // ??????????????????
        this.queryAreaListForPageSelection(true);
      } else {
        this.queryAreaListForPageSelection();
      }
    });
  }


  /**
   * ??????id??????????????????
   */
  private queryDeviceById(): void {
    this.$facilityCommonService.queryDeviceById({deviceId: this.deviceId}).subscribe((result: ResultModel<Array<FacilityDetailInfoModel>>) => {
      this.pageLoading = false;
      if (result.code === ResultCodeEnum.success) {
        const facilityInfo: FacilityDetailInfoModel = result.data.pop();
        // ????????????????????????????????????
        facilityInfo.installationDate = facilityInfo.installationDate ?
          new Date(Number(facilityInfo.installationDate)) : null;
        // ??????????????????
        this.supplierId = facilityInfo.supplierId;
        this.productName = facilityInfo.deviceModel;
        this.formStatus.resetData(facilityInfo);
        this.facilityAddress = facilityInfo.address;
        this.formStatus.resetControlData('areaId', facilityInfo.areaInfo.areaId);
        // ??????????????????
        if (facilityInfo.provinceName && facilityInfo.cityName && facilityInfo.districtName) {
          this.cityInfo.province = facilityInfo.provinceName;
          this.cityInfo.city = facilityInfo.cityName;
          this.cityInfo.district = facilityInfo.districtName;
          const str = `${facilityInfo.provinceName},${facilityInfo.cityName},${facilityInfo.districtName}`;
          this.formStatus.resetControlData('position', str);
        }
        this.selectSelectProject.projectId = facilityInfo.projectId;
        this.selectSelectProject.projectName = facilityInfo.projectName;
        // ???????????????
        const position = facilityInfo.positionBase.split(',');
        this.selectPoint.lng = parseFloat(position[0]);
        this.selectPoint.lat = parseFloat(position[1]);
        this.cityInfo.detailInfo = this.selectPoint;
        // ?????????????????????????????????
        if (facilityInfo.areaInfo.areaName && facilityInfo.areaInfo.areaId) {
          this.areaName = facilityInfo.areaInfo.areaName;
          FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, facilityInfo.areaInfo.areaId);
        }
        // ????????????
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
   * ??????????????????
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
   * ?????????????????????
   */
  private initColumn(): void {
    this.formColumn = [
      { // ??????????????????
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
      { // ??????
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
      { // ??????
        label: this.language.deviceModel,
        key: 'deviceModel',
        type: 'custom',
        template: this.productTemp,
        require: true,
        rule: [{required: true}],
      },
      { // ?????????
        label: this.language.supplierName,
        key: 'supplier',
        type: 'input',
        require: true,
        placeholder: this.language.autoInputByModel,
        rule: [{required: true}, RuleUtil.getNameMaxLengthRule()],
        asyncRules: [],
      },
      { // ????????????
        label: this.language.scrapTime,
        key: 'scrapTime',
        type: 'input',
        placeholder: this.language.autoInputByModel,
        rule: [RuleUtil.getNameMaxLengthRule(20), this.$ruleUtil.getLoopCode()],
        asyncRules: [],
      },
      {  // ????????????
        label: this.language.areaId, key: 'areaId', type: 'custom',
        require: true,
        template: this.areaSelector,
        rule: [{required: true}], asyncRules: []
      },
      { // ????????????
        label: this.language.projectName, key: 'projectId', type: 'custom',
        template: this.projectSelector,
        rule: [], asyncRules: []
      },
      { // ????????????
        label: this.language.position,
        key: 'position',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        template: this.positionTemplate
      },
      { // ?????????
        label: this.language.region,
        key: 'managementFacilities', type: 'custom', rule: [], template: this.customTemplate
      },
      { // ????????????
        label: this.language.address,
        key: 'address',
        type: 'input',
        disabled: true,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      { // ????????????
        label: this.language.company,
        key: 'company',
        type: 'input',
        rule: [RuleUtil.getNameMaxLengthRule(20), RuleUtil.getNameMinLengthRule(), RuleUtil.getNamePatternRule()],
        asyncRules: []
      },
      { // ????????????
        label: this.language.installationDate,
        key: 'installationDate',
        type: 'custom',
        initialValue: '',
        template: this.installationDateTemp,
        rule: [],
        asyncRules: []
      },
      { // ???????????????
        label: this.language.otherSystemNumber,
        key: 'otherSystemNumber',
        type: 'input',
        rule: [],
        asyncRules: []
      },
      { // ????????????
        label: this.language.deviceCode,
        key: 'deviceCode',
        type: 'input',
        require: false,
        rule: [ RuleUtil.getNameMaxLengthRule(40)],
        asyncRules: [
          // ??????????????????????????????
          this.$ruleUtil.getNameAsyncRule(value =>
              this.$facilityApiService.queryFacilityCodeIsExist(
                {deviceCode: value, deviceId: this.deviceId}),
            res => res.data, this.language.equipmentCodeExist)
        ],
      },
      { // ??????
        label: this.language.remarks, key: 'remarks',
        type: 'textarea',
        col: 24,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      { // ????????????
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
   * ????????????????????????
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
   * ??????????????????????????????
   * param nodes
   */
  private initAreaSelectorConfig(nodes: NzTreeNode[]): void {
    this.areaSelectorConfig = FacilityForCommonUtil
      .getAreaSelectorConfig(`${this.language.select}${this.language.area}`, nodes);
  }

  /**
   * ????????????
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
   * ??????????????????
   * @param isQueryDeviceById boolean
   */
  private queryAreaListForPageSelection(isQueryDeviceById?: boolean): void {
    this.$facilityCommonService.queryAreaListForPageSelection().subscribe((result: ResultModel<NzTreeNode[]>) => {
      this.pageLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.areaNodes = result.data;
        // ?????????????????????
        this.initAreaSelectorConfig(this.areaNodes);
        // ??????queryDeviceById???????????????
        if (isQueryDeviceById) {
          this.queryDeviceById();
        } else {
          // ?????????????????????????????????
          FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, null, null);
        }
      }
    }, () => this.pageLoading = false);
  }

  /**
   * ??????????????????????????????????????????
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
