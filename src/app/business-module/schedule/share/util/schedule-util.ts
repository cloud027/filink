import {FilterCondition} from '../../../../shared-module/model/query-condition.model';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {CommonUtil} from '../../../../shared-module/util/common-util';

export class ScheduleUtil {
  /**
   * 获取当前日期最后一秒的时间戳
   * @param time 时间戳
   */
  public static getCountEndTime(time: number) {
    let year = new Date(time).getFullYear();
    let month = new Date(time).getMonth() + 1;
    let day = new Date(time).getDate();
    let month_str = month >= 10 ? month.toString() : '0' + month;
    let day_str = day >= 10 ? day.toString() : '0' + day;
    let str = year + '/' + month_str + '/' + day_str + ' ' + '23:59:59';
    return new Date(str).getTime();
  }
}
