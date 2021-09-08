/**
 * 工单增量模型
 */
export class WorkOrderIncreaseModel {
  /**
   * 工单增量
   */
  public count: number;

  /**
   * 日
   */
  public day;

  /**
   * 月份
   */
  public month;

  /**
   * 年
   */
  public year;

  /**
   * 日期
   */
  public formatDate: string ;

  /**
   * 统计类型 1按最近7天 2 按最近一月 3 按最近一年
   */
  public statisticalType: string;

  public procType;

  public statisticsId;

  public tenantId;

  public deptCode;
}
