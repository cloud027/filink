import {IndexWorkOrderInterface} from './index-work-order.interface';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ALARM_CURRENT_SERVER, ALARM_HISTORY_SERVER, DEVICE_SERVER, WORK_ORDER_SERVER} from '../../api-common.config';
import {
  ClearWorkOrderModel,
  InspectionAndClearModel,
  InspectionWorkOrderModel,
  WorkOrderConditionModel,
  WorkOrderStateResultModel,
  WorkOrderTypeModel
} from '../../../../business-module/index/shared/model/work-order-condition.model';
import {QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {LogModel} from '../../../../business-module/index/shared/model/log-operating.model';
import {DetailsCardAlarmModel} from '../../../../business-module/index/shared/model/alarm.model';
import {AlarmCategoryEnum} from '../../../enum/alarm/alarm-category.enum';
import {IndexWorkOrderTypeEnum} from '../../../enum/work-order/work-order.enum';
import {MapTypeEnum} from '../../../enum/index/index.enum';
import {RemoveWorkOrderModel} from '../../../model/work-order/remove-work-order.model';
import {InstallWorkOrderModel} from '../../../model/work-order/install-work-order.model';
import {AlarmConfirmWorkOrderModel} from '../../../model/work-order/alarm-confirm.model';

@Injectable()
export class IndexWorkOrderService implements IndexWorkOrderInterface {
  constructor(private $http: HttpClient) {
  }

  // 首页工单数量统计
  queryProcCountOverviewForHome(body: WorkOrderConditionModel): Observable<ResultModel<WorkOrderTypeModel[]>> {
    return this.$http.post<ResultModel<WorkOrderTypeModel[]>>(`${WORK_ORDER_SERVER}/repairOrder/queryProcCountOverviewForHome`, body);
  }

  // 首页销障工单列表
  queryClearListForHome(body: QueryConditionModel): Observable<ResultModel<ClearWorkOrderModel[]>> {
    return this.$http.post<ResultModel<ClearWorkOrderModel[]>>(`${WORK_ORDER_SERVER}/repairOrder/queryClearListForHome`, body);
  }

  // 首页安装工单列表
  queryInstallListForHome(body: QueryConditionModel): Observable<ResultModel<InstallWorkOrderModel[]>> {
    return this.$http.post<ResultModel<InstallWorkOrderModel[]>>(`${WORK_ORDER_SERVER}/procInstall/queryInstallListForHome`, body);
  }

  // 首页告警确认工单列表
  queryConfirmListForHome(body: QueryConditionModel): Observable<ResultModel<AlarmConfirmWorkOrderModel[]>> {
    return this.$http.post<ResultModel<AlarmConfirmWorkOrderModel[]>>(`${WORK_ORDER_SERVER}/procConfirm/queryProcConfirmListForHome`, body);
  }

  // 首页销障工单列表
  queryRemoveListForHome(body: QueryConditionModel): Observable<ResultModel<RemoveWorkOrderModel[]>> {
    return this.$http.post<ResultModel<RemoveWorkOrderModel[]>>(`${WORK_ORDER_SERVER}/removeOrder/queryRemoveListForHome`, body);
  }

  // 查询巡检工单列表
  queryInspectionListForHome(body: QueryConditionModel): Observable<ResultModel<InspectionWorkOrderModel[]>> {
    return this.$http.post<ResultModel<InspectionWorkOrderModel[]>>(`${WORK_ORDER_SERVER}/inspectionOrder/queryInspectionListForHome`, body);
  }

  // 首页查询工单状态统计
  queryListOverviewGroupByProcStatusForHome(body: WorkOrderConditionModel): Observable<ResultModel<WorkOrderStateResultModel[]>> {
    return this.$http.post<ResultModel<WorkOrderStateResultModel[]>>
    (`${WORK_ORDER_SERVER}/repairOrder/queryListOverviewGroupByProcStatusForHome`, body);
  }

  // 获取详情卡中工单列表
  queryWorkOrderListByIdForHome(orderType: IndexWorkOrderTypeEnum, type: string, body: QueryConditionModel): Observable<ResultModel<InspectionAndClearModel[]>> {
    if (orderType === IndexWorkOrderTypeEnum.inspection) {
      if (type === MapTypeEnum.facility) {
        // 设施巡检
        return this.$http.post<ResultModel<InspectionAndClearModel[]>>(`${WORK_ORDER_SERVER}/inspectionOrder/queryInspectionListByDeviceIdForHome`, body);
      } else {
        // 设备巡检
        return this.$http.post<ResultModel<InspectionAndClearModel[]>>(`${WORK_ORDER_SERVER}/inspectionOrder/queryInspectionListByIdForHome`, body);
      }
    }
    if (orderType === IndexWorkOrderTypeEnum.clearFailure) {
      if (type === MapTypeEnum.facility) {
        // 设施销障
        return this.$http.post<ResultModel<InspectionAndClearModel[]>>(`${WORK_ORDER_SERVER}/repairOrder/queryClearListByDeviceIdForHome`, body);
      } else {
        // 设备销障
        return this.$http.post<ResultModel<InspectionAndClearModel[]>>(`${WORK_ORDER_SERVER}/repairOrder/queryClearListByEquipmentIdForHome`, body);
      }
    }
    if (orderType === IndexWorkOrderTypeEnum.remove) {
      if (type === MapTypeEnum.facility) {
        // 设施销障
        return this.$http.post<ResultModel<InspectionAndClearModel[]>>(`${WORK_ORDER_SERVER}/removeOrder/queryRemoveListByDeviceIdForHome`, body);
      } else {
        // 设备销障
        return this.$http.post<ResultModel<InspectionAndClearModel[]>>(`${WORK_ORDER_SERVER}/removeOrder/queryRemoveListByEquipmentIdForHome`, body);
      }
    }

  }

  // 获取详情卡中当前和历史告警列表
  getAlarmInfoListById(type: AlarmCategoryEnum, body: QueryConditionModel): Observable<ResultModel<DetailsCardAlarmModel[]>> {
    if (type === AlarmCategoryEnum.currentAlarm) {
      // 当前告警
      return this.$http.post<ResultModel<DetailsCardAlarmModel[]>>(`${ALARM_CURRENT_SERVER}/alarmCurrent/getAlarmInfoListById`, body);
    } else {
      // 历史告警
      return this.$http.post<ResultModel<DetailsCardAlarmModel[]>>(`${ALARM_HISTORY_SERVER}/alarmHistory/getAlarmHisInfoListById`, body);
    }
  }

  // 获取设施详情卡中历史告警列表
  getAlarmHisInfoListById(body: QueryConditionModel): Observable<ResultModel<DetailsCardAlarmModel[]>> {
    return this.$http.post<ResultModel<DetailsCardAlarmModel[]>>(`${ALARM_HISTORY_SERVER}/alarmHistory/getAlarmHisInfoListById`, body);
  }

  // 获取详情卡中日志列表
  deviceLogListByPage(body: QueryConditionModel): Observable<ResultModel<LogModel[]>> {
    return this.$http.post<ResultModel<LogModel[]>>(`${DEVICE_SERVER }/deviceLog/deviceLogListByPage`, body);
  }
}
