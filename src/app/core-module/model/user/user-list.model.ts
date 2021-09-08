import {DepartmentUnitModel} from '../work-order/department-unit.model';
import {CheckboxModel} from '../../../shared-module/model/checkbox-model';
import { RoleListModel } from './role-list.model';

/**
 * 用户列表模型
 */
export class UserListModel {
  /**
   * 是否为超级管理员
   */
  admin: boolean;
  /**
   * 地址
   */
  address: string;
  /**
   * 账号有效期
   */
  countValidityTime: string;
  /**
   * 国家电话号码前缀
   */
  countryCode: string;
  /**
   * 创建时间
   */
  createTime: number;
  /**
   * 1:默认用户  0：非默认用户（可以删除）
   */
  defaultUser: number;
  /**
   * 是否删除
   */
  deleted: string;
  /**
   * 所属单位信息
   */
  department: DepartmentUnitModel;
  /**
   * 所属单位id
   */
  deptId: string;
  /**
   * 邮箱
   */
  email: string;
  /**
   * 用户id
   */
  id: string;
  /**
   * 最后一次登录IP
   */
  lastLoginIp: string;
  /**
   * 最后一次登录时间
   */
  lastLoginTime: number;
  /**
   * 登录IP
   */
  loginIp: string;
  /**
   * 登录源
   */
  loginSourse: string;
  /**
   * 登录时间
   */
  loginTime: number;
  /**
   * 登录类型
   */
  loginType: string;
  /**
   * 登录的最大用户数
   */
  maxUsers: number;
  /**
   * 密码
   */
  password: string;
  /**
   * 电话号码
   */
  phoneNumber: string;
  /**
   * 推送方式(1短信0邮件,多个之间","分割)
   */
  pushType: string | CheckboxModel[];
  /**
   * 角色id
   */
  roleId: string;
  /**
   * 用户账号
   */
  userCode: string;
  /**
   * 用户描述
   */
  userDesc: string;
  /**
   * 用户名
   */
  userName: string;
  /**
   * 用户昵称
   */
  userNickname: string;
  /**
   * 用户状态
   */
  userStatus: string;
  /**
   * 选中状态
   */
  checked?: boolean;
  /**
   * 责任单位名称
   */
  departmentName?: string;
  /**
   * 过期时间
   */
  expireTime: number;
  /**
   * 是否是租户管理员
   */
  tenantAdmin: boolean;
  /**
   * 角色相关信息
   */
  role: RoleListModel;
  /**
   * 租户id
   */
  tenantId: string;
  /**
   * 租户控制的页面上的元素的显隐 待租户给出此处模型
   */
  tenantElement: any;
}
