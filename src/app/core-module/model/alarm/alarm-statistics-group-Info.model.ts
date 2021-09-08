/**
 * 告警增量统计实体
 */
export class AlarmStatisticsGroupInfoModel {
  /**
   * 分组的级别
   */
  public groupLevel: string;

  /**
   * 分组的地区
   */
  public groupArea: string;

  /**
   * 分组的数量
   */
  public groupNum: number = 0 ;

  /**
   * 排序时间
   */
  public time: number;
}
