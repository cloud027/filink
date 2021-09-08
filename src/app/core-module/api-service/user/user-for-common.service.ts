import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
  GET_ONLINE_USER,
  LOGOUT,
  MODIFY_PASSWORD,
  QUERY_ALL_DEPARTMENT,
  QUERY_TOTAL_DEPT,
  QUERY_USER_BY_PERMISSION,
  QUERY_USER_UNIFY_AUTH_BY_ID,
  QUERY_USER_LISTS,
  QUERY_UNREAD_COUNT,
  QUERY_ALL_ROLES, VERIFY_USER_INFO, CHECK_USER_NAME
} from './user-request-url';
import {ResultModel} from '../../../shared-module/model/result.model';
import {DepartmentUnitModel} from '../../model/work-order/department-unit.model';
import { UserListModel } from '../../model/user/user-list.model';
import {QueryConditionModel} from '../../../shared-module/model/query-condition.model';
import {TENANT_SERVER} from '../api-common.config';
import { UnreadCountModel } from '../../model/user/unread-count.model';
import {RoleListModel} from '../../model/user/role-list.model';
import {INSERT_USER, QUERY_USERS_BY_DEPTID} from '../../../business-module/user/share/const/user-url-const';

@Injectable()
export class UserForCommonService {

  constructor(private $http: HttpClient) {
  }

  /**
   * 不分页查询部门信息
   */
  queryAllDepartment(): Observable<ResultModel<DepartmentUnitModel[]>> {
    return this.$http.post<ResultModel<DepartmentUnitModel[]>>(`${QUERY_ALL_DEPARTMENT}`, {});
  }

  /**
   * 修改密码
   */
  modifyPassword(body: any): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${MODIFY_PASSWORD}`, body);
  }

  /**
   * 查询所有单位/部门(无分页)
   */
  queryTotalDept(): Observable<Object> {
    return this.$http.post(`${QUERY_TOTAL_DEPT}`, {});
  }

  /**
   * 查询统一授权信息
   */
  queryUserAuthInfoById(): Observable<Object> {
    return this.$http.get(`${QUERY_USER_UNIFY_AUTH_BY_ID}`);
  }

  /**
   * 登出
   */
  logout(body: any): Observable<Object> {
    return this.$http.get(`${LOGOUT}/${body.userid}/${body.token}`);
  }

  /**
   * 查询在线用户
   */
  getOnLineUser(body): Observable<Object> {
    return this.$http.post(`${GET_ONLINE_USER}`, body);
  }

  /**
   * 查询用户列表(带权限)
   */
  queryUserByPermission(body): Observable<Object> {
    return this.$http.post(`${QUERY_USER_BY_PERMISSION}`, body);
  }

  /**
   * 获取用户列表...
   */
  queryUserLists(body: QueryConditionModel): Observable<ResultModel<UserListModel[]>> {
    return this.$http.post<ResultModel<UserListModel[]>>(`${QUERY_USER_LISTS}`, body);
  }



  /**
   * 获取租户权限配置
   */
  queryTenantPermissionById(id) {
    return this.$http.get(`${TENANT_SERVER}/permission/queryTenantPermissionById/${id}`);
  }


  /**
   * 获取租户设施设备权限配置
   */
  queryTenantDevicesById(id) {
    return this.$http.get(`${TENANT_SERVER}/tenantDevice/queryTenantDevicesById/${id}`);
  }

  /**
   * 查询未读消息数量
   * param userId
   */
  queryCountUnread(userId: string): Observable<ResultModel<UnreadCountModel>> {
    return this.$http.get<ResultModel<UnreadCountModel>>(`${QUERY_UNREAD_COUNT}/${userId}`);
  }
  /**
   * 查询所有角色
   */
  public queryAllRoles(): Observable<ResultModel<RoleListModel[]>> {
    return this.$http.post<ResultModel<RoleListModel[]>>(`${QUERY_ALL_ROLES}`, {});
  }

  /**
   * 验证用户信息
   */
  public verifyUserInfo(body: QueryConditionModel): Observable<ResultModel<UserListModel[]>> {
    return this.$http.post<ResultModel<UserListModel[]>>(`${VERIFY_USER_INFO}`, body);
  }
  /**
   * 用户名效验
   */
  public checkUserNameExist(body): Observable<ResultModel<number>> {
    return this.$http.post<ResultModel<number>>(`${CHECK_USER_NAME}`, body);
  }
  /**
   * 新增用户
   */
  public addUser(body): Observable<ResultModel<string>> {
    return this.$http.post <ResultModel<string>>(`${INSERT_USER}`, body);
  }

  /**
   * 获取所有责任人列表
   */
  public queryUsersByDeptId(DeptId: string): Observable<ResultModel<Object[]>> {
    return this.$http.get<ResultModel<Object[]>>(`${QUERY_USERS_BY_DEPTID}/${DeptId}`);
  }
}
