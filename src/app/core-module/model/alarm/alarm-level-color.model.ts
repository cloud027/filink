/**
 * 查询告警颜色
 */
import {AlarmLevelBackgroundColorModel} from './alarm-level-background-color.model';

export class AlarmLevelColorModel {
  /**
   * 告警颜色
   */
  public color: string;
  /**
   * 告警颜色名称
   */
  public label: string;
  /**
   * 告警颜色值
   */
  public value: string;
  /**
   * 告警背景色
   */
  public style: AlarmLevelBackgroundColorModel;
}
