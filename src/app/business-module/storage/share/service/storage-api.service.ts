import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {Observable} from 'rxjs';
import {StorageTotalNumModel} from '../model/storage-total-num.model';
import {StorageListModel} from '../model/storage-list.model';
import {QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {WarehousingListModel} from '../model/warehousing-list.model';
import {DeliveryListModel} from '../model/delivery-list.model';
import {StorageServiceUrlConst} from '../const/storage-service-url.const';
import { STORAGE_SERVER } from 'src/app/core-module/api-service/api-common.config';

@Injectable()
export class StorageApiService {
  constructor(private $http: HttpClient) {
  }

  /**
   * 库存总览查询物料总数
   */
  queryMaterialTotal(): Observable<ResultModel<StorageTotalNumModel>> {
    return this.$http.get<ResultModel<StorageTotalNumModel>>(StorageServiceUrlConst.queryMaterialTotal);
  }

  /**
   * 库存总览列表查询
   */
  queryStorageList(body: QueryConditionModel): Observable<ResultModel<StorageListModel[]>> {
    return this.$http.post<ResultModel<StorageListModel[]>>(StorageServiceUrlConst.queryStorageList, body);
  }

  /**
   * 导出库存总览
   */
  exportInventoryList(body: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(StorageServiceUrlConst.exportInventoryList, body);
  }

  /**
   * 库存总览统计图
   * param body
   */
  queryInventoryStatistics(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(`${STORAGE_SERVER}/inventory/queryInventoryStatistics`, body);
    // return this.$http.post<ResultModel<any>>(`filink-device-resources-server-liyj/inventory/queryInventoryStatistics`, body);
  }

  /**
   * 物料入库列表查询
   */
  queryWarehousingList(body: QueryConditionModel): Observable<ResultModel<WarehousingListModel[]>> {
    return this.$http.post<ResultModel<WarehousingListModel[]>>(StorageServiceUrlConst.queryWarehousingList, body);
  }

  /**
   * 新增入库物料
   */
  addWarehousing(body: WarehousingListModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(StorageServiceUrlConst.addWarehousing, body);
  }

  /**
   * 根据id查询入库物料信息
   */
  queryWarehousingById(id: string): Observable<ResultModel<WarehousingListModel>> {
    return this.$http.get<ResultModel<WarehousingListModel>>(`${StorageServiceUrlConst.queryWarehousingById}/${id}`);
  }

  /**
   * 编辑入库物料
   */
  updateWarehousingById(body: WarehousingListModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(StorageServiceUrlConst.updateWarehousingById, body);
  }

  /**
   * 物料提交入库
   */
  submitWarehousingByIds(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(StorageServiceUrlConst.submitWarehousingByIds, body);
  }

  /**
   * 删除物料入库
   */
  deleteWarehousingByIds(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(StorageServiceUrlConst.deleteWarehousingByIds, body);
  }

  /**
   * 物料入库导出
   */
  exportWarehousingList(body: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(StorageServiceUrlConst.exportWarehousingProcess, body);
  }

  /**
   * 物料入库导入
   */
  importWarehousingList(body: FormData): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(StorageServiceUrlConst.importWarehousing, body);
  }

  /**
   * 入库统计图
   * param body
   */
  warehousingTrend(body): Observable<ResultModel<string>> {
    // return this.$http.post<ResultModel<string>>(`filink-device-resources-server-xqh/warehousing/warehousingTrend`, body);
    return this.$http.post<ResultModel<string>>(StorageServiceUrlConst.warehousingTrend, body);
  }

  /**
   * 出库统计图
   * param body
   */
  deliveryTrend(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(StorageServiceUrlConst.deliveryTrend, body);
  }

  /**
   * 物料出库列表查询
   */
  queryDeliveryList(body: QueryConditionModel): Observable<ResultModel<DeliveryListModel[]>> {
    return this.$http.post<ResultModel<DeliveryListModel[]>>(StorageServiceUrlConst.queryDeliveryList, body);
  }

  /**
   * 新增出库物料
   */
  addDelivery(body: WarehousingListModel[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(StorageServiceUrlConst.addDelivery, body);
  }
  /**
   * 根据id查询出库物料信息
   */
  queryDeliveryById(id: string): Observable<ResultModel<DeliveryListModel>> {
    return this.$http.get<ResultModel<DeliveryListModel>>(`${StorageServiceUrlConst.queryDeliveryById}/${id}`);
  }
  /**
   * 编辑出库物料
   */
  updateDeliveryById(body: DeliveryListModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(StorageServiceUrlConst.updateDeliveryById, body);
  }
  /**
   * 物料提交出库信息
   */
  submitDelivery(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(StorageServiceUrlConst.submitDelivery, body);
  }
  /**
   * 删除物料出库
   */
  deleteDeliveryByIds(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(StorageServiceUrlConst.deleteDeliveryByIds, body);
  }
  /**
   * 物料出库导出
   */
  exportDeliveryList(body: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(StorageServiceUrlConst.exportDeliveryList, body);
  }

  /**
   * 物料出库导入
   */
  importDeliveryList(body: FormData): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(StorageServiceUrlConst.importDeliveryList, body);
  }
}
