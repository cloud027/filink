/**
 * 工单状态统计图综合模型
 */
export class WorkOrderStatisticalModel {
  /**
   * 状态
   */
  orderStatus?: string;
  /**
   * 完成率
   */
  percentage?: number;
  /**
   * 设施设施类型
   */
  deviceType?: string;
  /**
   * 设备类型
   */
  equipmentType?: string;
  /**
   * 数量
   */
  count?: number;
  /**
   * 处理方案
   */
  processingScheme?: string;
  /**
   * 故障原因
   */
  errorReason?: string;
  /**
   * 总数
   */
  orderCount?: number;
  /**
   * 状态
   */
  status?: string;
  /**
   * 状态名
   */
  statusName?: string;
}
