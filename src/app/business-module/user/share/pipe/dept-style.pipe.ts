import {Pipe, PipeTransform} from '@angular/core';
import {DeptLevel} from '../../user.config';

@Pipe({
  name: 'deptStyle'
})
export class DeptStylePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let style;
    switch (value) {
      case DeptLevel.deptLevelOne:
        style = 'level-one';
        break;
      case  DeptLevel.deptLevelTwo:
        style = 'level-two';
        break;
      case  DeptLevel.deptLevelThree:
        style = 'level-three';
        break;
      case  DeptLevel.deptLevelFour:
        style = 'level-four';
        break;
      case  DeptLevel.deptLevelFive:
        style = 'level-five';
        break;
    }
    return style;
  }

}
