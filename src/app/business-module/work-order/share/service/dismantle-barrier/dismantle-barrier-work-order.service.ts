/**
 * 拆除工单接口
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WorkOrderRequestUrl } from '../work-order-request-url.const';
import { QueryConditionModel } from '../../../../../shared-module/model/query-condition.model';
import { Observable } from 'rxjs';
import { ResultModel } from '../../../../../shared-module/model/result.model';
import { Result } from '../../../../../shared-module/entity/result';
import { ExportRequestModel } from '../../../../../shared-module/model/export-request.model';
import { DismantleBarrierInsertEditFormModel } from '../../model/dismantle-barrier-model/dismantle-barrier-insert-edit-form.model';
import { DismantleBarrierWorkOrderModel } from '../../model/dismantle-barrier-model/dismantle-barrier-work-order.model';
import { ClearBarrierImagesModel } from '../../model/clear-barrier-model/clear-barrier-images.model';
import { TransferOrderParamModel } from '../../model/clear-barrier-model/transfer-order-param.model';
import { RoleUnitModel } from '../../../../../core-module/model/work-order/role-unit.model';

@Injectable()
export class DismantleBarrierWorkOrderService {
  constructor(private $http: HttpClient) {}
  /** 获取拆除工单列表数据 */
  queryDismantleBarrierList_API(
    queryCondition: QueryConditionModel,
  ): Observable<ResultModel<any[]>> {
    return this.$http.post<ResultModel<any[]>>(
      `${WorkOrderRequestUrl.queryDismantleBarrierListURL}`,
      queryCondition,
    );
  }

  /** 拆除工单 导出 */
  exportDismantleWorkOrder_API(exportParams: ExportRequestModel): Observable<Result> {
    return this.$http.post<Result>(
      `${WorkOrderRequestUrl.exportDismantleWorkOrderURL}`,
      exportParams,
    );
  }
  /** 获取 拆除工单 今日新增工单 */
  getInsertDismantleBarrierCount_API(body): Observable<Object> {
    return this.$http.post(`${WorkOrderRequestUrl.getInsertDismantleBarrierCountURL}`, body);
  }

  /** 获取 拆除工单 获取工单状态数量 */
  queryDismantleBarrierCountByStatus_API(body): Observable<Result> {
    return this.$http.post(`${WorkOrderRequestUrl.queryDismantleBarrierCountByStatusURL}`, body);
  }

  /** 拆除工单名称唯一性校验 */
  checkDismantleBarrierName_API(name: string, id: string): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(
      `${WorkOrderRequestUrl.checkDismantleBarrierNameURL}`,
      {
        title: name,
        procId: id,
      },
    );
  }

  /** 根据设施名称 获取 拆除点位列表数据 */
  dismantlePointList_API(body): Observable<Result> {
    return this.$http.post(`${WorkOrderRequestUrl.dismantlePointListURL}`, body);
  }

  /** 新增 拆除工单 */
  insertDismantleBarrier_API(body): Observable<Result> {
    return this.$http.post(`${WorkOrderRequestUrl.insertDismantleBarrierURL}`, body);
  }

  /** 保存 选择的设备id */
  setSelectedEquipment_API(body): Observable<Result> {
    return this.$http.post(`${WorkOrderRequestUrl.setSelectedEquipmentURL}`, body);
  }

  /** 修改 拆除工单 */
  updateDismantleBarrier_API(body): Observable<Result> {
    return this.$http.post(`${WorkOrderRequestUrl.updateDismantleBarrierURL}`, body);
  }

  /** 重新生成历史工单 拆除工单 */
  refundDismantleGeneratedAgain_API(dismantleBarrierInsertEditFormModel: DismantleBarrierInsertEditFormModel,): Observable<Result> {
    return this.$http.post(`${WorkOrderRequestUrl.refundDismantleGeneratedAgainURL}`,dismantleBarrierInsertEditFormModel);
  }

  /** 删除 拆除工单 */
  deleteDismantleWorkOrder_API(body): Observable<Result> {
    return this.$http.post<Result>(`${WorkOrderRequestUrl.deleteDismantleWorkOrderURL}`, body);
  }

  /** 查询 拆除工单 未完成详情 */
  getDismantleFailureByIdForProcess_API(id: string): Observable<ResultModel<any>> {
    return this.$http.get<ResultModel<any>>(
      `${WorkOrderRequestUrl.getDismantleFailureByIdForProcessURL}/${id}`,
    );
  }

  /** 查询 拆除工单 责任单位 */
  queryDismantleUnit_API(body): Observable<Result> {
    return this.$http.post<Result>(`${WorkOrderRequestUrl.queryDismantleUnitURL}`, body);
  }

  /** 拆除工单 指派 */
  assignDismantleBarrier_API(body): Observable<Result> {
    return this.$http.post<Result>(`${WorkOrderRequestUrl.assignDismantleBarrierURL}`, body);
  }

  /** 拆除工单 撤回 */
  revokeDismatleBarrier_API(id: string): Observable<Result> {
    return this.$http.post<Result>(`${WorkOrderRequestUrl.revokeDismatleBarrierURL}`, {
      procId: id,
    });
  }

  /** 拆除工单 退单确认 */
  checkDismantleSingleBack_API(procId: string): Observable<Result> {
    return this.$http.post<Result>(`${WorkOrderRequestUrl.checkDismantleSingleBackURL}`, {
      procId: procId,
    });
  }

  /** 历史拆除工单 列表 */
  removeHistoryWorkOrderList_API(
    queryCondition: QueryConditionModel,
  ): Observable<ResultModel<DismantleBarrierWorkOrderModel[]>> {
    return this.$http.post<ResultModel<DismantleBarrierWorkOrderModel[]>>(
      `${WorkOrderRequestUrl.removeHistoryWorkOrderListURL}`,
      queryCondition,
    );
  }

  /** 历史拆除工单 导出 */
  exportDismantleHistoryWorkOrder_API(exportParams: ExportRequestModel): Observable<Result> {
    return this.$http.post(
      `${WorkOrderRequestUrl.exportDismantleHistoryWorkOrderURL}`,
      exportParams,
    );
  }

  // 查看图片
  queryImages(clearBarrierImagesModel: ClearBarrierImagesModel[]): Observable<Result> {
    return this.$http.post<Result>(`${WorkOrderRequestUrl.queryImage}`, clearBarrierImagesModel);
  }

  // 拆除工单 获取转派用户
  getRemoveUserList(body: TransferOrderParamModel): Observable<ResultModel<RoleUnitModel[]>> {
    return this.$http.post<ResultModel<RoleUnitModel[]>>(
      `${WorkOrderRequestUrl.getRemoveBarrierUserList}`,
      body,
    );
  }
  // 拆除工单 转派
  transferRemoveOrder(body: TransferOrderParamModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(
      `${WorkOrderRequestUrl.getRemoveBarrierTrans}`,
      body,
    );
  }

  /**
   * new设施列表请求
   */
  public deviceListByPageForListPage(
    queryCondition: QueryConditionModel,
  ): Observable<ResultModel<any[]>> {
    return this.$http.post<ResultModel<any[]>>(
      `${WorkOrderRequestUrl.deviceListByPageForListPage}`,
      queryCondition,
    );
  }
  public deviceListByPageForListPageNew(queryCondition: QueryConditionModel,): Observable<ResultModel<any[]>> {
    return this.$http.post<ResultModel<any[]>>(`${WorkOrderRequestUrl.deviceListByPageForListPageNew}`,queryCondition,);
  }
  public deviceListByPageForListPageNewWO(queryCondition: QueryConditionModel): Observable<ResultModel<any[]>> {
    return this.$http.post<ResultModel<any[]>>(WorkOrderRequestUrl.deviceListByPageForListPageNewWO,queryCondition,);
  }



  /**
   *  new查询设备列表
   */
  public equipmentListByPageForListPage(body: QueryConditionModel): Observable<ResultModel<any[]>> {
    return this.$http.post<ResultModel<any[]>>(
      WorkOrderRequestUrl.equipmentListByPageForListPage,
      body,
    );
  }
  public equipmentListByPageForListPageNew(body: QueryConditionModel): Observable<ResultModel<any[]>> {
    return this.$http.post<ResultModel<any[]>>(WorkOrderRequestUrl.equipmentListByPageForListPageNew,body,);
  }
  public listEquipmentForListPageNewWO(body: QueryConditionModel,): Observable<ResultModel<any[]>> {
    return this.$http.post<ResultModel<any[]>>(`${WorkOrderRequestUrl.listEquipmentForListPageNewWO}`,body,);
  }

  /** 历史拆除工单头部的设施echarts */
  queryRemoveOrderDeviceCount_API(): Observable<ResultModel<any[]>> {
    return this.$http.post<ResultModel<any[]>>(
      `${WorkOrderRequestUrl.queryRemoveOrderDeviceCountURL}`,
      {},
    );
  }
  /** 历史拆除工单头部的设备echarts */
  queryRemoveOrderEquipmentCount_API(): Observable<ResultModel<any[]>> {
    return this.$http.post<ResultModel<any[]>>(
      `${WorkOrderRequestUrl.queryRemoveOrderEquipmentCountURL}`,
      {},
    );
  }
  queryRemoveOrderStatusPercentage_API(): Observable<ResultModel<any[]>> {
    return this.$http.post<ResultModel<any[]>>(
      `${WorkOrderRequestUrl.queryRemoveOrderStatusPercentageURL}`,
      {},
    );
  }
}
