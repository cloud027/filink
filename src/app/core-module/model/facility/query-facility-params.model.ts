/**
 * 查询设施告警的数据模型
 */
export class QueryFacilityParamsModel {
  /**
   * 设施id
   */
  public deviceId: string;
  /**
   * 开始时间
   */
  public beginTime: number;
  /**
   * 结束时间
   */
  public endTime: number;
  constructor(deviceId: string, beginTime: number, endTime: number) {
    this.deviceId = deviceId;
    this.beginTime = beginTime;
    this.endTime = endTime;
  }
}

