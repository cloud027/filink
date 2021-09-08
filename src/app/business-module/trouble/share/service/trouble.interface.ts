import {Observable} from 'rxjs';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {TroubleModel} from '../../../../core-module/model/trouble/trouble.model';
import {QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {TroubleDisplayTypeModel} from '../model/trouble-display-type.model';
import {TroubleAddFormModel} from '../model/trouble-add-form.model';
import {RemarkFormModel} from '../model/remark-form.model';
import {NzTreeNode} from 'ng-zorro-antd';
import {DepartModel} from '../model/depart.model';
import {AssignFormModel} from '../model/assign-form.model';
import {DetailPicModel} from '../../../../core-module/model/detail-pic.model';
import {TroublePicInfoModel} from '../model/trouble-pic-info.model';
import {EquipmentModel} from '../../../../core-module/model/equipment.model';
import {FacilityListModel} from '../../../../core-module/model/facility/facility-list.model';
import {DeviceFormModel} from '../../../../core-module/model/work-order/device-form.model';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';

export interface TroubleInterface {
  // 故障列表
  queryTroubleList(body: QueryConditionModel): Observable<ResultModel<TroubleModel[]>>;
  // 故障卡片
  queryTroubleLevel(id: number): Observable<ResultModel<TroubleDisplayTypeModel[]>>;
  // 新增故障
  addTrouble(body: TroubleAddFormModel): Observable<ResultModel<string>>;
  // 删除故障
  deleteTrouble(body: string[]): Observable<ResultModel<string>>;
  // 故障备注
  troubleRemark(body: RemarkFormModel): Observable<ResultModel<string>>;
  // 故障编辑
  updateTrouble(body: TroubleAddFormModel): Observable<ResultModel<string>>;
  // 查看故障流程
  queryTroubleProcess(id: string): Observable<ResultModel<TroubleModel>>;
  // 查看故障历史流程
  queryTroubleProcessHistory(id: string): Observable<ResultModel<TroubleModel[]>>;
  // 查看故障历史流程带分页分页
  queryTroubleProcesslistHistoryPage(body: QueryConditionModel): Observable<ResultModel<TroubleModel[]>>;
  // 获取当前单位的上级单位
  getSuperiorDepartment(body): Observable<ResultModel<NzTreeNode[]>>;
  // 获取部门id查询责任人
  queryDepartName(id: string): Observable< ResultModel<DepartModel>>;
  // 获取流程图
  getFlowChart(id): Observable<Blob | ResultModel<string>>;
  // 故障指派
  troubleAssign(body: AssignFormModel): Observable<ResultModel<string>>;
  // 批量故障指派
  troubleAssigns(body: AssignFormModel): Observable<ResultModel<string>>;
  // 故障设施
  queryDevice(body: QueryConditionModel): Observable<ResultModel<FacilityListModel[]>>;
  // 故障设备
  queryEquipment(body: QueryConditionModel): Observable<ResultModel<EquipmentModel[]>>;
  // 获取单位下所有的人
  queryPerson(body: string[]): Observable<ResultModel<NzTreeNode[]>>;
  // 查询详情里的图片
  queryTroublePic(body: DetailPicModel): Observable<ResultModel<TroublePicInfoModel[]>>;
  // 查询设施信息
  queryFacilityInfo(body: {deviceId: string}): Observable<ResultModel<DeviceFormModel[]>>;
  // 导出列表
  exportTroubleList(body: ExportRequestModel): Observable<ResultModel<string>>;
}
