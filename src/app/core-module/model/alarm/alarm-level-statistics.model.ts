/**
 * 告警等级统计实体
 */
export class AlarmLevelStatisticsModel {
  /**
   * 提示告警数量
   */
  public hintAlarmCount: number = 0;

  /**
   * 主要告警数量
   */
  public mainAlarmCount: number = 0;

  /**
   * 次要告警数量
   */
  public minorAlarmCount: number = 0 ;

  /**
   * 紧急告警数量
   */
  public urgentAlarmCount: number = 0;
}
