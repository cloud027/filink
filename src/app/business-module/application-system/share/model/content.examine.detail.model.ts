import {ContentListModel} from './content.list.model';
import {WorkOrderResultStatusEnum} from '../enum/work.order.enum';
import {WorkOrderStateStatusEnum} from '../../../../core-module/enum/work-order/work-order.enum';

/**
 * 内容审核详情模型
 */
export class ContentExamineDetailModel {
  /**
   * 节目 工单Id
   */
  public workOrderId: string;

  /**
   * 工单名称
   */
  public workOrderName: string;

  /**
   * 审核意见
   */
  public examineAdvise: string;

  /**
   * 审核结果
   */
  public auditResults: WorkOrderResultStatusEnum;

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
   * 备注
   */
  public remark: string;

  /**
   * 节目工单 关联的 节目消息
   */
  public program: ContentListModel;

  /**
   * 责任人的名字
   */
  public personLiableName: string;

}
