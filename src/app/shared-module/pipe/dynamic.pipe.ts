import {Pipe, PipeTransform} from '@angular/core';
import {CommonUtil} from '../util/common-util';
import {SessionUtil} from '../util/session-util';
import {DateFormatStringEnum, TimeType} from '../enum/date-format-string.enum';

@Pipe({name: 'dynamic'})
export class DynamicPipe implements PipeTransform {

  transform(value: string, modifier: string, param: any) {
    if (!modifier) {
      if (value === null) {
        return '';
      }
      return value;
    }
    return this[modifier](value, param);
  }


  date(value: any, param: any): any {
    const fmt = param || DateFormatStringEnum.dateTime;
    const displaySettings = SessionUtil.getDisplaySettings();
    if (value) {
      if (displaySettings && displaySettings.timeType === TimeType.LOCAL) {
        return CommonUtil.dateFmt(fmt, new Date(parseInt(value, 0)));
      } else {
        const localDate = new Date(parseInt(value, 0));
        const year = localDate.getUTCFullYear().toString().padStart(2, '0');
        const month = (localDate.getUTCMonth() + 1).toString().padStart(2, '0');
        const date = localDate.getUTCDate().toString().padStart(2, '0');
        const hours = localDate.getUTCHours().toString().padStart(2, '0');
        const minute = localDate.getUTCMinutes().toString().padStart(2, '0');
        const second = localDate.getUTCSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${date} ${hours}:${minute}:${second}`;
      }

    } else {
      return '';
    }
  }

  dateDay(value: any, param: any){
    const fmt = param || DateFormatStringEnum.date;
    const displaySettings = SessionUtil.getDisplaySettings();
    if (value) {
      if (displaySettings && displaySettings.timeType === TimeType.LOCAL) {
        return CommonUtil.dateFmt(fmt, new Date(parseInt(value, 0)));
      } else {
        const localDate = new Date(parseInt(value, 0));
        const year = localDate.getUTCFullYear().toString().padStart(2, '0');
        const month = (localDate.getUTCMonth() + 1).toString().padStart(2, '0');
        const date = localDate.getUTCDate().toString().padStart(2, '0');
        return `${year}-${month}-${date}`;
      }

    } else {
      return '';
    }
  }

  surplusData(value: any): number {
    const nowTime = new Date().getTime();
    if (value > nowTime) {
      const num = value - nowTime;
      return Math.ceil(num / 1000 / 60 / 60 / 24);
    } else {
      return 0;
    }
  }

  remark(value: any, param: any): any {
    if (value && value.includes('\n')) {
      return value.replace(/\n/g, '');
    } else {
      return value;
    }
  }
  menuDate(value: any, param: any) {
    const fmt = param || DateFormatStringEnum.dateTime;
    const displaySettings = SessionUtil.getDisplaySettings();
    if (value) {
      if (displaySettings && displaySettings.timeType === TimeType.LOCAL) {
        return CommonUtil.dateFmt(fmt, new Date(value));
      } else {
        const localDate = new Date(value);
        const year = localDate.getUTCFullYear().toString().padStart(2, '0');
        const month = (localDate.getUTCMonth() + 1).toString().padStart(2, '0');
        const date = localDate.getUTCDate().toString().padStart(2, '0');
        const hours = localDate.getUTCHours().toString().padStart(2, '0');
        const minute = localDate.getUTCMinutes().toString().padStart(2, '0');
        const second = localDate.getUTCSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${date} ${hours}:${minute}:${second}`;
      }
    } else {
      return '';
    }
  }
}
