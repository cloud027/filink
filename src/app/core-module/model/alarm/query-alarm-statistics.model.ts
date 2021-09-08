/**
 * 查询告警统计条件模型
 */
export class QueryAlarmStatisticsModel {

  /**
   * 设备Id
   */
  public equipmentId: string;
  /**
   * 设备类型
   */
  public equipmentType: string;

  /**
   * 统计开始时间
   */
  public beginTime: number;
  /**
   * 统计结束时间
   */
  public endTime: number;

  /**
   * 统计类型
   */
  public statisticsType: string;
}
