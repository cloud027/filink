import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {WorkOrderRequestUrl} from '../work-order-request-url.const';
import {QueryConditionModel} from '../../../../../shared-module/model/query-condition.model';
import {InstallWorkOrderModel} from '../../../../../core-module/model/work-order/install-work-order.model';
import {InspectionReportParamModel} from '../../model/inspection-report-param.model';
import {WorkOrderStatisticalModel} from '../../model/clear-barrier-model/work-order-statistical.model';
import {ExportRequestModel} from '../../../../../shared-module/model/export-request.model';
import {AssignDepartmentModel} from '../../model/assign-department.model';
import {TransferOrderParamModel} from '../../model/clear-barrier-model/transfer-order-param.model';
import {RoleUnitModel} from '../../../../../core-module/model/work-order/role-unit.model';
import {OrderEquipmentModel} from '../../model/install-work-order/order-equipment.model';
import {EquipmentListModel} from '../../../../../core-module/model/equipment/equipment-list.model';

/**
 * 安装工单接口请求
 */
@Injectable()
export class InstallWorkOrderService {
  constructor(
    private $http: HttpClient
  ) {}

  /**
   * 未完工安装工单列表查询
   */
  unfinishedOrderList(body: QueryConditionModel): Observable<ResultModel<InstallWorkOrderModel[]>> {
    return this.$http.post<ResultModel<InstallWorkOrderModel[]>>(WorkOrderRequestUrl.unfinishedInstallOrderList, body);
  }

  /**
   * 根据id查询详情
   */
  getDetailById(id: string): Observable<ResultModel<InstallWorkOrderModel>> {
    return this.$http.get<ResultModel<InstallWorkOrderModel>>(`${WorkOrderRequestUrl.queryInstallById}/${id}`);
  }

  /**
   *  新增工单
   */
  addInstallWorkOrder(body: InstallWorkOrderModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(WorkOrderRequestUrl.addInstallOrder, body);
  }

  /**
   * 编辑安装工单
   */
  editInstallWorkOrder(body: InstallWorkOrderModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(WorkOrderRequestUrl.editInstallOrder, body);
  }

  /**
   * 删除工单
   */
  deleteInstallWorkOrder(ids: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(WorkOrderRequestUrl.deleteInstallOrder, ids);
  }

  /**
   * 名称校验
   */
  checkInstallOrderName(name: string, id: string): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(WorkOrderRequestUrl.checkInstallOrderName, {title: name, id: id});
  }

  /**
   * 根据设施id查询挂载位置
   */
  findMountPositionById(body: InspectionReportParamModel): Observable<ResultModel<string[]>> {
    return this.$http.post<ResultModel<string[]>>(WorkOrderRequestUrl.findMountPositionById, body);
  }

  /**
   * 未完工安装工单状态统计
   */
  installStatusStatistics(): Observable<ResultModel<WorkOrderStatisticalModel[]>> {
    return this.$http.post<ResultModel<WorkOrderStatisticalModel[]>>(WorkOrderRequestUrl.unfinishedInstallOrder, {});
  }
  /**
   * 未完工安装工单今日新增
   */
  installStatusAdd(): Observable<ResultModel<WorkOrderStatisticalModel[]>> {
    return this.$http.post<ResultModel<WorkOrderStatisticalModel[]>>(WorkOrderRequestUrl.installOrder, {});
  }

  /**
   * 历史安装工单列表查询
   */
  historyInstallList(body: QueryConditionModel): Observable<ResultModel<InstallWorkOrderModel[]>> {
    return this.$http.post<ResultModel<InstallWorkOrderModel[]>>(WorkOrderRequestUrl.historyInstallOrder, body);
  }

  /**
   * 根据id查询历史安装工单的信息
   */
  historyDetailById(id: string): Observable<ResultModel<InstallWorkOrderModel>> {
    return this.$http.get<ResultModel<InstallWorkOrderModel>>(`${WorkOrderRequestUrl.historyOrderDetail}/${id}`);
  }

  /**
   * 历史安装工单状态统计百分比
   */
  historyStatusStatistics(): Observable<ResultModel<WorkOrderStatisticalModel[]>> {
    return this.$http.post<ResultModel<WorkOrderStatisticalModel[]>>(WorkOrderRequestUrl.historyOrderStatus, {});
  }

  /**
   * 设备类型统计的安装工单信息统计
   */
  equipmentStatistics(): Observable<ResultModel<WorkOrderStatisticalModel[]>> {
    return this.$http.post<ResultModel<WorkOrderStatisticalModel[]>>(WorkOrderRequestUrl.historyEquipment, {});
  }

  /**
   * 未完工安装工导出
   */
  unfinishedExport(exportParams: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(WorkOrderRequestUrl.exportInstallOrder, exportParams);
  }
  /**
   * 历史安装工导出
   */
  finishedExport(exportParams: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(WorkOrderRequestUrl.exportHistoryInstallOrder, exportParams);
  }
  /**
   *  查询设备名称是否已经存在
   */
  checkEquipmentNameIsExist(body: { equipmentId: string, equipmentName: string }): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(WorkOrderRequestUrl.equipmentNameIsExist, body);
  }
  /**
   * 查询资产编码是否存在
   */
  checkEquipmentCodeIsExist(id: string, code: string): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(WorkOrderRequestUrl.equipmentCodeIsExist, { equipmentId: id, equipmentCode: code });
  }

  /**
   * 安装工单退单确认
   */
  confirmChargeback(id: string): Observable<ResultModel<string>> {
    return this.$http.get<ResultModel<string>>(`${WorkOrderRequestUrl.confirmChargeback}/${id}`);
  }

  /**
   * 安装工单指派
   */
  installOrderAssign(body: AssignDepartmentModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(WorkOrderRequestUrl.assignInstallOrder, body);
  }

  /**
   * 安装工单撤回
   */
  installOrderBack(id: string): Observable<ResultModel<string>> {
    return this.$http.get<ResultModel<string>>(`${WorkOrderRequestUrl.backInstallOrder}/${id}`);
  }

  /**
   * 安装工单转派
   */
  installOrderTurn(body: TransferOrderParamModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(WorkOrderRequestUrl.turnInstallOrder, body);
  }
  /**
   * 获取转派用户
   */
  queryTurnUser(id: string): Observable<ResultModel<RoleUnitModel[]>> {
    return this.$http.get<ResultModel<RoleUnitModel[]>>(`${WorkOrderRequestUrl.queryTurnUser}/${id}`);
  }

  /**
   * 安装工单重新生成
   */
  regenerateOrder(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(WorkOrderRequestUrl.regenerateInstallOrder, body);
  }

  /**
   * 增加设备
   */
  creatEquipment(body: OrderEquipmentModel): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(WorkOrderRequestUrl.addEquipment, body);
  }
  /**
   * 修改设备
   */
  editEquipment(body: OrderEquipmentModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(WorkOrderRequestUrl.updateEquipment, body);
  }

  /**
   * 查询设备列表
   */
  queryEquipList(body: QueryConditionModel): Observable<ResultModel<EquipmentListModel[]>> {
    return this.$http.post<ResultModel<EquipmentListModel[]>>(WorkOrderRequestUrl.queryEquipList, body);
  }

}
