/**
 * 权限状态枚举
 */
export enum AuthorityStatusEnum {
  /**
   * 启用
   */
  enable = 2,
  /**
   * 禁用
   */
  disable = 1,

}

/**
 * 授权任务过滤类型枚举
 */
export enum AuthorityFilterEnum {
  /**
   * 临时授权申请时间/统一授权授权时间
   */
  createTime = 'createTime',
  createTimeEnd = 'createTimeEnd',
  /**
   * 权限生效时间
   */
  authEffectiveTime = 'authEffectiveTime',
  authEffectiveTimeEnd = 'authEffectiveTimeEnd',
  /**
   * 临时授权审核时间
   */
  auditingTime = 'auditingTime',
  auditingTimeEnd = 'auditingTimeEnd',
  /**
   * 权限失效时间
   */
  authExpirationTime = 'authExpirationTime',
  authExpirationTimeEnd = 'authExpirationTimeEnd',

}

export enum AuthorityTypeEnum {
  unifiedAuthority = 'unifiedAuthority',
  temporaryAuthority = 'temporaryAuthority'
}
