import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {PasswordCheckModel} from '../../../../core-module/model/alarm/password-check.model';
import {UserLanguageInterface} from '../../../../../assets/i18n/user/user-language.interface';
import {IndexLanguageInterface} from '../../../../../assets/i18n/index/index.language.interface';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {UserForCommonService} from '../../../../core-module/api-service/user';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import CryptoJS from 'crypto-js';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {FormControl} from '@angular/forms';
/**
 * 强制修改密码页面
 */
@Component({
  selector: 'app-force-change-password',
  templateUrl: './force-change-password.component.html',
  styleUrls: ['./force-change-password.component.scss']
})
export class ForceChangePasswordComponent implements OnInit {
  // 密码校验对象
  @Input() passwordObj: PasswordCheckModel = new PasswordCheckModel();
  // 修改密码弹窗是否可见
  @Input() public isVisible: boolean = false;
  // 提示信息
  @Input() public tips: string = '';
  // 显示隐藏变化
  @Output() public isVisibleChange = new EventEmitter<boolean>();
  // 国际化
  public userLanguage: UserLanguageInterface;
  public indexLanguage: IndexLanguageInterface;
  // 表单操作
  public formStatus: FormOperate;
  // 表单项
  public formColumn: FormItem[] = [];
  // 控制提交按钮
  public isDisable: boolean;

  constructor(private $nzI18n: NzI18nService,
              private $userService: UserForCommonService,
              private $message: FiLinkModalService,
              private $router: Router,
              private $ruleUtil: RuleUtil) {
  }

  /**
   * 初始化
   */
  public ngOnInit(): void {
    this.userLanguage = this.$nzI18n.getLocaleData(LanguageEnum.user);
    this.indexLanguage = this.$nzI18n.getLocaleData(LanguageEnum.index);
    this.initForm();
  }

  /**
   * 初始化表单
   */
  public initForm(): void {
    this.formColumn = [
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
        rule: [
          {required: true},
          {minLength: this.passwordObj.minLength}
        ],
        asyncRules: [],
        customRules: [
          this.$ruleUtil.getNumberRule(this.passwordObj.containNumber),
          this.$ruleUtil.getLowerCaseRule(this.passwordObj.containLower),
          this.$ruleUtil.getUpperCaseRule(this.passwordObj.containUpper),
          this.$ruleUtil.getSpecialCharacterRule(this.passwordObj.containSpecialCharacter)
        ],
        col: 20
      },
      {
        // 确认密码
        label: this.userLanguage.confirmNewPassword,
        width: 300,
        key: 'confirmNewPassword',
        inputType: 'password',
        type: 'input',
        rule: [{required: true}],
        require: true,
        col: 20,
        asyncRules: [
          {
            asyncRule: (control: FormControl) => {
              return Observable.create(observer => {
                const data = this.formStatus.getData();
                if (control.value === data.newPassword) {
                  observer.next(null);
                  observer.complete().then();
                } else {
                  observer.next({error: true, duplicated: true});
                  observer.complete().then();
                }
              });
            },
            asyncCode: 'duplicated', msg: this.userLanguage.confirmPasswordAndNewPasswordAreInconsistent
          }
        ]
      },
    ];

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
   * 点击确定
   */
  public handleOk(): void {
    const passwordData = this.formStatus.getData();
    const sendData = {
      userId: SessionUtil.getUserId(),
      token: SessionUtil.getToken(),
      newPWD: CryptoJS.MD5(passwordData.newPassword).toString(),
      confirmPWD: CryptoJS.MD5(passwordData.confirmNewPassword).toString()
    };
    this.$userService.modifyPassword(sendData).subscribe((result: ResultModel<string>) => {
      if (result.code === 0) {
        this.$message.info(result.msg);
        if (localStorage.getItem('userInfo')) {
          const userInfo = JSON.parse(localStorage.getItem('userInfo'));
          const data = {
            userid: userInfo.id,
            token: SessionUtil.getToken()
          };
          this.$userService.logout(data).subscribe((res: ResultModel<any>) => {
          });
        }
        localStorage.clear();
        this.$router.navigate(['']).then();
      } else {
        this.$message.error(result.msg);
      }
    });
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
