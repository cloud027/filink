import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deviceType'
})
export class DeviceTypePipe implements PipeTransform {

  transform(value: any, deviceList?: Array<any>): any {
    if (value && deviceList) {
      const list = deviceList.filter(item => item.value === value);
      if (list.length > 0) {
        return list[0].label;
      } else {
        return null;
      }
    }
    return null;
  }

}
