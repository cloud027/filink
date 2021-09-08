import {DepartmentUnitModel} from '../work-order/department-unit.model';
import {RoleListModel} from './role-list.model';

export class UserRoleModel {
  /**
   * 选中
   */
  checked?: boolean;

  /**
   * 所属单位id
   */
  deptId?: string;
  /**
   * 责任单位名称
   */
  departmentName?: string;
  department?: DepartmentUnitModel;
  /**
   * 用户id
   */
  id?: string;
  userId?: string;
  /**
   * 角色id
   */
  roleId?: string;
  role?: RoleListModel;
  /**
   * 用户账号
   */
  userCode?: string;
  /**
   * 用户名
   */
  userName?: string;
  /**
   * 用户昵称
   */
  userNickname?: string;
  /**
   * 角色名
   */
  label?: string;
  /**
   * 角色value
   */
  value?: string;
  /**
   * 角色名
   */
  roleName?: string;
}
