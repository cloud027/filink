import {FilterCondition} from '../../../shared-module/model/query-condition.model';
import {OperatorEnum} from '../../../shared-module/enum/operator.enum';
import {CommonUtil} from '../../../shared-module/util/common-util';

export class ScheduleForCommonUtil {
  /**
   * 利用日期进行筛选时，获取当前所选日期
   * 第一个日期转换为00时00分00秒的时间戳，第二个日期转换为23时59分59秒的时间戳
   */
  public static handleRangeTimeFormat(event: FilterCondition[], time: string[]) {
    event.forEach(item => {
      if (time.includes(item.filterField)) {
        if (item.operator === OperatorEnum.gte) {
          item.filterValue = new Date(CommonUtil.dateFmt('yyyy/MM/dd 00:00:00', new Date(item.filterValue))).getTime();
        } else if (item.operator === OperatorEnum.lte) {
          item.filterValue = new Date(CommonUtil.dateFmt('yyyy/MM/dd 23:59:59', new Date(item.filterValue))).getTime();
        }
      }
    });
  }
}
