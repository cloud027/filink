/**
 * 设施-门编号模型
 */
export class DeviceAndDoorDataModel {
  /**
   * 设施id
   */
  public deviceId: string;
  /**
   * 门编号
   */
  public doorId?: string;
  public doorNum?: string;
}

/**
 * 权限信息模型
 */
export class AuthorityModel {
  /**
   * 权限生效时间
   */
  public authEffectiveTime: string | number;
  /**
   * 权限失效时间
   */
  public authExpirationTime: string | number;
  /**
   * 权限id
   */
  public id: string;
  /**
   * 被授权用户名
   */
  public userName: string;
  /**
   * 授权用户id
   */
  public authUserId: string;
  /**
   * 被授权用户用户id
   */
  public userId: string;
  /**
   * 权限状态 启用/禁用
   */
  public authStatus: string;
  /**
   * 统一授权范围
   */
  public authDeviceList: DeviceAndDoorDataModel[];
  /**
   * 备注
   */
  public remark: string;
  /**
   * 授权任务名称
   */
  public name: string;
  /**
   * 授权用户名字
   */
  public authUserName: string;
  /**
   * 授权时间
   */
  public createTime:  string |number;
  /**
   * 审核时间
   */
  public auditingTime: string | number;
}

/**
 * 临时授权审核模型
 */
export class AuditingModal {
  /**
   * 单个授权任务id
   */
  public id?;
  /**
   * 权限状态
   */
  public authStatus;
  /**
   * 审核描述
   */
  public auditingDesc;
  /**
   * 申请用户id
   */
  public userId?;
  /**
   * 多个授权任务id集合
   */
  public idList?;
  /**
   * 申请用户id集合
   */
  public userIdList?;
}
