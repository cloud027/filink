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
 * 新增/编辑入库物料页面
 */
@Component({
  selector: 'app-add-warehousing',
  templateUrl: './add-warehousing.component.html',
  styleUrls: ['./add-warehousing.component.scss']
})
export class AddWarehousingComponent implements OnInit {
  // 规格型号选择器
  @ViewChild('materialModelSelector') private materialModelSelector: TemplateRef<HTMLDocument>;
  // 自动生成名称模板
  @ViewChild('autoNameTemplate') private autoNameTemplate: TemplateRef<HTMLDocument>;
  // 页面标题
  public pageTitle: string = '';
  // 页面类型
  public pageType: string = OperateTypeEnum.add;
  // 国际化
  public storageLanguage: StorageLanguageInterface;
  public commonLanguage: CommonLanguageInterface;
  // 表单语言包
  public formLanguage: FormLanguageInterface;
  // 列表配置
  public formColumn: FormItem[] = [];
  // 按钮loading
  public isLoading: boolean = false;
  // 按钮禁用
  public isDisabled: boolean = true;
  // 规格型号选择器列表是否可见
  public modelSelectVisible: boolean = false;
  // 选择的规格型号id
  public selectModelId: string = '';
  // 规格型号列表中的产品类型信息源
  public productTypeDataSource: SelectModel[] = [];
  // 表单操作实现类
  private formStatus: FormOperate;
  // 入库物料id
  private warehousingId: string;
  // 当前所选物料类型code
  private materialCode: string;
  // 当前所选物料类型
  private materialType: MaterialTypeEnum | string;
  // 当前所选供应商id
  private supplierId: string;
  // 摄像头/智能门禁锁的类型
  private cameraType: CameraTypeEnum | LockTypeEnum;

  constructor(public $nzI18n: NzI18nService,
              public $router: Router,
              public $storageApiService: StorageApiService,
              public $message: FiLinkModalService,
              private $ruleUtil: RuleUtil,
              private $active: ActivatedRoute) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 初始国际化
    this.storageLanguage = this.$nzI18n.getLocaleData(LanguageEnum.storage);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.formLanguage = this.$nzI18n.getLocaleData(LanguageEnum.form);
    // 初始化表单
    this.initForm();
    // 初始化新增/编辑页面
    this.getPage();
  }

  /**
   * 获取表单实例对象
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isDisabled = !this.formStatus.getValid();
    });
  }

  /**
   * 返回
   */
  public goBack(): void {
    this.$router.navigate(['/business/storage/warehousing']).then();
  }

  /**
   * 表单提交
   */
  public submit(): void {
    // 获取表单数据
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
      // 新增入库物料
      funcName = this.$storageApiService.addWarehousing(data);
    } else {
      // 编辑入库物料
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
   * 选择规格型号之后的确定事件
   */
  public handleModelOk(selectData: ProductInfoModel[]): void {
    this.modelSelectVisible = false;
    if (selectData.length) {
      const tempData = selectData[0];
      // 将当前选择的规格型号id、供应商id、物料code、摄像头类型保存下来 方便后面传给后台
      this.selectModelId = selectData[0].productId;
      this.supplierId = tempData.supplier;
      this.materialCode = tempData.typeCode;
      this.cameraType = tempData.pattern;
      // 设置规格型号、供应商、物料分类、软硬件版本号当前值
      this.formStatus.resetControlData('materialModel', tempData.productModel);
      this.formStatus.resetControlData('supplierId', tempData.supplierName);
      // 设置显示物料类型为当前设施、设备名称；当为设备时，才有软硬件版本号
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
      // 如果选择的是设施，或者选择的设备，设备为智能门禁锁且为无源锁，软硬件版本号隐藏
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
   * 选择规格型号
   */
  public showModelSelect(): void {
    this.modelSelectVisible = true;
    this.productTypeDataSource = FacilityForCommonUtil.getRoleFacility(this.$nzI18n).concat(
      FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n)
    );
    this.productTypeDataSource.push({label: this.storageLanguage.otherTotal, code: 'other'});
  }

  /**
   * 初始化表单
   */
  private initForm(): void {
    this.formColumn = [
      {
        // 物料名称
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
        // 规格型号
        label: this.storageLanguage.productModel,
        key: 'materialModel',
        require: true,
        type: 'custom',
        template: this.materialModelSelector,
        rule: [{required: true}]
      },
      {
        // 供应商
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
        // 物料分类
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
        // 软件版本号
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
        // 硬件版本号
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
        // 物料编号
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
        // 物料数量
        label: this.storageLanguage.materialNum,
        key: 'materialNum',
        col: 24,
        require: true,
        type: 'input',
        rule: [{required: true}, this.$ruleUtil.getDataCapacityRule()]
      },
      {
        // 物料单价
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
   * 获取新增、编辑页面
   */
  private getPage(): void {
    // 获取页面操作类型及标题
    this.pageType = this.$active.snapshot.params.type;
    this.pageTitle = this.pageType === OperateTypeEnum.update ? this.storageLanguage.updateWarehousing : this.storageLanguage.addWarehousing;
    if (this.pageType === OperateTypeEnum.update) {
      this.$active.queryParams.subscribe(params => {
        this.warehousingId = params.warehousingId;
        this.cameraType = params.pattern;
        // 编辑数据回显
        this.queryWarehousingById();
      });
    }
  }

  /**
   * 编辑数据回显
   */
  private queryWarehousingById(): void {
    this.$storageApiService.queryWarehousingById(this.warehousingId).subscribe((res: ResultModel<WarehousingListModel>) => {
      if (res.code === ResultCodeEnum.success) {
        const data = res.data;
        // 选择的规格型号回显
        this.selectModelId = data.materialModel;
        // 回显时保存当前的物料类型、物料code、供应商id，物料单价处理为保留两位小数展示
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
          // 当物料类型为其他时，回显
          this.formStatus.resetControlData('materialType', this.storageLanguage.otherTotal);
        }
        // 如果选择的是设施，或者选择的设备，设备为智能门禁锁且为无源锁，软硬件版本号隐藏
        const hidden = data.materialType === MaterialTypeEnum.facility || (
          data.materialCode === EquipmentTypeEnum.intelligentEntranceGuardLock && this.cameraType === LockTypeEnum.passiveLock);
        this.formStatus.setColumnHidden(['softwareVersion', 'hardwareVersion'], hidden);
      }
    });
  }
}
