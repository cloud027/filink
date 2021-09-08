import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {QueryConditionModel} from '../../../../../shared-module/model/query-condition.model';
import {Observable} from 'rxjs';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {WorkOrderRequestUrl} from '../work-order-request-url.const';
import {AlarmConfirmWorkOrderModel} from '../../../../../core-module/model/work-order/alarm-confirm.model';
import {WorkOrderStatisticalModel} from '../../model/clear-barrier-model/work-order-statistical.model';
import {AssignDepartmentModel} from '../../model/assign-department.model';
import {TransferOrderParamModel} from '../../model/clear-barrier-model/transfer-order-param.model';
import {RoleUnitModel} from '../../../../../core-module/model/work-order/role-unit.model';
import {ExportRequestModel} from '../../../../../shared-module/model/export-request.model';

/**
 * 告警确认工单接口
 */
@Injectable()
export class AlarmConfirmWorkOrderService {
  constructor(
    private $http: HttpClient
  ) {}
  /**
   * 未完工告警确认工单列表查询
   */
  getUnfinishedAlarmConfirmList(queryCondition: QueryConditionModel): Observable<ResultModel<AlarmConfirmWorkOrderModel[]>> {
    return this.$http.post<ResultModel<AlarmConfirmWorkOrderModel[]>>(WorkOrderRequestUrl.unfinishedAlarmConfirm, queryCondition);
  }

  /***
   * 新增告警确认工单
   */
  addAlarmConfirmOrder(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(WorkOrderRequestUrl.addAlarmConfirmOrder, body);
  }

  /**
   * 编辑告警确认工单
   */
  editAlarmConfirmOrder(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(WorkOrderRequestUrl.editAlarmConfirmOrder, body);
  }

  /**
   * 根据id查询详情
   */
  getOrderDetailById(id: string): Observable<ResultModel<AlarmConfirmWorkOrderModel>> {
    return this.$http.get<ResultModel<AlarmConfirmWorkOrderModel>>(`${WorkOrderRequestUrl.getDetailById}/${id}`);
  }

  /**
   * 删除告警确认工单
   */
  deleteAlarmConfirm(body: {procIdList: string[], procType: string}): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(WorkOrderRequestUrl.deleteAlarmConfirmOrder, body);
  }
  /**
   * 历史告警确认工单列表
   */
  finishedAlarmConfirm(queryCondition: QueryConditionModel): Observable<ResultModel<AlarmConfirmWorkOrderModel[]>> {
    return this.$http.post<ResultModel<AlarmConfirmWorkOrderModel[]>>(WorkOrderRequestUrl.finishedAlarmConfirmOrder, queryCondition);
  }

  /**
   * 告警工单名称唯一性校验
   */
  checkOrderName(name: string, id: string): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(WorkOrderRequestUrl.checkAlarmOrderName, {title: name, procId: id});
  }

  /**
   * 未完工告警确认工单卡片统计
   */
  alarmStatisticCard(): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(WorkOrderRequestUrl.alarmOrderCardStatistics, {});
  }
  /**
   * 告警卡片统计今日新增
   */
  alarmCardTodayAdd(): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(WorkOrderRequestUrl.alarmOrderCardTodayAdd, {});
  }

  /**
   * 历史告警工单告警类别统计
   */
  historyAlarmOrder(): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(WorkOrderRequestUrl.historyAlarmOrderChart, {});
  }
  /**
   * 历史告警工单工单状态统计
   */
  historyOrderStatus(): Observable<ResultModel<WorkOrderStatisticalModel[]>> {
    return this.$http.post<ResultModel<WorkOrderStatisticalModel[]>>(WorkOrderRequestUrl.historyOrderStatusChart, {});
  }

  /**
   * 工单指派
   */
  assignAlarmOrder(body: AssignDepartmentModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(WorkOrderRequestUrl.assignedAlarmOrder, body);
  }

  /**
   *  工单撤回
   */
  workOrderWithdrawal(body: {procId: string}): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(WorkOrderRequestUrl.backOrder, body);
  }

  /**
   * 退单确认
   */
  chargebackOrder(id: string): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(WorkOrderRequestUrl.sendBackAlarmWorkOrder, {procId: id});
  }

  /**
   * 获取转派用户
   */
  getAlarmUser(body: TransferOrderParamModel): Observable<ResultModel<RoleUnitModel[]>> {
    return this.$http.post<ResultModel<RoleUnitModel[]>>(WorkOrderRequestUrl.getTurnUser, body);
  }

  /**
   * 转派
   */
  transAlarmOrder(body: TransferOrderParamModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(WorkOrderRequestUrl.turnAlarmOrder, body);
  }

  /**
   * 未完工告警确认工单导出
   */
  alarmOrderExport(body: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(WorkOrderRequestUrl.exportAlarmOrder, body);
  }

  /**
   * 历史告警工单根据id获取详情
   */
  historyDetailById(id: string): Observable<ResultModel<AlarmConfirmWorkOrderModel>> {
    return this.$http.get<ResultModel<AlarmConfirmWorkOrderModel>>(`${WorkOrderRequestUrl.getHistoryDetailById}/${id}`);
  }

  /**
   * 告警确认工单重新生成
   */
  regenerateAlarmOrder(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(WorkOrderRequestUrl.regenerateAlarmOrder, body);
  }
  /**
   * 未完工告警确认工单导出
   */
  alarmHistoryOrderExport(body: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(WorkOrderRequestUrl.exportAlarmHistoryOrder, body);
  }

  /**
   * 历史告警确认工单设备类型统计
   */
  alarmEquipmentTypes(): Observable<ResultModel<WorkOrderStatisticalModel[]>> {
    return this.$http.post<ResultModel<WorkOrderStatisticalModel[]>>(WorkOrderRequestUrl.alarmOrderEquipment, {});
  }
}
