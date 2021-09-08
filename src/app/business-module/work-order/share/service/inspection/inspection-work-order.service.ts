import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/index';
import {Injectable} from '@angular/core';
import {InspectionWorkOrderApiInterface} from './inspection-work-order-api.interface';
import {WorkOrderRequestUrl} from '../work-order-request-url.const';
import {SelectTemplateModel} from '../../model/template/select-template.model';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {InspectionTemplateModel} from '../../model/template/inspection-template.model';
import {QueryConditionModel} from '../../../../../shared-module/model/query-condition.model';
import {InspectionTaskModel} from '../../model/inspection-model/inspection-task.model';
import {DeleteInspectionTaskModel} from '../../model/inspection-model/delete-inspection-task.model';
import {InspectionWorkOrderDetailModel} from '../../model/inspection-model/inspection-work-order-detail.model';
import {AreaDeviceParamModel} from '../../../../../core-module/model/work-order/area-device-param.model';
import {InspectionWorkOrderModel} from '../../../../../core-module/model/work-order/inspection-work-order.model';
import {AssignDepartmentModel} from '../../model/assign-department.model';
import {OrderUserModel} from '../../../../../core-module/model/work-order/order-user.model';
import {InspectionReportParamModel} from '../../model/inspection-report-param.model';
import {InspectionReportModel} from '../../model/inspection-report.model';
import {InspectionObjectInfoModel} from '../../../../../core-module/model/work-order/inspection-object-info.model';
import {InspectionObjectListModel} from '../../../../../core-module/model/work-order/inspection-object-list.model';
import {TransferOrderParamModel} from '../../model/clear-barrier-model/transfer-order-param.model';
import {ExportRequestModel} from '../../../../../shared-module/model/export-request.model';
import {RoleUnitModel} from '../../../../../core-module/model/work-order/role-unit.model';
import {WorkOrderStatisticalModel} from '../../model/clear-barrier-model/work-order-statistical.model';
import {RepairOrderStatusCountModel} from '../../model/clear-barrier-model/repair-order-status-count.model';
import {InspectionDeviceListModel} from '../../model/inspection-model/inspection-device-list.model';
import {InspectionTemplateConfigModel} from '../../model/template/inspection-template-config.model';
import {WorkOrderEmptyModel} from '../../model/work-order-empty.model';
import {ClearBarrierWorkOrderModel} from '../../../../../core-module/model/work-order/clear-barrier-work-order.model';
import {DeviceFormModel} from '../../../../../core-module/model/work-order/device-form.model';
import {InspectionReportItemModel} from '../../model/inspection-model/inspection-report-item.model';

@Injectable()
export class InspectionWorkOrderService implements InspectionWorkOrderApiInterface {
  constructor(
    private $http: HttpClient
  ) {}
  // 获取当前单位下责任人
  getDepartUserList(): Observable<ResultModel<OrderUserModel[]>> {
    return this.$http.post<ResultModel<OrderUserModel[]>>(`${WorkOrderRequestUrl.getUserListDepart}`, {});
  }
  // 巡检模板列表
  queryInspectionTemplateList(body: QueryConditionModel): Observable<ResultModel<InspectionTemplateModel[]>> {
    return this.$http.post<ResultModel<InspectionTemplateModel[]>>(`${WorkOrderRequestUrl.getInspectTemplate}`, body);
  }
  // 巡检项数量
  getInspectionTotal(id: string): Observable<ResultModel<InspectionTemplateConfigModel>> {
    return this.$http.get<ResultModel<InspectionTemplateConfigModel>>(`${WorkOrderRequestUrl.getInspectTotal}/${id}`);
  }
  // 新增巡检模板
  addInspectionTemplate(body: SelectTemplateModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.addInspectTemplate}`, body);
  }
  // 查询单个模板
  getTemplateInfo(id: string): Observable<ResultModel<InspectionTemplateModel>> {
    return this.$http.get<ResultModel<InspectionTemplateModel>>(`${WorkOrderRequestUrl.getTemplateInfo}/${id}`);
  }
  // 编辑模板
  updateTemplate(body: SelectTemplateModel): Observable<ResultModel<string>> {
    return this.$http.put<ResultModel<string>>(`${WorkOrderRequestUrl.editInspectTemplate}`, body);
  }
  // 校验模板名称唯一性
  checkTemplateName(name: string, id: string): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.checkInspectTemplate}`, {templateName: name, templateId: id});
  }
  // 删除模板
  deleteTemplate(body: {inspectionTemplateIdList: string[]}): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.deleteInspectTemplate}`, body);
  }
  // 选择巡检模板
  selectTemplate(body: WorkOrderEmptyModel): Observable<ResultModel<SelectTemplateModel[]>> {
    return this.$http.post<ResultModel<SelectTemplateModel[]>>(`${WorkOrderRequestUrl.selectInspectTemplate}`, body);
  }
  // 导出巡检模板
  exportInspectTemplate(body: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.exportInspectionTemplate}`, body);
  }
  // 巡检任务列表
  getWorkOrderList(body: QueryConditionModel): Observable<ResultModel<InspectionTaskModel[]>> {
    return this.$http.post<ResultModel<InspectionTaskModel[]>>(`${WorkOrderRequestUrl.getInspectionWorkOrderListAll}`, body);
  }

  // 新增巡检任务路径
  insertWorkOrder(body: InspectionWorkOrderDetailModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.addInspectionWorkOrder}`, body);
  }

  // 删除巡检任务
  deleteWorkOrderByIds(body: DeleteInspectionTaskModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.deleteInspectionWorkOrder}`, body);
  }

  // 编辑巡检任务
  updateInspectionTask(body: InspectionWorkOrderDetailModel): Observable<ResultModel<string>> {
    return this.$http.put<ResultModel<string>>(`${WorkOrderRequestUrl.updateInspectionWorkOrder}`, body);
  }

  // 查询巡检任务接口
  inquireInspectionTask(id: string): Observable<ResultModel<InspectionTaskModel>> {
    return this.$http.get<ResultModel<InspectionTaskModel>>(`${WorkOrderRequestUrl.inquireInspectionWorkOrder}/${id}`);
  }

  // 启用巡检任务
  enableInspectionTask(body: {inspectionTaskIds: string[]}): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.enableInspectionTasks}`, body);
  }

  // 禁用巡检任务
  disableInspectionTask(body: {inspectionTaskIds: string[]}): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.disableInspectionTasks}`, body);
  }

  // 巡检任务名称校验
  checkName(name: string, id: string): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.queryInspectionTaskIsExists}`,
      {inspectionTaskName: name, inspectionTaskId: id});
  }

  // 巡检任务导出
  exportInspectionTask(body: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.exportInspectionTask}`, body);
  }

  // 未完工巡检工单列表
  getUnfinishedList(body: QueryConditionModel): Observable<ResultModel<InspectionWorkOrderModel[]>> {
    return this.$http.post<ResultModel<InspectionWorkOrderModel[]>>(`${WorkOrderRequestUrl.getInspectionWorkUnfinishedListAll}`, body);
  }

  // 新增巡检工单
  addWorkUnfinished(body: InspectionWorkOrderDetailModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.addInspectionWorkUnfinished}`, body);
  }

  // 编辑巡检工单
  updateWorkUnfinished(body: InspectionWorkOrderDetailModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.updateInspectionWorkUnfinished}`, body);
  }

  // 编辑巡检工单后台返回数据
  getUpdateWorkUnfinished(id: string): Observable<ResultModel<InspectionWorkOrderDetailModel>> {
    return this.$http.get<ResultModel<InspectionWorkOrderDetailModel>>(`${WorkOrderRequestUrl.getUpdateInspectionWorkUnfinishedList}/${id}`);
  }

  // 删除未完成巡检工单
  deleteUnfinishedOrderByIds(body: AreaDeviceParamModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.deleteInspectionWorkUnfinished}`, body);
  }

  // 已完成巡检信息列表
  getUnfinishedCompleteList(body: QueryConditionModel): Observable<ResultModel<InspectionTaskModel[]>> {
    return this.$http.post<ResultModel<InspectionTaskModel[]>>(`${WorkOrderRequestUrl.getInspectionCompleteUnfinishedList}`, body);
  }

  // 巡检完工记录列表
  getFinishedList(queryCondition: QueryConditionModel): Observable<ResultModel<InspectionWorkOrderModel[]>> {
    return this.$http.post<ResultModel<InspectionWorkOrderModel[]>>(`${WorkOrderRequestUrl.getInspectionWorkFinishedListAll}`, queryCondition);
  }

  // 退单确认
  singleBackToConfirm(id: string): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.singleBackToConfirmUnfinished}`, {procId: id});
  }

  // 指派
  assignedUnfinished(body: AssignDepartmentModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.assignedUnfinished}`, body);
  }

  // 重新生成
  inspectionRegenerate(body: InspectionWorkOrderDetailModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.inspectionWorkUnfinishedRegenerate}`, body);
  }

  // 未完工工单撤回
  unfinishedWorkOrderWithdrawal(body: ClearBarrierWorkOrderModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.unfinishedWorkOrderWithdrawal}`, body);
  }

  // 未完工导出
  unfinishedExport(body: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.unfinishedExport}`, body);
  }

  // 完工记录导出接口
  completionRecordExport(exportParams: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.completionRecordExport}`, exportParams);
  }

  // 查询所有用户
  queryAllUser(body: null): Observable<ResultModel<OrderUserModel[]>> {
    return this.$http.post<ResultModel<OrderUserModel[]>>(`${WorkOrderRequestUrl.queryAllUserInfo}`, body);
  }
  // 获取任务详情内工单列表
  getDetailList(body: QueryConditionModel): Observable<ResultModel<InspectionTaskModel[]>> {
    return this.$http.post<ResultModel<InspectionTaskModel[]>>(`${WorkOrderRequestUrl.getTableList}`, body);
  }
  // 已完工详情
  getFinishedDetail(id: string): Observable<ResultModel<InspectionWorkOrderDetailModel>> {
    return this.$http.get<ResultModel<InspectionWorkOrderDetailModel>>(`${WorkOrderRequestUrl.getFinishedDetail}/${id}`);
  }
  // checklist 查询设施
  getDeviceList(device: InspectionReportParamModel): Observable<ResultModel<InspectionReportModel>> {
    return this.$http.post<ResultModel<InspectionReportModel>>(`${WorkOrderRequestUrl.queryDeviceList}`, device);
  }
  // checklist 查询设备
  getEquipmentList(body: InspectionReportParamModel): Observable<ResultModel<InspectionReportItemModel[]>> {
    return this.$http.post<ResultModel<InspectionReportItemModel[]>>(`${WorkOrderRequestUrl.queryEquipmentList}`, body);
  }
  // 未完工详情
  getUnfinishedDetail(id: string): Observable<ResultModel<InspectionWorkOrderDetailModel>> {
    return this.$http.get<ResultModel<InspectionWorkOrderDetailModel>>(`${WorkOrderRequestUrl.getUnfinishedDetail}/${id}`);
  }
  // 巡检任务详情
  getInspectionDetail(id: string): Observable<ResultModel<InspectionWorkOrderDetailModel>> {
    return this.$http.get<ResultModel<InspectionWorkOrderDetailModel>>(`${WorkOrderRequestUrl.getInspectDetailDetail}/${id}`);
  }
  // 巡检工单名称唯一性校验
  checkInspectionOrderName(name: string, id: string): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.checkInspectionOrderName}`, {title: name, procId: id});
  }
  // 巡检任务详情设施列表
  queryInspectionDeviceList(body: QueryConditionModel): Observable<ResultModel<InspectionReportItemModel[]>> {
    return this.$http.post<ResultModel<InspectionReportItemModel[]>>(`${WorkOrderRequestUrl.inspectionDeviceList}`, body);
  }
  // 巡检任务工单设施/设备列表
  getInspectionDeviceList(id: string): Observable<ResultModel<InspectionDeviceListModel>> {
    return this.$http.get<ResultModel<InspectionDeviceListModel>>(`${WorkOrderRequestUrl.inspectionDeviceObjectList}/${id}`);
  }
  // 巡检对象详情设施列表
  queryInspectionObjectList(inspectionObjectInfoModel: InspectionObjectInfoModel): Observable<ResultModel<InspectionObjectListModel>> {
    return this.$http.post<ResultModel<InspectionObjectListModel>>(`${WorkOrderRequestUrl.inspectionObjectInfo}`, inspectionObjectInfoModel);
  }
  // 巡检今日新增
  inspectTodayAdd(body: WorkOrderEmptyModel): Observable<ResultModel<number>> {
    return this.$http.post<ResultModel<number>>(`${WorkOrderRequestUrl.inspectToday}`, body);
  }
  // 巡检卡片状态统计
  inspectCardStatistic(body: WorkOrderEmptyModel): Observable<ResultModel<RepairOrderStatusCountModel[]>> {
    return this.$http.post<ResultModel<RepairOrderStatusCountModel[]>>(`${WorkOrderRequestUrl.inspectStatusTotal}`, body);
  }
  // 巡检工单设施类型统计
  inspectDeviceTypes(body: WorkOrderEmptyModel): Observable<ResultModel<WorkOrderStatisticalModel[]>> {
    return this.$http.post<ResultModel<WorkOrderStatisticalModel[]>>(`${WorkOrderRequestUrl.inspectDeviceType}`, body);
  }
  // 巡检工单状态百分比
  inspectStatusStatistic(body: WorkOrderEmptyModel): Observable<ResultModel<WorkOrderStatisticalModel[]>> {
    return this.$http.post<ResultModel<WorkOrderStatisticalModel[]>>(`${WorkOrderRequestUrl.inspectStatusStatistics}`, body);
  }
  // 巡检工单获取转派用户
  getInspectUser(body: TransferOrderParamModel): Observable<ResultModel<RoleUnitModel[]>> {
    return this.$http.post<ResultModel<RoleUnitModel[]>>(`${WorkOrderRequestUrl.getInspectUserList}`, body);
  }
  // 巡检工单转派
  transInspectOrder(body: TransferOrderParamModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.getInspectTrans}`, body);
  }
  // 任务数据校验
  checkTaskData(body: DeviceFormModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.checkTaskDataRoles}`, body);
  }

}
