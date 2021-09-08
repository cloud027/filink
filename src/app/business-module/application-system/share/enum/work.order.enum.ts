/**
 * 节目审核工单状态
 *  0:删除 1:取消 2:转派 3:退单 4:提交
 */
export enum WorkOrderActTypeEnum {
  // 删除
  delete = '0',
  // 取消
  cancel = '1',
  // 转派
  transfer = '2',
  // 退单
  chargeback = '3',
  // 提交
  submit = '4'
}

/**
 * 审核结果枚举
 */
export enum WorkOrderResultStatusEnum {
  // 通过
  pass = '0',
  // 不通过
  faild = '1'
}
