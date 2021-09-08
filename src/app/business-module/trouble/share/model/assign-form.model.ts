/**
 * 指派表格类型
 */
export class AssignFormModel {
  /**
   * 责任单位
   */
  public assignDeptName: string;
  /**
   * 责任人
   */
  public assignUserName: string;
  /**
   * 故障id
   */
  public troubleId: string;
  /**
   * 流程实例id
   */
  public instanceId: string;
  /**
   * 当前节点
   */
  public currentHandleProgress: string;
  /**
   * 流程节点
   */
  public progessNodeId: string;
  /**
   * 其他
   */
  public otherReason: string;
  /**
   * 指派原因
   */
  public assignReason: string;
  /**
   * 责任人id
   */
  public assignUserId: string;
  /**
   * 责任单位id
   */
  public assignDeptId: string;
  /**
   * 指派类型
   */
  public assignType: string;
  /**
   * 单位code
   */
  public assignDeptCode: string;
}
