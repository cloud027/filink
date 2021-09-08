/**
 * 推送方式
 */
export enum PushTypeEnum {
  /**
   * 邮件和短信
   */
  mailNote = '0,1',
  /**
   * 邮件
   */
  mail = '0',
  /**
   * 短信
   */
  note = '1',
  /**
   * app推送
   */
  app = '2',
  /**
   * web推送
   */
  web = '3'
}


/**
 * 用户状态枚举
 */
export enum TenantStatusEnum {
  /**
   * 启用
   */
  enable = '1',
  /**
   * 停用
   */
  disable = '0'
}

/**
 * 用户模式枚举
 */
export enum LoginTypeEnum {
  /**
   * 单用户
   */
  singleUser = '1',
  /**
   * 多用户
   */
  multiUser = '2'
}

/**
 * 用户状态枚举
 */
export enum UserStatusEnum {
  /**
   * 启用
   */
  enable = '1',
  /**
   * 停用
   */
  disable = '0'
}

/**
 * 密码状态枚举
 */
export enum PasswordStatusEnum {
  /**
   * 启用
   */
  enable = '1',
  /**
   * 停用/已到期
   */
  disable = '0'
}

/**
 * 密码是否为初始密码枚举
 */
export enum IsInitialPasswordEnum {
  /**
   * 是初始密码 / 密码重置
   */
  initialPassword = '1',
  /**
   * 不是初始密码
   */
  notInitialPassword = '0'
}
