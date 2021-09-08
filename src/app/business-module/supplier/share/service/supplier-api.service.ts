import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {SupplierServiceUrlConst} from '../const/supplier-service-url.const';
import {SupplierDataModel} from '../../../../core-module/model/supplier/supplier-data.model';

@Injectable()
export class SupplierApiService {
  constructor(private $http: HttpClient) {
  }

  /**
   * 新增供应商
   */
  public saveSupplier(body: SupplierDataModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(SupplierServiceUrlConst.saveSupplier, body);
  }

  /**
   * 删除供应商数据
   */
  public batchDeleteSupplier(body: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(SupplierServiceUrlConst.batchDeleteSupplierByIds, body);
  }

  /**
   * 修改供应商信息
   */
  public editSupplier(body: SupplierDataModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(SupplierServiceUrlConst.editSupplier, body);
  }

  /**
   * 导出供应商数据
   */
  public exportSupplier(body: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(SupplierServiceUrlConst.exportSupplierList, body);
  }

  /**
   * 检查供应商数据
   */
  public checkExitsSupplier(body: {supplierName: string, supplierId?: string}): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(SupplierServiceUrlConst.checkExitsSupplierByName, body);
  }

  /**
   * 通过id查询
   */
  public querySupplierById(id: string): Observable<ResultModel<SupplierDataModel>> {
    return this.$http.get<ResultModel<SupplierDataModel>>(`${SupplierServiceUrlConst.querySupplierBySupplierId}/${id}`);
  }
}
