/**
 * 节目状态
 */
export enum ProgramStatusEnum {
  // 待审核
  toBeReviewed = '0',
  // 已审核
  reviewed = '1',
  // 审核未通过
  auditFailed = '2',
  // 已禁用
  disabled = '3',
  // 审核中
  underReviewed = '4',
  // 已启用
  enabled = '5'
}
