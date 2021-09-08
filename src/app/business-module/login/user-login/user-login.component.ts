import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {AsyncValidatorFn, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import {CodeValidator} from 'code-validator';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {Observable} from 'rxjs';
import {NzI18nService} from 'ng-zorro-antd';
import {SessionUtil} from '../../../shared-module/util/session-util';
import CryptoJS from 'crypto-js';
import {LoginService} from '../share/service/login.service';
import {ResultModel} from '../../../shared-module/model/result.model';
import {LoginInfoModel} from '../../../core-module/model/login/login-info.model';
import {ResultCodeEnum} from '../../../shared-module/enum/result-code.enum';
import {LoginUtil} from '../share/util/login.util';
import * as lodash from 'lodash';
import {KeySaltConst} from '../share/const/key-salt.const';

/**
 * 用户登录组件
 */
@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() afterLoginChange = new EventEmitter<string>();
  // 安全路径
  public base64: SafeUrl;
  // 验证码
  public value: string;
  // 表单操作
  public validateForm: FormGroup;
  // 登入loading
  public loginLoading = false;
  // 国际化
  public language: any;
  // license过期显示弹窗
  public isVisible: boolean = false;
  // 验证码参数
  private cv = new CodeValidator({
    width: 95,
    height: 35,
    length: 4
  });
  // 路由跳转链接
  private link = '/business/system/about';
  // 用户定时监控
  private loginTimer: number = null;
  // 菜单数据备份
  public newMenuLsit = [];
  // 菜单数据
  public menuList = [];

  constructor(private fb: FormBuilder,
              private $message: FiLinkModalService,
              private $cookieService: CookieService,
              private $loginService: LoginService,
              private $sanitizer: DomSanitizer,
              private $nzI18n: NzI18nService,
              private router: Router) {
    this.language = $nzI18n.getLocale();
    this.initFormData();
  }

  ngOnInit() {
    // 如果token存在  则直接进入首页
    if (SessionUtil.getToken()) {
      this.getMenuInfo();
      if (this.menuList && this.menuList.length) {
        this.link = LoginUtil.findLink(this.menuList);
      }
      this.router.navigate([this.link]).then();
      return;
    } else {
      this.random();
    }
  }

  /**
   * 判断用户是否可以登录
   */
  ngAfterViewInit(): void {
    this.random();
    this.loginTimer = window.setInterval(() => {
      // 如果token存在  则直接进入首页
      if (SessionUtil.getToken() && localStorage.getItem('displaySettings')) {
        this.getMenuInfo();
        if (this.menuList && this.menuList.length) {
          this.link = LoginUtil.findLink(this.menuList);
        }
        clearInterval(this.loginTimer);
        this.loginTimer = null;
        this.router.navigate([this.link]).then();
        return;
      }
    }, 1000);
  }

  /**
   * 切换验证码
   */
  public random(): void {
    const res = this.cv.random();
    this.base64 = this.$sanitizer.bypassSecurityTrustUrl(res.base);
    this.value = res.value;
  }

  /**
   * 失去焦点初始化  防止按钮被挤下去
   */
  public initHint(type: string): void {
    this.validateForm = this.fb.group({
      userName: [this.validateForm.getRawValue().userName, [Validators.required]],
      password: [this.validateForm.getRawValue().password, [Validators.required]],
      authCode: [this.validateForm.getRawValue().authCode, [Validators.required], this.createCodeAsyncRules()],
      remember: [this.validateForm.getRawValue().remember]
    });
    if (type === 'authCode') {
      this.validateForm.controls['authCode'].markAsDirty();
    }
  }

  /**
   * 登入提交
   */
  public submit(): void {
    // 解决登入无client信息问题
    localStorage.removeItem('token');
    const loginDate = new FormData();
    loginDate.append('username', this.validateForm.getRawValue().userName);
    // sha1加盐加密
    const password = CryptoJS.SHA1(`${this.validateForm.getRawValue().password}${KeySaltConst}`).toString();
    // 对密码加密

    // md5加密
    // const password = CryptoJS.MD5(this.validateForm.getRawValue().password).toString();
    loginDate.append('password', password);
    // 清理缓存
    localStorage.removeItem('userName');
    this.loginLoading = true;
    this.$loginService.login(loginDate).subscribe((result: ResultModel<ResultModel<LoginInfoModel>>) => {
      this.loginLoading = false;
      if (result.code === 0) {
        if (result.data.code === 0) {
          this.remember();
          LoginUtil.dealLoginInfo(result.data.data);
          if (result.data.data.showMenuTemplate) {
            this.getMenuInfo(result.data.data.showMenuTemplate.menuInfoTrees);
          }
          if (this.menuList && this.menuList.length) {
            this.link = LoginUtil.findLink(this.menuList);
          }
          // 登录之后，将登录的信息保存到缓存后触发该事件
          this.afterLoginChange.emit(this.link);
        } else if (result.data.code === ResultCodeEnum.licenseIsExpired || result.data.code === ResultCodeEnum.licenseIsNull) {
          // 登录时若license过期或不存在，需要根据租户id上传有效的license文件
          if (result.data.data) {
            SessionUtil.setTenantIdAndUserName(result.data.data.tenantId, result.data.data.userName);
          }
          this.isVisible = true;
        } else {
          this.initFormData(this.validateForm.getRawValue().userName, this.validateForm.getRawValue().password);
          this.random();
          if (result.data.code === ResultCodeEnum.configLoadingFail) {
            this.$message.error(this.language.common.loginErrorMsg);
          } else {
            this.$message.warning(result.data.msg);
          }
        }
      } else {
        this.initFormData(this.validateForm.getRawValue().userName, this.validateForm.getRawValue().password);
        this.$message.error(result.msg);
        this.random();
      }
    }, () => {
      this.loginLoading = false;
      this.random();
    });
  }

  /**
   * 判断是否记住密码
   */
  public remember(): void {
    if (this.validateForm.getRawValue().remember) {
      const userName = this.validateForm.getRawValue().userName;
      const password = this.validateForm.getRawValue().password;
      this.$cookieService.set('filink-user', CryptoJS.AES.encrypt(userName, 'filink-user').toString());
      this.$cookieService.set('filink-password', CryptoJS.AES.encrypt(password, 'filink-password').toString());
    } else {
      this.$cookieService.delete('filink-user');
      this.$cookieService.delete('filink-password');
    }
  }

  /**
   * 组件销毁时清除定时器
   */
  ngOnDestroy() {
    window.clearInterval(this.loginTimer);
    this.loginTimer = null;
  }

  /**
   * 初始化表单数据
   */
  private initFormData(userName?, password?): void {
    if (userName || password) {
      // this.random();
    } else {
      userName = null;
      password = null;
      // 判断是否有记住密码
      if (this.$cookieService.get('filink-user') && this.$cookieService.get('filink-password')) {
        // 前端用户名解密 后续考虑抽成单独方法
        const userNameBytes = CryptoJS.AES.decrypt(this.$cookieService.get('filink-user'), 'filink-user');
        const passwordBytes = CryptoJS.AES.decrypt(this.$cookieService.get('filink-password'), 'filink-password');
        userName = userNameBytes.toString(CryptoJS.enc.Utf8);
        password = passwordBytes.toString(CryptoJS.enc.Utf8);
      }
    }
    this.validateForm = this.fb.group({
      userName: [userName, [Validators.required]],
      password: [password, [Validators.required]],
      authCode: ['', [Validators.required], this.createCodeAsyncRules()],
      remember: [true]
    });
  }

  /**
   * 验证码异步效验
   */
  private createCodeAsyncRules(): AsyncValidatorFn[] {
    const asyncRules = [];
    asyncRules.push((control: FormControl) => {
      return Observable.create(observer => {
        if (control.value.toLocaleUpperCase() === this.value) {
          observer.next(null);
          observer.complete();
        } else {
          observer.next({error: true, duplicated: true});
          observer.complete();
        }
      });
    });
    return asyncRules;
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
