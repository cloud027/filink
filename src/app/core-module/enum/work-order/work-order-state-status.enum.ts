/**
 * 工单审核状态
 */
export enum WorkOrderStateStatusEnum {
  // 待指派
  assigning = '0',
  // 已指派
  assigned = '1',
  // 审核中
  underReview = '2',
  // 已完成
  completed = '3',
  // 已退单
  chargeback = '4',
  // 已取消
  cancelled = '5'
}
