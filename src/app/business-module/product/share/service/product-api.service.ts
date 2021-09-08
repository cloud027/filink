import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ProductServiceUrlConst} from '../const/product-service-url.const';
import {ProductInfoModel} from '../../../../core-module/model/product/product-info.model';
import {ProductPoleImageInfoModel} from '../../../../core-module/model/product/product-pole-image-info.model';
import {ProductSupplierModel} from '../model/product-supplier.model';
import {ProductGatewayImageDetailModel} from '../../../../core-module/model/product/product-gateway-image-detail.model';
import {CloudPlatformTypeEnum} from '../../../../core-module/enum/product/product.enum';

/**
 * 产品接口服务类
 */
@Injectable()
export class ProductApiService {
  constructor(private $http: HttpClient) {
  }

  /**
   * 删除产品数据
   */
  public deleteProduct(body: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(ProductServiceUrlConst.deleteProduct, body);
  }

  /**
   * 新增产品
   */
  public addProduct(body: ProductInfoModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(ProductServiceUrlConst.addProduct, body);
  }

  /**
   * 修改产品信息
   */
  public updateProduct(body: ProductInfoModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(ProductServiceUrlConst.updateProduct, body);
  }

  /**
   * 导出产品数据
   */
  public exportProduct(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(ProductServiceUrlConst.exportProduct, body);
  }

  /**
   * 导入产品基础数据
   */
  public importProductInfo(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(ProductServiceUrlConst.importProductInfo, body);
  }

  /**
   * 保存产品配置模版
   */
  public insertConfigTemplate(body: {productId: string, equipmentTemplate: string}): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(ProductServiceUrlConst.insertConfigTemplate, body);
  }

  /**
   * 上传杆型图
   */
  public uploadPoleImage(body: FormData): Observable<ResultModel<ProductPoleImageInfoModel>> {
    return this.$http.post<ResultModel<ProductPoleImageInfoModel>>(ProductServiceUrlConst.uploadPoleImage, body);
  }

  /**
   * 查询杆型图详情
   */
  public poleImageInfo(productId: string): Observable<ResultModel<ProductPoleImageInfoModel>> {
    return this.$http.get<ResultModel<ProductPoleImageInfoModel>>(`${ProductServiceUrlConst.poleImageInfo}/${productId}`);
  }

  /**
   * 保存杆型图
   */
  public insertPoleImage(body: { pointConfigId: string, selectEquipment: string }[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(ProductServiceUrlConst.insertPoleImage, body);
  }

  /**
   * 网关图详情
   */
  public gatewayImageInfo(productId: string): Observable<ResultModel<ProductGatewayImageDetailModel>> {
    return this.$http.get<ResultModel<ProductGatewayImageDetailModel>>(`${ProductServiceUrlConst.gatewayImageInfo}/${productId}`);
  }

  /**
   * 上传网关图
   */
  public uploadGatewayImage(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(ProductServiceUrlConst.uploadGatewayImage, body);
  }

  /**
   * 保存网关图
   */
  public updateGatewayImage(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(ProductServiceUrlConst.updateGatewayImage, body);
  }

  /**
   * 查询供应商下拉选的数据
   */
  public querySupplier(): Observable<ResultModel<ProductSupplierModel[]>> {
    return this.$http.post<ResultModel<ProductSupplierModel[]>>(ProductServiceUrlConst.querySupplier, {});
  }

  /**
   * 保存产品的图片信息
   */
  public insertBatchPictures(body: FormData): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(ProductServiceUrlConst.insertBatchPictures, body);
  }

  /**
   * 查询云平台的产品
   */
  public queryPlatformProduct(body: CloudPlatformTypeEnum): Observable<Map<string, any>> {
    return this.$http.get<Map<string, any>>(`${ProductServiceUrlConst.queryPlatformProduct}/${body}`);
  }

  /**
   * 根据产品id查询配置模版信息
   */
  public queryConfigTemplateByProductId(body: ProductInfoModel): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(ProductServiceUrlConst.queryConfigTemplateByProductId, body);
  }

  /**
   * 根据产品id查询模版json字符串
   */
  public queryTemplateJsonById(productId: string): Observable<ResultModel<string>> {
    return this.$http.get<ResultModel<string>>(`${ProductServiceUrlConst.queryConfigTemplateInfo}/${productId}`);
  }

  /**
   * 查询产品使用数量
   */
  public getProductUseCountForFeign(body: ProductInfoModel): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(ProductServiceUrlConst.getProductUseCountForFeign, body);
  }
}

