import {NzI18nService} from 'ng-zorro-antd';
import {IndexLanguageInterface} from '../../../../assets/i18n/index/index.language.interface';
import {CommonLanguageInterface} from '../../../../assets/i18n/common/common.language.interface';
import {LanguageEnum} from '../../../shared-module/enum/language.enum';

/**
 * 首页设施的公共方法
 */
export class FacilityName {
  // 国际化
  indexLanguage: IndexLanguageInterface;
  commonLanguage: CommonLanguageInterface;

  constructor(public $nzI18n: NzI18nService) {
    this.indexLanguage = $nzI18n.getLocaleData(LanguageEnum.index);
    this.commonLanguage = $nzI18n.getLocaleData(LanguageEnum.common);
  }

}
