/**
 * 工单状态
 */
export enum WorkOrderStatusEnum {
  // 待指派
  assigned = 'assigned',
  // 待处理
  pending = 'pending',
  // 处理中
  processing = 'processing',
  // 已完成
  completed = 'completed',
  // 已退单
  singleBack = 'singleBack',
  // 已转派
  turnProcess = 'turnProcess'
}
