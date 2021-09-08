import {Component, Input, OnInit} from '@angular/core';
import {LanguageEnum} from '../../../enum/language.enum';
import {ApplicationInterface} from '../../../../../assets/i18n/application/application.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {FiLinkModalService} from '../../../service/filink-modal/filink-modal.service';
import {OnlineLanguageInterface} from '../../../../../assets/i18n/online/online-language.interface';

@Component({
  selector: 'app-audio-preview',
  templateUrl: './audio-preview.component.html',
  styleUrls: ['./audio-preview.component.scss']
})
export class AudioPreviewComponent implements OnInit {
  @Input() public src: string;
  @Input() public programFileType: string;
  // 设备列表多语言
  public languageTable: ApplicationInterface;
  public commonLanguage: CommonLanguageInterface;
  // 多语言配置
  public language: OnlineLanguageInterface;
  public isIe: boolean = false;
  constructor(public $nzI18n: NzI18nService, private $message: FiLinkModalService) {
    // 多语言
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.online);
  }

  ngOnInit() {
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.getAgent();
  }
  getAgent() {
    const userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
    if (
      (userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0')) ||
      (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1)) {
        this.isIe = true;
    } else {
      this.isIe = false ;
    }
  }
}
