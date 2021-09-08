import {Pipe, PipeTransform} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {execType} from '../util/application.util';


/**
 * 翻译管道
 */
@Pipe({
  name: 'execTypeTranslate'
})
export class PolicyPipe implements PipeTransform {
  // 构造器
  constructor(private $nzI18n: NzI18nService) {
  }

  transform(value: string) {
    if (!value) {
      return '';
    }
    return execType(this.$nzI18n, value);
  }
}
