import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {WORK_ORDER_URL} from '../const/work-order-url';
import {ResultModel} from '../../../../shared-module/model/result.model';

@Injectable()
export class WorkOrderService {

  constructor(private $http: HttpClient) {
  }

  /**
   *销账工单状态统计
   */
  querySalesOrderStatus(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.SALES_ORDER_STATUS}`, body);
  }

  /**
   *销账工单状态统计
   */
  queryRepairOrderStatusCount(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.QUERY_REPAIR_ORDER_STATUS_COUNT}`, body);
  }


  /**
   *历史销账工单处理方案统计
   */
  querySalesOrderProcessing(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.SALES_ORDER_PROCESSING}`, body);
  }

  /**
   *历史销账工单处理方案统计
   */
  queryRepairOrderTreatmentPlanCount(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.QUERY_REPAIR_ORDER_TREATMENT_PLAN_COUNT}`, body);
  }

  /**
   *销账工单故障原因统计
   */
  querySalesOrderFailure(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.SALES_ORDER_FAILURE}`, body);
  }

  /**
   *销账工单故障原因统计
   */
  queryRepairOrderCauseReasonCount(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(`${WORK_ORDER_URL.QUERY_REPAIR_ORDER_CAUSE_REASON_COUNT}`, body);
  }

  /**
   *工单设施类型统计
   */
  queryWorkOrderDeviceType(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.WORK_ORDER_DEVICE_TYPE}`, body);
  }

  /**
   *销障工单设施类型统计
   */
  queryRepairOrderDeviceCount(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.QUERY_REPAIR_ORDER_DEVICE_COUNT}`, body);
  }

  /**
   *巡检工单设施类型统计
   */
  queryInspectionDeviceCount(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.QUERY_INSPECTION_DEVICE_COUNT}`, body);
  }

  /**
   *工单区域工单比统计
   */
  querySalesOrderAreaPercent(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.SALES_ORDER_AREA_PERCENT}`, body);
  }

  /**
   *工单区域工单比统计
   */
  queryProcCount(body): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(`${WORK_ORDER_URL.QUERY_PROC_COUNT}`, body);
  }


  /**
   *历史销账工单处理单位统计
   */
  querySalesOrderUnits(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.SALES_ORDER_UNITS}`, body);
  }

  /**
   * 工单增量统计
   */
  queryWorkOrderIncrement(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.WORK_ORDER_INCREMENT}`, body);
  }


  /**
   * 销障工单统计设施类型导出
   */
  clearBarrierDeviceTypeExport(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.CLEAR_BARRIER_DEVICE_TYPE_EXPORT}`, body);
  }


  /**
   * 销障工单统计状态导出
   */
  clearBarrierStatusExport(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.CLEAR_BARRIER_STATUS_EXPORT}`, body);
  }

  /**
   * 销障工单统计处理方案导出
   */
  clearBarrierProcessingExport(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.CLEAR_BARRIER_PROCESSING_EXPORT}`, body);
  }


  /**
   * 销障工单统计故障原因导出
   */
  clearBarrierFailureExport(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.CLEAR_BARRIER_FAILURE_EXPORT}`, body);
  }


  /**
   * 销障工单统计区域比导出
   */
  clearBarrierAreaPercentExport(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.CLEAR_BARRIER_AREA_PERCENT_EXPORT}`, body);
  }


  /**
   *  巡检工单设施类型导出
   */
  inspectionDeviceTypeExport(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.INSPECTION_DEVICE_TYPE_EXPORT}`, body);
  }


  /**
   * 巡检工单统计状态导出
   */
  inspectionStatusExport(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.INSPECTION_STATUS_EXPORT}`, body);
  }
  /**
   * 拆除工单统计状态导出
   */
  dismantleStatusExport(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.DISMANTLE_STATUS_EXPORT}`, body);
  }

  /**
   * 巡检工单统计区域比导出
   */
  inspectionAreaPercentExport(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.INSPECTION_AREA_PERCENT_EXPORT}`, body);
  }


  /**
   * 拆除工单统计区域比导出
   */
  dismantleAreaPercentExport(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.DISMANTLE_AREA_PERCENT_EXPORT}`, body);
  }

  /**
   *  拆除工单设施类型导出
   */
  dismantleDeviceTypeExport(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_URL.DISMANTLE_DEVICE_TYPE_EXPORT}`, body);
  }




}

