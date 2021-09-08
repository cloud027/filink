import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inputNumber'
})
export class InputNumberPipe implements PipeTransform {

  transform(value: string, l: number): string {
    value = value.replace(/[^\d]/g,'');
    if(value.length > 5)
      return  value.slice(0,5)
    return value;
  }

}
