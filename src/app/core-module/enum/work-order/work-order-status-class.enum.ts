/**
 * 工单状态图标class
 */
export enum WorkOrderStatusClassEnum {
  // 待指派
  assigned = 'fiLink-assigned-w statistics-assigned-color',
  // 待处理
  pending = 'fiLink-processed statistics-pending-color',
  // 处理中
  processing = 'fiLink-processing statistics-processing-color',
  // 已完成
  turnProcess = 'fiLink-turnProcess-icon statistics-turnProcess-color',
  // 已退单
  completed = 'fiLink-completed statistics-completed-color',
  // 已转派
  singleBack = 'fiLink-chargeback statistics-singleBack-color',
}
