import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WorkOrderStatisticalInterface } from './work-order-statistical.interface';
import { Observable } from 'rxjs';
import {
  SALES_ORDER_STATUS,
  SALES_ORDER_PROCESSING,
  SALES_ORDER_FAILURE,
  WORK_ORDER_DEVICE_TYPE,
  SALES_ORDER_AREA_PERCENT,
  SALES_ORDER_UNITS,
  WORK_ORDER_INCREMENT,
  CLEAR_BARRIER_DEVICE_TYPE_EXPORT,
  CLEAR_BARRIER_STATUS_EXPORT,
  CLEAR_BARRIER_PROCESSING_EXPORT,
  CLEAR_BARRIER_FAILURE_EXPORT,
  CLEAR_BARRIER_AREA_PERCENT_EXPORT,
  INSPECTION_DEVICE_TYPE_EXPORT,
  INSPECTION_STATUS_EXPORT,
  INSPECTION_AREA_PERCENT_EXPORT,
  DISMANTLE_DEVICE_TYPE_EXPORT,
  DISMANTLE_STATUS_EXPORT,
  DISMANTLE_AREA_PERCENT_EXPORT
} from '../statistical-request-url';

@Injectable()
export class WorkOrderStatisticalService implements WorkOrderStatisticalInterface {

  constructor(private $http: HttpClient) { }
  /**
   *销账工单状态统计
   */
  querySalesOrderStatus(body): Observable<Object> {
    return this.$http.post(`${SALES_ORDER_STATUS}`, body);
  }



  /**
  *历史销账工单处理方案统计
  */
  querySalesOrderProcessing(body): Observable<Object> {
    return this.$http.post(`${SALES_ORDER_PROCESSING}`, body);
  }

  /**
  *销账工单故障原因统计
  */
  querySalesOrderFailure(body): Observable<Object> {
    return this.$http.post(`${SALES_ORDER_FAILURE}`, body);
  }


  /**
    *工单设施类型统计
    */
  queryWorkOrderDeviceType(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_DEVICE_TYPE}`, body);
  }


  /**
   *工单区域工单比统计
   */
  querySalesOrderAreaPercent(body): Observable<Object> {
    return this.$http.post(`${SALES_ORDER_AREA_PERCENT}`, body);
  }


  /**
   *历史销账工单处理单位统计
   */
  querySalesOrderUnits(body): Observable<Object> {
    return this.$http.post(`${SALES_ORDER_UNITS}`, body);
  }

  /**
   * 工单增量统计
   */
  queryWorkOrderIncrement(body): Observable<Object> {
    return this.$http.post(`${WORK_ORDER_INCREMENT}`, body);
  }


  /**
   * 销障工单统计设施类型导出
   */
  clearBarrierDeviceTypeExport(body): Observable<Object> {
    return this.$http.post(`${CLEAR_BARRIER_DEVICE_TYPE_EXPORT}`, body);
  }


  /**
 * 销障工单统计状态导出
 */
  clearBarrierStatusExport(body): Observable<Object> {
    return this.$http.post(`${CLEAR_BARRIER_STATUS_EXPORT}`, body);
  }

  /**
 * 销障工单统计处理方案导出
 */
  clearBarrierProcessingExport(body): Observable<Object> {
    return this.$http.post(`${CLEAR_BARRIER_PROCESSING_EXPORT}`, body);
  }


  /**
* 销障工单统计故障原因导出
*/
  clearBarrierFailureExport(body): Observable<Object> {
    return this.$http.post(`${CLEAR_BARRIER_FAILURE_EXPORT}`, body);
  }


  /**
* 销障工单统计区域比导出
*/
  clearBarrierAreaPercentExport(body): Observable<Object> {
    return this.$http.post(`${CLEAR_BARRIER_AREA_PERCENT_EXPORT}`, body);
  }


  /**
   *  巡检工单设施类型导出
   */
  inspectionDeviceTypeExport(body): Observable<Object> {
    return this.$http.post(`${INSPECTION_DEVICE_TYPE_EXPORT}`, body);
  }


  /**
* 巡检工单统计状态导出
*/
  inspectionStatusExport(body): Observable<Object> {
    return this.$http.post(`${INSPECTION_STATUS_EXPORT}`, body);
  }


  /**
  * 巡检工单统计区域比导出
  */
  inspectionAreaPercentExport(body): Observable<Object> {
    return this.$http.post(`${INSPECTION_AREA_PERCENT_EXPORT}`, body);
  }

  /**
   *  拆除工单设施类型导出
   */
  dismantleDeviceTypeExport(body): Observable<Object> {
    return this.$http.post(`${DISMANTLE_DEVICE_TYPE_EXPORT}`, body);
  }

  /**
   * 拆除工单统计状态导出
   */
  dismantleStatusExport(body): Observable<Object> {
    return this.$http.post(`${DISMANTLE_STATUS_EXPORT}`, body);
  }


  /**
   * 拆除工单统计区域比导出
   */
  dismantleAreaPercentExport(body): Observable<Object> {
    return this.$http.post(`${DISMANTLE_AREA_PERCENT_EXPORT}`, body);
  }
}

