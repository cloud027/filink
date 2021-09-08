/**
  * 工单转派参数
 */
export class TransferOrderParamModel {
  /**
   * 操作类型
   */
  public type?: string;
  /**
   * 工单id
   */
  public accountabilityDept?: string;
  /**
   * 单位
   */
  public accountabilityDeptCode?: string;
  /**
   * 单位id
   */
  public procId?: string;
  public id?: string;

  /**
   * 用户id
   */
  public userId?: string;

  /**
   * 转派原因
   */
  public turnReason?: string;
  constructor() {
  }
}
