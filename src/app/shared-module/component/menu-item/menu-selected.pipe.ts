import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'menuSelected'
})
export class MenuSelectedPipe implements PipeTransform {

  transform(value: any, menuItem: any, isCollapsed: any): any {
    let isSelectedLevelFirst = false;
    if (menuItem.menuLevel === 1) {
      if (isCollapsed || !(menuItem.children && menuItem.children.length)) {
        isSelectedLevelFirst = value;
      }
    } else {
      isSelectedLevelFirst = value;
    }
    return isSelectedLevelFirst;
  }

}
