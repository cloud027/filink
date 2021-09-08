import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {UserLanguageInterface} from '../../../../assets/i18n/user/user-language.interface';

/**
 * 手机号码输入组件
 */
@Component({
  selector: 'app-telephone-input',
  templateUrl: './telephone-input.component.html',
  styleUrls: ['./telephone-input.component.scss']
})
export class TelephoneInputComponent implements OnInit, AfterViewInit {
  // 国家代码
  @Input() countryCode = 'cn';
  // 是否验证
  @Input() shouldValid = false;
  // 错误提示消息
  @Input() hint = '';
  // 号码变化事件
  @Output() phoneChange = new EventEmitter();
  // 号码初始化事件
  @Output() telephoneInit = new EventEmitter();
  // 输入框变化事件
  @Output() inputNumberChange = new EventEmitter();
  // 号码前缀
  public telephoneCode = '+86';
  // 是否有效的
  public isValid: boolean = false;
  // 用户语言包
  public userLanguage: UserLanguageInterface;
  // 手机号码插件组件实例
  private telephone = null;

  constructor(public $nzI18n: NzI18nService) {
  }

  // 手机号码
  public _phoneNum = '';

  get phoneNum() {
    return this._phoneNum;
  }
  set phoneNum(val) {
    this.isValid = this.isValidNumber();
    this._phoneNum = val;
    this.inputNumberChange.emit(this._phoneNum);
  }

  ngOnInit() {
    this.userLanguage = this.$nzI18n.getLocaleData('user');
    this.hint = this.userLanguage.phoneNumberTips;
  }

  ngAfterViewInit(): void {
    const input = document.querySelector('#phone');
    this.telephone = window['intlTelInput'](input, {
      preferredCountries: ['cn'],
      utilsScript: 'intlTel-intlTel-utils.js',
    });
    input.addEventListener('countrychange', () => {
      this.telephoneCode = `+${this.telephone.getSelectedCountryData().dialCode}`;
    });
    input.addEventListener('input', (e) => {
      e.target['value'] = e.target['value'].replace(/[^\d]/g, '');
      this.phoneNum = e.target['value'];
    });
    this.telephone.setCountry(this.countryCode);
    this.telephoneInit.emit(this.telephone);
    this.inputNumberChange.emit(this._phoneNum);
  }

  /**
   * 号码检验
   */
  private isValidNumber(): boolean {
    if (this.telephone) {
      this.phoneChange.emit(this.telephone.getSelectedCountryData());
      if (this.telephone.getNumber()) {
        return !this.telephone.isValidNumber();
      }
    } else {
      return false;
    }
  }
}
