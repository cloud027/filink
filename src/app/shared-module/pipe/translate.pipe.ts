import {Pipe, PipeTransform} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import * as _ from 'lodash';
import {CommonUtil} from '../util/common-util';
import {SelectModel} from '../model/select.model';


/**
 * 翻译管道
 */
@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {
  // 构造器
  constructor(private $nzI18n: NzI18nService) {
  }
  transform(value: any, codeEnum: any, prefix?: string): string {
    const list: SelectModel[] = CommonUtil.codeTranslate(
      codeEnum, this.$nzI18n, null, prefix) as SelectModel[];
    if (value && !_.isEmpty(list)) {
      const data = list.find(item => item.code === value);
      return data ? data.label : null;
    }
    return null;
  }
}
