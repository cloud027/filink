import {Pipe, PipeTransform} from '@angular/core';
import {AreaLevelEnum} from '../../../../core-module/enum/area/area.enum';

@Pipe({
  name: 'areaStyle'
})
export class AreaStylePipe implements PipeTransform {

  transform(value: AreaLevelEnum): string {
    let style;
    switch (value) {
      case AreaLevelEnum.areaLevelOne:
        style = 'level-one';
        break;
      case AreaLevelEnum.areaLevelTwo:
        style = 'level-two';
        break;
      case AreaLevelEnum.areaLevelThree:
        style = 'level-three';
        break;
      case AreaLevelEnum.areaLevelFour:
        style = 'level-four';
        break;
      case AreaLevelEnum.areaLevelFive:
        style = 'level-five';
        break;
    }
    return style;
  }

}
