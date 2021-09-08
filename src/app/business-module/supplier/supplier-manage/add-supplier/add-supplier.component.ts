import {Component, OnInit, ViewChild} from '@angular/core';
import {OperateTypeEnum} from '../../../../shared-module/enum/page-operate-type.enum';
import {Observable} from 'rxjs';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {SupplierLanguageInterface} from '../../../../../assets/i18n/supplier/supplier.language.interface';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {SupplierApiService} from '../../share/service/supplier-api.service';
import {NzI18nService} from 'ng-zorro-antd';
import {Router, ActivatedRoute} from '@angular/router';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {SupplierAptitudesEnum} from '../../../../core-module/enum/supplier/supplier-aptitudes.enum';
import {SupplierDataModel} from '../../../../core-module/model/supplier/supplier-data.model';
import {TelephoneInputComponent} from '../../../../shared-module/component/telephone-input/telephone-input.component';
import {PhoneSetModel} from '../../../../core-module/model/user/phone-set.model';
import {UserLanguageInterface} from '../../../../../assets/i18n/user/user-language.interface';

/**
 * 新增或编辑供应商页面
 */
@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.scss']
})
export class AddSupplierComponent implements OnInit {
  // 新增手机号模板
  @ViewChild('telephoneTemp') public telephoneTemp;
  // 手机号输入框
  @ViewChild('telephoneInput') public telephoneInput: TelephoneInputComponent;
  // 页面标题
  public pageTitle: string = '';
  // 页面类型
  public pageType: string = OperateTypeEnum.add;
  // 国际化
  public supplierLanguage: SupplierLanguageInterface;
  public commonLanguage: CommonLanguageInterface;
  public userLanguage: UserLanguageInterface;
  // 列表配置
  public formColumn: FormItem[] = [];
  // 按钮loading
  public isLoading: boolean = false;
  // 按钮禁用
  public isDisabled: boolean = true;
  // 手机号校验
  public phoneNumberMsg: string = '';
  // 手机号数据
  public phoneValue: string = '';
  // 表单操作实现类
  private formStatus: FormOperate;
  // 供应商id
  private supplierId: string;
  // 手机号国际码
  private countryCode: string = '86';
  // 手机号
  private telephone;

  constructor(public $nzI18n: NzI18nService,
              public $message: FiLinkModalService,
              public $supplierService: SupplierApiService,
              private $active: ActivatedRoute,
              private $ruleUtil: RuleUtil,
              private $router: Router) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    // 初始国际化
    this.userLanguage = this.$nzI18n.getLocaleData(LanguageEnum.user);
    this.supplierLanguage = this.$nzI18n.getLocaleData(LanguageEnum.supplier);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.initForm();
    // 新增编辑页面初始化
    this.initPage();
  }

  /**
   * 获取表单实例对象
   */
  public formInstance(event: { instance: FormOperate }) {
    this.formStatus = event.instance;
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isDisabled = !this.formStatus.getRealValid();
    });
  }

  /**
   * 提交
   */
  public submit(): void {
    // 获取表单数据
    const data = this.formStatus.group.getRawValue();
    let funcName: Observable<ResultModel<string>>;
    const userInfo = SessionUtil.getUserInfo();
    data.deptCode = userInfo.department.deptCode;
    // 手机号码设置
    const telephoneCode = this.telephoneInput.telephoneCode;
    data.countryCode = telephoneCode.substr(1, telephoneCode.length - 1);  // 电话号码国际码
    if (!this.supplierId) {
      // 新增供应商
      funcName = this.$supplierService.saveSupplier(data);
    } else {
      // 编辑供应商
      data.supplierId = this.supplierId;
      funcName = this.$supplierService.editSupplier(data);
    }
    this.isLoading = true;
    funcName.subscribe((res: ResultModel<string>) => {
      this.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        if (this.pageType === OperateTypeEnum.add) {
          this.$message.success(this.supplierLanguage.addSuccess);
        } else {
          this.$message.success(this.supplierLanguage.editSuccess);
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
   * 取消
   */
  public goBack(): void {
    this.$router.navigate(['/business/supplier/supplier-manage']).then();
  }
  /**
   * 获取电话号码国际码
   */
  public getPhone(event: PhoneSetModel): void {
    this.countryCode = event.dialCode;
  }
  /**
   * 初始化电话号码
   */
  public getPhoneInit(event: any): void {
    this.telephone = event;
  }
  /**
   * 监听手机号码输入状态
   */
  public inputNumberChange(event: string): void {
    this.phoneNumberMsg = '';
    const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    const _reg = /^\d+$/;
    // 校验输入的手机号 不需要做唯一性校验
    if (this.telephoneInput && this.telephoneInput.telephoneCode === '+86') {
      if (reg.test(event)) {
        this.formStatus.resetControlData('attnPhone', event);
      } else {
        this.phoneNumberMsg = event && this.userLanguage.phoneNumberTips;
        this.formStatus.resetControlData('attnPhone', null);
      }
    } else {
      if (_reg.test(event)) {
        this.phoneNumberMsg = '';
        this.formStatus.resetControlData('attnPhone', event);
      } else {
        this.phoneNumberMsg = event && this.userLanguage.phoneNumberTips;
        this.formStatus.resetControlData('attnPhone', null);
      }
    }
  }
  /**
   * 初始化表单
   */
  private initForm(): void {
    this.formColumn = [
      {
        // 供应商名称
        label: this.supplierLanguage.supplierName,
        key: 'supplierName',
        col: 24,
        require: true,
        type: 'input',
        rule: [{required: true},
          this.$ruleUtil.getNameRule(),
          RuleUtil.getNameMinLengthRule(),
          RuleUtil.getNameMaxLengthRule(255)],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          // 异步校验供应商名称在列表中的唯一性, 编辑时，需排除当前供应商名称
          this.$ruleUtil.getNameAsyncRule(value => this.$supplierService.checkExitsSupplier(
            {supplierName: value, supplierId: this.supplierId}),
            res => !res.data)
        ]
      },
      {
        // 供应商编号
        label: this.supplierLanguage.supplierNum,
        key: 'supplierNum',
        col: 24,
        type: 'input',
        rule: [RuleUtil.getNameMinLengthRule(), RuleUtil.getNameMaxLengthRule(4),
          {
            pattern: '^[0-9]{4}$',
            msg: this.supplierLanguage.supplierNumTips
          }]
      },
      {
        // 供应商资质
        label: this.supplierLanguage.supplierAptitudes,
        key: 'supplierAptitudes',
        col: 24,
        require: true,
        type: 'select',
        rule: [{required: true}],
        selectInfo: {
          data: CommonUtil.codeTranslate(SupplierAptitudesEnum, this.$nzI18n, null, LanguageEnum.supplier),
          label: 'label', value: 'code',
        },
      },
      {
        // 公司地址
        label: this.supplierLanguage.address,
        key: 'address',
        col: 24,
        type: 'input',
        require: true,
        rule: [{required: true}, RuleUtil.getNameMinLengthRule(),
          RuleUtil.getNameMaxLengthRule(64), this.$ruleUtil.getNameRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()]
      },
      {
        // 联系人
        label: this.supplierLanguage.attn,
        key: 'attn',
        col: 24,
        type: 'input',
        require: true,
        rule: [{required: true}, RuleUtil.getNameMinLengthRule(),
          RuleUtil.getNameMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()]
      },
      {
        // 联系电话
        label: this.supplierLanguage.attnPhone,
        key: 'attnPhone',
        col: 24,
        type: 'custom',
        require: true,
        rule: [{required: true}],
        template: this.telephoneTemp
      },
      {
        // 供应商基础信息
        label: this.supplierLanguage.supplierBasicInformation,
        key: 'supplierBasicInformation',
        col: 24,
        type: 'textarea',
        rule: [RuleUtil.getNameMinLengthRule(), this.$ruleUtil.getRemarkMaxLengthRule()]
      },
      {
        // 备注
        label: this.supplierLanguage.remarks,
        key: 'remark',
        type: 'textarea',
        col: 24,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      }
    ];
  }
  /**
   * 初始化新增编辑页面
   */
  private initPage(): void {
    this.pageType = this.$active.snapshot.params.type;
    if (this.pageType === OperateTypeEnum.add) {
      this.pageTitle = this.supplierLanguage.addSupplier;
    } else if (this.pageType === OperateTypeEnum.update) {
      this.pageTitle = this.supplierLanguage.updateSupplier;
      this.$active.queryParams.subscribe(params => {
        this.supplierId = params.supplierId;
        // 编辑数据回显
        this.getSupplierData();
      });
    }
  }

  /**
   * 编辑数据回显
   */
  private getSupplierData(): void {
    this.$supplierService.querySupplierById(this.supplierId).subscribe((res: ResultModel<SupplierDataModel>) => {
      if (res.code === ResultCodeEnum.success) {
        const data = res.data || null;
        this.formStatus.resetData(data);
        // 手机号
        this.phoneValue = res.data.attnPhone;
        // 国际码
        if (data.countryCode) {
          this.telephoneInput.telephoneCode = `+${data.countryCode}`;
        }
        // 电话号码
        this.telephoneInput._phoneNum = data.attnPhone;
      }
    });
  }
}
