/**
  当前告警和历史告警模型
 */
export class DetailsCardAlarmModel {
  /**
   * 告警名称
   */
  public alarmName: string;
  /**
   * 设备ID
   */
  public equipmentId: string;
  /**
   * 设备名称
   */
  public equipmentName: string;
  /**
   * 设备类型
   */
  public equipmentType: any;
  /**
   * 设施ID
   */
  public deviceId: string;
  /**
   * 设施名称
   */
  public deviceName: string;
  /**
   * 告警类别
   */
  public alarmType: string;

  /**
   * 告警类别
   */
  public alarmTypeName: string;

  /**
   * 责任单位
   */
  public accountabilityUnit: string;

  /**
   * 告警级别
   */
  public alarmFixedLevel: string;

  /**
   * 告警级别样式
   */
  public style: string;
}
