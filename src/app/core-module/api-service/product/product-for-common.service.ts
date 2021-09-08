import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { QueryConditionModel } from '../../../shared-module/model/query-condition.model';
import { ResultModel } from '../../../shared-module/model/result.model';
import { ProductInfoModel } from '../../model/product/product-info.model';
import { ProductRequestUrlConst } from './product-request-url';

/**
 * 产品公共服务
 */
@Injectable()
export class ProductForCommonService {
    constructor(private $http: HttpClient) {
    }

    /**
     * 查询产品列表
     */
    public queryProductList(body: QueryConditionModel): Observable<ResultModel<ProductInfoModel[]>> {
        return this.$http.post<ResultModel<ProductInfoModel[]>>(ProductRequestUrlConst.queryProductList, body);
    }
    /**
     * 根据产品查询产品信息
     */
    public getProductInfoById(productId: string): Observable<ResultModel<ProductInfoModel>> {
        return this.$http.get<ResultModel<ProductInfoModel>>(`${ProductRequestUrlConst.getProductInfoById}/${productId}`);
    }
    /**
   * 查询编码列表
   */
    public getMaterialRule(): Observable<ResultModel<ProductInfoModel>> {
        return this.$http.get<ResultModel<ProductInfoModel>>(ProductRequestUrlConst.getMaterialRule);
    }
    /**
 * 编辑编码列表
 */
    public setMaterialRule(body): Observable<ResultModel<ProductInfoModel>> {
        return this.$http.post<ResultModel<ProductInfoModel>>(ProductRequestUrlConst.setMaterialRule, body);
    }

}
