import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {OperateTypeEnum} from '../../../../../shared-module/enum/page-operate-type.enum';
import {StorageLanguageInterface} from '../../../../../../assets/i18n/storage/storage.language.interface';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {StorageApiService} from '../../../share/service/storage-api.service';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {NzI18nService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../shared-module/component/form/form-operate.service';
import {RuleUtil} from '../../../../../shared-module/util/rule-util';
import {FormLanguageInterface} from '../../../../../../assets/i18n/form/form.language.interface';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {WarehousingListModel} from '../../../share/model/warehousing-list.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {ProductInfoModel} from '../../../../../core-module/model/product/product-info.model';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {CameraTypeEnum, EquipmentTypeEnum} from '../../../../../core-module/enum/equipment/equipment.enum';
import {LockTypeEnum, ProductTypeEnum} from '../../../../../core-module/enum/product/product.enum';
import {FacilityForCommonUtil} from '../../../../../core-module/business-util/facility/facility-for-common.util';
import {MaterialTypeEnum} from '../../../share/enum/material-type.enum';
import {DeviceTypeEnum} from '../../../../../core-module/enum/facility/facility.enum';
import {SelectModel} from '../../../../../shared-module/model/select.model';

/**
 * ??????/????????????????????????
 */
@Component({
  selector: 'app-add-warehousing',
  templateUrl: './add-warehousing.component.html',
  styleUrls: ['./add-warehousing.component.scss']
})
export class AddWarehousingComponent implements OnInit {
  // ?????????????????????
  @ViewChild('materialModelSelector') private materialModelSelector: TemplateRef<HTMLDocument>;
  // ????????????????????????
  @ViewChild('autoNameTemplate') private autoNameTemplate: TemplateRef<HTMLDocument>;
  // ????????????
  public pageTitle: string = '';
  // ????????????
  public pageType: string = OperateTypeEnum.add;
  // ?????????
  public storageLanguage: StorageLanguageInterface;
  public commonLanguage: CommonLanguageInterface;
  // ???????????????
  public formLanguage: FormLanguageInterface;
  // ????????????
  public formColumn: FormItem[] = [];
  // ??????loading
  public isLoading: boolean = false;
  // ????????????
  public isDisabled: boolean = true;
  // ???????????????????????????????????????
  public modelSelectVisible: boolean = false;
  // ?????????????????????id
  public selectModelId: string = '';
  // ?????????????????????????????????????????????
  public productTypeDataSource: SelectModel[] = [];
  // ?????????????????????
  private formStatus: FormOperate;
  // ????????????id
  private warehousingId: string;
  // ????????????????????????code
  private materialCode: string;
  // ????????????????????????
  private materialType: MaterialTypeEnum | string;
  // ?????????????????????id
  private supplierId: string;
  // ?????????/????????????????????????
  private cameraType: CameraTypeEnum | LockTypeEnum;

  constructor(public $nzI18n: NzI18nService,
              public $router: Router,
              public $storageApiService: StorageApiService,
              public $message: FiLinkModalService,
              private $ruleUtil: RuleUtil,
              private $active: ActivatedRoute) {
  }

  /**
   * ?????????
   */
  public ngOnInit(): void {
    // ???????????????
    this.storageLanguage = this.$nzI18n.getLocaleData(LanguageEnum.storage);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.formLanguage = this.$nzI18n.getLocaleData(LanguageEnum.form);
    // ???????????????
    this.initForm();
    // ???????????????/????????????
    this.getPage();
  }

  /**
   * ????????????????????????
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isDisabled = !this.formStatus.getValid();
    });
  }

  /**
   * ??????
   */
  public goBack(): void {
    this.$router.navigate(['/business/storage/warehousing']).then();
  }

  /**
   * ????????????
   */
  public submit(): void {
    // ??????????????????
    const data = this.formStatus.group.getRawValue();
    if (this.selectModelId) {
      data.supplierId = this.supplierId;
      data.materialType = this.materialType;
      data.materialModel = this.selectModelId;
      data.materialCode = this.materialCode;
      data.equipmentModelType = this.cameraType;
    }
    let funcName: Observable<ResultModel<string>>;
    if (!this.warehousingId) {
      // ??????????????????
      funcName = this.$storageApiService.addWarehousing(data);
    } else {
      // ??????????????????
      data.warehousingId = this.warehousingId;
      funcName = this.$storageApiService.updateWarehousingById(data);
    }
    this.isLoading = true;
    funcName.subscribe((res: ResultModel<string>) => {
      this.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        if (!this.warehousingId) {
          this.$message.success(this.storageLanguage.addWarehousingSuccess);
        } else {
          this.$message.success(this.storageLanguage.updateWarehousingSuccess);
        }
        this.goBack();
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.isLoading = false;
    });
  }

  /**
   * ???????????????????????????????????????
   */
  public handleModelOk(selectData: ProductInfoModel[]): void {
    this.modelSelectVisible = false;
    if (selectData.length) {
      const tempData = selectData[0];
      // ??????????????????????????????id????????????id?????????code?????????????????????????????? ????????????????????????
      this.selectModelId = selectData[0].productId;
      this.supplierId = tempData.supplier;
      this.materialCode = tempData.typeCode;
      this.cameraType = tempData.pattern;
      // ???????????????????????????????????????????????????????????????????????????
      this.formStatus.resetControlData('materialModel', tempData.productModel);
      this.formStatus.resetControlData('supplierId', tempData.supplierName);
      // ???????????????????????????????????????????????????????????????????????????????????????????????????
      if (tempData.typeFlag === ProductTypeEnum.equipment) {
        this.materialType = MaterialTypeEnum.equipment;
        this.formStatus.resetControlData('materialType', CommonUtil.codeTranslate(EquipmentTypeEnum, this.$nzI18n, tempData.typeCode));
      } else if (tempData.typeFlag === ProductTypeEnum.facility) {
        this.materialType = MaterialTypeEnum.facility;
        this.formStatus.resetControlData('materialType', CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n, tempData.typeCode));
      } else {
        this.materialType = MaterialTypeEnum.other;
        this.formStatus.resetControlData('materialType', CommonUtil.codeTranslate(ProductTypeEnum, this.$nzI18n, tempData.typeCode));
      }
      // ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
      const hidden = tempData.typeFlag === ProductTypeEnum.facility ||
        (tempData.typeCode === EquipmentTypeEnum.intelligentEntranceGuardLock && tempData.pattern === LockTypeEnum.passiveLock);
      this.formStatus.setColumnHidden(['softwareVersion', 'hardwareVersion'], hidden);
      this.formStatus.resetControlData('softwareVersion', tempData.softwareVersion);
      this.formStatus.resetControlData('hardwareVersion', tempData.hardwareVersion);
      this.formStatus.resetControlData('materialNumber', tempData.materialCode);
    } else {
      this.selectModelId = '';
      ['materialModel', 'supplierId', 'materialType', 'softwareVersion', 'hardwareVersion', 'materialNumber'].forEach(key => {
        this.formStatus.resetControlData(key, '');
      });
    }
  }

  /**
   * ??????????????????
   */
  public showModelSelect(): void {
    this.modelSelectVisible = true;
    this.productTypeDataSource = FacilityForCommonUtil.getRoleFacility(this.$nzI18n).concat(
      FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n)
    );
    this.productTypeDataSource.push({label: this.storageLanguage.otherTotal, code: 'other'});
  }

  /**
   * ???????????????
   */
  private initForm(): void {
    this.formColumn = [
      {
        // ????????????
        label: this.storageLanguage.materialName,
        key: 'materialName',
        col: 24,
        require: true,
        type: 'input',
        rule: [{required: true},
          RuleUtil.getNameMinLengthRule(),
          RuleUtil.getNameMaxLengthRule(),
          this.$ruleUtil.getNameRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()]
      },
      {
        // ????????????
        label: this.storageLanguage.productModel,
        key: 'materialModel',
        require: true,
        type: 'custom',
        template: this.materialModelSelector,
        rule: [{required: true}]
      },
      {
        // ?????????
        label: this.storageLanguage.supplier,
        key: 'supplierId',
        col: 24,
        require: true,
        type: 'input',
        disabled: true,
        placeholder: this.storageLanguage.automaticAcquisition,
        rule: [{required: true}]
      },
      {
        // ????????????
        label: this.storageLanguage.materialType,
        key: 'materialType',
        col: 24,
        require: true,
        type: 'input',
        disabled: true,
        placeholder: this.storageLanguage.automaticAcquisition,
        rule: [{required: true}]
      },
      {
        // ???????????????
        label: this.storageLanguage.softwareVersion,
        key: 'softwareVersion',
        col: 24,
        require: true,
        type: 'input',
        disabled: true,
        hidden: true,
        placeholder: this.storageLanguage.automaticAcquisition,
        rule: [{required: true}]
      },
      {
        // ???????????????
        label: this.storageLanguage.hardwareVersion,
        key: 'hardwareVersion',
        col: 24,
        require: true,
        type: 'input',
        disabled: true,
        hidden: true,
        placeholder: this.storageLanguage.automaticAcquisition,
        rule: [{required: true}]
      },
      {
        // ????????????
        label: this.storageLanguage.materialSerial,
        key: 'materialNumber',
        col: 24,
        require: true,
        type: 'input',
        rule: [
          {required: true},
          RuleUtil.getNameMaxLengthRule(),
          this.$ruleUtil.getNameRule()
        ],
        disabled: true,
        placeholder: this.storageLanguage.automaticAcquisition,
        customRules: [this.$ruleUtil.getNameCustomRule()]
      },
      {
        // ????????????
        label: this.storageLanguage.materialNum,
        key: 'materialNum',
        col: 24,
        require: true,
        type: 'input',
        rule: [{required: true}, this.$ruleUtil.getDataCapacityRule()]
      },
      {
        // ????????????
        label: this.storageLanguage.materialUnitPrice,
        key: 'materialUnitPrice',
        col: 24,
        require: true,
        type: 'input',
        rule: [{required: true},
          this.$ruleUtil.getPriceRule()]
      }
    ];
  }

  /**
   * ???????????????????????????
   */
  private getPage(): void {
    // ?????????????????????????????????
    this.pageType = this.$active.snapshot.params.type;
    this.pageTitle = this.pageType === OperateTypeEnum.update ? this.storageLanguage.updateWarehousing : this.storageLanguage.addWarehousing;
    if (this.pageType === OperateTypeEnum.update) {
      this.$active.queryParams.subscribe(params => {
        this.warehousingId = params.warehousingId;
        this.cameraType = params.pattern;
        // ??????????????????
        this.queryWarehousingById();
      });
    }
  }

  /**
   * ??????????????????
   */
  private queryWarehousingById(): void {
    this.$storageApiService.queryWarehousingById(this.warehousingId).subscribe((res: ResultModel<WarehousingListModel>) => {
      if (res.code === ResultCodeEnum.success) {
        const data = res.data;
        // ???????????????????????????
        this.selectModelId = data.materialModel;
        // ?????????????????????????????????????????????code????????????id????????????????????????????????????????????????
        this.materialType = data.materialType;
        this.materialCode = data.materialCode;
        this.supplierId = data.supplierId;
        this.formStatus.resetData(data);
        this.formStatus.resetControlData('materialModel', data.materialModelName);
        this.formStatus.resetControlData('supplierId', data.supplierName);
        if (data.materialType === MaterialTypeEnum.equipment) {
          this.formStatus.resetControlData('materialType', CommonUtil.codeTranslate(EquipmentTypeEnum, this.$nzI18n, data.materialCode));
        } else if (data.materialType === MaterialTypeEnum.facility) {
          this.formStatus.resetControlData('materialType', CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n, data.materialCode));
        } else {
          // ????????????????????????????????????
          this.formStatus.resetControlData('materialType', this.storageLanguage.otherTotal);
        }
        // ?????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
        const hidden = data.materialType === MaterialTypeEnum.facility || (
          data.materialCode === EquipmentTypeEnum.intelligentEntranceGuardLock && this.cameraType === LockTypeEnum.passiveLock);
        this.formStatus.setColumnHidden(['softwareVersion', 'hardwareVersion'], hidden);
      }
    });
  }
}
