/**
 * 租户模型
 */
export class TenantModel {
  /**
   * 租户ID
   */
  public id: string;
  /**
   * 租户名称
   */
  public tenantName: string;
  /**
   * 租户状态
   */
  public status: string;
  /**
   * 手机号
   */
  public phoneNumber: string;
  /**
   * 邮箱
   */
  public email: string;
  /**
   * 地址
   */
  public address: string;
  /**
   * 备注
   */
  public remark: string;
}

/**
 * 首页配置状态
 */
export class TenantIndexModel {
  /**
   * 子集
   */
  public children: any;
  /**
   * 是否显示
   */
  public isShow: string;
  /**
   * code
   */
  public elementCode: string;
}
