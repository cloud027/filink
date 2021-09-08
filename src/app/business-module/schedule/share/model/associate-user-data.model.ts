import {StatusChangeEnum} from '../enum/status-change.enum';
import {RoleListModel} from '../../../../core-module/model/user/role-list.model';

export class AssociateUserDataModel {
  /**
   * 是否关联已有用户
   */
  relateExistUsers: StatusChangeEnum;
  /**
   * 关联用户
   */
  associatedUser: string;
  /**
   * 是否立即创建用户
   */
  isCreate?: StatusChangeEnum;
  /**
   * 用户id
   */
  userId?: string;
  /**
   * 账号
   */
  userCode?: string;
  /**
   * 姓名
   */
  userName: string;
  /**
   * 用户昵称
   */
  userNickname?: string;
  /**
   * 用户状态
   */
  userStatus?: string;
  /**
   * 角色相关信息
   */
  role?: RoleListModel;
  /**
   * 地址
   */
  address?: string;
  /**
   * 手机号
   */
  phoneNumber?: string;
  /**
   * 国际码
   */
  countryCode?: string;
  /**
   * 邮箱
   */
  email?: string;
  /**
   * 账号有效期
   */
  countValidityTime?: string;
  /**
   * 登录类型
   */
  loginType?: string;
  /**
   * 登录的最大用户数
   */
  maxUsers?: number;
  /**
   * 备注
   */
  remark: string;
}
