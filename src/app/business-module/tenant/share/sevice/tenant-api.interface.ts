import {Observable} from 'rxjs';

export interface TenantApiInterface {
  /**
   * 租户列表
   * returns {Observable<Object>}
   */
  queryTenantList(body): Observable<Object>;

  /**
   * 新增租户
   */
  addTenant(body): Observable<Object>;
}

