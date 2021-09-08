export class MapDataModel {
  /**
   * 告警级别数据
   */
  public alarmLevelData: AlarmLevel[];
  /**
   * 区域ID
   */
  public areaId: string;
  /**
   * 区域名称
   */
  public areaName: string;
  /**
   * 区域code
   */
  public code: string;
  /**
   * 总数
   */
  public count: number;
  /**
   * 设备数据
   */
  public equipmentData: [];
  /**
   * 横坐标
   */
  public lat: string;
  /**
   * 纵坐标
   */
  public lng: string;
  /**
   * 父级ID
   */
  public parentId: string;
  /**
   * 区域预留字段,区分区域点
   */
  public polymerization: any;
}

export class AlarmLevel {
  /**
   * 告警级别
   */
  public alarmLevel: string;
  /**
   * 总数
   */
  public count: number;
}
