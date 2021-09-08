import {Pipe, PipeTransform} from '@angular/core';
import {getDeptLevel} from '../../user.config';

@Pipe({
  name: 'deptLevel'
})
export class DeptLevelPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      return getDeptLevel(args, value);
    } else {
      return '';
    }
  }

}
