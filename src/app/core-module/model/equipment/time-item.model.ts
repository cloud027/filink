/**
 *  时间类型选择模型
 */
import {DateTypeEnum} from '../../../shared-module/enum/date-type.enum';

export class TimeItemModel {
  /**
   *  时间标签
   */
  public label: string;
  /**
   * 时间值
   */
  public value: DateTypeEnum;
}
