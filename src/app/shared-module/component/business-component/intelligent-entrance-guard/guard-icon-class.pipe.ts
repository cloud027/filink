import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'guardIconClass'
})
export class GuardIconClassPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return this[args](value);
  }

  signalIntensity(value) {
    const _value = parseInt(value, 10);
    if (_value === 0) {
      return 'icon-signal-intensity-0';
    } else if (_value > 0 && _value <= 20) {
      return 'icon-signal-intensity-20';
    } else if (_value > 20 && _value <= 40) {
      return 'icon-signal-intensity-40';
    } else if (_value > 40 && _value <= 60) {
      return 'icon-signal-intensity-60';
    } else if (_value > 60 && _value <= 80) {
      return 'icon-signal-intensity-80';
    } else if (_value > 80 && _value <= 100) {
      return 'icon-signal-intensity-100';
    } else {
      return 'icon-signal-intensity';
    }
  }

  electricQuantity(value) {
    const _value = parseInt(value, 10);
    let icon = '';
    if (_value === 0) {
      icon = 'icon-electric-quantity-0';
    } else if (_value > 0 && _value <= 20) {
      icon = 'icon-electric-quantity-20';
    } else if (_value > 20 && _value <= 40) {
      icon = 'icon-electric-quantity-40';
    } else if (_value > 40 && _value <= 60) {
      icon = 'icon-electric-quantity-60';
    } else if (_value > 60 && _value <= 80) {
      icon = 'icon-electric-quantity-80';
    } else if (_value > 80 && _value <= 100) {
      icon = 'icon-electric-quantity-100';
    } else {
      icon = 'icon-electric-quantity';
    }
    return icon;
  }
}
