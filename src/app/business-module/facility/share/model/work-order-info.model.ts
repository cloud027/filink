/**
 * 工单数据模型
 */
export class WorkOrderInfoModel {
  /**
   * 工单编号
   */
  public procId: string;

  /**
   * 标题
   */
  public title: string;

  /**
   * 状态
   */
  public status: string;

  /**
   * 责任单位编号
   */
  public accountabilityDept: string;

  /**
   * 责任单位名称
   */
  public accountabilityDeptName: string;

  /**
   * 剩余天数
   */
  public lastDays: string;

  /**
   * 关联故障
   */
  public troubleId: string;

  /**
   *关联故障名称
   */
  public troubleName: string;

  /**
   * 责任人id
   */
  public assign: string;

  /**
   * 责任人名字
   */
  public assignName: string;

  /**
   * 扩展字段(工单状态样式)
   */
  public statusClass: string;

  /**
   * 扩展字段(状态国际化)
   */
  public statusName: string;

}
