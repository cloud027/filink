/**
 * Created by wh1709040 on 2019/4/11.
 */
import {Pipe, PipeTransform} from '@angular/core';
import {SearchConfig} from '../model/table-config.model';

@Pipe({name: 'selectValue'})
export class SelectValuePipe implements PipeTransform {
  /**
   * 下拉多选框的值回显
   * param {any[]} value 已选择值 ['001']
   * param {any[]} param 原始值[{code: "001"label: "光交箱"}]
   */
  transform(value: any[], param: SearchConfig) {
    const selectedItems = param.selectInfo.filter(item => {
      if (value.includes(item[param.value || 'value'])) {
        return item;
      }
    });
    return selectedItems.map(item => item.label).join(',');
  }
}
