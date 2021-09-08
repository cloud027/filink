import { AlarmLevelEnum } from '../../enum/alarm/alarm-level.enum';
import { AlarmTypeEnum } from '../../enum/equipment/equipment.enum';
import {AlarmIsConfirmEnum} from '../../../business-module/alarm/share/enum/alarm.enum';

/**
 * Created by wh1910108 on 2020/6/10.
 */
export class AlarmNameListModel {
  /**
  * 自动确认
   */
  public alarmAutomaticConfirmation: AlarmIsConfirmEnum;
  /**
   * 告警类别
   */
  public alarmClassification: string;
  /**
   * 告警码
   */
  public alarmCode: string;
  /**
   * 默认级别
   */
  public alarmDefaultLevel: AlarmLevelEnum;
  /**
   * 描述
   */
  public alarmDesc: string;
  /**
   * 级别
   */
  public alarmLevel: AlarmLevelEnum;
  /**
   * 名称
   */
  public alarmName: string;
  /**
   * 类型
   */
  public alarmType: AlarmTypeEnum;
  /**
   * 告警id
   */
  public id: string;
  /**
   * 默认样式
   */
  public defaultStyle: string;
  /**
   * 样式
   */
  public style: string;
  /**
   * 告警名称
   */
  public alarmTypeName: string;
  /**
   * 告警级别名称
   */
  public alarmLevelName: string;
  /**
   * 告警级别
   */
  public alarmFixedLevel: AlarmLevelEnum;
  /**
   * 是否自动转派
   */
  public isOrder: string;
  /**
   * 判断该条告警名称是否被使用
   */
  public checked?: boolean;
}
