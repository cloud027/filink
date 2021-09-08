import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
  DELETE_DEPT,
  DELETE_USER,
  DELETE_ROLE,
  INSERT_DEPT,
  INSERT_ROLE,
  INSERT_USER,
  QUERY_DEPT_INFO_BY_ID,
  QUERY_ROLE_INFO_BY_ID,
  QUERY_ROLES_LIST,
  QUERY_USER_INFO_BY_ID,
  QUERY_TOTAL_DEPARTMENT,
  QUERY_ALL_DEPT,
  RESET_PASSWORD,
  QUERY_PASSWORD,
  UPDATE_DEPT,
  UPDATE_ROLE,
  UPDATE_USER,
  UPDATE_USER_STATUS,
  VERIFY_USER_INFO,
  VERIFY_ROLE_INFO,
  VERIFY_DEPT_INFO,
  OFFLINE,
  IMPORT_USER,
  EXPORT_USER,
  QUERY_TOP_PERMISSION,
  GET_DEVICE_TYPE, QUERY_USERS_BY_DEPTID, VERIFY_USER_NAME
} from '../const/user-url-const';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {UserListModel} from '../../../../core-module/model/user/user-list.model';
import {QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {DepartmentListModel} from '../model/department-list.model';
import {InnerTablePageModel} from '../model/inner-table-page.model';
import {RoleListModel} from '../../../../core-module/model/user/role-list.model';

@Injectable()
export class UserService {

  constructor(private $http: HttpClient) {
  }

  /**
   * 新增用户
   */
  public addUser(body: UserListModel): Observable<ResultModel<string>> {
    return this.$http.post <ResultModel<string>>(`${INSERT_USER}`, body);
  }

  /**
   * 删除用户
   */
  public deleteUser(body: { firstArrayParameter: string[], flag?: boolean }): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${DELETE_USER}`, body);
  }

  /**
   * 修改用户
   */
  public modifyUser(body: UserListModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${UPDATE_USER}`, body);
  }

  /**
   * 查询用户详情
   */
  public queryUserInfoById(id: string): Observable<ResultModel<UserListModel>> {
    return this.$http.post<ResultModel<UserListModel>>(`${QUERY_USER_INFO_BY_ID}` + `${id}`, null);
  }

  /**
   * 修改用户状态
   */
  public updateUserStatus(status: number, idArray: string[]): Observable<ResultModel<number>> {
    return this.$http.get<ResultModel<number>>(`${UPDATE_USER_STATUS}?userStatus=${status}&userIdArray=${idArray}`);
  }

  /**
   * 验证用户信息
   */
  public verifyUserInfo(body: QueryConditionModel): Observable<ResultModel<UserListModel[]>> {
    return this.$http.post<ResultModel<UserListModel[]>>(`${VERIFY_USER_INFO}`, body);
  }

  /**
   * 重置密码
   */
  public restPassword(body: { userId: string }): Observable<ResultModel<number>> {
    return this.$http.post<ResultModel<number>>(`${RESET_PASSWORD}`, body);
  }

  /**
   * 查询用户密码
   */
  public queryPassword(): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${QUERY_PASSWORD}`, {});
  }


  public importUser(body: any): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(`${IMPORT_USER}`, body);
  }

  public exportUserList(body: {
    queryCondition: QueryConditionModel,
    columnInfoList: any[],
    excelType: string
  }): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(`${EXPORT_USER}`, body);
  }

  // /**
  //  * 查询单位列表
  //  */
  // public queryDeptList(body): Observable<Object> {
  //   return this.$http.post(`${QUERY_DEPT_LIST}`, body);
  // }
  /**
   * 获取单个部门信息
   */
  public queryDeptInfoById(id: string): Observable<ResultModel<DepartmentListModel>> {
    return this.$http.post<ResultModel<DepartmentListModel>>(`${QUERY_DEPT_INFO_BY_ID}` + `${id}`, null);
  }

  /**
   * 添加部门
   */
  public addDept(body: DepartmentListModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<any>>(`${INSERT_DEPT}`, body);
  }

  /**
   * 删除部门
   */
  public deleteDept(body: { firstArrayParameter: string[] }): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${DELETE_DEPT}`, body);
  }

  /**
   * 修改部门
   */
  public modifyDept(body: DepartmentListModel): Observable<ResultModel<string>> {
    return this.$http.put<ResultModel<string>>(`${UPDATE_DEPT}`, body);
  }

  /**
   * 获取部门列表信息
   */
  public queryAllDept(body: QueryConditionModel): Observable<ResultModel<DepartmentListModel[]>> {
    return this.$http.post<ResultModel<DepartmentListModel[]>>(`${QUERY_ALL_DEPT}`, body);
  }

  /**
   * 验证部门信息
   */
  public verifyDeptInfo(body: any): Observable<ResultModel<DepartmentListModel[]>> {
    return this.$http.post<ResultModel<DepartmentListModel[]>>(`${VERIFY_DEPT_INFO}`, body);
  }

  /**
   * 查询所有部门
   */
  public queryTotalDepartment(): Observable<ResultModel<DepartmentListModel[]>> {
    return this.$http.post<ResultModel<DepartmentListModel[]>>(`${QUERY_TOTAL_DEPARTMENT}`, {});
  }

  /**
   * 角色管理
   */
  public queryRoles(body: QueryConditionModel): Observable<ResultModel<InnerTablePageModel<DepartmentListModel[]>>> {
    return this.$http.post<ResultModel<InnerTablePageModel<DepartmentListModel[]>>>(`${QUERY_ROLES_LIST}`, body);
  }

  /**
   * 查询角色信息
   */
  public queryRoleInfoById(id: string): Observable<ResultModel<RoleListModel>> {
    return this.$http.post<ResultModel<RoleListModel>>(`${QUERY_ROLE_INFO_BY_ID}` + `${id}`, null);
  }

  /**
   * 添加角色
   */
  public addRole(body: RoleListModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${INSERT_ROLE}`, body);
  }

  /**
   * 修改角色
   */
  public modifyRole(body: RoleListModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${UPDATE_ROLE}`, body);
  }

  /**
   * 删除角色
   */
  public deleteRole(body: { firstArrayParameter: string[] }): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${DELETE_ROLE}`, body);
  }

  /**
   * 验证是否存在该角色
   */
  public verifyRoleInfo(body: any): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(`${VERIFY_ROLE_INFO}`, body);
  }

  /**
   * 在线用户
   */
  public offline(body: any): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(`${OFFLINE}`, body);
  }

  /**
   * 获取顶级权限
   */
  public queryTopPermission(): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(`${QUERY_TOP_PERMISSION}`, {});
  }

  /**
   * 获取所有设施集
   */
  public getDeviceType(): Observable<ResultModel<any>> {
    return this.$http.get<ResultModel<any>>(GET_DEVICE_TYPE);
  }

  /**
   * 获取所有责任人列表
   */
  public queryUsersByDeptId(DeptId: string): Observable<ResultModel<Object[]>> {
    return this.$http.get<ResultModel<Object[]>>(`${QUERY_USERS_BY_DEPTID}/${DeptId}`);
  }

  /**
   * check用户名
   */
  public checkUserName(body): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(`${VERIFY_USER_NAME}`, body);
  }
}

