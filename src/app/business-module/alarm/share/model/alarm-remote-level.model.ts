/**
 * 告警远程通知列表通用的
 */


export class AlarmRemoteLevelModel {
  /**
   * 远程通知id
   */
  public ruleId?: string;
  /**
   * 等级id
   */
  public alarmLevelId: string;
  /**
   * 默认等级样式
   */
  public defaultStyle?: string;
  /**
   * 等级样式
   */
  public style?: string;
  /**
   * 等级名称
   */
  public name?: string;
}
