import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TENANT_SERVER} from '../../../../core-module/api-service/api-common.config';
import {TenantApiInterface} from './tenant-api.interface';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {UserListModel} from '../../../../core-module/model/user/user-list.model';
import {RoleListModel} from '../../../../core-module/model/user/role-list.model';
import {TenantModel} from '../model/tenant.model';
import {GET_DEVICE_TYPE, QUERY_ROLE_INFO_BY_ID, QUERY_TOP_PERMISSION} from '../../../user/share/const/user-url-const';


@Injectable({providedIn: 'root'})
export class TenantApiService implements TenantApiInterface {
  constructor(private $http: HttpClient) {
  }

  /**
   *租户列表数据
   */
  queryTenantList(body: QueryConditionModel): Observable<Object> {
    return this.$http.post<ResultModel<TenantModel[]>>(`${TENANT_SERVER}/tenant/queryTenantList`, body);
  }


  /**
   * 新增租户
   */
  addTenant(body): Observable<Object> {
    return this.$http.post(`${TENANT_SERVER}/tenant/addTenant`, body);
  }

  /**
   * 修改租户
   */
  updateTenant(body): Observable<Object> {
    return this.$http.post(`${TENANT_SERVER}/tenant/updateTenant`, body);
  }

  /**
   * 删除租户
   */
  public deleteTenant(body): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(`${TENANT_SERVER}/tenant/deleteTenant`, body);
  }

  /**
   * 查询租户名称是否存在
   */
  public checkTenantName(body): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(`${TENANT_SERVER}/tenant/checkTenantName`, body);
  }

  /**
   * 查询租户电话是否存在
   */
  public checkTenantPhone(body): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(`${TENANT_SERVER}/tenant/checkTenantPhone`, body);
  }


  /**
   * 查询租户email是否存在
   */
  public checkTenantEmail(body): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(`${TENANT_SERVER}/tenant/checkTenantEmail`, body);
  }


  /**
   *  更新租户状态（批量）
   */
  updateTenantStatus(body): Observable<ResultModel<UserListModel[]>> {
    return this.$http.post<ResultModel<any[]>>(`${TENANT_SERVER}/tenant/updateStatus`, body);
  }

  /**
   * 查询租住下用户信息列表
   */
  queryUserListByTenantId(body): Observable<ResultModel<UserListModel[]>> {
    return this.$http.post<ResultModel<UserListModel[]>>(`${TENANT_SERVER}/tenant/queryUserListByTenantId`, body);
  }


  /**
   *  租户列表信息导出
   */
  exportTenantProcess(body): Observable<ResultModel<UserListModel[]>> {
    return this.$http.post<ResultModel<any>>(`${TENANT_SERVER}/tenant/exportTenantProcess`, body);
  }

  /**
   *  根据租户ID获取管理员信息
   */
  queryAdminById(body): Observable<ResultModel<UserListModel>> {
    return this.$http.post<ResultModel<UserListModel>>(`${TENANT_SERVER}/tenant/queryAdminById`, body);
  }

  /**
   *  新增租户管理员
   */
  TenantAdminAdd(body): Observable<ResultModel<UserListModel[]>> {
    return this.$http.post<ResultModel<any[]>>(`${TENANT_SERVER}/user/insert`, body);
  }

  /**
   *  修改租户管理员
   */
  TenantAdminUpdate(body): Observable<ResultModel<UserListModel[]>> {
    return this.$http.post<ResultModel<any[]>>(`${TENANT_SERVER}/user/updateTenantAdminUser`, body);
  }


  /**
   *  重置租户管理员密码
   */
  resetAdminPWD(body): Observable<ResultModel<UserListModel[]>> {
    return this.$http.post<ResultModel<any[]>>(`${TENANT_SERVER}/tenant/resetAdminPWD`, body);
  }


  /**
   * 租户下用户列表查询所有角色
   */
  public queryRoleByTenantId(id): Observable<ResultModel<RoleListModel[]>> {
    return this.$http.post<ResultModel<RoleListModel[]>>(`${TENANT_SERVER}/role/queryRoleByTenantId/${id}`, {});
  }

  /**
   * 租户下用户列表查询所有部门
   */
  public deptListByTenantId(id): Observable<ResultModel<RoleListModel[]>> {
    return this.$http.post<ResultModel<RoleListModel[]>>(`${TENANT_SERVER}/department/deptListByTenantId/${id}`, {});
  }


  /**
   * 根据租户ID获取租户菜单配置(管理员配置)
   */
  getTenantMenuByTenantId(id, languageConfig) {
    return this.$http.get(`${TENANT_SERVER}/menu/getTenantMenuByTenantId/${id}/${languageConfig}`);
  }


  /**
   * 保存租户菜单配置
   */
  updateTenantMenuByTenantId(body) {
    return this.$http.put(`${TENANT_SERVER}/menu/updateTenantMenuByTenantId`, body);
  }


  /**
   * 获取租户权限配置
   */
  queryTenantPermissionById(id) {
    return this.$http.get(`${TENANT_SERVER}/permission/queryTenantPermissionById/${id}`);
  }


  /**
   * 保存租户权限配置
   */
  updateTenantPermissionById(body) {
    return this.$http.post(`${TENANT_SERVER}/permission/updateTenantPermissionById`, body);
  }


  /**
   * 获取租户设施设备权限配置
   */
  queryTenantDevicesById(id) {
    return this.$http.get(`${TENANT_SERVER}/tenantDevice/queryTenantDevicesById/${id}`);
  }


  /**
   * 保存租户设施设备权限配置
   */
  updateTenantDevicesById(body) {
    return this.$http.post(`${TENANT_SERVER}/tenantDevice/updateTenantDevicesById`, body);
  }

  /**
   * 获取租户元素配置(租户管理员)
   */
  queryElementById(id) {
    return this.$http.get(`${TENANT_SERVER}/tenantElement/queryElementById/${id}`);
  }

  /**
   * 保存租户元素配置
   */
  updateElementById(body) {
    return this.$http.post(`${TENANT_SERVER}/tenantElement/updateElementById`, body);
  }


  // ////////////////////////////临时接口


  /**
   * 获取权限数
   */
  queryRoleInfoById(id: string): Observable<ResultModel<RoleListModel>> {
    return this.$http.post<ResultModel<RoleListModel>>(`${QUERY_ROLE_INFO_BY_ID}` + `${id}`, null);
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

}
