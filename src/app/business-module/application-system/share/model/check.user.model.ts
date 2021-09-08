/**
 * 审核人模型
 */
export class CheckUserModel {
  /**
   * 用户ID
   */
  public id: string;

  /**
   * 用户账号
   */
  public userCode: string;

  /**
   * 用户昵称
   */
  public userNickname: string;

  /**
   * 姓名
   */
  public userName: string;

  /**
   * 用户状态
   */
  public userStatus: string;

  /**
   * 部门ID
   */
  public deptId: string;

  /**
   * 角色ID
   */
  public roleId: string;

  /**
   * 地址
   */
  public address: string;

  /**
   * 手机号
   */
  public phoneNumber: string;

  /**
   * 邮箱
   */
  public email: string;

  /**
   * 密码
   */
  public password: string;

  /**
   * 账号有效期
   */
  public countValidityTime: string;

  /**
   * 描述
   */
  public userDesc: string;


  /**
   * 最后一次登录时间
   */
  public lastLoginTime: number;

  /**
   * 最后一次登录ip
   */
  public lastLoginIp: string;

  /**
   * 当前登录ip
   */
  public loginIp: string;

  /**
   * 登录模式，1是单用户，2是多用户
   */
  public loginType: string;

  /**
   * 最大用户数，单用户模式默认为1
   */
  public maxUsers: number;

  /**
   * 是否被删除,0没有，1已删除
   */
  public deleted: string;

  /**
   * 解锁时间
   */
  public unlockTime: string;

  /**
   * 创建人
   */
  public createUser: string;

  /**
   * 创建时间
   */
  public createTime: number;

  /**
   * 修改人
   */
  public updateUser: string;

  /**
   * 修改时间
   */
  public updateTime: number;

  /**
   * 区域
   */
  public area: string;

  /**
   * 数据源
   */
  public loginSourse: string;

  public loginTime: number;

  /**
   * 手机设备id
   */
  public pushId: string;

  /**
   * 国家编码
   */
  public countryCode: string;
  /**
   * 角色
   */
  public role: string;
  /**
   * 部门
   */
  public department: string;

  /**
   * 登录用户的token
   */
  public token: string;

  /**
   * app的唯一标识
   */
  public appKey: string;

  /**
   * 账号的有效期
   */
  public expireTime: number;

  /**
   * 手机类型0:android  1:ios
   */
  public phoneType: number;

  /**
   * 推送方式(1短信0邮件,多个之间","分割)
   */
  public pushType: string;
}
