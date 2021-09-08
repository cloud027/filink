/**
 * 巡检工单
 */
import {Observable} from 'rxjs';
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
export interface InspectionWorkOrderApiInterface {
  /**
   * 获取当前单位下的责任人
   */
  getDepartUserList(): Observable<ResultModel<OrderUserModel[]>>;
  /**
   * 巡检模板列表
   */
  queryInspectionTemplateList(body: QueryConditionModel): Observable<ResultModel<InspectionTemplateModel[]>>;
  /**
   * 巡检项数量
   */
  getInspectionTotal(id: string): Observable<ResultModel<InspectionTemplateConfigModel>>;

  /**
   * 新增巡检模板
   */
  addInspectionTemplate(body: SelectTemplateModel): Observable<ResultModel<string>>;

  /**
   * 查询单个模板
   */
  getTemplateInfo(id: string): Observable<ResultModel<InspectionTemplateModel>>;

  /**
   * 编辑模板
   */
  updateTemplate(body: SelectTemplateModel): Observable<ResultModel<string>>;

  /**
   * 校验模板名称唯一性
   */
  checkTemplateName(name: string, id: string): Observable<ResultModel<string>>;

  /**
   * 删除模板
   */
  deleteTemplate(body: {inspectionTemplateIdList: string[]}): Observable<ResultModel<string>>;

  /**
   * 选择巡检模板
   */
  selectTemplate(body: WorkOrderEmptyModel): Observable<ResultModel<SelectTemplateModel[]>>;

  /**
   * 导出巡检模板
   */
  exportInspectTemplate(body: ExportRequestModel): Observable<ResultModel<string>>;

  /**
   * 新增巡检任务列表
   * param body
   */
  getWorkOrderList(body: QueryConditionModel): Observable<ResultModel<InspectionTaskModel[]>>;

  /**
   * 新增巡检任务路径
   * param body
   */
  insertWorkOrder(body: InspectionWorkOrderDetailModel): Observable<ResultModel<string>>;

  /**
   * 删除巡检任务
   * param body
   */
  deleteWorkOrderByIds(body: DeleteInspectionTaskModel): Observable<ResultModel<string>>;

  /**
   * 编辑巡检任务
   * param body
   */
  updateInspectionTask(body: InspectionWorkOrderDetailModel): Observable<ResultModel<string>>;

  /**
   * 查询巡检任务接口
   * param body
   */
  inquireInspectionTask(id: string): Observable<ResultModel<InspectionTaskModel>>;

  /**
   * 启用巡检任务
   * param body
   */
  enableInspectionTask(body: {inspectionTaskIds: string[]}): Observable<Object>;

  /**
   * 禁用巡检任务
   * param body
   */
  disableInspectionTask(body: {inspectionTaskIds: string[]}): Observable<Object>;

  /**
   * 巡检任务导出
   * param body
   */
  exportInspectionTask(body: ExportRequestModel): Observable<ResultModel<string>>;

  /**
   * 检验名称是否存在
   * param name
   * param id
   * returns {Observable<Object>}
   */
  checkName(name: string, id: string): Observable<ResultModel<string>>;

  /**
   * 获取未完成巡检工单列表
   * param body
   */
  getUnfinishedList(body: QueryConditionModel): Observable<ResultModel<InspectionWorkOrderModel[]>>;

  /**
   * 新增巡检工单
   * param body
   */
  addWorkUnfinished(body: InspectionWorkOrderDetailModel): Observable<ResultModel<string>>;

  /**
   * 编辑巡检工单
   * param body
   */
  updateWorkUnfinished(body: InspectionWorkOrderDetailModel): Observable<ResultModel<string>>;

  /**
   * 编辑巡检工单后台返回数据
   * param body
   */
  getUpdateWorkUnfinished(id: string): Observable<ResultModel<InspectionWorkOrderDetailModel>>;

  /**
   * 删除未完成巡检工单
   * param body
   */
  deleteUnfinishedOrderByIds(body: AreaDeviceParamModel): Observable<ResultModel<string>>;

  /**
   * 已完成巡检信息列表
   * param body
   */
  getUnfinishedCompleteList(body: QueryConditionModel): Observable<ResultModel<InspectionTaskModel[]>>;

  /**
   * 巡检完工记录列表
   * param body
   */
  getFinishedList(queryCondition: QueryConditionModel): Observable<ResultModel<InspectionWorkOrderModel[]>>;

  /**
   * 退单确认
   */
  singleBackToConfirm(id: string): Observable<ResultModel<string>>;

  /**
   * 指派
   */
  assignedUnfinished(body: AssignDepartmentModel): Observable<ResultModel<string>>;

  /**
   * 重新生成
   */
  inspectionRegenerate(body: InspectionWorkOrderDetailModel): Observable<ResultModel<string>>;

  /**
   * 未完工工单撤回
   */
  unfinishedWorkOrderWithdrawal(body: ClearBarrierWorkOrderModel): Observable<ResultModel<string>>;

  /**
   * 未完工导出
   */
  unfinishedExport(body: ExportRequestModel): Observable<ResultModel<string>>;

  /**
   * 完工记录导出接口
   */
  completionRecordExport(exportParams: ExportRequestModel): Observable<ResultModel<string>>;

  /**
   * 查询所有用户
   */
  queryAllUser(body: null): Observable<ResultModel<OrderUserModel[]>>;

  /**
   * 获取任务详情内工单列表
   */
  getDetailList(body: QueryConditionModel): Observable<ResultModel<InspectionTaskModel[]>>;

  /**
   * 已完工详情
   */
  getFinishedDetail(id: string): Observable<ResultModel<InspectionWorkOrderDetailModel>>;

  /**
   * checklist 查询设施
   */
  getDeviceList(body: InspectionReportParamModel): Observable<ResultModel<InspectionReportModel>>;

  /**
   * checklist 查询设备
   */
  getEquipmentList(body: InspectionReportParamModel): Observable<ResultModel<InspectionReportItemModel[]>>;

  /**
   * 未完工详情
   */
  getUnfinishedDetail(id: string): Observable<ResultModel<InspectionWorkOrderDetailModel>>;

  /**
   * 巡检任务详情
   */
  getInspectionDetail(id: string): Observable<ResultModel<InspectionWorkOrderDetailModel>>;

  /**
   * 巡检工单名称唯一性校验
   */
  checkInspectionOrderName(name: string, id: string): Observable<ResultModel<string>>;
  /**
   * 巡检任务详情设施列表
   */
  queryInspectionDeviceList(body: QueryConditionModel): Observable<ResultModel<InspectionReportItemModel[]>>;

  /**
   * 巡检任务工单设施/设备列表
   */
  getInspectionDeviceList(id: string): Observable<ResultModel<InspectionDeviceListModel>>;

  /**
   * 巡检对象详情设施列表
   */
  queryInspectionObjectList(inspectionObjectInfoModel: InspectionObjectInfoModel): Observable<ResultModel<InspectionObjectListModel>>;

  /**
   *  巡检今日新增
   */
  inspectTodayAdd(body: WorkOrderEmptyModel): Observable<ResultModel<number>>;

  /**
   *  巡检卡片状态统计
   */
  inspectCardStatistic(body: WorkOrderEmptyModel): Observable<ResultModel<RepairOrderStatusCountModel[]>>;

  /**
   * 巡检工单设施类型统计
   */
  inspectDeviceTypes(body: WorkOrderEmptyModel): Observable<ResultModel<WorkOrderStatisticalModel[]>>;

  /**
   * 巡检工单状态百分比
   */
  inspectStatusStatistic(body: WorkOrderEmptyModel): Observable<ResultModel<WorkOrderStatisticalModel[]>>;

  /**
   * 巡检工单获取转派用户
   */
  getInspectUser(body: TransferOrderParamModel): Observable<ResultModel<RoleUnitModel[]>>;

  /**
   * 巡检工单转派
   */
  transInspectOrder(body: TransferOrderParamModel): Observable<ResultModel<string>>;

  /**
   * 任务数据校验
   */
  checkTaskData(body: DeviceFormModel): Observable<ResultModel<string>>;

}
