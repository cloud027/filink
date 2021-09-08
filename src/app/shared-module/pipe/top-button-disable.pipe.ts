import {Pipe, PipeTransform} from '@angular/core';
import {Operation} from '../model/table-config.model';
import {SessionUtil} from '../util/session-util';

@Pipe({
  name: 'topButtonDisable'
})
export class TopButtonDisablePipe implements PipeTransform {

  transform(button: Operation, allUnChecked?: boolean): boolean {
    // 判断按钮权限
    if (button.permissionCode) {
      // 有权限按正常的逻辑返回
      if (SessionUtil.checkHasRole(button.permissionCode)) {
        return button.canDisabled && allUnChecked;
      } else {
        return true;
      }
    } else {
      return button.canDisabled && allUnChecked;
    }
  }

}
