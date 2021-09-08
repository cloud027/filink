import {Injectable} from '@angular/core';
import {NzI18nService} from 'ng-zorro-antd';
import {CommonUtil} from '../../util/common-util';
import {DateTypeEnum} from '../../../business-module/facility/share/enum/timer.enum';
import {LanguageEnum} from '../../enum/language.enum';
import {TimeItemModel} from '../../../core-module/model/equipment/time-item.model';


@Injectable()
export class TimerSelectorService {
  public currentTime;
  public language;
  constructor(private $nzI18n: NzI18nService) {
    this.currentTime = CommonUtil.getCurrentTime();
  }

  /**
   * 获取本日日期范围
   */
  public getDayRange(): string[] {
    const now = this.currentTime;
    const date = [];
    date.push(CommonUtil.dateFmt('yyyy/MM/dd 00:00:00', now));
    date.push(CommonUtil.dateFmt('yyyy/MM/dd 23:59:59', now));
    return date;
  }

  /**
   * 获取本周日期范围
   */
  public getWeekRange(): string[] {
    const date = [];
    const now = this.currentTime;
    const w = now.getDay();
    date.push(CommonUtil.dateFmt('yyyy/MM/dd 00:00:00', new Date(CommonUtil.funDate(1 - w))));
    date.push(CommonUtil.dateFmt('yyyy/MM/dd 23:59:59', new Date(CommonUtil.funDate(7 - w))));
    return date;
  }

  /**
   * 获取本月日期范围
   */
  public getMonthRange(): string[] {
    const date = [];
    const now = this.currentTime;
    const d = this.isBigMonth(now.getMonth() + 1) ? 31 : 30;
    date.push(CommonUtil.dateFmt('yyyy/MM/01 00:00:00', now));
    date.push(CommonUtil.dateFmt(`yyyy/MM/${d} 23:59:59`, now));
    return date;
  }

  /**
   * 获取本年日期范围
   */
  public getYearRange(): string[] {
    const date = [];
    // 回去当前时间
    const now = this.currentTime;
    date.push(CommonUtil.dateFmt('yyyy/01/01 00:00:00', now));
    date.push(CommonUtil.dateFmt('yyyy/12/31 23:59:59', now));
    return date;
  }

  /**
   * 获取几天前的时间范围
   * 当前日期往前推多少天例如 2019/6/18 7 =》 2019/6/11 - /2019/6/17
   */
  public getDateRang(day: number): string[] {
    const date = [];
    date.push(CommonUtil.dateFmt('yyyy/MM/dd 00:00:00', new Date(CommonUtil.funDate(-day + 1))));
    date.push(CommonUtil.dateFmt('yyyy/MM/dd 23:59:59', new Date()));
    return date;
  }
  /**
   * 获取时间list
   */
  public getTimeList(): TimeItemModel[] {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    return [{
      label: this.language.oneWeek,
      value: DateTypeEnum.oneWeek
    }, {
      label: this.language.oneMonth,
      value: DateTypeEnum.oneMonth
    }, {
      label: this.language.threeMonth,
      value: DateTypeEnum.threeMonth
    }];
  }

  /**
   * 判断大小月
   * param month
   */
  private isBigMonth(month) {
    return [1, 3, 5, 7, 8, 10, 12].includes(Number.parseInt(month, 0));
  }
}
