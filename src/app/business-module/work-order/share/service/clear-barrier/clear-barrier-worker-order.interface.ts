import {Observable} from 'rxjs';
import {QueryConditionModel} from '../../../../../shared-module/model/query-condition.model';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {ClearBarrierWorkOrderModel} from '../../../../../core-module/model/work-order/clear-barrier-work-order.model';
import {ClearBarrierDeleteWorkOrderModel} from '../../model/clear-barrier-model/clear-barrier-delete-work-order.model';
import {ClearBarrierDepartmentModel} from '../../model/clear-barrier-model/clear-barrier-department.model';
import {ExportRequestModel} from '../../../../../shared-module/model/export-request.model';
import {RoleUnitModel} from '../../../../../core-module/model/work-order/role-unit.model';
import {SiteHandleDataModel} from '../../model/clear-barrier-model/site-handle-data.model';
import {WorkOrderStatisticalModel} from '../../model/clear-barrier-model/work-order-statistical.model';
import {RepairOrderStatusCountModel} from '../../model/clear-barrier-model/repair-order-status-count.model';
import {PictureListModel} from '../../../../../core-module/model/picture/picture-list.model';
import {WorkOrderEmptyModel} from '../../model/work-order-empty.model';
import {ClearBarrierImagesModel} from '../../model/clear-barrier-model/clear-barrier-images.model';
import {TransferOrderParamModel} from '../../model/clear-barrier-model/transfer-order-param.model';
import {AlarmWorkOrderModel} from '../../model/clear-barrier-model/alarm-work-order.model';
/**
 * 销障工单接口
 */
export interface ClearBarrierWorkerOrderInterface {
  /**
   * 获取未完工销障工单
   * param body
   * returns {Observable<Object>}
   */
  getUnfinishedWorkOrderList(queryCondition: QueryConditionModel): Observable<ResultModel<ClearBarrierWorkOrderModel[]>>;

  /**
   * 获取历史销障工单
   * param body
   * returns {Observable<Object>}
   */
  getHistoryWorkOrderList(queryCondition: QueryConditionModel): Observable<ResultModel<ClearBarrierWorkOrderModel[]>>;


  /**
   * 新增销障工单
   * param body
   * returns {Observable<Object>}
   */
  addWorkOrder(body: ClearBarrierWorkOrderModel): Observable<ResultModel<string>>;

  /**
   * 获取工单详情
   */
  getWorkOrderDetail(id: string): Observable<ResultModel<ClearBarrierWorkOrderModel>>;

  /**
   * 编辑销障工单
   * param body
   * returns {Observable<Object>}
   */
  updateWorkOrder(body: ClearBarrierWorkOrderModel): Observable<ResultModel<string>>;

  /**
   * 删除销障工单
   * param body
   * returns {Observable<Object>}
   */
  deleteWorkOrder(clearBarrierDeleteWorkOrderModel: ClearBarrierDeleteWorkOrderModel): Observable<ResultModel<string>>;

  /**
   * 销账工单列表今日新增统计
   * returns {Observable<Object>}
   */
  getIncreaseStatistics(body: WorkOrderEmptyModel): Observable<ResultModel<number>>;

  /**
   * 故障原因统计的销障工单信息
   * returns {Observable<Object>}
   */
  getStatisticsByErrorReason(body: WorkOrderEmptyModel): Observable<ResultModel<WorkOrderStatisticalModel[]>>;

  /**
   * 处理方案统计的销障工单信息
   * returns {Observable<Object>}
   */
  getStatisticsByProcessingScheme(body: WorkOrderEmptyModel): Observable<ResultModel<WorkOrderStatisticalModel[]>>;

  /**
   * 设施类型统计的销障工单信息
   * returns {Observable<Object>}
   */
  getStatisticsByDeviceType(body: WorkOrderEmptyModel): Observable<ResultModel<WorkOrderStatisticalModel[]>>;

  /**
   * 工单状态统计的销障工单信息
   * returns {Observable<Object>}
   */
  getStatisticsByStatus(body: WorkOrderEmptyModel): Observable<ResultModel<WorkOrderStatisticalModel[]>>;

  /**
   * 撤回工单
   * param body
   * returns {Observable<Object>}
   */
  revokeWorkOrder(id: string): Observable<ResultModel<string>>;

  /**
   * 指派工单
   * param body
   * param ids
   * returns {Observable<Object>}
   */
  assignWorkOrder(clearBarrierDepartmentModel: ClearBarrierDepartmentModel): Observable<ResultModel<string>>;

  /**
   * 退单确认
   * param body
   * returns {Observable<Object>}
   */
  singleBackConfirm(body: string): Observable<ResultModel<string>>;

  /**
   * 导出未完工销障工单
   * param body
   * returns {Observable<Object>}
   */
  exportUnfinishedWorkOrder(exportParams: ExportRequestModel): Observable<ResultModel<string>>;

  /**
   * 导出历史销障工单
   * param body
   * returns {Observable<Object>}
   */
  exportHistoryWorkOrder(exportParams: ExportRequestModel): Observable<ResultModel<string>>;

  /**
   * 退单重新生成
   */
  refundGeneratedAgain(clearBarrierWorkOrderModel: ClearBarrierWorkOrderModel): Observable<ResultModel<string>>;

  /**
   * 查询未完成工单详情
   */
  getClearFailureByIdForProcess(id: string): Observable<ResultModel<ClearBarrierWorkOrderModel>>;

  /**
   * 查询历史工单详情
   */
  getClearFailureByIdForComplete(id: string): Observable<ResultModel<ClearBarrierWorkOrderModel>>;

  /**
   * 关联告警
   */
  getRefAlarmInfo(queryCondition: QueryConditionModel): Observable<ResultModel<AlarmWorkOrderModel[]>>;

  /**
   * 查看图片
   */
  queryImages(body: ClearBarrierImagesModel[]): Observable<ResultModel<PictureListModel[]>>;

  /**
   * 销账工单名称唯一性校验
   */
  checkClearName(name: string, id: string): Observable<ResultModel<string>>;

  /**
   *  未完工销账工单表格卡片统计
   */
  clearStatisticsCard(body: WorkOrderEmptyModel): Observable<ResultModel<RepairOrderStatusCountModel[]>>;

  /**
   * 销障工单获取转派用户
   */
  getClearUserList(body: TransferOrderParamModel): Observable<ResultModel<RoleUnitModel[]>>;

  /**
   * 销障工单转派
   */
  transferClearOrder(body: TransferOrderParamModel): Observable<ResultModel<string>>;

  /**
   *  现场处理列表
   */
  getSiteList(id: string): Observable<ResultModel<SiteHandleDataModel[]>>;

}
