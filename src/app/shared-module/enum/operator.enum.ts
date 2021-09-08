/**
 * 操作符枚举类
 */
export enum OperatorEnum {
  /**
   * like模糊查询
   */
  like = 'like',
  /**
   * 等于
   */
  eq = 'eq',
  /**
   * in在里面
   */
  in = 'in',
  /**
   * gte
   */
  gte = 'gte',
  /**
   * lte
   */
  lte = 'lte',
  /**
   * gt大于
   */
  gt = 'gt',
  /**
   * lt小于
   */
  lt = 'lt',
  /**
   * 所有
   */
  all = 'all',
  /**
   * 不等于
   */
  neq = 'neq',
}
/**
 * 操作符号过滤选择
 */
export enum FilterSelectEnum {
  // 等于
  eq = '=',
  // 大于
  gt = '>',
  // 小于
  lt = '<'
}
