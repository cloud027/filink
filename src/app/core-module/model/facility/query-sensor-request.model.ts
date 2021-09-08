/**
 * 查询传感器阈值统计
 */
export class QuerySensorRequestModel {
  /**
   * 查询设施使用设施id
   */

  deviceId?: string;
  /**
   * 查询设备使用设备id
   */
  equipmentId?: string;
  /**
   * 开始时间
   */
  startTime: number;
  /**
   * 结束时间
   */
  endTime: number;
}
