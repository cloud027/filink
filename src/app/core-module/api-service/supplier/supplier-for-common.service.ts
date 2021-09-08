import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {QueryConditionModel} from '../../../shared-module/model/query-condition.model';
import {ResultModel} from '../../../shared-module/model/result.model';
import {SupplierRequestUrlConst} from './supplier-request-url';
import {SupplierDataModel} from '../../model/supplier/supplier-data.model';

/**
 * 供应商公共服务
 */
@Injectable()
export class SupplierForCommonService {
  constructor(private $http: HttpClient) {
  }

  /**
   * 查询供应商列表
   */
  public querySupplierList(body: QueryConditionModel): Observable<ResultModel<SupplierDataModel[]>> {
    return this.$http.post<ResultModel<SupplierDataModel[]>>(SupplierRequestUrlConst.querySupplierList, body);
  }
}
