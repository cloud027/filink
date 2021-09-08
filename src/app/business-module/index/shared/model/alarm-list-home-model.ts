export class AlarmListHomeModel {
  /**
   * 告警数据
   */
  public alarmData: AlarmLevel[];
  /**
   * 区域code
   */
  public areaCode: string;
}

export class AlarmLevel {
  /**
   * 告警级别
   */
  public alarmLevel: string;
  /**
   * 告警总数
   */
  public count: number;
}
