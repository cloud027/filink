/**
 * 操作按钮
 */
export enum OperationButtonEnum {
  // 编辑
  edit = 'edit',
  // 删除
  delete = 'delete',
  // 启用
  enable = 'enable',
  // 禁用
  disable = 'disable',
  // 激活
  active = 'active',
  // 更新
  update = 'update'
}

/**
 * 分页
 */
export enum PageOperationEnum {
  // 分页页码
  pageNum = 1,
  // 分页大小
  pageSize = 6,
  // table分页大小
  tablePageSize = 5
}

/**
 * 审核
 */
export enum AuditOperationEnum {
  // 单个审核
  singleAudit = 'singleAudit',
  // 批量审核
  batchAudit = 'batchAudit'
}

export enum chooseTypeEnum {
  // 添加关注
  collect = 'collect',
  //   分组变更
  groupChange = 'groupChange'
}
