/**
 * 告警预警
 */
export class AlarmWarningModel {
  /**
   *  id
   */
  public id?: string;
  /**
   * 告警预警名称
   */
  public alarmWarningSettingName?: string;
  /**
   * 告警代码
   */
  public alarmWarningCode?: string;
  /**
   * 启用状态
   */
  public status?: number;
  /**
   * 越限次数
   * 1~~ 999
   */
  public limitNum?: number;
  /**
   * 越限时长
   * 1~~999分钟
   */
  public limitTime?: number;
  /**
   * 越限告警
   */
  public alarmCode?: string;
  /**
   * 名称集合
   */
  public alarmNameList?: string[];
  public alarmNames?: string;
  /**
   * id集合
   */
  public alarmOverList?: string[];
  /**
   * code集合
   */
  public alarmCodeList?: string[];
  /**
   * 禁启用状态
   */
  public isDisabled?: boolean = false;
  /**
   * 预警等级
   */
  public alarmWarningLevel?: string;
  /**
   * 等级名称
   */
  public alarmWarningLevelName?: string;
  /**
   * 等级颜色
   */
  public levelStyle?: string;
}
