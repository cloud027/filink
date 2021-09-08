import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {LoginService} from '../share/service/login.service';
import {ResultModel} from '../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../shared-module/enum/result-code.enum';
import {LoginInfoModel} from '../../../core-module/model/login/login-info.model';
import {LoginUtil} from '../share/util/login.util';
import {SessionUtil} from '../../../shared-module/util/session-util';
import * as lodash from 'lodash';

/**
 * 手机登录组件
 */
@Component({
  selector: 'app-phone-login',
  templateUrl: './phone-login.component.html',
  styleUrls: ['./phone-login.component.scss']
})
export class PhoneLoginComponent implements OnInit, OnDestroy {
  @Output() afterLoginChange = new EventEmitter<string>();
  // 验证码按钮禁用状态
  public bol = true;
  // 手机号码
  public telephone;
  // 表单操作
  public validateForm: FormGroup;
  // 登录是否禁用
  public loginLoading = true;
  // 国际化
  public language: any;
  // 登录状态loading
  public isLoginLoading = false;
  // 验证码
  public verificationCode;
  // 跳转路径
  private link = '/business/system/about';
  // license过期显示弹窗
  public isVisible: boolean = false;
  // 发送验证码定时器Id
  private saveCodeIntervalID;
  // 菜单数据备份
  public newMenuLsit = [];
  // 菜单数据
  public menuList = [];

  constructor(private fb: FormBuilder,
              private $loginService: LoginService,
              private $message: FiLinkModalService,
              private $router: Router,
              private $nzI18n: NzI18nService) {
    this.language = $nzI18n.getLocale();
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      authCode: [null, [Validators.required]],
    });
    this.verificationCode = this.language.login.getVerificationCode;
  }

  /**
   * 组件销毁时清除定时器
   */
  ngOnDestroy() {
    clearInterval(this.saveCodeIntervalID);
  }

  /**
   * 获取验证码
   */
  public getValidationCode(): void {
    const phone = {phoneNumber: this.telephone.getNumber().substring(3)};
    this.$loginService.getVerificationCode(phone).subscribe((result: ResultModel<string>) => {
      if (result.code === 0) {
        this.bol = true;
        let countDown = 120;
        this.verificationCode = this.language.login.sending + countDown + this.language.login.seconds;
        this.saveCodeIntervalID = setInterval(() => {
          // 倒计时
          countDown -= 1;
          this.verificationCode = this.language.login.sending + countDown + this.language.login.seconds;
          if (countDown === 0) {
            // 重新发送
            clearInterval(this.saveCodeIntervalID);
            this.verificationCode = this.language.login.retryObtain;
            this.bol = false;
          }
        }, 1000);
      } else {
        this.bol = false;
        this.$message.error(result.msg);
      }
    }, () => {
      this.bol = false;
    });
  }

  /**
   * 监听表单变化改变按钮状态
   */
  public getPhone(): void {
    if (this.telephone.isValidNumber()) {
      this.bol = false;
      this.loginLoading = false;
    } else {
      this.bol = true;
      this.loginLoading = true;
    }
  }

  /**
   * 获取手机号码
   */
  public getPhoneInit(event: any): void {
    this.telephone = event;
  }

  /**
   * 登录提交
   */
  public submit(): void {
    const loginDate = new FormData();
    loginDate.append('smsCode', this.validateForm.getRawValue().authCode);
    loginDate.append('phoneNumber', this.telephone.getNumber().substring(3));
    // 清理缓存
    localStorage.removeItem('userName');
    this.isLoginLoading = true;
    this.$loginService.phoneLogin(loginDate).subscribe((result: ResultModel<ResultModel<LoginInfoModel>>) => {
      this.isLoginLoading = false;
      if (result.code === 0) {
        if (result.data.code === 0) {
          if (result.data.data.showMenuTemplate) {
            LoginUtil.dealLoginInfo(result.data.data);
            // this.link = LoginUtil.findLink(result.data.data.showMenuTemplate.menuInfoTrees);
            this.getMenuInfo(result.data.data.showMenuTemplate.menuInfoTrees);
            if (this.menuList && this.menuList.length) {
              this.link = LoginUtil.findLink(this.menuList);
            }
            // 登录之后，将登录的信息保存到缓存后触发该事件
            this.afterLoginChange.emit(this.link);
          } else {
            this.$message.info(this.language.login.notMenuPermissions);
          }
        } else {
          if (result.data.code === ResultCodeEnum.configLoadingFail) {
            this.$message.error(this.language.common.loginErrorMsg);
          } else {
            this.$message.warning(result.data.msg);
          }
        }
      } else if (result.code === ResultCodeEnum.licenseIsExpired || result.data.code === ResultCodeEnum.licenseIsNull) {
        // 登录时若license过期或不存在，需要根据租户id上传有效的license文件
        if (result.data.data) {
          SessionUtil.setTenantIdAndUserName(result.data.data.tenantId, result.data.data.userName);
        }
        this.isVisible = true;
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.isLoginLoading = false;
    });
  }

  /**
   * 获取菜单缓存数据
   * param list
   */
  public getMenuInfo(list?) {
    let menuList = [];
    if (list) {
      menuList = list;
    } else {
      menuList = JSON.parse(localStorage.getItem('userInfo')).admin ? JSON.parse(localStorage.getItem('userInfo')).menuTemplateAndMenuInfoTree.menuInfoTrees
        || [] : JSON.parse(localStorage.getItem('userInfo')).tenantInfo || [];
    }
    this.newMenuLsit = menuList;
    this.menuDataRecursion(this.newMenuLsit);
    this.menuList = this.newMenuLsit;
  }


  /**
   * 菜单数据递归
   */
  menuDataRecursion(list) {
    this.deleteMenuData(list);
    list.forEach(item => {
      if (item.children && item.children.length) {
        this.menuDataRecursion(item.children);
      }
    });
  }

  /**
   * 删除
   * isShow === false，菜单不显示
   */
  public deleteMenuData(list) {
    lodash.remove(list, (item) => {
      if (item.isShow === '0') {
        return true;
      } else {
        return false;
      }
    });
  }


}
