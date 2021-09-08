import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'multipleValue'
})
export class MultipleValuePipe implements PipeTransform {
  /**
   * 下拉多选框的值回显
   * param {any[]} value 已选择值 ['001']
   * param {any[]} param 原始值[{code: "001"label: "光交箱"}]
   */
  transform(value: any[], deviceList: Array<any>) {
      const selectedItems = deviceList.filter(item => {
        if (value.includes(item['code'])) {
          return item;
        }
      });
      return selectedItems.map(item => item.label).join(',');

  }
}
