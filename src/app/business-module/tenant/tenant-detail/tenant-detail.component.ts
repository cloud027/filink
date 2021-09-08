import {Component, OnInit, ViewChild} from '@angular/core';
import {OperateTypeEnum} from '../../../shared-module/enum/page-operate-type.enum';
import {FormItem} from '../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../shared-module/component/form/form-operate.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LanguageEnum} from '../../../shared-module/enum/language.enum';
import {TenantLanguageInterface} from '../../../../assets/i18n/tenant/tenant.language.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import {RuleUtil} from '../../../shared-module/util/rule-util';
import {ResultModel} from '../../../shared-module/model/result.model';
import {QueryConditionModel} from '../../../shared-module/model/query-condition.model';
import {PhoneSetModel} from '../../../core-module/model/user/phone-set.model';
import {TenantStatusEnum} from '../share/enum/tenant.enum';
import {TenantApiService} from '../share/sevice/tenant-api.service';
import {Result} from '../../../shared-module/entity/result';
import {TenantModel} from '../share/model/tenant.model';
import {ResultCodeEnum} from '../../../shared-module/enum/result-code.enum';
import {TelephoneInputComponent} from '../../../shared-module/component/telephone-input/telephone-input.component';
import {UserLanguageInterface} from '../../../../assets/i18n/user/user-language.interface';
import {CommonLanguageInterface} from '../../../../assets/i18n/common/common.language.interface';

@Component({
  selector: 'app-tenant-detail',
  templateUrl: './tenant-detail.component.html',
  styleUrls: ['./tenant-detail.component.scss']
})
export class TenantDetailComponent implements OnInit {

  // 新增手机号模板
  @ViewChild('telephoneTemp') public telephoneTemp;
  // 手机号输入框
  @ViewChild('telephoneInput') public telephoneInput: TelephoneInputComponent;

  // 国际化
  public language: TenantLanguageInterface;
  // 国际化
  public userLanguage: UserLanguageInterface;
  // 公共语言包
  public commonLanguage: CommonLanguageInterface;
  // 查询参数对象集
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 页面title
  public pageTitle: string;
  // 页面类型
  public pageType = OperateTypeEnum.add;
  // 页面表单
  public formColumn: FormItem[] = [];
  // 表单实例
  public formStatus: FormOperate;
  // 提交按钮loading
  public isLoading = false;
  // 手机号校验
  public phoneNumberMsg: string = '';
  // 手机号国际码
  private countryCode: string = '86';
  // 手机号
  public telephone;
  // 手机号数据
  public phoneValue: string = '';
  // 租户id
  public tenantId: string = '';
  // 确定按钮监听
  public isDisabled: boolean = false;

  constructor(
    public $tenantApiService: TenantApiService,
    public $router: Router,
    public $nzI18n: NzI18nService,
    public $ruleUtil: RuleUtil,
    public $active: ActivatedRoute,
    private $message: FiLinkModalService,
  ) {
  }

  ngOnInit() {
    // 国际化
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.tenant);
    this.userLanguage = this.$nzI18n.getLocaleData(LanguageEnum.user);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // 判断页面类型
    this.$active.queryParams.subscribe(params => {
      if (params.id) {
        // 获取租户ID
        this.tenantId = params.id;
      }
      // 页面类型
      this.pageType = params.type;
    });
    // 页面类型获取
    this.pageTitle = this.getPageTitle(this.pageType);
    // 初始化表单
    this.initColumn();
    // 编辑页面表单回显
    this.pageSwitching();
  }

  /**
   * 判断页面类型
   */
  public getPageTitle(type: string): string {
    let title;
    switch (type) {
      case OperateTypeEnum.add:
        title = this.language.tenantAdd;
        break;
      case OperateTypeEnum.update:
        title = this.language.tenantModify;
        break;
    }
    return title;
  }


  /**
   * 表单回显
   */
  public pageSwitching(): void {
    if (this.pageType === OperateTypeEnum.update) {
      // 回显表单数据
      this.queryCondition.filterConditions = [{filterValue: this.tenantId, filterField: 'id', operator: 'eq'}];
      this.$tenantApiService.queryTenantList(this.queryCondition).subscribe((result: Result) => {
        if (result.code === ResultCodeEnum.success) {
          // 手机号
          this.phoneValue = result.data[0].phoneNumber;
          if (result.data[0].countryCode) {
            this.telephoneInput.telephoneCode = `+${result.data[0].countryCode}`; // 国际码
          }
          this.telephoneInput._phoneNum = result.data[0].phoneNumber; // 电话号码
          setTimeout(() => {
            this.formStatus.resetData(result.data[0]);
            this.formStatus.group.controls['email'].markAsDirty();
            this.formStatus.group.updateValueAndValidity();
          }, 0);
        }
      });
    }
  }

  /**
   * 获取表单实例
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isDisabled = this.formStatus.getValid();
    });

  }


  /**
   * 初始化表单配置
   */
  private initColumn(): void {
    this.formColumn = [
      {
        // 租户名称
        label: this.language.tenantName,
        key: 'tenantName',
        type: 'input',
        require: true,
        rule: [{required: true}, {maxLength: 32},
          this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [this.$ruleUtil.getNameAsyncRule(value => this.$tenantApiService.checkTenantName(
          {id: this.tenantId, tenantName: value}),
          (res: ResultModel<boolean>) => {
            if (res.code === ResultCodeEnum.success) {
              return res.data;
            }
          }, this.userLanguage.duplicateUsernameAdd)]
      },
      {
        // 状态
        label: this.language.tenantStatus,
        key: 'status',
        type: 'radio',
        require: true,
        rule: [{required: true}],
        initialValue: TenantStatusEnum.enable,
        radioInfo: {
          data: [
            // 启用
            {label: this.language.enable, value: TenantStatusEnum.enable},
            // 停用
            {label: this.language.disable, value: TenantStatusEnum.disable},
          ],
          label: 'label',
          value: 'value'
        }
      },
      {
        // 手机号
        label: this.language.phoneNumber,
        key: 'phoneNumber',
        type: 'custom',
        require: true,
        col: 24,
        rule: [
          {required: true}
        ],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$tenantApiService.checkTenantPhone(
            {id: this.tenantId, phoneNumber: value}
            ),
            res => {
              if (res.code === ResultCodeEnum.success) {
                if (res.data) {
                  return true;
                } else {
                  this.phoneNumberMsg = this.language.phoneNumberExistTips;
                  return false;
                }
              } else {
                return false;
              }
            })
        ],
        template: this.telephoneTemp
      },
      {
        // 邮箱
        label: this.language.email,
        key: 'email',
        type: 'input',
        require: true,
        rule: [
          {required: true},
          {maxLength: 32},
          {pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, msg: this.userLanguage.emailTips}],
        // 异步校验规则
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$tenantApiService.checkTenantEmail(
            {id: this.tenantId, email: value}
            ),
            res => {
              if (res.code === ResultCodeEnum.success) {
                return res.data;
              } else {
                return false;
              }
            }, this.commonLanguage.emailExists)
        ]
      },
      {
        // 地址
        label: this.language.address,
        key: 'address',
        type: 'input',
        require: false,
        rule: [{maxLength: 64}],
        asyncRules: []
      },
      {
        // 备注
        label: this.language.remark,
        key: 'remark',
        type: 'input',
        require: false,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
    ];
  }


  /**
   * 确定按钮
   */
  public submit(): void {
    // 后台缺参数。临时用
    const body: TenantModel = this.formStatus.getData();
    this.isLoading = true;
    const results = this.formStatus.getData();
    const telephoneCode = this.telephoneInput.telephoneCode;
    // 电话号码国际码
    results.countryCode = telephoneCode.substr(1, telephoneCode.length - 1);
    // 新增租户
    if (this.pageType === OperateTypeEnum.add) {
      this.$tenantApiService.addTenant(body).subscribe((res: Result) => {
        this.isLoading = false;
        if (res.code === ResultCodeEnum.success) {
          this.$router.navigate(['business/tenant/tenant-list']).then();
          this.$message.success(this.language.addTenantSuccess);
        } else {
          this.$message.error(this.language.addTenantError);
        }
      }, () => {
        this.isLoading = false;
      });
    } else {
      results.id = this.tenantId;
      // 修改租户
      this.$tenantApiService.updateTenant(body).subscribe((res: Result) => {
        this.isLoading = false;
        if (res.code === ResultCodeEnum.success) {
          this.$router.navigate(['business/tenant/tenant-list']).then();
          this.$message.success(this.language.successModifiedTenant);
        } else {
          this.$message.error(this.language.failedModifiedTenant);
        }
      }, () => {
        this.isLoading = false;
      });
    }
  }

  /**
   * 取消按钮，回列表
   */
  public cancel(): void {
    this.$router.navigate(['/business/tenant/tenant-list']).then();
  }


  /**
   * 初始化电话号码
   */
  public getPhoneInit(event: any): void {
    this.telephone = event;
  }


  /**
   * 获取电话号码国际码
   */
  public getPhone(event: PhoneSetModel): void {
    this.countryCode = event.dialCode;
  }


  /**
   * 监听手机号码输入状态
   */
  inputNumberChange(event) {
    this.phoneNumberMsg = '';
    const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    const _reg = /^\d+$/;
    const data = {
      id: this.tenantId,
      phoneNumber: event
    };
    if (this.telephoneInput && this.telephoneInput.telephoneCode === '+86') {
      if (reg.test(event)) {
        this.$tenantApiService.checkTenantPhone(data).subscribe((res: Result) => {
          if (res.code === ResultCodeEnum.success) {
            if (res.data) {
              this.formStatus.resetControlData('phoneNumber', event);
            } else {
              this.phoneNumberMsg = this.language.phoneNumberExistTips;
              this.formStatus.resetControlData('phoneNumber', null);
            }
          } else {
            this.formStatus.resetControlData('phoneNumber', null);
          }
        });
      } else {
        this.phoneNumberMsg = event && this.language.phoneNumberTips;
        this.formStatus.resetControlData('phoneNumber', null);
      }
    } else {
      if (_reg.test(event)) {
        this.formStatus.resetControlData('phoneNumber', event);
      } else {
        this.phoneNumberMsg = event && this.language.phoneNumberTips;
        this.formStatus.resetControlData('phoneNumber', null);
      }
    }
  }

}
