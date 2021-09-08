import {Observable} from 'rxjs';
import {
  ClearWorkOrderModel, InspectionWorkOrderModel,
  WorkOrderConditionModel, WorkOrderStateResultModel,
  WorkOrderTypeModel
} from '../../../../business-module/index/shared/model/work-order-condition.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {LogModel} from '../../../../business-module/index/shared/model/log-operating.model';
import {DetailsCardAlarmModel} from '../../../../business-module/index/shared/model/alarm.model';
import {AlarmCategoryEnum} from '../../../enum/alarm/alarm-category.enum';
import {IndexWorkOrderTypeEnum} from '../../../enum/work-order/work-order.enum';
import {RemoveWorkOrderModel} from '../../../model/work-order/remove-work-order.model';

export interface IndexWorkOrderInterface {
  /**
   * 首页工单数量统计
   * returns {Observable<Object>}
   */
  queryProcCountOverviewForHome(body: WorkOrderConditionModel): Observable<ResultModel<WorkOrderTypeModel[]>>;

  /**
   * 首页销障工单列表
   * returns {Observable<Object>}
   */
  queryClearListForHome(body: QueryConditionModel): Observable<ResultModel<ClearWorkOrderModel[]>>;
  queryRemoveListForHome(body: QueryConditionModel): Observable<ResultModel<RemoveWorkOrderModel[]>>;

  /**
   * 查询巡检工单列表
   * returns {Observable<Object>}
   */
  queryInspectionListForHome(body: QueryConditionModel): Observable<ResultModel<InspectionWorkOrderModel[]>>;

  /**
   * 查询各工单类型及其下工单数量
   * returns {Observable<Object>}
   */
  queryListOverviewGroupByProcStatusForHome(body: WorkOrderConditionModel): Observable<ResultModel<WorkOrderStateResultModel[]>>;

  /**
   * 获取详情卡中工单列表
   * param {string} type
   * param {QueryConditionModel} body
   * returns {Observable<ResultModel<InspectionWorkOrderModel[]>>}
   */
  queryWorkOrderListByIdForHome(orderType: IndexWorkOrderTypeEnum, type: string, body: QueryConditionModel): Observable<ResultModel<InspectionWorkOrderModel[]>>;

  /**
   * 获取详情卡中当前和历史告警列表
   * param {AlarmCategoryEnum} type
   * param {QueryConditionModel} body
   * returns {Observable<ResultModel<DetailsCardAlarmModel[]>>}
   */
  getAlarmInfoListById(type: AlarmCategoryEnum, body: QueryConditionModel): Observable<ResultModel<DetailsCardAlarmModel[]>>;

  /**
   * 获取设施详情卡中历史告警列表
   * returns {Observable<Object>}
   */
  getAlarmHisInfoListById(body: QueryConditionModel): Observable<ResultModel<DetailsCardAlarmModel[]>>;

  /**
   * 获取详情卡中日志列表
   * returns {Observable<Object>}
   */
  deviceLogListByPage(body: QueryConditionModel): Observable<ResultModel<LogModel[]>>;
}
