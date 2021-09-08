import { Pipe, PipeTransform } from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';

@Pipe({
  name: 'navigationTranslate'
})
export class NavigationTranslatePipe implements PipeTransform {

  language: any;
  constructor(private $nzI18n: NzI18nService) {
    this.language = $nzI18n.getLocaleData('navigation');
  }
  transform(value: any, args?: any): any {
    return this.language[value];
  }

}
