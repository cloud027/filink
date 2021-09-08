import {UserListModel} from '../user/user-list.model';
import {TokenModel} from './token.model';
import {MenuTemplateModel} from '../system-setting/menu-template.model';

/**
 * 登录信息模型
 */
export class LoginInfoModel {
  /**
   * token
   */
  accessToken: TokenModel;
  /**
   * 登录用户相关信息
   */
  loginInfo?: UserListModel;
  /**
   * 菜单信息
   */
  showMenuTemplate: MenuTemplateModel;
  /**
   * 租户id 登录时若license过期，需要根据租户id上传有效的license文件
   */
  tenantId?: string;
  /**
   * 用户名 登录时若license过期，需要根据租户id上传有效的license文件，此时需要根据用户名来记录日志
   */
  userName?: string;
  /**
   * 登录用户相关信息(管理员和租户视角切换时使用)
   */
  user?: UserListModel;
}
