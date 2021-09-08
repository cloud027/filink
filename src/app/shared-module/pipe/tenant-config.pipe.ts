import {Pipe, PipeTransform} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../enum/language.enum';

@Pipe({
  name: 'tenantConfigTranslate'
})
export class TenantConfigPipe implements PipeTransform {

  language: any;

  constructor(private $nzI18n: NzI18nService) {
    this.language = $nzI18n.getLocaleData(LanguageEnum.tenant);
  }

  transform(value: any, args?: any): any {
    return this.language[value];
  }

}
