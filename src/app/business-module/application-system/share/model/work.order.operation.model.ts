/**
 * 工单提交参数模型
 */
import {WorkOrderActTypeEnum, WorkOrderResultStatusEnum} from '../enum/work.order.enum';

export class WorkOrderOperationModel {

  /**
   * 工單ID数组
   */
  public workOrderIds?: Array<string>;

  /**
   * 工單ID
   */
  public workOrderId?: string;

  /**
   * 审核意见
   */
  public examineAdvise?: string;

  /**
   * 转派原因
   */
  public transferReason?: string;

  /**
   * 退单原因
   */
  public causeReason?: string;

  /**
   * 审核结果
   */
  public auditResults?: WorkOrderResultStatusEnum;

  /**
   * 操作类型
   */
  public actType: WorkOrderActTypeEnum;

  /**
   * 指定人id
   */
  public personLiable: string;
  /**
   * 工单名称
   */
  public workOrderName?: string;

  constructor(workOrderIds?, workOrderId?, actType?, examineAdvise?, transferReason?, causeReason?, auditResults?, personLiable?, workOrderName?) {
    this.workOrderIds = workOrderIds || [];
    this.workOrderId = workOrderId || '';
    this.actType = actType;
    this.examineAdvise = examineAdvise || '';
    this.transferReason = transferReason || '';
    this.causeReason = causeReason || '';
    this.auditResults = auditResults || '0';
    this.personLiable = personLiable || '';
    this.workOrderName = workOrderName || '';
  }

}
