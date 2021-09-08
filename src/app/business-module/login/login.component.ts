import {Component, OnInit, ViewChild} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../shared-module/service/filink-modal/filink-modal.service';
import {CommonUtil} from '../../shared-module/util/common-util';
import {LoginService} from './share/service/login.service';
import {SystemForCommonService} from '../../core-module/api-service/system-setting';
import {ResultModel} from '../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../shared-module/enum/result-code.enum';
import {Router} from '@angular/router';

/**
 * 首页登录组件
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // 弹出框底部
  @ViewChild('tplFooter') public tplFooter;
  // 是否是用户登入  切换登入方式
  public autoLoginType = true;
  // 手机登录标题提示
  public loginTitle: string;
  // 新增弹出框显示隐藏
  public isVisible = false;
  // 国际化
  public language: any = {};
  public title: string;
  // 文件名称
  public fileName: '';
  // 上传的文件
  public file: any;
  // xml文件校验
  public limit = {
    nameLength: 32,
    size: 1048576,
    nameI18n: '',
    sizeI18n: ''
  };
  // 登入提交加载
  public submitLoading = false;
  // 备案号，后续该数值从后台获取
  public recordNumber: string = '';

  constructor(
    private $systemParameterService: SystemForCommonService,
    public $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $loginService: LoginService,
    private $router: Router) {
    this.language = $nzI18n.getLocale();
  }

  ngOnInit(): void {
    this.title = this.language.agreement.uploadCertificate;
    this.loginTitle = this.language.agreement.mobilePhoneLoginHere;
    this.limit = {
      nameLength: 32,
      size: 1048576,
      nameI18n: this.language.agreement.fileNameLengthCannotBeGreaterThan32Bits,
      sizeI18n: this.language.agreement.fileSizeIsLessThan1M,
    };
    // 等系统设置的模型
    this.$systemParameterService.selectDisplaySettingsParamForPageCollection().subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        // 移除语言设置
        localStorage.removeItem('localLanguage');
        // 前端切换中英文 时间选择器会出问题先不使用setDateLocale
        if (result.data.systemLanguage === 'US') {
          this.$nzI18n.setLocale(CommonUtil.toggleNZi18n('en_US').language);
        } else {
          this.$nzI18n.setLocale(CommonUtil.toggleNZi18n('zh_CN').language);
        }
        localStorage.setItem('localLanguage', JSON.stringify(result.data.systemLanguage));
        // 平台设置
        localStorage.setItem('platformDisplaySettings', JSON.stringify(result.data));
      }
    });
    // 获取备案号
    this.$loginService.querySiteRecordNumber().subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.recordNumber = res.data;
      }
    });
    this.validateBrowserType();
  }

  /**
   * 登录完成之后获取显示设置信息和消息提示信息
   */
  public handleAfterLogin(linkUrl: string) {
    this.$systemParameterService.selectDisplaySettingsParamByTenant().subscribe(res => {
      if (res.code === ResultCodeEnum.success) {
        // 显示设置配置
        localStorage.setItem('displaySettings', JSON.stringify(res.data.displaySettings));
        // 消息提示设置
        localStorage.setItem('messageNotification', JSON.stringify(res.data.messageNotification));
        // 调转到相应的链接
        this.$router.navigate([linkUrl]).then();
      }
    });
  }

  /**
   * 手机 用户登录切换标题提示
   */
  public changeAutoLoginType(): void {
    this.autoLoginType = !this.autoLoginType;
    if (this.autoLoginType) {
      this.loginTitle = this.language.agreement.mobilePhoneLoginHere;
    } else {
      this.loginTitle = this.language.agreement.userLoginHere;
    }
  }

  /**
   * 跳转至工信部链接
   */
  public linkToGov(): void {
    window.location.href = 'https://beian.miit.gov.cn/';
  }

  /**
   * 浏览器版本的验证
   * 支持浏览器版本如下：
   * Chrome：60.x 及以上
   * Firefox：64及以上
   * Safari：11.0及以上
   */
  private validateBrowserType(): void {
    const info = this.getExplorerInfo();
    if (info.type === 'Firefox' && parseFloat(info.version) < parseFloat(info.lowVersion)) {
      this.tipBrowserLow(info);
    } else if (info.type === 'Chrome' && parseFloat(info.version) < parseFloat(info.lowVersion)) {
      this.tipBrowserLow(info);
    } else if (info.type === 'Safari' && parseFloat(info.version) < parseFloat(info.lowVersion)) {
      this.tipBrowserLow(info);
    } else if (info.type !== 'Safari' && info.type !== 'Chrome' && info.type !== 'Firefox') {
      this.$message.warning(this.language.agreement.ErrorExplorerInfo);
    }
  }

  /**
   * 浏览器版本低的提示框
   */
  private tipBrowserLow(info): void {
    const tip = this.language.agreement;
    this.$message.warning(`${tip.current}${info.type}${tip.low}${info.lowVersion}${tip.version}`);
  }

  /**
   * 获取浏览器版本的验证
   */
  private getExplorerInfo(): { type: string, version: string, lowVersion: string } {
    const explorer = window.navigator.userAgent.toLowerCase();
    if (explorer.indexOf('msie') >= 0) {
      const version = explorer.match(/msie ([\d.]+)/)[1];
      return {type: 'IE', version: version, lowVersion: ''};
    } else if (explorer.indexOf('firefox') >= 0) {
      const version = explorer.match(/firefox\/([\d.]+)/)[1];
      return {type: 'Firefox', version: version, lowVersion: '64'};
    } else if (explorer.indexOf('chrome') >= 0) {
      const version = explorer.match(/chrome\/([\d.]+)/)[1];
      return {type: 'Chrome', version: version, lowVersion: '60.x'};
    } else if (explorer.indexOf('safari') >= 0 && explorer.indexOf('chrome') < 0) {
      const version = explorer.match(/version\/([\d.]+)/)[1];
      return {type: 'Safari', version: version, lowVersion: '11.0'};
    }
  }
}
