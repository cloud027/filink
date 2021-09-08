export class AccountSecurityModel {
  /**
   *  启用账号禁用策略
   */
  forbidStrategy: string;
  /**
   * 非法登录允许次数
   */
  illegalLoginCount: number;
  /**
   * 登录失败最大时间间隔(min)
   */
  intervalTime: number;
  /**
   * 启用账号锁定策略
   */
  lockStrategy: string;
  /**
   * 账号锁定时间(min)
   */
  lockedTime: number;
  /**
   * 账号最小长度
   */
  minLength: number;
  /**
   * 账号连续未登录时间(天)
   */
  noLoginTime: number;
  /**
   * 无操作登出时间(min)
   */
  noOperationTime: number;
}
