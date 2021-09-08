/**
 * 销障工单接口
 */
import {ClearBarrierWorkerOrderInterface} from './clear-barrier-worker-order.interface';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {WorkOrderRequestUrl} from '../work-order-request-url.const';
import {QueryConditionModel} from '../../../../../shared-module/model/query-condition.model';
import {Observable} from 'rxjs';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ClearBarrierWorkOrderModel} from '../../../../../core-module/model/work-order/clear-barrier-work-order.model';
import {ClearBarrierDepartmentModel} from '../../model/clear-barrier-model/clear-barrier-department.model';
import {ClearBarrierDeleteWorkOrderModel} from '../../model/clear-barrier-model/clear-barrier-delete-work-order.model';
import {ClearBarrierImagesModel} from '../../model/clear-barrier-model/clear-barrier-images.model';
import {ExportRequestModel} from '../../../../../shared-module/model/export-request.model';
import {SiteHandleDataModel} from '../../model/clear-barrier-model/site-handle-data.model';
import {RoleUnitModel} from '../../../../../core-module/model/work-order/role-unit.model';
import {PictureListModel} from '../../../../../core-module/model/picture/picture-list.model';
import {WorkOrderStatisticalModel} from '../../model/clear-barrier-model/work-order-statistical.model';
import {RepairOrderStatusCountModel} from '../../model/clear-barrier-model/repair-order-status-count.model';
import {WorkOrderEmptyModel} from '../../model/work-order-empty.model';
import {TransferOrderParamModel} from '../../model/clear-barrier-model/transfer-order-param.model';
import {AlarmWorkOrderModel} from '../../model/clear-barrier-model/alarm-work-order.model';


@Injectable()
export class ClearBarrierWorkOrderService implements ClearBarrierWorkerOrderInterface {
  constructor(
    private $http: HttpClient
  ) {}

  // 未完工销障工单列表
  getUnfinishedWorkOrderList(queryCondition: QueryConditionModel): Observable<ResultModel<ClearBarrierWorkOrderModel[]>> {
    return this.$http.post<ResultModel<ClearBarrierWorkOrderModel[]>>(`${WorkOrderRequestUrl.getUnfinishedClearBarrierWorkOrderListAll}`, queryCondition);
  }

  getHistoryWorkOrderList(queryCondition: QueryConditionModel): Observable<ResultModel<ClearBarrierWorkOrderModel[]>> {
    return this.$http.post<ResultModel<ClearBarrierWorkOrderModel[]>>(`${WorkOrderRequestUrl.getHistoryClearBarrierWorkOrderListAll}`, queryCondition);
  }

  getIncreaseStatistics(body: WorkOrderEmptyModel): Observable<ResultModel<number>> {
    return this.$http.post<ResultModel<number>>(`${WorkOrderRequestUrl.getIncreaseClearBarrierWorkOrderStatistics}`, body);
  }

  getStatisticsByErrorReason(body: WorkOrderEmptyModel): Observable<ResultModel<WorkOrderStatisticalModel[]>> {
    return this.$http.post<ResultModel<WorkOrderStatisticalModel[]>>(`${WorkOrderRequestUrl.getClearBarrierWorkOrderStatisticsByErrorReason}`, body);
  }

  getStatisticsByProcessingScheme(body: WorkOrderEmptyModel): Observable<ResultModel<WorkOrderStatisticalModel[]>> {
    return this.$http.post<ResultModel<WorkOrderStatisticalModel[]>>(`${WorkOrderRequestUrl.getClearBarrierWorkOrderStatisticsByProcessingScheme}`, body);
  }

  getStatisticsByDeviceType(body: WorkOrderEmptyModel): Observable<ResultModel<WorkOrderStatisticalModel[]>> {
    return this.$http.post<ResultModel<WorkOrderStatisticalModel[]>>(`${WorkOrderRequestUrl.getClearBarrierWorkOrderStatisticsByDeviceType}`, body);
  }

  getStatisticsByStatus(body: WorkOrderEmptyModel): Observable<ResultModel<WorkOrderStatisticalModel[]>> {
    return this.$http.post<ResultModel<WorkOrderStatisticalModel[]>>(`${WorkOrderRequestUrl.getClearBarrierWorkOrderStatisticsByStatus}`, body);
  }

  // 撤回工单
  revokeWorkOrder(id: string): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.revokeClearBarrierWorkOrder}`, {procId: id});
  }
  // 指派
  assignWorkOrder(clearBarrierDepartmentModel: ClearBarrierDepartmentModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.assignClearBarrierWorkOrder}`, clearBarrierDepartmentModel);
  }

  // 退单确认
  singleBackConfirm(procId: string): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.singleBackConfirm}`, {procId: procId});
  }

  // 新增工单
  addWorkOrder(body: ClearBarrierWorkOrderModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.addClearBarrierWorkOrder}`, body);
  }

  // 编辑工单
  updateWorkOrder(body:  ClearBarrierWorkOrderModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.updateClearBarrierWorkOrder}`, body);
  }

  // 删除工单
  deleteWorkOrder(clearBarrierDeleteWorkOrderModel: ClearBarrierDeleteWorkOrderModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.deleteClearBarrierWorkOrder}`, clearBarrierDeleteWorkOrderModel);
  }

  // 导出工单
  exportUnfinishedWorkOrder(exportParams: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.exportUnfinishedClearBarrierWorkOrder}`, exportParams);
  }

  // 导出历史工单
  exportHistoryWorkOrder(exportParams: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.exportHistoryClearBarrierWorkOrder}`, exportParams);
  }

  // 重新生成
  refundGeneratedAgain(clearBarrierWorkOrderModel: ClearBarrierWorkOrderModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.refundGeneratedAgain}`, clearBarrierWorkOrderModel);
  }

  // 获取工单详情
  getWorkOrderDetail(id: string): Observable<ResultModel<ClearBarrierWorkOrderModel>> {
    return this.$http.get<ResultModel<ClearBarrierWorkOrderModel>>(`${WorkOrderRequestUrl.getUnfinishedClearBarrierWorkOrderDetail}/${id}`);
  }
  // 查询未完成详情
  getClearFailureByIdForProcess(id: string): Observable<ResultModel<ClearBarrierWorkOrderModel>> {
    return this.$http.get<ResultModel<ClearBarrierWorkOrderModel>>(`${WorkOrderRequestUrl.getUnfinishedWorkOrderDetail}/${id}`);
  }
  // 查询历史详情
  getClearFailureByIdForComplete(id: string): Observable<ResultModel<ClearBarrierWorkOrderModel>> {
    return this.$http.get<ResultModel<ClearBarrierWorkOrderModel>>(`${WorkOrderRequestUrl.getHistoryWorkOrderDetail}/${id}`);
  }
  // 关联告警 REF_ALARM_INFO
  getRefAlarmInfo(queryCondition: QueryConditionModel): Observable<ResultModel<AlarmWorkOrderModel[]>> {
    return this.$http.post<ResultModel<AlarmWorkOrderModel[]>>(`${WorkOrderRequestUrl.refAlarmInfo}`, queryCondition);
  }
  // 查看图片
  queryImages(clearBarrierImagesModel: ClearBarrierImagesModel[]): Observable<ResultModel<PictureListModel[]>> {
    return this.$http.post<ResultModel<PictureListModel[]>>(`${WorkOrderRequestUrl.queryImage}`, clearBarrierImagesModel);
  }
  // 销账工单名称唯一性校验
  checkClearName(name: string, id: string): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.checkClearName}`, {title: name, procId: id});
  }
  // 未完工销账工单表格卡片统计
  clearStatisticsCard(body: WorkOrderEmptyModel): Observable<ResultModel<RepairOrderStatusCountModel[]>> {
    return this.$http.post<ResultModel<RepairOrderStatusCountModel[]>>(`${WorkOrderRequestUrl.clearTableCardStatic}`, body);
  }
  // 销障工单获取转派用户
  getClearUserList(body: TransferOrderParamModel): Observable<ResultModel<RoleUnitModel[]>> {
    return this.$http.post<ResultModel<RoleUnitModel[]>>(`${WorkOrderRequestUrl.getClearBarrierUserList}`, body);
  }
  // 销障工单转派
  transferClearOrder(body: TransferOrderParamModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.getClearBarrierTrans}`, body);
  }
  // 现场处理列表
  getSiteList(id: string): Observable<ResultModel<SiteHandleDataModel[]>> {
    return this.$http.get<ResultModel<SiteHandleDataModel[]>>(`${WorkOrderRequestUrl.siteHandleList}/${id}`);
  }
  // 数据校验
  checkDataRole(body: ClearBarrierWorkOrderModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.checkDataRoles}`, body);
  }
}
