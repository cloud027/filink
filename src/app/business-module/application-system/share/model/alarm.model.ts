export class AlarmModel {
  /**
   * 告警id
   */
  public id: string;
  /**
   * 告警名称
   */
  public alarmName?: string;
  /**
   * 告警级别
   */
  public alarmLevelName?: string;
  /**
   * 事件id
   */
  public eventId?: string;
  /**
   * 告警code
   */
  public alarmCode?: string;

  constructor(id?, alarmName?, alarmLevelName?) {
    this.id = id || '';
    this.alarmCode = '';
    this.alarmName = alarmName || '';
    this.alarmLevelName = alarmLevelName || '';
  }
}
