import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {TenantLanguageInterface} from '../../../../assets/i18n/tenant/tenant.language.interface';
import {OperateTypeEnum} from '../../../shared-module/enum/page-operate-type.enum';
import {FormItem} from '../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../shared-module/component/form/form-operate.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {RuleUtil} from '../../../shared-module/util/rule-util';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import {LanguageEnum} from '../../../shared-module/enum/language.enum';
import {QueryConditionModel} from '../../../shared-module/model/query-condition.model';
import {ResultModel} from '../../../shared-module/model/result.model';
import {PhoneSetModel} from '../../../core-module/model/user/phone-set.model';
import {ResultCodeEnum} from '../../../shared-module/enum/result-code.enum';
import {LoginTypeEnum} from '../../user/share/enum/login-type.enum';
import {Result} from '../../../shared-module/entity/result';
import {TenantApiService} from '../share/sevice/tenant-api.service';
import {UserLanguageInterface} from '../../../../assets/i18n/user/user-language.interface';
import {TelephoneInputComponent} from '../../../shared-module/component/telephone-input/telephone-input.component';
import {PushTypeEnum} from '../../../shared-module/enum/user.enum';
import {CheckboxModel} from '../../../shared-module/model/checkbox-model';
import {UserListModel} from '../../../core-module/model/user/user-list.model';
import {CommonLanguageInterface} from '../../../../assets/i18n/common/common.language.interface';

@Component({
  selector: 'app-admin-config',
  templateUrl: './admin-config.component.html',
  styleUrls: ['./admin-config.component.scss']
})
export class AdminConfigComponent implements OnInit, AfterViewInit {

  // 新增手机号模板
  @ViewChild('telephoneTemp') private telephoneTemp;
  // 手机号输入框
  @ViewChild('telephoneInput') private telephoneInput: TelephoneInputComponent;


  // 国际化
  public language: TenantLanguageInterface;
  // 国际化
  public userLanguage: UserLanguageInterface;
  // 公共语言包
  public commonLanguage: CommonLanguageInterface;
  // 查询参数对象集
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 页面title
  public pageTitle: string = '';
  // 页面类型
  public pageType = OperateTypeEnum.add;
  // 页面表单
  public formColumn: FormItem[] = [];
  // 表单实例
  public formStatus: FormOperate;
  // 提交按钮loading
  public isLoading: boolean = false;
  // 手机号校验
  public phoneNumberMsg: string = '';
  // 手机号国际码
  private countryCode: string = '86';
  // 手机号
  public telephone;
  // 租户ID
  public tenantId: string = '';
  // 管理员ID
  public adminId: string = '';
  // 最大用户数
  private maxUsers: number;
  // 用户模式
  private loginType: string;
  // 手机号数据
  public phoneValue: string = '';
  // 推送方式选择项
  public pushTypeCheckbox: CheckboxModel[] = [];
  // 租户数据
  public tenantData: UserListModel;
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


  public ngOnInit(): void {
    // 国际化
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.tenant);
    this.userLanguage = this.$nzI18n.getLocaleData(LanguageEnum.user);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // 推送方式下拉数据
    this.pushTypeCheckbox = [
      {label: this.language.mail, value: PushTypeEnum.mail, checked: false},
      {label: this.language.note, value: PushTypeEnum.note, checked: false},
      {label: 'app', value: PushTypeEnum.app, checked: false},
      {label: 'web', value: PushTypeEnum.web, checked: false},
    ];
    // 判断页面类型
    this.$active.queryParams.subscribe(params => {
      // 获取租户id
      if (params.id) {
        this.tenantId = params.id;
      }
      // 获取页面类型
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
   * 页面加载完成后
   */
  public ngAfterViewInit(): void {
  }


  /**
   * 判断页面类型
   */
  public getPageTitle(type: string): string {
    let title;
    // 根据页面类型显示页面标题
    switch (type) {
      case OperateTypeEnum.add:
        title = this.language.addTenantAdmin;
        break;
      case OperateTypeEnum.update:
        title = this.language.tenantAdminConfig;
        break;
    }
    return title;
  }


  /**
   * 表单回显
   */
  public pageSwitching(): void {
    const body = {
      id: this.tenantId
    };
    this.$tenantApiService.queryAdminById(body).subscribe((result: ResultModel<UserListModel>) => {
      if (result.code === ResultCodeEnum.success) {
        console.log(111);
        this.tenantData = result.data;
        // 推送方式
        if (result.data.pushType) {
          const pushType = (result.data.pushType as string).split(',');
          this.pushTypeCheckbox.forEach(item => {
            if (pushType.includes(item.value)) {
              item.checked = true;
            } else {
              item.checked = false;
            }
          });
        }
        result.data.pushType = this.pushTypeCheckbox;
        // 获取用户id
        this.adminId = result.data.id;
        // 手机号
        this.phoneValue = result.data.phoneNumber;
        // 国际码
        if (result.data.countryCode) {
          this.telephoneInput.telephoneCode = `+${result.data.countryCode}`;
        }
        // 电话号码
        this.telephoneInput._phoneNum = result.data.phoneNumber;
        // 表单回填
        this.formStatus.resetData(result.data);
        // 如果是数据库插入的租户，则标记为已改变，重新开启效验
        if (this.pageType === OperateTypeEnum.add) {
          this.formStatus.group.controls['email'].markAsDirty();
          this.formStatus.group.updateValueAndValidity();
        }
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * 获取表单实例
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    // 确定按钮disabled判断
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
        // 账号
        label: this.language.userCode,
        key: 'userCode',
        type: 'input',
        disabled: true,
        require: true,
        rule: []
      },
      {
        // 租户名称
        label: this.language.tenantName,
        key: 'userName',
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
        // 地址
        label: this.language.address,
        key: 'address',
        type: 'input',
        require: false,
        rule: [{maxLength: 64}],
        asyncRules: []
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
            {
              id: this.tenantId,
              phoneNumber: value
            }
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
          this.$ruleUtil.getMailRule()],
        // 异步校验规则
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$tenantApiService.checkTenantEmail(
            {
              id: this.tenantId,
              email: value
            }
            ),
            res => {
              if (res.code === ResultCodeEnum.success) {
                if (res.data === true) {
                  return true;
                } else {
                  return false;
                }
              } else {
                return false;
              }
            }, this.commonLanguage.emailExists)
        ]
      },
      {
        // 推送方式
        label: this.language.pushType,
        key: 'pushType',
        type: 'checkbox',
        require: false,
        rule: [],
        asyncRules: [],
        initialValue: this.pushTypeCheckbox
      },
      {
        // 用户模式
        label: this.language.loginType,
        key: 'loginType',
        type: 'radio',
        require: true,
        rule: [{required: true}],
        initialValue: '1',
        radioInfo: {
          data: [
            // 单用户
            {label: this.language.singleUser, value: LoginTypeEnum.singleUser},
            // 多用户
            {label: this.language.multiUser, value: LoginTypeEnum.multiUser},
          ],
          label: 'label',
          value: 'value'
        },
        modelChange: (controls, event, key, formOperate) => {
          this.loginType = event;
          if (event === '1') {
            this.formStatus.group.controls['maxUsers'].disable();
            this.formStatus.resetControlData('maxUsers', 1);
            this.maxUsers = 1;
          } else {
            this.formStatus.group.controls['maxUsers'].enable();
            this.formStatus.resetControlData('maxUsers', 100);
          }
        }
      },
      {
        // 最多用户数
        label: this.language.maxUsers,
        key: 'maxUsers',
        type: 'input',
        require: false,
        initialValue: 1,
        rule: [
          {pattern: /^([2-9]|[1-9]\d|2|100)$/, msg: this.userLanguage.maxUsersTips},
        ],
        asyncRules: []
      },
      {
        // 备注
        label: this.language.remark,
        key: 'userDesc',
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
    // 加载loading
    this.isLoading = true;
    // 获取表单数据
    let results = this.formStatus.getData();
    // 推送方式处理
    results = this.pushTypeData(results);
    // 获取用户id
    results.id = this.adminId;
    // 用户模式设置
    if (this.loginType === LoginTypeEnum.singleUser) {
      results.maxUsers = this.maxUsers;
    }
    // 手机号码设置
    const telephoneCode = this.telephoneInput.telephoneCode;
    // 电话号码国际码
    results.countryCode = telephoneCode.substr(1, telephoneCode.length - 1);
    // 接口入参
    const body = Object.assign(this.tenantData, results);
    // 新增租户管理员
    if (this.pageType === OperateTypeEnum.add) {
      this.$tenantApiService.TenantAdminAdd(body).subscribe((res: Result) => {
        this.isLoading = false;
        if (res.code === ResultCodeEnum.success) {
          this.$router.navigate(['business/tenant/tenant-list']).then();
          this.$message.success(this.language.addTenantAdminMsg);
        } else {
          this.$message.error(this.language.addTenantAdminFailedMsg);
        }
      }, () => {
        this.isLoading = false;
      });
    } else {
      // 修改管理员配置
      this.$tenantApiService.TenantAdminUpdate(body).subscribe((res: Result) => {
        this.isLoading = false;
        if (res.code === ResultCodeEnum.success) {
          // 跳转回租户列表
          this.$router.navigate(['business/tenant/tenant-list']).then();
          // 成功提示
          this.$message.success(this.language.tenantAdminConfigMsg);
        } else {
          // 报错提示
          this.$message.error(this.language.tenantAdminConfigFailedMsg);
        }
      }, () => {
        this.isLoading = false;
      });
    }
  }


  /**
   * 推送方式处理
   */
  public pushTypeData(obj): object {
    // 处理推送方式字段的数据
    if (this.formStatus.getData('pushType').length) {
      const pushType = [];
      this.formStatus.getData('pushType').forEach(item => {
        if (item.checked) {
          pushType.push(item.value);
        }
      });
      obj.pushType = pushType.join(',');
    }
    return obj;
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
  public inputNumberChange(event): void {
    this.phoneNumberMsg = '';
    const reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    const _reg = /^\d+$/;
    const data = {
      id: this.tenantId,
      phoneNumber: event
    };
    // 电话号正则效验
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
