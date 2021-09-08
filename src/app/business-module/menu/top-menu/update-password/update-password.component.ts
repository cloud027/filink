import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {NzI18nService} from 'ng-zorro-antd';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {Router} from '@angular/router';
import {UserLanguageInterface} from '../../../../../assets/i18n/user/user-language.interface';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import CryptoJS from 'crypto-js';
import {UserForCommonService} from '../../../../core-module/api-service/user';
import {IsInitialPasswordEnum} from '../../../../shared-module/enum/user.enum';
import {PasswordCheckModel} from '../../../../core-module/model/alarm/password-check.model';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {UpdatePasswordService} from '../../../../core-module/mission/update-password-service';
import {ADMIN_USER_ID} from '../../../../core-module/const/common.const';
import {SystemForCommonService} from '../../../../core-module/api-service/system-setting';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {KeySaltConst} from '../../../login/share/const/key-salt.const';

/**
 * 修改密码/强制修改密码
 */
@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {
  // 是否是强制修改密码
  @Input() public isForceChangePwd: boolean = false;
  // 提示信息
  @Input() public tips: string = '';
  // 修改密码弹窗是否可见
  @Input() public isVisible: boolean = false;
  // 点击取消事件
  @Output() public cancelEvent = new EventEmitter();
  // 显示隐藏变化
  @Output() public isVisibleChange = new EventEmitter<boolean>();
  // 表单实例
  public formStatus: FormOperate;
  // 表单配置
  public formColumn: FormItem[] = [];
  // 国际化
  public userLanguage: UserLanguageInterface;
  public indexLanguage: IndexLanguageInterface;
  // 控制提交按钮
  public isDisable: boolean;
  // 保存按钮加载中
  public isLoading: boolean = false;
  // 是否是重置密码弹框
  private isResetPwd: boolean = false;
  // 密码校验对象
  private passwordCheckObj: PasswordCheckModel = new PasswordCheckModel();

  constructor(
    private $nzI18n: NzI18nService,
    private $userService: UserForCommonService,
    private $message: FiLinkModalService,
    private $router: Router,
    private $ruleUtil: RuleUtil,
    private $updatePasswordService: UpdatePasswordService,
    private $systemParameterService: SystemForCommonService,
  ) {}

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.userLanguage = this.$nzI18n.getLocaleData(LanguageEnum.user);
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
    this.isResetPwd = this.isForceChangePwd && (JSON.parse(localStorage.getItem('userInfo')).isInitialPassword === IsInitialPasswordEnum.initialPassword);
    // 超级管理员登录不需要获取密码安全策略，不校验密码规则
    if (SessionUtil.getUserId() !== ADMIN_USER_ID) {
      this.queryPasswordSecurity();
    } else {
      this.passwordCheckObj = new PasswordCheckModel(0, '0', '0', '0', '0');
      this.initForm();
    }
  }

  /**
   * 查询密码安全策略
   */
  queryPasswordSecurity() {
    this.$systemParameterService.queryPasswordSecurity().subscribe((res: ResultModel<PasswordCheckModel>) => {
      if (res.code === ResultCodeEnum.success) {
        this.passwordCheckObj = res.data;
        this.initForm();
      }
    });
  }

  /**
   * 初始化表单
   */
  public initForm(): void {
    const column = [
      {
        // 新密码
        label: this.userLanguage.newPassword,
        key: 'newPassword',
        type: 'input',
        width: 300,
        inputType: 'password',
        modelChange: () => {
          this.formStatus.group.controls['confirmNewPassword'].reset(null);
        },
        require: true,
        rule: [],
        asyncRules: [],
        customRules: [
          this.$ruleUtil.getNumberRule(this.passwordCheckObj.containNumber),
          this.$ruleUtil.getLowerCaseRule(this.passwordCheckObj.containLower),
          this.$ruleUtil.getUpperCaseRule(this.passwordCheckObj.containUpper),
          this.$ruleUtil.getSpecialCharacterRule(this.passwordCheckObj.containSpecialCharacter)
        ],
        col: 20
      },
      {
        // 确认密码
        label: this.userLanguage.confirmPassword,
        width: 300,
        require: true,
        key: 'confirmNewPassword',
        inputType: 'password',
        type: 'input',
        rule: [{required: true}],
        col: 20,
        asyncRules: [
          {
            asyncRule: (control: FormControl) => {
              return Observable.create(observer => {
                const data = this.formStatus.getData();
                if (control.value === data.newPassword) {
                  observer.next(null);
                  observer.complete();
                } else {
                  observer.next({error: true, duplicated: true});
                  observer.complete();
                }
              });
            },
            asyncCode: 'duplicated', msg: this.userLanguage.confirmPasswordAndNewPasswordAreInconsistent
          }
        ]
      },
    ];
    column.forEach(item => {
      if (item.key === 'newPassword') {
        if (this.passwordCheckObj.minLength !== 0) {
          item.rule = [{required: true}, {minLength: this.passwordCheckObj.minLength}];
        } else {
          item.rule = [{required: true}];
        }
      }
    });
    // 当不是重置密码时，弹窗表单添加原始密码表单项
    if (!this.isResetPwd) {
      column.unshift({
        // 原始密码
        label: this.userLanguage.password,
        key: 'password',
        width: 300,
        type: 'input',
        inputType: 'password',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        col: 20,
      });
    }
    this.formColumn = column;
  }

  /**
   * 通用表单方法
   * param event
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isDisable = this.formStatus.getValid();
    });
  }

  /**
   * 确定
   */
  public handleOk(): void {
    this.isLoading = true;
    const data = this.formStatus.getData();
    const sendData = {
      userId: SessionUtil.getUserId(),
      token: SessionUtil.getToken(),
      newPWD: CryptoJS.SHA1(`${data.newPassword}${KeySaltConst}`).toString(),
      confirmPWD: CryptoJS.SHA1(`${data.confirmNewPassword}${KeySaltConst}`).toString()
    };
    // 如果不是重置密码弹窗，sendData中添加原始密码表单值
    if (!this.isResetPwd) {
      sendData['oldPWD'] = CryptoJS.SHA1(`${data.password}${KeySaltConst}`).toString();
    } else {
      sendData['ignoreOldPwd'] = '1';
    }
    this.$userService.modifyPassword(sendData).subscribe((result: ResultModel<string>) => {
      this.isLoading = false;
      if (result.code === 0) {
        this.$message.info(result.msg);
        if (localStorage.getItem('userInfo')) {
          const userInfo = JSON.parse(localStorage.getItem('userInfo'));
          const data_ = {
            userid: userInfo.id,
            token: SessionUtil.getToken()
          };
          this.$userService.logout(data_).subscribe(() => {
          });
        }
        localStorage.clear();
        this.$router.navigate(['']).then();
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.isLoading = false;
    });
  }

  /**
   * 取消
   */
  public handleCancel(): void {
    this.isVisible = false;
    this.isVisibleChange.emit(this.isVisible);
    // 重置表单值为空
    this.formStatus.resetData('');
  }

  /**
   * 显示隐藏状态改变
   * param event
   */
  public nzVisibleChange(event: boolean): void {
    this.isVisible = event;
    this.isVisibleChange.emit(this.isVisible);
  }
}
