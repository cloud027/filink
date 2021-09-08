export class DeviceReqModel {
  /**
   * 设施Id
   */
  public deviceId?: string;
  /**
   * 结束时间
   */
  public endTime?: number;
  /**
   * 传感值类型
   */
  public sensorType?: string;
  /**
   * 开始时间
   */
  public startTime?: number;
  /**
   * 设施类型
   */
  public deviceType?: string;
  /**
   * 区域Id集合
   */
  public areaIds?: [string];

  /**
   * 设施类型集合
   */
  public deviceTypes?: any[];
}
