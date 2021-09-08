import {WorkOrderStateStatusEnum} from '../../../../core-module/enum/work-order/work-order.enum';
/**
 * 内容审核列表模型
 */
export class ContentExamineModel {
  /**
   * 节目 工单Id
   */
  public workOrderId: string;

  /**
   * 工单名称
   */
  public workOrderName: string;

  /**
   * 责任人
   */
  public personLiable: string;

  /**
   * 工单状态 （待指派，已指派，审核中，已完成，已退单，已取消）
   */
  public workOrderStatus: WorkOrderStateStatusEnum;

  /**
   * 期望完工时间
   */
  public expectCompTime: string;

  /**
   * 实际完工时间
   */
  public actualCompTime: string;

  /**
   * 创建时间
   */
  public createTime: string;

  /**
   * 审核意见
   */
  public examineAdvise: string;

  /**
   * 审核内容(关联节目内容ID)
   */
  public programId: string;

  /**
   * 转派原因
   */
  public transferReason: string;

  /**
   * 退单原因
   */
  public causeReason: string;

  /**
   * 备注
   */
  public remark: string;
  /**
   * 图标样式
   */
  public statusIconClass: string;

  /**
   * 颜色样式
   */
  public statusColorClass: string;
}
